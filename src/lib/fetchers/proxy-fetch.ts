/**
 * Fetch via CORS proxy (our Next.js API route)
 */

import type { FetchResult, FetchError } from '@/types/analysis';
import { API_CONFIG } from '../utils/constants';

export async function proxyFetch(url: string): Promise<FetchResult> {
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.FETCH_TIMEOUT);

  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Try to get error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      } catch {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    const html = await response.text();

    if (!html || html.trim().length === 0) {
      throw new Error('Empty response received');
    }

    return {
      html,
      strategy: 'proxy',
      url,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        const timeoutError: FetchError = {
          type: 'TIMEOUT',
          message: 'Request timed out',
          details: `Proxy request took longer than ${API_CONFIG.FETCH_TIMEOUT / 1000} seconds`,
        };
        throw timeoutError;
      }

      const networkError: FetchError = {
        type: 'NETWORK_ERROR',
        message: error.message,
        details: 'Failed to fetch via proxy. The target website may be blocking requests.',
      };
      throw networkError;
    }

    const unknownError: FetchError = {
      type: 'UNKNOWN',
      message: 'An unexpected error occurred',
      details: String(error),
    };
    throw unknownError;
  }
}
