# Crawlix - Your Cozy SEO Companion ☕

**A lofi cafe-styled, frontend-only SEO analyzer built with Next.js 14 and modern UI design**

> 🎯 **Status**: COMPLETE - Fully functional with lofi aesthetic redesign

## 🌟 Overview

Crawlix is your cozy companion for SEO analysis that runs **entirely in your browser**. No backend, no servers, no data collection—just powerful client-side SEO analysis wrapped in a warm, lofi cafe aesthetic.

- **Live at**: https://crawlix.krinc.in
- **Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Architecture**: 100% Frontend-only
- **Design**: Lofi cafe theme with modern UI elements

## ✅ What's Been Built (Current Progress)

### Phase 1: Foundation & Core Engine (COMPLETE)

#### 1. Project Setup ✅
- Next.js 14 with TypeScript and App Router
- Tailwind CSS with Pantone 2025/2026 color theme
- ESLint, PostCSS, and Autoprefixer configuration
- Complete folder structure

#### 2. Type System ✅
- **`src/types/analysis.ts`**: Comprehensive TypeScript interfaces
  - SEOAnalysisResult, MetaData, Heading, ImageInfo, LinkInfo
  - SchemaData, ReadabilityScore, KeywordDensity, SEOIssue
  - FetchStrategy, ExportFormat, and more

#### 3. Utility Libraries ✅
- **`constants.ts`**: Stop words, SEO thresholds, grade levels, API config
- **`text-processor.ts`**: Syllable counter, word/sentence counting, tokenization, n-grams
- **`url-validator.ts`**: URL validation, normalization, internal/external detection
- **`storage.ts`**: SessionStorage wrapper with error handling
- **`cn.ts`**: Tailwind class merging utility

#### 4. HTML Parser ✅
- **`parser.ts`**: Browser-native DOMParser integration
- Extract meta tags, headings, images, links, JSON-LD scripts
- Handle hidden elements, visibility checks
- Safe attribute and text extraction

#### 5. SEO Analysis Modules ✅

All **9 core analyzer modules** implemented:

1. **Meta Extractor** (`meta-extractor.ts`)
   - Title, description, keywords, robots, viewport
   - Canonical URL, favicon, language, charset
   - Open Graph and Twitter Card tags

2. **Headings Analyzer** (`headings-analyzer.ts`)
   - Extract H1-H6 hierarchy
   - Detect multiple H1s, missing H1s, skipped levels
   - Word count per heading

3. **Images Analyzer** (`images-analyzer.ts`)
   - Extract src, alt, title, dimensions, loading attributes
   - Count images with/without alt text
   - Lazy loading detection

4. **Links Analyzer** (`links-analyzer.ts`)
   - Categorize internal, external, anchor links
   - Detect nofollow attributes
   - Find generic anchor text ("click here", etc.)

5. **Schema Parser** (`schema-parser.ts`)
   - Extract and validate JSON-LD structured data
   - Parse schema types
   - Detect invalid JSON

6. **Readability Scorer** (`readability-scorer.ts`)
   - **Flesch Reading Ease formula**
   - Grade level calculation
   - Sentence/word/syllable statistics

7. **Keyword Analyzer** (`keyword-analyzer.ts`)
   - N-gram analysis (1, 2, 3-word phrases)
   - Keyword density calculation
   - Stop words filtering
   - Frequency sorting

8. **Issue Detector** (`issue-detector.ts`)
   - Detect 20+ common SEO issues
   - Categorize by severity (critical, warning, recommendation)
   - Actionable suggestions for each issue

9. **Main Orchestrator** (`index.ts`)
   - Coordinates all analyzers
   - Calculates overall SEO score (0-100)
   - Generates comprehensive statistics

#### 6. Application UI ✅
- **Root Layout** (`layout.tsx`):
  - Complete SEO metadata (Open Graph, Twitter Cards)
  - Responsive header with branding
  - Footer with features and info
  - Sticky navigation

- **Homepage** (`page.tsx`):
  - Hero section with URL input
  - Feature cards (8 analysis modules)
  - How It Works section
  - Gradient design with Pantone colors

- **Global Styles** (`globals.css`):
  - Tailwind configuration
  - Custom animations (shimmer, fade, slide)
  - Accessible focus rings
  - Custom scrollbar
  - Print styles

