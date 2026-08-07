"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITALIAN_B2 = exports.ITALIAN_B1 = exports.ITALIAN_A2 = exports.ITALIAN_A1 = void 0;
const a1_vocab_1 = require("./a1-vocab");
const a1_sentences_1 = require("./a1-sentences");
const a2_vocab_1 = require("./a2-vocab");
const a2_sentences_1 = require("./a2-sentences");
const b1_vocab_1 = require("./b1-vocab");
const b2_vocab_1 = require("./b2-vocab");
const b1_sentences_1 = require("./b1-sentences");
const b2_sentences_1 = require("./b2-sentences");
// Italian. Full A1–B1, each level a distinct pack with no vocabulary shared
// between them — selecting B1 must never serve A1 words.
//
// Flavor lines follow the language being LEARNED, so they stay Italian for
// every UI locale — that is the point of them.
const ITALIAN_FLAVOR = {
    heroLocked: 'Prima l’italiano,\npoi TikTok.',
    heroUnlocked: 'Goditelo.',
    sessionDone: 'Sbloccato!',
    correct: 'Esatto!',
    typedPlaceholder: 'in italiano…',
};
exports.ITALIAN_A1 = {
    id: 'it-a1',
    language: 'it',
    name: 'Italian · A1',
    level: 'A1',
    version: 1,
    speechLocale: 'it-IT',
    vocab: a1_vocab_1.A1_VOCAB,
    sentences: a1_sentences_1.A1_SENTENCES,
    flavor: ITALIAN_FLAVOR,
};
exports.ITALIAN_A2 = {
    id: 'it-a2',
    language: 'it',
    name: 'Italian · A2',
    level: 'A2',
    version: 1,
    speechLocale: 'it-IT',
    vocab: a2_vocab_1.A2_VOCAB,
    sentences: a2_sentences_1.A2_SENTENCES,
    flavor: ITALIAN_FLAVOR,
};
exports.ITALIAN_B1 = {
    id: 'it-b1',
    language: 'it',
    name: 'Italian · B1',
    level: 'B1',
    version: 1,
    speechLocale: 'it-IT',
    vocab: b1_vocab_1.B1_VOCAB,
    sentences: b1_sentences_1.B1_SENTENCES,
    flavor: ITALIAN_FLAVOR,
};
exports.ITALIAN_B2 = {
    id: 'it-b2',
    language: 'it',
    name: 'Italian · B2',
    level: 'B2',
    version: 1,
    speechLocale: 'it-IT',
    vocab: b2_vocab_1.B2_VOCAB,
    sentences: b2_sentences_1.B2_SENTENCES,
    flavor: ITALIAN_FLAVOR,
};
