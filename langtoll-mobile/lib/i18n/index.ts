// Tiny typed i18n. Two axes, deliberately separate:
//  - UI locale (this module): what the interface speaks. Resolved from the
//    device via expo-localization, overridable in the profile (store.locale).
//  - Target language (content pack): what the user is LEARNING. Pack "flavor"
//    strings (taglines, "Entsperrt!") live with the pack, not here.
// t() falls back to English for any key a locale hasn't translated yet.
import { getLocales } from 'expo-localization';
import { en, type StringKey } from './en';
import { de } from './de';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import { pt } from './pt';
import { getState, useAppState } from '@/lib/store';
import { FALLBACK_LOCALE, isLocaleCode, type LocaleCode } from '@/lib/locales';

export type { StringKey };
export type { LocaleCode };

// Every locale in LOCALE_CODES needs an entry. A locale may be partial — t()
// falls back to English per key, so shipping a half-translated locale degrades
// string by string rather than showing raw keys.
const dictionaries: Record<LocaleCode, Partial<Record<StringKey, string>>> = {
  en,
  de,
  es,
  fr,
  it,
  pt,
};

let systemLocale: LocaleCode | null = null;
function detectSystemLocale(): LocaleCode {
  if (systemLocale) return systemLocale;
  // Match on the language subtag only: pt-BR and pt-PT both resolve to `pt`,
  // which is deliberate — we ship one Portuguese. Anything we don't speak
  // falls back to English, per the launch spec.
  const code = getLocales()[0]?.languageCode ?? '';
  systemLocale = isLocaleCode(code) ? code : FALLBACK_LOCALE;
  return systemLocale;
}

export function resolvedLocale(): LocaleCode {
  const pref = getState().locale;
  return pref === 'system' ? detectSystemLocale() : pref;
}

export function t(key: StringKey, vars?: Record<string, string | number>): string {
  let s = dictionaries[resolvedLocale()][key] ?? en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  }
  return s;
}

/** Hook variant: subscribes to the store so a locale change re-renders. */
export function useT(): typeof t {
  useAppState();
  return t;
}
