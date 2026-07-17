// Tiny typed i18n. Two axes, deliberately separate:
//  - UI locale (this module): what the interface speaks. Resolved from the
//    device via expo-localization, overridable in the profile (store.locale).
//  - Target language (content pack): what the user is LEARNING. Pack "flavor"
//    strings (taglines, "Entsperrt!") live with the pack, not here.
// t() falls back to English for any key a locale hasn't translated yet.
import { getLocales } from 'expo-localization';
import { en, type StringKey } from './en';
import { de } from './de';
import { getState, useAppState } from '@/lib/store';

export type { StringKey };
export type LocaleCode = 'en' | 'de';

const dictionaries: Record<LocaleCode, Partial<Record<StringKey, string>>> = { en, de };

let systemLocale: LocaleCode | null = null;
function detectSystemLocale(): LocaleCode {
  if (systemLocale) return systemLocale;
  const code = getLocales()[0]?.languageCode;
  systemLocale = code === 'de' ? 'de' : 'en';
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
