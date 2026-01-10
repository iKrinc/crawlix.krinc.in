/**
 * Detect common SEO issues
 */

import type { SEOIssue, MetaData, Heading, ImageInfo, LinkInfo, SchemaData } from '@/types/analysis';
import { SEO_THRESHOLDS } from '../utils/constants';
import { detectHeadingIssues } from './headings-analyzer';
import { findGenericAnchorLinks } from './links-analyzer';

export function detectIssues(
  metadata: MetaData,
  headings: Heading[],
  images: ImageInfo[],
  links: LinkInfo[],
  schemas: SchemaData[]
): SEOIssue[] {
  const issues: SEOIssue[] = [];

  // Check meta tags
  issues.push(...checkMetaIssues(metadata));

  // Check heading structure
  issues.push(...checkHeadingIssues(headings));

  // Check images
  issues.push(...checkImageIssues(images));

  // Check links
  issues.push(...checkLinkIssues(links));

  // Check schema
  issues.push(...checkSchemaIssues(schemas));

  return issues;
}

function checkMetaIssues(metadata: MetaData): SEOIssue[] {
  const issues: SEOIssue[] = [];

  // Check title
  if (!metadata.title) {
    issues.push({
      severity: 'critical',
      category: 'meta',
      message: 'Missing page title',
      suggestion: 'Add a descriptive <title> tag to your page. Titles should be 50-60 characters long.',
    });
  } else {
    const titleLength = metadata.title.length;
    if (titleLength < SEO_THRESHOLDS.title.min) {
      issues.push({
        severity: 'warning',
        category: 'meta',
        message: `Title is too short (${titleLength} characters)`,
        suggestion: `Title should be at least ${SEO_THRESHOLDS.title.min} characters. Current: "${metadata.title}"`,
      });
    } else if (titleLength > SEO_THRESHOLDS.title.max) {
      issues.push({
        severity: 'warning',
        category: 'meta',
        message: `Title is too long (${titleLength} characters)`,
        suggestion: `Title should be no more than ${SEO_THRESHOLDS.title.max} characters. It may be truncated in search results.`,
      });
    }
  }

  // Check meta description
  if (!metadata.description) {
    issues.push({
      severity: 'warning',
      category: 'meta',
      message: 'Missing meta description',
      suggestion: 'Add a meta description tag. Descriptions should be 150-160 characters and compelling.',
    });
  } else {
    const descLength = metadata.description.length;
    if (descLength < SEO_THRESHOLDS.description.min) {
      issues.push({
        severity: 'warning',
        category: 'meta',
        message: `Meta description is too short (${descLength} characters)`,
        suggestion: `Description should be at least ${SEO_THRESHOLDS.description.min} characters.`,
      });
    } else if (descLength > SEO_THRESHOLDS.description.max) {
      issues.push({
        severity: 'recommendation',
        category: 'meta',
        message: `Meta description is too long (${descLength} characters)`,
        suggestion: `Description should be no more than ${SEO_THRESHOLDS.description.max} characters to avoid truncation.`,
      });
    }
  }

  // Check canonical URL
  if (!metadata.canonicalUrl) {
    issues.push({
      severity: 'recommendation',
      category: 'meta',
      message: 'Missing canonical URL',
      suggestion: 'Add a canonical link tag to prevent duplicate content issues.',
    });
  }

  // Check viewport meta tag
  if (!metadata.viewport) {
    issues.push({
      severity: 'warning',
      category: 'meta',
      message: 'Missing viewport meta tag',
      suggestion: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> for mobile responsiveness.',
    });
  }

  // Check language attribute
  if (!metadata.language) {
    issues.push({
      severity: 'recommendation',
      category: 'meta',
      message: 'Missing language attribute',
      suggestion: 'Add lang attribute to <html> tag (e.g., <html lang="en">).',
    });
  }

  // Check Open Graph tags
  if (metadata.ogTags.length === 0) {
    issues.push({
      severity: 'recommendation',
      category: 'meta',
      message: 'Missing Open Graph tags',
      suggestion: 'Add Open Graph tags for better social media sharing (og:title, og:description, og:image).',
    });
  }

  return issues;
}

