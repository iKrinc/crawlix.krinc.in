import type { SEOAnalysisResult } from '@/types/analysis';

export interface ExportOptions {
  selectedSections: Set<string>;
  prettyPrint?: boolean;
}

export function exportToJSON(
  result: SEOAnalysisResult,
  options: ExportOptions
): string {
  const { selectedSections, prettyPrint = true } = options;

  const exportData: Partial<SEOAnalysisResult> = {
    url: result.url,
    fetchedAt: result.fetchedAt,
  };

  if (selectedSections.has('meta')) {
    exportData.metadata = result.metadata;
  }

  if (selectedSections.has('headings')) {
    exportData.headings = result.headings;
  }

  if (selectedSections.has('images')) {
    exportData.images = result.images;
  }

  if (selectedSections.has('links')) {
    exportData.links = result.links;
  }

  if (selectedSections.has('schema')) {
    exportData.schema = result.schema;
  }

  if (selectedSections.has('readability')) {
    exportData.readability = result.readability;
  }

  if (selectedSections.has('keywords')) {
    exportData.keywords = result.keywords;
  }

  if (selectedSections.has('issues')) {
    exportData.issues = result.issues;
  }

  exportData.stats = result.stats;

  return prettyPrint
    ? JSON.stringify(exportData, null, 2)
    : JSON.stringify(exportData);
}

export function downloadJSON(
  result: SEOAnalysisResult,
  options: ExportOptions
): void {
  const jsonString = exportToJSON(result, options);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `crawlix-seo-analysis-${new Date().getTime()}.json`;

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
