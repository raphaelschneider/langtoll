import type { VocabItem } from '@/content/german/types';

// Brazilian Portuguese (pt-BR) A2 vocabulary. The `de` field holds the
// Portuguese text (see the note in content/german/types.ts). Nouns include the
// article (o/a) since knowing gender is part of the exercise. Categories stay
// chunky (10 items each) so the generator always finds same-category distractors.
//
// A2 deliberately does NOT revisit A1: no greetings, no numbers 1-10, no family,
// no ser/ter/ir/querer/comer. It moves outward into the day (routine, house,
// work, health) and outward in time (past tense, comparatives).
//
// `gloss` carries the other UI locales. English lives in `en` and is the
// guaranteed fallback; Portuguese itself is never glossed (a Portuguese-UI user
// is never offered Portuguese to learn), so each item covers de / es / fr / it.

export const A2_VOCAB: VocabItem[] = [
  // ── daily routine ─────────────────────────────────────────────────────
  { id: 'pt2v001', de: 'acordar', en: ['to wake up'], gloss: { de: ['aufwachen'], es: ['despertarse'], fr: ['se réveiller'], it: ['svegliarsi'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'pt2v002', de: 'levantar', en: ['to get up'], gloss: { de: ['aufstehen'], es: ['levantarse'], fr: ['se lever'], it: ['alzarsi'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'pt2v003', de: 'tomar banho', en: ['to have a shower'], gloss: { de: ['duschen'], es: ['ducharse'], fr: ['se doucher'], it: ['farsi la doccia'] }, pos: 'phrase', level: 'A2', category: 'daily' },
  { id: 'pt2v004', de: 'escovar os dentes', en: ['to brush one’s teeth'], gloss: { de: ['sich die Zähne putzen'], es: ['lavarse los dientes'], fr: ['se brosser les dents'], it: ['lavarsi i denti'] }, pos: 'phrase', level: 'A2', category: 'daily' },
  { id: 'pt2v005', de: 'o café da manhã', en: ['the breakfast'], gloss: { de: ['das Frühstück'], es: ['el desayuno'], fr: ['le petit-déjeuner'], it: ['la colazione'] }, pos: 'noun', level: 'A2', category: 'daily' },
  { id: 'pt2v006', de: 'o almoço', en: ['the lunch'], gloss: { de: ['das Mittagessen'], es: ['el almuerzo'], fr: ['le déjeuner'], it: ['il pranzo'] }, pos: 'noun', level: 'A2', category: 'daily' },
  { id: 'pt2v007', de: 'o jantar', en: ['the dinner'], gloss: { de: ['das Abendessen'], es: ['la cena'], fr: ['le dîner'], it: ['la cena'] }, pos: 'noun', level: 'A2', category: 'daily' },
  { id: 'pt2v008', de: 'dormir', en: ['to sleep'], gloss: { de: ['schlafen'], es: ['dormir'], fr: ['dormir'], it: ['dormire'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'pt2v009', de: 'descansar', en: ['to rest'], gloss: { de: ['sich ausruhen'], es: ['descansar'], fr: ['se reposer'], it: ['riposarsi'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'pt2v010', de: 'sair', en: ['to go out', 'to leave'], gloss: { de: ['ausgehen'], es: ['salir'], fr: ['sortir'], it: ['uscire'] }, pos: 'verb', level: 'A2', category: 'daily' },

  // ── travel & transport ────────────────────────────────────────────────
  { id: 'pt2v011', de: 'a viagem', en: ['the trip', 'the journey'], gloss: { de: ['die Reise'], es: ['el viaje'], fr: ['le voyage'], it: ['il viaggio'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'pt2v012', de: 'viajar', en: ['to travel'], gloss: { de: ['reisen'], es: ['viajar'], fr: ['voyager'], it: ['viaggiare'] }, pos: 'verb', level: 'A2', category: 'travel' },
  { id: 'pt2v013', de: 'o ônibus', en: ['the bus'], gloss: { de: ['der Bus'], es: ['el autobús'], fr: ['le bus'], it: ['l’autobus'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'pt2v014', de: 'o trem', en: ['the train'], gloss: { de: ['der Zug'], es: ['el tren'], fr: ['le train'], it: ['il treno'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'pt2v015', de: 'o avião', en: ['the plane'], gloss: { de: ['das Flugzeug'], es: ['el avión'], fr: ['l’avion'], it: ['l’aereo'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'pt2v016', de: 'o carro', en: ['the car'], gloss: { de: ['das Auto'], es: ['el coche'], fr: ['la voiture'], it: ['la macchina'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'pt2v017', de: 'o aeroporto', en: ['the airport'], gloss: { de: ['der Flughafen'], es: ['el aeropuerto'], fr: ['l’aéroport'], it: ['l’aeroporto'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'pt2v018', de: 'a passagem', en: ['the ticket'], gloss: { de: ['die Fahrkarte'], es: ['el billete'], fr: ['le billet'], it: ['il biglietto'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'pt2v019', de: 'a mala', en: ['the suitcase'], gloss: { de: ['der Koffer'], es: ['la maleta'], fr: ['la valise'], it: ['la valigia'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'pt2v020', de: 'o hotel', en: ['the hotel'], gloss: { de: ['das Hotel'], es: ['el hotel'], fr: ['l’hôtel'], it: ['l’hotel'] }, pos: 'noun', level: 'A2', category: 'travel' },

  // ── shopping & money ──────────────────────────────────────────────────
  { id: 'pt2v021', de: 'o dinheiro', en: ['the money'], gloss: { de: ['das Geld'], es: ['el dinero'], fr: ['l’argent'], it: ['i soldi'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'pt2v022', de: 'o preço', en: ['the price'], gloss: { de: ['der Preis'], es: ['el precio'], fr: ['le prix'], it: ['il prezzo'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'pt2v023', de: 'comprar', en: ['to buy'], gloss: { de: ['kaufen'], es: ['comprar'], fr: ['acheter'], it: ['comprare'] }, pos: 'verb', level: 'A2', category: 'shopping' },
  { id: 'pt2v024', de: 'pagar', en: ['to pay'], gloss: { de: ['bezahlen'], es: ['pagar'], fr: ['payer'], it: ['pagare'] }, pos: 'verb', level: 'A2', category: 'shopping' },
  { id: 'pt2v025', de: 'o cartão', en: ['the card'], gloss: { de: ['die Karte'], es: ['la tarjeta'], fr: ['la carte'], it: ['la carta'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'pt2v026', de: 'o troco', en: ['the change'], gloss: { de: ['das Wechselgeld'], es: ['el cambio'], fr: ['la monnaie'], it: ['il resto'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'pt2v027', de: 'o desconto', en: ['the discount'], gloss: { de: ['der Rabatt'], es: ['el descuento'], fr: ['la remise'], it: ['lo sconto'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'pt2v028', de: 'o supermercado', en: ['the supermarket'], gloss: { de: ['der Supermarkt'], es: ['el supermercado'], fr: ['le supermarché'], it: ['il supermercato'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'pt2v029', de: 'a sacola', en: ['the bag'], gloss: { de: ['die Tüte'], es: ['la bolsa'], fr: ['le sac'], it: ['il sacchetto'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'pt2v030', de: 'o celular', en: ['the mobile'], gloss: { de: ['das Handy'], es: ['el móvil'], fr: ['le téléphone'], it: ['il cellulare'] }, pos: 'noun', level: 'A2', category: 'shopping' },

  // ── work & study ──────────────────────────────────────────────────────
  { id: 'pt2v031', de: 'o emprego', en: ['the job'], gloss: { de: ['die Stelle'], es: ['el empleo'], fr: ['l’emploi'], it: ['l’impiego'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'pt2v032', de: 'o escritório', en: ['the office'], gloss: { de: ['das Büro'], es: ['la oficina'], fr: ['le bureau'], it: ['l’ufficio'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'pt2v033', de: 'a reunião', en: ['the meeting'], gloss: { de: ['die Besprechung'], es: ['la reunión'], fr: ['la réunion'], it: ['la riunione'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'pt2v034', de: 'o chefe', en: ['the boss'], gloss: { de: ['der Chef'], es: ['el jefe'], fr: ['le chef'], it: ['il capo'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'pt2v035', de: 'o colega', en: ['the colleague'], gloss: { de: ['der Kollege'], es: ['el compañero'], fr: ['le collègue'], it: ['il collega'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'pt2v036', de: 'o salário', en: ['the salary'], gloss: { de: ['das Gehalt'], es: ['el sueldo'], fr: ['le salaire'], it: ['lo stipendio'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'pt2v037', de: 'a empresa', en: ['the company'], gloss: { de: ['die Firma'], es: ['la empresa'], fr: ['l’entreprise'], it: ['l’azienda'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'pt2v038', de: 'estudar', en: ['to study'], gloss: { de: ['lernen'], es: ['estudiar'], fr: ['étudier'], it: ['studiare'] }, pos: 'verb', level: 'A2', category: 'work' },
  { id: 'pt2v039', de: 'a faculdade', en: ['the university'], gloss: { de: ['die Universität'], es: ['la universidad'], fr: ['l’université'], it: ['l’università'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'pt2v040', de: 'a prova', en: ['the exam', 'the test'], gloss: { de: ['die Prüfung'], es: ['el examen'], fr: ['l’examen'], it: ['l’esame'] }, pos: 'noun', level: 'A2', category: 'work' },

  // ── health & body ─────────────────────────────────────────────────────
  { id: 'pt2v041', de: 'o corpo', en: ['the body'], gloss: { de: ['der Körper'], es: ['el cuerpo'], fr: ['le corps'], it: ['il corpo'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'pt2v042', de: 'a cabeça', en: ['the head'], gloss: { de: ['der Kopf'], es: ['la cabeza'], fr: ['la tête'], it: ['la testa'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'pt2v043', de: 'a mão', en: ['the hand'], gloss: { de: ['die Hand'], es: ['la mano'], fr: ['la main'], it: ['la mano'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'pt2v044', de: 'o pé', en: ['the foot'], gloss: { de: ['der Fuß'], es: ['el pie'], fr: ['le pied'], it: ['il piede'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'pt2v045', de: 'a perna', en: ['the leg'], gloss: { de: ['das Bein'], es: ['la pierna'], fr: ['la jambe'], it: ['la gamba'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'pt2v046', de: 'o olho', en: ['the eye'], gloss: { de: ['das Auge'], es: ['el ojo'], fr: ['l’œil'], it: ['l’occhio'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'pt2v047', de: 'a dor', en: ['the pain', 'the ache'], gloss: { de: ['der Schmerz'], es: ['el dolor'], fr: ['la douleur'], it: ['il dolore'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'pt2v048', de: 'o médico', en: ['the doctor'], gloss: { de: ['der Arzt'], es: ['el médico'], fr: ['le médecin'], it: ['il medico'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'pt2v049', de: 'a farmácia', en: ['the pharmacy'], gloss: { de: ['die Apotheke'], es: ['la farmacia'], fr: ['la pharmacie'], it: ['la farmacia'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'pt2v050', de: 'o remédio', en: ['the medicine'], gloss: { de: ['das Medikament'], es: ['el medicamento'], fr: ['le médicament'], it: ['la medicina'] }, pos: 'noun', level: 'A2', category: 'health' },

  // ── feelings & opinions ───────────────────────────────────────────────
  { id: 'pt2v051', de: 'triste', en: ['sad'], gloss: { de: ['traurig'], es: ['triste'], fr: ['triste'], it: ['triste'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'pt2v052', de: 'bravo', en: ['angry'], gloss: { de: ['wütend'], es: ['enfadado'], fr: ['en colère'], it: ['arrabbiato'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'pt2v053', de: 'nervoso', en: ['nervous'], gloss: { de: ['nervös'], es: ['nervioso'], fr: ['nerveux'], it: ['nervoso'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'pt2v054', de: 'preocupado', en: ['worried'], gloss: { de: ['besorgt'], es: ['preocupado'], fr: ['inquiet'], it: ['preoccupato'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'pt2v055', de: 'animado', en: ['excited'], gloss: { de: ['begeistert'], es: ['emocionado'], fr: ['enthousiaste'], it: ['entusiasta'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'pt2v056', de: 'calmo', en: ['calm'], gloss: { de: ['ruhig'], es: ['tranquilo'], fr: ['calme'], it: ['calmo'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'pt2v057', de: 'orgulhoso', en: ['proud'], gloss: { de: ['stolz'], es: ['orgulloso'], fr: ['fier'], it: ['orgoglioso'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'pt2v058', de: 'chateado', en: ['upset'], gloss: { de: ['verärgert'], es: ['molesto'], fr: ['contrarié'], it: ['seccato'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'pt2v059', de: 'a saudade', en: ['the longing', 'the missing someone'], gloss: { de: ['die Sehnsucht'], es: ['la añoranza'], fr: ['le manque'], it: ['la nostalgia'] }, pos: 'noun', level: 'A2', category: 'feelings' },
  { id: 'pt2v060', de: 'ter medo', en: ['to be afraid'], gloss: { de: ['Angst haben'], es: ['tener miedo'], fr: ['avoir peur'], it: ['avere paura'] }, pos: 'phrase', level: 'A2', category: 'feelings' },

  // ── house & furniture ─────────────────────────────────────────────────
  { id: 'pt2v061', de: 'o apartamento', en: ['the flat'], gloss: { de: ['die Wohnung'], es: ['el apartamento'], fr: ['l’appartement'], it: ['l’appartamento'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'pt2v062', de: 'o quarto', en: ['the bedroom', 'the room'], gloss: { de: ['das Schlafzimmer'], es: ['el dormitorio'], fr: ['la chambre'], it: ['la camera'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'pt2v063', de: 'a cozinha', en: ['the kitchen'], gloss: { de: ['die Küche'], es: ['la cocina'], fr: ['la cuisine'], it: ['la cucina'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'pt2v064', de: 'a sala', en: ['the living room'], gloss: { de: ['das Wohnzimmer'], es: ['el salón'], fr: ['le salon'], it: ['il soggiorno'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'pt2v065', de: 'a cama', en: ['the bed'], gloss: { de: ['das Bett'], es: ['la cama'], fr: ['le lit'], it: ['il letto'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'pt2v066', de: 'a cadeira', en: ['the chair'], gloss: { de: ['der Stuhl'], es: ['la silla'], fr: ['la chaise'], it: ['la sedia'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'pt2v067', de: 'a janela', en: ['the window'], gloss: { de: ['das Fenster'], es: ['la ventana'], fr: ['la fenêtre'], it: ['la finestra'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'pt2v068', de: 'o sofá', en: ['the sofa', 'the sofa'], gloss: { de: ['das Sofa'], es: ['el sofá'], fr: ['le canapé'], it: ['il divano'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'pt2v069', de: 'a geladeira', en: ['the fridge'], gloss: { de: ['der Kühlschrank'], es: ['la nevera'], fr: ['le frigo'], it: ['il frigorifero'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'pt2v070', de: 'o chuveiro', en: ['the shower'], gloss: { de: ['die Dusche'], es: ['la ducha'], fr: ['la douche'], it: ['la doccia'] }, pos: 'noun', level: 'A2', category: 'home' },

  // ── food (eating out) ─────────────────────────────────────────────────
  { id: 'pt2v071', de: 'o garçom', en: ['the waiter'], gloss: { de: ['der Kellner'], es: ['el camarero'], fr: ['le serveur'], it: ['il cameriere'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'pt2v072', de: 'o cardápio', en: ['the menu'], gloss: { de: ['die Speisekarte'], es: ['la carta'], fr: ['le menu'], it: ['il menù'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'pt2v073', de: 'a conta', en: ['the bill', 'the check'], gloss: { de: ['die Rechnung'], es: ['la cuenta'], fr: ['l’addition'], it: ['il conto'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'pt2v074', de: 'o prato', en: ['the plate', 'the dish'], gloss: { de: ['der Teller'], es: ['el plato'], fr: ['l’assiette'], it: ['il piatto'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'pt2v075', de: 'a sobremesa', en: ['the dessert'], gloss: { de: ['die Nachspeise'], es: ['el postre'], fr: ['le dessert'], it: ['il dolce'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'pt2v076', de: 'a salada', en: ['the salad'], gloss: { de: ['der Salat'], es: ['la ensalada'], fr: ['la salade'], it: ['l’insalata'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'pt2v077', de: 'o frango', en: ['the chicken'], gloss: { de: ['das Hähnchen'], es: ['el pollo'], fr: ['le poulet'], it: ['il pollo'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'pt2v078', de: 'o peixe', en: ['the fish'], gloss: { de: ['der Fisch'], es: ['el pescado'], fr: ['le poisson'], it: ['il pesce'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'pt2v079', de: 'a batata', en: ['the potato'], gloss: { de: ['die Kartoffel'], es: ['la patata'], fr: ['la pomme de terre'], it: ['la patata'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'pt2v080', de: 'o suco', en: ['the juice'], gloss: { de: ['der Saft'], es: ['el zumo'], fr: ['le jus'], it: ['il succo'] }, pos: 'noun', level: 'A2', category: 'food' },

  // ── time ──────────────────────────────────────────────────────────────
  { id: 'pt2v081', de: 'a tarde', en: ['the afternoon'], gloss: { de: ['der Nachmittag'], es: ['la tarde'], fr: ['l’après-midi'], it: ['il pomeriggio'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'pt2v082', de: 'o mês', en: ['the month'], gloss: { de: ['der Monat'], es: ['el mes'], fr: ['le mois'], it: ['il mese'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'pt2v083', de: 'o ano', en: ['the year'], gloss: { de: ['das Jahr'], es: ['el año'], fr: ['l’année'], it: ['l’anno'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'pt2v084', de: 'o minuto', en: ['the minute'], gloss: { de: ['die Minute'], es: ['el minuto'], fr: ['la minute'], it: ['il minuto'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'pt2v085', de: 'o fim de semana', en: ['the weekend'], gloss: { de: ['das Wochenende'], es: ['el fin de semana'], fr: ['le week-end'], it: ['il fine settimana'] }, pos: 'noun', level: 'A2', category: 'time' },
  { id: 'pt2v086', de: 'cedo', en: ['early'], gloss: { de: ['früh'], es: ['temprano'], fr: ['tôt'], it: ['presto'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'pt2v087', de: 'nunca', en: ['never'], gloss: { de: ['nie'], es: ['nunca'], fr: ['jamais'], it: ['mai'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'pt2v088', de: 'às vezes', en: ['sometimes'], gloss: { de: ['manchmal'], es: ['a veces'], fr: ['parfois'], it: ['a volte'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'pt2v089', de: 'depois', en: ['after', 'afterwards'], gloss: { de: ['danach'], es: ['después'], fr: ['après'], it: ['dopo'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'pt2v090', de: 'antes', en: ['before'], gloss: { de: ['vorher'], es: ['antes'], fr: ['avant'], it: ['prima'] }, pos: 'adv', level: 'A2', category: 'time' },

  // ── verbs ─────────────────────────────────────────────────────────────
  { id: 'pt2v091', de: 'pegar', en: ['to take', 'to catch'], gloss: { de: ['nehmen'], es: ['tomar'], fr: ['prendre'], it: ['prendere'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v092', de: 'esquecer', en: ['to forget'], gloss: { de: ['vergessen'], es: ['olvidar'], fr: ['oublier'], it: ['dimenticare'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v093', de: 'lembrar', en: ['to remember'], gloss: { de: ['sich erinnern'], es: ['recordar'], fr: ['se souvenir'], it: ['ricordare'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v094', de: 'perder', en: ['to lose', 'to miss'], gloss: { de: ['verlieren'], es: ['perder'], fr: ['perdre'], it: ['perdere'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v095', de: 'encontrar', en: ['to find', 'to meet'], gloss: { de: ['finden'], es: ['encontrar'], fr: ['trouver'], it: ['trovare'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v096', de: 'ajudar', en: ['to help'], gloss: { de: ['helfen'], es: ['ayudar'], fr: ['aider'], it: ['aiutare'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v097', de: 'precisar', en: ['to need'], gloss: { de: ['brauchen'], es: ['necesitar'], fr: ['avoir besoin de'], it: ['avere bisogno di'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v098', de: 'conseguir', en: ['to manage', 'to be able to'], gloss: { de: ['schaffen'], es: ['lograr'], fr: ['réussir à'], it: ['riuscire a'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v099', de: 'começar', en: ['to start', 'to begin'], gloss: { de: ['anfangen'], es: ['empezar'], fr: ['commencer'], it: ['cominciare'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v100', de: 'terminar', en: ['to finish', 'to end'], gloss: { de: ['beenden'], es: ['terminar'], fr: ['finir'], it: ['finire'] }, pos: 'verb', level: 'A2', category: 'verbs' },

  // ── adjectives & comparatives ─────────────────────────────────────────
  { id: 'pt2v101', de: 'velho', en: ['old'], gloss: { de: ['alt'], es: ['viejo'], fr: ['vieux'], it: ['vecchio'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'pt2v102', de: 'forte', en: ['strong'], gloss: { de: ['stark'], es: ['fuerte'], fr: ['fort'], it: ['forte'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'pt2v103', de: 'difícil', en: ['difficult', 'hard'], gloss: { de: ['schwierig'], es: ['difícil'], fr: ['difficile'], it: ['difficile'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'pt2v104', de: 'fácil', en: ['easy'], gloss: { de: ['einfach'], es: ['fácil'], fr: ['facile'], it: ['facile'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'pt2v105', de: 'rápido', en: ['fast', 'quick'], gloss: { de: ['schnell'], es: ['rápido'], fr: ['rapide'], it: ['veloce'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'pt2v106', de: 'lento', en: ['slow'], gloss: { de: ['langsam'], es: ['lento'], fr: ['lent'], it: ['lento'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'pt2v107', de: 'limpo', en: ['clean'], gloss: { de: ['sauber'], es: ['limpio'], fr: ['propre'], it: ['pulito'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'pt2v108', de: 'sujo', en: ['dirty'], gloss: { de: ['schmutzig'], es: ['sucio'], fr: ['sale'], it: ['sporco'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'pt2v109', de: 'melhor', en: ['better'], gloss: { de: ['besser'], es: ['mejor'], fr: ['meilleur'], it: ['migliore'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'pt2v110', de: 'pior', en: ['worse'], gloss: { de: ['schlechter'], es: ['peor'], fr: ['pire'], it: ['peggiore'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
];
