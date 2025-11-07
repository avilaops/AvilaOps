import ModelClient from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

/**
 * Azure OpenAI client configuration
 * Uses @azure-rest/ai-inference for better type safety
 */

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_OPENAI_KEY;
const modelName = process.env.AZURE_OPENAI_MODEL || process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-35-turbo';

if (!endpoint || !apiKey) {
  console.warn('Azure OpenAI not configured. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY');
}

/**
 * Azure AI Inference client instance
 */
export const azureClient = endpoint && apiKey 
  ? ModelClient(endpoint, new AzureKeyCredential(apiKey))
  : null;

/**
 * Get current model name
 */
export const getModelName = () => modelName;

/**
 * Check if Azure OpenAI is configured
 */
export const isConfigured = () => Boolean(endpoint && apiKey);
