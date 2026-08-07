"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENGLISH_B2 = exports.ENGLISH_B1 = exports.ENGLISH_A2 = exports.ENGLISH_A1 = void 0;
const a1_vocab_1 = require("./a1-vocab");
const a1_sentences_1 = require("./a1-sentences");
const a2_vocab_1 = require("./a2-vocab");
const a2_sentences_1 = require("./a2-sentences");
const b1_vocab_1 = require("./b1-vocab");
const b2_vocab_1 = require("./b2-vocab");
const b1_sentences_1 = require("./b1-sentences");
const b2_sentences_1 = require("./b2-sentences");
// English. Full A1–B1, each level a distinct pack with no vocabulary shared
// between them — selecting B1 must never serve A1 words.
//
// Flavor lines follow the language being LEARNED, so they stay English for
// every UI locale — that is the point of them.
const ENGLISH_FLAVOR = {
    heroLocked: 'English first,\nTikTok after.',
    heroUnlocked: 'Enjoy it.',
    sessionDone: 'Unlocked!',
    correct: 'That’s it!',
    typedPlaceholder: 'in English…',
};
exports.ENGLISH_A1 = {
    id: 'en-a1',
    language: 'en',
    name: 'English · A1',
    level: 'A1',
    version: 1,
    speechLocale: 'en-GB',
    vocab: a1_vocab_1.A1_VOCAB,
    sentences: a1_sentences_1.A1_SENTENCES,
    flavor: ENGLISH_FLAVOR,
};
exports.ENGLISH_A2 = {
    id: 'en-a2',
    language: 'en',
    name: 'English · A2',
    level: 'A2',
    version: 1,
    speechLocale: 'en-GB',
    vocab: a2_vocab_1.A2_VOCAB,
    sentences: a2_sentences_1.A2_SENTENCES,
    flavor: ENGLISH_FLAVOR,
};
exports.ENGLISH_B1 = {
    id: 'en-b1',
    language: 'en',
    name: 'English · B1',
    level: 'B1',
    version: 1,
    speechLocale: 'en-GB',
    vocab: b1_vocab_1.B1_VOCAB,
    sentences: b1_sentences_1.B1_SENTENCES,
    flavor: ENGLISH_FLAVOR,
};
exports.ENGLISH_B2 = {
    id: 'en-b2',
    language: 'en',
    name: 'English · B2',
    level: 'B2',
    version: 1,
    speechLocale: 'en-GB',
    vocab: b2_vocab_1.B2_VOCAB,
    sentences: b2_sentences_1.B2_SENTENCES,
    flavor: ENGLISH_FLAVOR,
};
