import { ApplicationInsights } from '@microsoft/applicationinsights-web';

let appInsights: ApplicationInsights | null = null;

export function initTelemetry(): void {
    if (typeof window === 'undefined') {
        console.debug('[Telemetry] Skipping initialization - running on server');
        return;
    }

    const connectionString = process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING;
    if (!connectionString || connectionString.includes('xxxxxxxx')) {
        console.debug('[Telemetry] Application Insights not configured');
        return;
    }

    try {
        appInsights = new ApplicationInsights({
            config: {
                connectionString,
                enableAutoRouteTracking: true,
                enableCorsCorrelation: true,
                enableRequestHeaderTracking: true,
                enableResponseHeaderTracking: true,
                disableFetchTracking: false,
                disableAjaxTracking: false,
            }
        });
        appInsights.loadAppInsights();
        appInsights.trackPageView();
        console.info('[Telemetry] Application Insights initialized successfully');
    } catch (error) {
        console.error('[Telemetry] Failed to initialize Application Insights:', error);
    }
}

export function trackEvent(name: string, properties?: Record<string, unknown>): void {
    if (!appInsights) {
        console.debug(`[Telemetry] Event not tracked - ${name}`);
        return;
    }
    try {
        appInsights.trackEvent({ name, properties });
    } catch (error) {
        console.error(`[Telemetry] Failed to track event ${name}:`, error);
    }
}

export function trackException(error: Error, properties?: Record<string, unknown>): void {
    if (!appInsights) {
        console.debug('[Telemetry] Exception not tracked:', error.message);
        return;
    }
    try {
        appInsights.trackException({ exception: error, properties });
    } catch (trackError) {
        console.error('[Telemetry] Failed to track exception:', trackError);
    }
}

export function trackMetric(name: string, value: number, properties?: Record<string, unknown>): void {
    if (!appInsights) {
        console.debug(`[Telemetry] Metric not tracked - ${name}: ${value}`);
        return;
    }
    try {
        appInsights.trackMetric({ name, average: value }, properties);
    } catch (error) {
        console.error(`[Telemetry] Failed to track metric ${name}:`, error);
    }
}
