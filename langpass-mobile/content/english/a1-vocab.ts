import type { VocabItem } from '@/content/german/types';

// English A1 core vocabulary. The `de` field holds the English text (see the
// note in content/german/types.ts — `de` is the "language being learned" slot
// regardless of pack). Nouns include the article ("the water") to mirror the
// other packs' shape and because article use is itself part of the lesson.
//
// This pack is the one case where `en` is degenerate: the reading side and the
// target side are the same language. `en` still carries the bare word (article
// stripped) plus a clarifier where it disambiguates, because the type contract
// guarantees it as the fallback for any locale `gloss` misses. An English-UI
// user is never offered English to learn, so it is not shown in practice.
//
// `gloss` therefore covers ALL five other UI locales — de / es / fr / it / pt.
//
// Vocabulary is neutral international English: where usage splits (shop/store,
// bill/check), we teach the more widely understood form and list the other in
// `en` so a correct answer is never marked wrong.

export const A1_VOCAB: VocabItem[] = [
  // ── greetings & basics ────────────────────────────────────────────────
  { id: 'en1v001', de: 'hello', en: ['hello', 'hi'], gloss: { de: ['hallo'], es: ['hola'], fr: ['bonjour', 'salut'], it: ['ciao'], pt: ['olá'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'en1v002', de: 'goodbye', en: ['goodbye', 'bye'], gloss: { de: ['tschüss'], es: ['adiós'], fr: ['au revoir'], it: ['ciao', 'arrivederci'], pt: ['tchau'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'en1v003', de: 'good morning', en: ['good morning'], gloss: { de: ['guten Morgen'], es: ['buenos días'], fr: ['bonjour'], it: ['buongiorno'], pt: ['bom dia'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'en1v004', de: 'good evening', en: ['good evening'], gloss: { de: ['guten Abend'], es: ['buenas tardes'], fr: ['bonsoir'], it: ['buonasera'], pt: ['boa noite'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'en1v005', de: 'good night', en: ['good night'], gloss: { de: ['gute Nacht'], es: ['buenas noches'], fr: ['bonne nuit'], it: ['buonanotte'], pt: ['boa noite'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'en1v006', de: 'please', en: ['please'], gloss: { de: ['bitte'], es: ['por favor'], fr: ['s’il vous plaît'], it: ['per favore'], pt: ['por favor'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'en1v007', de: 'thank you', en: ['thank you', 'thanks'], gloss: { de: ['danke'], es: ['gracias'], fr: ['merci'], it: ['grazie'], pt: ['obrigado'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'en1v008', de: 'you’re welcome', en: ['you’re welcome'], gloss: { de: ['gern geschehen'], es: ['de nada'], fr: ['de rien'], it: ['prego'], pt: ['de nada'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'en1v009', de: 'sorry', en: ['sorry', 'excuse me'], gloss: { de: ['Entschuldigung'], es: ['perdón'], fr: ['pardon'], it: ['scusa'], pt: ['desculpa'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'en1v010', de: 'yes', en: ['yes'], gloss: { de: ['ja'], es: ['sí'], fr: ['oui'], it: ['sì'], pt: ['sim'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'en1v011', de: 'no', en: ['no'], gloss: { de: ['nein'], es: ['no'], fr: ['non'], it: ['no'], pt: ['não'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'en1v012', de: 'how are you?', en: ['how are you?'], gloss: { de: ['wie geht es dir?'], es: ['¿qué tal?'], fr: ['comment ça va ?'], it: ['come va?'], pt: ['tudo bem?'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'en1v013', de: 'see you later', en: ['see you later'], gloss: { de: ['bis später'], es: ['hasta luego'], fr: ['à plus tard'], it: ['a dopo'], pt: ['até logo'] }, pos: 'phrase', level: 'A1', category: 'greetings' },

  // ── people & family ───────────────────────────────────────────────────
  { id: 'en1v014', de: 'the man', en: ['the man', 'man'], gloss: { de: ['der Mann'], es: ['el hombre'], fr: ['l’homme'], it: ['l’uomo'], pt: ['o homem'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'en1v015', de: 'the woman', en: ['the woman', 'woman'], gloss: { de: ['die Frau'], es: ['la mujer'], fr: ['la femme'], it: ['la donna'], pt: ['a mulher'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'en1v016', de: 'the boy', en: ['the boy', 'boy'], gloss: { de: ['der Junge'], es: ['el niño'], fr: ['le garçon'], it: ['il ragazzo'], pt: ['o menino'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'en1v017', de: 'the girl', en: ['the girl', 'girl'], gloss: { de: ['das Mädchen'], es: ['la niña'], fr: ['la fille'], it: ['la ragazza'], pt: ['a menina'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'en1v018', de: 'the child', en: ['the child', 'child'], gloss: { de: ['das Kind'], es: ['el niño'], fr: ['l’enfant'], it: ['il bambino'], pt: ['a criança'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'en1v019', de: 'the friend', en: ['the friend', 'friend'], gloss: { de: ['der Freund'], es: ['el amigo'], fr: ['l’ami'], it: ['l’amico'], pt: ['o amigo'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'en1v020', de: 'the mother', en: ['the mother', 'mother'], gloss: { de: ['die Mutter'], es: ['la madre'], fr: ['la mère'], it: ['la madre'], pt: ['a mãe'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'en1v021', de: 'the father', en: ['the father', 'father'], gloss: { de: ['der Vater'], es: ['el padre'], fr: ['le père'], it: ['il padre'], pt: ['o pai'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'en1v022', de: 'the sister', en: ['the sister', 'sister'], gloss: { de: ['die Schwester'], es: ['la hermana'], fr: ['la sœur'], it: ['la sorella'], pt: ['a irmã'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'en1v023', de: 'the brother', en: ['the brother', 'brother'], gloss: { de: ['der Bruder'], es: ['el hermano'], fr: ['le frère'], it: ['il fratello'], pt: ['o irmão'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'en1v024', de: 'the family', en: ['the family', 'family'], gloss: { de: ['die Familie'], es: ['la familia'], fr: ['la famille'], it: ['la famiglia'], pt: ['a família'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'en1v025', de: 'the person', en: ['the person', 'person'], gloss: { de: ['die Person'], es: ['la persona'], fr: ['la personne'], it: ['la persona'], pt: ['a pessoa'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'en1v026', de: 'the name', en: ['the name', 'name'], gloss: { de: ['der Name'], es: ['el nombre'], fr: ['le nom'], it: ['il nome'], pt: ['o nome'] }, pos: 'noun', level: 'A1', category: 'people' },

  // ── food & drink ──────────────────────────────────────────────────────
  { id: 'en1v027', de: 'the water', en: ['water'], gloss: { de: ['das Wasser'], es: ['el agua'], fr: ['l’eau'], it: ['l’acqua'], pt: ['a água'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'en1v028', de: 'the coffee', en: ['coffee'], gloss: { de: ['der Kaffee'], es: ['el café'], fr: ['le café'], it: ['il caffè'], pt: ['o café'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'en1v029', de: 'the tea', en: ['tea'], gloss: { de: ['der Tee'], es: ['el té'], fr: ['le thé'], it: ['il tè'], pt: ['o chá'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'en1v030', de: 'the bread', en: ['bread'], gloss: { de: ['das Brot'], es: ['el pan'], fr: ['le pain'], it: ['il pane'], pt: ['o pão'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'en1v031', de: 'the milk', en: ['milk'], gloss: { de: ['die Milch'], es: ['la leche'], fr: ['le lait'], it: ['il latte'], pt: ['o leite'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'en1v032', de: 'the beer', en: ['beer'], gloss: { de: ['das Bier'], es: ['la cerveza'], fr: ['la bière'], it: ['la birra'], pt: ['a cerveja'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'en1v033', de: 'the wine', en: ['wine'], gloss: { de: ['der Wein'], es: ['el vino'], fr: ['le vin'], it: ['il vino'], pt: ['o vinho'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'en1v034', de: 'the food', en: ['food', 'the meal'], gloss: { de: ['das Essen'], es: ['la comida'], fr: ['la nourriture'], it: ['il cibo'], pt: ['a comida'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'en1v035', de: 'the meat', en: ['meat'], gloss: { de: ['das Fleisch'], es: ['la carne'], fr: ['la viande'], it: ['la carne'], pt: ['a carne'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'en1v036', de: 'the fish', en: ['fish'], gloss: { de: ['der Fisch'], es: ['el pescado'], fr: ['le poisson'], it: ['il pesce'], pt: ['o peixe'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'en1v037', de: 'the fruit', en: ['fruit'], gloss: { de: ['das Obst'], es: ['la fruta'], fr: ['le fruit'], it: ['la frutta'], pt: ['a fruta'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'en1v038', de: 'the egg', en: ['egg'], gloss: { de: ['das Ei'], es: ['el huevo'], fr: ['l’œuf'], it: ['l’uovo'], pt: ['o ovo'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'en1v039', de: 'the breakfast', en: ['breakfast'], gloss: { de: ['das Frühstück'], es: ['el desayuno'], fr: ['le petit-déjeuner'], it: ['la colazione'], pt: ['o café da manhã'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'en1v040', de: 'the bill', en: ['bill', 'the check'], gloss: { de: ['die Rechnung'], es: ['la cuenta'], fr: ['l’addition'], it: ['il conto'], pt: ['a conta'] }, pos: 'noun', level: 'A1', category: 'food' },

  // ── places ────────────────────────────────────────────────────────────
  { id: 'en1v041', de: 'the house', en: ['house', 'the home'], gloss: { de: ['das Haus'], es: ['la casa'], fr: ['la maison'], it: ['la casa'], pt: ['a casa'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'en1v042', de: 'the city', en: ['city'], gloss: { de: ['die Stadt'], es: ['la ciudad'], fr: ['la ville'], it: ['la città'], pt: ['a cidade'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'en1v043', de: 'the street', en: ['street'], gloss: { de: ['die Straße'], es: ['la calle'], fr: ['la rue'], it: ['la strada'], pt: ['a rua'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'en1v044', de: 'the shop', en: ['shop', 'the shop'], gloss: { de: ['der Laden'], es: ['la tienda'], fr: ['le magasin'], it: ['il negozio'], pt: ['a loja'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'en1v045', de: 'the restaurant', en: ['restaurant'], gloss: { de: ['das Restaurant'], es: ['el restaurante'], fr: ['le restaurant'], it: ['il ristorante'], pt: ['o restaurante'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'en1v046', de: 'the beach', en: ['beach'], gloss: { de: ['der Strand'], es: ['la playa'], fr: ['la plage'], it: ['la spiaggia'], pt: ['a praia'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'en1v047', de: 'the work', en: ['work', 'the job'], gloss: { de: ['die Arbeit'], es: ['el trabajo'], fr: ['le travail'], it: ['il lavoro'], pt: ['o trabalho'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'en1v048', de: 'the school', en: ['school'], gloss: { de: ['die Schule'], es: ['la escuela'], fr: ['l’école'], it: ['la scuola'], pt: ['a escola'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'en1v049', de: 'the toilet', en: ['toilet', 'the bathroom'], gloss: { de: ['die Toilette'], es: ['el baño'], fr: ['les toilettes'], it: ['il bagno'], pt: ['o banheiro'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'en1v050', de: 'the station', en: ['station'], gloss: { de: ['der Bahnhof'], es: ['la estación'], fr: ['la gare'], it: ['la stazione'], pt: ['a estação'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'en1v051', de: 'the hotel', en: ['hotel'], gloss: { de: ['das Hotel'], es: ['el hotel'], fr: ['l’hôtel'], it: ['l’hotel'], pt: ['o hotel'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'en1v052', de: 'the market', en: ['market'], gloss: { de: ['der Markt'], es: ['el mercado'], fr: ['le marché'], it: ['il mercato'], pt: ['o mercado'] }, pos: 'noun', level: 'A1', category: 'places' },

  // ── verbs ─────────────────────────────────────────────────────────────
  { id: 'en1v053', de: 'to be', en: ['to be'], gloss: { de: ['sein'], es: ['ser', 'estar'], fr: ['être'], it: ['essere'], pt: ['ser', 'estar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'en1v054', de: 'to have', en: ['to have'], gloss: { de: ['haben'], es: ['tener'], fr: ['avoir'], it: ['avere'], pt: ['ter'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'en1v055', de: 'to do', en: ['to do', 'to make'], gloss: { de: ['machen'], es: ['hacer'], fr: ['faire'], it: ['fare'], pt: ['fazer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'en1v056', de: 'to go', en: ['to go'], gloss: { de: ['gehen'], es: ['ir'], fr: ['aller'], it: ['andare'], pt: ['ir'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'en1v057', de: 'to want', en: ['to want'], gloss: { de: ['wollen'], es: ['querer'], fr: ['vouloir'], it: ['volere'], pt: ['querer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'en1v058', de: 'to eat', en: ['to eat'], gloss: { de: ['essen'], es: ['comer'], fr: ['manger'], it: ['mangiare'], pt: ['comer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'en1v059', de: 'to drink', en: ['to drink'], gloss: { de: ['trinken'], es: ['beber'], fr: ['boire'], it: ['bere'], pt: ['beber'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'en1v060', de: 'to speak', en: ['to speak', 'to talk'], gloss: { de: ['sprechen'], es: ['hablar'], fr: ['parler'], it: ['parlare'], pt: ['falar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'en1v061', de: 'to live', en: ['to live'], gloss: { de: ['leben', 'wohnen'], es: ['vivir'], fr: ['vivre', 'habiter'], it: ['vivere', 'abitare'], pt: ['morar', 'viver'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'en1v062', de: 'to work', en: ['to work'], gloss: { de: ['arbeiten'], es: ['trabajar'], fr: ['travailler'], it: ['lavorare'], pt: ['trabalhar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'en1v063', de: 'to buy', en: ['to buy'], gloss: { de: ['kaufen'], es: ['comprar'], fr: ['acheter'], it: ['comprare'], pt: ['comprar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'en1v064', de: 'to understand', en: ['to understand'], gloss: { de: ['verstehen'], es: ['entender'], fr: ['comprendre'], it: ['capire'], pt: ['entender'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'en1v065', de: 'to need', en: ['to need'], gloss: { de: ['brauchen'], es: ['necesitar'], fr: ['avoir besoin de'], it: ['avere bisogno di'], pt: ['precisar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'en1v066', de: 'to like', en: ['to like'], gloss: { de: ['mögen'], es: ['gustar'], fr: ['aimer'], it: ['piacere'], pt: ['gostar'] }, pos: 'verb', level: 'A1', category: 'verbs' },

  // ── adjectives ────────────────────────────────────────────────────────
  { id: 'en1v067', de: 'big', en: ['big', 'large'], gloss: { de: ['groß'], es: ['grande'], fr: ['grand'], it: ['grande'], pt: ['grande'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'en1v068', de: 'small', en: ['small', 'little'], gloss: { de: ['klein'], es: ['pequeño'], fr: ['petit'], it: ['piccolo'], pt: ['pequeno'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'en1v069', de: 'good', en: ['good'], gloss: { de: ['gut'], es: ['bueno'], fr: ['bon'], it: ['buono'], pt: ['bom'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'en1v070', de: 'bad', en: ['bad'], gloss: { de: ['schlecht'], es: ['malo'], fr: ['mauvais'], it: ['cattivo'], pt: ['ruim'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'en1v071', de: 'expensive', en: ['expensive'], gloss: { de: ['teuer'], es: ['caro'], fr: ['cher'], it: ['caro'], pt: ['caro'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'en1v072', de: 'cheap', en: ['cheap'], gloss: { de: ['billig'], es: ['barato'], fr: ['bon marché'], it: ['economico'], pt: ['barato'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'en1v073', de: 'new', en: ['new'], gloss: { de: ['neu'], es: ['nuevo'], fr: ['nouveau'], it: ['nuovo'], pt: ['novo'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'en1v074', de: 'old', en: ['old'], gloss: { de: ['alt'], es: ['viejo'], fr: ['vieux'], it: ['vecchio'], pt: ['velho'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'en1v075', de: 'nice', en: ['nice', 'pretty'], gloss: { de: ['schön'], es: ['bonito'], fr: ['joli'], it: ['bello'], pt: ['bonito'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'en1v076', de: 'tired', en: ['tired'], gloss: { de: ['müde'], es: ['cansado'], fr: ['fatigué'], it: ['stanco'], pt: ['cansado'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'en1v077', de: 'easy', en: ['easy'], gloss: { de: ['einfach'], es: ['fácil'], fr: ['facile'], it: ['facile'], pt: ['fácil'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'en1v078', de: 'difficult', en: ['difficult', 'hard'], gloss: { de: ['schwierig'], es: ['difícil'], fr: ['difficile'], it: ['difficile'], pt: ['difícil'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'en1v079', de: 'cold', en: ['cold'], gloss: { de: ['kalt'], es: ['frío'], fr: ['froid'], it: ['freddo'], pt: ['frio'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'en1v080', de: 'hot', en: ['hot'], gloss: { de: ['heiß'], es: ['caliente'], fr: ['chaud'], it: ['caldo'], pt: ['quente'] }, pos: 'adj', level: 'A1', category: 'adjectives' },

  // ── numbers ───────────────────────────────────────────────────────────
  { id: 'en1v081', de: 'one', en: ['one'], gloss: { de: ['eins'], es: ['uno'], fr: ['un'], it: ['uno'], pt: ['um'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'en1v082', de: 'two', en: ['two'], gloss: { de: ['zwei'], es: ['dos'], fr: ['deux'], it: ['due'], pt: ['dois'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'en1v083', de: 'three', en: ['three'], gloss: { de: ['drei'], es: ['tres'], fr: ['trois'], it: ['tre'], pt: ['três'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'en1v084', de: 'four', en: ['four'], gloss: { de: ['vier'], es: ['cuatro'], fr: ['quatre'], it: ['quattro'], pt: ['quatro'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'en1v085', de: 'five', en: ['five'], gloss: { de: ['fünf'], es: ['cinco'], fr: ['cinq'], it: ['cinque'], pt: ['cinco'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'en1v086', de: 'six', en: ['six'], gloss: { de: ['sechs'], es: ['seis'], fr: ['six'], it: ['sei'], pt: ['seis'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'en1v087', de: 'seven', en: ['seven'], gloss: { de: ['sieben'], es: ['siete'], fr: ['sept'], it: ['sette'], pt: ['sete'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'en1v088', de: 'eight', en: ['eight'], gloss: { de: ['acht'], es: ['ocho'], fr: ['huit'], it: ['otto'], pt: ['oito'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'en1v089', de: 'nine', en: ['nine'], gloss: { de: ['neun'], es: ['nueve'], fr: ['neuf'], it: ['nove'], pt: ['nove'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'en1v090', de: 'ten', en: ['ten'], gloss: { de: ['zehn'], es: ['diez'], fr: ['dix'], it: ['dieci'], pt: ['dez'] }, pos: 'number', level: 'A1', category: 'numbers' },

  // ── time ──────────────────────────────────────────────────────────────
  { id: 'en1v091', de: 'today', en: ['today'], gloss: { de: ['heute'], es: ['hoy'], fr: ['aujourd’hui'], it: ['oggi'], pt: ['hoje'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'en1v092', de: 'tomorrow', en: ['tomorrow'], gloss: { de: ['morgen'], es: ['mañana'], fr: ['demain'], it: ['domani'], pt: ['amanhã'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'en1v093', de: 'yesterday', en: ['yesterday'], gloss: { de: ['gestern'], es: ['ayer'], fr: ['hier'], it: ['ieri'], pt: ['ontem'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'en1v094', de: 'now', en: ['now'], gloss: { de: ['jetzt'], es: ['ahora'], fr: ['maintenant'], it: ['adesso'], pt: ['agora'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'en1v095', de: 'always', en: ['always'], gloss: { de: ['immer'], es: ['siempre'], fr: ['toujours'], it: ['sempre'], pt: ['sempre'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'en1v096', de: 'never', en: ['never'], gloss: { de: ['nie'], es: ['nunca'], fr: ['jamais'], it: ['mai'], pt: ['nunca'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'en1v097', de: 'the day', en: ['day'], gloss: { de: ['der Tag'], es: ['el día'], fr: ['le jour'], it: ['il giorno'], pt: ['o dia'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'en1v098', de: 'the night', en: ['night'], gloss: { de: ['die Nacht'], es: ['la noche'], fr: ['la nuit'], it: ['la notte'], pt: ['a noite'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'en1v099', de: 'the morning', en: ['morning'], gloss: { de: ['der Morgen'], es: ['la mañana'], fr: ['le matin'], it: ['la mattina'], pt: ['a manhã'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'en1v100', de: 'the week', en: ['week'], gloss: { de: ['die Woche'], es: ['la semana'], fr: ['la semaine'], it: ['la settimana'], pt: ['a semana'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'en1v101', de: 'the year', en: ['year'], gloss: { de: ['das Jahr'], es: ['el año'], fr: ['l’année'], it: ['l’anno'], pt: ['o ano'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'en1v102', de: 'Monday', en: ['Monday'], gloss: { de: ['Montag'], es: ['lunes'], fr: ['lundi'], it: ['lunedì'], pt: ['segunda-feira'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'en1v103', de: 'Saturday', en: ['Saturday'], gloss: { de: ['Samstag'], es: ['sábado'], fr: ['samedi'], it: ['sabato'], pt: ['sábado'] }, pos: 'noun', level: 'A1', category: 'time' },

  // ── questions & connectors ────────────────────────────────────────────
  { id: 'en1v104', de: 'what', en: ['what'], gloss: { de: ['was'], es: ['qué'], fr: ['quoi'], it: ['che cosa'], pt: ['o que'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'en1v105', de: 'who', en: ['who'], gloss: { de: ['wer'], es: ['quién'], fr: ['qui'], it: ['chi'], pt: ['quem'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'en1v106', de: 'where', en: ['where'], gloss: { de: ['wo'], es: ['dónde'], fr: ['où'], it: ['dove'], pt: ['onde'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'en1v107', de: 'when', en: ['when'], gloss: { de: ['wann'], es: ['cuándo'], fr: ['quand'], it: ['quando'], pt: ['quando'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'en1v108', de: 'how', en: ['how'], gloss: { de: ['wie'], es: ['cómo'], fr: ['comment'], it: ['come'], pt: ['como'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'en1v109', de: 'why', en: ['why'], gloss: { de: ['warum'], es: ['por qué'], fr: ['pourquoi'], it: ['perché'], pt: ['por que'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'en1v110', de: 'how much', en: ['how much'], gloss: { de: ['wie viel'], es: ['cuánto'], fr: ['combien'], it: ['quanto'], pt: ['quanto'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'en1v111', de: 'how many', en: ['how many'], gloss: { de: ['wie viele'], es: ['cuántos'], fr: ['combien de'], it: ['quanti'], pt: ['quantos'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'en1v112', de: 'and', en: ['and'], gloss: { de: ['und'], es: ['y'], fr: ['et'], it: ['e'], pt: ['e'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'en1v113', de: 'but', en: ['but'], gloss: { de: ['aber'], es: ['pero'], fr: ['mais'], it: ['ma'], pt: ['mas'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'en1v114', de: 'because', en: ['because'], gloss: { de: ['weil'], es: ['porque'], fr: ['parce que'], it: ['perché'], pt: ['porque'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'en1v115', de: 'also', en: ['also', 'too'], gloss: { de: ['auch'], es: ['también'], fr: ['aussi'], it: ['anche'], pt: ['também'] }, pos: 'adv', level: 'A1', category: 'questions' },
  { id: 'en1v116', de: 'very', en: ['very'], gloss: { de: ['sehr'], es: ['muy'], fr: ['très'], it: ['molto'], pt: ['muito'] }, pos: 'adv', level: 'A1', category: 'questions' },
];
