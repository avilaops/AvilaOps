import { ApplicationInsights } from '@microsoft/applicationinsights-web';

let appInsights: ApplicationInsights | null = null;

export function initTelemetry() {
    if (typeof window === 'undefined') return;

    const connectionString = process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING;
    if (!connectionString || connectionString.includes('xxxxxxxx')) return;

    try {
        appInsights = new ApplicationInsights({
            config: {
                connectionString,
                enableAutoRouteTracking: true,
                enableCorsCorrelation: true,
                enableRequestHeaderTracking: true,
                enableResponseHeaderTracking: true,
            }
        });
        appInsights.loadAppInsights();
        appInsights.trackPageView();
    } catch (error) {
        console.error('Failed to initialize Application Insights:', error);
    }
}

export function trackEvent(name: string, properties?: Record<string, unknown>) {
    try {
        appInsights?.trackEvent({ name, properties });
    } catch (error) {
        console.error('Failed to track event:', error);
    }
}

export function trackException(error: Error, properties?: Record<string, unknown>) {
    try {
        appInsights?.trackException({ exception: error, properties });
    } catch (error) {
        console.error('Failed to track exception:', error);
    }
}

export function trackMetric(name: string, value: number, properties?: Record<string, unknown>) {
    try {
        appInsights?.trackMetric({ name, average: value }, properties);
    } catch (error) {
        console.error('Failed to track metric:', error);
    }
}
