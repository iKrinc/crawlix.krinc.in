/**
 * Extract meta tags and metadata from HTML document
 */

import type { MetaData, OpenGraphTag, TwitterCardTag, MetaTag } from '@/types/analysis';
import {
  getTitle,
  getMetaContent,
  getCanonicalUrl,
  getFaviconUrl,
  getLanguage,
  getCharset,
  getOpenGraphTags,
  getTwitterCardTags,
  getAllMetaTags,
} from './parser';

export function extractMetadata(doc: Document): MetaData {
  const metadata: MetaData = {
    title: getTitle(doc) || undefined,
    description: getMetaContent(doc, 'description') || undefined,
    keywords: getMetaContent(doc, 'keywords') || undefined,
    robots: getMetaContent(doc, 'robots') || undefined,
    viewport: getMetaContent(doc, 'viewport') || undefined,
    charset: getCharset(doc) || undefined,
    language: getLanguage(doc) || undefined,
    canonicalUrl: getCanonicalUrl(doc) || undefined,
    favicon: getFaviconUrl(doc) || undefined,
    ogTags: extractOpenGraphTags(doc),
    twitterTags: extractTwitterCardTags(doc),
    other: extractOtherMetaTags(doc),
  };

  return metadata;
}

function extractOpenGraphTags(doc: Document): OpenGraphTag[] {
  return getOpenGraphTags(doc);
}

function extractTwitterCardTags(doc: Document): TwitterCardTag[] {
  return getTwitterCardTags(doc);
}

function extractOtherMetaTags(doc: Document): MetaTag[] {
  const allMeta = getAllMetaTags(doc);
  const otherTags: MetaTag[] = [];

  // Filter out OG and Twitter tags we've already extracted
  const excludedPrefixes = ['og:', 'twitter:'];
  const excludedNames = ['description', 'keywords', 'robots', 'viewport'];

  for (const meta of allMeta) {
    const name = meta.getAttribute('name');
    const property = meta.getAttribute('property');
    const content = meta.getAttribute('content');

    if (!content) continue;

    // Skip if it's an OG or Twitter tag
    if (property && excludedPrefixes.some(prefix => property.startsWith(prefix))) {
      continue;
    }

    if (name && excludedPrefixes.some(prefix => name.startsWith(prefix))) {
      continue;
    }

    // Skip if it's one of the main meta tags we've extracted separately
    if (name && excludedNames.includes(name.toLowerCase())) {
      continue;
    }

    // Skip charset and http-equiv tags
    if (meta.hasAttribute('charset') || meta.hasAttribute('http-equiv')) {
      continue;
    }

    otherTags.push({
      name: name || undefined,
      property: property || undefined,
      content,
    });
  }

  return otherTags;
}
