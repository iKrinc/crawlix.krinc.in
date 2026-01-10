/**
 * Analyze images in HTML document
 */

import type { ImageInfo } from '@/types/analysis';
import { getAllImages, getAttributeSafe, isElementVisible } from './parser';

export function analyzeImages(doc: Document): ImageInfo[] {
  const imageElements = getAllImages(doc);
  const images: ImageInfo[] = [];

  for (const img of imageElements) {
    // Skip hidden images
    if (!isElementVisible(img)) continue;

    const src = getAttributeSafe(img, 'src');
    if (!src) continue;

    const alt = getAttributeSafe(img, 'alt');
    const title = getAttributeSafe(img, 'title');
    const width = getAttributeSafe(img, 'width');
    const height = getAttributeSafe(img, 'height');
    const loading = getAttributeSafe(img, 'loading');

    images.push({
      src,
      alt: alt || undefined,
      title: title || undefined,
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      loading: (loading === 'lazy' || loading === 'eager') ? loading : undefined,
    });
  }

  return images;
}

/**
 * Count images with and without alt text
 */
export function countImagesByAlt(images: ImageInfo[]): {
  withAlt: number;
  withoutAlt: number;
  total: number;
} {
  const withAlt = images.filter(img => img.alt && img.alt.trim().length > 0).length;
  const withoutAlt = images.length - withAlt;

  return {
    withAlt,
    withoutAlt,
    total: images.length,
  };
}

/**
 * Get the first image (often used for social sharing)
 */
export function getFirstImage(images: ImageInfo[]): ImageInfo | null {
  return images.length > 0 ? images[0] : null;
}

/**
 * Count images with lazy loading
 */
export function countLazyLoadedImages(images: ImageInfo[]): number {
  return images.filter(img => img.loading === 'lazy').length;
}
