import type { NextRequest } from 'next/server';
import { MongoClient } from 'mongodb';
import { openaiClient, getModelName } from '@/lib/azureOpenAI';
import { checkRateLimit } from '../middleware/rateLimit';
import { validateChatRequest } from '../middleware/validation';

// OpenAI configuration
const modelName = getModelName();

// MongoDB configuration (MongoDB Atlas)
const mongoUri = process.env.MONGODB_URI;
const databaseName = 'avilaops';
const collectionName = 'conversations';

// In-memory fallback (quando MongoDB não está configurado)
const memoryStore = new Map<string, Message[]>();

// System prompts by language
const SYSTEM_PROMPTS: Record<string, string> = {
    pt: `Você é o assistente AI da AvilaOps, especialista em DevOps, Cloud Architecture e Observability.

CONTEXTO: A AvilaOps transforma infraestruturas legadas em arquiteturas cloud-native modernas.

EXPERTISE: DevOps (CI/CD, GitOps, IaC), Cloud (multi-cloud), Observability, Security (DevSecOps), Automation (Terraform, Ansible, Kubernetes).

ESTILO: Técnico mas acessível, específico, máx 150 palavras. Foque em DevOps/Cloud/Automation.`,

    en: `You are AvilaOps AI assistant, expert in DevOps, Cloud Architecture, and Observability.

CONTEXT: AvilaOps transforms legacy infrastructures into modern cloud-native architectures.

EXPERTISE: DevOps (CI/CD, GitOps, IaC), Cloud (multi-cloud), Observability, Security (DevSecOps), Automation (Terraform, Ansible, Kubernetes).

STYLE: Technical but accessible, specific, max 150 words. Focus on DevOps/Cloud/Automation.`,

    es: `Eres el asistente de IA de AvilaOps, experto en DevOps, Arquitectura Cloud y Observabilidad.

CONTEXTO: AvilaOps transforma infraestructuras heredadas en arquitecturas cloud-native modernas.

EXPERTISE: DevOps (CI/CD, GitOps, IaC), Cloud (multi-cloud), Observabilidad, Seguridad (DevSecOps), Automatización (Terraform, Ansible, Kubernetes).

ESTILO: Técnico pero accesible, específico, máx 150 palabras. Enfócate en DevOps/Cloud/Automation.`,

    de: `Sie sind der KI-Assistent von AvilaOps, Experte für DevOps, Cloud-Architektur und Observability.

KONTEXT: AvilaOps transformiert Legacy-Infrastrukturen in moderne cloud-native Architekturen.

EXPERTISE: DevOps (CI/CD, GitOps, IaC), Cloud (Multi-Cloud), Observability, Sicherheit (DevSecOps), Automation (Terraform, Ansible, Kubernetes).

STIL: Technisch aber zugänglich, spezifisch, max 150 Wörter. Fokus auf DevOps/Cloud/Automation.`,

    ja: `あなたはAvilaOpsのAIアシスタントで、DevOps、クラウドアーキテクチャ、オブザーバビリティの専門家です。

コンテキスト：AvilaOpsはレガシーインフラを最新のクラウドネイティブアーキテクチャに変換します。

専門分野：DevOps（CI/CD、GitOps、IaC）、クラウド（マルチクラウド）、オブザーバビリティ、セキュリティ（DevSecOps）、自動化（Terraform、Ansible、Kubernetes）。

スタイル：技術的だがアクセスしやすい、具体的、最大150語。DevOps/Cloud/Automationに焦点を当てる。`,

    zh: `您是AvilaOps的AI助手，专精于DevOps、云架构和可观测性。

背景：AvilaOps将传统基础设施转换为现代云原生架构。

专长：DevOps（CI/CD、GitOps、IaC）、云（多云）、可观测性、安全（DevSecOps）、自动化（Terraform、Ansible、Kubernetes）。

风格：技术性但易懂，具体，最多150字。专注于DevOps/Cloud/Automation。`,

    ru: `Вы ИИ-ассистент AvilaOps, эксперт по DevOps, облачной архитектуре и наблюдаемости.

КОНТЕКСТ: AvilaOps преобразует устаревшие инфраструктуры в современные облачно-нативные архитектуры.

ЭКСПЕРТИЗА: DevOps (CI/CD, GitOps, IaC), Облако (мульти-облако), Наблюдаемость, Безопасность (DevSecOps), Автоматизация (Terraform, Ansible, Kubernetes).

СТИЛЬ: Технически, но доступно, конкретно, макс 150 слов. Фокус на DevOps/Cloud/Automation.`,
};

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface ChatAPIResponse {
    message: string;
    conversationId: string;
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
}

interface ChatAPIError {
    error: string;
    retryAfter?: number;
    message?: string;
    details?: string;
}

