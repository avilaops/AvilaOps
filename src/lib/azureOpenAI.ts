import OpenAI from 'openai';

/**
 * OpenAI client configuration
 */

const apiKey = process.env.OPENAI_API_KEY;
const modelName = process.env.OPENAI_MODEL || 'gpt-4o-mini';

if (!apiKey) {
    console.warn('[OpenAI] Configuration missing. Set OPENAI_API_KEY in environment variables.');
}

/**
 * OpenAI client instance
 */
export const openaiClient = apiKey
    ? new OpenAI({ apiKey })
    : null;

/**
 * Get current model name
 */
export const getModelName = () => modelName;

/**
 * Check if OpenAI is configured
 */
export const isConfigured = () => Boolean(apiKey);
