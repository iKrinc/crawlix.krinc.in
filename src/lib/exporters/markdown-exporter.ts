import type { SEOAnalysisResult } from '@/types/analysis';
import type { ExportOptions } from './json-exporter';

export function exportToMarkdown(
  result: SEOAnalysisResult,
  options: ExportOptions
): string {
  const { selectedSections } = options;
  const sections: string[] = [];

  // Header
  sections.push('# SEO Analysis Report');
  sections.push('');
  sections.push(`**URL:** ${result.url}`);
  sections.push(`**Analyzed:** ${new Date(result.fetchedAt).toLocaleString()}`);
  sections.push('');
  sections.push('---');
  sections.push('');

  // Summary Statistics
  sections.push('## Summary Statistics');
  sections.push('');
  sections.push('| Metric | Value |');
  sections.push('|--------|-------|');
  sections.push(`| Total Words | ${result.stats.totalWords} |`);
  sections.push(`| Total Images | ${result.stats.totalImages} |`);
  sections.push(`| Total Links | ${result.stats.totalLinks} |`);
  sections.push(`| H1 Count | ${result.stats.h1Count} |`);
  sections.push(`| Schema Count | ${result.stats.schemaCount} |`);
  sections.push('');

  // Meta Tags
  if (selectedSections.has('meta')) {
    sections.push('## Meta Tags & SEO Headers');
    sections.push('');
    sections.push('### Basic Meta Tags');
    sections.push('');
    sections.push('| Property | Value | Length |');
    sections.push('|----------|-------|--------|');
    sections.push(`| Title | ${result.metadata.title || 'N/A'} | ${result.metadata.title?.length || 0} |`);
    sections.push(`| Description | ${result.metadata.description || 'N/A'} | ${result.metadata.description?.length || 0} |`);
    sections.push(`| Keywords | ${result.metadata.keywords || 'N/A'} | - |`);
    sections.push(`| Canonical | ${result.metadata.canonicalUrl || 'N/A'} | - |`);
    sections.push(`| Robots | ${result.metadata.robots || 'N/A'} | - |`);
    sections.push(`| Language | ${result.metadata.language || 'N/A'} | - |`);
    sections.push(`| Viewport | ${result.metadata.viewport || 'N/A'} | - |`);
    sections.push('');

    if (result.metadata.ogTags && result.metadata.ogTags.length > 0) {
      sections.push('### Open Graph Tags');
      sections.push('');
      sections.push('| Property | Value |');
      sections.push('|----------|-------|');
      result.metadata.ogTags.forEach((tag) => {
        sections.push(`| ${tag.property} | ${tag.content || 'N/A'} |`);
      });
      sections.push('');
    }

    if (result.metadata.twitterTags && result.metadata.twitterTags.length > 0) {
      sections.push('### Twitter Card Tags');
      sections.push('');
      sections.push('| Name | Value |');
      sections.push('|------|-------|');
      result.metadata.twitterTags.forEach((tag) => {
        sections.push(`| ${tag.name} | ${tag.content || 'N/A'} |`);
      });
      sections.push('');
    }
  }

  // Headings
  if (selectedSections.has('headings')) {
    sections.push('## Headings Structure');
    sections.push('');
    result.headings.forEach(heading => {
      const indent = '  '.repeat(heading.level - 1);
      sections.push(`${indent}- **H${heading.level}**: ${heading.text} _(${heading.wordCount} words)_`);
    });
    sections.push('');
  }

  // Images
  if (selectedSections.has('images')) {
    sections.push('## Images');
    sections.push('');
    sections.push('| Source | Alt Text | Dimensions | Loading |');
    sections.push('|--------|----------|------------|---------|');
    result.images.forEach(img => {
      const dimensions = img.width && img.height ? `${img.width}x${img.height}` : 'N/A';
      sections.push(`| ${img.src} | ${img.alt || '⚠️ Missing'} | ${dimensions} | ${img.loading || 'N/A'} |`);
    });
    sections.push('');
  }

  // Links
  if (selectedSections.has('links')) {
    sections.push('## Links');
    sections.push('');

    const internalLinks = result.links.filter(l => l.type === 'internal');
    const externalLinks = result.links.filter(l => l.type === 'external');
    const anchorLinks = result.links.filter(l => l.type === 'anchor');

    if (internalLinks.length > 0) {
      sections.push(`### Internal Links (${internalLinks.length})`);
      sections.push('');
      sections.push('| URL | Anchor Text |');
      sections.push('|-----|-------------|');
      internalLinks.slice(0, 20).forEach(link => {
        sections.push(`| ${link.href} | ${link.anchorText || '(no text)'} |`);
      });
      if (internalLinks.length > 20) {
        sections.push(`| ... | _${internalLinks.length - 20} more links_ |`);
      }
      sections.push('');
    }

    if (externalLinks.length > 0) {
      sections.push(`### External Links (${externalLinks.length})`);
      sections.push('');
      sections.push('| URL | Anchor Text | Rel |');
      sections.push('|-----|-------------|-----|');
      externalLinks.slice(0, 20).forEach(link => {
        sections.push(`| ${link.href} | ${link.anchorText || '(no text)'} | ${link.rel || '-'} |`);
      });
      if (externalLinks.length > 20) {
        sections.push(`| ... | ... | _${externalLinks.length - 20} more links_ |`);
      }
      sections.push('');
    }

    if (anchorLinks.length > 0) {
      sections.push(`### Anchor Links (${anchorLinks.length})`);
      sections.push('');
      anchorLinks.forEach(link => {
        sections.push(`- ${link.href}: ${link.anchorText || '(no text)'}`);
      });
      sections.push('');
    }
  }

  // Schema
  if (selectedSections.has('schema')) {
    sections.push('## Structured Data (JSON-LD)');
    sections.push('');
    if (result.schema.length === 0) {
      sections.push('_No structured data found._');
      sections.push('');
    } else {
      result.schema.forEach((schema, index) => {
        sections.push(`### Schema ${index + 1}: ${schema.type} ${schema.isValid ? '✓' : '⚠️'}`);
        sections.push('');
        sections.push('```json');
        sections.push(schema.rawJson);
        sections.push('```');
        sections.push('');
      });
    }
  }

  // Readability
  if (selectedSections.has('readability')) {
    sections.push('## Readability Score');
    sections.push('');
    sections.push(`**Flesch Reading Ease:** ${result.readability.fleschScore}`);
    sections.push('');
    sections.push(`**Grade Level:** ${result.readability.gradeLevel}`);
    sections.push('');
    sections.push(`**Interpretation:** ${result.readability.interpretation}`);
    sections.push('');
    sections.push('### Statistics');
    sections.push('');
    sections.push('| Metric | Value |');
    sections.push('|--------|-------|');
    sections.push(`| Sentences | ${result.readability.statistics.sentences} |`);
    sections.push(`| Words | ${result.readability.statistics.words} |`);
    sections.push(`| Syllables | ${result.readability.statistics.syllables} |`);
    sections.push(`| Avg Words/Sentence | ${result.readability.statistics.avgWordsPerSentence.toFixed(2)} |`);
    sections.push(`| Avg Syllables/Word | ${result.readability.statistics.avgSyllablesPerWord.toFixed(2)} |`);
    sections.push('');
  }

  // Keywords
  if (selectedSections.has('keywords')) {
    sections.push('## Top Keywords');
    sections.push('');

    const singleWords = result.keywords.filter(k => k.nGram === 1);
    const twoWords = result.keywords.filter(k => k.nGram === 2);
    const threeWords = result.keywords.filter(k => k.nGram === 3);

    if (singleWords.length > 0) {
      sections.push('### Single Words');
      sections.push('');
      sections.push('| Phrase | Count | Percentage |');
      sections.push('|--------|-------|------------|');
      singleWords.slice(0, 10).forEach(kw => {
        sections.push(`| ${kw.phrase} | ${kw.count} | ${kw.percentage.toFixed(2)}% |`);
      });
      sections.push('');
    }

    if (twoWords.length > 0) {
      sections.push('### Two-Word Phrases');
      sections.push('');
      sections.push('| Phrase | Count | Percentage |');
      sections.push('|--------|-------|------------|');
      twoWords.slice(0, 10).forEach(kw => {
        sections.push(`| ${kw.phrase} | ${kw.count} | ${kw.percentage.toFixed(2)}% |`);
      });
      sections.push('');
    }

    if (threeWords.length > 0) {
      sections.push('### Three-Word Phrases');
      sections.push('');
      sections.push('| Phrase | Count | Percentage |');
      sections.push('|--------|-------|------------|');
      threeWords.slice(0, 10).forEach(kw => {
        sections.push(`| ${kw.phrase} | ${kw.count} | ${kw.percentage.toFixed(2)}% |`);
      });
      sections.push('');
    }
  }

  // Issues
  if (selectedSections.has('issues')) {
    sections.push('## SEO Issues');
    sections.push('');

    const critical = result.issues.filter(i => i.severity === 'critical');
    const warnings = result.issues.filter(i => i.severity === 'warning');
    const recommendations = result.issues.filter(i => i.severity === 'recommendation');

    if (critical.length > 0) {
      sections.push('### 🔴 Critical Issues');
      sections.push('');
      critical.forEach(issue => {
        sections.push(`- **${issue.message}**`);
        if (issue.suggestion) {
          sections.push(`  - _Suggestion: ${issue.suggestion}_`);
        }
      });
      sections.push('');
    }

    if (warnings.length > 0) {
      sections.push('### 🟡 Warnings');
      sections.push('');
      warnings.forEach(issue => {
        sections.push(`- **${issue.message}**`);
        if (issue.suggestion) {
          sections.push(`  - _Suggestion: ${issue.suggestion}_`);
        }
      });
      sections.push('');
    }

    if (recommendations.length > 0) {
      sections.push('### 🔵 Recommendations');
      sections.push('');
      recommendations.forEach(issue => {
        sections.push(`- **${issue.message}**`);
        if (issue.suggestion) {
          sections.push(`  - _Suggestion: ${issue.suggestion}_`);
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
  sections.push('---');
  sections.push('');
  sections.push('_Generated by [Crawlix](https://crawlix.krinc.in) - Free Frontend SEO Analyzer_');

  return sections.join('\n');
}

export function downloadMarkdown(
  result: SEOAnalysisResult,
  options: ExportOptions
): void {
  const markdownString = exportToMarkdown(result, options);
  const blob = new Blob([markdownString], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `crawlix-seo-analysis-${new Date().getTime()}.md`;

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
