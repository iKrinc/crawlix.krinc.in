import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://crawlix.krinc.in'),
  title: {
    default: 'Crawlix - Free SEO Analyzer & Website Audit Tool',
    template: '%s | Crawlix',
  },
  description:
    'Free SEO analyzer tool for instant website audits. Check meta tags, headings, images, links, schema markup, readability scores & keyword density. Privacy-first, no registration required.',
  keywords: [
    'SEO analyzer',
    'SEO audit tool',
    'free SEO checker',
    'meta tags checker',
    'readability score',
    'keyword density analyzer',
    'schema markup validator',
    'website SEO tool',
    'frontend SEO analyzer',
    'SEO analysis',
  ],
  authors: [{ name: 'Krinc', url: 'https://krinc.in' }],
  creator: 'Krinc',
  publisher: 'Krinc',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://crawlix.krinc.in',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://crawlix.krinc.in',
    siteName: 'Crawlix',
    title: 'Crawlix - Free SEO Analyzer & Website Audit Tool',
    description:
      'Comprehensive SEO analysis tool running entirely in your browser. Analyze meta tags, content structure, readability, keyword density & more. 100% free, no signup required.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Crawlix - Free SEO Analyzer Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crawlix - Free SEO Analyzer & Website Audit Tool',
    description:
      'Instant SEO analysis in your browser. Check meta tags, content structure, readability & more. 100% free, privacy-focused.',
    images: ['/twitter-image.png'],
    creator: '@krinc_in',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#8B7355',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Crawlix',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Free SEO analyzer and website audit tool running entirely in your browser',
    url: 'https://crawlix.krinc.in',
    author: {
      '@type': 'Organization',
      name: 'Krinc',
      url: 'https://krinc.in',
    },
    featureList: [
      'Meta tags analysis',
      'Heading structure validation',
      'Image alt text checker',
      'Link analysis',
      'Schema markup validation',
      'Readability scoring',
      'Keyword density analysis',
      'SEO issue detection',
    ],
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 border-b border-lofi-sand/60 bg-brand-background/90 backdrop-blur-md" role="banner">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <a href="/" className="font-bold text-xl text-lofi-brown hover:opacity-80 transition-opacity">
                Crawlix
              </a>
              <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
                <a href="/" className="text-sm text-brand-muted hover:text-lofi-brown px-3 py-1.5 rounded-lg hover:bg-lofi-sand/30 transition-all">
                  Home
                </a>
                <a href="/about" className="text-sm text-brand-muted hover:text-lofi-brown px-3 py-1.5 rounded-lg hover:bg-lofi-sand/30 transition-all">
                  About
                </a>
                <a href="/contact" className="text-sm text-brand-muted hover:text-lofi-brown px-3 py-1.5 rounded-lg hover:bg-lofi-sand/30 transition-all">
                  Contact
                </a>
                {/* TODO: Replace href with your actual Buy Me a Coffee link once set up */}
                <a
                  href="https://www.buymeacoffee.com/krinc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-lofi-brown border border-lofi-brown/40 hover:border-lofi-brown hover:bg-lofi-brown/5 px-3 py-1.5 rounded-lg transition-all"
                >
                  ☕ Support
                </a>
                <a
                  href="https://github.com/iKrinc/crawlix.krinc.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub repository"
                  className="text-brand-muted hover:text-lofi-brown px-2 py-1.5 rounded-lg hover:bg-lofi-sand/30 transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-brand-primary/20 bg-brand-background py-12 mt-16" role="contentinfo">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              {/* Brand */}
              <div>
                <h2 className="font-bold text-lg mb-3 gradient-text">Crawlix</h2>
                <p className="text-sm text-brand-muted leading-relaxed mb-4">
                  Free, privacy-first SEO analysis. Analyze any webpage instantly — no signup, no tracking, no data collection.
                </p>
                {/* TODO: Replace href with your actual Buy Me a Coffee link once set up */}
                <a
                  href="https://www.buymeacoffee.com/krinc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#FFDD00] text-[#000] hover:opacity-90 px-3 py-1.5 rounded-lg transition-opacity"
                >
                  ☕ Buy Me a Coffee
                </a>
              </div>

              {/* Features */}
              <nav aria-label="Features">
                <h3 className="font-semibold text-lofi-darkBrown mb-3">What We Analyze</h3>
                <ul className="text-sm text-brand-muted space-y-1.5">
                  <li>✓ Meta Tags & Open Graph</li>
                  <li>✓ Readability Scoring</li>
                  <li>✓ Keyword Density</li>
                  <li>✓ Schema / JSON-LD</li>
                  <li>✓ Image Alt Checker</li>
                  <li>✓ Link Analysis</li>
                  <li>✓ Heading Structure</li>
                  <li>✓ Issue Detection</li>
                </ul>
              </nav>

              {/* Links */}
              <nav aria-label="Site links">
                <h3 className="font-semibold text-lofi-darkBrown mb-3">Links</h3>
                <ul className="text-sm space-y-1.5">
                  <li><a href="/" className="text-brand-muted hover:text-lofi-brown transition-colors">Home</a></li>
                  <li><a href="/about" className="text-brand-muted hover:text-lofi-brown transition-colors">About</a></li>
                  <li><a href="/contact" className="text-brand-muted hover:text-lofi-brown transition-colors">Contact</a></li>
                  <li>
                    <a
                      href="https://github.com/iKrinc/crawlix.krinc.in/issues/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-muted hover:text-lofi-brown transition-colors"
                    >
                      Report an Issue ↗
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/iKrinc/crawlix.krinc.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-muted hover:text-lofi-brown transition-colors"
                    >
                      GitHub ↗
                    </a>
                  </li>
                </ul>
              </nav>

              {/* About */}
              <div>
                <h3 className="font-semibold text-lofi-darkBrown mb-3">Made by Krinc</h3>
                <p className="text-sm text-brand-muted mb-3 leading-relaxed">
                  Built with Next.js 14. Runs entirely in your browser. No data sent to any server.
                </p>
                <a
                  href="https://krinc.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-lofi-brown hover:underline"
                >
                  krinc.in ↗
                </a>
                <div className="mt-3 flex gap-2">
                  <a
                    href="https://safespace.krinc.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-muted hover:text-lofi-brown transition-colors border border-lofi-sand hover:border-lofi-brown/40 px-2 py-1 rounded-lg"
                  >
                    SafeSpace ↗
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-brand-primary/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-brand-muted">
              <p>&copy; {new Date().getFullYear()} Crawlix by <a href="https://krinc.in" className="hover:text-lofi-brown transition-colors">Krinc</a>. Free & Open Source.</p>
              <div className="flex items-center gap-4">
                <a href="/contact" className="hover:text-lofi-brown transition-colors">Contact</a>
                <a href="https://github.com/iKrinc/crawlix.krinc.in/issues/new" target="_blank" rel="noopener noreferrer" className="hover:text-lofi-brown transition-colors">Report Issue</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
