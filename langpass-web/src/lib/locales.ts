// Locale primitives for LangPass: the locale list, the URL/hreflang mapping and the sticky
// language cookie.
//
// Deliberately SEPARATE from landing-copy.ts, which holds every translated string for all six
// locales. The edge middleware needs the locale list to negotiate a language, and importing it
// from the catalogue would drag the entire copy of the landing page into the middleware bundle
// on every request. Nothing here should ever grow a dependency on the copy.

export const LOCALES = ['en', 'de', 'es', 'fr', 'it', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Locales served under /<locale>. English stays at `/` so the canonical URL is preserved. */
export const NON_DEFAULT_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE) as Exclude<Locale, 'en'>[];

export const SITE_URL = 'https://langpass.app';

/** Sticky language preference. Set by the switcher (client) and by the middleware when it
 *  serves a localized page; its mere PRESENCE suppresses the Accept-Language auto-redirect. */
export const LOCALE_COOKIE = 'langpass-locale';

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

/** Language-switcher labels. ENDONYMS — never translated: the switcher exists precisely
 *  for visitors who cannot read the language currently on screen. */
export const ENDONYMS: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  pt: 'Português',
};

/** BCP-47 tag for <html lang> and hreflang. Portuguese copy is Brazilian. */
export const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  de: 'de',
  es: 'es',
  fr: 'fr',
  it: 'it',
  pt: 'pt-BR',
};

/** OpenGraph locale tags. */
export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  de: 'de_DE',
  es: 'es_ES',
  fr: 'fr_FR',
  it: 'it_IT',
  pt: 'pt_BR',
};

/** URL path for a locale. English is the root so the existing canonical URL is preserved. */
export function pathForLocale(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/' : `/${locale}`;
}

/**
 * hreflang block for the landing page: every locale plus x-default → `/`.
 * Emitted on all six pages so search engines see a complete, reciprocal cluster.
 */
export function landingAlternates(locale: Locale): {
  canonical: string;
  languages: Record<string, string>;
} {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[HTML_LANG[l]] = pathForLocale(l);
  languages['x-default'] = pathForLocale(DEFAULT_LOCALE);
  return { canonical: pathForLocale(locale), languages };
}
