import type { VocabItem } from '@/content/german/types';

// Spanish (Peninsular (Spain)) A2 vocabulary. The `de` field holds the Spanish text
// (see the note in content/german/types.ts). Nouns include the article (el/la).
//
// A2 deliberately does not revisit A1 ground (greetings, family, numbers 1-10,
// basic food, core verbs, basic adjectives, question words). It moves into
// daily routine and reflexives, travel, shopping and money, work and study,
// the body and health, feelings and opinions, the house, clothing, and the
// verbs a learner needs to tell a story in the past.
//
// `gloss` carries the other UI locales: English lives in `en` and is the
// guaranteed fallback; Spanish itself is never glossed, so each item covers
// de / fr / it / pt. Categories stay at 10 items so the multiple-choice
// generator always finds same-category distractors.
//
// Regional line: PENINSULAR SPANISH (Spain), decided deliberately — el billete,
// la patata, el zumo, el salón, enfadado, el móvil, el ordenador, el coche, el
// piso. Do NOT reintroduce Latin American forms; earlier drafts of this pack
// aimed for Peninsular (Spain) neutrality and that policy was replaced.

export const A2_VOCAB: VocabItem[] = [
  // ── daily routine & reflexives ────────────────────────────────────────
  { id: 'es2v001', de: 'despertarse', en: ['to wake up'], gloss: { de: ['aufwachen'], fr: ['se réveiller'], it: ['svegliarsi'], pt: ['acordar'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'es2v002', de: 'levantarse', en: ['to get up'], gloss: { de: ['aufstehen'], fr: ['se lever'], it: ['alzarsi'], pt: ['levantar-se'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'es2v003', de: 'ducharse', en: ['to have a shower'], gloss: { de: ['duschen'], fr: ['se doucher'], it: ['farsi la doccia'], pt: ['tomar banho'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'es2v004', de: 'vestirse', en: ['to get dressed'], gloss: { de: ['sich anziehen'], fr: ['s’habiller'], it: ['vestirsi'], pt: ['vestir-se'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'es2v005', de: 'acostarse', en: ['to go to bed'], gloss: { de: ['ins Bett gehen'], fr: ['se coucher'], it: ['andare a letto'], pt: ['deitar-se'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'es2v006', de: 'desayunar', en: ['to have breakfast'], gloss: { de: ['frühstücken'], fr: ['prendre le petit-déjeuner'], it: ['fare colazione'], pt: ['tomar café da manhã'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'es2v007', de: 'darse prisa', en: ['to hurry up'], gloss: { de: ['sich beeilen'], fr: ['se dépêcher'], it: ['sbrigarsi'], pt: ['apressar-se'] }, pos: 'phrase', level: 'A2', category: 'daily' },
  { id: 'es2v008', de: 'la rutina', en: ['the routine'], gloss: { de: ['die Routine'], fr: ['la routine'], it: ['la routine'], pt: ['a rotina'] }, pos: 'noun', level: 'A2', category: 'daily' },
  { id: 'es2v009', de: 'el despertador', en: ['the alarm clock'], gloss: { de: ['der Wecker'], fr: ['le réveil'], it: ['la sveglia'], pt: ['o despertador'] }, pos: 'noun', level: 'A2', category: 'daily' },
  { id: 'es2v010', de: 'la llave', en: ['the key'], gloss: { de: ['der Schlüssel'], fr: ['la clé'], it: ['la chiave'], pt: ['a chave'] }, pos: 'noun', level: 'A2', category: 'daily' },

  // ── travel & transport ────────────────────────────────────────────────
  { id: 'es2v011', de: 'el aeropuerto', en: ['the airport'], gloss: { de: ['der Flughafen'], fr: ['l’aéroport'], it: ['l’aeroporto'], pt: ['o aeroporto'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'es2v012', de: 'el avión', en: ['the plane'], gloss: { de: ['das Flugzeug'], fr: ['l’avion'], it: ['l’aereo'], pt: ['o avião'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'es2v013', de: 'el tren', en: ['the train'], gloss: { de: ['der Zug'], fr: ['le train'], it: ['il treno'], pt: ['o trem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'es2v014', de: 'el billete', en: ['the ticket'], gloss: { de: ['die Fahrkarte'], fr: ['le billet'], it: ['il biglietto'], pt: ['a passagem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'es2v015', de: 'la maleta', en: ['the suitcase'], gloss: { de: ['der Koffer'], fr: ['la valise'], it: ['la valigia'], pt: ['a mala'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'es2v016', de: 'el viaje', en: ['the trip', 'the journey'], gloss: { de: ['die Reise'], fr: ['le voyage'], it: ['il viaggio'], pt: ['a viagem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'es2v017', de: 'el hotel', en: ['the hotel'], gloss: { de: ['das Hotel'], fr: ['l’hôtel'], it: ['l’hotel'], pt: ['o hotel'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'es2v018', de: 'la habitación', en: ['the room'], gloss: { de: ['das Zimmer'], fr: ['la chambre'], it: ['la camera'], pt: ['o quarto'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'es2v019', de: 'el pasaporte', en: ['the passport'], gloss: { de: ['der Reisepass'], fr: ['le passeport'], it: ['il passaporto'], pt: ['o passaporte'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'es2v020', de: 'viajar', en: ['to travel'], gloss: { de: ['reisen'], fr: ['voyager'], it: ['viaggiare'], pt: ['viajar'] }, pos: 'verb', level: 'A2', category: 'travel' },

  // ── shopping, money & clothing ────────────────────────────────────────
  { id: 'es2v021', de: 'el dinero', en: ['the money'], gloss: { de: ['das Geld'], fr: ['l’argent'], it: ['i soldi'], pt: ['o dinheiro'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'es2v022', de: 'el precio', en: ['the price'], gloss: { de: ['der Preis'], fr: ['le prix'], it: ['il prezzo'], pt: ['o preço'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'es2v023', de: 'la tarjeta', en: ['the card'], gloss: { de: ['die Karte'], fr: ['la carte'], it: ['la carta'], pt: ['o cartão'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'es2v024', de: 'el supermercado', en: ['the supermarket'], gloss: { de: ['der Supermarkt'], fr: ['le supermarché'], it: ['il supermercato'], pt: ['o supermercado'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'es2v025', de: 'el descuento', en: ['the discount'], gloss: { de: ['der Rabatt'], fr: ['la réduction'], it: ['lo sconto'], pt: ['o desconto'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'es2v026', de: 'la talla', en: ['the size'], gloss: { de: ['die Größe'], fr: ['la taille'], it: ['la taglia'], pt: ['o tamanho'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'es2v027', de: 'la ropa', en: ['the clothes'], gloss: { de: ['die Kleidung'], fr: ['les vêtements'], it: ['i vestiti'], pt: ['a roupa'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'es2v028', de: 'los zapatos', en: ['the shoes'], gloss: { de: ['die Schuhe'], fr: ['les chaussures'], it: ['le scarpe'], pt: ['os sapatos'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'es2v029', de: 'pagar', en: ['to pay'], gloss: { de: ['bezahlen'], fr: ['payer'], it: ['pagare'], pt: ['pagar'] }, pos: 'verb', level: 'A2', category: 'shopping' },
  { id: 'es2v030', de: 'costar', en: ['to cost'], gloss: { de: ['kosten'], fr: ['coûter'], it: ['costare'], pt: ['custar'] }, pos: 'verb', level: 'A2', category: 'shopping' },

  // ── work & study ──────────────────────────────────────────────────────
  { id: 'es2v031', de: 'la oficina', en: ['the office'], gloss: { de: ['das Büro'], fr: ['le bureau'], it: ['l’ufficio'], pt: ['o escritório'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'es2v032', de: 'la empresa', en: ['the company'], gloss: { de: ['die Firma'], fr: ['l’entreprise'], it: ['l’azienda'], pt: ['a empresa'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'es2v033', de: 'la reunión', en: ['the meeting'], gloss: { de: ['die Besprechung'], fr: ['la réunion'], it: ['la riunione'], pt: ['a reunião'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'es2v034', de: 'el jefe', en: ['the boss'], gloss: { de: ['der Chef'], fr: ['le patron'], it: ['il capo'], pt: ['o chefe'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'es2v035', de: 'el sueldo', en: ['the salary'], gloss: { de: ['das Gehalt'], fr: ['le salaire'], it: ['lo stipendio'], pt: ['o salário'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'es2v036', de: 'el compañero', en: ['the colleague', 'the classmate'], gloss: { de: ['der Kollege'], fr: ['le collègue'], it: ['il collega'], pt: ['o colega'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'es2v037', de: 'la universidad', en: ['the university'], gloss: { de: ['die Universität'], fr: ['l’université'], it: ['l’università'], pt: ['a universidade'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'es2v038', de: 'el examen', en: ['the exam'], gloss: { de: ['die Prüfung'], fr: ['l’examen'], it: ['l’esame'], pt: ['o exame'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'es2v039', de: 'la entrevista', en: ['the interview'], gloss: { de: ['das Vorstellungsgespräch'], fr: ['l’entretien'], it: ['il colloquio'], pt: ['a entrevista'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'es2v040', de: 'estudiar', en: ['to study'], gloss: { de: ['lernen', 'studieren'], fr: ['étudier'], it: ['studiare'], pt: ['estudar'] }, pos: 'verb', level: 'A2', category: 'work' },

  // ── health & body ─────────────────────────────────────────────────────
  { id: 'es2v041', de: 'el cuerpo', en: ['the body'], gloss: { de: ['der Körper'], fr: ['le corps'], it: ['il corpo'], pt: ['o corpo'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'es2v042', de: 'la cabeza', en: ['the head'], gloss: { de: ['der Kopf'], fr: ['la tête'], it: ['la testa'], pt: ['a cabeça'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'es2v043', de: 'la mano', en: ['the hand'], gloss: { de: ['die Hand'], fr: ['la main'], it: ['la mano'], pt: ['a mão'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'es2v044', de: 'el pie', en: ['the foot'], gloss: { de: ['der Fuß'], fr: ['le pied'], it: ['il piede'], pt: ['o pé'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'es2v045', de: 'la espalda', en: ['the back'], gloss: { de: ['der Rücken'], fr: ['le dos'], it: ['la schiena'], pt: ['as costas'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'es2v046', de: 'el estómago', en: ['the stomach'], gloss: { de: ['der Magen'], fr: ['l’estomac'], it: ['lo stomaco'], pt: ['o estômago'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'es2v047', de: 'el médico', en: ['the doctor'], gloss: { de: ['der Arzt'], fr: ['le médecin'], it: ['il medico'], pt: ['o médico'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'es2v048', de: 'el hospital', en: ['the hospital'], gloss: { de: ['das Krankenhaus'], fr: ['l’hôpital'], it: ['l’ospedale'], pt: ['o hospital'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'es2v049', de: 'la fiebre', en: ['the fever'], gloss: { de: ['das Fieber'], fr: ['la fièvre'], it: ['la febbre'], pt: ['a febre'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'es2v050', de: 'el dolor', en: ['the pain', 'the ache'], gloss: { de: ['der Schmerz'], fr: ['la douleur'], it: ['il dolore'], pt: ['a dor'] }, pos: 'noun', level: 'A2', category: 'health' },

  // ── feelings & opinions ───────────────────────────────────────────────
  { id: 'es2v051', de: 'feliz', en: ['happy'], gloss: { de: ['glücklich'], fr: ['heureux'], it: ['felice'], pt: ['feliz'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'es2v052', de: 'triste', en: ['sad'], gloss: { de: ['traurig'], fr: ['triste'], it: ['triste'], pt: ['triste'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'es2v053', de: 'enfadado', en: ['angry'], gloss: { de: ['wütend'], fr: ['en colère'], it: ['arrabbiato'], pt: ['bravo'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'es2v054', de: 'nervioso', en: ['nervous'], gloss: { de: ['nervös'], fr: ['nerveux'], it: ['nervoso'], pt: ['nervoso'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'es2v055', de: 'tranquilo', en: ['calm'], gloss: { de: ['ruhig'], fr: ['calme'], it: ['tranquillo'], pt: ['tranquilo'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'es2v056', de: 'preocupado', en: ['worried'], gloss: { de: ['besorgt'], fr: ['inquiet'], it: ['preoccupato'], pt: ['preocupado'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'es2v057', de: 'aburrido', en: ['bored', 'boring'], gloss: { de: ['gelangweilt', 'langweilig'], fr: ['ennuyé', 'ennuyeux'], it: ['annoiato', 'noioso'], pt: ['entediado', 'chato'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'es2v058', de: 'sorprendido', en: ['surprised'], gloss: { de: ['überrascht'], fr: ['surpris'], it: ['sorpreso'], pt: ['surpreso'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'es2v059', de: 'el miedo', en: ['the fear'], gloss: { de: ['die Angst'], fr: ['la peur'], it: ['la paura'], pt: ['o medo'] }, pos: 'noun', level: 'A2', category: 'feelings' },
  { id: 'es2v060', de: 'sentirse', en: ['to feel'], gloss: { de: ['sich fühlen'], fr: ['se sentir'], it: ['sentirsi'], pt: ['sentir-se'] }, pos: 'verb', level: 'A2', category: 'feelings' },

  // ── house & furniture ─────────────────────────────────────────────────
  { id: 'es2v061', de: 'el apartamento', en: ['the flat', 'the flat'], gloss: { de: ['die Wohnung'], fr: ['l’appartement'], it: ['l’appartamento'], pt: ['o apartamento'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'es2v062', de: 'la cocina', en: ['the kitchen'], gloss: { de: ['die Küche'], fr: ['la cuisine'], it: ['la cucina'], pt: ['a cozinha'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'es2v063', de: 'el dormitorio', en: ['the bedroom'], gloss: { de: ['das Schlafzimmer'], fr: ['la chambre à coucher'], it: ['la camera da letto'], pt: ['o quarto'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'es2v064', de: 'el salón', en: ['the living room'], gloss: { de: ['das Wohnzimmer'], fr: ['le salon'], it: ['il soggiorno'], pt: ['a sala'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'es2v065', de: 'la mesa', en: ['the table'], gloss: { de: ['der Tisch'], fr: ['la table'], it: ['il tavolo'], pt: ['a mesa'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'es2v066', de: 'la silla', en: ['the chair'], gloss: { de: ['der Stuhl'], fr: ['la chaise'], it: ['la sedia'], pt: ['a cadeira'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'es2v067', de: 'la cama', en: ['the bed'], gloss: { de: ['das Bett'], fr: ['le lit'], it: ['il letto'], pt: ['a cama'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'es2v068', de: 'el armario', en: ['the wardrobe', 'the wardrobe'], gloss: { de: ['der Schrank'], fr: ['l’armoire'], it: ['l’armadio'], pt: ['o armário'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'es2v069', de: 'la ventana', en: ['the window'], gloss: { de: ['das Fenster'], fr: ['la fenêtre'], it: ['la finestra'], pt: ['a janela'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'es2v070', de: 'la puerta', en: ['the door'], gloss: { de: ['die Tür'], fr: ['la porte'], it: ['la porta'], pt: ['a porta'] }, pos: 'noun', level: 'A2', category: 'home' },

  // ── meals & cooking ───────────────────────────────────────────────────
  { id: 'es2v071', de: 'el desayuno', en: ['the breakfast'], gloss: { de: ['das Frühstück'], fr: ['le petit-déjeuner'], it: ['la colazione'], pt: ['o café da manhã'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'es2v072', de: 'el almuerzo', en: ['the lunch'], gloss: { de: ['das Mittagessen'], fr: ['le déjeuner'], it: ['il pranzo'], pt: ['o almoço'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'es2v073', de: 'la cena', en: ['the dinner'], gloss: { de: ['das Abendessen'], fr: ['le dîner'], it: ['la cena'], pt: ['o jantar'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'es2v074', de: 'el arroz', en: ['the rice'], gloss: { de: ['der Reis'], fr: ['le riz'], it: ['il riso'], pt: ['o arroz'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'es2v075', de: 'la verdura', en: ['the vegetables'], gloss: { de: ['das Gemüse'], fr: ['les légumes'], it: ['la verdura'], pt: ['a verdura'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'es2v076', de: 'el queso', en: ['the cheese'], gloss: { de: ['der Käse'], fr: ['le fromage'], it: ['il formaggio'], pt: ['o queijo'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'es2v077', de: 'el postre', en: ['the dessert'], gloss: { de: ['der Nachtisch'], fr: ['le dessert'], it: ['il dolce'], pt: ['a sobremesa'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'es2v078', de: 'la sal', en: ['the salt'], gloss: { de: ['das Salz'], fr: ['le sel'], it: ['il sale'], pt: ['o sal'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'es2v079', de: 'la propina', en: ['the tip'], gloss: { de: ['das Trinkgeld'], fr: ['le pourboire'], it: ['la mancia'], pt: ['a gorjeta'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'es2v080', de: 'cocinar', en: ['to cook'], gloss: { de: ['kochen'], fr: ['cuisiner'], it: ['cucinare'], pt: ['cozinhar'] }, pos: 'verb', level: 'A2', category: 'food' },

  // ── time & frequency ──────────────────────────────────────────────────
  { id: 'es2v081', de: 'el mes', en: ['the month'], gloss: { de: ['der Monat'], fr: ['le mois'], it: ['il mese'], pt: ['o mês'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'es2v082', de: 'la hora', en: ['the hour'], gloss: { de: ['die Stunde'], fr: ['l’heure'], it: ['l’ora'], pt: ['a hora'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'es2v083', de: 'el fin de semana', en: ['the weekend'], gloss: { de: ['das Wochenende'], fr: ['le week-end'], it: ['il fine settimana'], pt: ['o fim de semana'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'es2v084', de: 'anoche', en: ['last night'], gloss: { de: ['gestern Abend'], fr: ['hier soir'], it: ['ieri sera'], pt: ['ontem à noite'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'es2v085', de: 'luego', en: ['later', 'then'], gloss: { de: ['später'], fr: ['ensuite'], it: ['poi'], pt: ['depois'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'es2v086', de: 'temprano', en: ['early'], gloss: { de: ['früh'], fr: ['tôt'], it: ['presto'], pt: ['cedo'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'es2v087', de: 'tarde', en: ['late'], gloss: { de: ['spät'], fr: ['tard'], it: ['tardi'], pt: ['tarde'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'es2v088', de: 'a menudo', en: ['often'], gloss: { de: ['oft'], fr: ['souvent'], it: ['spesso'], pt: ['muitas vezes'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'es2v089', de: 'a veces', en: ['sometimes'], gloss: { de: ['manchmal'], fr: ['parfois'], it: ['a volte'], pt: ['às vezes'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'es2v090', de: 'todavía', en: ['still', 'yet'], gloss: { de: ['noch'], fr: ['encore'], it: ['ancora'], pt: ['ainda'] }, pos: 'adv', level: 'A2', category: 'time' },

  // ── verbs for telling a story ─────────────────────────────────────────
  { id: 'es2v091', de: 'salir', en: ['to leave', 'to go out'], gloss: { de: ['ausgehen', 'weggehen'], fr: ['sortir'], it: ['uscire'], pt: ['sair'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v092', de: 'llegar', en: ['to arrive'], gloss: { de: ['ankommen'], fr: ['arriver'], it: ['arrivare'], pt: ['chegar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v093', de: 'volver', en: ['to return', 'to come back'], gloss: { de: ['zurückkommen'], fr: ['revenir'], it: ['tornare'], pt: ['voltar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v094', de: 'empezar', en: ['to start', 'to begin'], gloss: { de: ['anfangen'], fr: ['commencer'], it: ['cominciare'], pt: ['começar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v095', de: 'terminar', en: ['to finish', 'to end'], gloss: { de: ['beenden'], fr: ['terminer'], it: ['finire'], pt: ['terminar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v096', de: 'encontrar', en: ['to find'], gloss: { de: ['finden'], fr: ['trouver'], it: ['trovare'], pt: ['encontrar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v097', de: 'olvidar', en: ['to forget'], gloss: { de: ['vergessen'], fr: ['oublier'], it: ['dimenticare'], pt: ['esquecer'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v098', de: 'ayudar', en: ['to help'], gloss: { de: ['helfen'], fr: ['aider'], it: ['aiutare'], pt: ['ajudar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v099', de: 'esperar', en: ['to wait', 'to hope'], gloss: { de: ['warten'], fr: ['attendre'], it: ['aspettare'], pt: ['esperar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v100', de: 'conocer', en: ['to know', 'to meet'], gloss: { de: ['kennen'], fr: ['connaître'], it: ['conoscere'], pt: ['conhecer'] }, pos: 'verb', level: 'A2', category: 'verbs' },

  // ── adjectives & comparisons ──────────────────────────────────────────
  { id: 'es2v101', de: 'mejor', en: ['better'], gloss: { de: ['besser'], fr: ['meilleur'], it: ['migliore'], pt: ['melhor'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'es2v102', de: 'peor', en: ['worse'], gloss: { de: ['schlechter'], fr: ['pire'], it: ['peggiore'], pt: ['pior'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'es2v103', de: 'rápido', en: ['fast', 'quick'], gloss: { de: ['schnell'], fr: ['rapide'], it: ['veloce'], pt: ['rápido'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'es2v104', de: 'lento', en: ['slow'], gloss: { de: ['langsam'], fr: ['lent'], it: ['lento'], pt: ['lento'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'es2v105', de: 'limpio', en: ['clean'], gloss: { de: ['sauber'], fr: ['propre'], it: ['pulito'], pt: ['limpo'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'es2v106', de: 'sucio', en: ['dirty'], gloss: { de: ['schmutzig'], fr: ['sale'], it: ['sporco'], pt: ['sujo'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'es2v107', de: 'lleno', en: ['full'], gloss: { de: ['voll'], fr: ['plein'], it: ['pieno'], pt: ['cheio'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'es2v108', de: 'vacío', en: ['empty'], gloss: { de: ['leer'], fr: ['vide'], it: ['vuoto'], pt: ['vazio'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'es2v109', de: 'ocupado', en: ['busy'], gloss: { de: ['beschäftigt'], fr: ['occupé'], it: ['occupato'], pt: ['ocupado'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'es2v110', de: 'largo', en: ['long'], gloss: { de: ['lang'], fr: ['long'], it: ['lungo'], pt: ['comprido'] }, pos: 'adj', level: 'A2', category: 'adjectives' },

  // ── the city & getting around ─────────────────────────────────────────
  { id: 'es2v111', de: 'la parada', en: ['the stop'], gloss: { de: ['die Haltestelle'], fr: ['l’arrêt'], it: ['la fermata'], pt: ['a parada'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'es2v112', de: 'el autobús', en: ['the bus'], gloss: { de: ['der Bus'], fr: ['le bus'], it: ['l’autobus'], pt: ['o ônibus'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'es2v113', de: 'el metro', en: ['the underground', 'the subway'], gloss: { de: ['die U-Bahn'], fr: ['le métro'], it: ['la metropolitana'], pt: ['o metrô'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'es2v114', de: 'el semáforo', en: ['the traffic light'], gloss: { de: ['die Ampel'], fr: ['le feu'], it: ['il semaforo'], pt: ['o semáforo'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'es2v115', de: 'la esquina', en: ['the corner'], gloss: { de: ['die Ecke'], fr: ['le coin'], it: ['l’angolo'], pt: ['a esquina'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'es2v116', de: 'el puente', en: ['the bridge'], gloss: { de: ['die Brücke'], fr: ['le pont'], it: ['il ponte'], pt: ['a ponte'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'es2v117', de: 'la acera', en: ['the pavement', 'the sidewalk'], gloss: { de: ['der Bürgersteig'], fr: ['le trottoir'], it: ['il marciapiede'], pt: ['a calçada'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'es2v118', de: 'el barrio', en: ['the neighbourhood'], gloss: { de: ['das Viertel'], fr: ['le quartier'], it: ['il quartiere'], pt: ['o bairro'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'es2v119', de: 'el ayuntamiento', en: ['the town hall'], gloss: { de: ['das Rathaus'], fr: ['la mairie'], it: ['il municipio'], pt: ['a prefeitura'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'es2v120', de: 'el aparcamiento', en: ['the car park', 'the parking'], gloss: { de: ['der Parkplatz'], fr: ['le parking'], it: ['il parcheggio'], pt: ['o estacionamento'] }, pos: 'noun', level: 'A2', category: 'city' },

  // ── technology & communication ────────────────────────────────────────
  { id: 'es2v121', de: 'el correo electrónico', en: ['the email'], gloss: { de: ['die E-Mail'], fr: ['le courriel'], it: ['l’email'], pt: ['o e-mail'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'es2v122', de: 'la contraseña', en: ['the password'], gloss: { de: ['das Passwort'], fr: ['le mot de passe'], it: ['la password'], pt: ['a senha'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'es2v123', de: 'la pantalla', en: ['the screen'], gloss: { de: ['der Bildschirm'], fr: ['l’écran'], it: ['lo schermo'], pt: ['a tela'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'es2v124', de: 'el teclado', en: ['the keyboard'], gloss: { de: ['die Tastatur'], fr: ['le clavier'], it: ['la tastiera'], pt: ['o teclado'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'es2v125', de: 'el archivo', en: ['the file'], gloss: { de: ['die Datei'], fr: ['le fichier'], it: ['il file'], pt: ['o arquivo'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'es2v126', de: 'la aplicación', en: ['the app'], gloss: { de: ['die App'], fr: ['l’application'], it: ['l’applicazione'], pt: ['o aplicativo'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'es2v127', de: 'la llamada', en: ['the call'], gloss: { de: ['der Anruf'], fr: ['l’appel'], it: ['la chiamata'], pt: ['a ligação'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'es2v128', de: 'el mensaje', en: ['the message'], gloss: { de: ['die Nachricht'], fr: ['le message'], it: ['il messaggio'], pt: ['a mensagem'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'es2v129', de: 'descargar', en: ['to download'], gloss: { de: ['herunterladen'], fr: ['télécharger'], it: ['scaricare'], pt: ['baixar'] }, pos: 'verb', level: 'A2', category: 'technology' },
  { id: 'es2v130', de: 'enviar', en: ['to send'], gloss: { de: ['senden'], fr: ['envoyer'], it: ['inviare'], pt: ['enviar'] }, pos: 'verb', level: 'A2', category: 'technology' },

  // ── nature & weather ──────────────────────────────────────────────────
  { id: 'es2v131', de: 'el tiempo', en: ['the weather'], gloss: { de: ['das Wetter'], fr: ['le temps'], it: ['il tempo'], pt: ['o tempo'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'es2v132', de: 'la lluvia', en: ['the rain'], gloss: { de: ['der Regen'], fr: ['la pluie'], it: ['la pioggia'], pt: ['a chuva'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'es2v133', de: 'la nieve', en: ['the snow'], gloss: { de: ['der Schnee'], fr: ['la neige'], it: ['la neve'], pt: ['a neve'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'es2v134', de: 'el viento', en: ['the wind'], gloss: { de: ['der Wind'], fr: ['le vent'], it: ['il vento'], pt: ['o vento'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'es2v135', de: 'la nube', en: ['the cloud'], gloss: { de: ['die Wolke'], fr: ['le nuage'], it: ['la nuvola'], pt: ['a nuvem'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'es2v136', de: 'el sol', en: ['the sun'], gloss: { de: ['die Sonne'], fr: ['le soleil'], it: ['il sole'], pt: ['o sol'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'es2v137', de: 'el árbol', en: ['the tree'], gloss: { de: ['der Baum'], fr: ['l’arbre'], it: ['l’albero'], pt: ['a árvore'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'es2v138', de: 'la montaña', en: ['the mountain'], gloss: { de: ['der Berg'], fr: ['la montagne'], it: ['la montagna'], pt: ['a montanha'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'es2v139', de: 'el río', en: ['the river'], gloss: { de: ['der Fluss'], fr: ['la rivière'], it: ['il fiume'], pt: ['o rio'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'es2v140', de: 'el campo', en: ['the countryside'], gloss: { de: ['das Land'], fr: ['la campagne'], it: ['la campagna'], pt: ['o campo'] }, pos: 'noun', level: 'A2', category: 'nature' },

  // ── free time & sport ─────────────────────────────────────────────────
  { id: 'es2v141', de: 'el deporte', en: ['the sport'], gloss: { de: ['der Sport'], fr: ['le sport'], it: ['lo sport'], pt: ['o esporte'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'es2v142', de: 'el partido', en: ['the match', 'the game'], gloss: { de: ['das Spiel'], fr: ['le match'], it: ['la partita'], pt: ['a partida'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'es2v143', de: 'el equipo', en: ['the team'], gloss: { de: ['die Mannschaft'], fr: ['l’équipe'], it: ['la squadra'], pt: ['a equipe'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'es2v144', de: 'la piscina', en: ['the swimming pool'], gloss: { de: ['das Schwimmbad'], fr: ['la piscine'], it: ['la piscina'], pt: ['a piscina'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'es2v145', de: 'el gimnasio', en: ['the gym'], gloss: { de: ['das Fitnessstudio'], fr: ['la salle de sport'], it: ['la palestra'], pt: ['a academia'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'es2v146', de: 'la película', en: ['the film', 'the movie'], gloss: { de: ['der Film'], fr: ['le film'], it: ['il film'], pt: ['o filme'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'es2v147', de: 'la entrada', en: ['the admission ticket'], gloss: { de: ['die Eintrittskarte'], fr: ['le billet d’entrée'], it: ['il biglietto d’ingresso'], pt: ['o ingresso'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'es2v148', de: 'el concierto', en: ['the concert'], gloss: { de: ['das Konzert'], fr: ['le concert'], it: ['il concerto'], pt: ['o show'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'es2v149', de: 'nadar', en: ['to swim'], gloss: { de: ['schwimmen'], fr: ['nager'], it: ['nuotare'], pt: ['nadar'] }, pos: 'verb', level: 'A2', category: 'leisure' },
  { id: 'es2v150', de: 'correr', en: ['to run'], gloss: { de: ['laufen'], fr: ['courir'], it: ['correre'], pt: ['correr'] }, pos: 'verb', level: 'A2', category: 'leisure' },

  // ── more everyday verbs ───────────────────────────────────────────────
  { id: 'es2v151', de: 'dejar', en: ['to leave (behind)', 'to let'], gloss: { de: ['lassen'], fr: ['laisser'], it: ['lasciare'], pt: ['deixar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v152', de: 'llevar', en: ['to carry', 'to take'], gloss: { de: ['tragen'], fr: ['porter'], it: ['portare'], pt: ['levar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v153', de: 'recoger', en: ['to pick up', 'to collect'], gloss: { de: ['abholen'], fr: ['récupérer'], it: ['ritirare'], pt: ['recolher'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v154', de: 'poner', en: ['to put'], gloss: { de: ['stellen'], fr: ['mettre'], it: ['mettere'], pt: ['pôr'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v155', de: 'seguir', en: ['to follow', 'to carry on'], gloss: { de: ['folgen'], fr: ['suivre'], it: ['seguire'], pt: ['seguir'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v156', de: 'cambiar', en: ['to change'], gloss: { de: ['ändern'], fr: ['changer'], it: ['cambiare'], pt: ['mudar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v157', de: 'intentar', en: ['to try'], gloss: { de: ['versuchen'], fr: ['essayer'], it: ['provare'], pt: ['tentar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v158', de: 'decidir', en: ['to decide'], gloss: { de: ['entscheiden'], fr: ['décider'], it: ['decidere'], pt: ['decidir'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v159', de: 'recordar', en: ['to remember'], gloss: { de: ['sich erinnern'], fr: ['se souvenir'], it: ['ricordare'], pt: ['lembrar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'es2v160', de: 'prestar', en: ['to lend'], gloss: { de: ['leihen'], fr: ['prêter'], it: ['prestare'], pt: ['emprestar'] }, pos: 'verb', level: 'A2', category: 'verbs' },

  // ── people & relationships ────────────────────────────────────────────
  { id: 'es2v161', de: 'la pareja', en: ['the partner', 'the couple'], gloss: { de: ['der Partner'], fr: ['le partenaire'], it: ['il partner'], pt: ['o parceiro'] }, pos: 'noun', level: 'A2', category: 'relationships' },
  { id: 'es2v162', de: 'la amistad', en: ['the friendship'], gloss: { de: ['die Freundschaft'], fr: ['l’amitié'], it: ['l’amicizia'], pt: ['a amizade'] }, pos: 'noun', level: 'A2', category: 'relationships' },
  { id: 'es2v163', de: 'el vecino', en: ['the neighbour'], gloss: { de: ['der Nachbar'], fr: ['le voisin'], it: ['il vicino'], pt: ['o vizinho'] }, pos: 'noun', level: 'A2', category: 'relationships' },
  { id: 'es2v164', de: 'la cita', en: ['the appointment', 'the date'], gloss: { de: ['der Termin'], fr: ['le rendez-vous'], it: ['l’appuntamento'], pt: ['o compromisso'] }, pos: 'noun', level: 'A2', category: 'relationships' },
  { id: 'es2v165', de: 'la boda', en: ['the wedding'], gloss: { de: ['die Hochzeit'], fr: ['le mariage'], it: ['il matrimonio'], pt: ['o casamento'] }, pos: 'noun', level: 'A2', category: 'relationships' },
  { id: 'es2v166', de: 'el cumpleaños', en: ['the birthday'], gloss: { de: ['der Geburtstag'], fr: ['l’anniversaire'], it: ['il compleanno'], pt: ['o aniversário'] }, pos: 'noun', level: 'A2', category: 'relationships' },
  { id: 'es2v167', de: 'el regalo', en: ['the present', 'the gift'], gloss: { de: ['das Geschenk'], fr: ['le cadeau'], it: ['il regalo'], pt: ['o presente'] }, pos: 'noun', level: 'A2', category: 'relationships' },
  { id: 'es2v168', de: 'simpático', en: ['nice', 'likeable'], gloss: { de: ['nett'], fr: ['sympathique'], it: ['simpatico'], pt: ['simpático'] }, pos: 'adj', level: 'A2', category: 'relationships' },
  { id: 'es2v169', de: 'amable', en: ['kind', 'friendly'], gloss: { de: ['freundlich'], fr: ['aimable'], it: ['gentile'], pt: ['gentil'] }, pos: 'adj', level: 'A2', category: 'relationships' },
  { id: 'es2v170', de: 'tímido', en: ['shy'], gloss: { de: ['schüchtern'], fr: ['timide'], it: ['timido'], pt: ['tímido'] }, pos: 'adj', level: 'A2', category: 'relationships' },
];
