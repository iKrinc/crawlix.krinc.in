/**
 * HTML parsing utilities using browser's native DOMParser
 */

import { extractTextContent } from '../utils/text-processor';

/**
 * Parse HTML string into a Document object
 */
export function parseHTML(html: string): Document | null {
  if (!html || !html.trim()) {
    console.error('Empty HTML provided');
    return null;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Check for parser errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      console.error('HTML parsing error:', parserError.textContent);
      return null;
    }

    return doc;
  } catch (error) {
    console.error('Failed to parse HTML:', error);
    return null;
  }
}

/**
 * Extract all text content from document, excluding scripts and styles
 */
export function extractAllText(doc: Document): string {
  if (!doc || !doc.body) return '';

  return extractTextContent(doc.body);
}

/**
 * Get meta tag content by name or property
 */
export function getMetaContent(doc: Document, nameOrProperty: string): string | null {
  if (!doc) return null;

  // Try name attribute first
  let meta = doc.querySelector(`meta[name="${nameOrProperty}"]`);

  // Try property attribute (for Open Graph tags)
  if (!meta) {
    meta = doc.querySelector(`meta[property="${nameOrProperty}"]`);
  }

  return meta?.getAttribute('content') || null;
}

/**
 * Get all meta tags
 */
export function getAllMetaTags(doc: Document): Element[] {
  if (!doc) return [];

  return Array.from(doc.querySelectorAll('meta'));
}

/**
 * Get title from document
 */
export function getTitle(doc: Document): string | null {
  if (!doc) return null;

  const titleElement = doc.querySelector('title');
  return titleElement?.textContent?.trim() || null;
}

/**
 * Get canonical URL from document
 */
export function getCanonicalUrl(doc: Document): string | null {
  if (!doc) return null;

  const canonical = doc.querySelector('link[rel="canonical"]');
  return canonical?.getAttribute('href') || null;
}

/**
 * Get favicon URL from document
 */
export function getFaviconUrl(doc: Document): string | null {
  if (!doc) return null;

  // Try different favicon link types
  const selectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
  ];

  for (const selector of selectors) {
    const link = doc.querySelector(selector);
    if (link) {
      return link.getAttribute('href') || null;
    }
  }

  return null;
}

/**
 * Get all headings (H1-H6) from document
 */
export function getAllHeadings(doc: Document): Element[] {
  if (!doc) return [];

  return Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
}

/**
 * Get all images from document
 */
export function getAllImages(doc: Document): Element[] {
  if (!doc) return [];

  return Array.from(doc.querySelectorAll('img'));
}

/**
 * Get all links from document
 */
export function getAllLinks(doc: Document): Element[] {
  if (!doc) return [];

  return Array.from(doc.querySelectorAll('a[href]'));
}

/**
 * Get all script tags with JSON-LD (structured data)
 */
export function getJSONLDScripts(doc: Document): Element[] {
  if (!doc) return [];

  return Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
}

/**
 * Get language attribute from HTML tag
 */
export function getLanguage(doc: Document): string | null {
  if (!doc) return null;

  const html = doc.querySelector('html');
  return html?.getAttribute('lang') || null;
}

/**
 * Get charset from meta tag
 */
export function getCharset(doc: Document): string | null {
  if (!doc) return null;

  // Try charset attribute
  let meta = doc.querySelector('meta[charset]');
  if (meta) {
    return meta.getAttribute('charset') || null;
  }

  // Try http-equiv with content-type
  meta = doc.querySelector('meta[http-equiv="Content-Type"]');
  if (meta) {
    const content = meta.getAttribute('content');
    if (content) {
      const match = content.match(/charset=([^;]+)/i);
      return match ? match[1].trim() : null;
    }
  }

  return null;
}

/**
 * Check if element is visible (not hidden by CSS or attributes)
 */
export function isElementVisible(element: Element): boolean {
  if (!element) return false;

  // Check hidden attribute
  if (element.hasAttribute('hidden')) return false;

  // Check aria-hidden
  if (element.getAttribute('aria-hidden') === 'true') return false;

  // Check display and visibility styles
  if (element instanceof HTMLElement) {
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
  }

  return true;
}

/**
 * Get Open Graph tags
 */
export function getOpenGraphTags(doc: Document): Array<{ property: string; content: string }> {
  if (!doc) return [];

  const ogTags = doc.querySelectorAll('meta[property^="og:"]');
  return Array.from(ogTags).map(tag => ({
    property: tag.getAttribute('property') || '',
    content: tag.getAttribute('content') || '',
  }));
}

/**
 * Get Twitter Card tags
 */
export function getTwitterCardTags(doc: Document): Array<{ name: string; content: string }> {
  if (!doc) return [];

  const twitterTags = doc.querySelectorAll('meta[name^="twitter:"]');
  return Array.from(twitterTags).map(tag => ({
    name: tag.getAttribute('name') || '',
    content: tag.getAttribute('content') || '',
  }));
}

/**
 * Extract base URL from document
 */
export function getBaseUrl(doc: Document): string | null {
  if (!doc) return null;

  const base = doc.querySelector('base[href]');
  return base?.getAttribute('href') || null;
}

/**
 * Count elements by selector
 */
export function countElements(doc: Document, selector: string): number {
  if (!doc) return 0;

  return doc.querySelectorAll(selector).length;
}

/**
 * Check if document has a specific meta tag
 */
export function hasMetaTag(doc: Document, nameOrProperty: string): boolean {
  return getMetaContent(doc, nameOrProperty) !== null;
}

/**
 * Get all paragraph elements
 */
export function getAllParagraphs(doc: Document): Element[] {
  if (!doc) return [];

  return Array.from(doc.querySelectorAll('p'));
}

/**
 * Extract main content area (heuristic approach)
 * Looks for main, article, or largest content block
 */
export function getMainContent(doc: Document): Element | null {
  if (!doc) return null;

  // Try semantic HTML5 elements first
  const main = doc.querySelector('main');
  if (main) return main;

  const article = doc.querySelector('article');
  if (article) return article;

  // Fallback to body
  return doc.body;
}

/**
 * Safely extract attribute from element
 */
export function getAttributeSafe(element: Element | null, attribute: string): string | null {
  if (!element) return null;
  return element.getAttribute(attribute);
}

/**
 * Safely extract text content from element
 */
export function getTextContentSafe(element: Element | null): string {
  if (!element) return '';
  return element.textContent?.trim() || '';
}
