/**
 * Sitemap fetcher and parser
 */

import { API_CONFIG } from "../utils/constants";

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

export interface SitemapResult {
  urls: SitemapUrl[];
  found: boolean;
  sitemapUrl?: string;
  strategy?: "direct" | "proxy";
}

/**
 * Fetch sitemap with direct fetch attempt and HTTP fallback
 */
async function fetchSitemapDirect(
  sitemapUrl: string
): Promise<{ xmlText: string; success: boolean; finalUrl: string }> {
  let lastError: Error | null = null;

  // Try HTTPS first, then HTTP if HTTPS fails
  const urlsToTry = [sitemapUrl];
  if (sitemapUrl.startsWith("https://")) {
    urlsToTry.push(sitemapUrl.replace("https://", "http://"));
  }

  for (const attemptUrl of urlsToTry) {
    try {
      const response = await fetch(attemptUrl, {
        method: "GET",
        headers: {
          Accept: "application/xml, text/xml",
        },
      });

      if (response.ok) {
        const xmlText = await response.text();
        if (xmlText && xmlText.trim().length > 0) {
          return { xmlText, success: true, finalUrl: attemptUrl };
        }
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check for CORS error
      if (
        error instanceof Error &&
        (error.message.includes("CORS") ||
          error.message.includes("Failed to fetch"))
      ) {
        console.log(
          "Direct sitemap fetch failed due to CORS, will try proxy..."
        );
      }

      // If this is the first attempt (HTTPS) and it failed, continue to HTTP
      if (attemptUrl === sitemapUrl && sitemapUrl.startsWith("https://")) {
        continue;
      }

      // If this was HTTP or the last attempt, break and throw the error
      break;
    }
  }

  return { xmlText: "", success: false, finalUrl: sitemapUrl };
}

/**
 * Fetch sitemap via proxy with HTTP fallback
 */
async function fetchSitemapProxy(
  sitemapUrl: string
): Promise<{ xmlText: string; success: boolean; finalUrl: string }> {
  let lastError: Error | null = null;

  // Try HTTPS first, then HTTP if HTTPS fails
  const urlsToTry = [sitemapUrl];
  if (sitemapUrl.startsWith("https://")) {
    urlsToTry.push(sitemapUrl.replace("https://", "http://"));
  }

  for (const attemptUrl of urlsToTry) {
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(attemptUrl)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.FETCH_TIMEOUT
      );

      const response = await fetch(proxyUrl, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}`);
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const xmlText = await response.text();

      if (!xmlText || xmlText.trim().length === 0) {
        throw new Error("Empty response received");
      }

      return { xmlText, success: true, finalUrl: attemptUrl };
    } catch (error) {
      console.error("Proxy sitemap fetch failed for", attemptUrl, ":", error);
      lastError = error instanceof Error ? error : new Error(String(error));

      // If this is the first attempt (HTTPS) and it failed, continue to HTTP
      if (attemptUrl === sitemapUrl && sitemapUrl.startsWith("https://")) {
        continue;
      }

      // If this was HTTP or the last attempt, break and throw the error
      break;
    }
  }

  return { xmlText: "", success: false, finalUrl: sitemapUrl };
}

/**
 * Fetch and parse sitemap.xml from a given URL with proxy fallback and HTTP fallback
 */
export async function fetchSitemap(baseUrl: string): Promise<SitemapResult> {
  try {
    const url = new URL(baseUrl);
    const sitemapUrls = [
      `${url.origin}/sitemap.xml`,
      `${url.origin}/sitemap_index.xml`,
      `${url.origin}/sitemap`,
    ];

    for (const sitemapUrl of sitemapUrls) {
      // Try direct fetch first
      let result = await fetchSitemapDirect(sitemapUrl);
      let strategy: "direct" | "proxy" = "direct";

      // If direct fails, try proxy
      if (!result.success) {
        result = await fetchSitemapProxy(sitemapUrl);
        strategy = "proxy";
      }

      if (result.success) {
        const urls = parseSitemap(result.xmlText);

        if (urls.length > 0) {
          return {
            urls,
            found: true,
            sitemapUrl: result.finalUrl,
            strategy,
          };
        }
      }
    }

    return { urls: [], found: false };
  } catch (error) {
    console.error("Error fetching sitemap:", error);
    return { urls: [], found: false };
  }
}

/**
 * Parse sitemap XML to extract URLs
 */
function parseSitemap(xmlText: string): SitemapUrl[] {
  const urls: SitemapUrl[] = [];

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    // Check for parse errors
    const parseError = xmlDoc.querySelector("parsererror");
    if (parseError) {
      return urls;
    }

    // Handle sitemap index
    const sitemapNodes = xmlDoc.querySelectorAll("sitemap > loc");
    if (sitemapNodes.length > 0) {
      // This is a sitemap index, we'll just return the main URLs for now
      sitemapNodes.forEach((node) => {
        urls.push({ loc: node.textContent || "" });
      });
      return urls;
    }

    // Handle regular sitemap
    const urlNodes = xmlDoc.querySelectorAll("url");
    urlNodes.forEach((urlNode) => {
      const loc = urlNode.querySelector("loc")?.textContent;
      const lastmod = urlNode.querySelector("lastmod")?.textContent;
      const changefreq = urlNode.querySelector("changefreq")?.textContent;
      const priority = urlNode.querySelector("priority")?.textContent;

      if (loc) {
        urls.push({
          loc,
          lastmod: lastmod || undefined,
          changefreq: changefreq || undefined,
          priority: priority || undefined,
        });
      }
    });
  } catch (error) {
    console.error("Error parsing sitemap:", error);
  }

  return urls;
}
