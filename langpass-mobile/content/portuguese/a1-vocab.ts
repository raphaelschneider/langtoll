import type { VocabItem } from '@/content/german/types';

// Brazilian Portuguese (pt-BR) A1 core vocabulary. The `de` field holds the
// Portuguese text (see the note in content/german/types.ts). Nouns include the
// article (o/a) since knowing gender is part of the exercise. Categories stay
// chunky (8+ items) so the generator always finds same-category distractors.
//
// `gloss` carries the other UI locales. English lives in `en` and is the
// guaranteed fallback; Portuguese itself is never glossed (a Portuguese-UI user
// is never offered Portuguese to learn), so each item covers de / es / fr / it.

export const A1_VOCAB: VocabItem[] = [
  // ── greetings & basics ────────────────────────────────────────────────
  { id: 'pv001', de: 'oi', en: ['hi'], gloss: { de: ['hi'], es: ['hola'], fr: ['salut'], it: ['ciao'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv002', de: 'olá', en: ['hello'], gloss: { de: ['hallo'], es: ['hola'], fr: ['bonjour'], it: ['salve'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv003', de: 'tchau', en: ['bye'], gloss: { de: ['tschüss'], es: ['adiós'], fr: ['au revoir'], it: ['ciao', 'arrivederci'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv004', de: 'bom dia', en: ['good morning'], gloss: { de: ['guten Morgen'], es: ['buenos días'], fr: ['bonjour'], it: ['buongiorno'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv005', de: 'boa noite', en: ['good night', 'good evening'], gloss: { de: ['gute Nacht', 'guten Abend'], es: ['buenas noches'], fr: ['bonne nuit', 'bonsoir'], it: ['buonanotte', 'buonasera'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv006', de: 'por favor', en: ['please'], gloss: { de: ['bitte'], es: ['por favor'], fr: ['s’il vous plaît'], it: ['per favore'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv007', de: 'obrigado', en: ['thank you'], gloss: { de: ['danke'], es: ['gracias'], fr: ['merci'], it: ['grazie'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv008', de: 'de nada', en: ['you’re welcome'], gloss: { de: ['gern geschehen'], es: ['de nada'], fr: ['de rien'], it: ['prego'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv009', de: 'desculpa', en: ['sorry', 'excuse me'], gloss: { de: ['Entschuldigung'], es: ['perdón', 'disculpa'], fr: ['pardon', 'excuse-moi'], it: ['scusa'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv010', de: 'sim', en: ['yes'], gloss: { de: ['ja'], es: ['sí'], fr: ['oui'], it: ['sì'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv011', de: 'não', en: ['no'], gloss: { de: ['nein'], es: ['no'], fr: ['non'], it: ['no'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'pv012', de: 'tudo bem', en: ['all good', 'how are you'], gloss: { de: ['alles gut', 'wie geht’s'], es: ['todo bien', 'qué tal'], fr: ['ça va'], it: ['tutto bene'] }, pos: 'phrase', level: 'A1', category: 'greetings' },

  // ── people & family ───────────────────────────────────────────────────
  { id: 'pv013', de: 'o homem', en: ['the man'], gloss: { de: ['der Mann'], es: ['el hombre'], fr: ['l’homme'], it: ['l’uomo'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv014', de: 'a mulher', en: ['the woman'], gloss: { de: ['die Frau'], es: ['la mujer'], fr: ['la femme'], it: ['la donna'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv015', de: 'a criança', en: ['the child'], gloss: { de: ['das Kind'], es: ['el niño'], fr: ['l’enfant'], it: ['il bambino'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv016', de: 'a mãe', en: ['the mother'], gloss: { de: ['die Mutter'], es: ['la madre'], fr: ['la mère'], it: ['la madre'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv017', de: 'o pai', en: ['the father'], gloss: { de: ['der Vater'], es: ['el padre'], fr: ['le père'], it: ['il padre'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv018', de: 'o irmão', en: ['the brother'], gloss: { de: ['der Bruder'], es: ['el hermano'], fr: ['le frère'], it: ['il fratello'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv019', de: 'a irmã', en: ['the sister'], gloss: { de: ['die Schwester'], es: ['la hermana'], fr: ['la sœur'], it: ['la sorella'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv020', de: 'o amigo', en: ['the friend (male)'], gloss: { de: ['der Freund'], es: ['el amigo'], fr: ['l’ami'], it: ['l’amico'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv021', de: 'a amiga', en: ['the friend (female)'], gloss: { de: ['die Freundin'], es: ['la amiga'], fr: ['l’amie'], it: ['l’amica'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'pv022', de: 'a família', en: ['the family'], gloss: { de: ['die Familie'], es: ['la familia'], fr: ['la famille'], it: ['la famiglia'] }, pos: 'noun', level: 'A1', category: 'people' },

  // ── food & drink ──────────────────────────────────────────────────────
  { id: 'pv023', de: 'o pão', en: ['the bread'], gloss: { de: ['das Brot'], es: ['el pan'], fr: ['le pain'], it: ['il pane'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv024', de: 'a água', en: ['the water'], gloss: { de: ['das Wasser'], es: ['el agua'], fr: ['l’eau'], it: ['l’acqua'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv025', de: 'o café', en: ['the coffee'], gloss: { de: ['der Kaffee'], es: ['el café'], fr: ['le café'], it: ['il caffè'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv026', de: 'o leite', en: ['the milk'], gloss: { de: ['die Milch'], es: ['la leche'], fr: ['le lait'], it: ['il latte'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv027', de: 'a maçã', en: ['the apple'], gloss: { de: ['der Apfel'], es: ['la manzana'], fr: ['la pomme'], it: ['la mela'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv028', de: 'o ovo', en: ['the egg'], gloss: { de: ['das Ei'], es: ['el huevo'], fr: ['l’œuf'], it: ['l’uovo'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv029', de: 'o queijo', en: ['the cheese'], gloss: { de: ['der Käse'], es: ['el queso'], fr: ['le fromage'], it: ['il formaggio'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv030', de: 'a cerveja', en: ['the beer'], gloss: { de: ['das Bier'], es: ['la cerveza'], fr: ['la bière'], it: ['la birra'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv031', de: 'o arroz', en: ['the rice'], gloss: { de: ['der Reis'], es: ['el arroz'], fr: ['le riz'], it: ['il riso'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv032', de: 'o feijão', en: ['the beans'], gloss: { de: ['die Bohnen'], es: ['las judías'], fr: ['les haricots'], it: ['i fagioli'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv033', de: 'a carne', en: ['the meat'], gloss: { de: ['das Fleisch'], es: ['la carne'], fr: ['la viande'], it: ['la carne'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv034', de: 'o açúcar', en: ['the sugar'], gloss: { de: ['der Zucker'], es: ['el azúcar'], fr: ['le sucre'], it: ['lo zucchero'] }, pos: 'noun', level: 'A1', category: 'food' },

  // ── common verbs ──────────────────────────────────────────────────────
  { id: 'pv035', de: 'ser', en: ['to be'], gloss: { de: ['sein'], es: ['ser'], fr: ['être'], it: ['essere'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv036', de: 'estar', en: ['to be (state)'], gloss: { de: ['sein (Zustand)'], es: ['estar'], fr: ['être (état)'], it: ['stare'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv037', de: 'ter', en: ['to have'], gloss: { de: ['haben'], es: ['tener'], fr: ['avoir'], it: ['avere'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv038', de: 'fazer', en: ['to do', 'to make'], gloss: { de: ['machen', 'tun'], es: ['hacer'], fr: ['faire'], it: ['fare'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv039', de: 'ir', en: ['to go'], gloss: { de: ['gehen'], es: ['ir'], fr: ['aller'], it: ['andare'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv040', de: 'querer', en: ['to want'], gloss: { de: ['wollen'], es: ['querer'], fr: ['vouloir'], it: ['volere'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv041', de: 'comer', en: ['to eat'], gloss: { de: ['essen'], es: ['comer'], fr: ['manger'], it: ['mangiare'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv042', de: 'beber', en: ['to drink'], gloss: { de: ['trinken'], es: ['beber'], fr: ['boire'], it: ['bere'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv043', de: 'falar', en: ['to speak'], gloss: { de: ['sprechen'], es: ['hablar'], fr: ['parler'], it: ['parlare'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv044', de: 'morar', en: ['to live (reside)'], gloss: { de: ['wohnen'], es: ['vivir'], fr: ['habiter'], it: ['abitare'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv045', de: 'gostar', en: ['to like'], gloss: { de: ['mögen'], es: ['gustar'], fr: ['aimer'], it: ['piacere'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv046', de: 'trabalhar', en: ['to work'], gloss: { de: ['arbeiten'], es: ['trabajar'], fr: ['travailler'], it: ['lavorare'] }, pos: 'verb', level: 'A1', category: 'verbs' },

  // ── numbers ───────────────────────────────────────────────────────────
  { id: 'pv047', de: 'um', en: ['one'], gloss: { de: ['eins'], es: ['uno'], fr: ['un'], it: ['uno'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv048', de: 'dois', en: ['two'], gloss: { de: ['zwei'], es: ['dos'], fr: ['deux'], it: ['due'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv049', de: 'três', en: ['three'], gloss: { de: ['drei'], es: ['tres'], fr: ['trois'], it: ['tre'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv050', de: 'quatro', en: ['four'], gloss: { de: ['vier'], es: ['cuatro'], fr: ['quatre'], it: ['quattro'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv051', de: 'cinco', en: ['five'], gloss: { de: ['fünf'], es: ['cinco'], fr: ['cinq'], it: ['cinque'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv052', de: 'seis', en: ['six'], gloss: { de: ['sechs'], es: ['seis'], fr: ['six'], it: ['sei'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv053', de: 'sete', en: ['seven'], gloss: { de: ['sieben'], es: ['siete'], fr: ['sept'], it: ['sette'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv054', de: 'oito', en: ['eight'], gloss: { de: ['acht'], es: ['ocho'], fr: ['huit'], it: ['otto'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv055', de: 'nove', en: ['nine'], gloss: { de: ['neun'], es: ['nueve'], fr: ['neuf'], it: ['nove'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv056', de: 'dez', en: ['ten'], gloss: { de: ['zehn'], es: ['diez'], fr: ['dix'], it: ['dieci'] }, pos: 'number', level: 'A1', category: 'numbers' },

  // ── time & days ───────────────────────────────────────────────────────
  { id: 'pv057', de: 'hoje', en: ['today'], gloss: { de: ['heute'], es: ['hoy'], fr: ['aujourd’hui'], it: ['oggi'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'pv058', de: 'amanhã', en: ['tomorrow'], gloss: { de: ['morgen'], es: ['mañana'], fr: ['demain'], it: ['domani'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'pv059', de: 'ontem', en: ['yesterday'], gloss: { de: ['gestern'], es: ['ayer'], fr: ['hier'], it: ['ieri'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'pv060', de: 'agora', en: ['now'], gloss: { de: ['jetzt'], es: ['ahora'], fr: ['maintenant'], it: ['adesso'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'pv061', de: 'sempre', en: ['always'], gloss: { de: ['immer'], es: ['siempre'], fr: ['toujours'], it: ['sempre'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'pv062', de: 'o dia', en: ['the day'], gloss: { de: ['der Tag'], es: ['el día'], fr: ['le jour'], it: ['il giorno'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'pv063', de: 'a semana', en: ['the week'], gloss: { de: ['die Woche'], es: ['la semana'], fr: ['la semaine'], it: ['la settimana'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'pv064', de: 'a hora', en: ['the hour', 'the time'], gloss: { de: ['die Stunde', 'die Uhrzeit'], es: ['la hora'], fr: ['l’heure'], it: ['l’ora'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'pv065', de: 'a noite', en: ['the night'], gloss: { de: ['die Nacht'], es: ['la noche'], fr: ['la nuit'], it: ['la notte'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'pv066', de: 'a manhã', en: ['the morning'], gloss: { de: ['der Morgen'], es: ['la mañana'], fr: ['le matin'], it: ['la mattina'] }, pos: 'noun', level: 'A1', category: 'time' },

  // ── places ────────────────────────────────────────────────────────────
  { id: 'pv067', de: 'a casa', en: ['the house', 'the home'], gloss: { de: ['das Haus'], es: ['la casa'], fr: ['la maison'], it: ['la casa'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv068', de: 'a rua', en: ['the street'], gloss: { de: ['die Straße'], es: ['la calle'], fr: ['la rue'], it: ['la strada'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv069', de: 'a cidade', en: ['the city'], gloss: { de: ['die Stadt'], es: ['la ciudad'], fr: ['la ville'], it: ['la città'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv070', de: 'a praia', en: ['the beach'], gloss: { de: ['der Strand'], es: ['la playa'], fr: ['la plage'], it: ['la spiaggia'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv071', de: 'o mercado', en: ['the market'], gloss: { de: ['der Markt'], es: ['el mercado'], fr: ['le marché'], it: ['il mercato'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv072', de: 'o restaurante', en: ['the restaurant'], gloss: { de: ['das Restaurant'], es: ['el restaurante'], fr: ['le restaurant'], it: ['il ristorante'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv073', de: 'o trabalho', en: ['the work', 'the job'], gloss: { de: ['die Arbeit'], es: ['el trabajo'], fr: ['le travail'], it: ['il lavoro'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv074', de: 'a escola', en: ['the school'], gloss: { de: ['die Schule'], es: ['la escuela'], fr: ['l’école'], it: ['la scuola'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv075', de: 'o banheiro', en: ['the bathroom'], gloss: { de: ['das Badezimmer'], es: ['el baño'], fr: ['la salle de bain'], it: ['il bagno'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'pv076', de: 'a loja', en: ['the shop', 'the shop'], gloss: { de: ['der Laden'], es: ['la tienda'], fr: ['le magasin'], it: ['il negozio'] }, pos: 'noun', level: 'A1', category: 'places' },

  // ── adjectives ────────────────────────────────────────────────────────
  { id: 'pv077', de: 'bom', en: ['good'], gloss: { de: ['gut'], es: ['bueno'], fr: ['bon'], it: ['buono'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv078', de: 'ruim', en: ['bad'], gloss: { de: ['schlecht'], es: ['malo'], fr: ['mauvais'], it: ['cattivo'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv079', de: 'grande', en: ['big'], gloss: { de: ['groß'], es: ['grande'], fr: ['grand'], it: ['grande'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv080', de: 'pequeno', en: ['small'], gloss: { de: ['klein'], es: ['pequeño'], fr: ['petit'], it: ['piccolo'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv081', de: 'bonito', en: ['beautiful', 'pretty'], gloss: { de: ['schön'], es: ['bonito'], fr: ['beau'], it: ['bello'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv082', de: 'caro', en: ['expensive'], gloss: { de: ['teuer'], es: ['caro'], fr: ['cher'], it: ['caro'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv083', de: 'barato', en: ['cheap'], gloss: { de: ['billig'], es: ['barato'], fr: ['bon marché'], it: ['economico'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv084', de: 'quente', en: ['hot'], gloss: { de: ['heiß'], es: ['caliente'], fr: ['chaud'], it: ['caldo'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv085', de: 'frio', en: ['cold'], gloss: { de: ['kalt'], es: ['frío'], fr: ['froid'], it: ['freddo'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv086', de: 'feliz', en: ['happy'], gloss: { de: ['glücklich'], es: ['feliz'], fr: ['heureux'], it: ['felice'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv087', de: 'cansado', en: ['tired'], gloss: { de: ['müde'], es: ['cansado'], fr: ['fatigué'], it: ['stanco'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv088', de: 'novo', en: ['new'], gloss: { de: ['neu'], es: ['nuevo'], fr: ['nouveau'], it: ['nuovo'] }, pos: 'adj', level: 'A1', category: 'adjectives' },

  // ── question words & connectors ───────────────────────────────────────
  { id: 'pv089', de: 'o que', en: ['what'], gloss: { de: ['was'], es: ['qué'], fr: ['quoi', 'qu’est-ce que'], it: ['che cosa'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'pv090', de: 'quem', en: ['who'], gloss: { de: ['wer'], es: ['quién'], fr: ['qui'], it: ['chi'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'pv091', de: 'onde', en: ['where'], gloss: { de: ['wo'], es: ['dónde'], fr: ['où'], it: ['dove'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'pv092', de: 'quando', en: ['when'], gloss: { de: ['wann'], es: ['cuándo'], fr: ['quand'], it: ['quando'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'pv093', de: 'por que', en: ['why'], gloss: { de: ['warum'], es: ['por qué'], fr: ['pourquoi'], it: ['perché'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'pv094', de: 'como', en: ['how'], gloss: { de: ['wie'], es: ['cómo'], fr: ['comment'], it: ['come'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'pv095', de: 'quanto', en: ['how much'], gloss: { de: ['wie viel'], es: ['cuánto'], fr: ['combien'], it: ['quanto'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'pv096', de: 'e', en: ['and'], gloss: { de: ['und'], es: ['y'], fr: ['et'], it: ['e'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'pv097', de: 'mas', en: ['but'], gloss: { de: ['aber'], es: ['pero'], fr: ['mais'], it: ['ma'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'pv098', de: 'porque', en: ['because'], gloss: { de: ['weil'], es: ['porque'], fr: ['parce que'], it: ['perché'] }, pos: 'conj', level: 'A1', category: 'questions' },

  // ── colours ───────────────────────────────────────────────────────────
  { id: 'pv099', de: 'a cor', en: ['the colour'], gloss: { de: ['die Farbe'], es: ['el color'], fr: ['la couleur'], it: ['il colore'] }, pos: 'noun', level: 'A1', category: 'colours' },
  { id: 'pv100', de: 'vermelho', en: ['red'], gloss: { de: ['rot'], es: ['rojo'], fr: ['rouge'], it: ['rosso'] }, pos: 'adj', level: 'A1', category: 'colours' },
  { id: 'pv101', de: 'azul', en: ['blue'], gloss: { de: ['blau'], es: ['azul'], fr: ['bleu'], it: ['blu'] }, pos: 'adj', level: 'A1', category: 'colours' },
  { id: 'pv102', de: 'verde', en: ['green'], gloss: { de: ['grün'], es: ['verde'], fr: ['vert'], it: ['verde'] }, pos: 'adj', level: 'A1', category: 'colours' },
  { id: 'pv103', de: 'amarelo', en: ['yellow'], gloss: { de: ['gelb'], es: ['amarillo'], fr: ['jaune'], it: ['giallo'] }, pos: 'adj', level: 'A1', category: 'colours' },
  { id: 'pv104', de: 'preto', en: ['black'], gloss: { de: ['schwarz'], es: ['negro'], fr: ['noir'], it: ['nero'] }, pos: 'adj', level: 'A1', category: 'colours' },
  { id: 'pv105', de: 'branco', en: ['white'], gloss: { de: ['weiß'], es: ['blanco'], fr: ['blanc'], it: ['bianco'] }, pos: 'adj', level: 'A1', category: 'colours' },
  { id: 'pv106', de: 'cinza', en: ['grey'], gloss: { de: ['grau'], es: ['gris'], fr: ['gris'], it: ['grigio'] }, pos: 'adj', level: 'A1', category: 'colours' },

  // ── clothes ───────────────────────────────────────────────────────────
  { id: 'pv107', de: 'a roupa', en: ['the clothes'], gloss: { de: ['die Kleidung'], es: ['la ropa'], fr: ['les vêtements'], it: ['i vestiti'] }, pos: 'noun', level: 'A1', category: 'clothes' },
  { id: 'pv108', de: 'a camisa', en: ['the shirt'], gloss: { de: ['das Hemd'], es: ['la camisa'], fr: ['la chemise'], it: ['la camicia'] }, pos: 'noun', level: 'A1', category: 'clothes' },
  { id: 'pv109', de: 'a calça', en: ['the trousers'], gloss: { de: ['die Hose'], es: ['los pantalones'], fr: ['le pantalon'], it: ['i pantaloni'] }, pos: 'noun', level: 'A1', category: 'clothes' },
  { id: 'pv110', de: 'o sapato', en: ['the shoe'], gloss: { de: ['der Schuh'], es: ['el zapato'], fr: ['la chaussure'], it: ['la scarpa'] }, pos: 'noun', level: 'A1', category: 'clothes' },
  { id: 'pv111', de: 'o vestido', en: ['the dress'], gloss: { de: ['das Kleid'], es: ['el vestido'], fr: ['la robe'], it: ['il vestito'] }, pos: 'noun', level: 'A1', category: 'clothes' },
  { id: 'pv112', de: 'o chapéu', en: ['the hat'], gloss: { de: ['der Hut'], es: ['el sombrero'], fr: ['le chapeau'], it: ['il cappello'] }, pos: 'noun', level: 'A1', category: 'clothes' },
  { id: 'pv113', de: 'a bolsa', en: ['the handbag'], gloss: { de: ['die Handtasche'], es: ['el bolso'], fr: ['le sac à main'], it: ['la borsa'] }, pos: 'noun', level: 'A1', category: 'clothes' },
  { id: 'pv114', de: 'o casaco', en: ['the coat'], gloss: { de: ['der Mantel'], es: ['el abrigo'], fr: ['le manteau'], it: ['il cappotto'] }, pos: 'noun', level: 'A1', category: 'clothes' },

  // ── more food & drink ─────────────────────────────────────────────────
  { id: 'pv115', de: 'a fruta', en: ['the fruit'], gloss: { de: ['das Obst'], es: ['la fruta'], fr: ['le fruit'], it: ['la frutta'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv116', de: 'a banana', en: ['the banana'], gloss: { de: ['die Banane'], es: ['el plátano'], fr: ['la banane'], it: ['la banana'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv117', de: 'a laranja', en: ['the orange'], gloss: { de: ['die Orange'], es: ['la naranja'], fr: ['l’orange'], it: ['l’arancia'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv118', de: 'o bolo', en: ['the cake'], gloss: { de: ['der Kuchen'], es: ['el pastel'], fr: ['le gâteau'], it: ['la torta'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv119', de: 'o sal', en: ['the salt'], gloss: { de: ['das Salz'], es: ['la sal'], fr: ['le sel'], it: ['il sale'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv120', de: 'a sopa', en: ['the soup'], gloss: { de: ['die Suppe'], es: ['la sopa'], fr: ['la soupe'], it: ['la zuppa'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv121', de: 'o chá', en: ['the tea'], gloss: { de: ['der Tee'], es: ['el té'], fr: ['le thé'], it: ['il tè'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'pv122', de: 'a manteiga', en: ['the butter'], gloss: { de: ['die Butter'], es: ['la mantequilla'], fr: ['le beurre'], it: ['il burro'] }, pos: 'noun', level: 'A1', category: 'food' },

  // ── everyday objects ──────────────────────────────────────────────────
  { id: 'pv123', de: 'a mesa', en: ['the table'], gloss: { de: ['der Tisch'], es: ['la mesa'], fr: ['la table'], it: ['il tavolo'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'pv124', de: 'a porta', en: ['the door'], gloss: { de: ['die Tür'], es: ['la puerta'], fr: ['la porte'], it: ['la porta'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'pv125', de: 'o copo', en: ['the glass'], gloss: { de: ['das Glas'], es: ['el vaso'], fr: ['le verre'], it: ['il bicchiere'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'pv126', de: 'a chave', en: ['the key'], gloss: { de: ['der Schlüssel'], es: ['la llave'], fr: ['la clé'], it: ['la chiave'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'pv127', de: 'o livro', en: ['the book'], gloss: { de: ['das Buch'], es: ['el libro'], fr: ['le livre'], it: ['il libro'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'pv128', de: 'a caneta', en: ['the pen'], gloss: { de: ['der Kugelschreiber'], es: ['el bolígrafo'], fr: ['le stylo'], it: ['la penna'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'pv129', de: 'o papel', en: ['the paper'], gloss: { de: ['das Papier'], es: ['el papel'], fr: ['le papier'], it: ['la carta'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'pv130', de: 'o relógio', en: ['the clock', 'the watch'], gloss: { de: ['die Uhr'], es: ['el reloj'], fr: ['la montre'], it: ['l’orologio'] }, pos: 'noun', level: 'A1', category: 'objects' },

  // ── more common verbs ─────────────────────────────────────────────────
  { id: 'pv131', de: 'ver', en: ['to see'], gloss: { de: ['sehen'], es: ['ver'], fr: ['voir'], it: ['vedere'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv132', de: 'ouvir', en: ['to hear', 'to listen'], gloss: { de: ['hören'], es: ['oír'], fr: ['entendre'], it: ['sentire'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv133', de: 'ler', en: ['to read'], gloss: { de: ['lesen'], es: ['leer'], fr: ['lire'], it: ['leggere'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv134', de: 'escrever', en: ['to write'], gloss: { de: ['schreiben'], es: ['escribir'], fr: ['écrire'], it: ['scrivere'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv135', de: 'abrir', en: ['to open'], gloss: { de: ['öffnen'], es: ['abrir'], fr: ['ouvrir'], it: ['aprire'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv136', de: 'fechar', en: ['to close'], gloss: { de: ['schließen'], es: ['cerrar'], fr: ['fermer'], it: ['chiudere'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv137', de: 'dar', en: ['to give'], gloss: { de: ['geben'], es: ['dar'], fr: ['donner'], it: ['dare'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'pv138', de: 'andar', en: ['to walk'], gloss: { de: ['laufen'], es: ['andar'], fr: ['marcher'], it: ['camminare'] }, pos: 'verb', level: 'A1', category: 'verbs' },

  // ── pronouns ──────────────────────────────────────────────────────────
  { id: 'pv139', de: 'eu', en: ['I'], gloss: { de: ['ich'], es: ['yo'], fr: ['je'], it: ['io'] }, pos: 'pronoun', level: 'A1', category: 'pronouns' },
  { id: 'pv140', de: 'você', en: ['you'], gloss: { de: ['du'], es: ['tú'], fr: ['tu'], it: ['tu'] }, pos: 'pronoun', level: 'A1', category: 'pronouns' },
  { id: 'pv141', de: 'ele', en: ['he'], gloss: { de: ['er'], es: ['él'], fr: ['il'], it: ['lui'] }, pos: 'pronoun', level: 'A1', category: 'pronouns' },
  { id: 'pv142', de: 'ela', en: ['she'], gloss: { de: ['sie'], es: ['ella'], fr: ['elle'], it: ['lei'] }, pos: 'pronoun', level: 'A1', category: 'pronouns' },
  { id: 'pv143', de: 'nós', en: ['we'], gloss: { de: ['wir'], es: ['nosotros'], fr: ['nous'], it: ['noi'] }, pos: 'pronoun', level: 'A1', category: 'pronouns' },
  { id: 'pv144', de: 'eles', en: ['they'], gloss: { de: ['sie (Plural)'], es: ['ellos'], fr: ['ils'], it: ['loro'] }, pos: 'pronoun', level: 'A1', category: 'pronouns' },
  { id: 'pv145', de: 'meu', en: ['my'], gloss: { de: ['mein'], es: ['mi'], fr: ['mon'], it: ['mio'] }, pos: 'pronoun', level: 'A1', category: 'pronouns' },
  { id: 'pv146', de: 'seu', en: ['your'], gloss: { de: ['dein'], es: ['tu'], fr: ['ton'], it: ['tuo'] }, pos: 'pronoun', level: 'A1', category: 'pronouns' },

  // ── more numbers ──────────────────────────────────────────────────────
  { id: 'pv147', de: 'onze', en: ['eleven'], gloss: { de: ['elf'], es: ['once'], fr: ['onze'], it: ['undici'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv148', de: 'doze', en: ['twelve'], gloss: { de: ['zwölf'], es: ['doce'], fr: ['douze'], it: ['dodici'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv149', de: 'treze', en: ['thirteen'], gloss: { de: ['dreizehn'], es: ['trece'], fr: ['treize'], it: ['tredici'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv150', de: 'quinze', en: ['fifteen'], gloss: { de: ['fünfzehn'], es: ['quince'], fr: ['quinze'], it: ['quindici'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv151', de: 'vinte', en: ['twenty'], gloss: { de: ['zwanzig'], es: ['veinte'], fr: ['vingt'], it: ['venti'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'pv152', de: 'cem', en: ['one hundred'], gloss: { de: ['hundert'], es: ['cien'], fr: ['cent'], it: ['cento'] }, pos: 'number', level: 'A1', category: 'numbers' },

  // ── more adjectives ───────────────────────────────────────────────────
  { id: 'pv153', de: 'alto', en: ['tall', 'high'], gloss: { de: ['groß', 'hoch'], es: ['alto'], fr: ['grand', 'haut'], it: ['alto'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv154', de: 'baixo', en: ['short', 'low'], gloss: { de: ['klein', 'niedrig'], es: ['bajo'], fr: ['petit', 'bas'], it: ['basso'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv155', de: 'gostoso', en: ['tasty'], gloss: { de: ['lecker'], es: ['sabroso'], fr: ['délicieux'], it: ['gustoso'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv156', de: 'cheio', en: ['full'], gloss: { de: ['voll'], es: ['lleno'], fr: ['plein'], it: ['pieno'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv157', de: 'vazio', en: ['empty'], gloss: { de: ['leer'], es: ['vacío'], fr: ['vide'], it: ['vuoto'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'pv158', de: 'doce', en: ['sweet'], gloss: { de: ['süß'], es: ['dulce'], fr: ['sucré'], it: ['dolce'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
];
