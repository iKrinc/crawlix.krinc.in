/**
 * Analyze keyword density and frequency
 */

import type { KeywordDensity } from '@/types/analysis';
import {
  tokenize,
  generateNGrams,
  calculateWordFrequency,
  calculatePercentage,
} from '../utils/text-processor';
import { STOP_WORDS, KEYWORD_CONFIG } from '../utils/constants';

export function analyzeKeywords(text: string): KeywordDensity[] {
  if (!text || !text.trim()) return [];

  // Tokenize text into words (lowercase, min length 3)
  const words = tokenize(text, KEYWORD_CONFIG.MIN_WORD_LENGTH);

  // Filter out stop words
  const filteredWords = words.filter(word => !STOP_WORDS.has(word));

  const totalWords = filteredWords.length;
  if (totalWords === 0) return [];

  const allKeywords: KeywordDensity[] = [];

  // Analyze 1-grams (single words)
  const oneGrams = analyzeNGram(filteredWords, 1, totalWords);
  allKeywords.push(...oneGrams);

  // Analyze 2-grams (two-word phrases)
  const twoGrams = analyzeNGram(filteredWords, 2, totalWords);
  allKeywords.push(...twoGrams);

  // Analyze 3-grams (three-word phrases)
  const threeGrams = analyzeNGram(filteredWords, 3, totalWords);
  allKeywords.push(...threeGrams);

  return allKeywords;
}

/**
 * Analyze n-grams for a specific n value
 */
function analyzeNGram(words: string[], n: 1 | 2 | 3, totalWords: number): KeywordDensity[] {
  const ngrams = generateNGrams(words, n);
  if (ngrams.length === 0) return [];

  // Calculate frequency
  const frequency = calculateWordFrequency(ngrams);

  // Convert to KeywordDensity objects
  const keywords: KeywordDensity[] = [];

  frequency.forEach((count, phrase) => {
    // Filter out low-frequency keywords
    if (count < KEYWORD_CONFIG.MIN_OCCURRENCES) return;

    // Calculate percentage (for n-grams > 1, adjust total)
    const adjustedTotal = n === 1 ? totalWords : ngrams.length;
    const percentage = calculatePercentage(count, adjustedTotal);

    keywords.push({
      phrase,
      count,
      percentage,
      nGram: n,
    });
  });

  // Sort by count (descending) and take top results
  keywords.sort((a, b) => b.count - a.count);

  return keywords.slice(0, KEYWORD_CONFIG.MAX_RESULTS_PER_NGRAM);
}

/**
 * Get top keywords across all n-grams
 */
export function getTopKeywords(keywords: KeywordDensity[], limit: number = 10): KeywordDensity[] {
  // Sort by count descending
  const sorted = [...keywords].sort((a, b) => b.count - a.count);
  return sorted.slice(0, limit);
}

/**
 * Filter keywords by n-gram size
 */
export function filterKeywordsByNGram(keywords: KeywordDensity[], nGram: 1 | 2 | 3): KeywordDensity[] {
  return keywords.filter(k => k.nGram === nGram);
}

/**
 * Check if any keyword exceeds the recommended density threshold
 */
export function hasKeywordStuffing(keywords: KeywordDensity[]): boolean {
  const MAX_DENSITY = 3.5; // 3.5% threshold
  return keywords.some(k => k.nGram === 1 && k.percentage > MAX_DENSITY);
}

/**
 * Get keywords within optimal density range
 */
export function getOptimalKeywords(keywords: KeywordDensity[]): KeywordDensity[] {
  const MIN_DENSITY = 1.0;
  const MAX_DENSITY = 2.5;

  return keywords.filter(k =>
    k.nGram === 1 && k.percentage >= MIN_DENSITY && k.percentage <= MAX_DENSITY
  );
}

/**
 * Get total unique keywords across all n-grams
 */
export function getTotalUniqueKeywords(keywords: KeywordDensity[]): number {
  const uniquePhrases = new Set(keywords.map(k => k.phrase));
  return uniquePhrases.size;
}
