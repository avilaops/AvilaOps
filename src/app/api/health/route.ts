import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

interface HealthCheck {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    checks: {
        api: 'ok' | 'error';
        database: 'ok' | 'error' | 'not_configured';
        openai: 'ok' | 'error' | 'not_configured';
    };
    version?: string;
}

export async function GET() {
    const checks: HealthCheck['checks'] = {
        api: 'ok',
        database: 'not_configured',
        openai: 'not_configured',
    };

    // Check MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
        try {
            const client = new MongoClient(mongoUri, {
                serverSelectionTimeoutMS: 5000, // 5 segundos timeout
            });
            await client.connect();
            await client.db('avilaops').command({ ping: 1 });
            await client.close();
            checks.database = 'ok';
        } catch (error) {
            console.error('Health check - MongoDB error:', error);
            checks.database = 'error';
        }
    }

    // Check Azure OpenAI configuration
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;

    if (endpoint && apiKey) {
        try {
            // Apenas verifica se as variáveis existem (não faz chamada real para economizar custos)
            const isValidEndpoint = endpoint.startsWith('https://') && endpoint.includes('openai.azure.com');
            checks.openai = isValidEndpoint ? 'ok' : 'error';
        } catch (error) {
            console.error('Health check - OpenAI config error:', error);
            checks.openai = 'error';
        }
    }

    // Determinar status geral
    let status: HealthCheck['status'] = 'healthy';

    if (checks.database === 'error' || checks.openai === 'error') {
        status = 'degraded';
    }

    if (checks.api === 'error') {
        status = 'unhealthy';
    }

    const healthCheck: HealthCheck = {
        status,
        timestamp: new Date().toISOString(),
        checks,
        version: process.env.npm_package_version || '0.1.0',
    };

    // Status HTTP baseado na saúde
    let httpStatus = 200;
    if (status === 'degraded') {
        httpStatus = 207;
    } else if (status === 'unhealthy') {
        httpStatus = 503;
    }

    return NextResponse.json(healthCheck, {
        status: httpStatus,
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
    });
}
