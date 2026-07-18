import type { VocabItem } from '@/content/german/types';

// Spanish (es-ES / Peninsular (Spain)) A1 core vocabulary. The `de` field holds the
// Spanish text (see the note in content/german/types.ts). Nouns include the
// article (el/la) since knowing gender is part of the exercise. Categories stay
// chunky (10+ items) so the generator always finds same-category distractors.
//
// `gloss` carries the other UI locales. English lives in `en` and is the
// guaranteed fallback; Spanish itself is never glossed (a Spanish-UI user is
// never offered Spanish to learn), so each item covers de / fr / it / pt.
//
// Vocabulary is Peninsular (Spain) where the regions diverge: "el carro" (LatAm) vs
// "el coche" (Spain) — we teach "el coche" but accept both via the en array
// only where the split would otherwise mark a correct answer wrong.

export const A1_VOCAB: VocabItem[] = [
  // ── greetings & basics ────────────────────────────────────────────────
  { id: 'sv001', de: 'hola', en: ['hi', 'hello'], gloss: { de: ['hallo'], fr: ['salut'], it: ['ciao'], pt: ['oi'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'sv002', de: 'adiós', en: ['goodbye'], gloss: { de: ['tschüss'], fr: ['au revoir'], it: ['ciao', 'arrivederci'], pt: ['tchau'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'sv003', de: 'buenos días', en: ['good morning'], gloss: { de: ['guten Morgen'], fr: ['bonjour'], it: ['buongiorno'], pt: ['bom dia'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'sv004', de: 'buenas noches', en: ['good night', 'good evening'], gloss: { de: ['gute Nacht'], fr: ['bonne nuit'], it: ['buonanotte'], pt: ['boa noite'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'sv005', de: 'por favor', en: ['please'], gloss: { de: ['bitte'], fr: ['s’il vous plaît'], it: ['per favore'], pt: ['por favor'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'sv006', de: 'gracias', en: ['thank you'], gloss: { de: ['danke'], fr: ['merci'], it: ['grazie'], pt: ['obrigado'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'sv007', de: 'de nada', en: ['you’re welcome'], gloss: { de: ['gern geschehen'], fr: ['de rien'], it: ['prego'], pt: ['de nada'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'sv008', de: 'perdón', en: ['sorry', 'excuse me'], gloss: { de: ['Entschuldigung'], fr: ['pardon'], it: ['scusa'], pt: ['desculpa'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'sv009', de: 'sí', en: ['yes'], gloss: { de: ['ja'], fr: ['oui'], it: ['sì'], pt: ['sim'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'sv010', de: 'no', en: ['no'], gloss: { de: ['nein'], fr: ['non'], it: ['no'], pt: ['não'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'sv011', de: '¿qué tal?', en: ['how’s it going?'], gloss: { de: ['wie geht’s?'], fr: ['ça va ?'], it: ['come va?'], pt: ['tudo bem?'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'sv012', de: 'hasta luego', en: ['see you later'], gloss: { de: ['bis später'], fr: ['à plus tard'], it: ['a dopo'], pt: ['até logo'] }, pos: 'phrase', level: 'A1', category: 'greetings' },

  // ── people & family ───────────────────────────────────────────────────
  { id: 'sv013', de: 'el hombre', en: ['the man'], gloss: { de: ['der Mann'], fr: ['l’homme'], it: ['l’uomo'], pt: ['o homem'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'sv014', de: 'la mujer', en: ['the woman'], gloss: { de: ['die Frau'], fr: ['la femme'], it: ['la donna'], pt: ['a mulher'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'sv015', de: 'el niño', en: ['the boy', 'the child'], gloss: { de: ['der Junge'], fr: ['le garçon'], it: ['il bambino'], pt: ['o menino'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'sv016', de: 'la niña', en: ['the girl'], gloss: { de: ['das Mädchen'], fr: ['la fille'], it: ['la bambina'], pt: ['a menina'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'sv017', de: 'el amigo', en: ['the friend'], gloss: { de: ['der Freund'], fr: ['l’ami'], it: ['l’amico'], pt: ['o amigo'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'sv018', de: 'la madre', en: ['the mother'], gloss: { de: ['die Mutter'], fr: ['la mère'], it: ['la madre'], pt: ['a mãe'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'sv019', de: 'el padre', en: ['the father'], gloss: { de: ['der Vater'], fr: ['le père'], it: ['il padre'], pt: ['o pai'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'sv020', de: 'la hermana', en: ['the sister'], gloss: { de: ['die Schwester'], fr: ['la sœur'], it: ['la sorella'], pt: ['a irmã'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'sv021', de: 'el hermano', en: ['the brother'], gloss: { de: ['der Bruder'], fr: ['le frère'], it: ['il fratello'], pt: ['o irmão'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'sv022', de: 'la familia', en: ['the family'], gloss: { de: ['die Familie'], fr: ['la famille'], it: ['la famiglia'], pt: ['a família'] }, pos: 'noun', level: 'A1', category: 'people' },

  // ── food & drink ──────────────────────────────────────────────────────
  { id: 'sv023', de: 'el agua', en: ['the water'], gloss: { de: ['das Wasser'], fr: ['l’eau'], it: ['l’acqua'], pt: ['a água'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'sv024', de: 'el café', en: ['the coffee'], gloss: { de: ['der Kaffee'], fr: ['le café'], it: ['il caffè'], pt: ['o café'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'sv025', de: 'el pan', en: ['the bread'], gloss: { de: ['das Brot'], fr: ['le pain'], it: ['il pane'], pt: ['o pão'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'sv026', de: 'la leche', en: ['the milk'], gloss: { de: ['die Milch'], fr: ['le lait'], it: ['il latte'], pt: ['o leite'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'sv027', de: 'la cerveza', en: ['the beer'], gloss: { de: ['das Bier'], fr: ['la bière'], it: ['la birra'], pt: ['a cerveja'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'sv028', de: 'el vino', en: ['the wine'], gloss: { de: ['der Wein'], fr: ['le vin'], it: ['il vino'], pt: ['o vinho'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'sv029', de: 'la comida', en: ['the food', 'the meal'], gloss: { de: ['das Essen'], fr: ['la nourriture'], it: ['il cibo'], pt: ['a comida'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'sv030', de: 'la carne', en: ['the meat'], gloss: { de: ['das Fleisch'], fr: ['la viande'], it: ['la carne'], pt: ['a carne'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'sv031', de: 'el pescado', en: ['the fish'], gloss: { de: ['der Fisch'], fr: ['le poisson'], it: ['il pesce'], pt: ['o peixe'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'sv032', de: 'la fruta', en: ['the fruit'], gloss: { de: ['das Obst'], fr: ['le fruit'], it: ['la frutta'], pt: ['a fruta'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'sv033', de: 'el huevo', en: ['the egg'], gloss: { de: ['das Ei'], fr: ['l’œuf'], it: ['l’uovo'], pt: ['o ovo'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'sv034', de: 'la cuenta', en: ['the bill', 'the check'], gloss: { de: ['die Rechnung'], fr: ['l’addition'], it: ['il conto'], pt: ['a conta'] }, pos: 'noun', level: 'A1', category: 'food' },

  // ── places ────────────────────────────────────────────────────────────
  { id: 'sv035', de: 'la casa', en: ['the house', 'the home'], gloss: { de: ['das Haus'], fr: ['la maison'], it: ['la casa'], pt: ['a casa'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'sv036', de: 'la ciudad', en: ['the city'], gloss: { de: ['die Stadt'], fr: ['la ville'], it: ['la città'], pt: ['a cidade'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'sv037', de: 'la calle', en: ['the street'], gloss: { de: ['die Straße'], fr: ['la rue'], it: ['la strada'], pt: ['a rua'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'sv038', de: 'la tienda', en: ['the shop', 'the shop'], gloss: { de: ['der Laden'], fr: ['le magasin'], it: ['il negozio'], pt: ['a loja'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'sv039', de: 'el restaurante', en: ['the restaurant'], gloss: { de: ['das Restaurant'], fr: ['le restaurant'], it: ['il ristorante'], pt: ['o restaurante'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'sv040', de: 'la playa', en: ['the beach'], gloss: { de: ['der Strand'], fr: ['la plage'], it: ['la spiaggia'], pt: ['a praia'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'sv041', de: 'el trabajo', en: ['the work', 'the job'], gloss: { de: ['die Arbeit'], fr: ['le travail'], it: ['il lavoro'], pt: ['o trabalho'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'sv042', de: 'la escuela', en: ['the school'], gloss: { de: ['die Schule'], fr: ['l’école'], it: ['la scuola'], pt: ['a escola'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'sv043', de: 'el baño', en: ['the bathroom'], gloss: { de: ['die Toilette'], fr: ['les toilettes'], it: ['il bagno'], pt: ['o banheiro'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'sv044', de: 'la estación', en: ['the station'], gloss: { de: ['der Bahnhof'], fr: ['la gare'], it: ['la stazione'], pt: ['a estação'] }, pos: 'noun', level: 'A1', category: 'places' },

  // ── verbs ─────────────────────────────────────────────────────────────
  { id: 'sv045', de: 'ser', en: ['to be'], gloss: { de: ['sein'], fr: ['être'], it: ['essere'], pt: ['ser'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'sv046', de: 'tener', en: ['to have'], gloss: { de: ['haben'], fr: ['avoir'], it: ['avere'], pt: ['ter'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'sv047', de: 'hacer', en: ['to do', 'to make'], gloss: { de: ['machen'], fr: ['faire'], it: ['fare'], pt: ['fazer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'sv048', de: 'ir', en: ['to go'], gloss: { de: ['gehen'], fr: ['aller'], it: ['andare'], pt: ['ir'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'sv049', de: 'querer', en: ['to want'], gloss: { de: ['wollen'], fr: ['vouloir'], it: ['volere'], pt: ['querer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'sv050', de: 'comer', en: ['to eat'], gloss: { de: ['essen'], fr: ['manger'], it: ['mangiare'], pt: ['comer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'sv051', de: 'beber', en: ['to drink'], gloss: { de: ['trinken'], fr: ['boire'], it: ['bere'], pt: ['beber'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'sv052', de: 'hablar', en: ['to speak', 'to talk'], gloss: { de: ['sprechen'], fr: ['parler'], it: ['parlare'], pt: ['falar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'sv053', de: 'vivir', en: ['to live'], gloss: { de: ['leben', 'wohnen'], fr: ['vivre'], it: ['vivere'], pt: ['morar', 'viver'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'sv054', de: 'trabajar', en: ['to work'], gloss: { de: ['arbeiten'], fr: ['travailler'], it: ['lavorare'], pt: ['trabalhar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'sv055', de: 'comprar', en: ['to buy'], gloss: { de: ['kaufen'], fr: ['acheter'], it: ['comprare'], pt: ['comprar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'sv056', de: 'entender', en: ['to understand'], gloss: { de: ['verstehen'], fr: ['comprendre'], it: ['capire'], pt: ['entender'] }, pos: 'verb', level: 'A1', category: 'verbs' },

  // ── adjectives ────────────────────────────────────────────────────────
  { id: 'sv057', de: 'grande', en: ['big', 'large'], gloss: { de: ['groß'], fr: ['grand'], it: ['grande'], pt: ['grande'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'sv058', de: 'pequeño', en: ['small', 'little'], gloss: { de: ['klein'], fr: ['petit'], it: ['piccolo'], pt: ['pequeno'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'sv059', de: 'bueno', en: ['good'], gloss: { de: ['gut'], fr: ['bon'], it: ['buono'], pt: ['bom'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'sv060', de: 'malo', en: ['bad'], gloss: { de: ['schlecht'], fr: ['mauvais'], it: ['cattivo'], pt: ['ruim'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'sv061', de: 'caro', en: ['expensive'], gloss: { de: ['teuer'], fr: ['cher'], it: ['caro'], pt: ['caro'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'sv062', de: 'barato', en: ['cheap'], gloss: { de: ['billig'], fr: ['bon marché'], it: ['economico'], pt: ['barato'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'sv063', de: 'nuevo', en: ['new'], gloss: { de: ['neu'], fr: ['nouveau'], it: ['nuovo'], pt: ['novo'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'sv064', de: 'viejo', en: ['old'], gloss: { de: ['alt'], fr: ['vieux'], it: ['vecchio'], pt: ['velho'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'sv065', de: 'bonito', en: ['pretty', 'nice'], gloss: { de: ['schön'], fr: ['joli'], it: ['bello'], pt: ['bonito'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'sv066', de: 'cansado', en: ['tired'], gloss: { de: ['müde'], fr: ['fatigué'], it: ['stanco'], pt: ['cansado'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'sv067', de: 'fácil', en: ['easy'], gloss: { de: ['einfach'], fr: ['facile'], it: ['facile'], pt: ['fácil'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'sv068', de: 'difícil', en: ['difficult', 'hard'], gloss: { de: ['schwierig'], fr: ['difficile'], it: ['difficile'], pt: ['difícil'] }, pos: 'adj', level: 'A1', category: 'adjectives' },

  // ── numbers ───────────────────────────────────────────────────────────
  { id: 'sv069', de: 'uno', en: ['one'], gloss: { de: ['eins'], fr: ['un'], it: ['uno'], pt: ['um'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'sv070', de: 'dos', en: ['two'], gloss: { de: ['zwei'], fr: ['deux'], it: ['due'], pt: ['dois'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'sv071', de: 'tres', en: ['three'], gloss: { de: ['drei'], fr: ['trois'], it: ['tre'], pt: ['três'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'sv072', de: 'cuatro', en: ['four'], gloss: { de: ['vier'], fr: ['quatre'], it: ['quattro'], pt: ['quatro'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'sv073', de: 'cinco', en: ['five'], gloss: { de: ['fünf'], fr: ['cinq'], it: ['cinque'], pt: ['cinco'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'sv074', de: 'seis', en: ['six'], gloss: { de: ['sechs'], fr: ['six'], it: ['sei'], pt: ['seis'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'sv075', de: 'siete', en: ['seven'], gloss: { de: ['sieben'], fr: ['sept'], it: ['sette'], pt: ['sete'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'sv076', de: 'ocho', en: ['eight'], gloss: { de: ['acht'], fr: ['huit'], it: ['otto'], pt: ['oito'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'sv077', de: 'nueve', en: ['nine'], gloss: { de: ['neun'], fr: ['neuf'], it: ['nove'], pt: ['nove'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'sv078', de: 'diez', en: ['ten'], gloss: { de: ['zehn'], fr: ['dix'], it: ['dieci'], pt: ['dez'] }, pos: 'number', level: 'A1', category: 'numbers' },

  // ── time ──────────────────────────────────────────────────────────────
  { id: 'sv079', de: 'hoy', en: ['today'], gloss: { de: ['heute'], fr: ['aujourd’hui'], it: ['oggi'], pt: ['hoje'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'sv080', de: 'mañana', en: ['tomorrow'], gloss: { de: ['morgen'], fr: ['demain'], it: ['domani'], pt: ['amanhã'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'sv081', de: 'ayer', en: ['yesterday'], gloss: { de: ['gestern'], fr: ['hier'], it: ['ieri'], pt: ['ontem'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'sv082', de: 'ahora', en: ['now'], gloss: { de: ['jetzt'], fr: ['maintenant'], it: ['adesso'], pt: ['agora'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'sv083', de: 'siempre', en: ['always'], gloss: { de: ['immer'], fr: ['toujours'], it: ['sempre'], pt: ['sempre'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'sv084', de: 'nunca', en: ['never'], gloss: { de: ['nie'], fr: ['jamais'], it: ['mai'], pt: ['nunca'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'sv085', de: 'el día', en: ['the day'], gloss: { de: ['der Tag'], fr: ['le jour'], it: ['il giorno'], pt: ['o dia'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'sv086', de: 'la noche', en: ['the night'], gloss: { de: ['die Nacht'], fr: ['la nuit'], it: ['la notte'], pt: ['a noite'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'sv087', de: 'la semana', en: ['the week'], gloss: { de: ['die Woche'], fr: ['la semaine'], it: ['la settimana'], pt: ['a semana'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'sv088', de: 'el año', en: ['the year'], gloss: { de: ['das Jahr'], fr: ['l’année'], it: ['l’anno'], pt: ['o ano'] }, pos: 'noun', level: 'A1', category: 'time' },

  // ── questions & connectors ────────────────────────────────────────────
  { id: 'sv089', de: 'qué', en: ['what'], gloss: { de: ['was'], fr: ['quoi'], it: ['che cosa'], pt: ['o que'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'sv090', de: 'quién', en: ['who'], gloss: { de: ['wer'], fr: ['qui'], it: ['chi'], pt: ['quem'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'sv091', de: 'dónde', en: ['where'], gloss: { de: ['wo'], fr: ['où'], it: ['dove'], pt: ['onde'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'sv092', de: 'cuándo', en: ['when'], gloss: { de: ['wann'], fr: ['quand'], it: ['quando'], pt: ['quando'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'sv093', de: 'cómo', en: ['how'], gloss: { de: ['wie'], fr: ['comment'], it: ['come'], pt: ['como'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'sv094', de: 'por qué', en: ['why'], gloss: { de: ['warum'], fr: ['pourquoi'], it: ['perché'], pt: ['por que'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'sv095', de: 'cuánto', en: ['how much'], gloss: { de: ['wie viel'], fr: ['combien'], it: ['quanto'], pt: ['quanto'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'sv096', de: 'pero', en: ['but'], gloss: { de: ['aber'], fr: ['mais'], it: ['ma'], pt: ['mas'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'sv097', de: 'porque', en: ['because'], gloss: { de: ['weil'], fr: ['parce que'], it: ['perché'], pt: ['porque'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'sv098', de: 'también', en: ['also', 'too'], gloss: { de: ['auch'], fr: ['aussi'], it: ['anche'], pt: ['também'] }, pos: 'adv', level: 'A1', category: 'questions' },
];
