'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SEOAnalysisResult } from '@/types/analysis';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type ExportFormat = 'json' | 'csv' | 'markdown' | 'text';

interface ResultsSectionProps {
  result: SEOAnalysisResult;
  onExport: (format: ExportFormat, selectedSections: Set<string>) => void;
}

export function ResultsSection({ result, onExport }: ResultsSectionProps) {
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set([
    'meta', 'headings', 'images', 'links', 'schema', 'readability', 'keywords', 'issues'
  ]));
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['meta']));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    const newSelected = new Set(selectedSections);
    if (newSelected.has(section)) {
      newSelected.delete(section);
    } else {
      newSelected.add(section);
    }
    setSelectedSections(newSelected);
  };

  const toggleExpanded = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Helper to construct full image URL
  const getFullImageUrl = (src: string): string => {
    // If already absolute URL, return as is
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return src;
    }

    // Get the base URL from the analyzed result
    try {
      const baseUrl = new URL(result.url);

      // Handle protocol-relative URLs (//example.com/image.jpg)
      if (src.startsWith('//')) {
        return `${baseUrl.protocol}${src}`;
      }

      // Handle absolute paths (/images/photo.jpg)
      if (src.startsWith('/')) {
        return `${baseUrl.origin}${src}`;
      }

      // Handle relative paths (images/photo.jpg)
      const pathParts = baseUrl.pathname.split('/');
      pathParts.pop(); // Remove last segment
      return `${baseUrl.origin}${pathParts.join('/')}/${src}`;
    } catch (err) {
      console.error('Error constructing image URL:', err);
      return src;
    }
  };

  // Keyboard support for image lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const sections = [
    { id: 'meta', name: 'Meta Tags & SEO Headers', icon: '🏷️' },
    { id: 'headings', name: 'Headings Structure', icon: '📋' },
    { id: 'images', name: 'Images & Alt Text', icon: '🖼️' },
    { id: 'links', name: 'Links Analysis', icon: '🔗' },
    { id: 'schema', name: 'Schema & Structured Data', icon: '🎯' },
    { id: 'readability', name: 'Content Readability', icon: '📊' },
    { id: 'keywords', name: 'Keyword Density', icon: '🔑' },
    { id: 'issues', name: 'SEO Issues & Suggestions', icon: '⚠️' },
  ];

  return (
    <div className="space-y-6">
      {/* Export & Section Selection */}
      <Card className="sticky top-4 z-10 bg-white/95 backdrop-blur">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold mb-2">Select Sections to View & Export</h4>
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => toggleSection(section.id)}
                  className={`px-3 py-1 text-sm rounded-full border-2 transition-all ${
                    selectedSections.has(section.id)
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'border-brand-primary/20 text-brand-text hover:border-brand-primary'
                  }`}
                >
                  {section.icon} {section.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {selectedSections.size === 0 && (
              <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                ⚠️ Please select at least one section to export
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => onExport('json', selectedSections)}
                disabled={selectedSections.size === 0}
              >
                📥 JSON
              </Button>
              <Button
                size="sm"
                onClick={() => onExport('csv', selectedSections)}
                disabled={selectedSections.size === 0}
              >
                📊 CSV
              </Button>
              <Button
                size="sm"
                onClick={() => onExport('markdown', selectedSections)}
                disabled={selectedSections.size === 0}
              >
                📝 Markdown
              </Button>
              <Button
                size="sm"
                onClick={() => onExport('text', selectedSections)}
                disabled={selectedSections.size === 0}
              >
                📄 Text
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Meta Tags Section */}
      {selectedSections.has('meta') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <button
              onClick={() => toggleExpanded('meta')}
              className="w-full flex items-center justify-between text-left"
            >
              <h4 className="text-xl font-bold flex items-center gap-2">
                🏷️ Meta Tags & SEO Headers
              </h4>
              <span className="text-2xl">{expandedSections.has('meta') ? '−' : '+'}</span>
            </button>

            {expandedSections.has('meta') && (
              <div className="mt-4 space-y-4">
                {/* Title */}
                <div>
                  <h5 className="font-semibold mb-2">Title Tag</h5>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-brand-text">
                      {result.metadata.title || (<span className="text-red-500">Missing!</span>)}
                    </p>
                    {result.metadata.title && (
                      <p className="text-xs text-brand-muted mt-1">
                        Length: {result.metadata.title.length} characters
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h5 className="font-semibold mb-2">Meta Description</h5>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-brand-text text-sm">
                      {result.metadata.description || (<span className="text-red-500">Missing!</span>)}
                    </p>
                    {result.metadata.description && (
                      <p className="text-xs text-brand-muted mt-1">
                        Length: {result.metadata.description.length} characters
                      </p>
                    )}
                  </div>
                </div>

                {/* Other Meta */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold mb-2 text-sm">Keywords</h5>
                    <p className="text-xs text-brand-muted">{result.metadata.keywords || 'Not set'}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2 text-sm">Canonical URL</h5>
                    <p className="text-xs text-brand-muted break-all">{result.metadata.canonicalUrl || 'Not set'}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2 text-sm">Robots</h5>
                    <p className="text-xs text-brand-muted">{result.metadata.robots || 'Not set'}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2 text-sm">Language</h5>
                    <p className="text-xs text-brand-muted">{result.metadata.language || 'Not set'}</p>
                  </div>
                </div>

                {/* Open Graph */}
                {result.metadata.ogTags.length > 0 && (
                  <div>
                    <h5 className="font-semibold mb-2">Open Graph Tags</h5>
                    <div className="space-y-2">
                      {result.metadata.ogTags.map((tag, i) => (
                        <div key={i} className="p-2 bg-gray-50 rounded text-sm">
                          <span className="font-mono text-brand-primary">{tag.property}</span>
                          <p className="text-brand-muted mt-1">{tag.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Twitter Cards */}
                {result.metadata.twitterTags.length > 0 && (
                  <div>
                    <h5 className="font-semibold mb-2">Twitter Card Tags</h5>
                    <div className="space-y-2">
                      {result.metadata.twitterTags.map((tag, i) => (
                        <div key={i} className="p-2 bg-gray-50 rounded text-sm">
                          <span className="font-mono text-brand-primary">{tag.name}</span>
                          <p className="text-brand-muted mt-1">{tag.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Headings Section */}
      {selectedSections.has('headings') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <button
              onClick={() => toggleExpanded('headings')}
              className="w-full flex items-center justify-between text-left"
            >
              <h4 className="text-xl font-bold flex items-center gap-2">
                📋 Headings Structure ({result.headings.length} total)
              </h4>
              <span className="text-2xl">{expandedSections.has('headings') ? '−' : '+'}</span>
            </button>

            {expandedSections.has('headings') && (
              <div className="mt-4 space-y-2">
                {result.headings.map((heading, i) => (
                  <div
                    key={i}
                    className="p-3 bg-gray-50 rounded-lg"
                    style={{ marginLeft: `${(heading.level - 1) * 16}px` }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="default">H{heading.level}</Badge>
                      <span className="text-xs text-brand-muted">{heading.wordCount} words</span>
                    </div>
                    <p className="text-sm text-brand-text">{heading.text}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Images Section */}
      {selectedSections.has('images') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <button
              onClick={() => toggleExpanded('images')}
              className="w-full flex items-center justify-between text-left"
            >
              <h4 className="text-xl font-bold flex items-center gap-2">
                🖼️ Images & Alt Text ({result.images.length} total)
              </h4>
              <span className="text-2xl">{expandedSections.has('images') ? '−' : '+'}</span>
            </button>

            {expandedSections.has('images') && (
              <div className="mt-4">
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    ✓ {result.stats.imagesWithAlt} images with alt text |
                    ✗ {result.stats.imagesWithoutAlt} images missing alt text
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.images.map((img, i) => {
                    const fullImageUrl = getFullImageUrl(img.src);
                    return (
                      <div key={i} className="border border-brand-primary/20 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div
                          className="relative w-full h-48 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 cursor-pointer group"
                          onClick={() => setSelectedImage(fullImageUrl)}
                        >
                          <img
                            src={fullImageUrl}
                            alt={img.alt || 'No alt'}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="100" y="100" text-anchor="middle" dy=".3em" fill="%23999" font-size="48"%3E✕%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold bg-black/50 px-3 py-1 rounded">
                            🔍 Click to Preview
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-white">
                        <div className="flex items-center gap-2 mb-2">
                          {img.alt ? (
                            <Badge variant="success">✓ Has Alt</Badge>
                          ) : (
                            <Badge variant="error">✗ No Alt</Badge>
                          )}
                          {img.loading === 'lazy' && <Badge variant="info">Lazy</Badge>}
                          {img.width && img.height && (
                            <span className="text-xs text-brand-muted">{img.width}×{img.height}</span>
                          )}
                        </div>
                        {img.alt && (
                          <p className="text-sm text-brand-text mb-2 font-medium">&quot;{img.alt}&quot;</p>
                        )}
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-brand-muted truncate flex-1" title={fullImageUrl}>{fullImageUrl}</p>
                          <button
                            onClick={() => copyToClipboard(fullImageUrl, `img-${i}`)}
                            className="text-brand-primary hover:text-brand-secondary text-xs p-1 rounded hover:bg-brand-primary/10 transition-colors"
                            title="Copy URL"
                          >
                            {copiedText === `img-${i}` ? '✓' : '📋'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Links Section */}
      {selectedSections.has('links') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <button
              onClick={() => toggleExpanded('links')}
              className="w-full flex items-center justify-between text-left"
            >
              <h4 className="text-xl font-bold flex items-center gap-2">
                🔗 Links Analysis ({result.links.length} total)
              </h4>
              <span className="text-2xl">{expandedSections.has('links') ? '−' : '+'}</span>
            </button>

            {expandedSections.has('links') && (
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-700">{result.stats.internalLinks}</div>
                    <div className="text-xs text-green-600">Internal</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">{result.stats.externalLinks}</div>
                    <div className="text-xs text-blue-600">External</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-700">{result.stats.anchorLinks}</div>
                    <div className="text-xs text-purple-600">Anchor</div>
                  </div>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {result.links.slice(0, 50).map((link, i) => (
                    <div key={i} className="group p-3 bg-gray-50 hover:bg-brand-primary/5 rounded-lg border border-transparent hover:border-brand-primary/20 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={
                          link.type === 'internal' ? 'success' :
                          link.type === 'external' ? 'info' : 'default'
                        }>
                          {link.type}
                        </Badge>
                        {link.nofollow && <Badge variant="warning">nofollow</Badge>}
                        {link.target === '_blank' && <Badge variant="info">new tab</Badge>}
                      </div>
                      {link.anchorText && (
                        <p className="text-sm text-brand-text mb-2 font-medium">
                          {link.anchorText}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-brand-primary hover:text-brand-secondary hover:underline truncate flex-1 flex items-center gap-1"
                          title={link.href}
                        >
                          <span className="truncate">{link.href}</span>
                          <span className="flex-shrink-0">↗</span>
                        </a>
                        <button
                          onClick={() => copyToClipboard(link.href, `link-${i}`)}
                          className="text-brand-primary hover:text-brand-secondary text-xs p-1 rounded hover:bg-brand-primary/10 transition-colors flex-shrink-0"
                          title="Copy URL"
                        >
                          {copiedText === `link-${i}` ? '✓' : '📋'}
                        </button>
                      </div>
                    </div>
                  ))}
                  {result.links.length > 50 && (
                    <p className="text-sm text-brand-muted text-center py-2">
                      + {result.links.length - 50} more links
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Schema Section */}
      {selectedSections.has('schema') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <button
              onClick={() => toggleExpanded('schema')}
              className="w-full flex items-center justify-between text-left"
            >
              <h4 className="text-xl font-bold flex items-center gap-2">
                🎯 Schema & Structured Data ({result.schema.length} found)
              </h4>
              <span className="text-2xl">{expandedSections.has('schema') ? '−' : '+'}</span>
            </button>

            {expandedSections.has('schema') && (
              <div className="mt-4 space-y-4">
                {result.schema.length === 0 ? (
                  <p className="text-brand-muted text-center py-4">No structured data found</p>
                ) : (
                  result.schema.map((schema, i) => (
                    <div key={i} className="border border-brand-primary/20 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-3 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={schema.isValid ? 'success' : 'error'}>
                            {schema.isValid ? '✓ Valid' : '✗ Invalid'}
                          </Badge>
                          <span className="font-semibold text-brand-text">{schema.type}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(schema.rawJson, `schema-${i}`)}
                          className="flex items-center gap-1 px-3 py-1 text-xs bg-white hover:bg-brand-primary text-brand-primary hover:text-white rounded transition-colors border border-brand-primary/20"
                          title="Copy JSON"
                        >
                          {copiedText === `schema-${i}` ? (
                            <>✓ Copied!</>
                          ) : (
                            <>📋 Copy JSON</>
                          )}
                        </button>
                      </div>
                      <div className="max-h-64 overflow-auto relative">
                        <SyntaxHighlighter
                          language="json"
                          style={vscDarkPlus}
                          customStyle={{ margin: 0, fontSize: '0.75rem', background: '#1e1e1e' }}
                          showLineNumbers
                        >
                          {schema.rawJson}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Readability Section */}
      {selectedSections.has('readability') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <h4 className="text-xl font-bold mb-4">📊 Content Readability</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-6 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-lg">
                <div className="text-5xl font-bold gradient-text mb-2">
                  {result.readability.fleschScore}
                </div>
                <div className="font-semibold mb-1">{result.readability.gradeLevel}</div>
                <div className="text-sm text-brand-muted">{result.readability.interpretation}</div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Sentences</span>
                  <span className="text-sm text-brand-muted">{result.readability.statistics.sentences}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Words</span>
                  <span className="text-sm text-brand-muted">{result.readability.statistics.words}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Avg Words/Sentence</span>
                  <span className="text-sm text-brand-muted">{result.readability.statistics.avgWordsPerSentence}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Keywords Section */}
      {selectedSections.has('keywords') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <button
              onClick={() => toggleExpanded('keywords')}
              className="w-full flex items-center justify-between text-left"
            >
              <h4 className="text-xl font-bold flex items-center gap-2">
                🔑 Keyword Density
              </h4>
              <span className="text-2xl">{expandedSections.has('keywords') ? '−' : '+'}</span>
            </button>

            {expandedSections.has('keywords') && (
              <div className="mt-4">
                <div className="grid gap-4">
                  {[1, 2, 3].map((ngram) => (
                    <div key={ngram}>
                      <h5 className="font-semibold mb-2">{ngram}-Word Phrases</h5>
                      <div className="space-y-1">
                        {result.keywords
                          .filter(k => k.nGram === ngram)
                          .slice(0, 10)
                          .map((keyword, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{keyword.phrase}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-brand-muted">{keyword.count}×</span>
                                <span className="text-xs font-semibold text-brand-primary">{keyword.percentage.toFixed(2)}%</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Issues Section */}
      {selectedSections.has('issues') && result.issues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <h4 className="text-xl font-bold mb-4">⚠️ SEO Issues & Suggestions</h4>
            <div className="space-y-3">
              {result.issues.map((issue, i) => (
                <div key={i} className="p-4 border-l-4 rounded-r-lg" style={{
                  borderColor: issue.severity === 'critical' ? '#EF4444' :
                              issue.severity === 'warning' ? '#F59E0B' : '#3B82F6',
                  backgroundColor: issue.severity === 'critical' ? '#FEE2E2' :
                                  issue.severity === 'warning' ? '#FEF3C7' : '#DBEAFE'
                }}>
                  <div className="flex items-start gap-3">
                    <Badge variant={
                      issue.severity === 'critical' ? 'error' :
                      issue.severity === 'warning' ? 'warning' : 'info'
                    }>
                      {issue.severity}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="text-xs opacity-80">{issue.suggestion}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-7xl max-h-[90vh] cursor-default"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-brand-accent text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Close (ESC)"
              >
                ✕
              </button>
              <img
                src={selectedImage}
                alt="Preview"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={() => setSelectedImage(null)}
              />
              <div className="absolute -bottom-12 left-0 right-0 text-center">
                <a
                  href={selectedImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-brand-accent text-sm underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open in new tab ↗
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
