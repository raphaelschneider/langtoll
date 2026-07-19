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

  // ── city & getting around ─────────────────────────────────────────────
  { id: 'pt2v111', de: 'o bairro', en: ['the neighbourhood'], gloss: { de: ['das Viertel'], es: ['el barrio'], fr: ['le quartier'], it: ['il quartiere'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'pt2v112', de: 'a praça', en: ['the square'], gloss: { de: ['der Platz'], es: ['la plaza'], fr: ['la place'], it: ['la piazza'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'pt2v113', de: 'o prédio', en: ['the building'], gloss: { de: ['das Gebäude'], es: ['el edificio'], fr: ['l’immeuble'], it: ['l’edificio'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'pt2v114', de: 'a esquina', en: ['the street corner'], gloss: { de: ['die Straßenecke'], es: ['la esquina'], fr: ['le coin de la rue'], it: ['l’angolo della strada'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'pt2v115', de: 'o ponto de ônibus', en: ['the bus stop'], gloss: { de: ['die Bushaltestelle'], es: ['la parada de autobús'], fr: ['l’arrêt de bus'], it: ['la fermata dell’autobus'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'pt2v116', de: 'o metrô', en: ['the underground', 'the subway'], gloss: { de: ['die U-Bahn'], es: ['el metro'], fr: ['le métro'], it: ['la metropolitana'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'pt2v117', de: 'o banco', en: ['the bank'], gloss: { de: ['die Bank'], es: ['el banco'], fr: ['la banque'], it: ['la banca'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'pt2v118', de: 'o correio', en: ['the post office'], gloss: { de: ['die Post'], es: ['la oficina de correos'], fr: ['la poste'], it: ['l’ufficio postale'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'pt2v119', de: 'o parque', en: ['the park'], gloss: { de: ['der Park'], es: ['el parque'], fr: ['le parc'], it: ['il parco'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'pt2v120', de: 'a padaria', en: ['the bakery'], gloss: { de: ['die Bäckerei'], es: ['la panadería'], fr: ['la boulangerie'], it: ['il panificio'] }, pos: 'noun', level: 'A2', category: 'city' },

  // ── technology ────────────────────────────────────────────────────────
  { id: 'pt2v121', de: 'o computador', en: ['the computer'], gloss: { de: ['der Computer'], es: ['el ordenador'], fr: ['l’ordinateur'], it: ['il computer'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'pt2v122', de: 'a senha', en: ['the password'], gloss: { de: ['das Passwort'], es: ['la contraseña'], fr: ['le mot de passe'], it: ['la password'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'pt2v123', de: 'o aplicativo', en: ['the app'], gloss: { de: ['die App'], es: ['la aplicación'], fr: ['l’application'], it: ['l’app'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'pt2v124', de: 'a internet', en: ['the internet'], gloss: { de: ['das Internet'], es: ['la internet'], fr: ['l’internet'], it: ['l’internet'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'pt2v125', de: 'a tela', en: ['the screen'], gloss: { de: ['der Bildschirm'], es: ['la pantalla'], fr: ['l’écran'], it: ['lo schermo'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'pt2v126', de: 'o teclado', en: ['the keyboard'], gloss: { de: ['die Tastatur'], es: ['el teclado'], fr: ['le clavier'], it: ['la tastiera'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'pt2v127', de: 'o arquivo', en: ['the file'], gloss: { de: ['die Datei'], es: ['el archivo'], fr: ['le fichier'], it: ['il file'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'pt2v128', de: 'a mensagem', en: ['the message'], gloss: { de: ['die Nachricht'], es: ['el mensaje'], fr: ['le message'], it: ['il messaggio'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'pt2v129', de: 'o e-mail', en: ['the email'], gloss: { de: ['die E-Mail'], es: ['el correo electrónico'], fr: ['l’e-mail'], it: ['l’email'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'pt2v130', de: 'baixar', en: ['to download'], gloss: { de: ['herunterladen'], es: ['descargar'], fr: ['télécharger'], it: ['scaricare'] }, pos: 'verb', level: 'A2', category: 'technology' },

  // ── weather & nature ──────────────────────────────────────────────────
  { id: 'pt2v131', de: 'o tempo', en: ['the weather'], gloss: { de: ['das Wetter'], es: ['el tiempo'], fr: ['le temps'], it: ['il tempo'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'pt2v132', de: 'a chuva', en: ['the rain'], gloss: { de: ['der Regen'], es: ['la lluvia'], fr: ['la pluie'], it: ['la pioggia'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'pt2v133', de: 'o sol', en: ['the sun'], gloss: { de: ['die Sonne'], es: ['el sol'], fr: ['le soleil'], it: ['il sole'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'pt2v134', de: 'o vento', en: ['the wind'], gloss: { de: ['der Wind'], es: ['el viento'], fr: ['le vent'], it: ['il vento'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'pt2v135', de: 'a nuvem', en: ['the cloud'], gloss: { de: ['die Wolke'], es: ['la nube'], fr: ['le nuage'], it: ['la nuvola'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'pt2v136', de: 'o calor', en: ['the heat'], gloss: { de: ['die Hitze'], es: ['el calor'], fr: ['la chaleur'], it: ['il caldo'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'pt2v137', de: 'a árvore', en: ['the tree'], gloss: { de: ['der Baum'], es: ['el árbol'], fr: ['l’arbre'], it: ['l’albero'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'pt2v138', de: 'a flor', en: ['the flower'], gloss: { de: ['die Blume'], es: ['la flor'], fr: ['la fleur'], it: ['il fiore'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'pt2v139', de: 'o rio', en: ['the river'], gloss: { de: ['der Fluss'], es: ['el río'], fr: ['la rivière'], it: ['il fiume'] }, pos: 'noun', level: 'A2', category: 'nature' },
  { id: 'pt2v140', de: 'a montanha', en: ['the mountain'], gloss: { de: ['der Berg'], es: ['la montaña'], fr: ['la montagne'], it: ['la montagna'] }, pos: 'noun', level: 'A2', category: 'nature' },

  // ── plans & arrangements ──────────────────────────────────────────────
  { id: 'pt2v141', de: 'o plano', en: ['the plan'], gloss: { de: ['der Plan'], es: ['el plan'], fr: ['le plan'], it: ['il piano'] }, pos: 'noun', level: 'A2', category: 'plans' },
  { id: 'pt2v142', de: 'planejar', en: ['to plan'], gloss: { de: ['planen'], es: ['planificar'], fr: ['planifier'], it: ['pianificare'] }, pos: 'verb', level: 'A2', category: 'plans' },
  { id: 'pt2v143', de: 'pretender', en: ['to intend'], gloss: { de: ['beabsichtigen'], es: ['tener la intención de'], fr: ['avoir l’intention de'], it: ['avere intenzione di'] }, pos: 'verb', level: 'A2', category: 'plans' },
  { id: 'pt2v144', de: 'a ideia', en: ['the idea'], gloss: { de: ['die Idee'], es: ['la idea'], fr: ['l’idée'], it: ['l’idea'] }, pos: 'noun', level: 'A2', category: 'plans' },
  { id: 'pt2v145', de: 'marcar', en: ['to schedule', 'to book'], gloss: { de: ['vereinbaren'], es: ['concertar'], fr: ['fixer'], it: ['fissare'] }, pos: 'verb', level: 'A2', category: 'plans' },
  { id: 'pt2v146', de: 'a festa', en: ['the party'], gloss: { de: ['die Party'], es: ['la fiesta'], fr: ['la fête'], it: ['la festa'] }, pos: 'noun', level: 'A2', category: 'plans' },
  { id: 'pt2v147', de: 'o convite', en: ['the invitation'], gloss: { de: ['die Einladung'], es: ['la invitación'], fr: ['l’invitation'], it: ['l’invito'] }, pos: 'noun', level: 'A2', category: 'plans' },
  { id: 'pt2v148', de: 'convidar', en: ['to invite'], gloss: { de: ['einladen'], es: ['invitar'], fr: ['inviter'], it: ['invitare'] }, pos: 'verb', level: 'A2', category: 'plans' },
  { id: 'pt2v149', de: 'aceitar', en: ['to accept'], gloss: { de: ['annehmen'], es: ['aceptar'], fr: ['accepter'], it: ['accettare'] }, pos: 'verb', level: 'A2', category: 'plans' },
  { id: 'pt2v150', de: 'recusar', en: ['to refuse', 'to turn down'], gloss: { de: ['ablehnen'], es: ['rechazar'], fr: ['refuser'], it: ['rifiutare'] }, pos: 'verb', level: 'A2', category: 'plans' },

  // ── relationships ─────────────────────────────────────────────────────
  { id: 'pt2v151', de: 'o namorado', en: ['the boyfriend'], gloss: { de: ['der feste Freund'], es: ['el novio'], fr: ['le petit ami'], it: ['il fidanzato'] }, pos: 'noun', level: 'A2', category: 'relationships' },
  { id: 'pt2v152', de: 'a namorada', en: ['the girlfriend'], gloss: { de: ['die feste Freundin'], es: ['la novia'], fr: ['la petite amie'], it: ['la fidanzata'] }, pos: 'noun', level: 'A2', category: 'relationships' },
  { id: 'pt2v153', de: 'o casamento', en: ['the wedding', 'the marriage'], gloss: { de: ['die Hochzeit'], es: ['la boda'], fr: ['le mariage'], it: ['il matrimonio'] }, pos: 'noun', level: 'A2', category: 'relationships' },
  { id: 'pt2v154', de: 'casar', en: ['to marry', 'to get married'], gloss: { de: ['heiraten'], es: ['casarse'], fr: ['se marier'], it: ['sposarsi'] }, pos: 'verb', level: 'A2', category: 'relationships' },
  { id: 'pt2v155', de: 'o vizinho', en: ['the neighbour'], gloss: { de: ['der Nachbar'], es: ['el vecino'], fr: ['le voisin'], it: ['il vicino'] }, pos: 'noun', level: 'A2', category: 'relationships' },
  { id: 'pt2v156', de: 'o filho', en: ['the son'], gloss: { de: ['der Sohn'], es: ['el hijo'], fr: ['le fils'], it: ['il figlio'] }, pos: 'noun', level: 'A2', category: 'relationships' },
  { id: 'pt2v157', de: 'a filha', en: ['the daughter'], gloss: { de: ['die Tochter'], es: ['la hija'], fr: ['la fille'], it: ['la figlia'] }, pos: 'noun', level: 'A2', category: 'relationships' },
  { id: 'pt2v158', de: 'conhecer', en: ['to know (a person)', 'to meet'], gloss: { de: ['kennen'], es: ['conocer'], fr: ['connaître'], it: ['conoscere'] }, pos: 'verb', level: 'A2', category: 'relationships' },
  { id: 'pt2v159', de: 'apresentar', en: ['to introduce'], gloss: { de: ['vorstellen'], es: ['presentar'], fr: ['présenter'], it: ['presentare'] }, pos: 'verb', level: 'A2', category: 'relationships' },
  { id: 'pt2v160', de: 'o presente', en: ['the gift'], gloss: { de: ['das Geschenk'], es: ['el regalo'], fr: ['le cadeau'], it: ['il regalo'] }, pos: 'noun', level: 'A2', category: 'relationships' },

  // ── more verbs ────────────────────────────────────────────────────────
  { id: 'pt2v161', de: 'mostrar', en: ['to show'], gloss: { de: ['zeigen'], es: ['mostrar'], fr: ['montrer'], it: ['mostrare'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v162', de: 'mudar', en: ['to change', 'to move house'], gloss: { de: ['wechseln'], es: ['cambiar'], fr: ['changer'], it: ['cambiare'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v163', de: 'ficar', en: ['to stay'], gloss: { de: ['bleiben'], es: ['quedarse'], fr: ['rester'], it: ['restare'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v164', de: 'levar', en: ['to take along'], gloss: { de: ['mitnehmen'], es: ['llevar'], fr: ['emmener'], it: ['portare via'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v165', de: 'trazer', en: ['to bring'], gloss: { de: ['bringen'], es: ['traer'], fr: ['apporter'], it: ['portare qui'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v166', de: 'chegar', en: ['to arrive'], gloss: { de: ['ankommen'], es: ['llegar'], fr: ['arriver'], it: ['arrivare'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v167', de: 'voltar', en: ['to come back', 'to return'], gloss: { de: ['zurückkommen'], es: ['volver'], fr: ['revenir'], it: ['tornare'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v168', de: 'entrar', en: ['to go in', 'to enter'], gloss: { de: ['hineingehen'], es: ['entrar'], fr: ['entrer'], it: ['entrare'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v169', de: 'subir', en: ['to go up', 'to climb'], gloss: { de: ['hinaufgehen'], es: ['subir'], fr: ['monter'], it: ['salire'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'pt2v170', de: 'descer', en: ['to go down', 'to get off'], gloss: { de: ['hinuntergehen'], es: ['bajar'], fr: ['descendre'], it: ['scendere'] }, pos: 'verb', level: 'A2', category: 'verbs' },
];
