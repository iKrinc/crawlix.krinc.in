/**
 * Main SEO Analyzer - Orchestrates all analysis modules
 */

import type { SEOAnalysisResult, Statistics } from '@/types/analysis';
import { parseHTML, extractAllText } from './parser';
import { extractMetadata } from './meta-extractor';
import { analyzeHeadings } from './headings-analyzer';
import { analyzeImages, countImagesByAlt } from './images-analyzer';
import { analyzeLinks, categorizeLinks } from './links-analyzer';
import { parseSchema } from './schema-parser';
import { calculateReadability } from './readability-scorer';
import { analyzeKeywords, getTotalUniqueKeywords } from './keyword-analyzer';
import { detectIssues } from './issue-detector';

/**
 * Main function to analyze HTML and return complete SEO analysis
 */
export async function analyzeSEO(html: string, url: string): Promise<SEOAnalysisResult> {
  // Parse HTML
  const doc = parseHTML(html);
  if (!doc) {
    throw new Error('Failed to parse HTML');
  }

  // Extract all text content for analysis
  const allText = extractAllText(doc);

  // Run all analyzers
  const metadata = extractMetadata(doc);
  const headings = analyzeHeadings(doc);
  const images = analyzeImages(doc);
  const links = analyzeLinks(doc, url);
  const schema = parseSchema(doc);
  const readability = calculateReadability(allText);
  const keywords = analyzeKeywords(allText);

  // Detect SEO issues
  const issues = detectIssues(metadata, headings, images, links, schema);

  // Calculate statistics
  const stats = calculateStatistics(allText, headings, images, links, schema, keywords);

  // Build result
  const result: SEOAnalysisResult = {
    url,
    fetchedAt: new Date().toISOString(),
    metadata,
    headings,
    images,
    links,
    schema,
    readability,
    keywords,
    issues,
    stats,
  };

  return result;
}

/**
 * Calculate overall statistics
 */
function calculateStatistics(
  text: string,
  headings: any[],
  images: any[],
  links: any[],
  schemas: any[],
  keywords: any[]
): Statistics {
  const imageStats = countImagesByAlt(images);
  const linkStats = categorizeLinks(links);

  // Count words and characters
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const totalWords = words.length;
  const totalCharacters = text.length;

  // Count H1s
  const h1Count = headings.filter(h => h.level === 1).length;

  return {
    totalWords,
    totalCharacters,
    totalImages: images.length,
    imagesWithAlt: imageStats.withAlt,
    imagesWithoutAlt: imageStats.withoutAlt,
    totalLinks: links.length,
    internalLinks: linkStats.internal.length,
    externalLinks: linkStats.external.length,
    anchorLinks: linkStats.anchor.length,
    h1Count,
    schemaCount: schemas.filter(s => s.isValid).length,
    uniqueKeywords: getTotalUniqueKeywords(keywords),
  };
}

/**
 * Calculate an overall SEO score (0-100)
 * This is a simplified scoring system
 */
export function calculateSEOScore(result: SEOAnalysisResult): number {
  let score = 100;

  // Deduct points for critical issues
  const criticalIssues = result.issues.filter(i => i.severity === 'critical').length;
  score -= criticalIssues * 15;

  // Deduct points for warnings
  const warnings = result.issues.filter(i => i.severity === 'warning').length;
  score -= warnings * 5;

  // Deduct points for recommendations
  const recommendations = result.issues.filter(i => i.severity === 'recommendation').length;
  score -= recommendations * 2;

  // Bonus for good readability (60+)
  if (result.readability.fleschScore >= 60) {
    score += 5;
  }

  // Bonus for having schema
  if (result.stats.schemaCount > 0) {
    score += 5;
  }

  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Get SEO score rating
 */
export function getSEOScoreRating(score: number): {
  rating: string;
  color: 'success' | 'warning' | 'error';
  description: string;
} {
  if (score >= 90) {
    return {
      rating: 'Excellent',
      color: 'success',
      description: 'Your page has excellent SEO!',
    };
  } else if (score >= 75) {
    return {
      rating: 'Good',
      color: 'success',
      description: 'Your page has good SEO with minor improvements possible.',
    };
  } else if (score >= 50) {
    return {
      rating: 'Fair',
      color: 'warning',
      description: 'Your page needs some SEO improvements.',
    };
  } else {
    return {
      rating: 'Poor',
      color: 'error',
      description: 'Your page has significant SEO issues that need attention.',
    };
  }
}
