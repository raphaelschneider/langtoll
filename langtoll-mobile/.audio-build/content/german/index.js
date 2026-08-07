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
exports.GERMAN_B2 = exports.GERMAN_B1 = exports.GERMAN_A2 = exports.GERMAN_A1 = void 0;
exports.packForLevel = packForLevel;
exports.activePack = activePack;
const a1_vocab_1 = require("./a1-vocab");
const a1_sentences_1 = require("./a1-sentences");
const a2_vocab_1 = require("./a2-vocab");
const a2_sentences_1 = require("./a2-sentences");
const b1_vocab_1 = require("./b1-vocab");
const b2_vocab_1 = require("./b2-vocab");
const b1_sentences_1 = require("./b1-sentences");
const b2_sentences_1 = require("./b2-sentences");
__exportStar(require("./types"), exports);
// Flavor follows the language, not the level — shared across German packs.
const GERMAN_FLAVOR = {
    heroLocked: 'Erst Deutsch,\ndann TikTok.',
    heroUnlocked: 'Genieß es.',
    sessionDone: 'Entsperrt!',
    correct: 'Richtig!',
    typedPlaceholder: 'auf Deutsch…',
};
exports.GERMAN_A1 = {
    id: 'de-a1',
    language: 'de',
    name: 'German · A1',
    level: 'A1',
    version: 1,
    speechLocale: 'de-DE',
    vocab: a1_vocab_1.A1_VOCAB,
    sentences: a1_sentences_1.A1_SENTENCES,
    flavor: GERMAN_FLAVOR,
};
exports.GERMAN_A2 = {
    id: 'de-a2',
    language: 'de',
    name: 'German · A2',
    level: 'A2',
    version: 1,
    speechLocale: 'de-DE',
    vocab: a2_vocab_1.A2_VOCAB,
    sentences: a2_sentences_1.A2_SENTENCES,
    flavor: GERMAN_FLAVOR,
};
exports.GERMAN_B1 = {
    id: 'de-b1',
    language: 'de',
    name: 'German · B1',
    level: 'B1',
    version: 1,
    speechLocale: 'de-DE',
    vocab: b1_vocab_1.B1_VOCAB,
    sentences: b1_sentences_1.B1_SENTENCES,
    flavor: GERMAN_FLAVOR,
};
exports.GERMAN_B2 = {
    id: 'de-b2',
    language: 'de',
    name: 'German · B2',
    level: 'B2',
    version: 1,
    speechLocale: 'de-DE',
    vocab: b2_vocab_1.B2_VOCAB,
    sentences: b2_sentences_1.B2_SENTENCES,
    flavor: GERMAN_FLAVOR,
};
// Partial: a language may not ship every level yet (B2 is landing pack by pack),
// and packForLevel already falls back. A total Record would force every language
// to gain B2 in the same commit as the type.
const PACKS = {
    A1: exports.GERMAN_A1,
    A2: exports.GERMAN_A2,
    B1: exports.GERMAN_B1,
    B2: exports.GERMAN_B2,
};
function packForLevel(level) {
    return PACKS[level] ?? exports.GERMAN_A1;
}
/**
 * @deprecated Screens should use lib/pack's activePack(), which resolves the
 * user's level (and merges AI topic packs). Kept for anything level-agnostic.
 */
function activePack() {
    return exports.GERMAN_A1;
}
