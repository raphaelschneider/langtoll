"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOCALE_ENDONYMS = exports.FALLBACK_LOCALE = exports.LOCALE_CODES = void 0;
exports.isLocaleCode = isLocaleCode;
// The UI locales LangToll speaks. Kept in its own module (rather than in
// lib/i18n) so the content layer can reference locale codes for glosses without
// importing the i18n runtime, which pulls in the store.
//
// Adding a locale = add the code here, add its dictionary in lib/i18n, and
// author the `gloss` entries in the content packs. Everything else — system
// locale detection, the settings picker, the onboarding language filter — is
// driven off this list.
exports.LOCALE_CODES = ['en', 'de', 'es', 'fr', 'it', 'pt'];
/** Every string and gloss is guaranteed to exist in this locale. */
exports.FALLBACK_LOCALE = 'en';
function isLocaleCode(value) {
    return exports.LOCALE_CODES.includes(value);
}
/**
 * Each locale's name in its own language. Deliberately NOT translated through
 * i18n: a picker exists for someone who can't read the current UI language, so
 * "Deutsch" has to stay "Deutsch" even when the app is showing Portuguese.
 */
exports.LOCALE_ENDONYMS = {
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
    it: 'Italiano',
    pt: 'Português',
};
