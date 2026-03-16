import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Crawlix — a free, privacy-first SEO analyzer built by Krinc that runs 100% in your browser with no tracking, no signup, and no data collection.',
  alternates: { canonical: 'https://crawlix.krinc.in/about' },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-lofi-brown mb-4">About Crawlix</h1>
        <p className="text-xl text-brand-muted max-w-2xl mx-auto">
          A free, privacy-first SEO analyzer that runs entirely in your browser —
          no servers, no tracking, no nonsense.
        </p>
      </div>

      {/* Story */}
      <section className="mb-16">
        <div className="bg-white/60 backdrop-blur-sm border-2 border-lofi-sand rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-lofi-coffee mb-6">Why Crawlix Exists</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p>
              Most SEO tools are either expensive SaaS products that lock features behind paywalls,
              or they require an account, send your data to external servers, and bombard you with
              upsells. We wanted something different.
            </p>
            <p>
              Crawlix is a tool built for developers, indie hackers, content creators, and anyone
              who wants a quick, honest look at a page's SEO — without signing up, paying, or
              worrying about where their data goes.
            </p>
            <p>
              Everything runs in your browser. The HTML is fetched and parsed locally. No analytics,
              no cookies, no data sent anywhere. Just you and the page you want to analyze.
            </p>
          </div>
        </div>
      </section>

      {/* What it analyzes */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-lofi-coffee mb-8 text-center">What Crawlix Analyzes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyses.map((item) => (
            <div
              key={item.title}
              className="bg-white/60 backdrop-blur-sm border-2 border-lofi-sand rounded-xl p-5 hover:border-lofi-brown/40 transition-all"
            >
              <span className="text-2xl block mb-2">{item.icon}</span>
              <h3 className="font-bold text-lofi-coffee mb-1">{item.title}</h3>
              <p className="text-xs text-brand-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-16">
        <div className="bg-white/60 backdrop-blur-sm border-2 border-lofi-sand rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-lofi-coffee mb-6">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stack.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-lofi-sage text-lg">✓</span>
                <div>
                  <p className="font-semibold text-lofi-darkBrown text-sm">{item.name}</p>
                  <p className="text-xs text-brand-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="mb-16">
        <div className="bg-lofi-cream border-2 border-lofi-sand rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-lofi-coffee mb-4">Privacy First</h2>
          <ul className="space-y-3 text-brand-muted">
            {privacyPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-lofi-sage font-bold mt-0.5">✓</span>
                <span className="text-sm leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Creator */}
      <section className="mb-16">
        <div className="bg-white/60 backdrop-blur-sm border-2 border-lofi-sand rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-lofi-sand flex items-center justify-center text-3xl mx-auto mb-4">
            🧑‍💻
          </div>
          <h2 className="text-2xl font-bold text-lofi-coffee mb-2">Built by Krinc</h2>
          <p className="text-brand-muted mb-4 max-w-md mx-auto text-sm">
            Krinc builds free, open-source tools for developers and creators. Crawlix is one
            of many projects in the krinc.in ecosystem.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://krinc.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white bg-lofi-brown hover:bg-lofi-coffee px-4 py-2 rounded-xl transition-colors"
            >
              Visit krinc.in ↗
            </a>
            <a
              href="https://github.com/iKrinc/crawlix.krinc.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-lofi-brown border-2 border-lofi-brown hover:bg-lofi-brown/10 px-4 py-2 rounded-xl transition-colors"
            >
              View Source on GitHub ↗
            </a>
          </div>
        </div>
      </section>

      {/* Support / Donate */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-lofi-cream to-lofi-sand/60 border-2 border-lofi-sand rounded-2xl p-8 text-center">
          <p className="text-3xl mb-3">☕</p>
          <h2 className="text-2xl font-bold text-lofi-coffee mb-3">Support the Project</h2>
          <p className="text-brand-muted mb-6 max-w-lg mx-auto text-sm leading-relaxed">
            Crawlix is free forever and open-source. If it's been useful to you, consider
            buying me a coffee. It motivates me to keep building and adding new features.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {/* TODO: Replace with your actual Buy Me a Coffee link once set up */}
            <a
              href="https://www.buymeacoffee.com/krinc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold bg-[#FFDD00] text-[#000] hover:opacity-90 px-6 py-3 rounded-xl transition-opacity shadow-md"
            >
              ☕ Buy Me a Coffee
            </a>
            <a
              href="https://github.com/iKrinc/crawlix.krinc.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-lofi-brown border-2 border-lofi-brown hover:bg-lofi-brown/10 px-6 py-3 rounded-xl transition-colors"
            >
              ⭐ Star on GitHub
            </a>
          </div>
        </div>
      </section>

      <div className="text-center">
        <Link href="/" className="text-lofi-brown hover:underline text-sm">
          ← Back to Crawlix
        </Link>
      </div>
    </div>
  );
}

const analyses = [
  { icon: '🏷️', title: 'Meta Tags', desc: 'Title, description, OG tags, Twitter cards, canonical, charset, language' },
  { icon: '📊', title: 'Readability', desc: 'Flesch Reading Ease score and grade level estimation' },
  { icon: '🔑', title: 'Keywords', desc: '1, 2, and 3-word phrase density and frequency analysis' },
  { icon: '🖼️', title: 'Images', desc: 'Alt text coverage, dimensions, and lazy loading attributes' },
  { icon: '🔗', title: 'Links', desc: 'Internal vs external links, anchor text, and nofollow detection' },
  { icon: '📋', title: 'Headings', desc: 'H1–H6 hierarchy, duplicate H1 detection, skipped levels' },
  { icon: '🎯', title: 'Schema', desc: 'JSON-LD structured data parsing and validation' },
  { icon: '⚠️', title: 'Issues', desc: '20+ SEO issues with severity levels and actionable suggestions' },
];

const stack = [
  { name: 'Next.js 14', desc: 'React framework' },
  { name: 'TypeScript', desc: 'Type-safe code' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling' },
  { name: 'Framer Motion', desc: 'Smooth animations' },
  { name: 'Browser APIs', desc: 'DOMParser, Fetch' },
  { name: 'No backend', desc: 'Runs 100% client-side' },
];

const privacyPoints = [
  'No user accounts or registration required.',
  'No analytics or tracking scripts embedded.',
  'URLs you analyze are never sent to our servers — everything is parsed locally in your browser.',
  'No cookies set, no data stored beyond your current session.',
  'Open-source: read every line of code on GitHub.',
];
