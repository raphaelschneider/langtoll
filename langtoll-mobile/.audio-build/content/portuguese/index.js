"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORTUGUESE_B2 = exports.PORTUGUESE_B1 = exports.PORTUGUESE_A2 = exports.PORTUGUESE_A1 = void 0;
const a1_vocab_1 = require("./a1-vocab");
const a1_sentences_1 = require("./a1-sentences");
const a2_vocab_1 = require("./a2-vocab");
const a2_sentences_1 = require("./a2-sentences");
const b1_vocab_1 = require("./b1-vocab");
const b2_vocab_1 = require("./b2-vocab");
const b1_sentences_1 = require("./b1-sentences");
const b2_sentences_1 = require("./b2-sentences");
// Brazilian Portuguese. Full A1–B1. Each level is a distinct pack with no
// vocabulary shared between them — selecting B1 must never serve A1 words.
const PORTUGUESE_FLAVOR = {
    heroLocked: 'Primeiro português,\ndepois TikTok.',
    heroUnlocked: 'Aproveita.',
    sessionDone: 'Desbloqueado!',
    correct: 'Isso!',
    typedPlaceholder: 'em português…',
};
exports.PORTUGUESE_A1 = {
    id: 'pt-a1',
    language: 'pt',
    name: 'Portuguese · A1',
    level: 'A1',
    version: 1,
    speechLocale: 'pt-BR',
    vocab: a1_vocab_1.A1_VOCAB,
    sentences: a1_sentences_1.A1_SENTENCES,
    flavor: PORTUGUESE_FLAVOR,
};
exports.PORTUGUESE_A2 = {
    id: 'pt-a2',
    language: 'pt',
    name: 'Portuguese · A2',
    level: 'A2',
    version: 1,
    speechLocale: 'pt-BR',
    vocab: a2_vocab_1.A2_VOCAB,
    sentences: a2_sentences_1.A2_SENTENCES,
    flavor: PORTUGUESE_FLAVOR,
};
exports.PORTUGUESE_B1 = {
    id: 'pt-b1',
    language: 'pt',
    name: 'Portuguese · B1',
    level: 'B1',
    version: 1,
    speechLocale: 'pt-BR',
    vocab: b1_vocab_1.B1_VOCAB,
    sentences: b1_sentences_1.B1_SENTENCES,
    flavor: PORTUGUESE_FLAVOR,
};
exports.PORTUGUESE_B2 = {
    id: 'pt-b2',
    language: 'pt',
    name: 'Portuguese · B2',
    level: 'B2',
    version: 1,
    speechLocale: 'pt-BR',
    vocab: b2_vocab_1.B2_VOCAB,
    sentences: b2_sentences_1.B2_SENTENCES,
    flavor: PORTUGUESE_FLAVOR,
};
