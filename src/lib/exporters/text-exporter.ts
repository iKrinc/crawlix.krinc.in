import type { SEOAnalysisResult } from '@/types/analysis';
import type { ExportOptions } from './json-exporter';

export function exportToText(
  result: SEOAnalysisResult,
  options: ExportOptions
): string {
  const { selectedSections } = options;
  const sections: string[] = [];
  const divider = '='.repeat(80);
  const subDivider = '-'.repeat(80);

  // Header
  sections.push(divider);
  sections.push('SEO ANALYSIS REPORT');
  sections.push(divider);
  sections.push('');
  sections.push(`URL: ${result.url}`);
  sections.push(`Analyzed: ${new Date(result.fetchedAt).toLocaleString()}`);
  sections.push('');

  // Summary Statistics
  sections.push(divider);
  sections.push('SUMMARY STATISTICS');
  sections.push(divider);
  sections.push('');
  sections.push(`Total Words:     ${result.stats.totalWords}`);
  sections.push(`Total Images:    ${result.stats.totalImages}`);
  sections.push(`Total Links:     ${result.stats.totalLinks}`);
  sections.push(`H1 Count:        ${result.stats.h1Count}`);
  sections.push(`Schema Count:    ${result.stats.schemaCount}`);
  sections.push('');

  // Meta Tags
  if (selectedSections.has('meta')) {
    sections.push(divider);
    sections.push('META TAGS & SEO HEADERS');
    sections.push(divider);
    sections.push('');
    sections.push('Basic Meta Tags:');
    sections.push(subDivider);
    sections.push(`Title: ${result.metadata.title || 'N/A'}`);
    sections.push(`  Length: ${result.metadata.title?.length || 0} characters`);
    sections.push('');
    sections.push(`Description: ${result.metadata.description || 'N/A'}`);
    sections.push(`  Length: ${result.metadata.description?.length || 0} characters`);
    sections.push('');
    sections.push(`Keywords: ${result.metadata.keywords || 'N/A'}`);
    sections.push(`Canonical: ${result.metadata.canonicalUrl || 'N/A'}`);
    sections.push(`Robots: ${result.metadata.robots || 'N/A'}`);
    sections.push(`Language: ${result.metadata.language || 'N/A'}`);
    sections.push(`Viewport: ${result.metadata.viewport || 'N/A'}`);
    sections.push('');

    if (result.metadata.ogTags && result.metadata.ogTags.length > 0) {
      sections.push('Open Graph Tags:');
      sections.push(subDivider);
      result.metadata.ogTags.forEach((tag) => {
        sections.push(`  ${tag.property}: ${tag.content || 'N/A'}`);
      });
      sections.push('');
    }

    if (result.metadata.twitterTags && result.metadata.twitterTags.length > 0) {
      sections.push('Twitter Card Tags:');
      sections.push(subDivider);
      result.metadata.twitterTags.forEach((tag) => {
        sections.push(`  ${tag.name}: ${tag.content || 'N/A'}`);
      });
      sections.push('');
    }
  }

  // Headings
  if (selectedSections.has('headings')) {
    sections.push(divider);
    sections.push('HEADINGS STRUCTURE');
    sections.push(divider);
    sections.push('');
    result.headings.forEach(heading => {
      const indent = '  '.repeat(heading.level - 1);
      sections.push(`${indent}[H${heading.level}] ${heading.text} (${heading.wordCount} words)`);
    });
    sections.push('');
  }

  // Images
  if (selectedSections.has('images')) {
    sections.push(divider);
    sections.push(`IMAGES (${result.images.length} total)`);
    sections.push(divider);
    sections.push('');
    result.images.forEach((img, index) => {
      sections.push(`Image ${index + 1}:`);
      sections.push(`  Source: ${img.src}`);
      sections.push(`  Alt Text: ${img.alt || '⚠️ MISSING'}`);
      if (img.width && img.height) {
        sections.push(`  Dimensions: ${img.width}x${img.height}`);
      }
      if (img.loading) {
        sections.push(`  Loading: ${img.loading}`);
      }
      sections.push('');
    });
  }

  // Links
  if (selectedSections.has('links')) {
    sections.push(divider);
    sections.push('LINKS');
    sections.push(divider);
    sections.push('');

    const internalLinks = result.links.filter(l => l.type === 'internal');
    const externalLinks = result.links.filter(l => l.type === 'external');
    const anchorLinks = result.links.filter(l => l.type === 'anchor');

    if (internalLinks.length > 0) {
      sections.push(`Internal Links (${internalLinks.length}):`);
      sections.push(subDivider);
      internalLinks.slice(0, 20).forEach((link, index) => {
        sections.push(`  ${index + 1}. ${link.href}`);
        sections.push(`     Anchor: ${link.anchorText || '(no text)'}`);
      });
      if (internalLinks.length > 20) {
        sections.push(`  ... and ${internalLinks.length - 20} more`);
      }
      sections.push('');
    }

    if (externalLinks.length > 0) {
      sections.push(`External Links (${externalLinks.length}):`);
      sections.push(subDivider);
      externalLinks.slice(0, 20).forEach((link, index) => {
        sections.push(`  ${index + 1}. ${link.href}`);
        sections.push(`     Anchor: ${link.anchorText || '(no text)'}`);
        if (link.rel) {
          sections.push(`     Rel: ${link.rel}`);
        }
      });
      if (externalLinks.length > 20) {
        sections.push(`  ... and ${externalLinks.length - 20} more`);
      }
      sections.push('');
    }

    if (anchorLinks.length > 0) {
      sections.push(`Anchor Links (${anchorLinks.length}):`);
      sections.push(subDivider);
      anchorLinks.forEach((link, index) => {
        sections.push(`  ${index + 1}. ${link.href}: ${link.anchorText || '(no text)'}`);
      });
      sections.push('');
    }
  }

  // Schema
  if (selectedSections.has('schema')) {
    sections.push(divider);
    sections.push('STRUCTURED DATA (JSON-LD)');
    sections.push(divider);
    sections.push('');
    if (result.schema.length === 0) {
      sections.push('No structured data found.');
      sections.push('');
    } else {
      result.schema.forEach((schema, index) => {
        sections.push(`Schema ${index + 1}: ${schema.type} ${schema.isValid ? '✓' : '⚠️'}`);
        sections.push(subDivider);
        sections.push(schema.rawJson);
        sections.push('');
      });
    }
  }

  // Readability
  if (selectedSections.has('readability')) {
    sections.push(divider);
    sections.push('READABILITY SCORE');
    sections.push(divider);
    sections.push('');
    sections.push(`Flesch Reading Ease: ${result.readability.fleschScore}`);
    sections.push(`Grade Level: ${result.readability.gradeLevel}`);
    sections.push(`Interpretation: ${result.readability.interpretation}`);
    sections.push('');
    sections.push('Statistics:');
    sections.push(subDivider);
    sections.push(`  Sentences:              ${result.readability.statistics.sentences}`);
    sections.push(`  Words:                  ${result.readability.statistics.words}`);
    sections.push(`  Syllables:              ${result.readability.statistics.syllables}`);
    sections.push(`  Avg Words/Sentence:     ${result.readability.statistics.avgWordsPerSentence.toFixed(2)}`);
    sections.push(`  Avg Syllables/Word:     ${result.readability.statistics.avgSyllablesPerWord.toFixed(2)}`);
    sections.push('');
  }

  // Keywords
  if (selectedSections.has('keywords')) {
    sections.push(divider);
    sections.push('TOP KEYWORDS');
    sections.push(divider);
    sections.push('');

    const singleWords = result.keywords.filter(k => k.nGram === 1);
    const twoWords = result.keywords.filter(k => k.nGram === 2);
    const threeWords = result.keywords.filter(k => k.nGram === 3);

    if (singleWords.length > 0) {
      sections.push('Single Words:');
      sections.push(subDivider);
      singleWords.slice(0, 10).forEach((kw, index) => {
        sections.push(`  ${index + 1}. ${kw.phrase.padEnd(30)} ${kw.count} times (${kw.percentage.toFixed(2)}%)`);
      });
      sections.push('');
    }

    if (twoWords.length > 0) {
      sections.push('Two-Word Phrases:');
      sections.push(subDivider);
      twoWords.slice(0, 10).forEach((kw, index) => {
        sections.push(`  ${index + 1}. ${kw.phrase.padEnd(30)} ${kw.count} times (${kw.percentage.toFixed(2)}%)`);
      });
      sections.push('');
    }

    if (threeWords.length > 0) {
      sections.push('Three-Word Phrases:');
      sections.push(subDivider);
      threeWords.slice(0, 10).forEach((kw, index) => {
        sections.push(`  ${index + 1}. ${kw.phrase.padEnd(30)} ${kw.count} times (${kw.percentage.toFixed(2)}%)`);
      });
      sections.push('');
    }
  }

  // Issues
  if (selectedSections.has('issues')) {
    sections.push(divider);
    sections.push('SEO ISSUES');
    sections.push(divider);
    sections.push('');

    const critical = result.issues.filter(i => i.severity === 'critical');
    const warnings = result.issues.filter(i => i.severity === 'warning');
    const recommendations = result.issues.filter(i => i.severity === 'recommendation');

    if (critical.length > 0) {
      sections.push('🔴 CRITICAL ISSUES:');
      sections.push(subDivider);
      critical.forEach((issue, index) => {
        sections.push(`  ${index + 1}. ${issue.message}`);
        if (issue.suggestion) {
          sections.push(`     Suggestion: ${issue.suggestion}`);
        }
      });
      sections.push('');
    }

    if (warnings.length > 0) {
      sections.push('🟡 WARNINGS:');
      sections.push(subDivider);
      warnings.forEach((issue, index) => {
        sections.push(`  ${index + 1}. ${issue.message}`);
        if (issue.suggestion) {
          sections.push(`     Suggestion: ${issue.suggestion}`);
        }
      });
      sections.push('');
    }

    if (recommendations.length > 0) {
      sections.push('🔵 RECOMMENDATIONS:');
      sections.push(subDivider);
      recommendations.forEach((issue, index) => {
        sections.push(`  ${index + 1}. ${issue.message}`);
        if (issue.suggestion) {
          sections.push(`     Suggestion: ${issue.suggestion}`);
        }
      });
      sections.push('');
    }

    if (result.issues.length === 0) {
      sections.push('✅ No SEO issues detected!');
      sections.push('');
    }
  }

  // Footer
  sections.push(divider);
  sections.push('Generated by Crawlix (https://crawlix.krinc.in)');
  sections.push('Free Frontend SEO Analyzer');
  sections.push(divider);

  return sections.join('\n');
}

export function downloadText(
  result: SEOAnalysisResult,
  options: ExportOptions
): void {
  const textString = exportToText(result, options);
  const blob = new Blob([textString], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `crawlix-seo-analysis-${new Date().getTime()}.txt`;

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
