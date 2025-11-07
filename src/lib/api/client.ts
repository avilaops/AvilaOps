import { trackEvent, trackException } from '../telemetry';

export interface ApiClientOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
  ok: boolean;
}

const DEFAULT_OPTIONS: Required<ApiClientOptions> = {
  timeout: 30000, // 30s
  retries: 3,
  retryDelay: 1000, // 1s
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Robust API client with retry, timeout, and telemetry
 */
export class ApiClient {
  private options: Required<ApiClientOptions>;

  constructor(options: ApiClientOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Exponential backoff delay
   */
  private getRetryDelay(attempt: number): number {
    return this.options.retryDelay * Math.pow(2, attempt);
  }

  /**
   * Execute fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Main request method with retry logic
   */
  async request<T = unknown>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.options.retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, {
          ...options,
          headers: {
            ...this.options.headers,
            ...options.headers
          }
        });

        const duration = Date.now() - startTime;

        // Track successful request
        trackEvent('api_request', {
          url,
          method: options.method || 'GET',
          status: response.status,
          duration,
          attempt: attempt + 1
        });

        const data = response.ok ? await response.json() : undefined;

        return {
          data,
          status: response.status,
          ok: response.ok,
          error: response.ok ? undefined : response.statusText
        };

      } catch (error) {
        lastError = error as Error;

        // Don't retry on last attempt
        if (attempt === this.options.retries) {
          break;
        }

        // Wait before retry
        const delay = this.getRetryDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // All retries failed
    const duration = Date.now() - startTime;
    trackException(lastError!, {
      url,
      method: options.method || 'GET',
      duration,
      retries: this.options.retries
    });

    return {
      status: 0,
      ok: false,
      error: lastError?.message || 'Request failed after retries'
    };
  }

  /**
   * POST helper
   */
  async post<T = unknown>(url: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  /**
   * GET helper
   */
  async get<T = unknown>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'GET'
    });
  }
}

// Default instance
export const apiClient = new ApiClient();
