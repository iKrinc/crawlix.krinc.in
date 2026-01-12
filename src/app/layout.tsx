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
        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-brand-primary/20 bg-brand-background py-8 mt-16" role="contentinfo">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h2 className="font-bold text-lg mb-2 gradient-text">Crawlix</h2>
                <p className="text-sm text-brand-muted">
                  Free, privacy-first SEO analysis tool. Analyze any webpage instantly in your browser. No signup, no tracking, no data collection.
                </p>
              </div>
              <nav aria-label="Features">
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="text-sm text-brand-muted space-y-1">
                  <li>✓ Meta Tags Analysis</li>
                  <li>✓ Readability Scoring</li>
                  <li>✓ Keyword Density</li>
                  <li>✓ Schema Validation</li>
                  <li>✓ Image Alt Checker</li>
                  <li>✓ Link Analysis</li>
                </ul>
              </nav>
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-sm text-brand-muted mb-3">
                  Built with Next.js 14 and runs entirely in your browser. No data is sent to any server.
                </p>
                <p className="text-sm text-brand-muted">
                  Created by <a href="https://krinc.in" className="text-lofi-brown hover:underline" target="_blank" rel="noopener noreferrer">Krinc</a>
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-brand-primary/10 text-center text-sm text-brand-muted">
              <p>&copy; {new Date().getFullYear()} Crawlix by Krinc. All rights reserved. | <a href="https://crawlix.krinc.in" className="hover:text-lofi-brown">crawlix.krinc.in</a></p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
