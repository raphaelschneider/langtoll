import type { VocabItem } from './types';

// German B1 vocabulary. Opinions, work life, society, environment, abstract
// verbs, connectors — the language of actual conversations.

export const B1_VOCAB: VocabItem[] = [
  // ── opinions & discussion ─────────────────────────────────────────────
  { id: 'b1v001', de: 'die Meinung', en: ['the opinion'], pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'b1v002', de: 'der Vorschlag', en: ['the suggestion', 'the proposal'], pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'b1v003', de: 'der Vorteil', en: ['the advantage'], pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'b1v004', de: 'der Nachteil', en: ['the disadvantage'], pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'b1v005', de: 'zustimmen', en: ['to agree'], pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'b1v006', de: 'widersprechen', en: ['to contradict', 'to disagree'], pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'b1v007', de: 'überzeugen', en: ['to convince'], pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'b1v008', de: 'behaupten', en: ['to claim'], pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'b1v009', de: 'begründen', en: ['to justify', 'to give reasons'], pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'b1v010', de: 'meiner Meinung nach', en: ['in my opinion'], pos: 'phrase', level: 'B1', category: 'opinion' },

  // ── work & career ─────────────────────────────────────────────────────
  { id: 'b1v011', de: 'die Erfahrung', en: ['the experience'], pos: 'noun', level: 'B1', category: 'career' },
  { id: 'b1v012', de: 'die Verantwortung', en: ['the responsibility'], pos: 'noun', level: 'B1', category: 'career' },
  { id: 'b1v013', de: 'die Fähigkeit', en: ['the ability', 'the skill'], pos: 'noun', level: 'B1', category: 'career' },
  { id: 'b1v014', de: 'der Lebenslauf', en: ['the CV', 'the résumé'], pos: 'noun', level: 'B1', category: 'career' },
  { id: 'b1v015', de: 'das Vorstellungsgespräch', en: ['the job interview'], pos: 'noun', level: 'B1', category: 'career' },
  { id: 'b1v016', de: 'die Weiterbildung', en: ['the further training'], pos: 'noun', level: 'B1', category: 'career' },
  { id: 'b1v017', de: 'befördern', en: ['to promote'], pos: 'verb', level: 'B1', category: 'career' },
  { id: 'b1v018', de: 'einstellen', en: ['to hire'], pos: 'verb', level: 'B1', category: 'career' },
  { id: 'b1v019', de: 'entlassen', en: ['to dismiss', 'to lay off'], pos: 'verb', level: 'B1', category: 'career' },
  { id: 'b1v020', de: 'selbstständig', en: ['self-employed', 'independent'], pos: 'adj', level: 'B1', category: 'career' },

  // ── society & news ────────────────────────────────────────────────────
  { id: 'b1v021', de: 'die Gesellschaft', en: ['the society'], pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v022', de: 'die Regierung', en: ['the government'], pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v023', de: 'die Wahl', en: ['the election', 'the choice'], pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v024', de: 'das Gesetz', en: ['the law'], pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v025', de: 'die Nachrichten', en: ['the news'], pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v026', de: 'die Arbeitslosigkeit', en: ['the unemployment'], pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v027', de: 'die Gerechtigkeit', en: ['the justice', 'the fairness'], pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v028', de: 'öffentlich', en: ['public'], pos: 'adj', level: 'B1', category: 'society' },
  { id: 'b1v029', de: 'die Bevölkerung', en: ['the population'], pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v030', de: 'sich engagieren', en: ['to get involved', 'to volunteer'], pos: 'verb', level: 'B1', category: 'society' },

  // ── environment ───────────────────────────────────────────────────────
  { id: 'b1v031', de: 'die Umwelt', en: ['the environment'], pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'b1v032', de: 'der Klimawandel', en: ['the climate change'], pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'b1v033', de: 'der Müll', en: ['the garbage', 'the trash'], pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'b1v034', de: 'die Verschmutzung', en: ['the pollution'], pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'b1v035', de: 'erneuerbar', en: ['renewable'], pos: 'adj', level: 'B1', category: 'environment' },
  { id: 'b1v036', de: 'verbrauchen', en: ['to consume', 'to use up'], pos: 'verb', level: 'B1', category: 'environment' },
  { id: 'b1v037', de: 'vermeiden', en: ['to avoid'], pos: 'verb', level: 'B1', category: 'environment' },
  { id: 'b1v038', de: 'schützen', en: ['to protect'], pos: 'verb', level: 'B1', category: 'environment' },
  { id: 'b1v039', de: 'recyceln', en: ['to recycle'], pos: 'verb', level: 'B1', category: 'environment' },
  { id: 'b1v040', de: 'nachhaltig', en: ['sustainable'], pos: 'adj', level: 'B1', category: 'environment' },

  // ── relationships & emotions ──────────────────────────────────────────
  { id: 'b1v041', de: 'das Vertrauen', en: ['the trust'], pos: 'noun', level: 'B1', category: 'relationships' },
  { id: 'b1v042', de: 'die Beziehung', en: ['the relationship'], pos: 'noun', level: 'B1', category: 'relationships' },
  { id: 'b1v043', de: 'der Streit', en: ['the argument', 'the quarrel'], pos: 'noun', level: 'B1', category: 'relationships' },
  { id: 'b1v044', de: 'sich verlassen auf', en: ['to rely on'], pos: 'phrase', level: 'B1', category: 'relationships' },
  { id: 'b1v045', de: 'sich trennen', en: ['to separate', 'to break up'], pos: 'verb', level: 'B1', category: 'relationships' },
  { id: 'b1v046', de: 'sich versöhnen', en: ['to reconcile', 'to make up'], pos: 'verb', level: 'B1', category: 'relationships' },
  { id: 'b1v047', de: 'vermissen', en: ['to miss (someone)'], pos: 'verb', level: 'B1', category: 'relationships' },
  { id: 'b1v048', de: 'verzeihen', en: ['to forgive'], pos: 'verb', level: 'B1', category: 'relationships' },
  { id: 'b1v049', de: 'die Enttäuschung', en: ['the disappointment'], pos: 'noun', level: 'B1', category: 'relationships' },
  { id: 'b1v050', de: 'eifersüchtig sein auf', en: ['to be jealous of'], pos: 'phrase', level: 'B1', category: 'relationships' },

  // ── abstract verbs ────────────────────────────────────────────────────
  { id: 'b1v051', de: 'sich entscheiden', en: ['to decide'], pos: 'verb', level: 'B1', category: 'abstract' },
  { id: 'b1v052', de: 'sich gewöhnen an', en: ['to get used to'], pos: 'phrase', level: 'B1', category: 'abstract' },
  { id: 'b1v053', de: 'sich vorstellen', en: ['to imagine', 'to introduce oneself'], pos: 'verb', level: 'B1', category: 'abstract' },
  { id: 'b1v054', de: 'erreichen', en: ['to achieve', 'to reach'], pos: 'verb', level: 'B1', category: 'abstract' },
  { id: 'b1v055', de: 'verbessern', en: ['to improve'], pos: 'verb', level: 'B1', category: 'abstract' },
  { id: 'b1v056', de: 'entwickeln', en: ['to develop'], pos: 'verb', level: 'B1', category: 'abstract' },
  { id: 'b1v057', de: 'vergleichen', en: ['to compare'], pos: 'verb', level: 'B1', category: 'abstract' },
  { id: 'b1v058', de: 'beeinflussen', en: ['to influence'], pos: 'verb', level: 'B1', category: 'abstract' },
  { id: 'b1v059', de: 'verzichten auf', en: ['to do without', 'to give up'], pos: 'phrase', level: 'B1', category: 'abstract' },
  { id: 'b1v060', de: 'sich lohnen', en: ['to be worth it'], pos: 'verb', level: 'B1', category: 'abstract' },

  // ── connectors & structure ────────────────────────────────────────────
  { id: 'b1v061', de: 'obwohl', en: ['although'], pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'b1v062', de: 'trotzdem', en: ['nevertheless', 'still'], pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'b1v063', de: 'deshalb', en: ['therefore', 'that is why'], pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'b1v064', de: 'außerdem', en: ['besides', 'moreover'], pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'b1v065', de: 'allerdings', en: ['however', 'though'], pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'b1v066', de: 'entweder … oder', en: ['either … or'], pos: 'phrase', level: 'B1', category: 'connectors' },
  { id: 'b1v067', de: 'weder … noch', en: ['neither … nor'], pos: 'phrase', level: 'B1', category: 'connectors' },
  { id: 'b1v068', de: 'sowohl … als auch', en: ['both … and'], pos: 'phrase', level: 'B1', category: 'connectors' },
  { id: 'b1v069', de: 'je … desto', en: ['the … the (comparative)'], pos: 'phrase', level: 'B1', category: 'connectors' },
  { id: 'b1v070', de: 'falls', en: ['in case', 'if'], pos: 'conj', level: 'B1', category: 'connectors' },

  // ── everyday idioms ───────────────────────────────────────────────────
  { id: 'b1v071', de: 'Daumen drücken', en: ['to keep one’s fingers crossed'], pos: 'phrase', level: 'B1', category: 'idioms' },
  { id: 'b1v072', de: 'auf dem Laufenden sein', en: ['to be up to date'], pos: 'phrase', level: 'B1', category: 'idioms' },
  { id: 'b1v073', de: 'unter vier Augen', en: ['in private', 'between the two of us'], pos: 'phrase', level: 'B1', category: 'idioms' },
  { id: 'b1v074', de: 'die Nase voll haben', en: ['to be fed up'], pos: 'phrase', level: 'B1', category: 'idioms' },
  { id: 'b1v075', de: 'ins Fettnäpfchen treten', en: ['to put one’s foot in it'], pos: 'phrase', level: 'B1', category: 'idioms' },
  { id: 'b1v076', de: 'um den heißen Brei reden', en: ['to beat around the bush'], pos: 'phrase', level: 'B1', category: 'idioms' },
  { id: 'b1v077', de: 'zwei Fliegen mit einer Klappe', en: ['two birds with one stone'], pos: 'phrase', level: 'B1', category: 'idioms' },
  { id: 'b1v078', de: 'Hals- und Beinbruch', en: ['break a leg', 'good luck'], pos: 'phrase', level: 'B1', category: 'idioms' },
];