// ChatRequest interface moved to validation.ts

// Initialize clients lazily
let mongoClient: MongoClient | null = null;

async function getMongoClient() {
    if (!mongoClient && mongoUri) {
        mongoClient = new MongoClient(mongoUri);
        await mongoClient.connect();
    }
    return mongoClient;
}

async function getConversationHistory(
    userId: string,
    conversationId: string,
    limit = 10,
): Promise<Message[]> {
    // Fallback to in-memory if MongoDB not configured
    if (!mongoUri) {
        const key = `${userId}:${conversationId}`;
        const history = memoryStore.get(key) || [];
        return history.slice(-limit);
    }

    try {
        const client = await getMongoClient();
        if (!client) return [];

        const db = client.db(databaseName);
        const collection = db.collection(collectionName);

        const messages = await collection
            .find({ userId, conversationId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();

        // Convert to messages and reverse (oldest first)
        return messages
            .map((doc) => ({
                role: doc.role as 'system' | 'user' | 'assistant',
                content: doc.content,
            }))
            .reverse();
    } catch (error) {
        console.error('Error fetching conversation history:', error);
        // Fallback to in-memory
        const key = `${userId}:${conversationId}`;
        const history = memoryStore.get(key) || [];
        return history.slice(-limit);
    }
}

async function saveMessage(
    userId: string,
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
) {
    // Always save to in-memory first
    const key = `${userId}:${conversationId}`;
    const history = memoryStore.get(key) || [];
    history.push({ role, content });
    memoryStore.set(key, history.slice(-20)); // Keep last 20 messages

    // Try to save to MongoDB if configured
    if (!mongoUri) return;

    try {
        const client = await getMongoClient();
        if (!client) return;

        const db = client.db(databaseName);
        const collection = db.collection(collectionName);

        await collection.insertOne({
            userId,
            conversationId,
            role,
            content,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error('Error saving message to MongoDB:', error);
        // Non-blocking: don't fail the request if DB save fails
    }
}

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        // 1. Rate Limiting
        const rateLimit = checkRateLimit(request);
        if (!rateLimit.allowed) {
            const waitSeconds = Math.ceil((rateLimit.resetAt! - Date.now()) / 1000);
            return Response.json(
                {
                    error: 'Too many requests',
                    retryAfter: waitSeconds,
                    message: `Rate limit exceeded. Try again in ${waitSeconds} seconds.`
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': '20',
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': rateLimit.resetAt!.toString(),
                        'Retry-After': waitSeconds.toString(),
                    }
                }
            );
        }

        // 2. Validação e Sanitização de Input
        const body = await request.json();
        const validation = validateChatRequest(body);

        if (!validation.valid) {
            console.warn('[API] Validation failed:', validation.error);
            return Response.json({ error: validation.error }, { status: 400 });
        }

        const { message, userId, conversationId, language } = validation.sanitizedData!;

        // 3. Validar configuração do OpenAI
        if (!openaiClient) {
            console.error('[API] OpenAI not configured');
            return Response.json(
                { error: 'OpenAI not configured' },
                { status: 500 },
            );
        }

        // 4. Obter system prompt para o idioma selecionado
        const systemPrompt = SYSTEM_PROMPTS[language!] || SYSTEM_PROMPTS['pt'];

        console.log(`[API] Processing request - User: ${userId}, Lang: ${language}, ConvId: ${conversationId}`);

        // Get conversation history from MongoDB
        const history = await getConversationHistory(userId, conversationId!, 5);

        // Build messages array
        const messages: Message[] = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: message },
        ];

        // Call OpenAI
        const response = await openaiClient.chat.completions.create({
            model: modelName,
            messages,
            temperature: 0.7,
            top_p: 0.95,
            max_tokens: 500,
        });

        const assistantMessage = response.choices[0]?.message?.content || 'No response';

        // Save both messages to MongoDB (fire and forget)
        void saveMessage(userId, conversationId!, 'user', message);
        void saveMessage(userId, conversationId!, 'assistant', assistantMessage);

        // Log performance metrics
        const duration = Date.now() - startTime;
        console.log(`[API] Request completed in ${duration}ms - Tokens: ${response.usage?.total_tokens || 0}`);

        const successResponse: ChatAPIResponse = {
            message: assistantMessage,
            conversationId: conversationId!,
            usage: {
                prompt_tokens: response.usage?.prompt_tokens,
                completion_tokens: response.usage?.completion_tokens,
                total_tokens: response.usage?.total_tokens,
            },
        };

        return Response.json(successResponse, {
            headers: {
                'X-RateLimit-Remaining': rateLimit.remaining.toString(),
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.error('[API] Chat error:', error);
        const errorResponse: ChatAPIError = {
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
        };
        return Response.json(errorResponse, {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}
