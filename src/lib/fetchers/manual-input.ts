/**
 * Process manually pasted HTML
 */

import type { FetchResult, FetchError } from '@/types/analysis';

export function processManualHTML(html: string, url: string): FetchResult {
  if (!html || html.trim().length === 0) {
    const error: FetchError = {
      type: 'EMPTY_CONTENT',
      message: 'No HTML content provided',
      details: 'Please paste valid HTML content.',
    };
    throw error;
  }

  // Basic HTML validation
  const hasHtmlTag = /<html/i.test(html);
  const hasBodyTag = /<body/i.test(html);

  if (!hasHtmlTag && !hasBodyTag) {
    const error: FetchError = {
      type: 'PARSE_ERROR',
      message: 'Invalid HTML structure',
      details: 'The provided content does not appear to be valid HTML. Please paste complete HTML including <html> and <body> tags.',
    };
    throw error;
  }

  return {
    html,
    strategy: 'manual',
    url: url || 'manual-input',
  };
}
