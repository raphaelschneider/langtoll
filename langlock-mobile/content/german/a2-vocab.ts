import type { VocabItem } from './types';

// German A2 vocabulary. Everyday life beyond survival: routines, travel,
// health, weather, city, work, shopping, feelings. Categories stay chunky
// (8+ items) so the exercise generator always finds plausible distractors.

export const A2_VOCAB: VocabItem[] = [
  // ── daily routine (verbs) ─────────────────────────────────────────────
  { id: 'a2v001', de: 'aufstehen', en: ['to get up'], pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v002', de: 'aufwachen', en: ['to wake up'], pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v003', de: 'sich anziehen', en: ['to get dressed'], pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v004', de: 'sich duschen', en: ['to shower'], pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v005', de: 'frühstücken', en: ['to have breakfast'], pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v006', de: 'einkaufen', en: ['to shop', 'to buy groceries'], pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v007', de: 'aufräumen', en: ['to tidy up'], pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v008', de: 'abwaschen', en: ['to do the dishes'], pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v009', de: 'einschlafen', en: ['to fall asleep'], pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v010', de: 'ausgehen', en: ['to go out'], pos: 'verb', level: 'A2', category: 'routine' },

  // ── travel ────────────────────────────────────────────────────────────
  { id: 'a2v011', de: 'die Reise', en: ['the trip', 'the journey'], pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v012', de: 'der Flughafen', en: ['the airport'], pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v013', de: 'der Bahnhof', en: ['the train station'], pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v014', de: 'das Gleis', en: ['the platform', 'the track'], pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v015', de: 'die Verspätung', en: ['the delay'], pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v016', de: 'der Koffer', en: ['the suitcase'], pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v017', de: 'das Gepäck', en: ['the luggage'], pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v018', de: 'die Fahrkarte', en: ['the ticket (transport)'], pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v019', de: 'umsteigen', en: ['to change (trains)'], pos: 'verb', level: 'A2', category: 'travel' },
  { id: 'a2v020', de: 'die Unterkunft', en: ['the accommodation'], pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v021', de: 'buchen', en: ['to book'], pos: 'verb', level: 'A2', category: 'travel' },
  { id: 'a2v022', de: 'verpassen', en: ['to miss (a train)'], pos: 'verb', level: 'A2', category: 'travel' },

  // ── health & body ─────────────────────────────────────────────────────
  { id: 'a2v023', de: 'der Kopf', en: ['the head'], pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v024', de: 'der Bauch', en: ['the belly', 'the stomach'], pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v025', de: 'der Rücken', en: ['the back'], pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v026', de: 'die Erkältung', en: ['the cold (illness)'], pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v027', de: 'das Fieber', en: ['the fever'], pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v028', de: 'die Schmerzen', en: ['the pain'], pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v029', de: 'der Termin', en: ['the appointment'], pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v030', de: 'die Apotheke', en: ['the pharmacy'], pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v031', de: 'das Rezept', en: ['the prescription', 'the recipe'], pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v032', de: 'sich fühlen', en: ['to feel'], pos: 'verb', level: 'A2', category: 'health' },
  { id: 'a2v033', de: 'wehtun', en: ['to hurt'], pos: 'verb', level: 'A2', category: 'health' },

  // ── weather & nature ──────────────────────────────────────────────────
  { id: 'a2v034', de: 'das Wetter', en: ['the weather'], pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v035', de: 'der Regen', en: ['the rain'], pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v036', de: 'der Schnee', en: ['the snow'], pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v037', de: 'die Wolke', en: ['the cloud'], pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v038', de: 'der Wind', en: ['the wind'], pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v039', de: 'das Gewitter', en: ['the thunderstorm'], pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v040', de: 'der Wald', en: ['the forest'], pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v041', de: 'der See', en: ['the lake'], pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v042', de: 'das Meer', en: ['the sea'], pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v043', de: 'regnen', en: ['to rain'], pos: 'verb', level: 'A2', category: 'weather' },

  // ── city & directions ─────────────────────────────────────────────────
  { id: 'a2v044', de: 'die Kreuzung', en: ['the intersection'], pos: 'noun', level: 'A2', category: 'city' },
  { id: 'a2v045', de: 'die Ampel', en: ['the traffic light'], pos: 'noun', level: 'A2', category: 'city' },
  { id: 'a2v046', de: 'die Brücke', en: ['the bridge'], pos: 'noun', level: 'A2', category: 'city' },
  { id: 'a2v047', de: 'der Platz', en: ['the square', 'the place'], pos: 'noun', level: 'A2', category: 'city' },
  { id: 'a2v048', de: 'die Ecke', en: ['the corner'], pos: 'noun', level: 'A2', category: 'city' },
  { id: 'a2v049', de: 'geradeaus', en: ['straight ahead'], pos: 'adv', level: 'A2', category: 'city' },
  { id: 'a2v050', de: 'links abbiegen', en: ['to turn left'], pos: 'phrase', level: 'A2', category: 'city' },
  { id: 'a2v051', de: 'die Innenstadt', en: ['the city center'], pos: 'noun', level: 'A2', category: 'city' },
  { id: 'a2v052', de: 'der Stadtplan', en: ['the city map'], pos: 'noun', level: 'A2', category: 'city' },
  { id: 'a2v053', de: 'die Haltestelle', en: ['the (bus) stop'], pos: 'noun', level: 'A2', category: 'city' },

  // ── work & school ─────────────────────────────────────────────────────
  { id: 'a2v054', de: 'die Besprechung', en: ['the meeting'], pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v055', de: 'der Kollege', en: ['the colleague (male)'], pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v056', de: 'die Aufgabe', en: ['the task'], pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v057', de: 'die Pause', en: ['the break'], pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v058', de: 'der Feierabend', en: ['the end of the workday'], pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v059', de: 'die Prüfung', en: ['the exam'], pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v060', de: 'das Gehalt', en: ['the salary'], pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v061', de: 'kündigen', en: ['to quit', 'to give notice'], pos: 'verb', level: 'A2', category: 'work' },
  { id: 'a2v062', de: 'verdienen', en: ['to earn'], pos: 'verb', level: 'A2', category: 'work' },
  { id: 'a2v063', de: 'sich bewerben', en: ['to apply (for a job)'], pos: 'verb', level: 'A2', category: 'work' },

  // ── shopping & clothes ────────────────────────────────────────────────
  { id: 'a2v064', de: 'das Geschäft', en: ['the shop', 'the store'], pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v065', de: 'der Kunde', en: ['the customer'], pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v066', de: 'das Angebot', en: ['the offer', 'the deal'], pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v067', de: 'die Größe', en: ['the size'], pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v068', de: 'anprobieren', en: ['to try on'], pos: 'verb', level: 'A2', category: 'shopping' },
  { id: 'a2v069', de: 'umtauschen', en: ['to exchange (goods)'], pos: 'verb', level: 'A2', category: 'shopping' },
  { id: 'a2v070', de: 'die Jacke', en: ['the jacket'], pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v071', de: 'der Mantel', en: ['the coat'], pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v072', de: 'die Hose', en: ['the trousers', 'the pants'], pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v073', de: 'das Hemd', en: ['the shirt'], pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v074', de: 'die Kasse', en: ['the checkout', 'the till'], pos: 'noun', level: 'A2', category: 'shopping' },

  // ── feelings & adjectives ─────────────────────────────────────────────
  { id: 'a2v075', de: 'zufrieden', en: ['satisfied', 'content'], pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v076', de: 'aufgeregt', en: ['excited', 'nervous'], pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v077', de: 'enttäuscht', en: ['disappointed'], pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v078', de: 'überrascht', en: ['surprised'], pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v079', de: 'stolz', en: ['proud'], pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v080', de: 'eifersüchtig', en: ['jealous'], pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v081', de: 'gelangweilt', en: ['bored'], pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v082', de: 'besorgt', en: ['worried'], pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v083', de: 'erschöpft', en: ['exhausted'], pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v084', de: 'sich freuen auf', en: ['to look forward to'], pos: 'phrase', level: 'A2', category: 'feelings' },

  // ── time & frequency ──────────────────────────────────────────────────
  { id: 'a2v085', de: 'gestern', en: ['yesterday'], pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v086', de: 'vorgestern', en: ['the day before yesterday'], pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v087', de: 'übermorgen', en: ['the day after tomorrow'], pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v088', de: 'meistens', en: ['mostly', 'usually'], pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v089', de: 'selten', en: ['rarely', 'seldom'], pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v090', de: 'nie', en: ['never'], pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v091', de: 'schon', en: ['already'], pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v092', de: 'noch nicht', en: ['not yet'], pos: 'phrase', level: 'A2', category: 'time' },
  { id: 'a2v093', de: 'sofort', en: ['immediately', 'right away'], pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v094', de: 'plötzlich', en: ['suddenly'], pos: 'adv', level: 'A2', category: 'time' },

  // ── household ─────────────────────────────────────────────────────────
  { id: 'a2v095', de: 'die Wohnung', en: ['the apartment', 'the flat'], pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v096', de: 'die Miete', en: ['the rent'], pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v097', de: 'der Nachbar', en: ['the neighbor'], pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v098', de: 'der Schlüssel', en: ['the key'], pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v099', de: 'die Waschmaschine', en: ['the washing machine'], pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v100', de: 'der Kühlschrank', en: ['the fridge'], pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v101', de: 'der Herd', en: ['the stove'], pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v102', de: 'die Heizung', en: ['the heating'], pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v103', de: 'umziehen', en: ['to move (house)'], pos: 'verb', level: 'A2', category: 'household' },
  { id: 'a2v104', de: 'mieten', en: ['to rent'], pos: 'verb', level: 'A2', category: 'household' },
];
