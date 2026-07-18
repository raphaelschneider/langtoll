// Localized landing pages: /de, /es, /fr, /it, /pt.
//
// English is deliberately NOT served here — it stays at `/` so the already-indexed canonical
// URL is preserved and there is no /en duplicate competing with it.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Landing } from '@/components/landing/Landing';
import { NON_DEFAULT_LOCALES, isLocale } from '@/lib/landing-copy';
import { siteMetadata } from '@/lib/site-metadata';

// Same ISR window as `/`: the pricing card's MySQL read happens at most once an hour per
// locale, never per visitor.
export const revalidate = 3600;

/** Pre-render the five localized pages at build time. `/en` is absent on purpose. */
export function generateStaticParams(): { locale: string }[] {
  return NON_DEFAULT_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') return {};
  // Localized title/description + the full six-way hreflang cluster (x-default → `/`).
  return siteMetadata(locale);
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Anything that isn't one of the five localized paths is a 404 — including `/en`, which
  // would otherwise be a duplicate of `/`.
  if (!isLocale(locale) || locale === 'en') notFound();
  return <Landing locale={locale} />;
}
