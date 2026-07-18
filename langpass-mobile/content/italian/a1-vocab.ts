import type { VocabItem } from '@/content/german/types';

// Italian (it-IT) A1 core vocabulary. The `de` field holds the Italian text
// (see the note in content/german/types.ts). Nouns include the article, which
// in Italian is chosen by the SOUND that follows, not just the gender:
//   il  — masculine before most consonants (il pane, il ragazzo)
//   lo  — masculine before s+consonant, z, gn, ps, y (lo studente, lo zio)
//   l'  — masculine or feminine before a vowel (l'amico, l'acqua)
//   la  — feminine before a consonant (la casa)
// Getting that right is part of the exercise, so the article ships with the noun.
//
// `gloss` carries the other UI locales. English lives in `en` and is the
// guaranteed fallback; Italian itself is never glossed (an Italian-UI user is
// never offered Italian to learn), so each item covers de / es / fr / pt.

export const A1_VOCAB: VocabItem[] = [
  // ── greetings & basics ────────────────────────────────────────────────
  { id: 'it1v001', de: 'ciao', en: ['hi', 'hello', 'bye'], gloss: { de: ['hallo'], es: ['hola'], fr: ['salut'], pt: ['oi'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'it1v002', de: 'salve', en: ['hello'], gloss: { de: ['guten Tag'], es: ['buenas'], fr: ['bonjour'], pt: ['olá'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'it1v003', de: 'arrivederci', en: ['goodbye'], gloss: { de: ['auf Wiedersehen'], es: ['adiós'], fr: ['au revoir'], pt: ['tchau'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'it1v004', de: 'buongiorno', en: ['good morning'], gloss: { de: ['guten Morgen'], es: ['buenos días'], fr: ['bonjour'], pt: ['bom dia'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'it1v005', de: 'buonasera', en: ['good evening'], gloss: { de: ['guten Abend'], es: ['buenas tardes'], fr: ['bonsoir'], pt: ['boa tarde'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'it1v006', de: 'buonanotte', en: ['good night'], gloss: { de: ['gute Nacht'], es: ['buenas noches'], fr: ['bonne nuit'], pt: ['boa noite'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'it1v007', de: 'per favore', en: ['please'], gloss: { de: ['bitte'], es: ['por favor'], fr: ['s’il vous plaît'], pt: ['por favor'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'it1v008', de: 'grazie', en: ['thank you'], gloss: { de: ['danke'], es: ['gracias'], fr: ['merci'], pt: ['obrigado'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'it1v009', de: 'prego', en: ['you’re welcome'], gloss: { de: ['gern geschehen'], es: ['de nada'], fr: ['de rien'], pt: ['de nada'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'it1v010', de: 'scusa', en: ['sorry', 'excuse me'], gloss: { de: ['Entschuldigung'], es: ['perdón'], fr: ['pardon'], pt: ['desculpa'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'it1v011', de: 'sì', en: ['yes'], gloss: { de: ['ja'], es: ['sí'], fr: ['oui'], pt: ['sim'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'it1v012', de: 'no', en: ['no'], gloss: { de: ['nein'], es: ['no'], fr: ['non'], pt: ['não'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'it1v013', de: 'come va?', en: ['how’s it going?'], gloss: { de: ['wie geht’s?'], es: ['¿qué tal?'], fr: ['ça va ?'], pt: ['tudo bem?'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'it1v014', de: 'a dopo', en: ['see you later'], gloss: { de: ['bis später'], es: ['hasta luego'], fr: ['à plus tard'], pt: ['até logo'] }, pos: 'phrase', level: 'A1', category: 'greetings' },

  // ── people & family ───────────────────────────────────────────────────
  { id: 'it1v015', de: 'l’uomo', en: ['the man'], gloss: { de: ['der Mann'], es: ['el hombre'], fr: ['l’homme'], pt: ['o homem'] }, pos: 'noun', gender: 'm', level: 'A1', category: 'people' },
  { id: 'it1v016', de: 'la donna', en: ['the woman'], gloss: { de: ['die Frau'], es: ['la mujer'], fr: ['la femme'], pt: ['a mulher'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'it1v017', de: 'il bambino', en: ['the child', 'the little boy'], gloss: { de: ['das Kind'], es: ['el niño'], fr: ['l’enfant'], pt: ['a criança'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'it1v018', de: 'la bambina', en: ['the little girl'], gloss: { de: ['das Mädchen'], es: ['la niña'], fr: ['la petite fille'], pt: ['a menina'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'it1v019', de: 'il ragazzo', en: ['the boy'], gloss: { de: ['der Junge'], es: ['el chico'], fr: ['le garçon'], pt: ['o rapaz'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'it1v020', de: 'la ragazza', en: ['the girl'], gloss: { de: ['das Mädchen'], es: ['la chica'], fr: ['la fille'], pt: ['a moça'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'it1v021', de: 'l’amico', en: ['the friend'], gloss: { de: ['der Freund'], es: ['el amigo'], fr: ['l’ami'], pt: ['o amigo'] }, pos: 'noun', gender: 'm', level: 'A1', category: 'people' },
  { id: 'it1v022', de: 'la madre', en: ['the mother'], gloss: { de: ['die Mutter'], es: ['la madre'], fr: ['la mère'], pt: ['a mãe'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'it1v023', de: 'il padre', en: ['the father'], gloss: { de: ['der Vater'], es: ['el padre'], fr: ['le père'], pt: ['o pai'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'it1v024', de: 'la sorella', en: ['the sister'], gloss: { de: ['die Schwester'], es: ['la hermana'], fr: ['la sœur'], pt: ['a irmã'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'it1v025', de: 'il fratello', en: ['the brother'], gloss: { de: ['der Bruder'], es: ['el hermano'], fr: ['le frère'], pt: ['o irmão'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'it1v026', de: 'la famiglia', en: ['the family'], gloss: { de: ['die Familie'], es: ['la familia'], fr: ['la famille'], pt: ['a família'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'it1v027', de: 'il figlio', en: ['the son'], gloss: { de: ['der Sohn'], es: ['el hijo'], fr: ['le fils'], pt: ['o filho'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'it1v028', de: 'la figlia', en: ['the daughter'], gloss: { de: ['die Tochter'], es: ['la hija'], fr: ['la fille'], pt: ['a filha'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'it1v029', de: 'lo zio', en: ['the uncle'], gloss: { de: ['der Onkel'], es: ['el tío'], fr: ['l’oncle'], pt: ['o tio'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'it1v030', de: 'la zia', en: ['the aunt'], gloss: { de: ['die Tante'], es: ['la tía'], fr: ['la tante'], pt: ['a tia'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'it1v031', de: 'lo studente', en: ['the student'], gloss: { de: ['der Student'], es: ['el estudiante'], fr: ['l’étudiant'], pt: ['o estudante'] }, pos: 'noun', level: 'A1', category: 'people' },

  // ── food & drink ──────────────────────────────────────────────────────
  { id: 'it1v032', de: 'l’acqua', en: ['the water'], gloss: { de: ['das Wasser'], es: ['el agua'], fr: ['l’eau'], pt: ['a água'] }, pos: 'noun', gender: 'f', level: 'A1', category: 'food' },
  { id: 'it1v033', de: 'il caffè', en: ['the coffee'], gloss: { de: ['der Kaffee'], es: ['el café'], fr: ['le café'], pt: ['o café'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'it1v034', de: 'il pane', en: ['the bread'], gloss: { de: ['das Brot'], es: ['el pan'], fr: ['le pain'], pt: ['o pão'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'it1v035', de: 'il latte', en: ['the milk'], gloss: { de: ['die Milch'], es: ['la leche'], fr: ['le lait'], pt: ['o leite'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'it1v036', de: 'la birra', en: ['the beer'], gloss: { de: ['das Bier'], es: ['la cerveza'], fr: ['la bière'], pt: ['a cerveja'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'it1v037', de: 'il vino', en: ['the wine'], gloss: { de: ['der Wein'], es: ['el vino'], fr: ['le vin'], pt: ['o vinho'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'it1v038', de: 'il cibo', en: ['the food'], gloss: { de: ['das Essen'], es: ['la comida'], fr: ['la nourriture'], pt: ['a comida'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'it1v039', de: 'la carne', en: ['the meat'], gloss: { de: ['das Fleisch'], es: ['la carne'], fr: ['la viande'], pt: ['a carne'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'it1v040', de: 'il pesce', en: ['the fish'], gloss: { de: ['der Fisch'], es: ['el pescado'], fr: ['le poisson'], pt: ['o peixe'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'it1v041', de: 'la frutta', en: ['the fruit'], gloss: { de: ['das Obst'], es: ['la fruta'], fr: ['les fruits'], pt: ['a fruta'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'it1v042', de: 'l’uovo', en: ['the egg'], gloss: { de: ['das Ei'], es: ['el huevo'], fr: ['l’œuf'], pt: ['o ovo'] }, pos: 'noun', gender: 'm', level: 'A1', category: 'food' },
  { id: 'it1v043', de: 'il conto', en: ['the bill', 'the check'], gloss: { de: ['die Rechnung'], es: ['la cuenta'], fr: ['l’addition'], pt: ['a conta'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'it1v044', de: 'la pizza', en: ['the pizza'], gloss: { de: ['die Pizza'], es: ['la pizza'], fr: ['la pizza'], pt: ['a pizza'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'it1v045', de: 'il formaggio', en: ['the cheese'], gloss: { de: ['der Käse'], es: ['el queso'], fr: ['le fromage'], pt: ['o queijo'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'it1v046', de: 'il gelato', en: ['the ice cream'], gloss: { de: ['das Eis'], es: ['el helado'], fr: ['la glace'], pt: ['o sorvete'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'it1v047', de: 'lo zucchero', en: ['the sugar'], gloss: { de: ['der Zucker'], es: ['el azúcar'], fr: ['le sucre'], pt: ['o açúcar'] }, pos: 'noun', level: 'A1', category: 'food' },

  // ── places ────────────────────────────────────────────────────────────
  { id: 'it1v048', de: 'la casa', en: ['the house', 'the home'], gloss: { de: ['das Haus'], es: ['la casa'], fr: ['la maison'], pt: ['a casa'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'it1v049', de: 'la città', en: ['the city'], gloss: { de: ['die Stadt'], es: ['la ciudad'], fr: ['la ville'], pt: ['a cidade'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'it1v050', de: 'la strada', en: ['the street', 'the road'], gloss: { de: ['die Straße'], es: ['la calle'], fr: ['la rue'], pt: ['a rua'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'it1v051', de: 'il negozio', en: ['the shop', 'the shop'], gloss: { de: ['der Laden'], es: ['la tienda'], fr: ['le magasin'], pt: ['a loja'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'it1v052', de: 'il ristorante', en: ['the restaurant'], gloss: { de: ['das Restaurant'], es: ['el restaurante'], fr: ['le restaurant'], pt: ['o restaurante'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'it1v053', de: 'la spiaggia', en: ['the beach'], gloss: { de: ['der Strand'], es: ['la playa'], fr: ['la plage'], pt: ['a praia'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'it1v054', de: 'il lavoro', en: ['the work', 'the job'], gloss: { de: ['die Arbeit'], es: ['el trabajo'], fr: ['le travail'], pt: ['o trabalho'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'it1v055', de: 'la scuola', en: ['the school'], gloss: { de: ['die Schule'], es: ['la escuela'], fr: ['l’école'], pt: ['a escola'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'it1v056', de: 'il bagno', en: ['the bathroom'], gloss: { de: ['die Toilette'], es: ['el baño'], fr: ['les toilettes'], pt: ['o banheiro'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'it1v057', de: 'la stazione', en: ['the station'], gloss: { de: ['der Bahnhof'], es: ['la estación'], fr: ['la gare'], pt: ['a estação'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'it1v058', de: 'l’albergo', en: ['the hotel'], gloss: { de: ['das Hotel'], es: ['el hotel'], fr: ['l’hôtel'], pt: ['o hotel'] }, pos: 'noun', gender: 'm', level: 'A1', category: 'places' },
  { id: 'it1v059', de: 'il mercato', en: ['the market'], gloss: { de: ['der Markt'], es: ['el mercado'], fr: ['le marché'], pt: ['o mercado'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'it1v060', de: 'l’ufficio', en: ['the office'], gloss: { de: ['das Büro'], es: ['la oficina'], fr: ['le bureau'], pt: ['o escritório'] }, pos: 'noun', gender: 'm', level: 'A1', category: 'places' },

  // ── verbs ─────────────────────────────────────────────────────────────
  { id: 'it1v061', de: 'essere', en: ['to be'], gloss: { de: ['sein'], es: ['ser'], fr: ['être'], pt: ['ser'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'it1v062', de: 'avere', en: ['to have'], gloss: { de: ['haben'], es: ['tener'], fr: ['avoir'], pt: ['ter'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'it1v063', de: 'fare', en: ['to do', 'to make'], gloss: { de: ['machen'], es: ['hacer'], fr: ['faire'], pt: ['fazer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'it1v064', de: 'andare', en: ['to go'], gloss: { de: ['gehen'], es: ['ir'], fr: ['aller'], pt: ['ir'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'it1v065', de: 'volere', en: ['to want'], gloss: { de: ['wollen'], es: ['querer'], fr: ['vouloir'], pt: ['querer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'it1v066', de: 'mangiare', en: ['to eat'], gloss: { de: ['essen'], es: ['comer'], fr: ['manger'], pt: ['comer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'it1v067', de: 'bere', en: ['to drink'], gloss: { de: ['trinken'], es: ['beber'], fr: ['boire'], pt: ['beber'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'it1v068', de: 'parlare', en: ['to speak', 'to talk'], gloss: { de: ['sprechen'], es: ['hablar'], fr: ['parler'], pt: ['falar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'it1v069', de: 'vivere', en: ['to live'], gloss: { de: ['leben'], es: ['vivir'], fr: ['vivre'], pt: ['viver'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'it1v070', de: 'lavorare', en: ['to work'], gloss: { de: ['arbeiten'], es: ['trabajar'], fr: ['travailler'], pt: ['trabalhar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'it1v071', de: 'comprare', en: ['to buy'], gloss: { de: ['kaufen'], es: ['comprar'], fr: ['acheter'], pt: ['comprar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'it1v072', de: 'capire', en: ['to understand'], gloss: { de: ['verstehen'], es: ['entender'], fr: ['comprendre'], pt: ['entender'] }, pos: 'verb', level: 'A1', category: 'verbs' },

  // ── adjectives ────────────────────────────────────────────────────────
  { id: 'it1v073', de: 'grande', en: ['big', 'large'], gloss: { de: ['groß'], es: ['grande'], fr: ['grand'], pt: ['grande'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'it1v074', de: 'piccolo', en: ['small', 'little'], gloss: { de: ['klein'], es: ['pequeño'], fr: ['petit'], pt: ['pequeno'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'it1v075', de: 'buono', en: ['good'], gloss: { de: ['gut'], es: ['bueno'], fr: ['bon'], pt: ['bom'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'it1v076', de: 'cattivo', en: ['bad'], gloss: { de: ['schlecht'], es: ['malo'], fr: ['mauvais'], pt: ['ruim'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'it1v077', de: 'caro', en: ['expensive'], gloss: { de: ['teuer'], es: ['caro'], fr: ['cher'], pt: ['caro'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'it1v078', de: 'economico', en: ['cheap'], gloss: { de: ['billig'], es: ['barato'], fr: ['bon marché'], pt: ['barato'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'it1v079', de: 'nuovo', en: ['new'], gloss: { de: ['neu'], es: ['nuevo'], fr: ['nouveau'], pt: ['novo'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'it1v080', de: 'vecchio', en: ['old'], gloss: { de: ['alt'], es: ['viejo'], fr: ['vieux'], pt: ['velho'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'it1v081', de: 'bello', en: ['beautiful', 'nice'], gloss: { de: ['schön'], es: ['bonito'], fr: ['beau'], pt: ['bonito'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'it1v082', de: 'stanco', en: ['tired'], gloss: { de: ['müde'], es: ['cansado'], fr: ['fatigué'], pt: ['cansado'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'it1v083', de: 'facile', en: ['easy'], gloss: { de: ['einfach'], es: ['fácil'], fr: ['facile'], pt: ['fácil'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'it1v084', de: 'difficile', en: ['difficult', 'hard'], gloss: { de: ['schwierig'], es: ['difícil'], fr: ['difficile'], pt: ['difícil'] }, pos: 'adj', level: 'A1', category: 'adjectives' },

  // ── numbers ───────────────────────────────────────────────────────────
  { id: 'it1v085', de: 'uno', en: ['one'], gloss: { de: ['eins'], es: ['uno'], fr: ['un'], pt: ['um'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'it1v086', de: 'due', en: ['two'], gloss: { de: ['zwei'], es: ['dos'], fr: ['deux'], pt: ['dois'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'it1v087', de: 'tre', en: ['three'], gloss: { de: ['drei'], es: ['tres'], fr: ['trois'], pt: ['três'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'it1v088', de: 'quattro', en: ['four'], gloss: { de: ['vier'], es: ['cuatro'], fr: ['quatre'], pt: ['quatro'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'it1v089', de: 'cinque', en: ['five'], gloss: { de: ['fünf'], es: ['cinco'], fr: ['cinq'], pt: ['cinco'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'it1v090', de: 'sei', en: ['six'], gloss: { de: ['sechs'], es: ['seis'], fr: ['six'], pt: ['seis'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'it1v091', de: 'sette', en: ['seven'], gloss: { de: ['sieben'], es: ['siete'], fr: ['sept'], pt: ['sete'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'it1v092', de: 'otto', en: ['eight'], gloss: { de: ['acht'], es: ['ocho'], fr: ['huit'], pt: ['oito'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'it1v093', de: 'nove', en: ['nine'], gloss: { de: ['neun'], es: ['nueve'], fr: ['neuf'], pt: ['nove'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'it1v094', de: 'dieci', en: ['ten'], gloss: { de: ['zehn'], es: ['diez'], fr: ['dix'], pt: ['dez'] }, pos: 'number', level: 'A1', category: 'numbers' },

  // ── time ──────────────────────────────────────────────────────────────
  { id: 'it1v095', de: 'oggi', en: ['today'], gloss: { de: ['heute'], es: ['hoy'], fr: ['aujourd’hui'], pt: ['hoje'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'it1v096', de: 'domani', en: ['tomorrow'], gloss: { de: ['morgen'], es: ['mañana'], fr: ['demain'], pt: ['amanhã'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'it1v097', de: 'ieri', en: ['yesterday'], gloss: { de: ['gestern'], es: ['ayer'], fr: ['hier'], pt: ['ontem'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'it1v098', de: 'adesso', en: ['now'], gloss: { de: ['jetzt'], es: ['ahora'], fr: ['maintenant'], pt: ['agora'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'it1v099', de: 'sempre', en: ['always'], gloss: { de: ['immer'], es: ['siempre'], fr: ['toujours'], pt: ['sempre'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'it1v100', de: 'mai', en: ['never'], gloss: { de: ['nie'], es: ['nunca'], fr: ['jamais'], pt: ['nunca'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'it1v101', de: 'il giorno', en: ['the day'], gloss: { de: ['der Tag'], es: ['el día'], fr: ['le jour'], pt: ['o dia'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'it1v102', de: 'la notte', en: ['the night'], gloss: { de: ['die Nacht'], es: ['la noche'], fr: ['la nuit'], pt: ['a noite'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'it1v103', de: 'la mattina', en: ['the morning'], gloss: { de: ['der Morgen'], es: ['la mañana'], fr: ['le matin'], pt: ['a manhã'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'it1v104', de: 'la settimana', en: ['the week'], gloss: { de: ['die Woche'], es: ['la semana'], fr: ['la semaine'], pt: ['a semana'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'it1v105', de: 'l’anno', en: ['the year'], gloss: { de: ['das Jahr'], es: ['el año'], fr: ['l’année'], pt: ['o ano'] }, pos: 'noun', gender: 'm', level: 'A1', category: 'time' },

  // ── questions & connectors ────────────────────────────────────────────
  { id: 'it1v106', de: 'che cosa', en: ['what'], gloss: { de: ['was'], es: ['qué'], fr: ['quoi'], pt: ['o que'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'it1v107', de: 'chi', en: ['who'], gloss: { de: ['wer'], es: ['quién'], fr: ['qui'], pt: ['quem'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'it1v108', de: 'dove', en: ['where'], gloss: { de: ['wo'], es: ['dónde'], fr: ['où'], pt: ['onde'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'it1v109', de: 'quando', en: ['when'], gloss: { de: ['wann'], es: ['cuándo'], fr: ['quand'], pt: ['quando'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'it1v110', de: 'come', en: ['how'], gloss: { de: ['wie'], es: ['cómo'], fr: ['comment'], pt: ['como'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'it1v111', de: 'perché', en: ['why', 'because'], gloss: { de: ['warum', 'weil'], es: ['por qué', 'porque'], fr: ['pourquoi', 'parce que'], pt: ['por que', 'porque'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'it1v112', de: 'quanto', en: ['how much'], gloss: { de: ['wie viel'], es: ['cuánto'], fr: ['combien'], pt: ['quanto'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'it1v113', de: 'quale', en: ['which'], gloss: { de: ['welcher'], es: ['cuál'], fr: ['quel'], pt: ['qual'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'it1v114', de: 'ma', en: ['but'], gloss: { de: ['aber'], es: ['pero'], fr: ['mais'], pt: ['mas'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'it1v115', de: 'e', en: ['and'], gloss: { de: ['und'], es: ['y'], fr: ['et'], pt: ['e'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'it1v116', de: 'anche', en: ['also', 'too'], gloss: { de: ['auch'], es: ['también'], fr: ['aussi'], pt: ['também'] }, pos: 'adv', level: 'A1', category: 'questions' },
];
