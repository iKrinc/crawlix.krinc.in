/**
 * Analyze heading structure (H1-H6) in HTML document
 */

import type { Heading } from '@/types/analysis';
import { getAllHeadings, getTextContentSafe, isElementVisible } from './parser';
import { countWords } from '../utils/text-processor';

export function analyzeHeadings(doc: Document): Heading[] {
  const headingElements = getAllHeadings(doc);
  const headings: Heading[] = [];

  for (const element of headingElements) {
    // Skip hidden headings
    if (!isElementVisible(element)) continue;

    const text = getTextContentSafe(element);
    if (!text) continue;

    const level = parseInt(element.tagName.substring(1)) as 1 | 2 | 3 | 4 | 5 | 6;
    const wordCount = countWords(text);

    headings.push({
      level,
      text,
      wordCount,
    });
  }

  return headings;
}

/**
 * Check for common heading issues
 */
export function detectHeadingIssues(headings: Heading[]): {
  hasMultipleH1: boolean;
  hasNoH1: boolean;
  hasSkippedLevels: boolean;
} {
  const h1Count = headings.filter(h => h.level === 1).length;

  return {
    hasMultipleH1: h1Count > 1,
    hasNoH1: h1Count === 0,
    hasSkippedLevels: checkSkippedLevels(headings),
  };
}

/**
 * Check if heading hierarchy skips levels (e.g., H1 -> H3, skipping H2)
 */
function checkSkippedLevels(headings: Heading[]): boolean {
  if (headings.length < 2) return false;

  for (let i = 1; i < headings.length; i++) {
    const prevLevel = headings[i - 1].level;
    const currentLevel = headings[i].level;

    // If current heading is more than 1 level deeper than previous, we skipped a level
    if (currentLevel > prevLevel + 1) {
      return true;
    }
  }

  return false;
}
