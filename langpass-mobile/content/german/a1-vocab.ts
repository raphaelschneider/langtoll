import type { VocabItem } from './types';

// German A1 core vocabulary. Categories are deliberately chunky (8+ items
// each) so the exercise generator can always find 3 same-category distractors.
//
// `gloss` carries the other UI locales. English lives in `en` and is the
// guaranteed fallback; German itself is never glossed (a German-UI user is
// never offered German to learn), so each item covers es / fr / it / pt.
// Spanish is peninsular (el coche, el móvil); Portuguese is Brazilian
// (o celular, o ônibus, o café da manhã).

export const A1_VOCAB: VocabItem[] = [
  // ── basics & greetings ────────────────────────────────────────────────
  { id: 'v001', de: 'hallo', en: ['hello'], gloss: { es: ['hola'], fr: ['salut', 'bonjour'], it: ['ciao'], pt: ['oi', 'olá'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'v002', de: 'tschüss', en: ['bye'], gloss: { es: ['adiós'], fr: ['salut', 'au revoir'], it: ['ciao'], pt: ['tchau'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'v003', de: 'guten Morgen', en: ['good morning'], gloss: { es: ['buenos días'], fr: ['bonjour'], it: ['buongiorno'], pt: ['bom dia'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'v004', de: 'guten Abend', en: ['good evening'], gloss: { es: ['buenas tardes', 'buenas noches'], fr: ['bonsoir'], it: ['buonasera'], pt: ['boa noite', 'boa tarde'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'v005', de: 'gute Nacht', en: ['good night'], gloss: { es: ['buenas noches'], fr: ['bonne nuit'], it: ['buonanotte'], pt: ['boa noite'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'v006', de: 'bitte', en: ['please', 'you’re welcome'], gloss: { es: ['por favor', 'de nada'], fr: ['s’il vous plaît', 'de rien'], it: ['per favore', 'prego'], pt: ['por favor', 'de nada'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'v007', de: 'danke', en: ['thank you', 'thanks'], gloss: { es: ['gracias'], fr: ['merci'], it: ['grazie'], pt: ['obrigado'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'v008', de: 'Entschuldigung', en: ['excuse me', 'sorry'], gloss: { es: ['perdón', 'disculpe'], fr: ['pardon', 'excusez-moi'], it: ['scusi', 'scusa'], pt: ['com licença', 'desculpe'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'v009', de: 'ja', en: ['yes'], gloss: { es: ['sí'], fr: ['oui'], it: ['sì'], pt: ['sim'] }, pos: 'phrase', level: 'A1', category: 'greetings' },
  { id: 'v010', de: 'nein', en: ['no'], gloss: { es: ['no'], fr: ['non'], it: ['no'], pt: ['não'] }, pos: 'phrase', level: 'A1', category: 'greetings' },

  // ── people & family ───────────────────────────────────────────────────
  { id: 'v011', de: 'der Mann', en: ['the man'], gloss: { es: ['el hombre'], fr: ['l’homme'], it: ['l’uomo'], pt: ['o homem'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'v012', de: 'die Frau', en: ['the woman'], gloss: { es: ['la mujer'], fr: ['la femme'], it: ['la donna'], pt: ['a mulher'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'v013', de: 'das Kind', en: ['the child'], gloss: { es: ['el niño'], fr: ['l’enfant'], it: ['il bambino'], pt: ['a criança'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'v014', de: 'die Mutter', en: ['the mother'], gloss: { es: ['la madre'], fr: ['la mère'], it: ['la madre'], pt: ['a mãe'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'v015', de: 'der Vater', en: ['the father'], gloss: { es: ['el padre'], fr: ['le père'], it: ['il padre'], pt: ['o pai'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'v016', de: 'die Schwester', en: ['the sister'], gloss: { es: ['la hermana'], fr: ['la sœur'], it: ['la sorella'], pt: ['a irmã'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'v017', de: 'der Bruder', en: ['the brother'], gloss: { es: ['el hermano'], fr: ['le frère'], it: ['il fratello'], pt: ['o irmão'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'v018', de: 'der Freund', en: ['the friend (male)', 'the boyfriend'], gloss: { es: ['el amigo', 'el novio'], fr: ['l’ami', 'le petit ami'], it: ['l’amico', 'il ragazzo'], pt: ['o amigo', 'o namorado'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'v019', de: 'die Freundin', en: ['the friend (female)', 'the girlfriend'], gloss: { es: ['la amiga', 'la novia'], fr: ['l’amie', 'la petite amie'], it: ['l’amica', 'la ragazza'], pt: ['a amiga', 'a namorada'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'v020', de: 'die Familie', en: ['the family'], gloss: { es: ['la familia'], fr: ['la famille'], it: ['la famiglia'], pt: ['a família'] }, pos: 'noun', level: 'A1', category: 'people' },

  // ── food & drink ──────────────────────────────────────────────────────
  { id: 'v021', de: 'das Brot', en: ['the bread'], gloss: { es: ['el pan'], fr: ['le pain'], it: ['il pane'], pt: ['o pão'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v022', de: 'das Wasser', en: ['the water'], gloss: { es: ['el agua'], fr: ['l’eau'], it: ['l’acqua'], pt: ['a água'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v023', de: 'der Kaffee', en: ['the coffee'], gloss: { es: ['el café'], fr: ['le café'], it: ['il caffè'], pt: ['o café'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v024', de: 'der Tee', en: ['the tea'], gloss: { es: ['el té'], fr: ['le thé'], it: ['il tè'], pt: ['o chá'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v025', de: 'die Milch', en: ['the milk'], gloss: { es: ['la leche'], fr: ['le lait'], it: ['il latte'], pt: ['o leite'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v026', de: 'der Apfel', en: ['the apple'], gloss: { es: ['la manzana'], fr: ['la pomme'], it: ['la mela'], pt: ['a maçã'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v027', de: 'das Ei', en: ['the egg'], gloss: { es: ['el huevo'], fr: ['l’œuf'], it: ['l’uovo'], pt: ['o ovo'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v028', de: 'der Käse', en: ['the cheese'], gloss: { es: ['el queso'], fr: ['le fromage'], it: ['il formaggio'], pt: ['o queijo'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v029', de: 'das Bier', en: ['the beer'], gloss: { es: ['la cerveza'], fr: ['la bière'], it: ['la birra'], pt: ['a cerveja'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v030', de: 'der Wein', en: ['the wine'], gloss: { es: ['el vino'], fr: ['le vin'], it: ['il vino'], pt: ['o vinho'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v031', de: 'das Frühstück', en: ['the breakfast'], gloss: { es: ['el desayuno'], fr: ['le petit-déjeuner'], it: ['la colazione'], pt: ['o café da manhã'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v032', de: 'das Restaurant', en: ['the restaurant'], gloss: { es: ['el restaurante'], fr: ['le restaurant'], it: ['il ristorante'], pt: ['o restaurante'] }, pos: 'noun', level: 'A1', category: 'food' },

  // ── everyday objects ──────────────────────────────────────────────────
  { id: 'v033', de: 'das Haus', en: ['the house'], gloss: { es: ['la casa'], fr: ['la maison'], it: ['la casa'], pt: ['a casa'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v034', de: 'die Tür', en: ['the door'], gloss: { es: ['la puerta'], fr: ['la porte'], it: ['la porta'], pt: ['a porta'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v035', de: 'das Fenster', en: ['the window'], gloss: { es: ['la ventana'], fr: ['la fenêtre'], it: ['la finestra'], pt: ['a janela'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v036', de: 'der Tisch', en: ['the table'], gloss: { es: ['la mesa'], fr: ['la table'], it: ['il tavolo'], pt: ['a mesa'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v037', de: 'der Stuhl', en: ['the chair'], gloss: { es: ['la silla'], fr: ['la chaise'], it: ['la sedia'], pt: ['a cadeira'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v038', de: 'das Bett', en: ['the bed'], gloss: { es: ['la cama'], fr: ['le lit'], it: ['il letto'], pt: ['a cama'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v039', de: 'das Buch', en: ['the book'], gloss: { es: ['el libro'], fr: ['le livre'], it: ['il libro'], pt: ['o livro'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v040', de: 'das Handy', en: ['the mobile phone', 'the mobile'], gloss: { es: ['el móvil'], fr: ['le portable', 'le téléphone portable'], it: ['il cellulare'], pt: ['o celular'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v041', de: 'der Schlüssel', en: ['the key'], gloss: { es: ['la llave'], fr: ['la clé'], it: ['la chiave'], pt: ['a chave'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v042', de: 'die Tasche', en: ['the bag'], gloss: { es: ['el bolso'], fr: ['le sac'], it: ['la borsa'], pt: ['a bolsa'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v043', de: 'die Uhr', en: ['the clock', 'the watch'], gloss: { es: ['el reloj'], fr: ['l’horloge', 'la montre'], it: ['l’orologio'], pt: ['o relógio'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v044', de: 'das Geld', en: ['the money'], gloss: { es: ['el dinero'], fr: ['l’argent'], it: ['il denaro', 'i soldi'], pt: ['o dinheiro'] }, pos: 'noun', level: 'A1', category: 'objects' },

  // ── places & travel ───────────────────────────────────────────────────
  { id: 'v045', de: 'die Stadt', en: ['the city', 'the town'], gloss: { es: ['la ciudad'], fr: ['la ville'], it: ['la città'], pt: ['a cidade'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v046', de: 'die Straße', en: ['the street'], gloss: { es: ['la calle'], fr: ['la rue'], it: ['la strada'], pt: ['a rua'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v047', de: 'der Bahnhof', en: ['the train station'], gloss: { es: ['la estación de tren'], fr: ['la gare'], it: ['la stazione'], pt: ['a estação de trem'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v048', de: 'der Flughafen', en: ['the airport'], gloss: { es: ['el aeropuerto'], fr: ['l’aéroport'], it: ['l’aeroporto'], pt: ['o aeroporto'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v049', de: 'der Zug', en: ['the train'], gloss: { es: ['el tren'], fr: ['le train'], it: ['il treno'], pt: ['o trem'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v050', de: 'das Auto', en: ['the car'], gloss: { es: ['el coche'], fr: ['la voiture'], it: ['la macchina'], pt: ['o carro'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v051', de: 'der Bus', en: ['the bus'], gloss: { es: ['el autobús'], fr: ['le bus'], it: ['l’autobus'], pt: ['o ônibus'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v052', de: 'das Hotel', en: ['the hotel'], gloss: { es: ['el hotel'], fr: ['l’hôtel'], it: ['l’hotel'], pt: ['o hotel'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v053', de: 'der Supermarkt', en: ['the supermarket'], gloss: { es: ['el supermercado'], fr: ['le supermarché'], it: ['il supermercato'], pt: ['o supermercado'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v054', de: 'die Arbeit', en: ['the work', 'the job'], gloss: { es: ['el trabajo'], fr: ['le travail'], it: ['il lavoro'], pt: ['o trabalho'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v055', de: 'die Schule', en: ['the school'], gloss: { es: ['la escuela'], fr: ['l’école'], it: ['la scuola'], pt: ['a escola'] }, pos: 'noun', level: 'A1', category: 'places' },

  // ── time ──────────────────────────────────────────────────────────────
  { id: 'v056', de: 'heute', en: ['today'], gloss: { es: ['hoy'], fr: ['aujourd’hui'], it: ['oggi'], pt: ['hoje'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'v057', de: 'morgen', en: ['tomorrow'], gloss: { es: ['mañana'], fr: ['demain'], it: ['domani'], pt: ['amanhã'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'v058', de: 'gestern', en: ['yesterday'], gloss: { es: ['ayer'], fr: ['hier'], it: ['ieri'], pt: ['ontem'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'v059', de: 'jetzt', en: ['now'], gloss: { es: ['ahora'], fr: ['maintenant'], it: ['adesso', 'ora'], pt: ['agora'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'v060', de: 'später', en: ['later'], gloss: { es: ['más tarde'], fr: ['plus tard'], it: ['più tardi'], pt: ['mais tarde'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'v061', de: 'der Tag', en: ['the day'], gloss: { es: ['el día'], fr: ['le jour'], it: ['il giorno'], pt: ['o dia'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'v062', de: 'die Woche', en: ['the week'], gloss: { es: ['la semana'], fr: ['la semaine'], it: ['la settimana'], pt: ['a semana'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'v063', de: 'das Jahr', en: ['the year'], gloss: { es: ['el año'], fr: ['l’année'], it: ['l’anno'], pt: ['o ano'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'v064', de: 'die Nacht', en: ['the night'], gloss: { es: ['la noche'], fr: ['la nuit'], it: ['la notte'], pt: ['a noite'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'v065', de: 'immer', en: ['always'], gloss: { es: ['siempre'], fr: ['toujours'], it: ['sempre'], pt: ['sempre'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'v066', de: 'nie', en: ['never'], gloss: { es: ['nunca'], fr: ['jamais'], it: ['mai'], pt: ['nunca'] }, pos: 'adv', level: 'A1', category: 'time' },
  { id: 'v067', de: 'oft', en: ['often'], gloss: { es: ['a menudo'], fr: ['souvent'], it: ['spesso'], pt: ['muitas vezes', 'frequentemente'] }, pos: 'adv', level: 'A1', category: 'time' },

  // ── verbs ─────────────────────────────────────────────────────────────
  { id: 'v068', de: 'sein', en: ['to be'], gloss: { es: ['ser', 'estar'], fr: ['être'], it: ['essere'], pt: ['ser', 'estar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v069', de: 'haben', en: ['to have'], gloss: { es: ['tener'], fr: ['avoir'], it: ['avere'], pt: ['ter'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v070', de: 'gehen', en: ['to go', 'to walk'], gloss: { es: ['ir', 'caminar'], fr: ['aller', 'marcher'], it: ['andare', 'camminare'], pt: ['ir', 'andar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v071', de: 'kommen', en: ['to come'], gloss: { es: ['venir'], fr: ['venir'], it: ['venire'], pt: ['vir'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v072', de: 'machen', en: ['to make', 'to do'], gloss: { es: ['hacer'], fr: ['faire'], it: ['fare'], pt: ['fazer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v073', de: 'essen', en: ['to eat'], gloss: { es: ['comer'], fr: ['manger'], it: ['mangiare'], pt: ['comer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v074', de: 'trinken', en: ['to drink'], gloss: { es: ['beber'], fr: ['boire'], it: ['bere'], pt: ['beber'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v075', de: 'sprechen', en: ['to speak'], gloss: { es: ['hablar'], fr: ['parler'], it: ['parlare'], pt: ['falar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v076', de: 'lernen', en: ['to learn'], gloss: { es: ['aprender'], fr: ['apprendre'], it: ['imparare'], pt: ['aprender'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v077', de: 'arbeiten', en: ['to work'], gloss: { es: ['trabajar'], fr: ['travailler'], it: ['lavorare'], pt: ['trabalhar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v078', de: 'schlafen', en: ['to sleep'], gloss: { es: ['dormir'], fr: ['dormir'], it: ['dormire'], pt: ['dormir'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v079', de: 'kaufen', en: ['to buy'], gloss: { es: ['comprar'], fr: ['acheter'], it: ['comprare'], pt: ['comprar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v080', de: 'sehen', en: ['to see'], gloss: { es: ['ver'], fr: ['voir'], it: ['vedere'], pt: ['ver'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v081', de: 'hören', en: ['to hear', 'to listen'], gloss: { es: ['oír', 'escuchar'], fr: ['entendre', 'écouter'], it: ['sentire', 'ascoltare'], pt: ['ouvir', 'escutar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v082', de: 'lesen', en: ['to read'], gloss: { es: ['leer'], fr: ['lire'], it: ['leggere'], pt: ['ler'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v083', de: 'schreiben', en: ['to write'], gloss: { es: ['escribir'], fr: ['écrire'], it: ['scrivere'], pt: ['escrever'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v084', de: 'fahren', en: ['to drive', 'to ride'], gloss: { es: ['conducir', 'ir en coche'], fr: ['conduire', 'rouler'], it: ['guidare', 'andare in macchina'], pt: ['dirigir', 'ir de carro'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v085', de: 'wohnen', en: ['to live (reside)'], gloss: { es: ['vivir'], fr: ['habiter'], it: ['abitare'], pt: ['morar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v086', de: 'lieben', en: ['to love'], gloss: { es: ['amar', 'querer'], fr: ['aimer'], it: ['amare'], pt: ['amar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v087', de: 'brauchen', en: ['to need'], gloss: { es: ['necesitar'], fr: ['avoir besoin de'], it: ['avere bisogno di'], pt: ['precisar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v088', de: 'wissen', en: ['to know (a fact)'], gloss: { es: ['saber'], fr: ['savoir'], it: ['sapere'], pt: ['saber'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v089', de: 'verstehen', en: ['to understand'], gloss: { es: ['entender', 'comprender'], fr: ['comprendre'], it: ['capire'], pt: ['entender', 'compreender'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v090', de: 'helfen', en: ['to help'], gloss: { es: ['ayudar'], fr: ['aider'], it: ['aiutare'], pt: ['ajudar'] }, pos: 'verb', level: 'A1', category: 'verbs' },

  // ── adjectives ────────────────────────────────────────────────────────
  { id: 'v091', de: 'gut', en: ['good'], gloss: { es: ['bueno'], fr: ['bon'], it: ['buono'], pt: ['bom'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v092', de: 'schlecht', en: ['bad'], gloss: { es: ['malo'], fr: ['mauvais'], it: ['cattivo'], pt: ['ruim'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v093', de: 'groß', en: ['big', 'tall'], gloss: { es: ['grande', 'alto'], fr: ['grand'], it: ['grande', 'alto'], pt: ['grande', 'alto'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v094', de: 'klein', en: ['small', 'little'], gloss: { es: ['pequeño'], fr: ['petit'], it: ['piccolo'], pt: ['pequeno'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v095', de: 'neu', en: ['new'], gloss: { es: ['nuevo'], fr: ['nouveau'], it: ['nuovo'], pt: ['novo'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v096', de: 'alt', en: ['old'], gloss: { es: ['viejo'], fr: ['vieux'], it: ['vecchio'], pt: ['velho'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v097', de: 'schön', en: ['beautiful', 'nice'], gloss: { es: ['bonito', 'hermoso'], fr: ['beau', 'joli'], it: ['bello', 'carino'], pt: ['bonito', 'lindo'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v098', de: 'schnell', en: ['fast', 'quick'], gloss: { es: ['rápido'], fr: ['rapide'], it: ['veloce'], pt: ['rápido'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v099', de: 'langsam', en: ['slow'], gloss: { es: ['lento'], fr: ['lent'], it: ['lento'], pt: ['lento', 'devagar'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v100', de: 'teuer', en: ['expensive'], gloss: { es: ['caro'], fr: ['cher'], it: ['caro'], pt: ['caro'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v101', de: 'billig', en: ['cheap'], gloss: { es: ['barato'], fr: ['bon marché'], it: ['economico'], pt: ['barato'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v102', de: 'müde', en: ['tired'], gloss: { es: ['cansado'], fr: ['fatigué'], it: ['stanco'], pt: ['cansado'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v103', de: 'glücklich', en: ['happy'], gloss: { es: ['feliz'], fr: ['heureux'], it: ['felice'], pt: ['feliz'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v104', de: 'kalt', en: ['cold'], gloss: { es: ['frío'], fr: ['froid'], it: ['freddo'], pt: ['frio'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v105', de: 'warm', en: ['warm'], gloss: { es: ['caliente'], fr: ['chaud'], it: ['caldo'], pt: ['quente'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v106', de: 'schwer', en: ['heavy', 'difficult'], gloss: { es: ['pesado', 'difícil'], fr: ['lourd', 'difficile'], it: ['pesante', 'difficile'], pt: ['pesado', 'difícil'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v107', de: 'leicht', en: ['light', 'easy'], gloss: { es: ['ligero', 'fácil'], fr: ['léger', 'facile'], it: ['leggero', 'facile'], pt: ['leve', 'fácil'] }, pos: 'adj', level: 'A1', category: 'adjectives' },

  // ── numbers ───────────────────────────────────────────────────────────
  { id: 'v108', de: 'eins', en: ['one'], gloss: { es: ['uno'], fr: ['un'], it: ['uno'], pt: ['um'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'v109', de: 'zwei', en: ['two'], gloss: { es: ['dos'], fr: ['deux'], it: ['due'], pt: ['dois'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'v110', de: 'drei', en: ['three'], gloss: { es: ['tres'], fr: ['trois'], it: ['tre'], pt: ['três'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'v111', de: 'vier', en: ['four'], gloss: { es: ['cuatro'], fr: ['quatre'], it: ['quattro'], pt: ['quatro'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'v112', de: 'fünf', en: ['five'], gloss: { es: ['cinco'], fr: ['cinq'], it: ['cinque'], pt: ['cinco'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'v113', de: 'sechs', en: ['six'], gloss: { es: ['seis'], fr: ['six'], it: ['sei'], pt: ['seis'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'v114', de: 'sieben', en: ['seven'], gloss: { es: ['siete'], fr: ['sept'], it: ['sette'], pt: ['sete'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'v115', de: 'acht', en: ['eight'], gloss: { es: ['ocho'], fr: ['huit'], it: ['otto'], pt: ['oito'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'v116', de: 'neun', en: ['nine'], gloss: { es: ['nueve'], fr: ['neuf'], it: ['nove'], pt: ['nove'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'v117', de: 'zehn', en: ['ten'], gloss: { es: ['diez'], fr: ['dix'], it: ['dieci'], pt: ['dez'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'v118', de: 'zwanzig', en: ['twenty'], gloss: { es: ['veinte'], fr: ['vingt'], it: ['venti'], pt: ['vinte'] }, pos: 'number', level: 'A1', category: 'numbers' },
  { id: 'v119', de: 'hundert', en: ['one hundred'], gloss: { es: ['cien'], fr: ['cent'], it: ['cento'], pt: ['cem'] }, pos: 'number', level: 'A1', category: 'numbers' },

  // ── question words & connectors ───────────────────────────────────────
  { id: 'v120', de: 'was', en: ['what'], gloss: { es: ['qué'], fr: ['quoi', 'que'], it: ['che cosa'], pt: ['o que'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'v121', de: 'wer', en: ['who'], gloss: { es: ['quién'], fr: ['qui'], it: ['chi'], pt: ['quem'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'v122', de: 'wo', en: ['where'], gloss: { es: ['dónde'], fr: ['où'], it: ['dove'], pt: ['onde'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'v123', de: 'wann', en: ['when'], gloss: { es: ['cuándo'], fr: ['quand'], it: ['quando'], pt: ['quando'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'v124', de: 'warum', en: ['why'], gloss: { es: ['por qué'], fr: ['pourquoi'], it: ['perché'], pt: ['por que'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'v125', de: 'wie', en: ['how'], gloss: { es: ['cómo'], fr: ['comment'], it: ['come'], pt: ['como'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'v126', de: 'wie viel', en: ['how much'], gloss: { es: ['cuánto'], fr: ['combien'], it: ['quanto'], pt: ['quanto'] }, pos: 'question', level: 'A1', category: 'questions' },
  { id: 'v127', de: 'und', en: ['and'], gloss: { es: ['y'], fr: ['et'], it: ['e'], pt: ['e'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'v128', de: 'oder', en: ['or'], gloss: { es: ['o'], fr: ['ou'], it: ['o'], pt: ['ou'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'v129', de: 'aber', en: ['but'], gloss: { es: ['pero'], fr: ['mais'], it: ['ma'], pt: ['mas'] }, pos: 'conj', level: 'A1', category: 'questions' },
  { id: 'v130', de: 'weil', en: ['because'], gloss: { es: ['porque'], fr: ['parce que'], it: ['perché'], pt: ['porque'] }, pos: 'conj', level: 'A1', category: 'questions' },

  // ── weather & nature ──────────────────────────────────────────────────
  { id: 'v131', de: 'die Sonne', en: ['the sun'], gloss: { es: ['el sol'], fr: ['le soleil'], it: ['il sole'], pt: ['o sol'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'v132', de: 'der Regen', en: ['the rain'], gloss: { es: ['la lluvia'], fr: ['la pluie'], it: ['la pioggia'], pt: ['a chuva'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'v133', de: 'der Schnee', en: ['the snow'], gloss: { es: ['la nieve'], fr: ['la neige'], it: ['la neve'], pt: ['a neve'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'v134', de: 'das Wetter', en: ['the weather'], gloss: { es: ['el tiempo'], fr: ['le temps'], it: ['il tempo'], pt: ['o tempo', 'o clima'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'v135', de: 'der Baum', en: ['the tree'], gloss: { es: ['el árbol'], fr: ['l’arbre'], it: ['l’albero'], pt: ['a árvore'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'v136', de: 'der Hund', en: ['the dog'], gloss: { es: ['el perro'], fr: ['le chien'], it: ['il cane'], pt: ['o cachorro'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'v137', de: 'die Katze', en: ['the cat'], gloss: { es: ['el gato'], fr: ['le chat'], it: ['il gatto'], pt: ['o gato'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'v138', de: 'die Blume', en: ['the flower'], gloss: { es: ['la flor'], fr: ['la fleur'], it: ['il fiore'], pt: ['a flor'] }, pos: 'noun', level: 'A1', category: 'nature' },

  // ── body & health ─────────────────────────────────────────────────────
  { id: 'v139', de: 'der Kopf', en: ['the head'], gloss: { es: ['la cabeza'], fr: ['la tête'], it: ['la testa'], pt: ['a cabeça'] }, pos: 'noun', level: 'A1', category: 'body' },
  { id: 'v140', de: 'die Hand', en: ['the hand'], gloss: { es: ['la mano'], fr: ['la main'], it: ['la mano'], pt: ['a mão'] }, pos: 'noun', level: 'A1', category: 'body' },
  { id: 'v141', de: 'das Auge', en: ['the eye'], gloss: { es: ['el ojo'], fr: ['l’œil'], it: ['l’occhio'], pt: ['o olho'] }, pos: 'noun', level: 'A1', category: 'body' },
  { id: 'v142', de: 'der Fuß', en: ['the foot'], gloss: { es: ['el pie'], fr: ['le pied'], it: ['il piede'], pt: ['o pé'] }, pos: 'noun', level: 'A1', category: 'body' },
  { id: 'v143', de: 'das Herz', en: ['the heart'], gloss: { es: ['el corazón'], fr: ['le cœur'], it: ['il cuore'], pt: ['o coração'] }, pos: 'noun', level: 'A1', category: 'body' },
  { id: 'v144', de: 'der Arzt', en: ['the doctor'], gloss: { es: ['el médico'], fr: ['le médecin'], it: ['il medico'], pt: ['o médico'] }, pos: 'noun', level: 'A1', category: 'body' },
  { id: 'v145', de: 'krank', en: ['sick', 'ill'], gloss: { es: ['enfermo'], fr: ['malade'], it: ['malato'], pt: ['doente'] }, pos: 'adj', level: 'A1', category: 'body' },
  { id: 'v146', de: 'gesund', en: ['healthy'], gloss: { es: ['sano'], fr: ['en bonne santé'], it: ['sano'], pt: ['saudável'] }, pos: 'adj', level: 'A1', category: 'body' },

  // ── useful phrases ────────────────────────────────────────────────────
  { id: 'v147', de: 'Wie geht es dir?', en: ['How are you?'], gloss: { es: ['¿Cómo estás?'], fr: ['Comment vas-tu ?'], it: ['Come stai?'], pt: ['Como você está?'] }, pos: 'phrase', level: 'A1', category: 'phrases' },
  { id: 'v148', de: 'Ich verstehe nicht.', en: ['I don’t understand.'], gloss: { es: ['No entiendo.'], fr: ['Je ne comprends pas.'], it: ['Non capisco.'], pt: ['Não entendo.'] }, pos: 'phrase', level: 'A1', category: 'phrases' },
  { id: 'v149', de: 'Ich heiße …', en: ['My name is …'], gloss: { es: ['Me llamo …'], fr: ['Je m’appelle …'], it: ['Mi chiamo …'], pt: ['Meu nome é …'] }, pos: 'phrase', level: 'A1', category: 'phrases' },
  { id: 'v150', de: 'Sprechen Sie Englisch?', en: ['Do you speak English?'], gloss: { es: ['¿Habla usted inglés?'], fr: ['Parlez-vous anglais ?'], it: ['Parla inglese?'], pt: ['Você fala inglês?'] }, pos: 'phrase', level: 'A1', category: 'phrases' },
  { id: 'v151', de: 'Wo ist die Toilette?', en: ['Where is the toilet?'], gloss: { es: ['¿Dónde está el baño?'], fr: ['Où sont les toilettes ?'], it: ['Dov’è il bagno?'], pt: ['Onde fica o banheiro?'] }, pos: 'phrase', level: 'A1', category: 'phrases' },
  { id: 'v152', de: 'Das macht nichts.', en: ['That doesn’t matter.', 'No problem.'], gloss: { es: ['No importa.', 'No pasa nada.'], fr: ['Ce n’est pas grave.', 'Pas de problème.'], it: ['Non importa.', 'Non fa niente.'], pt: ['Não tem problema.', 'Não faz mal.'] }, pos: 'phrase', level: 'A1', category: 'phrases' },
  { id: 'v153', de: 'Bis später!', en: ['See you later!'], gloss: { es: ['¡Hasta luego!'], fr: ['À plus tard !'], it: ['A dopo!'], pt: ['Até logo!'] }, pos: 'phrase', level: 'A1', category: 'phrases' },
  { id: 'v154', de: 'Es tut mir leid.', en: ['I’m sorry.'], gloss: { es: ['Lo siento.'], fr: ['Je suis désolé.'], it: ['Mi dispiace.'], pt: ['Sinto muito.'] }, pos: 'phrase', level: 'A1', category: 'phrases' },

  // ── more food & drink ─────────────────────────────────────────────────
  { id: 'v155', de: 'die Butter', en: ['the butter'], gloss: { es: ['la mantequilla'], fr: ['le beurre'], it: ['il burro'], pt: ['a manteiga'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v156', de: 'der Zucker', en: ['the sugar'], gloss: { es: ['el azúcar'], fr: ['le sucre'], it: ['lo zucchero'], pt: ['o açúcar'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v157', de: 'das Salz', en: ['the salt'], gloss: { es: ['la sal'], fr: ['le sel'], it: ['il sale'], pt: ['o sal'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v158', de: 'der Reis', en: ['the rice'], gloss: { es: ['el arroz'], fr: ['le riz'], it: ['il riso'], pt: ['o arroz'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v159', de: 'die Kartoffel', en: ['the potato'], gloss: { es: ['la patata'], fr: ['la pomme de terre'], it: ['la patata'], pt: ['a batata'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v160', de: 'die Tomate', en: ['the tomato'], gloss: { es: ['el tomate'], fr: ['la tomate'], it: ['il pomodoro'], pt: ['o tomate'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v161', de: 'das Fleisch', en: ['the meat'], gloss: { es: ['la carne'], fr: ['la viande'], it: ['la carne'], pt: ['a carne'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v162', de: 'der Fisch', en: ['the fish'], gloss: { es: ['el pescado'], fr: ['le poisson'], it: ['il pesce'], pt: ['o peixe'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v163', de: 'die Suppe', en: ['the soup'], gloss: { es: ['la sopa'], fr: ['la soupe'], it: ['la zuppa'], pt: ['a sopa'] }, pos: 'noun', level: 'A1', category: 'food' },
  { id: 'v164', de: 'der Kuchen', en: ['the cake'], gloss: { es: ['el pastel'], fr: ['le gâteau'], it: ['la torta'], pt: ['o bolo'] }, pos: 'noun', level: 'A1', category: 'food' },

  // ── more everyday objects ─────────────────────────────────────────────
  { id: 'v165', de: 'der Stift', en: ['the pen'], gloss: { es: ['el bolígrafo'], fr: ['le stylo'], it: ['la penna'], pt: ['a caneta'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v166', de: 'das Papier', en: ['the paper'], gloss: { es: ['el papel'], fr: ['le papier'], it: ['la carta'], pt: ['o papel'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v167', de: 'die Lampe', en: ['the lamp'], gloss: { es: ['la lámpara'], fr: ['la lampe'], it: ['la lampada'], pt: ['a lâmpada'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v168', de: 'der Computer', en: ['the computer'], gloss: { es: ['el ordenador'], fr: ['l’ordinateur'], it: ['il computer'], pt: ['o computador'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v169', de: 'der Fernseher', en: ['the television set'], gloss: { es: ['el televisor'], fr: ['le téléviseur'], it: ['il televisore'], pt: ['a televisão'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v170', de: 'die Zeitung', en: ['the newspaper'], gloss: { es: ['el periódico'], fr: ['le journal'], it: ['il giornale'], pt: ['o jornal'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v171', de: 'der Teller', en: ['the plate'], gloss: { es: ['el plato'], fr: ['l’assiette'], it: ['il piatto'], pt: ['o prato'] }, pos: 'noun', level: 'A1', category: 'objects' },
  { id: 'v172', de: 'die Flasche', en: ['the bottle'], gloss: { es: ['la botella'], fr: ['la bouteille'], it: ['la bottiglia'], pt: ['a garrafa'] }, pos: 'noun', level: 'A1', category: 'objects' },

  // ── more places ───────────────────────────────────────────────────────
  { id: 'v173', de: 'die Kirche', en: ['the church'], gloss: { es: ['la iglesia'], fr: ['l’église'], it: ['la chiesa'], pt: ['a igreja'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v174', de: 'der Park', en: ['the park'], gloss: { es: ['el parque'], fr: ['le parc'], it: ['il parco'], pt: ['o parque'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v175', de: 'das Krankenhaus', en: ['the hospital'], gloss: { es: ['el hospital'], fr: ['l’hôpital'], it: ['l’ospedale'], pt: ['o hospital'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v176', de: 'die Bank', en: ['the bank'], gloss: { es: ['el banco'], fr: ['la banque'], it: ['la banca'], pt: ['o banco'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v177', de: 'die Post', en: ['the post office'], gloss: { es: ['la oficina de correos'], fr: ['la poste'], it: ['la posta'], pt: ['o correio'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v178', de: 'der Markt', en: ['the market'], gloss: { es: ['el mercado'], fr: ['le marché'], it: ['il mercato'], pt: ['o mercado'] }, pos: 'noun', level: 'A1', category: 'places' },
  { id: 'v179', de: 'das Zimmer', en: ['the room'], gloss: { es: ['la habitación'], fr: ['la chambre'], it: ['la stanza'], pt: ['o quarto'] }, pos: 'noun', level: 'A1', category: 'places' },

  // ── more time ─────────────────────────────────────────────────────────
  { id: 'v180', de: 'der Monat', en: ['the month'], gloss: { es: ['el mes'], fr: ['le mois'], it: ['il mese'], pt: ['o mês'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'v181', de: 'die Stunde', en: ['the hour'], gloss: { es: ['la hora'], fr: ['l’heure'], it: ['l’ora'], pt: ['a hora'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'v182', de: 'die Minute', en: ['the minute'], gloss: { es: ['el minuto'], fr: ['la minute'], it: ['il minuto'], pt: ['o minuto'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'v183', de: 'der Abend', en: ['the evening'], gloss: { es: ['la tarde', 'la noche'], fr: ['le soir'], it: ['la sera'], pt: ['a noite'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'v184', de: 'der Montag', en: ['Monday'], gloss: { es: ['el lunes'], fr: ['le lundi'], it: ['il lunedì'], pt: ['a segunda-feira'] }, pos: 'noun', level: 'A1', category: 'time' },
  { id: 'v185', de: 'das Wochenende', en: ['the weekend'], gloss: { es: ['el fin de semana'], fr: ['le week-end'], it: ['il fine settimana'], pt: ['o fim de semana'] }, pos: 'noun', level: 'A1', category: 'time' },

  // ── more verbs ────────────────────────────────────────────────────────
  { id: 'v186', de: 'geben', en: ['to give'], gloss: { es: ['dar'], fr: ['donner'], it: ['dare'], pt: ['dar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v187', de: 'nehmen', en: ['to take'], gloss: { es: ['tomar', 'coger'], fr: ['prendre'], it: ['prendere'], pt: ['pegar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v188', de: 'finden', en: ['to find'], gloss: { es: ['encontrar'], fr: ['trouver'], it: ['trovare'], pt: ['encontrar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v189', de: 'sagen', en: ['to say'], gloss: { es: ['decir'], fr: ['dire'], it: ['dire'], pt: ['dizer'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v190', de: 'fragen', en: ['to ask'], gloss: { es: ['preguntar'], fr: ['demander'], it: ['chiedere'], pt: ['perguntar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v191', de: 'spielen', en: ['to play'], gloss: { es: ['jugar'], fr: ['jouer'], it: ['giocare'], pt: ['jogar', 'brincar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v192', de: 'kochen', en: ['to cook'], gloss: { es: ['cocinar'], fr: ['cuisiner'], it: ['cucinare'], pt: ['cozinhar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v193', de: 'öffnen', en: ['to open'], gloss: { es: ['abrir'], fr: ['ouvrir'], it: ['aprire'], pt: ['abrir'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v194', de: 'warten', en: ['to wait'], gloss: { es: ['esperar'], fr: ['attendre'], it: ['aspettare'], pt: ['esperar'] }, pos: 'verb', level: 'A1', category: 'verbs' },
  { id: 'v195', de: 'bezahlen', en: ['to pay'], gloss: { es: ['pagar'], fr: ['payer'], it: ['pagare'], pt: ['pagar'] }, pos: 'verb', level: 'A1', category: 'verbs' },

  // ── more adjectives ───────────────────────────────────────────────────
  { id: 'v196', de: 'jung', en: ['young'], gloss: { es: ['joven'], fr: ['jeune'], it: ['giovane'], pt: ['jovem'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v197', de: 'lang', en: ['long'], gloss: { es: ['largo'], fr: ['long'], it: ['lungo'], pt: ['longo'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v198', de: 'kurz', en: ['short'], gloss: { es: ['corto'], fr: ['court'], it: ['corto'], pt: ['curto'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v199', de: 'hungrig', en: ['hungry'], gloss: { es: ['hambriento'], fr: ['affamé'], it: ['affamato'], pt: ['com fome'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v200', de: 'durstig', en: ['thirsty'], gloss: { es: ['sediento'], fr: ['assoiffé'], it: ['assetato'], pt: ['com sede'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v201', de: 'laut', en: ['loud'], gloss: { es: ['ruidoso', 'alto'], fr: ['bruyant', 'fort'], it: ['rumoroso', 'forte'], pt: ['barulhento', 'alto'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v202', de: 'richtig', en: ['correct', 'right'], gloss: { es: ['correcto'], fr: ['correct', 'juste'], it: ['giusto', 'corretto'], pt: ['correto', 'certo'] }, pos: 'adj', level: 'A1', category: 'adjectives' },
  { id: 'v203', de: 'falsch', en: ['wrong'], gloss: { es: ['incorrecto', 'equivocado'], fr: ['faux'], it: ['sbagliato'], pt: ['errado'] }, pos: 'adj', level: 'A1', category: 'adjectives' },

  // ── more people & family ──────────────────────────────────────────────
  { id: 'v204', de: 'der Lehrer', en: ['the teacher (male)'], gloss: { es: ['el profesor'], fr: ['le professeur'], it: ['l’insegnante'], pt: ['o professor'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'v205', de: 'der Sohn', en: ['the son'], gloss: { es: ['el hijo'], fr: ['le fils'], it: ['il figlio'], pt: ['o filho'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'v206', de: 'die Tochter', en: ['the daughter'], gloss: { es: ['la hija'], fr: ['la fille'], it: ['la figlia'], pt: ['a filha'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'v207', de: 'die Großmutter', en: ['the grandmother'], gloss: { es: ['la abuela'], fr: ['la grand-mère'], it: ['la nonna'], pt: ['a avó'] }, pos: 'noun', level: 'A1', category: 'people' },
  { id: 'v208', de: 'der Großvater', en: ['the grandfather'], gloss: { es: ['el abuelo'], fr: ['le grand-père'], it: ['il nonno'], pt: ['o avô'] }, pos: 'noun', level: 'A1', category: 'people' },

  // ── more nature ───────────────────────────────────────────────────────
  { id: 'v209', de: 'der Himmel', en: ['the sky'], gloss: { es: ['el cielo'], fr: ['le ciel'], it: ['il cielo'], pt: ['o céu'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'v210', de: 'der Berg', en: ['the mountain'], gloss: { es: ['la montaña'], fr: ['la montagne'], it: ['la montagna'], pt: ['a montanha'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'v211', de: 'der Fluss', en: ['the river'], gloss: { es: ['el río'], fr: ['la rivière'], it: ['il fiume'], pt: ['o rio'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'v212', de: 'der Vogel', en: ['the bird'], gloss: { es: ['el pájaro'], fr: ['l’oiseau'], it: ['l’uccello'], pt: ['o pássaro'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'v213', de: 'das Pferd', en: ['the horse'], gloss: { es: ['el caballo'], fr: ['le cheval'], it: ['il cavallo'], pt: ['o cavalo'] }, pos: 'noun', level: 'A1', category: 'nature' },
  { id: 'v214', de: 'die Luft', en: ['the air'], gloss: { es: ['el aire'], fr: ['l’air'], it: ['l’aria'], pt: ['o ar'] }, pos: 'noun', level: 'A1', category: 'nature' },
];
