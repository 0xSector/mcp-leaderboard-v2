import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MCP Leaderboard - Payment & Commerce MCP Adoption Metrics',
  description:
    'Track adoption metrics for Payment, Commerce, and Crypto MCP servers ranked by npm downloads and GitHub activity.',
  keywords: ['MCP', 'Model Context Protocol', 'payments', 'commerce', 'crypto', 'Stripe', 'Shopify'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100`}
      >
        <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">MCP Leaderboard</h1>
                  <p className="text-xs text-zinc-500">Payment & Commerce MCPs</p>
                </div>
              </div>
              <nav className="flex items-center gap-4">
                <a
                  href="https://modelcontextprotocol.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  MCP Docs
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-zinc-800 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-zinc-500">
            <p>Data sourced from npm and GitHub APIs. Updated hourly.</p>
            <p className="mt-1">
              Built to track MCP ecosystem growth in payments, commerce, and crypto.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
