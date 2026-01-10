// Core SEO Analysis Types

export interface SEOAnalysisResult {
  url: string;
  fetchedAt: string;
  metadata: MetaData;
  headings: Heading[];
  images: ImageInfo[];
  links: LinkInfo[];
  schema: SchemaData[];
  readability: ReadabilityScore;
  keywords: KeywordDensity[];
  issues: SEOIssue[];
  stats: Statistics;
}

export interface MetaData {
  title?: string;
  description?: string;
  keywords?: string;
  robots?: string;
  viewport?: string;
  charset?: string;
  language?: string;
  canonicalUrl?: string;
  favicon?: string;
  ogTags: OpenGraphTag[];
  twitterTags: TwitterCardTag[];
  other: MetaTag[];
}

export interface OpenGraphTag {
  property: string;
  content: string;
}

export interface TwitterCardTag {
  name: string;
  content: string;
}

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export interface Heading {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  wordCount: number;
}

export interface ImageInfo {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  title?: string;
}

export interface LinkInfo {
  href: string;
  anchorText: string;
  type: 'internal' | 'external' | 'anchor';
  rel?: string;
  target?: string;
  nofollow: boolean;
}

export interface SchemaData {
  type: string;
  rawJson: string;
  parsed: any;
  isValid: boolean;
  error?: string;
}

export interface ReadabilityScore {
  fleschScore: number;
  gradeLevel: string;
  interpretation: string;
  statistics: {
    sentences: number;
    words: number;
    syllables: number;
    avgWordsPerSentence: number;
    avgSyllablesPerWord: number;
  };
}

export interface KeywordDensity {
  phrase: string;
  count: number;
  percentage: number;
  nGram: 1 | 2 | 3;
}

export interface SEOIssue {
  severity: 'critical' | 'warning' | 'recommendation';
  category: 'meta' | 'content' | 'images' | 'links' | 'schema' | 'performance' | 'structure';
  message: string;
  suggestion?: string;
}

export interface Statistics {
  totalWords: number;
  totalCharacters: number;
  totalImages: number;
  imagesWithAlt: number;
  imagesWithoutAlt: number;
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  anchorLinks: number;
  h1Count: number;
  schemaCount: number;
  uniqueKeywords: number;
}

// Fetcher Types

export type FetchStrategy = 'direct' | 'proxy' | 'manual';

export interface FetchResult {
  html: string;
  strategy: FetchStrategy;
  url: string;
}

export interface FetchError {
  type: 'NETWORK_ERROR' | 'CORS_ERROR' | 'INVALID_URL' | 'PARSE_ERROR' | 'TIMEOUT' | 'EMPTY_CONTENT' | 'UNKNOWN';
  message: string;
  details?: string;
}

// Export Types

export type ExportFormat = 'json' | 'csv' | 'markdown' | 'text';

export type ExportSection =
  | 'metadata'
  | 'headings'
  | 'images'
  | 'links'
  | 'schema'
  | 'readability'
  | 'keywords'
  | 'issues'
  | 'statistics';

export interface ExportOptions {
  format: ExportFormat;
  sections: ExportSection[];
  filename: string;
}

// Component Props Types

export interface AnalysisState {
  isLoading: boolean;
  error: FetchError | null;
  result: SEOAnalysisResult | null;
  url: string;
}