function checkHeadingIssues(headings: Heading[]): SEOIssue[] {
  const issues: SEOIssue[] = [];

  const headingProblems = detectHeadingIssues(headings);

  // Multiple H1s
  if (headingProblems.hasMultipleH1) {
    const h1Count = headings.filter(h => h.level === 1).length;
    issues.push({
      severity: 'critical',
      category: 'structure',
      message: `Multiple H1 tags found (${h1Count})`,
      suggestion: 'Use only one H1 tag per page. H1 should represent the main page topic.',
    });
  }

  // No H1
  if (headingProblems.hasNoH1) {
    issues.push({
      severity: 'critical',
      category: 'structure',
      message: 'No H1 tag found',
      suggestion: 'Add an H1 tag to clearly identify the main topic of the page.',
    });
  }

  // Skipped heading levels
  if (headingProblems.hasSkippedLevels) {
    issues.push({
      severity: 'warning',
      category: 'structure',
      message: 'Heading hierarchy skips levels',
      suggestion: 'Maintain proper heading hierarchy (H1 → H2 → H3). Don\'t skip levels (e.g., H1 → H3).',
    });
  }

  // Empty headings
  const emptyHeadings = headings.filter(h => !h.text || h.text.trim().length === 0);
  if (emptyHeadings.length > 0) {
    issues.push({
      severity: 'warning',
      category: 'content',
      message: `Found ${emptyHeadings.length} empty heading(s)`,
      suggestion: 'All headings should contain meaningful text.',
    });
  }

  return issues;
}

function checkImageIssues(images: ImageInfo[]): SEOIssue[] {
  const issues: SEOIssue[] = [];

  const imagesWithoutAlt = images.filter(img => !img.alt || img.alt.trim().length === 0);

  if (imagesWithoutAlt.length > 0) {
    const percentage = (imagesWithoutAlt.length / images.length) * 100;

    if (percentage > 50) {
      issues.push({
        severity: 'critical',
        category: 'images',
        message: `${imagesWithoutAlt.length} of ${images.length} images missing alt text (${percentage.toFixed(0)}%)`,
        suggestion: 'Add descriptive alt text to all images for accessibility and SEO.',
      });
    } else if (percentage > 0) {
      issues.push({
        severity: 'warning',
        category: 'images',
        message: `${imagesWithoutAlt.length} of ${images.length} images missing alt text`,
        suggestion: 'Add descriptive alt text to all images for better accessibility.',
      });
    }
  }

  // Check for images with empty alt (alt="")
  const imagesWithEmptyAlt = images.filter(img => img.alt === '');
  if (imagesWithEmptyAlt.length > 0) {
    issues.push({
      severity: 'recommendation',
      category: 'images',
      message: `${imagesWithEmptyAlt.length} image(s) with empty alt attribute`,
      suggestion: 'Empty alt (alt="") should only be used for decorative images. Add descriptive alt text for content images.',
    });
  }

  return issues;
}

function checkLinkIssues(links: LinkInfo[]): SEOIssue[] {
  const issues: SEOIssue[] = [];

  // Check for generic anchor text
  const genericLinks = findGenericAnchorLinks(links);

  if (genericLinks.length > 0) {
    issues.push({
      severity: 'recommendation',
      category: 'links',
      message: `${genericLinks.length} link(s) with generic anchor text`,
      suggestion: 'Use descriptive anchor text instead of generic phrases like "click here" or "read more".',
    });
  }

  // Check for broken anchor links (links starting with # but no target)
  const anchorLinks = links.filter(l => l.type === 'anchor');
  if (anchorLinks.length > 0) {
    issues.push({
      severity: 'recommendation',
      category: 'links',
      message: `Found ${anchorLinks.length} anchor link(s)`,
      suggestion: 'Ensure all anchor links point to existing IDs on the page.',
    });
  }

  // Warn if too many external links without nofollow
  const externalWithoutNofollow = links.filter(l => l.type === 'external' && !l.nofollow);
  if (externalWithoutNofollow.length > 20) {
    issues.push({
      severity: 'recommendation',
      category: 'links',
      message: `${externalWithoutNofollow.length} external links without nofollow`,
      suggestion: 'Consider adding rel="nofollow" to external links you don\'t want to endorse.',
    });
  }

  return issues;
}

function checkSchemaIssues(schemas: SchemaData[]): SEOIssue[] {
  const issues: SEOIssue[] = [];

  // Check for invalid schemas
  const invalidSchemas = schemas.filter(s => !s.isValid);
  if (invalidSchemas.length > 0) {
    issues.push({
      severity: 'warning',
      category: 'schema',
      message: `${invalidSchemas.length} invalid JSON-LD schema(s)`,
      suggestion: 'Fix JSON syntax errors in structured data.',
    });
  }

  // Recommend adding schema if none exists
  if (schemas.length === 0) {
    issues.push({
      severity: 'recommendation',
      category: 'schema',
      message: 'No structured data (JSON-LD) found',
      suggestion: 'Add schema.org structured data to help search engines understand your content better.',
    });
  }

  return issues;
}
