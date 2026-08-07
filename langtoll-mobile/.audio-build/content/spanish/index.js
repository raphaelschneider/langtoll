"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPANISH_B2 = exports.SPANISH_B1 = exports.SPANISH_A2 = exports.SPANISH_A1 = void 0;
const a1_vocab_1 = require("./a1-vocab");
const a1_sentences_1 = require("./a1-sentences");
const a2_vocab_1 = require("./a2-vocab");
const a2_sentences_1 = require("./a2-sentences");
const b1_vocab_1 = require("./b1-vocab");
const b2_vocab_1 = require("./b2-vocab");
const b1_sentences_1 = require("./b1-sentences");
const b2_sentences_1 = require("./b2-sentences");
// Spanish. A1 is the first fully-glossed pack — every item carries de/fr/it/pt
// alongside English, so a learner on any of our six UI locales trains against
// their own language. A2/B1 land next.
//
// Flavor lines follow the language being LEARNED, so they stay Spanish for
// every UI locale — that is the point of them.
const SPANISH_FLAVOR = {
    heroLocked: 'Primero español,\ndespués TikTok.',
    heroUnlocked: 'Disfruta.',
    sessionDone: '¡Desbloqueado!',
    correct: '¡Eso es!',
    typedPlaceholder: 'en español…',
};
exports.SPANISH_A1 = {
    id: 'es-a1',
    language: 'es',
    name: 'Spanish · A1',
    level: 'A1',
    version: 1,
    speechLocale: 'es-ES',
    vocab: a1_vocab_1.A1_VOCAB,
    sentences: a1_sentences_1.A1_SENTENCES,
    flavor: SPANISH_FLAVOR,
};
exports.SPANISH_A2 = {
    id: 'es-a2',
    language: 'es',
    name: 'Spanish · A2',
    level: 'A2',
    version: 1,
    speechLocale: 'es-ES',
    vocab: a2_vocab_1.A2_VOCAB,
    sentences: a2_sentences_1.A2_SENTENCES,
    flavor: SPANISH_FLAVOR,
};
exports.SPANISH_B1 = {
    id: 'es-b1',
    language: 'es',
    name: 'Spanish · B1',
    level: 'B1',
    version: 1,
    speechLocale: 'es-ES',
    vocab: b1_vocab_1.B1_VOCAB,
    sentences: b1_sentences_1.B1_SENTENCES,
    flavor: SPANISH_FLAVOR,
};
exports.SPANISH_B2 = {
    id: 'es-b2',
    language: 'es',
    name: 'Spanish · B2',
    level: 'B2',
    version: 1,
    speechLocale: 'es-ES',
    vocab: b2_vocab_1.B2_VOCAB,
    sentences: b2_sentences_1.B2_SENTENCES,
    flavor: SPANISH_FLAVOR,
};
