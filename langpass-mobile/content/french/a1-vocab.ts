import type { VocabItem } from '@/content/german/types';

// French (fr-FR) A1 core vocabulary. The `de` field holds the French text (see
// the note in content/german/types.ts). Nouns ship with their article, because
// gender is the thing a learner actually has to memorise — and French hides it
// twice over:
//   le  — masculine before a consonant (le pain, le livre)
//   la  — feminine before a consonant (la table, la maison)
//   l’  — elision before a vowel or mute h, gender INVISIBLE (l’eau is
//         feminine, l’homme is masculine — the article no longer tells you)
//   les — plural, for the handful of nouns that only live in the plural
//         (les toilettes, les gens)
// The elided items are the traps, so they are deliberately kept in the set.
//
// `gloss` carries the other UI locales. English lives in `en` and is the
// guaranteed fallback; French itself is never glossed (a French-UI user is
// never offered French to learn), so each item covers de / es / it / pt.

export const A1_VOCAB: VocabItem[] = [
  // ── greetings & basics ────────────────────────────────────────────────
  { id: 'fr1v001', de: 'bonjour', en: ['hello', 'good morning'], gloss: { de: ['guten Tag'], es: ['buenos días'], it: ['buongiorno'], pt: ['bom dia'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'fr1v002', de: 'bonsoir', en: ['good evening'], gloss: { de: ['guten Abend'], es: ['buenas tardes'], it: ['buonasera'], pt: ['boa tarde'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'fr1v003', de: 'bonne nuit', en: ['good night'], gloss: { de: ['gute Nacht'], es: ['buenas noches'], it: ['buonanotte'], pt: ['boa noite'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'fr1v004', de: 'salut', en: ['hi', 'bye'], gloss: { de: ['hallo'], es: ['hola'], it: ['ciao'], pt: ['oi'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'fr1v005', de: 'au revoir', en: ['goodbye'], gloss: { de: ['auf Wiedersehen'], es: ['adiós'], it: ['arrivederci'], pt: ['tchau'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'fr1v006', de: 's’il vous plaît', en: ['please'], gloss: { de: ['bitte'], es: ['por favor'], it: ['per favore'], pt: ['por favor'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'fr1v007', de: 'merci', en: ['thank you'], gloss: { de: ['danke'], es: ['gracias'], it: ['grazie'], pt: ['obrigado'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'fr1v008', de: 'de rien', en: ['you’re welcome'], gloss: { de: ['gern geschehen'], es: ['de nada'], it: ['prego'], pt: ['de nada'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'fr1v009', de: 'pardon', en: ['sorry', 'excuse me'], gloss: { de: ['Entschuldigung'], es: ['perdón'], it: ['scusa'], pt: ['desculpa'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'fr1v010', de: 'excusez-moi', en: ['excuse me'], gloss: { de: ['entschuldigen Sie'], es: ['disculpe'], it: ['mi scusi'], pt: ['com licença'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'fr1v011', de: 'oui', en: ['yes'], gloss: { de: ['ja'], es: ['sí'], it: ['sì'], pt: ['sim'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'fr1v012', de: 'non', en: ['no'], gloss: { de: ['nein'], es: ['no'], it: ['no'], pt: ['não'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'fr1v013', de: 'ça va ?', en: ['how’s it going?'], gloss: { de: ['wie geht’s?'], es: ['¿qué tal?'], it: ['come va?'], pt: ['tudo bem?'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'fr1v014', de: 'à bientôt', en: ['see you soon'], gloss: { de: ['bis bald'], es: ['hasta pronto'], it: ['a presto'], pt: ['até breve'] }, pos: 'phrase', level: 'A1', category: 'greetings' },

  // ── people & family ───────────────────────────────────────────────────
  { id: 'fr1v015', de: 'l’homme', en: ['the man'], gloss: { de: ['der Mann'], es: ['el hombre'], it: ['l’uomo'], pt: ['o homem'] }, pos: 'noun', gender: 'm', level: 'A1', category: 'people' },
  { id: 'fr1v016', de: 'la femme', en: ['the woman', 'the wife'], gloss: { de: ['die Frau'], es: ['la mujer'], it: ['la donna'], pt: ['a mulher'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'fr1v017', de: 'le garçon', en: ['the boy'], gloss: { de: ['der Junge'], es: ['el chico'], it: ['il ragazzo'], pt: ['o menino'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'fr1v018', de: 'la fille', en: ['the girl', 'the daughter'], gloss: { de: ['das Mädchen'], es: ['la chica'], it: ['la ragazza'], pt: ['a menina'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'fr1v019', de: 'l’enfant', en: ['the child'], gloss: { de: ['das Kind'], es: ['el niño'], it: ['il bambino'], pt: ['a criança'] }, pos: 'noun', gender: 'm', level: 'A1', category: 'people' },
  { id: 'fr1v020', de: 'l’ami', en: ['the friend'], gloss: { de: ['der Freund'], es: ['el amigo'], it: ['l’amico'], pt: ['o amigo'] }, pos: 'noun', gender: 'm', level: 'A1', category: 'people' },
  { id: 'fr1v021', de: 'la mère', en: ['the mother'], gloss: { de: ['die Mutter'], es: ['la madre'], it: ['la madre'], pt: ['a mãe'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'fr1v022', de: 'le père', en: ['the father'], gloss: { de: ['der Vater'], es: ['el padre'], it: ['il padre'], pt: ['o pai'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'fr1v023', de: 'la sœur', en: ['the sister'], gloss: { de: ['die Schwester'], es: ['la hermana'], it: ['la sorella'], pt: ['a irmã'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'fr1v024', de: 'le frère', en: ['the brother'], gloss: { de: ['der Bruder'], es: ['el hermano'], it: ['il fratello'], pt: ['o irmão'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'fr1v025', de: 'la famille', en: ['the family'], gloss: { de: ['die Familie'], es: ['la familia'], it: ['la famiglia'], pt: ['a família'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'fr1v026', de: 'les gens', en: ['the people'], gloss: { de: ['die Leute'], es: ['la gente'], it: ['la gente'], pt: ['as pessoas'] }, pos: 'noun', level: 'A1', category: 'people' },

  // ── food & drink ──────────────────────────────────────────────────────
  { id: 'fr1v027', de: 'l’eau', en: ['the water'], gloss: { de: ['das Wasser'], es: ['el agua'], it: ['l’acqua'], pt: ['a água'] }, pos: 'noun', gender: 'f', level: 'A1', category: 'food' },
  { id: 'fr1v028', de: 'le café', en: ['the coffee'], gloss: { de: ['der Kaffee'], es: ['el café'], it: ['il caffè'], pt: ['o café'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'fr1v029', de: 'le thé', en: ['the tea'], gloss: { de: ['der Tee'], es: ['el té'], it: ['il tè'], pt: ['o chá'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'fr1v030', de: 'le pain', en: ['the bread'], gloss: { de: ['das Brot'], es: ['el pan'], it: ['il pane'], pt: ['o pão'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'fr1v031', de: 'le lait', en: ['the milk'], gloss: { de: ['die Milch'], es: ['la leche'], it: ['il latte'], pt: ['o leite'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'fr1v032', de: 'la bière', en: ['the beer'], gloss: { de: ['das Bier'], es: ['la cerveza'], it: ['la birra'], pt: ['a cerveja'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'fr1v033', de: 'le vin', en: ['the wine'], gloss: { de: ['der Wein'], es: ['el vino'], it: ['il vino'], pt: ['o vinho'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'fr1v034', de: 'le fromage', en: ['the cheese'], gloss: { de: ['der Käse'], es: ['el queso'], it: ['il formaggio'], pt: ['o queijo'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'fr1v035', de: 'la viande', en: ['the meat'], gloss: { de: ['das Fleisch'], es: ['la carne'], it: ['la carne'], pt: ['a carne'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'fr1v036', de: 'le poisson', en: ['the fish'], gloss: { de: ['der Fisch'], es: ['el pescado'], it: ['il pesce'], pt: ['o peixe'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'fr1v037', de: 'le fruit', en: ['the fruit'], gloss: { de: ['das Obst'], es: ['la fruta'], it: ['la frutta'], pt: ['a fruta'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'fr1v038', de: 'la pomme', en: ['the apple'], gloss: { de: ['der Apfel'], es: ['la manzana'], it: ['la mela'], pt: ['a maçã'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'fr1v039', de: 'l’œuf', en: ['the egg'], gloss: { de: ['das Ei'], es: ['el huevo'], it: ['l’uovo'], pt: ['o ovo'] }, pos: 'noun', gender: 'm', level: 'A1', category: 'food' },
  { id: 'fr1v040', de: 'l’addition', en: ['the bill', 'the check'], gloss: { de: ['die Rechnung'], es: ['la cuenta'], it: ['il conto'], pt: ['a conta'] }, pos: 'noun', gender: 'f', level: 'A1', category: 'food' },

  // ── places ────────────────────────────────────────────────────────────
  { id: 'fr1v041', de: 'la maison', en: ['the house', 'the home'], gloss: { de: ['das Haus'], es: ['la casa'], it: ['la casa'], pt: ['a casa'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'fr1v042', de: 'la ville', en: ['the city', 'the town'], gloss: { de: ['die Stadt'], es: ['la ciudad'], it: ['la città'], pt: ['a cidade'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'fr1v043', de: 'la rue', en: ['the street'], gloss: { de: ['die Straße'], es: ['la calle'], it: ['la strada'], pt: ['a rua'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'fr1v044', de: 'le magasin', en: ['the shop', 'the shop'], gloss: { de: ['der Laden'], es: ['la tienda'], it: ['il negozio'], pt: ['a loja'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'fr1v045', de: 'le restaurant', en: ['the restaurant'], gloss: { de: ['das Restaurant'], es: ['el restaurante'], it: ['il ristorante'], pt: ['o restaurante'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'fr1v046', de: 'le marché', en: ['the market'], gloss: { de: ['der Markt'], es: ['el mercado'], it: ['il mercato'], pt: ['o mercado'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'fr1v047', de: 'la plage', en: ['the beach'], gloss: { de: ['der Strand'], es: ['la playa'], it: ['la spiaggia'], pt: ['a praia'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'fr1v048', de: 'le travail', en: ['the work', 'the job'], gloss: { de: ['die Arbeit'], es: ['el trabajo'], it: ['il lavoro'], pt: ['o trabalho'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'fr1v049', de: 'l’école', en: ['the school'], gloss: { de: ['die Schule'], es: ['la escuela'], it: ['la scuola'], pt: ['a escola'] }, pos: 'noun', gender: 'f', level: 'A1', category: 'places' },
  { id: 'fr1v050', de: 'la gare', en: ['the train station'], gloss: { de: ['der Bahnhof'], es: ['la estación'], it: ['la stazione'], pt: ['a estação'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'fr1v051', de: 'l’hôtel', en: ['the hotel'], gloss: { de: ['das Hotel'], es: ['el hotel'], it: ['l’hotel'], pt: ['o hotel'] }, pos: 'noun', gender: 'm', level: 'A1', category: 'places' },
  { id: 'fr1v052', de: 'les toilettes', en: ['the bathroom', 'the toilets'], gloss: { de: ['die Toilette'], es: ['el baño'], it: ['il bagno'], pt: ['o banheiro'] }, pos: 'noun', level: 'A1', category: 'places' },

  // ── verbs ─────────────────────────────────────────────────────────────
  { id: 'fr1v053', de: 'être', en: ['to be'], gloss: { de: ['sein'], es: ['ser', 'estar'], it: ['essere'], pt: ['ser', 'estar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v054', de: 'avoir', en: ['to have'], gloss: { de: ['haben'], es: ['tener'], it: ['avere'], pt: ['ter'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v055', de: 'faire', en: ['to do', 'to make'], gloss: { de: ['machen'], es: ['hacer'], it: ['fare'], pt: ['fazer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v056', de: 'aller', en: ['to go'], gloss: { de: ['gehen'], es: ['ir'], it: ['andare'], pt: ['ir'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v057', de: 'venir', en: ['to come'], gloss: { de: ['kommen'], es: ['venir'], it: ['venire'], pt: ['vir'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v058', de: 'vouloir', en: ['to want'], gloss: { de: ['wollen'], es: ['querer'], it: ['volere'], pt: ['querer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v059', de: 'manger', en: ['to eat'], gloss: { de: ['essen'], es: ['comer'], it: ['mangiare'], pt: ['comer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v060', de: 'boire', en: ['to drink'], gloss: { de: ['trinken'], es: ['beber'], it: ['bere'], pt: ['beber'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v061', de: 'parler', en: ['to speak', 'to talk'], gloss: { de: ['sprechen'], es: ['hablar'], it: ['parlare'], pt: ['falar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v062', de: 'habiter', en: ['to live', 'to reside'], gloss: { de: ['wohnen'], es: ['vivir'], it: ['abitare'], pt: ['morar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v063', de: 'travailler', en: ['to work'], gloss: { de: ['arbeiten'], es: ['trabajar'], it: ['lavorare'], pt: ['trabalhar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v064', de: 'acheter', en: ['to buy'], gloss: { de: ['kaufen'], es: ['comprar'], it: ['comprare'], pt: ['comprar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v065', de: 'comprendre', en: ['to understand'], gloss: { de: ['verstehen'], es: ['entender'], it: ['capire'], pt: ['entender'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v066', de: 'aimer', en: ['to like', 'to love'], gloss: { de: ['mögen'], es: ['gustar'], it: ['amare'], pt: ['gostar'] }, pos: 'verb', level: 'A1', category: 'verbs' },

  // ── adjectives ────────────────────────────────────────────────────────
  { id: 'fr1v067', de: 'grand', en: ['big', 'tall'], gloss: { de: ['groß'], es: ['grande'], it: ['grande'], pt: ['grande'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v068', de: 'petit', en: ['small', 'little'], gloss: { de: ['klein'], es: ['pequeño'], it: ['piccolo'], pt: ['pequeno'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v069', de: 'bon', en: ['good'], gloss: { de: ['gut'], es: ['bueno'], it: ['buono'], pt: ['bom'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v070', de: 'mauvais', en: ['bad'], gloss: { de: ['schlecht'], es: ['malo'], it: ['cattivo'], pt: ['ruim'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v071', de: 'cher', en: ['expensive'], gloss: { de: ['teuer'], es: ['caro'], it: ['caro'], pt: ['caro'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v072', de: 'nouveau', en: ['new'], gloss: { de: ['neu'], es: ['nuevo'], it: ['nuovo'], pt: ['novo'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v073', de: 'vieux', en: ['old'], gloss: { de: ['alt'], es: ['viejo'], it: ['vecchio'], pt: ['velho'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v074', de: 'joli', en: ['pretty', 'nice'], gloss: { de: ['hübsch'], es: ['bonito'], it: ['carino'], pt: ['bonito'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v075', de: 'fatigué', en: ['tired'], gloss: { de: ['müde'], es: ['cansado'], it: ['stanco'], pt: ['cansado'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v076', de: 'content', en: ['happy', 'glad'], gloss: { de: ['zufrieden'], es: ['contento'], it: ['contento'], pt: ['contente'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v077', de: 'facile', en: ['easy'], gloss: { de: ['einfach'], es: ['fácil'], it: ['facile'], pt: ['fácil'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v078', de: 'difficile', en: ['difficult', 'hard'], gloss: { de: ['schwierig'], es: ['difícil'], it: ['difficile'], pt: ['difícil'] }, pos: 'adj', level: 'A1', category: 'adjectives' },

  // ── numbers ───────────────────────────────────────────────────────────
  { id: 'fr1v079', de: 'un', en: ['one'], gloss: { de: ['eins'], es: ['uno'], it: ['uno'], pt: ['um'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'fr1v080', de: 'deux', en: ['two'], gloss: { de: ['zwei'], es: ['dos'], it: ['due'], pt: ['dois'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'fr1v081', de: 'trois', en: ['three'], gloss: { de: ['drei'], es: ['tres'], it: ['tre'], pt: ['três'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'fr1v082', de: 'quatre', en: ['four'], gloss: { de: ['vier'], es: ['cuatro'], it: ['quattro'], pt: ['quatro'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'fr1v083', de: 'cinq', en: ['five'], gloss: { de: ['fünf'], es: ['cinco'], it: ['cinque'], pt: ['cinco'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'fr1v084', de: 'six', en: ['six'], gloss: { de: ['sechs'], es: ['seis'], it: ['sei'], pt: ['seis'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'fr1v085', de: 'sept', en: ['seven'], gloss: { de: ['sieben'], es: ['siete'], it: ['sette'], pt: ['sete'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'fr1v086', de: 'huit', en: ['eight'], gloss: { de: ['acht'], es: ['ocho'], it: ['otto'], pt: ['oito'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'fr1v087', de: 'neuf', en: ['nine'], gloss: { de: ['neun'], es: ['nueve'], it: ['nove'], pt: ['nove'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'fr1v088', de: 'dix', en: ['ten'], gloss: { de: ['zehn'], es: ['diez'], it: ['dieci'], pt: ['dez'] }, pos: 'number', level: 'A1', category: 'numbers' },

  // ── time ──────────────────────────────────────────────────────────────
  { id: 'fr1v089', de: 'aujourd’hui', en: ['today'], gloss: { de: ['heute'], es: ['hoy'], it: ['oggi'], pt: ['hoje'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'fr1v090', de: 'demain', en: ['tomorrow'], gloss: { de: ['morgen'], es: ['mañana'], it: ['domani'], pt: ['amanhã'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'fr1v091', de: 'hier', en: ['yesterday'], gloss: { de: ['gestern'], es: ['ayer'], it: ['ieri'], pt: ['ontem'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'fr1v092', de: 'maintenant', en: ['now'], gloss: { de: ['jetzt'], es: ['ahora'], it: ['adesso'], pt: ['agora'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'fr1v093', de: 'toujours', en: ['always'], gloss: { de: ['immer'], es: ['siempre'], it: ['sempre'], pt: ['sempre'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'fr1v094', de: 'jamais', en: ['never'], gloss: { de: ['nie'], es: ['nunca'], it: ['mai'], pt: ['nunca'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'fr1v095', de: 'le jour', en: ['the day'], gloss: { de: ['der Tag'], es: ['el día'], it: ['il giorno'], pt: ['o dia'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'fr1v096', de: 'la nuit', en: ['the night'], gloss: { de: ['die Nacht'], es: ['la noche'], it: ['la notte'], pt: ['a noite'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'fr1v097', de: 'le matin', en: ['the morning'], gloss: { de: ['der Morgen'], es: ['la mañana'], it: ['la mattina'], pt: ['a manhã'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'fr1v098', de: 'le soir', en: ['the evening'], gloss: { de: ['der Abend'], es: ['la tarde'], it: ['la sera'], pt: ['a noite'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'fr1v099', de: 'la semaine', en: ['the week'], gloss: { de: ['die Woche'], es: ['la semana'], it: ['la settimana'], pt: ['a semana'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'fr1v100', de: 'l’année', en: ['the year'], gloss: { de: ['das Jahr'], es: ['el año'], it: ['l’anno'], pt: ['o ano'] }, pos: 'noun', gender: 'f', level: 'A1', category: 'time' },

  // ── questions & connectors ────────────────────────────────────────────
  { id: 'fr1v101', de: 'quoi', en: ['what'], gloss: { de: ['was'], es: ['qué'], it: ['che cosa'], pt: ['o que'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'fr1v102', de: 'qui', en: ['who'], gloss: { de: ['wer'], es: ['quién'], it: ['chi'], pt: ['quem'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'fr1v103', de: 'où', en: ['where'], gloss: { de: ['wo'], es: ['dónde'], it: ['dove'], pt: ['onde'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'fr1v104', de: 'quand', en: ['when'], gloss: { de: ['wann'], es: ['cuándo'], it: ['quando'], pt: ['quando'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'fr1v105', de: 'comment', en: ['how'], gloss: { de: ['wie'], es: ['cómo'], it: ['come'], pt: ['como'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'fr1v106', de: 'pourquoi', en: ['why'], gloss: { de: ['warum'], es: ['por qué'], it: ['perché'], pt: ['por que'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'fr1v107', de: 'combien', en: ['how much', 'how many'], gloss: { de: ['wie viel'], es: ['cuánto'], it: ['quanto'], pt: ['quanto'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'fr1v108', de: 'quel', en: ['which', 'what'], gloss: { de: ['welcher'], es: ['cuál'], it: ['quale'], pt: ['qual'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'fr1v109', de: 'et', en: ['and'], gloss: { de: ['und'], es: ['y'], it: ['e'], pt: ['e'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'fr1v110', de: 'mais', en: ['but'], gloss: { de: ['aber'], es: ['pero'], it: ['ma'], pt: ['mas'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'fr1v111', de: 'parce que', en: ['because'], gloss: { de: ['weil'], es: ['porque'], it: ['perché'], pt: ['porque'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'fr1v112', de: 'aussi', en: ['also', 'too'], gloss: { de: ['auch'], es: ['también'], it: ['anche'], pt: ['também'] }, pos: 'adv', level: 'A1', category: 'questions' },

  // ── colours ───────────────────────────────────────────────────────────
  { id: 'fr1v113', de: 'rouge', en: ['red'], gloss: { de: ['rot'], es: ['rojo'], it: ['rosso'], pt: ['vermelho'] }, pos: 'adj', level: 'A1', category: 'colors' },
  { id: 'fr1v114', de: 'bleu', en: ['blue'], gloss: { de: ['blau'], es: ['azul'], it: ['blu'], pt: ['azul'] }, pos: 'adj', level: 'A1', category: 'colors' },
  { id: 'fr1v115', de: 'vert', en: ['green'], gloss: { de: ['grün'], es: ['verde'], it: ['verde'], pt: ['verde'] }, pos: 'adj', level: 'A1', category: 'colors' },
  { id: 'fr1v116', de: 'jaune', en: ['yellow'], gloss: { de: ['gelb'], es: ['amarillo'], it: ['giallo'], pt: ['amarelo'] }, pos: 'adj', level: 'A1', category: 'colors' },
  { id: 'fr1v117', de: 'noir', en: ['black'], gloss: { de: ['schwarz'], es: ['negro'], it: ['nero'], pt: ['preto'] }, pos: 'adj', level: 'A1', category: 'colors' },
  { id: 'fr1v118', de: 'blanc', en: ['white'], gloss: { de: ['weiß'], es: ['blanco'], it: ['bianco'], pt: ['branco'] }, pos: 'adj', level: 'A1', category: 'colors' },
  { id: 'fr1v119', de: 'gris', en: ['grey'], gloss: { de: ['grau'], es: ['gris'], it: ['grigio'], pt: ['cinza'] }, pos: 'adj', level: 'A1', category: 'colors' },
  { id: 'fr1v120', de: 'rose', en: ['pink'], gloss: { de: ['rosa'], es: ['rosa'], it: ['rosa'], pt: ['cor-de-rosa'] }, pos: 'adj', level: 'A1', category: 'colors' },
  { id: 'fr1v121', de: 'orange', en: ['orange'], gloss: { de: ['orange'], es: ['naranja'], it: ['arancione'], pt: ['laranja'] }, pos: 'adj', level: 'A1', category: 'colors' },
  { id: 'fr1v122', de: 'marron', en: ['brown'], gloss: { de: ['braun'], es: ['marrón'], it: ['marrone'], pt: ['marrom'] }, pos: 'adj', level: 'A1', category: 'colors' },

  // ── animals ───────────────────────────────────────────────────────────
  { id: 'fr1v123', de: 'le chien', en: ['the dog'], gloss: { de: ['der Hund'], es: ['el perro'], it: ['il cane'], pt: ['o cão'] }, pos: 'noun', level: 'A1', category: 'animals' },
  { id: 'fr1v124', de: 'le chat', en: ['the cat'], gloss: { de: ['die Katze'], es: ['el gato'], it: ['il gatto'], pt: ['o gato'] }, pos: 'noun', level: 'A1', category: 'animals' },
  { id: 'fr1v125', de: 'l’oiseau', en: ['the bird'], gloss: { de: ['der Vogel'], es: ['el pájaro'], it: ['l’uccello'], pt: ['o pássaro'] }, pos: 'noun', gender: 'm', level: 'A1', category: 'animals' },
  { id: 'fr1v126', de: 'le cheval', en: ['the horse'], gloss: { de: ['das Pferd'], es: ['el caballo'], it: ['il cavallo'], pt: ['o cavalo'] }, pos: 'noun', level: 'A1', category: 'animals' },
  { id: 'fr1v127', de: 'la vache', en: ['the cow'], gloss: { de: ['die Kuh'], es: ['la vaca'], it: ['la mucca'], pt: ['a vaca'] }, pos: 'noun', level: 'A1', category: 'animals' },
  { id: 'fr1v128', de: 'le lapin', en: ['the rabbit'], gloss: { de: ['das Kaninchen'], es: ['el conejo'], it: ['il coniglio'], pt: ['o coelho'] }, pos: 'noun', level: 'A1', category: 'animals' },
  { id: 'fr1v129', de: 'la souris', en: ['the mouse'], gloss: { de: ['die Maus'], es: ['el ratón'], it: ['il topo'], pt: ['o rato'] }, pos: 'noun', level: 'A1', category: 'animals' },
  { id: 'fr1v130', de: 'le canard', en: ['the duck'], gloss: { de: ['die Ente'], es: ['el pato'], it: ['l’anatra'], pt: ['o pato'] }, pos: 'noun', level: 'A1', category: 'animals' },
  { id: 'fr1v131', de: 'le mouton', en: ['the sheep'], gloss: { de: ['das Schaf'], es: ['la oveja'], it: ['la pecora'], pt: ['a ovelha'] }, pos: 'noun', level: 'A1', category: 'animals' },
  { id: 'fr1v132', de: 'le cochon', en: ['the pig'], gloss: { de: ['das Schwein'], es: ['el cerdo'], it: ['il maiale'], pt: ['o porco'] }, pos: 'noun', level: 'A1', category: 'animals' },

  // ── everyday objects ──────────────────────────────────────────────────
  { id: 'fr1v133', de: 'la table', en: ['the table'], gloss: { de: ['der Tisch'], es: ['la mesa'], it: ['il tavolo'], pt: ['a mesa'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'fr1v134', de: 'le livre', en: ['the book'], gloss: { de: ['das Buch'], es: ['el libro'], it: ['il libro'], pt: ['o livro'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'fr1v135', de: 'le téléphone', en: ['the telephone'], gloss: { de: ['das Telefon'], es: ['el teléfono'], it: ['il telefono'], pt: ['o telefone'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'fr1v136', de: 'l’ordinateur', en: ['the computer'], gloss: { de: ['der Computer'], es: ['el ordenador'], it: ['il computer'], pt: ['o computador'] }, pos: 'noun', gender: 'm', level: 'A1', category: 'objects' },
  { id: 'fr1v137', de: 'le sac', en: ['the bag'], gloss: { de: ['die Tasche'], es: ['el bolso'], it: ['la borsa'], pt: ['a bolsa'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'fr1v138', de: 'le stylo', en: ['the pen'], gloss: { de: ['der Kugelschreiber'], es: ['el bolígrafo'], it: ['la penna'], pt: ['a caneta'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'fr1v139', de: 'le papier', en: ['the paper'], gloss: { de: ['das Papier'], es: ['el papel'], it: ['la carta'], pt: ['o papel'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'fr1v140', de: 'la lampe', en: ['the lamp'], gloss: { de: ['die Lampe'], es: ['la lámpara'], it: ['la lampada'], pt: ['a luminária'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'fr1v141', de: 'la boîte', en: ['the box'], gloss: { de: ['die Schachtel'], es: ['la caja'], it: ['la scatola'], pt: ['a caixa'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'fr1v142', de: 'le cadeau', en: ['the present', 'the gift'], gloss: { de: ['das Geschenk'], es: ['el regalo'], it: ['il regalo'], pt: ['o presente'] }, pos: 'noun', level: 'A1', category: 'objects' },

  // ── nature & weather ──────────────────────────────────────────────────
  { id: 'fr1v143', de: 'le soleil', en: ['the sun'], gloss: { de: ['die Sonne'], es: ['el sol'], it: ['il sole'], pt: ['o sol'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'fr1v144', de: 'la pluie', en: ['the rain'], gloss: { de: ['der Regen'], es: ['la lluvia'], it: ['la pioggia'], pt: ['a chuva'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'fr1v145', de: 'le vent', en: ['the wind'], gloss: { de: ['der Wind'], es: ['el viento'], it: ['il vento'], pt: ['o vento'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'fr1v146', de: 'la neige', en: ['the snow'], gloss: { de: ['der Schnee'], es: ['la nieve'], it: ['la neve'], pt: ['a neve'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'fr1v147', de: 'le ciel', en: ['the sky'], gloss: { de: ['der Himmel'], es: ['el cielo'], it: ['il cielo'], pt: ['o céu'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'fr1v148', de: 'l’arbre', en: ['the tree'], gloss: { de: ['der Baum'], es: ['el árbol'], it: ['l’albero'], pt: ['a árvore'] }, pos: 'noun', gender: 'm', level: 'A1', category: 'nature' },
  { id: 'fr1v149', de: 'la fleur', en: ['the flower'], gloss: { de: ['die Blume'], es: ['la flor'], it: ['il fiore'], pt: ['a flor'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'fr1v150', de: 'la montagne', en: ['the mountain'], gloss: { de: ['der Berg'], es: ['la montaña'], it: ['la montagna'], pt: ['a montanha'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'fr1v151', de: 'la mer', en: ['the sea'], gloss: { de: ['das Meer'], es: ['el mar'], it: ['il mare'], pt: ['o mar'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'fr1v152', de: 'le lac', en: ['the lake'], gloss: { de: ['der See'], es: ['el lago'], it: ['il lago'], pt: ['o lago'] }, pos: 'noun', level: 'A1', category: 'nature' },

  // ── more verbs ────────────────────────────────────────────────────────
  { id: 'fr1v153', de: 'dormir', en: ['to sleep'], gloss: { de: ['schlafen'], es: ['dormir'], it: ['dormire'], pt: ['dormir'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v154', de: 'voir', en: ['to see'], gloss: { de: ['sehen'], es: ['ver'], it: ['vedere'], pt: ['ver'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v155', de: 'lire', en: ['to read'], gloss: { de: ['lesen'], es: ['leer'], it: ['leggere'], pt: ['ler'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v156', de: 'écrire', en: ['to write'], gloss: { de: ['schreiben'], es: ['escribir'], it: ['scrivere'], pt: ['escrever'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v157', de: 'ouvrir', en: ['to open'], gloss: { de: ['öffnen'], es: ['abrir'], it: ['aprire'], pt: ['abrir'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v158', de: 'fermer', en: ['to close', 'to shut'], gloss: { de: ['schließen'], es: ['cerrar'], it: ['chiudere'], pt: ['fechar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v159', de: 'donner', en: ['to give'], gloss: { de: ['geben'], es: ['dar'], it: ['dare'], pt: ['dar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v160', de: 'prendre', en: ['to take'], gloss: { de: ['nehmen'], es: ['tomar'], it: ['prendere'], pt: ['pegar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v161', de: 'dire', en: ['to say', 'to tell'], gloss: { de: ['sagen'], es: ['decir'], it: ['dire'], pt: ['dizer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'fr1v162', de: 'chercher', en: ['to look for'], gloss: { de: ['suchen'], es: ['buscar'], it: ['cercare'], pt: ['procurar'] }, pos: 'verb', level: 'A1', category: 'verbs' },

  // ── more adjectives ───────────────────────────────────────────────────
  { id: 'fr1v163', de: 'chaud', en: ['hot', 'warm'], gloss: { de: ['warm'], es: ['caliente'], it: ['caldo'], pt: ['quente'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v164', de: 'froid', en: ['cold'], gloss: { de: ['kalt'], es: ['frío'], it: ['freddo'], pt: ['frio'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v165', de: 'jeune', en: ['young'], gloss: { de: ['jung'], es: ['joven'], it: ['giovane'], pt: ['jovem'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v166', de: 'beau', en: ['beautiful', 'handsome'], gloss: { de: ['schön'], es: ['hermoso'], it: ['bello'], pt: ['belo'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v167', de: 'gentil', en: ['kind', 'nice'], gloss: { de: ['nett'], es: ['amable'], it: ['gentile'], pt: ['gentil'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v168', de: 'malade', en: ['ill', 'sick'], gloss: { de: ['krank'], es: ['enfermo'], it: ['malato'], pt: ['doente'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v169', de: 'prêt', en: ['ready'], gloss: { de: ['bereit'], es: ['listo'], it: ['pronto'], pt: ['pronto'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v170', de: 'fort', en: ['strong'], gloss: { de: ['stark'], es: ['fuerte'], it: ['forte'], pt: ['forte'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v171', de: 'ouvert', en: ['open'], gloss: { de: ['geöffnet'], es: ['abierto'], it: ['aperto'], pt: ['aberto'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'fr1v172', de: 'fermé', en: ['closed', 'shut'], gloss: { de: ['geschlossen'], es: ['cerrado'], it: ['chiuso'], pt: ['fechado'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
];
