import type { VocabItem } from '@/content/german/types';

// English A2 vocabulary. The `de` field holds the English text (see the note in
// content/german/types.ts — `de` is the "language being learned" slot regardless
// of pack). Nouns include the article ("the ticket") to mirror the other packs.
//
// A2 deliberately does not revisit A1 ground (greetings, family, numbers 1-10,
// basic food, common places, core verbs, basic adjectives, question words). It
// moves into daily routine, travel and transport, shopping, money and clothing,
// work and study, the body and health, feelings and opinions, the house, and the
// comparatives and irregular past forms a learner needs to tell a story.
//
// As in A1 this pack is the one case where `en` is degenerate: the reading side
// and the target side are the same language. `en` still carries the bare word
// (article stripped) plus a clarifier where a regional variant exists, because
// the type contract guarantees it as the fallback for any locale `gloss` misses.
// An English-UI user is never offered English to learn, so it is not shown.
//
// `gloss` therefore covers ALL five other UI locales — de / es / fr / it / pt.
//
// Regional choices follow A1's neutral-international line: we teach the more
// widely understood form ("the flat", "the pharmacy", "the trousers") and list
// the other in `en` so a correct answer is never marked wrong. Categories stay
// at 10+ items so the multiple-choice generator always finds same-category
// distractors.

