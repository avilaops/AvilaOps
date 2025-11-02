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
export function validateChatRequest(body: any): ValidationResult {
    // Verificar se body existe
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Invalid request body' };
    }

    // Validar message
    if (!body.message || typeof body.message !== 'string') {
        return { valid: false, error: 'Message is required and must be a string' };
    }

    if (body.message.length > MAX_MESSAGE_LENGTH) {
        return {
            valid: false,
            error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`
        };
    }

    // Sanitizar message: remover caracteres de controle, preservar Unicode
    const sanitizedMessage = body.message
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars (exceto \n, \r, \t)
        .trim();

    if (!sanitizedMessage) {
        return { valid: false, error: 'Message cannot be empty after sanitization' };
    }

    // Validar userId
    if (!body.userId || typeof body.userId !== 'string') {
        return { valid: false, error: 'UserId is required and must be a string' };
    }

    if (body.userId.length > MAX_USER_ID_LENGTH) {
        return {
            valid: false,
            error: `UserId too long (max ${MAX_USER_ID_LENGTH} characters)`
        };
    }

    const sanitizedUserId = body.userId.trim();
    if (!sanitizedUserId) {
        return { valid: false, error: 'UserId cannot be empty' };
    }

    // Validar conversationId (opcional)
    let sanitizedConversationId = body.conversationId || 'default';
    if (typeof sanitizedConversationId !== 'string') {
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
    const language = body.language || 'pt';
    if (typeof language !== 'string' || !VALID_LANGUAGES.includes(language as any)) {
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
