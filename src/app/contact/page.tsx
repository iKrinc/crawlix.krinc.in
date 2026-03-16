import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Crawlix team. Report issues, ask questions, or share feedback about our free SEO analyzer tool.',
  alternates: { canonical: 'https://crawlix.krinc.in/contact' },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-lofi-brown mb-4">Get in Touch</h1>
        <p className="text-lg text-brand-muted">
          Have a question, found a bug, or want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Email */}
        <div className="bg-white/60 backdrop-blur-sm border-2 border-lofi-sand rounded-2xl p-6 hover:border-lofi-brown/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-lofi-sand/50 flex items-center justify-center mb-4">
            <span className="text-2xl">✉️</span>
          </div>
          <h2 className="font-bold text-lg text-lofi-coffee mb-2">Email Us</h2>
          <p className="text-sm text-brand-muted mb-3">
            For general inquiries, partnerships, or feedback.
          </p>
          {/* TODO: Replace with a krinc.in email once set up */}
          <a
            href="mailto:krishnaincorporated@gmail.com"
            className="text-lofi-brown font-mono text-sm hover:underline break-all"
          >
            krishnaincorporated@gmail.com
          </a>
        </div>

        {/* Report a Bug */}
        <div className="bg-white/60 backdrop-blur-sm border-2 border-lofi-sand rounded-2xl p-6 hover:border-lofi-brown/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-lofi-sand/50 flex items-center justify-center mb-4">
            <span className="text-2xl">🐛</span>
          </div>
          <h2 className="font-bold text-lg text-lofi-coffee mb-2">Report an Issue</h2>
          <p className="text-sm text-brand-muted mb-3">
            Found a bug or something not working? Open a GitHub issue.
          </p>
          <a
            href="https://github.com/iKrinc/crawlix.krinc.in/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-lofi-brown hover:bg-lofi-coffee px-4 py-2 rounded-xl transition-colors"
          >
            Open Issue on GitHub
            <span className="text-xs">↗</span>
          </a>
        </div>

        {/* Feature Request */}
        <div className="bg-white/60 backdrop-blur-sm border-2 border-lofi-sand rounded-2xl p-6 hover:border-lofi-brown/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-lofi-sand/50 flex items-center justify-center mb-4">
            <span className="text-2xl">💡</span>
          </div>
          <h2 className="font-bold text-lg text-lofi-coffee mb-2">Feature Request</h2>
          <p className="text-sm text-brand-muted mb-3">
            Have an idea to make Crawlix better? We're all ears.
          </p>
          <a
            href="https://github.com/iKrinc/crawlix.krinc.in/issues/new?labels=enhancement"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-lofi-brown border-2 border-lofi-brown hover:bg-lofi-brown/10 px-4 py-2 rounded-xl transition-colors"
          >
            Suggest a Feature
            <span className="text-xs">↗</span>
          </a>
        </div>

        {/* GitHub */}
        <div className="bg-white/60 backdrop-blur-sm border-2 border-lofi-sand rounded-2xl p-6 hover:border-lofi-brown/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-lofi-sand/50 flex items-center justify-center mb-4">
            <span className="text-2xl">⭐</span>
          </div>
          <h2 className="font-bold text-lg text-lofi-coffee mb-2">Star on GitHub</h2>
          <p className="text-sm text-brand-muted mb-3">
            Love Crawlix? Give it a star — it helps others discover it.
          </p>
          <a
            href="https://github.com/iKrinc/crawlix.krinc.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-lofi-brown border-2 border-lofi-brown hover:bg-lofi-brown/10 px-4 py-2 rounded-xl transition-colors"
          >
            GitHub Repository
            <span className="text-xs">↗</span>
          </a>
        </div>
      </div>

      {/* Support Banner */}
      <div className="bg-gradient-to-br from-lofi-cream to-lofi-sand/60 border-2 border-lofi-sand rounded-2xl p-8 text-center">
        <p className="text-2xl mb-3">☕</p>
        <h2 className="font-bold text-xl text-lofi-coffee mb-2">Crawlix is 100% Free</h2>
        <p className="text-sm text-brand-muted mb-4 max-w-md mx-auto">
          If Crawlix saved you time, consider supporting the project. It helps keep the tool free and maintained.
        </p>
        {/* TODO: Replace with your actual Buy Me a Coffee / Ko-fi link once set up */}
        <a
          href="https://www.buymeacoffee.com/krinc"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold text-white bg-[#FFDD00] text-[#000] hover:opacity-90 px-6 py-3 rounded-xl transition-opacity shadow-md"
        >
          ☕ Buy Me a Coffee
        </a>
      </div>

      <div className="text-center mt-10">
        <Link href="/" className="text-lofi-brown hover:underline text-sm">
          ← Back to Crawlix
        </Link>
      </div>
    </div>
  );
}
