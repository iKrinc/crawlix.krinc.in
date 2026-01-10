import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Crawlix - Free Frontend SEO Analyzer Tool',
  description:
    'Analyze any website\'s SEO instantly in your browser. Check meta tags, headings, images, links, schema markup, readability scores, and keyword density. 100% free, no backend required.',
  keywords: [
    'SEO analyzer',
    'SEO tool',
    'meta tags checker',
    'readability score',
    'keyword density',
    'schema validator',
    'free SEO tool',
    'frontend SEO',
    'website analyzer',
  ],
  authors: [{ name: 'Crawlix' }],
  creator: 'Crawlix',
  publisher: 'Crawlix',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://crawlix.krinc.in',
    siteName: 'Crawlix',
    title: 'Crawlix - Free Frontend SEO Analyzer',
    description:
      'Comprehensive SEO analysis tool running entirely in your browser. Analyze meta tags, content structure, readability, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Crawlix SEO Analyzer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crawlix - Free Frontend SEO Analyzer',
    description:
      'Analyze any website\'s SEO instantly in your browser. Check meta tags, content, images, links, and more.',
    images: ['/twitter-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#8B7355',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-brand-primary/20 bg-brand-background py-8 mt-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-2 gradient-text">Crawlix</h3>
                <p className="text-sm text-brand-muted">
                  Free, frontend-only SEO analysis tool. Analyze any webpage instantly in your browser.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Features</h4>
                <ul className="text-sm text-brand-muted space-y-1">
                  <li>• Meta Tags Analysis</li>
                  <li>• Readability Scoring</li>
                  <li>• Keyword Density</li>
                  <li>• Schema Validation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-sm text-brand-muted">
                  Built with Next.js 14 and runs entirely in your browser. No data is sent to any server.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-brand-primary/10 text-center text-sm text-brand-muted">
              <p>&copy; {new Date().getFullYear()} Crawlix. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
