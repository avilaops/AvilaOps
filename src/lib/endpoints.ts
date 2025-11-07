/**
 * Centralized Logic Apps endpoints configuration
 * Each URL points to the HTTP trigger of a Logic App workflow
 */

export const LOGIC_APPS = {
  pedidos: process.env.LOGICAPP_PEDIDOS_URL || '',
  leads: process.env.LOGICAPP_LEADS_URL || '',
  faturamento: process.env.LOGICAPP_FATURAMENTO_URL || '',
  relatorios: process.env.LOGICAPP_RELATORIOS_URL || '',
  campanhas: process.env.LOGICAPP_CAMPANHAS_URL || ''
} as const;

export type LogicAppEndpoint = keyof typeof LOGIC_APPS;

/**
 * Validates if a Logic App endpoint is configured
 */
export function isEndpointConfigured(endpoint: LogicAppEndpoint): boolean {
  return Boolean(LOGIC_APPS[endpoint]);
}

/**
 * Gets a Logic App URL with runtime validation
 */
export function getLogicAppUrl(endpoint: LogicAppEndpoint): string {
  return LOGIC_APPS[endpoint];
}
