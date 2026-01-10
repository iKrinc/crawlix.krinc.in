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

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl mx-auto mb-16"
      >
        <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
          SEO Analyzer
        </h2>
        <p className="text-xl text-brand-muted mb-8">
          Analyze any webpage's SEO instantly in your browser. Check meta tags, content structure, readability, keyword density, and more.
        </p>

        {/* URL Input Form */}
        <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL (google.com, www.example.com, https://...)"
              className="flex-1 px-6 py-4 rounded-lg border-2 border-brand-primary/20 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
              disabled={isLoading}
              required
            />
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </form>

        <p className="text-sm text-brand-muted">
          100% free • No registration required • Privacy-friendly
        </p>
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-2">Analysis Results</h3>
                <p className="text-brand-muted text-sm">
                  Analyzed: <span className="font-mono text-brand-text">{result.url}</span>
                </p>
              </div>
              <Button variant="outline" onClick={handleReset}>
                New Analysis
              </Button>
            </div>

            {/* SEO Score Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="mb-8 text-center bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5">
                <div className="flex flex-col items-center">
                  <div className="text-6xl font-bold mb-4">
                    <span className="gradient-text">{calculateSEOScore(result)}</span>
                    <span className="text-3xl text-brand-muted">/100</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-2">
                    {getSEOScoreRating(calculateSEOScore(result)).rating}
                  </h4>
                  <p className="text-brand-muted">
                    {getSEOScoreRating(calculateSEOScore(result)).description}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Words', value: result.stats.totalWords },
                { label: 'Total Images', value: result.stats.totalImages },
                { label: 'Total Links', value: result.stats.totalLinks },
                { label: 'H1 Count', value: result.stats.h1Count },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Card className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                    <div className="text-sm text-brand-muted">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Issues Summary */}
            {result.issues.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <Card>
                  <h4 className="text-xl font-bold mb-4">SEO Issues Found</h4>
                  <div className="space-y-3">
                    {result.issues.slice(0, 5).map((issue, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Badge
                          variant={
                            issue.severity === 'critical' ? 'error' :
                            issue.severity === 'warning' ? 'warning' : 'info'
                          }
                        >
                          {issue.severity}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{issue.message}</p>
                          {issue.suggestion && (
                            <p className="text-xs text-brand-muted mt-1">{issue.suggestion}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {result.issues.length > 5 && (
                    <p className="text-sm text-brand-muted mt-4 text-center">
                      + {result.issues.length - 5} more issues
                    </p>
                  )}
                </Card>
              </motion.div>
            )}

            {/* Readability Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <h4 className="text-xl font-bold mb-4">Readability Score</h4>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold gradient-text">
                    {result.readability.fleschScore}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{result.readability.gradeLevel}</p>
                    <p className="text-sm text-brand-muted">{result.readability.interpretation}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* More sections coming... */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Section (only show when no results) */}
      {!result && !isLoading && (
        <>
          <section id="features" className="max-w-6xl mx-auto mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">
              Comprehensive SEO Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center mb-4">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                    <p className="text-sm text-brand-muted">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="how-it-works" className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                  <p className="text-sm text-brand-muted">{step.description}</p>
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
