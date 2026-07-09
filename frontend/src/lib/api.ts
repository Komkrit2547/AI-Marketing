const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { timeout = 10000, retries = 2, retryDelay = 1000, ...fetchOptions } = options;

  let attempt = 0;
  
  while (attempt <= retries) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!res.ok) {
        // If it's a 5xx error or 429 (Too Many Requests), we might want to retry
        if (res.status >= 500 || res.status === 429) {
          throw new Error(`Transient API Error: ${res.statusText} (${res.status})`);
        }
        
        // Operational errors (400, 401, 403, 404) should fail immediately without retrying
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.error || `API error: ${res.statusText}`;
        const err = new Error(errorMessage);
        (err as any).status = res.status;
        throw err;
      }
      
      return res.json();

    } catch (error: any) {
      // Don't retry on non-transient errors (like 401 Unauthorized)
      if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }

      if (attempt >= retries) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
      }

      attempt++;
      // Exponential backoff
      await sleep(retryDelay * Math.pow(2, attempt - 1));
    }
  }

  throw new Error('Maximum retries exceeded');
}
