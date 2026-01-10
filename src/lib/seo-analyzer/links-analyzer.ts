/**
 * Analyze links in HTML document
 */

import type { LinkInfo } from '@/types/analysis';
import { getAllLinks, getAttributeSafe, getTextContentSafe, isElementVisible } from './parser';
import { isInternalLink, resolveUrl, hasNoFollow } from '../utils/url-validator';

export function analyzeLinks(doc: Document, baseUrl: string): LinkInfo[] {
  const linkElements = getAllLinks(doc);
  const links: LinkInfo[] = [];

  for (const link of linkElements) {
    // Skip hidden links
    if (!isElementVisible(link)) continue;

    const href = getAttributeSafe(link, 'href');
    if (!href) continue;

    // Skip javascript: and mailto: links
    if (href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue;
    }

    const anchorText = getTextContentSafe(link).substring(0, 200); // Limit length
    if (!anchorText) continue; // Skip links without text

    const rel = getAttributeSafe(link, 'rel');
    const target = getAttributeSafe(link, 'target');

    // Determine link type
    let type: 'internal' | 'external' | 'anchor';
    if (href.startsWith('#')) {
      type = 'anchor';
    } else if (isInternalLink(href, baseUrl)) {
      type = 'internal';
    } else {
      type = 'external';
    }

    // Resolve relative URLs to absolute
    const resolvedHref = type === 'anchor' ? href : resolveUrl(href, baseUrl);

    links.push({
      href: resolvedHref,
      anchorText,
      type,
      rel: rel || undefined,
      target: target || undefined,
      nofollow: hasNoFollow(rel),
    });
  }

  return links;
}

/**
 * Categorize links by type
 */
export function categorizeLinks(links: LinkInfo[]): {
  internal: LinkInfo[];
  external: LinkInfo[];
  anchor: LinkInfo[];
} {
  return {
    internal: links.filter(l => l.type === 'internal'),
    external: links.filter(l => l.type === 'external'),
    anchor: links.filter(l => l.type === 'anchor'),
  };
}

/**
 * Count nofollow links
 */
export function countNofollowLinks(links: LinkInfo[]): number {
  return links.filter(l => l.nofollow).length;
}

/**
 * Find links with generic anchor text
 */
export function findGenericAnchorLinks(links: LinkInfo[]): LinkInfo[] {
  const genericPatterns = [
    'click here',
    'read more',
    'learn more',
    'more',
    'here',
    'this',
    'link',
    'click',
  ];

  return links.filter(link => {
    const normalized = link.anchorText.toLowerCase().trim();
    return genericPatterns.includes(normalized);
  });
}
