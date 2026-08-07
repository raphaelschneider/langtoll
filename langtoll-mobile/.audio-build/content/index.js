"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.availableLanguages = availableLanguages;
exports.learnableLanguages = learnableLanguages;
exports.soonLanguages = soonLanguages;
exports.levelsFor = levelsFor;
exports.packFor = packFor;
const german_1 = require("@/content/german");
const portuguese_1 = require("@/content/portuguese");
const spanish_1 = require("@/content/spanish");
const italian_1 = require("@/content/italian");
const french_1 = require("@/content/french");
const english_1 = require("@/content/english");
__exportStar(require("@/content/german/types"), exports);
// Partial<Record<Level, …>> because a language need not offer every level yet
// (a language need not offer every level yet — packFor falls back to the highest
// authored level, which is why a half-authored language shows lower-level words).
const REGISTRY = {
    de: { A1: german_1.GERMAN_A1, A2: german_1.GERMAN_A2, B1: german_1.GERMAN_B1, B2: german_1.GERMAN_B2 },
    pt: { A1: portuguese_1.PORTUGUESE_A1, A2: portuguese_1.PORTUGUESE_A2, B1: portuguese_1.PORTUGUESE_B1, B2: portuguese_1.PORTUGUESE_B2 },
    en: { A1: english_1.ENGLISH_A1, A2: english_1.ENGLISH_A2, B1: english_1.ENGLISH_B1, B2: english_1.ENGLISH_B2 },
    es: { A1: spanish_1.SPANISH_A1, A2: spanish_1.SPANISH_A2, B1: spanish_1.SPANISH_B1, B2: spanish_1.SPANISH_B2 },
    fr: { A1: french_1.FRENCH_A1, A2: french_1.FRENCH_A2, B1: french_1.FRENCH_B1, B2: french_1.FRENCH_B2 },
    it: { A1: italian_1.ITALIAN_A1, A2: italian_1.ITALIAN_A2, B1: italian_1.ITALIAN_B1, B2: italian_1.ITALIAN_B2 },
};
/** Languages that actually have at least one pack — what the picker offers. */
function availableLanguages() {
    return Object.keys(REGISTRY).filter((l) => Object.keys(REGISTRY[l]).length > 0);
}
/**
 * Languages we offer to someone whose interface is `uiLocale`. We never offer
 * a user their own UI language — an English UI learning English is nonsense,
 * and the locale codes and Language codes share the same alphabet ('de', 'pt',
 * …) so a plain inequality is the whole rule.
 */
function learnableLanguages(uiLocale) {
    return availableLanguages().filter((l) => l !== uiLocale);
}
/**
 * Languages shown as "SOON" — everything we intend to teach that has no pack
 * yet, minus the user's own UI language. Derived rather than hardcoded so a
 * language moves from SOON to the real list the moment its pack lands in
 * REGISTRY, with no second place to remember to edit.
 */
function soonLanguages(uiLocale) {
    const shipped = new Set(availableLanguages());
    return Object.keys(REGISTRY).filter((l) => !shipped.has(l) && l !== uiLocale);
}
/** Levels a language ships, in order. */
function levelsFor(language) {
    return ['A1', 'A2', 'B1', 'B2'].filter((lvl) => REGISTRY[language][lvl]);
}
/**
 * Resolve the pack for (language, level), degrading gracefully: if the exact
 * level isn't authored yet, fall back to the highest available for that
 * language, then to German A1 as a last resort.
 */
function packFor(language, level) {
    const byLevel = REGISTRY[language];
    if (byLevel[level])
        return byLevel[level];
    const available = levelsFor(language);
    if (available.length)
        return byLevel[available[available.length - 1]];
    return german_1.GERMAN_A1;
}
