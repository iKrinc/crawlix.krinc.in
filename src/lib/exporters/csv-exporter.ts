import type { SEOAnalysisResult } from '@/types/analysis';
import type { ExportOptions } from './json-exporter';

function escapeCSV(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function exportToCSV(
  result: SEOAnalysisResult,
  options: ExportOptions
): string {
  const { selectedSections } = options;
  const sections: string[] = [];

  // Summary section (always included)
  sections.push('=== SUMMARY ===');
  sections.push('Field,Value');
  sections.push(`URL,${escapeCSV(result.url)}`);
  sections.push(`Analyzed At,${escapeCSV(result.fetchedAt)}`);
  sections.push(`Total Words,${result.stats.totalWords}`);
  sections.push(`Total Images,${result.stats.totalImages}`);
  sections.push(`Total Links,${result.stats.totalLinks}`);
  sections.push(`H1 Count,${result.stats.h1Count}`);
  sections.push('');

  // Meta Tags
  if (selectedSections.has('meta')) {
    sections.push('=== META TAGS ===');
    sections.push('Property,Value,Character Count');
    sections.push(`Title,${escapeCSV(result.metadata.title)},${result.metadata.title?.length || 0}`);
    sections.push(`Description,${escapeCSV(result.metadata.description)},${result.metadata.description?.length || 0}`);
    sections.push(`Keywords,${escapeCSV(result.metadata.keywords)},`);
    sections.push(`Canonical,${escapeCSV(result.metadata.canonicalUrl)},`);
    sections.push(`Robots,${escapeCSV(result.metadata.robots)},`);
    sections.push(`Language,${escapeCSV(result.metadata.language)},`);
    sections.push(`Viewport,${escapeCSV(result.metadata.viewport)},`);
    sections.push('');

    if (result.metadata.ogTags && result.metadata.ogTags.length > 0) {
      sections.push('=== OPEN GRAPH TAGS ===');
      sections.push('Property,Value');
      result.metadata.ogTags.forEach((tag) => {
        sections.push(`${escapeCSV(tag.property)},${escapeCSV(tag.content)}`);
      });
      sections.push('');
    }

    if (result.metadata.twitterTags && result.metadata.twitterTags.length > 0) {
      sections.push('=== TWITTER CARD TAGS ===');
      sections.push('Name,Value');
      result.metadata.twitterTags.forEach((tag) => {
        sections.push(`${escapeCSV(tag.name)},${escapeCSV(tag.content)}`);
      });
      sections.push('');
    }
  }

  // Headings
  if (selectedSections.has('headings')) {
    sections.push('=== HEADINGS ===');
    sections.push('Level,Text,Word Count');
    result.headings.forEach(heading => {
      sections.push(`H${heading.level},${escapeCSV(heading.text)},${heading.wordCount}`);
    });
    sections.push('');
  }

  // Images
  if (selectedSections.has('images')) {
    sections.push('=== IMAGES ===');
    sections.push('Source,Alt Text,Width,Height,Loading');
    result.images.forEach(img => {
      sections.push(
        `${escapeCSV(img.src)},${escapeCSV(img.alt)},${img.width || ''},${img.height || ''},${escapeCSV(img.loading)}`
      );
    });
    sections.push('');
  }

  // Links
  if (selectedSections.has('links')) {
    sections.push('=== LINKS ===');
    sections.push('URL,Anchor Text,Type,Rel,Target');
    result.links.forEach(link => {
      sections.push(
        `${escapeCSV(link.href)},${escapeCSV(link.anchorText)},${link.type},${escapeCSV(link.rel)},${escapeCSV(link.target)}`
      );
    });
    sections.push('');
  }

  // Schema
  if (selectedSections.has('schema')) {
    sections.push('=== STRUCTURED DATA (JSON-LD) ===');
    sections.push('Type,Valid,JSON');
    result.schema.forEach(schema => {
      sections.push(`${escapeCSV(schema.type)},${schema.isValid},${escapeCSV(schema.rawJson)}`);
    });
    sections.push('');
  }

  // Readability
  if (selectedSections.has('readability')) {
    sections.push('=== READABILITY ===');
    sections.push('Metric,Value');
    sections.push(`Flesch Score,${result.readability.fleschScore}`);
    sections.push(`Grade Level,${escapeCSV(result.readability.gradeLevel)}`);
    sections.push(`Interpretation,${escapeCSV(result.readability.interpretation)}`);
    sections.push(`Sentences,${result.readability.statistics.sentences}`);
    sections.push(`Words,${result.readability.statistics.words}`);
    sections.push(`Syllables,${result.readability.statistics.syllables}`);
    sections.push(`Avg Words Per Sentence,${result.readability.statistics.avgWordsPerSentence.toFixed(2)}`);
    sections.push(`Avg Syllables Per Word,${result.readability.statistics.avgSyllablesPerWord.toFixed(2)}`);
    sections.push('');
  }

  // Keywords
  if (selectedSections.has('keywords')) {
    sections.push('=== KEYWORDS ===');
    sections.push('Phrase,N-Gram,Count,Percentage');
    result.keywords.forEach(kw => {
      sections.push(`${escapeCSV(kw.phrase)},${kw.nGram}-word,${kw.count},${kw.percentage.toFixed(2)}%`);
    });
    sections.push('');
  }

  // Issues
  if (selectedSections.has('issues')) {
    sections.push('=== SEO ISSUES ===');
    sections.push('Severity,Category,Message,Suggestion');
    result.issues.forEach(issue => {
      sections.push(
        `${issue.severity},${issue.category},${escapeCSV(issue.message)},${escapeCSV(issue.suggestion || '')}`
      );
    });
    sections.push('');
  }

  return sections.join('\n');
}

export function downloadCSV(
  result: SEOAnalysisResult,
  options: ExportOptions
): void {
  const csvString = exportToCSV(result, options);
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `crawlix-seo-analysis-${new Date().getTime()}.csv`;

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
