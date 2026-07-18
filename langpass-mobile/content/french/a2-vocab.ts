import type { VocabItem } from '@/content/german/types';

// French (fr-FR) A2 vocabulary. The `de` field holds the French text (see the
// note in content/german/types.ts). Nouns ship with their article, and the
// elided ones (l’argent, l’hôpital, l’heure) are kept deliberately: elision
// hides gender, which is exactly the thing a learner has to memorise.
//
// A2 does not revisit A1 ground (greetings, family, numbers 1-10, basic food,
// core verbs être/avoir/faire/aller/vouloir/manger/boire/parler/habiter/
// travailler, basic adjectives, question words). It moves into the daily
// routine and reflexive verbs, travel, shopping and money, work and study,
// the body and health, feelings, the house, clothing, and the verbs a learner
// needs to tell a story in the passé composé.
//
// `gloss` carries the other UI locales: English lives in `en` and is the
// guaranteed fallback; French itself is never glossed (a French-UI user is
// never offered French to learn), so each item covers de / es / it / pt.
// Categories stay at 10 items so the multiple-choice generator always finds
// same-category distractors.

export const A2_VOCAB: VocabItem[] = [
  // ── daily routine & reflexives ────────────────────────────────────────
  { id: 'fr2v001', de: 'se réveiller', en: ['to wake up'], gloss: { de: ['aufwachen'], es: ['despertarse'], it: ['svegliarsi'], pt: ['acordar'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'fr2v002', de: 'se lever', en: ['to get up'], gloss: { de: ['aufstehen'], es: ['levantarse'], it: ['alzarsi'], pt: ['levantar-se'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'fr2v003', de: 'se doucher', en: ['to have a shower'], gloss: { de: ['duschen'], es: ['ducharse'], it: ['farsi la doccia'], pt: ['tomar banho'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'fr2v004', de: 's’habiller', en: ['to get dressed'], gloss: { de: ['sich anziehen'], es: ['vestirse'], it: ['vestirsi'], pt: ['vestir-se'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'fr2v005', de: 'se coucher', en: ['to go to bed'], gloss: { de: ['ins Bett gehen'], es: ['acostarse'], it: ['andare a letto'], pt: ['deitar-se'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'fr2v006', de: 'se dépêcher', en: ['to hurry up'], gloss: { de: ['sich beeilen'], es: ['darse prisa'], it: ['sbrigarsi'], pt: ['apressar-se'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'fr2v007', de: 'se brosser les dents', en: ['to brush one’s teeth'], gloss: { de: ['sich die Zähne putzen'], es: ['lavarse los dientes'], it: ['lavarsi i denti'], pt: ['escovar os dentes'] }, pos: 'phrase', level: 'A2', category: 'daily' },
  { id: 'fr2v008', de: 'le réveil', en: ['the alarm clock'], gloss: { de: ['der Wecker'], es: ['el despertador'], it: ['la sveglia'], pt: ['o despertador'] }, pos: 'noun', level: 'A2', category: 'daily' },
  { id: 'fr2v009', de: 'la clé', en: ['the key'], gloss: { de: ['der Schlüssel'], es: ['la llave'], it: ['la chiave'], pt: ['a chave'] }, pos: 'noun', level: 'A2', category: 'daily' },
  { id: 'fr2v010', de: 'la routine', en: ['the routine'], gloss: { de: ['die Routine'], es: ['la rutina'], it: ['la routine'], pt: ['a rotina'] }, pos: 'noun', level: 'A2', category: 'daily' },

  // ── travel & transport ────────────────────────────────────────────────
  { id: 'fr2v011', de: 'l’aéroport', en: ['the airport'], gloss: { de: ['der Flughafen'], es: ['el aeropuerto'], it: ['l’aeroporto'], pt: ['o aeroporto'] }, pos: 'noun', gender: 'm', level: 'A2', category: 'travel' },
  { id: 'fr2v012', de: 'l’avion', en: ['the plane'], gloss: { de: ['das Flugzeug'], es: ['el avión'], it: ['l’aereo'], pt: ['o avião'] }, pos: 'noun', gender: 'm', level: 'A2', category: 'travel' },
  { id: 'fr2v013', de: 'le train', en: ['the train'], gloss: { de: ['der Zug'], es: ['el tren'], it: ['il treno'], pt: ['o trem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'fr2v014', de: 'la voiture', en: ['the car'], gloss: { de: ['das Auto'], es: ['el coche'], it: ['la macchina'], pt: ['o carro'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'fr2v015', de: 'le billet', en: ['the ticket'], gloss: { de: ['die Fahrkarte'], es: ['el billete'], it: ['il biglietto'], pt: ['a passagem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'fr2v016', de: 'la valise', en: ['the suitcase'], gloss: { de: ['der Koffer'], es: ['la maleta'], it: ['la valigia'], pt: ['a mala'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'fr2v017', de: 'le voyage', en: ['the trip', 'the journey'], gloss: { de: ['die Reise'], es: ['el viaje'], it: ['il viaggio'], pt: ['a viagem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'fr2v018', de: 'la chambre', en: ['the room', 'the bedroom'], gloss: { de: ['das Zimmer'], es: ['la habitación'], it: ['la camera'], pt: ['o quarto'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'fr2v019', de: 'le passeport', en: ['the passport'], gloss: { de: ['der Reisepass'], es: ['el pasaporte'], it: ['il passaporto'], pt: ['o passaporte'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'fr2v020', de: 'voyager', en: ['to travel'], gloss: { de: ['reisen'], es: ['viajar'], it: ['viaggiare'], pt: ['viajar'] }, pos: 'verb', level: 'A2', category: 'travel' },

  // ── shopping, money & clothing ────────────────────────────────────────
  { id: 'fr2v021', de: 'l’argent', en: ['the money'], gloss: { de: ['das Geld'], es: ['el dinero'], it: ['i soldi'], pt: ['o dinheiro'] }, pos: 'noun', gender: 'm', level: 'A2', category: 'shopping' },
  { id: 'fr2v022', de: 'le prix', en: ['the price'], gloss: { de: ['der Preis'], es: ['el precio'], it: ['il prezzo'], pt: ['o preço'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'fr2v023', de: 'la carte bancaire', en: ['the bank card'], gloss: { de: ['die Bankkarte'], es: ['la tarjeta bancaria'], it: ['la carta di credito', 'il bancomat'], pt: ['o cartão bancário'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'fr2v024', de: 'le supermarché', en: ['the supermarket'], gloss: { de: ['der Supermarkt'], es: ['el supermercado'], it: ['il supermercato'], pt: ['o supermercado'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'fr2v025', de: 'la réduction', en: ['the discount'], gloss: { de: ['der Rabatt'], es: ['el descuento'], it: ['lo sconto'], pt: ['o desconto'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'fr2v026', de: 'la taille', en: ['the size'], gloss: { de: ['die Größe'], es: ['la talla'], it: ['la taglia'], pt: ['o tamanho'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'fr2v027', de: 'les vêtements', en: ['the clothes'], gloss: { de: ['die Kleidung'], es: ['la ropa'], it: ['i vestiti'], pt: ['a roupa'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'fr2v028', de: 'les chaussures', en: ['the shoes'], gloss: { de: ['die Schuhe'], es: ['los zapatos'], it: ['le scarpe'], pt: ['os sapatos'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'fr2v029', de: 'payer', en: ['to pay'], gloss: { de: ['bezahlen'], es: ['pagar'], it: ['pagare'], pt: ['pagar'] }, pos: 'verb', level: 'A2', category: 'shopping' },
  { id: 'fr2v030', de: 'essayer', en: ['to try', 'to try on'], gloss: { de: ['anprobieren'], es: ['probarse'], it: ['provare'], pt: ['experimentar'] }, pos: 'verb', level: 'A2', category: 'shopping' },

  // ── work & study ──────────────────────────────────────────────────────
  { id: 'fr2v031', de: 'le bureau', en: ['the office', 'the desk'], gloss: { de: ['das Büro'], es: ['la oficina'], it: ['l’ufficio'], pt: ['o escritório'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'fr2v032', de: 'l’entreprise', en: ['the company'], gloss: { de: ['die Firma'], es: ['la empresa'], it: ['l’azienda'], pt: ['a empresa'] }, pos: 'noun', gender: 'f', level: 'A2', category: 'work' },
  { id: 'fr2v033', de: 'la réunion', en: ['the meeting'], gloss: { de: ['die Besprechung'], es: ['la reunión'], it: ['la riunione'], pt: ['a reunião'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'fr2v034', de: 'le patron', en: ['the boss'], gloss: { de: ['der Chef'], es: ['el jefe'], it: ['il capo'], pt: ['o chefe'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'fr2v035', de: 'le salaire', en: ['the salary'], gloss: { de: ['das Gehalt'], es: ['el sueldo'], it: ['lo stipendio'], pt: ['o salário'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'fr2v036', de: 'le collègue', en: ['the colleague'], gloss: { de: ['der Kollege'], es: ['el colega'], it: ['il collega'], pt: ['o colega'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'fr2v037', de: 'l’université', en: ['the university'], gloss: { de: ['die Universität'], es: ['la universidad'], it: ['l’università'], pt: ['a universidade'] }, pos: 'noun', gender: 'f', level: 'A2', category: 'work' },
  { id: 'fr2v038', de: 'l’examen', en: ['the exam'], gloss: { de: ['die Prüfung'], es: ['el examen'], it: ['l’esame'], pt: ['o exame'] }, pos: 'noun', gender: 'm', level: 'A2', category: 'work' },
  { id: 'fr2v039', de: 'l’entretien', en: ['the job interview'], gloss: { de: ['das Vorstellungsgespräch'], es: ['la entrevista'], it: ['il colloquio'], pt: ['a entrevista'] }, pos: 'noun', gender: 'm', level: 'A2', category: 'work' },
  { id: 'fr2v040', de: 'étudier', en: ['to study'], gloss: { de: ['studieren', 'lernen'], es: ['estudiar'], it: ['studiare'], pt: ['estudar'] }, pos: 'verb', level: 'A2', category: 'work' },

  // ── health & body ─────────────────────────────────────────────────────
  { id: 'fr2v041', de: 'le corps', en: ['the body'], gloss: { de: ['der Körper'], es: ['el cuerpo'], it: ['il corpo'], pt: ['o corpo'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'fr2v042', de: 'la tête', en: ['the head'], gloss: { de: ['der Kopf'], es: ['la cabeza'], it: ['la testa'], pt: ['a cabeça'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'fr2v043', de: 'la main', en: ['the hand'], gloss: { de: ['die Hand'], es: ['la mano'], it: ['la mano'], pt: ['a mão'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'fr2v044', de: 'le pied', en: ['the foot'], gloss: { de: ['der Fuß'], es: ['el pie'], it: ['il piede'], pt: ['o pé'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'fr2v045', de: 'le dos', en: ['the back'], gloss: { de: ['der Rücken'], es: ['la espalda'], it: ['la schiena'], pt: ['as costas'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'fr2v046', de: 'le ventre', en: ['the belly', 'the stomach'], gloss: { de: ['der Bauch'], es: ['la barriga'], it: ['la pancia'], pt: ['a barriga'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'fr2v047', de: 'le médecin', en: ['the doctor'], gloss: { de: ['der Arzt'], es: ['el médico'], it: ['il medico'], pt: ['o médico'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'fr2v048', de: 'l’hôpital', en: ['the hospital'], gloss: { de: ['das Krankenhaus'], es: ['el hospital'], it: ['l’ospedale'], pt: ['o hospital'] }, pos: 'noun', gender: 'm', level: 'A2', category: 'health' },
  { id: 'fr2v049', de: 'la fièvre', en: ['the fever'], gloss: { de: ['das Fieber'], es: ['la fiebre'], it: ['la febbre'], pt: ['a febre'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'fr2v050', de: 'la douleur', en: ['the pain', 'the ache'], gloss: { de: ['der Schmerz'], es: ['el dolor'], it: ['il dolore'], pt: ['a dor'] }, pos: 'noun', level: 'A2', category: 'health' },

  // ── feelings & opinions ───────────────────────────────────────────────
  { id: 'fr2v051', de: 'heureux', en: ['happy'], gloss: { de: ['glücklich'], es: ['feliz'], it: ['felice'], pt: ['feliz'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'fr2v052', de: 'triste', en: ['sad'], gloss: { de: ['traurig'], es: ['triste'], it: ['triste'], pt: ['triste'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'fr2v053', de: 'en colère', en: ['angry'], gloss: { de: ['wütend'], es: ['enfadado'], it: ['arrabbiato'], pt: ['bravo'] }, pos: 'phrase', level: 'A2', category: 'feelings' },
  { id: 'fr2v054', de: 'inquiet', en: ['worried'], gloss: { de: ['besorgt'], es: ['preocupado'], it: ['preoccupato'], pt: ['preocupado'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'fr2v055', de: 'nerveux', en: ['nervous'], gloss: { de: ['nervös'], es: ['nervioso'], it: ['nervoso'], pt: ['nervoso'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'fr2v056', de: 'calme', en: ['calm'], gloss: { de: ['ruhig'], es: ['tranquilo'], it: ['tranquillo'], pt: ['calmo'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'fr2v057', de: 'ennuyeux', en: ['boring'], gloss: { de: ['langweilig'], es: ['aburrido'], it: ['noioso'], pt: ['chato'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'fr2v058', de: 'surpris', en: ['surprised'], gloss: { de: ['überrascht'], es: ['sorprendido'], it: ['sorpreso'], pt: ['surpreso'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'fr2v059', de: 'la peur', en: ['the fear'], gloss: { de: ['die Angst'], es: ['el miedo'], it: ['la paura'], pt: ['o medo'] }, pos: 'noun', level: 'A2', category: 'feelings' },
  { id: 'fr2v060', de: 'se sentir', en: ['to feel'], gloss: { de: ['sich fühlen'], es: ['sentirse'], it: ['sentirsi'], pt: ['sentir-se'] }, pos: 'verb', level: 'A2', category: 'feelings' },

  // ── house & furniture ─────────────────────────────────────────────────
  { id: 'fr2v061', de: 'l’appartement', en: ['the flat', 'the flat'], gloss: { de: ['die Wohnung'], es: ['el apartamento'], it: ['l’appartamento'], pt: ['o apartamento'] }, pos: 'noun', gender: 'm', level: 'A2', category: 'home' },
  { id: 'fr2v062', de: 'la cuisine', en: ['the kitchen'], gloss: { de: ['die Küche'], es: ['la cocina'], it: ['la cucina'], pt: ['a cozinha'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'fr2v063', de: 'le salon', en: ['the living room'], gloss: { de: ['das Wohnzimmer'], es: ['el salón'], it: ['il soggiorno'], pt: ['a sala'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'fr2v064', de: 'la salle de bains', en: ['the bathroom'], gloss: { de: ['das Badezimmer'], es: ['el cuarto de baño'], it: ['il bagno'], pt: ['o banheiro'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'fr2v065', de: 'le lit', en: ['the bed'], gloss: { de: ['das Bett'], es: ['la cama'], it: ['il letto'], pt: ['a cama'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'fr2v066', de: 'la chaise', en: ['the chair'], gloss: { de: ['der Stuhl'], es: ['la silla'], it: ['la sedia'], pt: ['a cadeira'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'fr2v067', de: 'l’armoire', en: ['the wardrobe', 'the wardrobe'], gloss: { de: ['der Schrank'], es: ['el armario'], it: ['l’armadio'], pt: ['o armário'] }, pos: 'noun', gender: 'f', level: 'A2', category: 'home' },
  { id: 'fr2v068', de: 'la fenêtre', en: ['the window'], gloss: { de: ['das Fenster'], es: ['la ventana'], it: ['la finestra'], pt: ['a janela'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'fr2v069', de: 'la porte', en: ['the door'], gloss: { de: ['die Tür'], es: ['la puerta'], it: ['la porta'], pt: ['a porta'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'fr2v070', de: 'le jardin', en: ['the garden'], gloss: { de: ['der Garten'], es: ['el jardín'], it: ['il giardino'], pt: ['o jardim'] }, pos: 'noun', level: 'A2', category: 'home' },

  // ── meals & cooking ───────────────────────────────────────────────────
  { id: 'fr2v071', de: 'le petit-déjeuner', en: ['the breakfast'], gloss: { de: ['das Frühstück'], es: ['el desayuno'], it: ['la colazione'], pt: ['o café da manhã'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'fr2v072', de: 'le déjeuner', en: ['the lunch'], gloss: { de: ['das Mittagessen'], es: ['el almuerzo'], it: ['il pranzo'], pt: ['o almoço'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'fr2v073', de: 'le dîner', en: ['the dinner'], gloss: { de: ['das Abendessen'], es: ['la cena'], it: ['la cena'], pt: ['o jantar'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'fr2v074', de: 'le riz', en: ['the rice'], gloss: { de: ['der Reis'], es: ['el arroz'], it: ['il riso'], pt: ['o arroz'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'fr2v075', de: 'les légumes', en: ['the vegetables'], gloss: { de: ['das Gemüse'], es: ['las verduras'], it: ['la verdura'], pt: ['os legumes'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'fr2v076', de: 'le poulet', en: ['the chicken'], gloss: { de: ['das Hähnchen'], es: ['el pollo'], it: ['il pollo'], pt: ['o frango'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'fr2v077', de: 'le dessert', en: ['the dessert'], gloss: { de: ['der Nachtisch'], es: ['el postre'], it: ['il dolce'], pt: ['a sobremesa'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'fr2v078', de: 'le sel', en: ['the salt'], gloss: { de: ['das Salz'], es: ['la sal'], it: ['il sale'], pt: ['o sal'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'fr2v079', de: 'le pourboire', en: ['the tip'], gloss: { de: ['das Trinkgeld'], es: ['la propina'], it: ['la mancia'], pt: ['a gorjeta'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'fr2v080', de: 'cuisiner', en: ['to cook'], gloss: { de: ['kochen'], es: ['cocinar'], it: ['cucinare'], pt: ['cozinhar'] }, pos: 'verb', level: 'A2', category: 'food' },

  // ── time & frequency ──────────────────────────────────────────────────
  { id: 'fr2v081', de: 'le mois', en: ['the month'], gloss: { de: ['der Monat'], es: ['el mes'], it: ['il mese'], pt: ['o mês'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'fr2v082', de: 'l’heure', en: ['the hour', 'the time'], gloss: { de: ['die Stunde'], es: ['la hora'], it: ['l’ora'], pt: ['a hora'] }, pos: 'noun', gender: 'f', level: 'A2', category: 'time' },
  { id: 'fr2v083', de: 'le week-end', en: ['the weekend'], gloss: { de: ['das Wochenende'], es: ['el fin de semana'], it: ['il fine settimana'], pt: ['o fim de semana'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'fr2v084', de: 'hier soir', en: ['last night'], gloss: { de: ['gestern Abend'], es: ['anoche'], it: ['ieri sera'], pt: ['ontem à noite'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'fr2v085', de: 'ensuite', en: ['then', 'next'], gloss: { de: ['dann'], es: ['luego'], it: ['poi'], pt: ['depois'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'fr2v086', de: 'tôt', en: ['early'], gloss: { de: ['früh'], es: ['temprano'], it: ['presto'], pt: ['cedo'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'fr2v087', de: 'tard', en: ['late'], gloss: { de: ['spät'], es: ['tarde'], it: ['tardi'], pt: ['tarde'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'fr2v088', de: 'souvent', en: ['often'], gloss: { de: ['oft'], es: ['a menudo'], it: ['spesso'], pt: ['muitas vezes'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'fr2v089', de: 'parfois', en: ['sometimes'], gloss: { de: ['manchmal'], es: ['a veces'], it: ['a volte'], pt: ['às vezes'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'fr2v090', de: 'encore', en: ['still', 'again'], gloss: { de: ['noch'], es: ['todavía'], it: ['ancora'], pt: ['ainda'] }, pos: 'adv', level: 'A2', category: 'time' },

  // ── verbs for telling a story ─────────────────────────────────────────
  { id: 'fr2v091', de: 'sortir', en: ['to go out', 'to leave'], gloss: { de: ['ausgehen'], es: ['salir'], it: ['uscire'], pt: ['sair'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'fr2v092', de: 'arriver', en: ['to arrive'], gloss: { de: ['ankommen'], es: ['llegar'], it: ['arrivare'], pt: ['chegar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'fr2v093', de: 'rentrer', en: ['to go home', 'to come back'], gloss: { de: ['nach Hause gehen'], es: ['volver a casa'], it: ['rientrare'], pt: ['voltar para casa'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'fr2v094', de: 'commencer', en: ['to start', 'to begin'], gloss: { de: ['anfangen'], es: ['empezar'], it: ['cominciare'], pt: ['começar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'fr2v095', de: 'finir', en: ['to finish', 'to end'], gloss: { de: ['beenden'], es: ['terminar'], it: ['finire'], pt: ['terminar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'fr2v096', de: 'trouver', en: ['to find'], gloss: { de: ['finden'], es: ['encontrar'], it: ['trovare'], pt: ['encontrar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'fr2v097', de: 'oublier', en: ['to forget'], gloss: { de: ['vergessen'], es: ['olvidar'], it: ['dimenticare'], pt: ['esquecer'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'fr2v098', de: 'aider', en: ['to help'], gloss: { de: ['helfen'], es: ['ayudar'], it: ['aiutare'], pt: ['ajudar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'fr2v099', de: 'attendre', en: ['to wait', 'to wait for'], gloss: { de: ['warten'], es: ['esperar'], it: ['aspettare'], pt: ['esperar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'fr2v100', de: 'connaître', en: ['to know', 'to be acquainted with'], gloss: { de: ['kennen'], es: ['conocer'], it: ['conoscere'], pt: ['conhecer'] }, pos: 'verb', level: 'A2', category: 'verbs' },

  // ── adjectives & comparisons ──────────────────────────────────────────
  { id: 'fr2v101', de: 'meilleur', en: ['better'], gloss: { de: ['besser'], es: ['mejor'], it: ['migliore'], pt: ['melhor'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'fr2v102', de: 'pire', en: ['worse'], gloss: { de: ['schlimmer'], es: ['peor'], it: ['peggiore'], pt: ['pior'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'fr2v103', de: 'rapide', en: ['fast', 'quick'], gloss: { de: ['schnell'], es: ['rápido'], it: ['veloce'], pt: ['rápido'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'fr2v104', de: 'lent', en: ['slow'], gloss: { de: ['langsam'], es: ['lento'], it: ['lento'], pt: ['lento'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'fr2v105', de: 'propre', en: ['clean'], gloss: { de: ['sauber'], es: ['limpio'], it: ['pulito'], pt: ['limpo'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'fr2v106', de: 'sale', en: ['dirty'], gloss: { de: ['schmutzig'], es: ['sucio'], it: ['sporco'], pt: ['sujo'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'fr2v107', de: 'plein', en: ['full'], gloss: { de: ['voll'], es: ['lleno'], it: ['pieno'], pt: ['cheio'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'fr2v108', de: 'vide', en: ['empty'], gloss: { de: ['leer'], es: ['vacío'], it: ['vuoto'], pt: ['vazio'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'fr2v109', de: 'occupé', en: ['busy'], gloss: { de: ['beschäftigt'], es: ['ocupado'], it: ['occupato'], pt: ['ocupado'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'fr2v110', de: 'long', en: ['long'], gloss: { de: ['lang'], es: ['largo'], it: ['lungo'], pt: ['comprido'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
];
