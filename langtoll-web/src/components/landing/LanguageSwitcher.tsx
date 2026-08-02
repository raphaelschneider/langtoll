'use client';
// Language switcher — deliberately small and unobtrusive, but always above the fold.
//
// Labelled with ENDONYMS (English, Deutsch, Español, …) and never with translated language
// names: the whole point of this control is to be usable by someone who cannot read the
// language currently on screen. "German" is useless to a German speaker looking at English.
//
// Clicking a language writes the `langpass-locale` cookie, which makes the choice sticky —
// the middleware only auto-redirects `/` when that cookie is absent, so an explicit pick is
// never overridden by Accept-Language afterwards. The links are plain <a> elements, so they
// still work with JS disabled (the middleware also sets the cookie server-side when it serves
// a /<locale> page, which covers the no-JS case).
import { ENDONYMS, HTML_LANG, LOCALES, LOCALE_COOKIE, pathForLocale, type Locale } from '@/lib/landing-copy';

export function LanguageSwitcher({ current, ariaLabel }: { current: Locale; ariaLabel: string }) {
  const remember = (locale: Locale) => {
    // 1 year, root path, Lax — a language preference, not a credential.
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <nav className="lang-switch" aria-label={ariaLabel}>
      {LOCALES.map((l) => (
        <a
          key={l}
          href={pathForLocale(l)}
          // Same BCP-47 tags the hreflang cluster uses (pt → pt-BR), so the in-page links and
          // the <head> alternates never disagree about what a locale is.
          hrefLang={HTML_LANG[l]}
          lang={HTML_LANG[l]}
          className={l === current ? 'is-current' : undefined}
          aria-current={l === current ? 'true' : undefined}
          onClick={() => remember(l)}
        >
          {ENDONYMS[l]}
        </a>
      ))}
    </nav>
  );
}
