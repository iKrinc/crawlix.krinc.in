// Stop words for keyword analysis
export const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'we', 'you', 'your', 'this', 'they',
  'or', 'but', 'not', 'can', 'may', 'if', 'their', 'which', 'more',
  'about', 'such', 'been', 'were', 'would', 'there', 'than', 'into',
  'so', 'up', 'out', 'when', 'only', 'no', 'all', 'do', 'does',
  'did', 'what', 'who', 'whom', 'whose', 'where', 'why', 'how',
  'our', 'his', 'her', 'my', 'am', 'have', 'had', 'has', 'been',
  'being', 'having', 'one', 'two', 'three', 'four', 'five',
  'some', 'any', 'each', 'every', 'either', 'neither', 'both',
  'other', 'another', 'these', 'those', 'i', 'me', 'him',
]);

// SEO Thresholds
export const SEO_THRESHOLDS = {
  title: {
    min: 30,
    max: 60,
    optimal: { min: 50, max: 60 },
  },
  description: {
    min: 120,
    max: 160,
    optimal: { min: 150, max: 160 },
  },
  h1: {
    min: 1,
    max: 1, // Only one H1 recommended
  },
  imageAlt: {
    percentageTarget: 100, // 100% of images should have alt text
  },
  readability: {
    veryEasy: { min: 90, max: 100 },
    easy: { min: 80, max: 89 },
    fairlyEasy: { min: 70, max: 79 },
    standard: { min: 60, max: 69 },
    fairlyDifficult: { min: 50, max: 59 },
    difficult: { min: 30, max: 49 },
    veryDifficult: { min: 0, max: 29 },
  },
  keywordDensity: {
    min: 0.5, // Minimum 0.5% for important keywords
    max: 3.5, // Maximum 3.5% to avoid keyword stuffing
    optimal: { min: 1, max: 2.5 },
  },
};

// Grade level mappings for readability
export const GRADE_LEVELS = {
  getGradeLevel: (score: number): string => {
    if (score >= 90) return '5th grade';
    if (score >= 80) return '6th grade';
    if (score >= 70) return '7th grade';
    if (score >= 60) return '8th-9th grade';
    if (score >= 50) return '10th-12th grade';
    if (score >= 30) return 'College level';
    return 'College graduate';
  },
  getInterpretation: (score: number): string => {
    if (score >= 90) return 'Very Easy to read. Easily understood by an average 11-year-old student.';
    if (score >= 80) return 'Easy to read. Conversational English for consumers.';
    if (score >= 70) return 'Fairly Easy to read.';
    if (score >= 60) return 'Plain English. Easily understood by 13- to 15-year-old students.';
    if (score >= 50) return 'Fairly Difficult to read.';
    if (score >= 30) return 'Difficult to read.';
    return 'Very Difficult to read. Best understood by university graduates.';
  },
};

// Generic anchor text patterns (to be flagged)
export const GENERIC_ANCHOR_PATTERNS = [
  'click here',
  'read more',
  'learn more',
  'more',
  'here',
  'this',
  'link',
  'click',
  'page',
  'website',
  'more info',
  'more information',
  'details',
];

// Session storage keys
export const STORAGE_KEYS = {
  ANALYSIS_RESULT: 'crawlix_analysis_result',
  LAST_URL: 'crawlix_last_url',
  FETCH_STRATEGY: 'crawlix_fetch_strategy',
};

// API Configuration
export const API_CONFIG = {
  FETCH_TIMEOUT: 30000, // 30 seconds
  MAX_HTML_SIZE: 10 * 1024 * 1024, // 10MB
  RATE_LIMIT_WINDOW: 60000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 10,
};

// Keyword analysis configuration
export const KEYWORD_CONFIG = {
  MIN_WORD_LENGTH: 3, // Minimum word length to consider
  MAX_RESULTS_PER_NGRAM: 20, // Top 20 keywords per n-gram
  MIN_OCCURRENCES: 2, // Minimum occurrences to be considered
};

// Schema.org types (common ones)
export const COMMON_SCHEMA_TYPES = [
  'Article',
  'BlogPosting',
  'NewsArticle',
  'Product',
  'Organization',
  'Person',
  'WebPage',
  'WebSite',
  'BreadcrumbList',
  'FAQPage',
  'HowTo',
  'Recipe',
  'Event',
  'Review',
  'VideoObject',
  'ImageObject',
];
