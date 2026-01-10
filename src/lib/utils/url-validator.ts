/**
 * URL validation and normalization utilities
 */

/**
 * Check if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  if (!url || !url.trim()) return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Normalize URL by adding protocol if missing
 */
export function normalizeUrl(url: string): string {
  if (!url || !url.trim()) return '';

  url = url.trim();

  // If it starts with // (protocol-relative), add https:
  if (url.startsWith('//')) {
    return 'https:' + url;
  }

  // If it doesn't start with http:// or https://, add https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }

  return url;
}

/**
 * Extract hostname from URL
 */
export function getHostname(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return '';
  }
}

/**
 * Check if URL is internal (relative) or external (absolute)
 */
export function isInternalLink(href: string, baseUrl: string): boolean {
  if (!href) return false;

  // Anchor links (#something)
  if (href.startsWith('#')) return true;

  // Relative URLs (starts with /)
  if (href.startsWith('/') && !href.startsWith('//')) return true;

  // Relative URLs without leading slash
  if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
    return true;
  }

  // Compare hostnames for absolute URLs
  try {
    const hrefHostname = getHostname(href);
    const baseHostname = getHostname(baseUrl);
    return hrefHostname === baseHostname;
  } catch {
    return false;
  }
}

/**
 * Convert relative URL to absolute URL
 */
export function resolveUrl(href: string, baseUrl: string): string {
  if (!href) return '';

  try {
    // If it's already absolute, return as is
    if (href.startsWith('http://') || href.startsWith('https://')) {
      return href;
    }

    // Use URL constructor to resolve relative URLs
    const base = new URL(baseUrl);
    const resolved = new URL(href, base);
    return resolved.href;
  } catch {
    return href;
  }
}

/**
 * Check if URL points to an image
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
  const lowerUrl = url.toLowerCase();

  return imageExtensions.some(ext => lowerUrl.includes(ext));
}

/**
 * Sanitize URL for display (remove protocol, trailing slashes)
 */
export function sanitizeUrlForDisplay(url: string): string {
  if (!url) return '';

  let sanitized = url
    .replace(/^https?:\/\//, '') // Remove protocol
    .replace(/^www\./, '') // Remove www
    .replace(/\/$/, ''); // Remove trailing slash

  // Truncate if too long
  if (sanitized.length > 50) {
    sanitized = sanitized.substring(0, 47) + '...';
  }

  return sanitized;
}

/**
 * Extract domain from URL (without subdomain)
 */
export function getDomain(url: string): string {
  try {
    const hostname = getHostname(url);
    const parts = hostname.split('.');

    // Handle localhost and IP addresses
    if (parts.length <= 2) return hostname;

    // Return domain.tld (last two parts)
    return parts.slice(-2).join('.');
  } catch {
    return '';
  }
}

/**
 * Check if link has nofollow attribute
 */
export function hasNoFollow(rel: string | null): boolean {
  if (!rel) return false;
  return rel.toLowerCase().includes('nofollow');
}

/**
 * Validate and parse a list of URLs
 */
export function validateUrlList(urls: string[]): { valid: string[], invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const url of urls) {
    if (isValidUrl(normalizeUrl(url))) {
      valid.push(normalizeUrl(url));
    } else {
      invalid.push(url);
    }
  }

  return { valid, invalid };
}
