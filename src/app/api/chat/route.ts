import type { NextRequest } from 'next/server';
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';
import { MongoClient } from 'mongodb';
import { checkRateLimit } from '../middleware/rateLimit';
import { validateChatRequest } from '../middleware/validation';

// Azure AI Foundry configuration
const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
const apiKey = process.env.AZURE_OPENAI_API_KEY!;
const modelName = process.env.AZURE_OPENAI_MODEL || 'gpt-4.1-mini';

// MongoDB configuration (Azure Cosmos DB MongoDB API ou MongoDB Atlas)
const mongoUri = process.env.MONGODB_URI;
const databaseName = 'avilaops';
const collectionName = 'conversations';

// In-memory fallback (quando MongoDB não está configurado)
const memoryStore = new Map<string, Message[]>();

// System prompts by language
const SYSTEM_PROMPTS: Record<string, string> = {
    pt: `Você é o assistente AI da AvilaOps, especialista em DevOps, Cloud Architecture e Observability.

CONTEXTO: A AvilaOps transforma infraestruturas legadas em arquiteturas cloud-native modernas.

EXPERTISE: DevOps (CI/CD, GitOps, IaC), Cloud (Azure, multi-cloud), Observability, Security (DevSecOps), Automation (Terraform, Ansible, Bicep).

ESTILO: Técnico mas acessível, específico, máx 150 palavras. Foque em DevOps/Cloud/Azure.`,

    en: `You are AvilaOps AI assistant, expert in DevOps, Cloud Architecture, and Observability.

CONTEXT: AvilaOps transforms legacy infrastructures into modern cloud-native architectures.

EXPERTISE: DevOps (CI/CD, GitOps, IaC), Cloud (Azure, multi-cloud), Observability, Security (DevSecOps), Automation (Terraform, Ansible, Bicep).

STYLE: Technical but accessible, specific, max 150 words. Focus on DevOps/Cloud/Azure.`,

    es: `Eres el asistente de IA de AvilaOps, experto en DevOps, Arquitectura Cloud y Observabilidad.

CONTEXTO: AvilaOps transforma infraestructuras heredadas en arquitecturas cloud-native modernas.

EXPERTISE: DevOps (CI/CD, GitOps, IaC), Cloud (Azure, multi-cloud), Observabilidad, Seguridad (DevSecOps), Automatización (Terraform, Ansible, Bicep).

ESTILO: Técnico pero accesible, específico, máx 150 palabras. Enfócate en DevOps/Cloud/Azure.`,

    de: `Sie sind der KI-Assistent von AvilaOps, Experte für DevOps, Cloud-Architektur und Observability.

KONTEXT: AvilaOps transformiert Legacy-Infrastrukturen in moderne cloud-native Architekturen.

EXPERTISE: DevOps (CI/CD, GitOps, IaC), Cloud (Azure, Multi-Cloud), Observability, Sicherheit (DevSecOps), Automation (Terraform, Ansible, Bicep).

STIL: Technisch aber zugänglich, spezifisch, max 150 Wörter. Fokus auf DevOps/Cloud/Azure.`,

    ja: `あなたはAvilaOpsのAIアシスタントで、DevOps、クラウドアーキテクチャ、オブザーバビリティの専門家です。

コンテキスト：AvilaOpsはレガシーインフラを最新のクラウドネイティブアーキテクチャに変換します。

専門分野：DevOps（CI/CD、GitOps、IaC）、クラウド（Azure、マルチクラウド）、オブザーバビリティ、セキュリティ（DevSecOps）、自動化（Terraform、Ansible、Bicep）。

スタイル：技術的だがアクセスしやすい、具体的、最大150語。DevOps/Cloud/Azureに焦点を当てる。`,

    zh: `您是AvilaOps的AI助手，专精于DevOps、云架构和可观测性。

背景：AvilaOps将传统基础设施转换为现代云原生架构。

专长：DevOps（CI/CD、GitOps、IaC）、云（Azure、多云）、可观测性、安全（DevSecOps）、自动化（Terraform、Ansible、Bicep）。

风格：技术性但易懂，具体，最多150字。专注于DevOps/Cloud/Azure。`,

    ru: `Вы ИИ-ассистент AvilaOps, эксперт по DevOps, облачной архитектуре и наблюдаемости.

КОНТЕКСТ: AvilaOps преобразует устаревшие инфраструктуры в современные облачно-нативные архитектуры.

ЭКСПЕРТИЗА: DevOps (CI/CD, GitOps, IaC), Облако (Azure, мульти-облако), Наблюдаемость, Безопасность (DevSecOps), Автоматизация (Terraform, Ansible, Bicep).

СТИЛЬ: Технически, но доступно, конкретно, макс 150 слов. Фокус на DevOps/Cloud/Azure.`,
};

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

// ChatRequest interface moved to validation.ts

// Initialize clients lazily
let mongoClient: MongoClient | null = null;
let aiClient: ReturnType<typeof ModelClient>;

async function getMongoClient() {
    if (!mongoClient && mongoUri) {
        mongoClient = new MongoClient(mongoUri);
        await mongoClient.connect();
    }
    return mongoClient;
}

function getAIClient() {
    if (!aiClient) {
        aiClient = ModelClient(endpoint, new AzureKeyCredential(apiKey));
    }
    return aiClient;
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

        // 3. Validar configuração do Azure OpenAI
        if (!endpoint || !apiKey) {
            console.error('[API] Azure OpenAI not configured');
            return Response.json(
                { error: 'Azure OpenAI not configured' },
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

        // Call Azure OpenAI
        const client = getAIClient();
        const response = await client.path('/chat/completions').post({
            body: {
                messages,
                temperature: 0.7,
                top_p: 0.95,
                max_tokens: 500,
                model: modelName,
            },
        });

        if (isUnexpected(response)) {
            console.error('Azure OpenAI error:', response.body.error);
            return Response.json(
                {
                    error: 'Failed to get AI response',
                    details: response.body.error.message,
                },
                { status: 500 },
            );
        }

        const assistantMessage =
            response.body.choices[0].message.content || 'No response';

        // Save both messages to MongoDB (fire and forget)
        void saveMessage(userId, conversationId!, 'user', message);
        void saveMessage(userId, conversationId!, 'assistant', assistantMessage);

        // Log performance metrics
        const duration = Date.now() - startTime;
        console.log(`[API] Request completed in ${duration}ms - Tokens: ${response.body.usage?.total_tokens || 0}`);

        return Response.json({
            message: assistantMessage,
            conversationId,
            usage: response.body.usage,
        }, {
            headers: {
                'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            }
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return Response.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
