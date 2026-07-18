import type { MetadataRoute } from 'next';
import { DEFAULT_LOCALE, HTML_LANG, LOCALES, SITE_URL, pathForLocale } from '@/lib/locales';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;

  // `new URL('/', base)` yields a trailing slash, but the pages' canonical tags resolve to the
  // bare origin. The two must agree byte-for-byte or the sitemap and the page disagree about
  // which URL is canonical, and the hreflang cluster gets dropped.
  const abs = (path: string) => new URL(path, base).toString().replace(/\/$/, '');

  // Every landing locale, each carrying the same hreflang alternates block that the pages
  // emit — search engines cross-check the two, and a mismatch gets the cluster ignored.
  const languages: Record<string, string> = Object.fromEntries([
    ...LOCALES.map((l) => [HTML_LANG[l], abs(pathForLocale(l))]),
    ['x-default', abs(pathForLocale(DEFAULT_LOCALE))],
  ]);

  const landing: MetadataRoute.Sitemap = LOCALES.map((l) => ({
    url: abs(pathForLocale(l)),
    changeFrequency: 'weekly',
    // English is the origin page and the x-default target; the translations rank just below it.
    priority: l === 'en' ? 1 : 0.9,
    alternates: { languages },
  }));

  return [
    ...landing,
    // Legal pages are English-only by decision — no locale variants, no hreflang.
    { url: `${base}/privacy`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/terms`, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
