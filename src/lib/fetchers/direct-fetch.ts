/**
 * Direct browser fetch (will likely fail due to CORS)
 */

import type { FetchResult, FetchError } from '@/types/analysis';
import { API_CONFIG } from '../utils/constants';

export async function directFetch(url: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.FETCH_TIMEOUT);

  try {
    let fetchUrl = url;
    let response = await fetch(fetchUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml',
      },
    });

    // If HTTPS fails, try HTTP
    if (!response.ok && fetchUrl.startsWith('https://')) {
      fetchUrl = fetchUrl.replace('https://', 'http://');
      response = await fetch(fetchUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml',
        },
      });
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    if (!html || html.trim().length === 0) {
      throw new Error('Empty response received');
    }

    // Check size limit
    if (html.length > API_CONFIG.MAX_HTML_SIZE) {
      throw new Error(`HTML size exceeds limit (${Math.round(html.length / 1024 / 1024)}MB)`);
    }

    return {
      html,
      strategy: 'direct',
      url: fetchUrl, // Return the actual URL used (might be HTTP instead of HTTPS)
    };
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        const timeoutError: FetchError = {
          type: 'TIMEOUT',
          message: 'Request timed out',
          details: `Request took longer than ${API_CONFIG.FETCH_TIMEOUT / 1000} seconds`,
        };
        throw timeoutError;
      }

      // CORS error (most common for direct fetch)
      if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        const corsError: FetchError = {
          type: 'CORS_ERROR',
          message: 'CORS policy blocked this request',
          details: 'The target website does not allow cross-origin requests from browsers.',
        };
        throw corsError;
      }

      // Network error
      const networkError: FetchError = {
        type: 'NETWORK_ERROR',
        message: error.message,
        details: 'Failed to fetch the webpage. Please check the URL and try again.',
      };
      throw networkError;
    }

    // Unknown error
    const unknownError: FetchError = {
      type: 'UNKNOWN',
      message: 'An unexpected error occurred',
      details: String(error),
    };
    throw unknownError;
  }
}
