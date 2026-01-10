/**
 * Main fetcher orchestrator with fallback strategies
 */

import type { FetchResult, FetchError, FetchStrategy } from '@/types/analysis';
import { normalizeUrl, isValidUrl } from '../utils/url-validator';
import { directFetch } from './direct-fetch';
import { proxyFetch } from './proxy-fetch';
import { processManualHTML } from './manual-input';

export async function fetchHTML(
  urlOrHtml: string,
  strategy: FetchStrategy = 'direct'
): Promise<FetchResult> {
  // Validate and normalize URL
  const normalized = normalizeUrl(urlOrHtml);

  if (!isValidUrl(normalized)) {
    const error: FetchError = {
      type: 'INVALID_URL',
      message: 'Invalid URL',
      details: 'Please provide a valid URL starting with http:// or https://',
    };
    throw error;
  }

  // Execute based on strategy
  switch (strategy) {
    case 'direct':
      return await directFetch(normalized);

    case 'proxy':
      return await proxyFetch(normalized);

    case 'manual':
      // For manual, urlOrHtml is actually the HTML content
      return processManualHTML(urlOrHtml, normalized);

    default:
      const error: FetchError = {
        type: 'UNKNOWN',
        message: 'Unknown fetch strategy',
        details: `Strategy '${strategy}' is not supported`,
      };
      throw error;
  }
}

/**
 * Try fetching with automatic fallback
 * First tries direct, then falls back to proxy if CORS error
 */
export async function fetchHTMLWithFallback(url: string): Promise<FetchResult> {
  const normalized = normalizeUrl(url);

  // Try direct fetch first
  try {
    return await directFetch(normalized);
  } catch (error) {
    // If CORS error, try proxy
    if (error && typeof error === 'object' && 'type' in error) {
      const fetchError = error as FetchError;
      if (fetchError.type === 'CORS_ERROR') {
        console.log('Direct fetch failed due to CORS, trying proxy...');
        return await proxyFetch(normalized);
      }
    }

    // For other errors, re-throw
    throw error;
  }
}

export { directFetch, proxyFetch, processManualHTML };