export const A2_VOCAB: VocabItem[] = [
  // ── daily routine ─────────────────────────────────────────────────────
  { id: 'en2v001', de: 'to wake up', en: ['to wake up'], gloss: { de: ['aufwachen'], es: ['despertarse'], fr: ['se réveiller'], it: ['svegliarsi'], pt: ['acordar'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'en2v002', de: 'to get up', en: ['to get up'], gloss: { de: ['aufstehen'], es: ['levantarse'], fr: ['se lever'], it: ['alzarsi'], pt: ['levantar-se'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'en2v003', de: 'to have a shower', en: ['to have a shower', 'to have a shower'], gloss: { de: ['duschen'], es: ['ducharse'], fr: ['se doucher'], it: ['farsi la doccia'], pt: ['tomar banho'] }, pos: 'phrase', level: 'A2', category: 'daily' },
  { id: 'en2v004', de: 'to get dressed', en: ['to get dressed'], gloss: { de: ['sich anziehen'], es: ['vestirse'], fr: ['s’habiller'], it: ['vestirsi'], pt: ['vestir-se'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'en2v005', de: 'to brush your teeth', en: ['to brush your teeth'], gloss: { de: ['sich die Zähne putzen'], es: ['lavarse los dientes'], fr: ['se brosser les dents'], it: ['lavarsi i denti'], pt: ['escovar os dentes'] }, pos: 'phrase', level: 'A2', category: 'daily' },
  { id: 'en2v006', de: 'to go to bed', en: ['to go to bed'], gloss: { de: ['ins Bett gehen'], es: ['acostarse'], fr: ['se coucher'], it: ['andare a letto'], pt: ['ir para a cama'] }, pos: 'phrase', level: 'A2', category: 'daily' },
  { id: 'en2v007', de: 'to be late', en: ['to be late'], gloss: { de: ['zu spät kommen'], es: ['llegar tarde'], fr: ['être en retard'], it: ['essere in ritardo'], pt: ['estar atrasado'] }, pos: 'phrase', level: 'A2', category: 'daily' },
  { id: 'en2v008', de: 'the alarm clock', en: ['alarm clock'], gloss: { de: ['der Wecker'], es: ['el despertador'], fr: ['le réveil'], it: ['la sveglia'], pt: ['o despertador'] }, pos: 'noun', level: 'A2', category: 'daily' },
  { id: 'en2v009', de: 'the key', en: ['key'], gloss: { de: ['der Schlüssel'], es: ['la llave'], fr: ['la clé'], it: ['la chiave'], pt: ['a chave'] }, pos: 'noun', level: 'A2', category: 'daily' },
  { id: 'en2v010', de: 'the routine', en: ['routine'], gloss: { de: ['die Routine'], es: ['la rutina'], fr: ['la routine'], it: ['la routine'], pt: ['a rotina'] }, pos: 'noun', level: 'A2', category: 'daily' },

  // ── travel & transport ────────────────────────────────────────────────
  { id: 'en2v011', de: 'the ticket', en: ['ticket'], gloss: { de: ['die Fahrkarte'], es: ['el billete'], fr: ['le billet'], it: ['il biglietto'], pt: ['a passagem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'en2v012', de: 'the airport', en: ['airport'], gloss: { de: ['der Flughafen'], es: ['el aeropuerto'], fr: ['l’aéroport'], it: ['l’aeroporto'], pt: ['o aeroporto'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'en2v013', de: 'the plane', en: ['plane', 'the airplane'], gloss: { de: ['das Flugzeug'], es: ['el avión'], fr: ['l’avion'], it: ['l’aereo'], pt: ['o avião'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'en2v014', de: 'the train', en: ['train'], gloss: { de: ['der Zug'], es: ['el tren'], fr: ['le train'], it: ['il treno'], pt: ['o trem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'en2v015', de: 'the bus', en: ['bus'], gloss: { de: ['der Bus'], es: ['el autobús'], fr: ['le bus'], it: ['l’autobus'], pt: ['o ônibus'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'en2v016', de: 'the suitcase', en: ['suitcase'], gloss: { de: ['der Koffer'], es: ['la maleta'], fr: ['la valise'], it: ['la valigia'], pt: ['a mala'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'en2v017', de: 'the trip', en: ['trip', 'the journey'], gloss: { de: ['die Reise'], es: ['el viaje'], fr: ['le voyage'], it: ['il viaggio'], pt: ['a viagem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'en2v018', de: 'the flight', en: ['flight'], gloss: { de: ['der Flug'], es: ['el vuelo'], fr: ['le vol'], it: ['il volo'], pt: ['o voo'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'en2v019', de: 'the map', en: ['map'], gloss: { de: ['die Karte'], es: ['el mapa'], fr: ['la carte'], it: ['la mappa'], pt: ['o mapa'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'en2v020', de: 'to travel', en: ['to travel'], gloss: { de: ['reisen'], es: ['viajar'], fr: ['voyager'], it: ['viaggiare'], pt: ['viajar'] }, pos: 'verb', level: 'A2', category: 'travel' },

  // ── shopping, money & clothes ─────────────────────────────────────────
  { id: 'en2v021', de: 'the money', en: ['money'], gloss: { de: ['das Geld'], es: ['el dinero'], fr: ['l’argent'], it: ['i soldi'], pt: ['o dinheiro'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'en2v022', de: 'the price', en: ['price'], gloss: { de: ['der Preis'], es: ['el precio'], fr: ['le prix'], it: ['il prezzo'], pt: ['o preço'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'en2v023', de: 'the credit card', en: ['credit card'], gloss: { de: ['die Kreditkarte'], es: ['la tarjeta de crédito'], fr: ['la carte de crédit'], it: ['la carta di credito'], pt: ['o cartão de crédito'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'en2v024', de: 'the size', en: ['size'], gloss: { de: ['die Größe'], es: ['la talla'], fr: ['la taille'], it: ['la taglia'], pt: ['o tamanho'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'en2v025', de: 'to pay', en: ['to pay'], gloss: { de: ['bezahlen'], es: ['pagar'], fr: ['payer'], it: ['pagare'], pt: ['pagar'] }, pos: 'verb', level: 'A2', category: 'shopping' },
  { id: 'en2v026', de: 'to cost', en: ['to cost'], gloss: { de: ['kosten'], es: ['costar'], fr: ['coûter'], it: ['costare'], pt: ['custar'] }, pos: 'verb', level: 'A2', category: 'shopping' },
  { id: 'en2v027', de: 'to try on', en: ['to try on'], gloss: { de: ['anprobieren'], es: ['probarse'], fr: ['essayer'], it: ['provare'], pt: ['experimentar'] }, pos: 'verb', level: 'A2', category: 'shopping' },
  { id: 'en2v028', de: 'the shirt', en: ['shirt'], gloss: { de: ['das Hemd'], es: ['la camisa'], fr: ['la chemise'], it: ['la camicia'], pt: ['a camisa'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'en2v029', de: 'the shoes', en: ['shoes'], gloss: { de: ['die Schuhe'], es: ['los zapatos'], fr: ['les chaussures'], it: ['le scarpe'], pt: ['os sapatos'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'en2v030', de: 'the trousers', en: ['trousers'], gloss: { de: ['die Hose'], es: ['los pantalones'], fr: ['le pantalon'], it: ['i pantaloni'], pt: ['a calça'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'en2v031', de: 'the jacket', en: ['jacket'], gloss: { de: ['die Jacke'], es: ['la chaqueta'], fr: ['la veste'], it: ['la giacca'], pt: ['a jaqueta'] }, pos: 'noun', level: 'A2', category: 'shopping' },

  // ── work & study ──────────────────────────────────────────────────────
  { id: 'en2v032', de: 'the office', en: ['office'], gloss: { de: ['das Büro'], es: ['la oficina'], fr: ['le bureau'], it: ['l’ufficio'], pt: ['o escritório'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'en2v033', de: 'the meeting', en: ['meeting'], gloss: { de: ['die Besprechung'], es: ['la reunión'], fr: ['la réunion'], it: ['la riunione'], pt: ['a reunião'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'en2v034', de: 'the boss', en: ['boss'], gloss: { de: ['der Chef'], es: ['el jefe'], fr: ['le patron'], it: ['il capo'], pt: ['o chefe'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'en2v035', de: 'the company', en: ['company'], gloss: { de: ['die Firma'], es: ['la empresa'], fr: ['l’entreprise'], it: ['l’azienda'], pt: ['a empresa'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'en2v036', de: 'the colleague', en: ['colleague', 'the co-worker'], gloss: { de: ['der Kollege'], es: ['el compañero de trabajo'], fr: ['le collègue'], it: ['il collega'], pt: ['o colega'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'en2v037', de: 'the salary', en: ['salary'], gloss: { de: ['das Gehalt'], es: ['el sueldo'], fr: ['le salaire'], it: ['lo stipendio'], pt: ['o salário'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'en2v038', de: 'the email', en: ['email'], gloss: { de: ['die E-Mail'], es: ['el correo electrónico'], fr: ['l’e-mail'], it: ['l’e-mail'], pt: ['o e-mail'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'en2v039', de: 'the university', en: ['university'], gloss: { de: ['die Universität'], es: ['la universidad'], fr: ['l’université'], it: ['l’università'], pt: ['a universidade'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'en2v040', de: 'the exam', en: ['exam', 'the test'], gloss: { de: ['die Prüfung'], es: ['el examen'], fr: ['l’examen'], it: ['l’esame'], pt: ['a prova', 'o exame'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'en2v041', de: 'to study', en: ['to study'], gloss: { de: ['lernen', 'studieren'], es: ['estudiar'], fr: ['étudier'], it: ['studiare'], pt: ['estudar'] }, pos: 'verb', level: 'A2', category: 'work' },

  // ── health & body ─────────────────────────────────────────────────────
  { id: 'en2v042', de: 'the head', en: ['head'], gloss: { de: ['der Kopf'], es: ['la cabeza'], fr: ['la tête'], it: ['la testa'], pt: ['a cabeça'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'en2v043', de: 'the hand', en: ['hand'], gloss: { de: ['die Hand'], es: ['la mano'], fr: ['la main'], it: ['la mano'], pt: ['a mão'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'en2v044', de: 'the leg', en: ['leg'], gloss: { de: ['das Bein'], es: ['la pierna'], fr: ['la jambe'], it: ['la gamba'], pt: ['a perna'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'en2v045', de: 'the stomach', en: ['stomach'], gloss: { de: ['der Magen'], es: ['el estómago'], fr: ['l’estomac'], it: ['lo stomaco'], pt: ['o estômago'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'en2v046', de: 'the doctor', en: ['doctor'], gloss: { de: ['der Arzt'], es: ['el médico'], fr: ['le médecin'], it: ['il medico'], pt: ['o médico'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'en2v047', de: 'the pharmacy', en: ['pharmacy', 'the chemist'], gloss: { de: ['die Apotheke'], es: ['la farmacia'], fr: ['la pharmacie'], it: ['la farmacia'], pt: ['a farmácia'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'en2v048', de: 'the medicine', en: ['medicine'], gloss: { de: ['das Medikament'], es: ['el medicamento'], fr: ['le médicament'], it: ['la medicina'], pt: ['o remédio'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'en2v049', de: 'the pain', en: ['pain'], gloss: { de: ['der Schmerz'], es: ['el dolor'], fr: ['la douleur'], it: ['il dolore'], pt: ['a dor'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'en2v050', de: 'the appointment', en: ['appointment'], gloss: { de: ['der Termin'], es: ['la cita'], fr: ['le rendez-vous'], it: ['l’appuntamento'], pt: ['a consulta'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'en2v051', de: 'ill', en: ['ill', 'sick'], gloss: { de: ['krank'], es: ['enfermo'], fr: ['malade'], it: ['malato'], pt: ['doente'] }, pos: 'adj', level: 'A2', category: 'health' },
  { id: 'en2v052', de: 'to hurt', en: ['to hurt'], gloss: { de: ['wehtun'], es: ['doler'], fr: ['faire mal'], it: ['fare male'], pt: ['doer'] }, pos: 'verb', level: 'A2', category: 'health' },

  // ── feelings & opinions ───────────────────────────────────────────────
  { id: 'en2v053', de: 'happy', en: ['happy'], gloss: { de: ['glücklich'], es: ['feliz'], fr: ['heureux'], it: ['felice'], pt: ['feliz'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'en2v054', de: 'sad', en: ['sad'], gloss: { de: ['traurig'], es: ['triste'], fr: ['triste'], it: ['triste'], pt: ['triste'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'en2v055', de: 'angry', en: ['angry'], gloss: { de: ['wütend'], es: ['enfadado'], fr: ['en colère'], it: ['arrabbiato'], pt: ['bravo'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'en2v056', de: 'worried', en: ['worried'], gloss: { de: ['besorgt'], es: ['preocupado'], fr: ['inquiet'], it: ['preoccupato'], pt: ['preocupado'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'en2v057', de: 'bored', en: ['bored'], gloss: { de: ['gelangweilt'], es: ['aburrido'], fr: ['ennuyé'], it: ['annoiato'], pt: ['entediado'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'en2v058', de: 'surprised', en: ['surprised'], gloss: { de: ['überrascht'], es: ['sorprendido'], fr: ['surpris'], it: ['sorpreso'], pt: ['surpreso'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'en2v059', de: 'to be afraid', en: ['to be afraid', 'to be scared'], gloss: { de: ['Angst haben'], es: ['tener miedo'], fr: ['avoir peur'], it: ['avere paura'], pt: ['ter medo'] }, pos: 'phrase', level: 'A2', category: 'feelings' },
  { id: 'en2v060', de: 'to feel', en: ['to feel'], gloss: { de: ['sich fühlen'], es: ['sentirse'], fr: ['se sentir'], it: ['sentirsi'], pt: ['sentir-se'] }, pos: 'verb', level: 'A2', category: 'feelings' },
  { id: 'en2v061', de: 'to hope', en: ['to hope'], gloss: { de: ['hoffen'], es: ['esperar'], fr: ['espérer'], it: ['sperare'], pt: ['esperar'] }, pos: 'verb', level: 'A2', category: 'feelings' },
  { id: 'en2v062', de: 'the opinion', en: ['opinion'], gloss: { de: ['die Meinung'], es: ['la opinión'], fr: ['l’avis'], it: ['l’opinione'], pt: ['a opinião'] }, pos: 'noun', level: 'A2', category: 'feelings' },

  // ── house & furniture ─────────────────────────────────────────────────
  { id: 'en2v063', de: 'the flat', en: ['flat', 'the flat'], gloss: { de: ['die Wohnung'], es: ['el apartamento'], fr: ['l’appartement'], it: ['l’appartamento'], pt: ['o apartamento'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'en2v064', de: 'the kitchen', en: ['kitchen'], gloss: { de: ['die Küche'], es: ['la cocina'], fr: ['la cuisine'], it: ['la cucina'], pt: ['a cozinha'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'en2v065', de: 'the bedroom', en: ['bedroom'], gloss: { de: ['das Schlafzimmer'], es: ['el dormitorio'], fr: ['la chambre'], it: ['la camera da letto'], pt: ['o quarto'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'en2v066', de: 'the living room', en: ['living room'], gloss: { de: ['das Wohnzimmer'], es: ['el salón'], fr: ['le salon'], it: ['il soggiorno'], pt: ['a sala'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'en2v067', de: 'the table', en: ['table'], gloss: { de: ['der Tisch'], es: ['la mesa'], fr: ['la table'], it: ['il tavolo'], pt: ['a mesa'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'en2v068', de: 'the chair', en: ['chair'], gloss: { de: ['der Stuhl'], es: ['la silla'], fr: ['la chaise'], it: ['la sedia'], pt: ['a cadeira'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'en2v069', de: 'the bed', en: ['bed'], gloss: { de: ['das Bett'], es: ['la cama'], fr: ['le lit'], it: ['il letto'], pt: ['a cama'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'en2v070', de: 'the window', en: ['window'], gloss: { de: ['das Fenster'], es: ['la ventana'], fr: ['la fenêtre'], it: ['la finestra'], pt: ['a janela'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'en2v071', de: 'the door', en: ['door'], gloss: { de: ['die Tür'], es: ['la puerta'], fr: ['la porte'], it: ['la porta'], pt: ['a porta'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'en2v072', de: 'the garden', en: ['garden', 'the yard'], gloss: { de: ['der Garten'], es: ['el jardín'], fr: ['le jardin'], it: ['il giardino'], pt: ['o jardim'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'en2v073', de: 'the rent', en: ['rent'], gloss: { de: ['die Miete'], es: ['el alquiler'], fr: ['le loyer'], it: ['l’affitto'], pt: ['o aluguel'] }, pos: 'noun', level: 'A2', category: 'home' },

  // ── food & eating out ─────────────────────────────────────────────────
  { id: 'en2v074', de: 'the vegetables', en: ['vegetables'], gloss: { de: ['das Gemüse'], es: ['las verduras'], fr: ['les légumes'], it: ['la verdura'], pt: ['os legumes'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'en2v075', de: 'the rice', en: ['rice'], gloss: { de: ['der Reis'], es: ['el arroz'], fr: ['le riz'], it: ['il riso'], pt: ['o arroz'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'en2v076', de: 'the chicken', en: ['chicken'], gloss: { de: ['das Hähnchen'], es: ['el pollo'], fr: ['le poulet'], it: ['il pollo'], pt: ['o frango'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'en2v077', de: 'the cheese', en: ['cheese'], gloss: { de: ['der Käse'], es: ['el queso'], fr: ['le fromage'], it: ['il formaggio'], pt: ['o queijo'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'en2v078', de: 'the soup', en: ['soup'], gloss: { de: ['die Suppe'], es: ['la sopa'], fr: ['la soupe'], it: ['la zuppa'], pt: ['a sopa'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'en2v079', de: 'the sugar', en: ['sugar'], gloss: { de: ['der Zucker'], es: ['el azúcar'], fr: ['le sucre'], it: ['lo zucchero'], pt: ['o açúcar'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'en2v080', de: 'the salt', en: ['salt'], gloss: { de: ['das Salz'], es: ['la sal'], fr: ['le sel'], it: ['il sale'], pt: ['o sal'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'en2v081', de: 'the dessert', en: ['dessert'], gloss: { de: ['der Nachtisch'], es: ['el postre'], fr: ['le dessert'], it: ['il dolce'], pt: ['a sobremesa'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'en2v082', de: 'the menu', en: ['menu'], gloss: { de: ['die Speisekarte'], es: ['la carta'], fr: ['la carte'], it: ['il menù'], pt: ['o cardápio'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'en2v083', de: 'the waiter', en: ['waiter'], gloss: { de: ['der Kellner'], es: ['el camarero'], fr: ['le serveur'], it: ['il cameriere'], pt: ['o garçom'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'en2v084', de: 'to cook', en: ['to cook'], gloss: { de: ['kochen'], es: ['cocinar'], fr: ['cuisiner'], it: ['cucinare'], pt: ['cozinhar'] }, pos: 'verb', level: 'A2', category: 'food' },
  { id: 'en2v085', de: 'to order', en: ['to order'], gloss: { de: ['bestellen'], es: ['pedir'], fr: ['commander'], it: ['ordinare'], pt: ['pedir'] }, pos: 'verb', level: 'A2', category: 'food' },

  // ── time & frequency ──────────────────────────────────────────────────
  { id: 'en2v086', de: 'the weekend', en: ['weekend'], gloss: { de: ['das Wochenende'], es: ['el fin de semana'], fr: ['le week-end'], it: ['il fine settimana'], pt: ['o fim de semana'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'en2v087', de: 'the month', en: ['month'], gloss: { de: ['der Monat'], es: ['el mes'], fr: ['le mois'], it: ['il mese'], pt: ['o mês'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'en2v088', de: 'the hour', en: ['hour'], gloss: { de: ['die Stunde'], es: ['la hora'], fr: ['l’heure'], it: ['l’ora'], pt: ['a hora'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'en2v089', de: 'the minute', en: ['minute'], gloss: { de: ['die Minute'], es: ['el minuto'], fr: ['la minute'], it: ['il minuto'], pt: ['o minuto'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'en2v090', de: 'the weather', en: ['weather'], gloss: { de: ['das Wetter'], es: ['el tiempo'], fr: ['le temps'], it: ['il tempo'], pt: ['o tempo'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'en2v091', de: 'last week', en: ['last week'], gloss: { de: ['letzte Woche'], es: ['la semana pasada'], fr: ['la semaine dernière'], it: ['la settimana scorsa'], pt: ['a semana passada'] }, pos: 'phrase', level: 'A2', category: 'time' },
  { id: 'en2v092', de: 'next year', en: ['next year'], gloss: { de: ['nächstes Jahr'], es: ['el año que viene'], fr: ['l’année prochaine'], it: ['l’anno prossimo'], pt: ['o ano que vem'] }, pos: 'phrase', level: 'A2', category: 'time' },
  { id: 'en2v093', de: 'often', en: ['often'], gloss: { de: ['oft'], es: ['a menudo'], fr: ['souvent'], it: ['spesso'], pt: ['muitas vezes'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'en2v094', de: 'sometimes', en: ['sometimes'], gloss: { de: ['manchmal'], es: ['a veces'], fr: ['parfois'], it: ['a volte'], pt: ['às vezes'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'en2v095', de: 'early', en: ['early'], gloss: { de: ['früh'], es: ['temprano'], fr: ['tôt'], it: ['presto'], pt: ['cedo'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'en2v096', de: 'already', en: ['already'], gloss: { de: ['schon'], es: ['ya'], fr: ['déjà'], it: ['già'], pt: ['já'] }, pos: 'adv', level: 'A2', category: 'time' },

  // ── verbs (past-simple workhorses) ────────────────────────────────────
  { id: 'en2v097', de: 'to arrive', en: ['to arrive'], gloss: { de: ['ankommen'], es: ['llegar'], fr: ['arriver'], it: ['arrivare'], pt: ['chegar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'en2v098', de: 'to leave', en: ['to leave'], gloss: { de: ['weggehen', 'abfahren'], es: ['salir', 'irse'], fr: ['partir'], it: ['partire'], pt: ['sair', 'partir'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'en2v099', de: 'to take', en: ['to take'], gloss: { de: ['nehmen'], es: ['tomar', 'coger'], fr: ['prendre'], it: ['prendere'], pt: ['pegar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'en2v100', de: 'to forget', en: ['to forget'], gloss: { de: ['vergessen'], es: ['olvidar'], fr: ['oublier'], it: ['dimenticare'], pt: ['esquecer'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'en2v101', de: 'to remember', en: ['to remember'], gloss: { de: ['sich erinnern'], es: ['recordar', 'acordarse'], fr: ['se souvenir'], it: ['ricordare'], pt: ['lembrar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'en2v102', de: 'to bring', en: ['to bring'], gloss: { de: ['mitbringen'], es: ['traer'], fr: ['apporter'], it: ['portare'], pt: ['trazer'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'en2v103', de: 'to send', en: ['to send'], gloss: { de: ['schicken'], es: ['enviar', 'mandar'], fr: ['envoyer'], it: ['mandare'], pt: ['enviar', 'mandar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'en2v104', de: 'to meet', en: ['to meet'], gloss: { de: ['treffen'], es: ['encontrarse con', 'quedar'], fr: ['rencontrer', 'retrouver'], it: ['incontrare'], pt: ['encontrar-se com'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'en2v105', de: 'to help', en: ['to help'], gloss: { de: ['helfen'], es: ['ayudar'], fr: ['aider'], it: ['aiutare'], pt: ['ajudar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'en2v106', de: 'to lose', en: ['to lose'], gloss: { de: ['verlieren'], es: ['perder'], fr: ['perdre'], it: ['perdere'], pt: ['perder'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'en2v107', de: 'to find', en: ['to find'], gloss: { de: ['finden'], es: ['encontrar'], fr: ['trouver'], it: ['trovare'], pt: ['encontrar', 'achar'] }, pos: 'verb', level: 'A2', category: 'verbs' },

  // ── adjectives: comparatives & weather ────────────────────────────────
  { id: 'en2v108', de: 'better', en: ['better'], gloss: { de: ['besser'], es: ['mejor'], fr: ['meilleur', 'mieux'], it: ['migliore'], pt: ['melhor'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'en2v109', de: 'worse', en: ['worse'], gloss: { de: ['schlechter'], es: ['peor'], fr: ['pire'], it: ['peggiore'], pt: ['pior'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'en2v110', de: 'the best', en: ['the best'], gloss: { de: ['der beste'], es: ['el mejor'], fr: ['le meilleur'], it: ['il migliore'], pt: ['o melhor'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'en2v111', de: 'sunny', en: ['sunny'], gloss: { de: ['sonnig'], es: ['soleado'], fr: ['ensoleillé'], it: ['soleggiato'], pt: ['ensolarado'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'en2v112', de: 'cloudy', en: ['cloudy'], gloss: { de: ['bewölkt'], es: ['nublado'], fr: ['nuageux'], it: ['nuvoloso'], pt: ['nublado'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'en2v113', de: 'windy', en: ['windy'], gloss: { de: ['windig'], es: ['ventoso'], fr: ['venteux'], it: ['ventoso'], pt: ['ventoso'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'en2v114', de: 'busy', en: ['busy'], gloss: { de: ['beschäftigt'], es: ['ocupado'], fr: ['occupé'], it: ['occupato'], pt: ['ocupado'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'en2v115', de: 'quiet', en: ['quiet'], gloss: { de: ['ruhig'], es: ['tranquilo'], fr: ['calme'], it: ['tranquillo'], pt: ['tranquilo'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'en2v116', de: 'dangerous', en: ['dangerous'], gloss: { de: ['gefährlich'], es: ['peligroso'], fr: ['dangereux'], it: ['pericoloso'], pt: ['perigoso'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'en2v117', de: 'comfortable', en: ['comfortable'], gloss: { de: ['bequem'], es: ['cómodo'], fr: ['confortable'], it: ['comodo'], pt: ['confortável'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
];
