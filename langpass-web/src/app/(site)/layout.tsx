// Root layout for the English surface: the landing page at `/`, plus /privacy, /terms and
// the admin dashboard. Those last three are English-only by deliberate decision (legal text
// and internal tooling), which is why they live in this group and not under /[locale].
//
// This is one of TWO root layouts — src/app/(intl)/[locale]/layout.tsx is the other. The split
// exists because a root layout owns the <html> element and therefore its `lang` attribute, and
// a root layout cannot read a dynamic segment. Route groups let each language surface render
// its own correct <html lang>, with identical <body> shells.
import type { Viewport } from 'next';
import { fontClassName } from '@/lib/fonts';
import { siteMetadata } from '@/lib/site-metadata';
import { HTML_LANG } from '@/lib/landing-copy';
import '../globals.css';

// Includes the landing hreflang cluster. /privacy and /terms replace `alternates` with their
// own canonical, so the cluster stays scoped to the landing page.
export const metadata = siteMetadata('en');

export const viewport: Viewport = {
  themeColor: '#0a0a0c',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={HTML_LANG.en}>
      <body className={fontClassName}>{children}</body>
    </html>
  );
}