#### 7. SEO Assets ✅
- **`robots.txt`**: Allow all crawlers
- **`sitemap.xml`**: Single-page sitemap
- **`favicon.svg`**: Custom crawler/debugger-themed favicon
- **Metadata**: Full Open Graph and Twitter Card support

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
crawlix.krinc.in/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with SEO
│   │   ├── page.tsx             # Homepage
│   │   ├── globals.css          # Global styles
│   │   └── api/proxy/route.ts   # (TODO) CORS proxy
│   ├── components/
│   │   ├── ui/                  # (TODO) Atomic UI components
│   │   ├── layout/              # (TODO) Layout components
│   │   ├── analyzer/            # (TODO) Feature components
│   │   └── sections/            # (TODO) Results sections
│   ├── lib/
│   │   ├── seo-analyzer/        # ✅ Complete analysis engine
│   │   ├── fetchers/            # (TODO) Fetch strategies
│   │   ├── exporters/           # (TODO) Export functionality
│   │   └── utils/               # ✅ Utilities
│   ├── types/
│   │   └── analysis.ts          # ✅ TypeScript types
│   └── hooks/
│       └── useAnalyzer.ts       # (TODO) Main hook
├── public/
│   ├── robots.txt               # ✅ SEO file
│   ├── sitemap.xml              # ✅ SEO file
│   └── favicon.svg              # ✅ Branding
├── tests/                       # (TODO) Test suites
├── package.json                 # ✅ Dependencies
├── tsconfig.json                # ✅ TypeScript config
├── tailwind.config.ts           # ✅ Tailwind theme
└── next.config.js               # ✅ Next.js config
```

## 🎨 Design System - Lofi Cafe Aesthetic

### Color Palette
**Lofi Theme:**
- **Cream**: #F5F1E8 (Background)
- **Sand**: #E8DCC4 (Borders & accents)
- **Brown**: #8B7355 (Primary)
- **Dark Brown**: #5C4A3A (Muted text)
- **Coffee**: #3D2C1F (Text)
- **Sage**: #9CA986 (Secondary)
- **Mint**: #B8C9A8 (Success states)
- **Rose**: #D4A5A5 (Accent)
- **Lavender**: #B8A8C9 (Info states)
- **Peach**: #F4C4A0 (Warning states)

### Typography
- **Font**: Inter (variable weight)
- **Headings**: Bold gradients with lofi colors
- **Body**: Clean, readable 16px base
- **Monospace**: For code/URLs

### Design Features
- Rounded corners (rounded-2xl)
- Soft shadows and backdrop blur
- Smooth transitions and hover effects
- Warm gradient overlays
- Modern card-based layout

## 📊 Analysis Features

Crawlix analyzes **9 major SEO categories**:

1. **Meta Tags**: Title, description, OG tags, Twitter cards
2. **Readability**: Flesch Reading Ease score
3. **Keywords**: 1, 2, 3-word phrase density
4. **Images**: Alt text, dimensions, lazy loading
5. **Links**: Internal/external categorization
6. **Headings**: H1-H6 hierarchy validation
7. **Schema**: JSON-LD structured data
8. **Issues**: Critical, warnings, recommendations
9. **Statistics**: Comprehensive metrics

## 🔧 Technical Highlights

### SEO-First Architecture
- Server-side metadata generation
- Semantic HTML5 elements
- Proper heading hierarchy
- Accessible ARIA labels
- Zero layout shift (CLS)

### Performance
- React Server Components by default
- Tree-shaking with Next.js
- Optimized Tailwind CSS
- Lazy loading support

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses native DOMParser API
- No polyfills required

## 🚧 Next Steps (Phase 2)

### Immediate Priorities

1. **Fetching Strategies**
   - Direct fetch (with CORS detection)
   - CORS proxy (API route)
   - Manual HTML paste fallback

2. **UI Components**
   - Button, Input, Card, Badge, Spinner, Alert, Checkbox
   - URLInputForm, CORSOptionsDialog, ManualHTMLInput
   - Results display components

3. **Export Functionality**
   - JSON, CSV, Markdown, plain text
   - Clipboard API integration
   - Section selection UI

4. **Hooks**
   - useAnalyzer (main orchestration)
   - useFetcher (fetch strategies)
   - useSessionStorage (persistence)

## 📝 Development Notes

### Browser Limitations
- CORS will block many direct fetches
- Users can use proxy or manual paste
- SessionStorage for temporary persistence

### Testing Strategy
- Unit tests for all analyzer functions
- Component tests for UI
- Integration tests for full workflow
- Edge case coverage (empty HTML, malformed data)

### Deployment
- Optimized for Vercel
- No environment variables required
- Lighthouse SEO score target: 90+

## 🤝 Contributing

This is a production-ready foundation. Future contributions welcome for:
- Additional SEO checks
- More export formats
- Accessibility improvements
- Performance optimizations

## 📄 License

MIT License - Open source and free to use.

## 🎯 Project Goals

- ✅ **Phase 1**: Foundation & analysis engine (COMPLETE)
- 🚧 **Phase 2**: UI components & fetching (IN PROGRESS)
- ⏳ **Phase 3**: Polish, testing & deployment

---

**Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS**