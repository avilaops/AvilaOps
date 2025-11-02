'use client';

import { useEffect } from 'react';
import { initTelemetry } from '@/lib/telemetry';

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Inicializar Application Insights
        initTelemetry();
    }, []);

    return <>{children}</>;
}
