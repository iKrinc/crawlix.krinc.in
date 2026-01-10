/**
 * Calculate readability scores using Flesch Reading Ease formula
 */

import type { ReadabilityScore } from '@/types/analysis';
import {
  countWords,
  countSentences,
  countTotalSyllables,
} from '../utils/text-processor';
import { GRADE_LEVELS } from '../utils/constants';

export function calculateReadability(text: string): ReadabilityScore {
  if (!text || !text.trim()) {
    return {
      fleschScore: 0,
      gradeLevel: 'N/A',
      interpretation: 'No text content found',
      statistics: {
        sentences: 0,
        words: 0,
        syllables: 0,
        avgWordsPerSentence: 0,
        avgSyllablesPerWord: 0,
      },
    };
  }

  const sentences = countSentences(text);
  const words = countWords(text);
  const syllables = countTotalSyllables(text);

  // Avoid division by zero
  if (sentences === 0 || words === 0) {
    return {
      fleschScore: 0,
      gradeLevel: 'N/A',
      interpretation: 'Insufficient text for analysis',
      statistics: {
        sentences,
        words,
        syllables,
        avgWordsPerSentence: 0,
        avgSyllablesPerWord: 0,
      },
    };
  }

  // Calculate averages
  const avgWordsPerSentence = words / sentences;
  const avgSyllablesPerWord = syllables / words;

  // Flesch Reading Ease formula:
  // 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  const fleschScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, fleschScore));

  return {
    fleschScore: Number(clampedScore.toFixed(1)),
    gradeLevel: GRADE_LEVELS.getGradeLevel(clampedScore),
    interpretation: GRADE_LEVELS.getInterpretation(clampedScore),
    statistics: {
      sentences,
      words,
      syllables,
      avgWordsPerSentence: Number(avgWordsPerSentence.toFixed(1)),
      avgSyllablesPerWord: Number(avgSyllablesPerWord.toFixed(2)),
    },
  };
}

/**
 * Get readability rating (Easy, Standard, Difficult, etc.)
 */
export function getReadabilityRating(score: number): string {
  if (score >= 90) return 'Very Easy';
  if (score >= 80) return 'Easy';
  if (score >= 70) return 'Fairly Easy';
  if (score >= 60) return 'Standard';
  if (score >= 50) return 'Fairly Difficult';
  if (score >= 30) return 'Difficult';
  return 'Very Difficult';
}

/**
 * Get color code for readability score (for UI display)
 */
export function getReadabilityColor(score: number): 'success' | 'warning' | 'error' {
  if (score >= 60) return 'success'; // Standard or easier
  if (score >= 30) return 'warning'; // Fairly Difficult or Difficult
  return 'error'; // Very Difficult
}
