// Root layout for the localized landing pages (/de, /es, /fr, /it, /pt).
//
// It exists solely so <html lang> reflects the language actually being served: a root layout
// owns the <html> element, and the root layout in app/(site) cannot see this segment's param.
// Route groups let both surfaces have their own root layout while keeping the same <body>
// shell and fonts. Everything below this point is identical to the English surface.
import type { Viewport } from 'next';
import { fontClassName } from '@/lib/fonts';
import { DEFAULT_LOCALE, HTML_LANG, isLocale } from '@/lib/landing-copy';
import '../../globals.css';

export const viewport: Viewport = {
  themeColor: '#0a0a0c',
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  // The page is what 404s an unknown segment (notFound() belongs there, not in a root layout —
  // the layout still has to render the shell that wraps the 404 page). Here we just refuse to
  // emit a bogus lang attribute for a path like /xx.
  const lang = isLocale(locale) ? HTML_LANG[locale] : HTML_LANG[DEFAULT_LOCALE];

  return (
    <html lang={lang}>
      <body className={fontClassName}>{children}</body>
    </html>
  );
}
