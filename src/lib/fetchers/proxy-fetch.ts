/**
 * Fetch via CORS proxy (our Next.js API route)
 */

import type { FetchResult, FetchError } from "@/types/analysis";
import { API_CONFIG } from "../utils/constants";

export async function proxyFetch(url: string): Promise<FetchResult> {
  let lastError: Error | null = null;

  // Try HTTPS first, then HTTP if HTTPS fails
  const urlsToTry = [url];
  if (url.startsWith("https://")) {
    urlsToTry.push(url.replace("https://", "http://"));
  }

  for (const attemptUrl of urlsToTry) {
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(attemptUrl)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      API_CONFIG.FETCH_TIMEOUT
    );

    try {
      const response = await fetch(proxyUrl, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Try to get error message from response
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}`);
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const html = await response.text();

      if (!html || html.trim().length === 0) {
        throw new Error("Empty response received");
      }

      return {
        html,
        strategy: "proxy",
        url: attemptUrl, // Return the actual URL used (might be HTTP instead of HTTPS)
      };
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error instanceof Error ? error : new Error(String(error));

      // If this is the first attempt (HTTPS) and it failed, continue to HTTP
      if (attemptUrl === url && url.startsWith("https://")) {
        continue;
      }

      // If this was HTTP or the last attempt, break and throw the error
      break;
    }
  }

  // If we get here, all attempts failed
  if (lastError) {
    if (lastError.name === "AbortError") {
      const timeoutError: FetchError = {
        type: "TIMEOUT",
        message: "Request timed out",
        details: `Proxy request took longer than ${
          API_CONFIG.FETCH_TIMEOUT / 1000
        } seconds`,
      };
      throw timeoutError;
    }

    const networkError: FetchError = {
      type: "NETWORK_ERROR",
      message: lastError.message,
      details:
        "Failed to fetch via proxy. The target website may be blocking requests.",
    };
    throw networkError;
  }

  const unknownError: FetchError = {
    type: "UNKNOWN",
    message: "An unexpected error occurred",
    details: "Unknown error occurred during proxy fetch",
  };
  throw unknownError;
}
