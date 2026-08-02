// The UI locales LangPass speaks. Kept in its own module (rather than in
// lib/i18n) so the content layer can reference locale codes for glosses without
// importing the i18n runtime, which pulls in the store.
//
// Adding a locale = add the code here, add its dictionary in lib/i18n, and
// author the `gloss` entries in the content packs. Everything else — system
// locale detection, the settings picker, the onboarding language filter — is
// driven off this list.
export const LOCALE_CODES = ['en', 'de', 'es', 'fr', 'it', 'pt'] as const;

export type LocaleCode = (typeof LOCALE_CODES)[number];

/** Every string and gloss is guaranteed to exist in this locale. */
export const FALLBACK_LOCALE: LocaleCode = 'en';

export function isLocaleCode(value: string): value is LocaleCode {
  return (LOCALE_CODES as readonly string[]).includes(value);
}

/**
 * Each locale's name in its own language. Deliberately NOT translated through
 * i18n: a picker exists for someone who can't read the current UI language, so
 * "Deutsch" has to stay "Deutsch" even when the app is showing Portuguese.
 */
export const LOCALE_ENDONYMS: Record<LocaleCode, string> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  pt: 'Português',
};
