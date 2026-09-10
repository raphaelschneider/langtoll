// Tiny typed i18n. Two axes, deliberately separate:
//  - UI locale (this module): what the interface speaks. Resolved from the
//    device via expo-localization, overridable in the profile (store.locale).
//  - Target language (content pack): what the user is LEARNING. Pack "flavor"
//    strings (taglines, "Entsperrt!") live with the pack, not here.
// t() falls back to English for any key a locale hasn't translated yet.
import { Platform } from 'react-native';
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

// Some copy names the Dynamic Island, which NO iPad has — the sensor cutout is
// an iPhone 14 Pro-and-later part. On iPad that copy is a promise the hardware
// cannot keep (the paywall was selling island vocabulary to iPad buyers), so any
// key with a `@noisland` twin resolves to the twin there. The Live Activity
// itself is real on iPad — it appears on the Lock Screen — so the variants say
// Lock Screen rather than dropping the feature.
//
// `Platform.isPad` is the right test for THIS problem and is deliberately not a
// general "has an island" check: an iPhone SE or a 14 non-Pro has no island
// either and still reads the island copy. Fixing that needs a native capability
// probe; this does not pretend to be one.
const NO_ISLAND = Platform.OS === 'ios' && Platform.isPad;

export function t(key: StringKey, vars?: Record<string, string | number>): string {
  const dict = dictionaries[resolvedLocale()];
  let s: string | undefined;
  if (NO_ISLAND) {
    // Localized twin first, English twin second — never a localized string that
    // still names the island, which is the thing being corrected.
    const twin = `${key}@noisland` as StringKey;
    s = dict[twin] ?? en[twin];
  }
  s ??= dict[key] ?? en[key] ?? key;
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
