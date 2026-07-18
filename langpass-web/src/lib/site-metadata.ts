// Per-locale <head> metadata for the landing page.
//
// The hreflang cluster is the whole point of the locale split: every one of the six landing
// URLs advertises all six alternates plus x-default → `/`, reciprocally, which is what search
// engines require before they will serve the right language per user instead of picking one
// and treating the rest as duplicates.
//
// Note the legal pages (/privacy, /terms) override `alternates` with their own canonical, so
// they do NOT inherit this hreflang set — they are English-only by decision.
import type { Metadata } from 'next';
import {
  COPY,
  LOCALES,
  OG_LOCALE,
  SITE_URL,
  landingAlternates,
  pathForLocale,
  type Locale,
} from '@/lib/landing-copy';

export function siteMetadata(locale: Locale): Metadata {
  const c = COPY[locale];
  const alternates = landingAlternates(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: c.seo.title,
      template: '%s · LangPass',
    },
    description: c.seo.description,
    keywords: [
      'language learning app',
      'learn German',
      'app blocker',
      'screen time',
      'focus app',
      'digital wellbeing',
      'vocabulary trainer',
      'CEFR German A1',
    ],
    alternates,
    openGraph: {
      type: 'website',
      url: new URL(pathForLocale(locale), SITE_URL).toString(),
      siteName: 'LangPass',
      title: c.seo.title,
      description: c.seo.description,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: '/og.png', width: 1200, height: 630, alt: c.seo.ogImageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.seo.title,
      description: c.seo.description,
      images: ['/og.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    appleWebApp: { title: 'LangPass' },
    category: 'education',
  };
}
