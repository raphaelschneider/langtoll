import type { VocabItem } from '@/content/german/types';

// Brazilian Portuguese (pt-BR) A1 core vocabulary. The `de` field holds the
// Portuguese text (see the note in content/german/types.ts). Nouns include the
// article (o/a) since knowing gender is part of the exercise. Categories stay
// chunky (8+ items) so the generator always finds same-category distractors.

export const A1_VOCAB: VocabItem[] = [
  // ── greetings & basics ────────────────────────────────────────────────
  { id: 'pv001', de: 'oi', en: ['hi'], pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv002', de: 'olá', en: ['hello'], pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv003', de: 'tchau', en: ['bye'], pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv004', de: 'bom dia', en: ['good morning'], pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv005', de: 'boa noite', en: ['good night', 'good evening'], pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv006', de: 'por favor', en: ['please'], pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv007', de: 'obrigado', en: ['thank you'], pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv008', de: 'de nada', en: ['you’re welcome'], pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv009', de: 'desculpa', en: ['sorry', 'excuse me'], pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv010', de: 'sim', en: ['yes'], pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv011', de: 'não', en: ['no'], pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv012', de: 'tudo bem', en: ['all good', 'how are you'], pos: 'phrase', level: 'A1', category: 'greetings' },

  // ── people & family ───────────────────────────────────────────────────
  { id: 'pv013', de: 'o homem', en: ['the man'], pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv014', de: 'a mulher', en: ['the woman'], pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv015', de: 'a criança', en: ['the child'], pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv016', de: 'a mãe', en: ['the mother'], pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv017', de: 'o pai', en: ['the father'], pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv018', de: 'o irmão', en: ['the brother'], pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv019', de: 'a irmã', en: ['the sister'], pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv020', de: 'o amigo', en: ['the friend (male)'], pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv021', de: 'a amiga', en: ['the friend (female)'], pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv022', de: 'a família', en: ['the family'], pos: 'noun', level: 'A1', category: 'people' },

  // ── food & drink ──────────────────────────────────────────────────────
  { id: 'pv023', de: 'o pão', en: ['the bread'], pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv024', de: 'a água', en: ['the water'], pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv025', de: 'o café', en: ['the coffee'], pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv026', de: 'o leite', en: ['the milk'], pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv027', de: 'a maçã', en: ['the apple'], pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv028', de: 'o ovo', en: ['the egg'], pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv029', de: 'o queijo', en: ['the cheese'], pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv030', de: 'a cerveja', en: ['the beer'], pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv031', de: 'o arroz', en: ['the rice'], pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv032', de: 'o feijão', en: ['the beans'], pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv033', de: 'a carne', en: ['the meat'], pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv034', de: 'o açúcar', en: ['the sugar'], pos: 'noun', level: 'A1', category: 'food' },

  // ── common verbs ──────────────────────────────────────────────────────
  { id: 'pv035', de: 'ser', en: ['to be'], pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv036', de: 'estar', en: ['to be (state)'], pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv037', de: 'ter', en: ['to have'], pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv038', de: 'fazer', en: ['to do', 'to make'], pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv039', de: 'ir', en: ['to go'], pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv040', de: 'querer', en: ['to want'], pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv041', de: 'comer', en: ['to eat'], pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv042', de: 'beber', en: ['to drink'], pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv043', de: 'falar', en: ['to speak'], pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv044', de: 'morar', en: ['to live (reside)'], pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv045', de: 'gostar', en: ['to like'], pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv046', de: 'trabalhar', en: ['to work'], pos: 'verb', level: 'A1', category: 'verbs' },

  // ── numbers ───────────────────────────────────────────────────────────
  { id: 'pv047', de: 'um', en: ['one'], pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv048', de: 'dois', en: ['two'], pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv049', de: 'três', en: ['three'], pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv050', de: 'quatro', en: ['four'], pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv051', de: 'cinco', en: ['five'], pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv052', de: 'seis', en: ['six'], pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv053', de: 'sete', en: ['seven'], pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv054', de: 'oito', en: ['eight'], pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv055', de: 'nove', en: ['nine'], pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv056', de: 'dez', en: ['ten'], pos: 'number', level: 'A1', category: 'numbers' },

  // ── time & days ───────────────────────────────────────────────────────
  { id: 'pv057', de: 'hoje', en: ['today'], pos: 'adv', level: 'A1', category: 'time' },
  { id: 'pv058', de: 'amanhã', en: ['tomorrow'], pos: 'adv', level: 'A1', category: 'time' },
  { id: 'pv059', de: 'ontem', en: ['yesterday'], pos: 'adv', level: 'A1', category: 'time' },
  { id: 'pv060', de: 'agora', en: ['now'], pos: 'adv', level: 'A1', category: 'time' },
  { id: 'pv061', de: 'sempre', en: ['always'], pos: 'adv', level: 'A1', category: 'time' },
  { id: 'pv062', de: 'o dia', en: ['the day'], pos: 'noun', level: 'A1', category: 'time' },
  { id: 'pv063', de: 'a semana', en: ['the week'], pos: 'noun', level: 'A1', category: 'time' },
  { id: 'pv064', de: 'a hora', en: ['the hour', 'the time'], pos: 'noun', level: 'A1', category: 'time' },
  { id: 'pv065', de: 'a noite', en: ['the night'], pos: 'noun', level: 'A1', category: 'time' },
  { id: 'pv066', de: 'a manhã', en: ['the morning'], pos: 'noun', level: 'A1', category: 'time' },

  // ── places ────────────────────────────────────────────────────────────
  { id: 'pv067', de: 'a casa', en: ['the house', 'the home'], pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv068', de: 'a rua', en: ['the street'], pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv069', de: 'a cidade', en: ['the city'], pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv070', de: 'a praia', en: ['the beach'], pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv071', de: 'o mercado', en: ['the market'], pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv072', de: 'o restaurante', en: ['the restaurant'], pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv073', de: 'o trabalho', en: ['the work', 'the job'], pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv074', de: 'a escola', en: ['the school'], pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv075', de: 'o banheiro', en: ['the bathroom'], pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv076', de: 'a loja', en: ['the shop', 'the store'], pos: 'noun', level: 'A1', category: 'places' },

  // ── adjectives ────────────────────────────────────────────────────────
  { id: 'pv077', de: 'bom', en: ['good'], pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv078', de: 'ruim', en: ['bad'], pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv079', de: 'grande', en: ['big'], pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv080', de: 'pequeno', en: ['small'], pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv081', de: 'bonito', en: ['beautiful', 'pretty'], pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv082', de: 'caro', en: ['expensive'], pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv083', de: 'barato', en: ['cheap'], pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv084', de: 'quente', en: ['hot'], pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv085', de: 'frio', en: ['cold'], pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv086', de: 'feliz', en: ['happy'], pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv087', de: 'cansado', en: ['tired'], pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv088', de: 'novo', en: ['new'], pos: 'adj', level: 'A1', category: 'adjectives' },

  // ── question words & connectors ───────────────────────────────────────
  { id: 'pv089', de: 'o que', en: ['what'], pos: 'question', level: 'A1', category: 'questions' },
  { id: 'pv090', de: 'quem', en: ['who'], pos: 'question', level: 'A1', category: 'questions' },
  { id: 'pv091', de: 'onde', en: ['where'], pos: 'question', level: 'A1', category: 'questions' },
  { id: 'pv092', de: 'quando', en: ['when'], pos: 'question', level: 'A1', category: 'questions' },
  { id: 'pv093', de: 'por quê', en: ['why'], pos: 'question', level: 'A1', category: 'questions' },
  { id: 'pv094', de: 'como', en: ['how'], pos: 'question', level: 'A1', category: 'questions' },
  { id: 'pv095', de: 'quanto', en: ['how much'], pos: 'question', level: 'A1', category: 'questions' },
  { id: 'pv096', de: 'e', en: ['and'], pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'pv097', de: 'mas', en: ['but'], pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'pv098', de: 'porque', en: ['because'], pos: 'conj', level: 'A1', category: 'questions' },
];
