'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SEOAnalysisResult, FetchError } from '@/types/analysis';
import { fetchHTMLWithFallback } from '@/lib/fetchers';
import { analyzeSEO, calculateSEOScore, getSEOScoreRating } from '@/lib/seo-analyzer';
import { useSessionStorage } from '@/hooks/useSessionStorage';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ResultsSection } from '@/components/analyzer/ResultsSection';
import { downloadJSON } from '@/lib/exporters/json-exporter';
import { downloadCSV } from '@/lib/exporters/csv-exporter';
import { downloadMarkdown } from '@/lib/exporters/markdown-exporter';
import { downloadText } from '@/lib/exporters/text-exporter';
import type { ExportOptions } from '@/lib/exporters/json-exporter';

type ExportFormat = 'json' | 'csv' | 'markdown' | 'text';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FetchError | null>(null);
  const [result, setResult] = useState<SEOAnalysisResult | null>(null);
  const { saveResult } = useSessionStorage();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Fetch HTML
      const fetchResult = await fetchHTMLWithFallback(url.trim());

      // Analyze SEO
      const analysis = await analyzeSEO(fetchResult.html, fetchResult.url);

      // Save to session
      saveResult(analysis);

      // Set result
      setResult(analysis);
    } catch (err) {
      console.error('Analysis error:', err);
      if (err && typeof err === 'object' && 'type' in err) {
        setError(err as FetchError);
      } else {
        setError({
          type: 'UNKNOWN',
          message: 'Failed to analyze URL',
          details: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError(null);
  };

  const handleExport = (format: ExportFormat, selectedSections: Set<string>) => {
    if (!result) {
      console.error('No result to export');
      return;
    }

    if (selectedSections.size === 0) {
      console.warn('No sections selected for export');
      return;
    }

    const exportOptions: ExportOptions = {
      selectedSections,
      prettyPrint: true,
    };

    try {
      switch (format) {
        case 'json':
          downloadJSON(result, exportOptions);
          break;
        case 'csv':
          downloadCSV(result, exportOptions);
          break;
        case 'markdown':
          downloadMarkdown(result, exportOptions);
          break;
        case 'text':
          downloadText(result, exportOptions);
          break;
        default:
          console.error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      setError({
        type: 'UNKNOWN',
        message: 'Export failed. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="text-center max-w-4xl mx-auto mb-20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-lofi-brown via-lofi-sage to-lofi-rose bg-clip-text text-transparent">
            Crawlix
          </h2>
          <p className="text-xl md:text-2xl text-brand-muted mb-2">
            Your cozy SEO companion
          </p>
        </motion.div>

        <p className="text-lg text-brand-muted mb-10 max-w-2xl mx-auto">
          Analyze any webpage's SEO instantly in your browser. Check meta tags, content structure, readability, and more - all for free.
        </p>

        {/* URL Input Form */}
        <motion.form
          onSubmit={handleAnalyze}
          className="max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to analyze..."
              className="flex-1 px-6 py-4 rounded-2xl border-2 border-lofi-sand bg-white/80 backdrop-blur-sm text-brand-text placeholder:text-brand-muted/50 focus:border-lofi-brown focus:outline-none focus:ring-4 focus:ring-lofi-brown/10 transition-all shadow-sm hover:shadow-md"
              disabled={isLoading}
              required
            />
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !url.trim()}
              className="shadow-lg"
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 text-sm text-brand-muted/70"
        >
          <span className="flex items-center gap-1">
            <span className="text-lofi-sage">✓</span> 100% free
          </span>
          <span className="hidden sm:inline text-brand-muted/30">•</span>
          <span className="flex items-center gap-1">
            <span className="text-lofi-sage">✓</span> No registration
          </span>
          <span className="hidden sm:inline text-brand-muted/30">•</span>
          <span className="flex items-center gap-1">
            <span className="text-lofi-sage">✓</span> Privacy-friendly
          </span>
        </motion.div>
      </motion.section>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <Alert type="error" title={error.message} onClose={() => setError(null)}>
              {error.details}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-brand-muted">Fetching and analyzing webpage...</p>
          <p className="text-sm text-brand-muted/70 mt-2">This may take a few seconds</p>
        </motion.div>
      )}

      {/* Results Display */}
      <AnimatePresence>
        {result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-lofi-brown to-lofi-sage bg-clip-text text-transparent">
                  Analysis Results
                </h3>
                <p className="text-brand-muted text-sm md:text-base">
                  <span className="font-mono text-lofi-brown bg-lofi-sand/40 px-3 py-1 rounded-lg">
                    {result.url}
                  </span>
                </p>
              </div>
            </motion.div>

            {/* SEO Score Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="mb-10 text-center bg-gradient-to-br from-lofi-cream via-white to-lofi-sand/30 border-2 border-lofi-sand shadow-xl">
                <div className="flex flex-col items-center py-6">
                  <div className="text-7xl md:text-8xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-lofi-brown via-lofi-sage to-lofi-rose bg-clip-text text-transparent">
                      {calculateSEOScore(result)}
                    </span>
                    <span className="text-4xl text-brand-muted/50">/100</span>
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold mb-3 text-lofi-coffee">
                    {getSEOScoreRating(calculateSEOScore(result)).rating}
                  </h4>
                  <p className="text-brand-muted max-w-md">
                    {getSEOScoreRating(calculateSEOScore(result)).description}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Detailed Results Section */}
            <ResultsSection result={result} onExport={handleExport} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Section (only show when no results) */}
      {!result && !isLoading && (
        <>
          <section id="features" className="max-w-6xl mx-auto mb-20">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-lofi-brown to-lofi-sage bg-clip-text text-transparent"
            >
              What We Analyze
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                >
                  <Card hover className="bg-gradient-to-br from-white to-lofi-cream border-2 border-lofi-sand/50 hover:border-lofi-brown/30 transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lofi-brown/10 to-lofi-sage/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-3xl">{feature.icon}</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-lofi-coffee">{feature.title}</h4>
                    <p className="text-sm text-brand-muted leading-relaxed">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="how-it-works" className="max-w-4xl mx-auto mb-16">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-lofi-sage to-lofi-rose bg-clip-text text-transparent"
            >
              How It Works
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-lofi-brown to-lofi-sage text-white text-3xl font-bold flex items-center justify-center mx-auto mb-6 shadow-lg">
                    {index + 1}
                  </div>
                  <h4 className="font-bold text-xl mb-3 text-lofi-coffee">{step.title}</h4>
                  <p className="text-sm text-brand-muted leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

const features = [
  {
    icon: '🏷️',
    title: 'Meta Tags',
    description: 'Analyze title, description, Open Graph, Twitter cards, and more.',
  },
  {
    icon: '📊',
    title: 'Readability',
    description: 'Calculate Flesch Reading Ease score and grade level.',
  },
  {
    icon: '🔑',
    title: 'Keywords',
    description: 'Analyze keyword density and frequency for 1, 2, and 3-word phrases.',
  },
  {
    icon: '🖼️',
    title: 'Images',
    description: 'Check alt text, dimensions, and lazy loading attributes.',
  },
  {
    icon: '🔗',
    title: 'Links',
    description: 'Categorize internal, external, and anchor links.',
  },
  {
    icon: '📋',
    title: 'Headings',
    description: 'Analyze heading hierarchy (H1-H6) and structure.',
  },
  {
    icon: '🎯',
    title: 'Schema',
    description: 'Parse and validate JSON-LD structured data.',
  },
  {
    icon: '⚠️',
    title: 'Issues',
    description: 'Detect and categorize SEO issues with actionable suggestions.',
  },
];

const steps = [
  {
    title: 'Enter URL',
    description: 'Paste any public webpage URL you want to analyze.',
  },
  {
    title: 'Fetch & Parse',
    description: 'Crawlix fetches and analyzes the page in your browser.',
  },
  {
    title: 'Get Insights',
    description: 'View detailed SEO metrics, issues, and export results.',
  },
];
