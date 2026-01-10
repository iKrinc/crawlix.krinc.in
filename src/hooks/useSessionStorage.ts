/**
 * Custom hook for sessionStorage with SEO analysis result
 */

import { useState, useEffect } from 'react';
import type { SEOAnalysisResult } from '@/types/analysis';
import { STORAGE_KEYS } from '@/lib/utils/constants';
import { saveToSession, loadFromSession, removeFromSession } from '@/lib/utils/storage';

export function useSessionStorage() {
  const [storedResult, setStoredResult] = useState<SEOAnalysisResult | null>(null);

  // Load from session storage on mount
  useEffect(() => {
    const loaded = loadFromSession<SEOAnalysisResult>(STORAGE_KEYS.ANALYSIS_RESULT);
    if (loaded) {
      setStoredResult(loaded);
    }
  }, []);

  const saveResult = (result: SEOAnalysisResult) => {
    const success = saveToSession(STORAGE_KEYS.ANALYSIS_RESULT, result);
    if (success) {
      setStoredResult(result);
    }
    return success;
  };

  const clearResult = () => {
    removeFromSession(STORAGE_KEYS.ANALYSIS_RESULT);
    setStoredResult(null);
  };

  return {
    storedResult,
    saveResult,
    clearResult,
    hasStored: storedResult !== null,
  };
}
