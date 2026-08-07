"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRENCH_B2 = exports.FRENCH_B1 = exports.FRENCH_A2 = exports.FRENCH_A1 = void 0;
const a1_vocab_1 = require("./a1-vocab");
const a1_sentences_1 = require("./a1-sentences");
const a2_vocab_1 = require("./a2-vocab");
const a2_sentences_1 = require("./a2-sentences");
const b1_vocab_1 = require("./b1-vocab");
const b2_vocab_1 = require("./b2-vocab");
const b1_sentences_1 = require("./b1-sentences");
const b2_sentences_1 = require("./b2-sentences");
// French. Full A1–B1, each level a distinct pack with no vocabulary shared
// between them — selecting B1 must never serve A1 words.
//
// Flavor lines follow the language being LEARNED, so they stay French for
// every UI locale — that is the point of them.
const FRENCH_FLAVOR = {
    heroLocked: 'D’abord le français,\nensuite TikTok.',
    heroUnlocked: 'Profites-en.',
    sessionDone: 'Débloqué !',
    correct: 'Exact !',
    typedPlaceholder: 'en français…',
};
exports.FRENCH_A1 = {
    id: 'fr-a1',
    language: 'fr',
    name: 'French · A1',
    level: 'A1',
    version: 1,
    speechLocale: 'fr-FR',
    vocab: a1_vocab_1.A1_VOCAB,
    sentences: a1_sentences_1.A1_SENTENCES,
    flavor: FRENCH_FLAVOR,
};
exports.FRENCH_A2 = {
    id: 'fr-a2',
    language: 'fr',
    name: 'French · A2',
    level: 'A2',
    version: 1,
    speechLocale: 'fr-FR',
    vocab: a2_vocab_1.A2_VOCAB,
    sentences: a2_sentences_1.A2_SENTENCES,
    flavor: FRENCH_FLAVOR,
};
exports.FRENCH_B1 = {
    id: 'fr-b1',
    language: 'fr',
    name: 'French · B1',
    level: 'B1',
    version: 1,
    speechLocale: 'fr-FR',
    vocab: b1_vocab_1.B1_VOCAB,
    sentences: b1_sentences_1.B1_SENTENCES,
    flavor: FRENCH_FLAVOR,
};
exports.FRENCH_B2 = {
    id: 'fr-b2',
    language: 'fr',
    name: 'French · B2',
    level: 'B2',
    version: 1,
    speechLocale: 'fr-FR',
    vocab: b2_vocab_1.B2_VOCAB,
    sentences: b2_sentences_1.B2_SENTENCES,
    flavor: FRENCH_FLAVOR,
};
