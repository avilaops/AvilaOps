export interface ChatRequest {
    message: string;
    userId: string;
    conversationId?: string;
    language?: string;
}

export interface ValidationResult {
    valid: boolean;
    error?: string;
    sanitizedData?: ChatRequest;
}

const VALID_LANGUAGES = ['pt', 'en', 'es', 'de', 'ja', 'zh', 'ru'] as const;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_USER_ID_LENGTH = 128;
const MAX_CONVERSATION_ID_LENGTH = 128;

/**
 * Valida e sanitiza requisições do chat
 */
export function validateChatRequest(body: unknown): ValidationResult {
    // Verificar se body existe
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Invalid request body' };
    }

    const raw = body as Record<string, unknown>;

    // Validar message
    if (!('message' in raw) || typeof raw.message !== 'string') {
        return { valid: false, error: 'Message is required and must be a string' };
    }

    if (raw.message.length > MAX_MESSAGE_LENGTH) {
        return {
            valid: false,
            error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`
        };
    }

    // Sanitizar message: remover caracteres de controle, preservar Unicode
    const sanitizedMessage = raw.message
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars (exceto \n, \r, \t)
        .trim();

    if (!sanitizedMessage) {
        return { valid: false, error: 'Message cannot be empty after sanitization' };
    }

    // Validar userId
    if (!('userId' in raw) || typeof raw.userId !== 'string') {
        return { valid: false, error: 'UserId is required and must be a string' };
    }

    if (raw.userId.length > MAX_USER_ID_LENGTH) {
        return {
            valid: false,
            error: `UserId too long (max ${MAX_USER_ID_LENGTH} characters)`
        };
    }

    const sanitizedUserId = raw.userId.trim();
    if (!sanitizedUserId) {
        return { valid: false, error: 'UserId cannot be empty' };
    }

    // Validar conversationId (opcional)
    const conversationIdRaw = (raw as { conversationId?: unknown }).conversationId;
    let sanitizedConversationId = typeof conversationIdRaw === 'string' ? conversationIdRaw : 'default';
    if (typeof sanitizedConversationId !== 'string') { // narrow again for TS
        return { valid: false, error: 'ConversationId must be a string' };
    }

    if (sanitizedConversationId.length > MAX_CONVERSATION_ID_LENGTH) {
        return {
            valid: false,
            error: `ConversationId too long (max ${MAX_CONVERSATION_ID_LENGTH} characters)`
        };
    }

    sanitizedConversationId = sanitizedConversationId.trim() || 'default';

    // Validar language (opcional)
    const languageUnknown = (raw as { language?: unknown }).language;
    const language = (typeof languageUnknown === 'string' ? languageUnknown : 'pt');
    if (typeof language !== 'string' || !VALID_LANGUAGES.some(l => l === language)) {
        return {
            valid: false,
            error: `Invalid language. Valid options: ${VALID_LANGUAGES.join(', ')}`
        };
    }

    // Retornar dados validados e sanitizados
    return {
        valid: true,
        sanitizedData: {
            message: sanitizedMessage,
            userId: sanitizedUserId,
            conversationId: sanitizedConversationId,
            language,
        },
    };
}
