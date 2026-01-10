/**
 * Text processing utilities for SEO analysis
 */

/**
 * Count syllables in a word using a simple algorithm
 * Used for Flesch Reading Ease calculation
 */
export function countSyllables(word: string): number {
  word = word.toLowerCase().trim();

  // Handle empty or very short words
  if (word.length <= 3) return 1;

  // Remove trailing es and ed (but not words ending in le like "able")
  word = word.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/, '');

  // Replace y at the start with nothing
  word = word.replace(/^y/, '');

  // Match vowel groups
  const syllableMatches = word.match(/[aeiouy]{1,2}/g);

  return syllableMatches ? syllableMatches.length : 1;
}

/**
 * Count words in a text string
 */
export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;

  // Split by whitespace and filter out empty strings
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Count sentences in a text string
 * Looks for sentence-ending punctuation (.!?)
 */
export function countSentences(text: string): number {
  if (!text || !text.trim()) return 0;

  // Match sentence endings (. ! ?)
  const sentences = text.match(/[.!?]+/g);
  return sentences ? sentences.length : 1; // At least 1 sentence if text exists
}

/**
 * Count total syllables in a text string
 */
export function countTotalSyllables(text: string): number {
  if (!text || !text.trim()) return 0;

  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.reduce((total, word) => total + countSyllables(word), 0);
}

/**
 * Clean and normalize text
 * Removes extra whitespace, special characters, etc.
 */
export function cleanText(text: string): string {
  if (!text) return '';

  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[\r\n\t]/g, ' ') // Replace line breaks and tabs with space
    .trim();
}

/**
 * Remove HTML tags from text
 */
export function stripHtml(html: string): string {
  if (!html) return '';

  // Create a temporary div to leverage browser's HTML parsing
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  // Fallback for server-side (though this is client-only app)
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Tokenize text into words
 * Filters out non-alphanumeric characters and normalizes
 */
export function tokenize(text: string, minLength: number = 1): string[] {
  if (!text || !text.trim()) return [];

  // Convert to lowercase and split by non-word characters
  const words = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(word => word.length >= minLength);

  return words;
}

/**
 * Generate n-grams from an array of words
 */
export function generateNGrams(words: string[], n: number): string[] {
  if (words.length < n) return [];

  const ngrams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(' '));
  }

  return ngrams;
}

/**
 * Count character length excluding spaces
 */
export function countCharacters(text: string, includeSpaces: boolean = false): number {
  if (!text) return 0;

  if (includeSpaces) {
    return text.length;
  }

  return text.replace(/\s/g, '').length;
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;

  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Extract text content from an HTML element, excluding script and style tags
 */
export function extractTextContent(element: Element): string {
  const excludeTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'EMBED'];

  let text = '';

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent + ' ';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (!excludeTags.includes(el.tagName)) {
        for (const child of Array.from(el.childNodes)) {
          walk(child);
        }
      }
    }
  };

  walk(element);

  return cleanText(text);
}

/**
 * Calculate word frequency in text
 * Returns a map of word -> count
 */
export function calculateWordFrequency(words: string[]): Map<string, number> {
  const frequency = new Map<string, number>();

  for (const word of words) {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  }

  return frequency;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(part: number, total: number, decimals: number = 2): number {
  if (total === 0) return 0;
  return Number(((part / total) * 100).toFixed(decimals));
}

/**
 * Check if text is likely generic anchor text
 */
export function isGenericAnchorText(text: string): boolean {
  const normalized = text.toLowerCase().trim();

  const genericPatterns = [
    'click here',
    'read more',
    'learn more',
    'more',
    'here',
    'this',
    'link',
    'click',
    'page',
    'website',
  ];

  return genericPatterns.includes(normalized);
}
