import type { NextRequest } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT = 20; // requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute window

// In-memory storage for rate limiting
// In production, use Redis/Upstash for distributed rate limiting
const requests = new Map<string, { count: number; resetAt: number }>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of requests.entries()) {
        if (value.resetAt < now) {
            requests.delete(key);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt?: number;
}

export function checkRateLimit(req: NextRequest): RateLimitResult {
    // Get client identifier (IP address)
    const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0] ||
        req.headers.get('x-real-ip') ||
        'unknown';

    const now = Date.now();
    const record = requests.get(ip);

    // No record or expired window - create new
    if (!record || record.resetAt < now) {
        const resetAt = now + WINDOW_MS;
        requests.set(ip, { count: 1, resetAt });
        return { allowed: true, remaining: RATE_LIMIT - 1, resetAt };
    }

    // Rate limit exceeded
    if (record.count >= RATE_LIMIT) {
        return { allowed: false, remaining: 0, resetAt: record.resetAt };
    }

    // Increment counter
    record.count++;
    return {
        allowed: true,
        remaining: RATE_LIMIT - record.count,
        resetAt: record.resetAt,
    };
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    return {
        'X-RateLimit-Limit': RATE_LIMIT.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.resetAt
            ? new Date(result.resetAt).toISOString()
            : '',
    };
}
