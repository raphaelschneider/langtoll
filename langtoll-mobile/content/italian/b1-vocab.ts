import type { VocabItem } from '@/content/german/types';

// Italian (it-IT) B1 vocabulary. The `de` field holds the Italian text (see the
// note in content/german/types.ts). Nouns ship with the article, chosen by the
// SOUND that follows: il (most consonants), lo (s+consonant, z, gn, ps, y),
// l' (any vowel), la (feminine + consonant) — lo sviluppo, l'impegno,
// l'ambiente, la libertà.
//
// Level discipline: A1 owns greetings/people/food/places/core verbs/numbers,
// A2 owns daily routine, travel, shopping, health, weather, house. B1 is the
// register of argument — opinions defended, abstract nouns, work and society,
// media, environment, and the connectors that hold a paragraph together.
//
// `gloss` carries the other UI locales. English lives in `en` and is the
// guaranteed fallback; Italian itself is never glossed, so each item covers
// de / es / fr / pt.

export const B1_VOCAB: VocabItem[] = [
  // ── opinion & argument ────────────────────────────────────────────────
  { id: 'it3v001', de: 'l’opinione', en: ['the opinion'], gloss: { de: ['die Meinung'], es: ['la opinión'], fr: ['l’opinion'], pt: ['a opinião'] }, pos: 'noun', gender: 'f', level: 'B1', category: 'opinion' },
  { id: 'it3v002', de: 'il parere', en: ['the view', 'the opinion'], gloss: { de: ['die Ansicht'], es: ['el parecer'], fr: ['l’avis'], pt: ['a opinião'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'it3v003', de: 'a mio avviso', en: ['in my view'], gloss: { de: ['meines Erachtens'], es: ['a mi juicio'], fr: ['selon moi'], pt: ['a meu ver'] }, pos: 'phrase', level: 'B1', category: 'opinion' },
  { id: 'it3v004', de: 'il vantaggio', en: ['the advantage'], gloss: { de: ['der Vorteil'], es: ['la ventaja'], fr: ['l’avantage'], pt: ['a vantagem'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'it3v005', de: 'lo svantaggio', en: ['the disadvantage'], gloss: { de: ['der Nachteil'], es: ['la desventaja'], fr: ['l’inconvénient'], pt: ['a desvantagem'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'it3v006', de: 'essere d’accordo', en: ['to agree'], gloss: { de: ['einverstanden sein'], es: ['estar de acuerdo'], fr: ['être d’accord'], pt: ['concordar'] }, pos: 'phrase', level: 'B1', category: 'opinion' },
  { id: 'it3v007', de: 'sostenere', en: ['to maintain', 'to argue'], gloss: { de: ['behaupten'], es: ['sostener'], fr: ['soutenir'], pt: ['sustentar'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'it3v008', de: 'convincere', en: ['to convince'], gloss: { de: ['überzeugen'], es: ['convencer'], fr: ['convaincre'], pt: ['convencer'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'it3v009', de: 'la prova', en: ['the proof', 'the evidence'], gloss: { de: ['der Beweis'], es: ['la prueba'], fr: ['la preuve'], pt: ['a prova'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'it3v010', de: 'il dibattito', en: ['the debate'], gloss: { de: ['die Debatte'], es: ['el debate'], fr: ['le débat'], pt: ['o debate'] }, pos: 'noun', level: 'B1', category: 'opinion' },

  // ── work & career ─────────────────────────────────────────────────────
  { id: 'it3v011', de: 'il colloquio', en: ['the job interview'], gloss: { de: ['das Vorstellungsgespräch'], es: ['la entrevista'], fr: ['l’entretien d’embauche'], pt: ['a entrevista de emprego'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'it3v012', de: 'il curriculum', en: ['the CV', 'the résumé'], gloss: { de: ['der Lebenslauf'], es: ['el currículum'], fr: ['le CV'], pt: ['o currículo'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'it3v013', de: 'l’esperienza', en: ['the experience'], gloss: { de: ['die Erfahrung'], es: ['la experiencia'], fr: ['l’expérience'], pt: ['a experiência'] }, pos: 'noun', gender: 'f', level: 'B1', category: 'work' },
  { id: 'it3v014', de: 'la responsabilità', en: ['the responsibility'], gloss: { de: ['die Verantwortung'], es: ['la responsabilidad'], fr: ['la responsabilité'], pt: ['a responsabilidade'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'it3v015', de: 'la carriera', en: ['the career'], gloss: { de: ['die Karriere'], es: ['la carrera'], fr: ['la carrière'], pt: ['a carreira'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'it3v016', de: 'il fatturato', en: ['the turnover', 'the revenue'], gloss: { de: ['der Umsatz'], es: ['la facturación'], fr: ['le chiffre d’affaires'], pt: ['o faturamento'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'it3v017', de: 'il dipendente', en: ['the employee'], gloss: { de: ['der Angestellte'], es: ['el empleado'], fr: ['l’employé'], pt: ['o funcionário'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'it3v018', de: 'assumere', en: ['to hire'], gloss: { de: ['einstellen'], es: ['contratar'], fr: ['embaucher'], pt: ['contratar'] }, pos: 'verb', level: 'B1', category: 'work' },
  { id: 'it3v019', de: 'licenziare', en: ['to fire', 'to make redundant'], gloss: { de: ['entlassen'], es: ['despedir'], fr: ['licencier'], pt: ['demitir'] }, pos: 'verb', level: 'B1', category: 'work' },
  { id: 'it3v020', de: 'la retribuzione', en: ['the remuneration', 'the pay'], gloss: { de: ['die Vergütung'], es: ['la remuneración'], fr: ['la rémunération'], pt: ['a remuneração'] }, pos: 'noun', level: 'B1', category: 'work' },

  // ── society ───────────────────────────────────────────────────────────
  { id: 'it3v021', de: 'la società', en: ['the society'], gloss: { de: ['die Gesellschaft'], es: ['la sociedad'], fr: ['la société'], pt: ['a sociedade'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'it3v022', de: 'il governo', en: ['the government'], gloss: { de: ['die Regierung'], es: ['el gobierno'], fr: ['le gouvernement'], pt: ['o governo'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'it3v023', de: 'la legge', en: ['the law'], gloss: { de: ['das Gesetz'], es: ['la ley'], fr: ['la loi'], pt: ['a lei'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'it3v024', de: 'il diritto', en: ['the right'], gloss: { de: ['das Recht'], es: ['el derecho'], fr: ['le droit'], pt: ['o direito'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'it3v025', de: 'le elezioni', en: ['the elections'], gloss: { de: ['die Wahlen'], es: ['las elecciones'], fr: ['les élections'], pt: ['as eleições'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'it3v026', de: 'la disoccupazione', en: ['the unemployment'], gloss: { de: ['die Arbeitslosigkeit'], es: ['el desempleo'], fr: ['le chômage'], pt: ['o desemprego'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'it3v027', de: 'l’uguaglianza', en: ['the equality'], gloss: { de: ['die Gleichheit'], es: ['la igualdad'], fr: ['l’égalité'], pt: ['a igualdade'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'it3v028', de: 'la povertà', en: ['the poverty'], gloss: { de: ['die Armut'], es: ['la pobreza'], fr: ['la pauvreté'], pt: ['a pobreza'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'it3v029', de: 'il cittadino', en: ['the citizen'], gloss: { de: ['der Bürger'], es: ['el ciudadano'], fr: ['le citoyen'], pt: ['o cidadão'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'it3v030', de: 'pubblico', en: ['public'], gloss: { de: ['öffentlich'], es: ['público'], fr: ['public'], pt: ['público'] }, pos: 'adj', level: 'B1', category: 'society' },

  // ── media & news ──────────────────────────────────────────────────────
  { id: 'it3v031', de: 'il giornale', en: ['the newspaper'], gloss: { de: ['die Zeitung'], es: ['el periódico'], fr: ['le journal'], pt: ['o jornal'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'it3v032', de: 'la notizia', en: ['the news item'], gloss: { de: ['die Nachricht'], es: ['la noticia'], fr: ['la nouvelle'], pt: ['a notícia'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'it3v033', de: 'il telegiornale', en: ['the TV news'], gloss: { de: ['die Nachrichten'], es: ['el telediario'], fr: ['le journal télévisé'], pt: ['o telejornal'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'it3v034', de: 'la pubblicità', en: ['the advertising', 'the ad'], gloss: { de: ['die Werbung'], es: ['la publicidad'], fr: ['la publicité'], pt: ['a publicidade'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'it3v035', de: 'l’articolo', en: ['the article'], gloss: { de: ['der Artikel'], es: ['el artículo'], fr: ['l’article'], pt: ['o artigo'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'media' },
  { id: 'it3v036', de: 'il giornalista', en: ['the journalist'], gloss: { de: ['der Journalist'], es: ['el periodista'], fr: ['le journaliste'], pt: ['o jornalista'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'it3v037', de: 'la rete', en: ['the network'], gloss: { de: ['das Netz'], es: ['la red'], fr: ['le réseau'], pt: ['a rede'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'it3v038', de: 'il sondaggio', en: ['the poll', 'the survey'], gloss: { de: ['die Umfrage'], es: ['la encuesta'], fr: ['le sondage'], pt: ['a pesquisa'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'it3v039', de: 'diffondere', en: ['to spread', 'to broadcast'], gloss: { de: ['verbreiten'], es: ['difundir'], fr: ['diffuser'], pt: ['difundir'] }, pos: 'verb', level: 'B1', category: 'media' },

  // ── environment ───────────────────────────────────────────────────────
  { id: 'it3v040', de: 'l’ambiente', en: ['the environment'], gloss: { de: ['die Umwelt'], es: ['el medio ambiente'], fr: ['l’environnement'], pt: ['o meio ambiente'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'environment' },
  { id: 'it3v041', de: 'l’inquinamento', en: ['the pollution'], gloss: { de: ['die Verschmutzung'], es: ['la contaminación'], fr: ['la pollution'], pt: ['a poluição'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'it3v042', de: 'il riciclaggio', en: ['the recycling'], gloss: { de: ['das Recycling'], es: ['el reciclaje'], fr: ['le recyclage'], pt: ['a reciclagem'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'it3v043', de: 'i rifiuti', en: ['the waste', 'the rubbish'], gloss: { de: ['der Müll'], es: ['la basura'], fr: ['les déchets'], pt: ['o lixo'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'it3v044', de: 'il clima', en: ['the climate'], gloss: { de: ['das Klima'], es: ['el clima'], fr: ['le climat'], pt: ['o clima'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'it3v045', de: 'l’energia', en: ['the energy'], gloss: { de: ['die Energie'], es: ['la energía'], fr: ['l’énergie'], pt: ['a energia'] }, pos: 'noun', gender: 'f', level: 'B1', category: 'environment' },
  { id: 'it3v046', de: 'lo spreco', en: ['the waste', 'the squandering'], gloss: { de: ['die Verschwendung'], es: ['el derroche'], fr: ['le gaspillage'], pt: ['o desperdício'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'it3v047', de: 'sostenibile', en: ['sustainable'], gloss: { de: ['nachhaltig'], es: ['sostenible'], fr: ['durable'], pt: ['sustentável'] }, pos: 'adj', level: 'B1', category: 'environment' },
  { id: 'it3v048', de: 'inquinare', en: ['to pollute'], gloss: { de: ['verschmutzen'], es: ['contaminar'], fr: ['polluer'], pt: ['poluir'] }, pos: 'verb', level: 'B1', category: 'environment' },

  // ── abstract nouns ────────────────────────────────────────────────────
  { id: 'it3v049', de: 'la libertà', en: ['the freedom'], gloss: { de: ['die Freiheit'], es: ['la libertad'], fr: ['la liberté'], pt: ['a liberdade'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'it3v050', de: 'lo sviluppo', en: ['the development'], gloss: { de: ['die Entwicklung'], es: ['el desarrollo'], fr: ['le développement'], pt: ['o desenvolvimento'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'it3v051', de: 'l’impegno', en: ['the commitment'], gloss: { de: ['das Engagement'], es: ['el compromiso'], fr: ['l’engagement'], pt: ['o compromisso'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'abstract' },
  { id: 'it3v052', de: 'la fiducia', en: ['the trust', 'the confidence'], gloss: { de: ['das Vertrauen'], es: ['la confianza'], fr: ['la confiance'], pt: ['a confiança'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'it3v053', de: 'la speranza', en: ['the hope'], gloss: { de: ['die Hoffnung'], es: ['la esperanza'], fr: ['l’espoir'], pt: ['a esperança'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'it3v054', de: 'il senso', en: ['the meaning', 'the sense'], gloss: { de: ['der Sinn'], es: ['el sentido'], fr: ['le sens'], pt: ['o sentido'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'it3v055', de: 'la scelta', en: ['the choice'], gloss: { de: ['die Wahl'], es: ['la elección'], fr: ['le choix'], pt: ['a escolha'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'it3v056', de: 'il dubbio', en: ['the doubt'], gloss: { de: ['der Zweifel'], es: ['la duda'], fr: ['le doute'], pt: ['a dúvida'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'it3v057', de: 'lo scopo', en: ['the purpose', 'the aim'], gloss: { de: ['der Zweck'], es: ['el propósito'], fr: ['le but'], pt: ['o objetivo'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'it3v058', de: 'la realtà', en: ['the reality'], gloss: { de: ['die Realität'], es: ['la realidad'], fr: ['la réalité'], pt: ['a realidade'] }, pos: 'noun', level: 'B1', category: 'abstract' },

  // ── discourse connectors ──────────────────────────────────────────────
  { id: 'it3v059', de: 'tuttavia', en: ['however', 'nevertheless'], gloss: { de: ['jedoch'], es: ['sin embargo'], fr: ['cependant'], pt: ['no entanto'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'it3v060', de: 'quindi', en: ['therefore', 'so'], gloss: { de: ['also'], es: ['por lo tanto'], fr: ['donc'], pt: ['portanto'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'it3v061', de: 'benché', en: ['although'], gloss: { de: ['obwohl'], es: ['aunque'], fr: ['bien que'], pt: ['embora'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'it3v062', de: 'nonostante', en: ['despite', 'even though'], gloss: { de: ['trotz'], es: ['a pesar de'], fr: ['malgré'], pt: ['apesar de'] }, pos: 'prep', level: 'B1', category: 'connectors' },
  { id: 'it3v063', de: 'inoltre', en: ['moreover', 'furthermore'], gloss: { de: ['außerdem'], es: ['además'], fr: ['en outre'], pt: ['além disso'] }, pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'it3v064', de: 'invece', en: ['instead', 'on the other hand'], gloss: { de: ['stattdessen'], es: ['en cambio'], fr: ['en revanche'], pt: ['em vez disso'] }, pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'it3v065', de: 'sebbene', en: ['although', 'even though'], gloss: { de: ['obgleich'], es: ['aunque'], fr: ['quoique'], pt: ['ainda que'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'it3v066', de: 'affinché', en: ['so that', 'in order that'], gloss: { de: ['damit'], es: ['para que'], fr: ['afin que'], pt: ['para que'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'it3v067', de: 'perciò', en: ['therefore', 'that is why'], gloss: { de: ['deshalb'], es: ['por eso'], fr: ['c’est pourquoi'], pt: ['por isso'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'it3v068', de: 'altrimenti', en: ['otherwise'], gloss: { de: ['sonst'], es: ['si no'], fr: ['sinon'], pt: ['senão'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'it3v069', de: 'anzi', en: ['on the contrary', 'rather'], gloss: { de: ['im Gegenteil'], es: ['al contrario'], fr: ['au contraire'], pt: ['pelo contrário'] }, pos: 'adv', level: 'B1', category: 'connectors' },

  // ── emotions & inner life ─────────────────────────────────────────────
  { id: 'it3v070', de: 'la rabbia', en: ['the anger'], gloss: { de: ['die Wut'], es: ['la rabia'], fr: ['la colère'], pt: ['a raiva'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'it3v071', de: 'la tristezza', en: ['the sadness'], gloss: { de: ['die Traurigkeit'], es: ['la tristeza'], fr: ['la tristesse'], pt: ['a tristeza'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'it3v072', de: 'l’orgoglio', en: ['the pride'], gloss: { de: ['der Stolz'], es: ['el orgullo'], fr: ['la fierté'], pt: ['o orgulho'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'it3v073', de: 'la delusione', en: ['the disappointment'], gloss: { de: ['die Enttäuschung'], es: ['la decepción'], fr: ['la déception'], pt: ['a decepção'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'it3v074', de: 'la preoccupazione', en: ['the worry', 'the concern'], gloss: { de: ['die Sorge'], es: ['la preocupación'], fr: ['l’inquiétude'], pt: ['a preocupação'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'it3v075', de: 'la vergogna', en: ['the shame'], gloss: { de: ['die Scham'], es: ['la vergüenza'], fr: ['la honte'], pt: ['a vergonha'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'it3v076', de: 'commosso', en: ['moved', 'touched'], gloss: { de: ['gerührt'], es: ['conmovido'], fr: ['ému'], pt: ['comovido'] }, pos: 'adj', level: 'B1', category: 'emotions' },
  { id: 'it3v077', de: 'deluso', en: ['disappointed'], gloss: { de: ['enttäuscht'], es: ['decepcionado'], fr: ['déçu'], pt: ['decepcionado'] }, pos: 'adj', level: 'B1', category: 'emotions' },
  { id: 'it3v078', de: 'arrabbiarsi', en: ['to get angry'], gloss: { de: ['sich ärgern'], es: ['enfadarse'], fr: ['se fâcher'], pt: ['irritar-se'] }, pos: 'verb', level: 'B1', category: 'emotions' },

  // ── education & knowledge ─────────────────────────────────────────────
  { id: 'it3v079', de: 'la formazione', en: ['the training', 'the education'], gloss: { de: ['die Ausbildung'], es: ['la formación'], fr: ['la formation'], pt: ['a formação'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'it3v080', de: 'la ricerca', en: ['the research'], gloss: { de: ['die Forschung'], es: ['la investigación'], fr: ['la recherche'], pt: ['a pesquisa'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'it3v081', de: 'l’università', en: ['the university'], gloss: { de: ['die Universität'], es: ['la universidad'], fr: ['l’université'], pt: ['a universidade'] }, pos: 'noun', gender: 'f', level: 'B1', category: 'education' },
  { id: 'it3v082', de: 'la conoscenza', en: ['the knowledge'], gloss: { de: ['das Wissen'], es: ['el conocimiento'], fr: ['la connaissance'], pt: ['o conhecimento'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'it3v083', de: 'la borsa di studio', en: ['the scholarship'], gloss: { de: ['das Stipendium'], es: ['la beca'], fr: ['la bourse d’études'], pt: ['a bolsa de estudos'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'it3v084', de: 'la laurea', en: ['the degree'], gloss: { de: ['der Hochschulabschluss'], es: ['el grado'], fr: ['le diplôme universitaire'], pt: ['a graduação'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'it3v085', de: 'approfondire', en: ['to study in depth', 'to deepen'], gloss: { de: ['vertiefen'], es: ['profundizar'], fr: ['approfondir'], pt: ['aprofundar'] }, pos: 'verb', level: 'B1', category: 'education' },
  { id: 'it3v086', de: 'la competenza', en: ['the skill', 'the competence'], gloss: { de: ['die Kompetenz'], es: ['la competencia'], fr: ['la compétence'], pt: ['a competência'] }, pos: 'noun', level: 'B1', category: 'education' },

  // ── verbs ─────────────────────────────────────────────────────────────
  { id: 'it3v087', de: 'riuscire', en: ['to succeed', 'to manage'], gloss: { de: ['schaffen'], es: ['lograr'], fr: ['réussir'], pt: ['conseguir'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v088', de: 'rendersi conto', en: ['to realise'], gloss: { de: ['sich bewusst werden'], es: ['darse cuenta'], fr: ['se rendre compte'], pt: ['dar-se conta'] }, pos: 'phrase', level: 'B1', category: 'verbs' },
  { id: 'it3v089', de: 'permettere', en: ['to allow'], gloss: { de: ['erlauben'], es: ['permitir'], fr: ['permettre'], pt: ['permitir'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v090', de: 'impedire', en: ['to prevent'], gloss: { de: ['verhindern'], es: ['impedir'], fr: ['empêcher'], pt: ['impedir'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v091', de: 'affrontare', en: ['to face', 'to tackle'], gloss: { de: ['bewältigen'], es: ['afrontar'], fr: ['affronter'], pt: ['enfrentar'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v092', de: 'migliorare', en: ['to improve'], gloss: { de: ['verbessern'], es: ['mejorar'], fr: ['améliorer'], pt: ['melhorar'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v093', de: 'peggiorare', en: ['to worsen'], gloss: { de: ['verschlechtern'], es: ['empeorar'], fr: ['empirer'], pt: ['piorar'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v094', de: 'sviluppare', en: ['to develop'], gloss: { de: ['entwickeln'], es: ['desarrollar'], fr: ['développer'], pt: ['desenvolver'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v095', de: 'proporre', en: ['to propose', 'to suggest'], gloss: { de: ['vorschlagen'], es: ['proponer'], fr: ['proposer'], pt: ['propor'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v096', de: 'evitare', en: ['to avoid'], gloss: { de: ['vermeiden'], es: ['evitar'], fr: ['éviter'], pt: ['evitar'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v097', de: 'rinunciare', en: ['to give up', 'to renounce'], gloss: { de: ['verzichten'], es: ['renunciar'], fr: ['renoncer'], pt: ['renunciar'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v098', de: 'dipendere', en: ['to depend'], gloss: { de: ['abhängen'], es: ['depender'], fr: ['dépendre'], pt: ['depender'] }, pos: 'verb', level: 'B1', category: 'verbs' },

  // ── adjectives ────────────────────────────────────────────────────────
  { id: 'it3v099', de: 'efficace', en: ['effective'], gloss: { de: ['wirksam'], es: ['eficaz'], fr: ['efficace'], pt: ['eficaz'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'it3v100', de: 'adeguato', en: ['adequate', 'suitable'], gloss: { de: ['angemessen'], es: ['adecuado'], fr: ['adéquat'], pt: ['adequado'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'it3v101', de: 'consapevole', en: ['aware'], gloss: { de: ['bewusst'], es: ['consciente'], fr: ['conscient'], pt: ['consciente'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'it3v102', de: 'discutibile', en: ['questionable', 'debatable'], gloss: { de: ['fragwürdig'], es: ['discutible'], fr: ['discutable'], pt: ['discutível'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'it3v103', de: 'inevitabile', en: ['inevitable'], gloss: { de: ['unvermeidlich'], es: ['inevitable'], fr: ['inévitable'], pt: ['inevitável'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'it3v104', de: 'complesso', en: ['complex'], gloss: { de: ['komplex'], es: ['complejo'], fr: ['complexe'], pt: ['complexo'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'it3v105', de: 'urgente', en: ['urgent'], gloss: { de: ['dringend'], es: ['urgente'], fr: ['urgent'], pt: ['urgente'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'it3v106', de: 'affidabile', en: ['reliable'], gloss: { de: ['zuverlässig'], es: ['fiable'], fr: ['fiable'], pt: ['confiável'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'it3v107', de: 'crescente', en: ['growing', 'increasing'], gloss: { de: ['wachsend'], es: ['creciente'], fr: ['croissant'], pt: ['crescente'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'it3v108', de: 'superficiale', en: ['superficial', 'shallow'], gloss: { de: ['oberflächlich'], es: ['superficial'], fr: ['superficiel'], pt: ['superficial'] }, pos: 'adj', level: 'B1', category: 'adjectives' },

  // ── economy & money ───────────────────────────────────────────────────
  { id: 'it3v109', de: 'l’economia', en: ['the economy'], gloss: { de: ['die Wirtschaft'], es: ['la economía'], fr: ['l’économie'], pt: ['a economia'] }, pos: 'noun', gender: 'f', level: 'B1', category: 'economy' },
  { id: 'it3v110', de: 'il reddito', en: ['the income'], gloss: { de: ['das Einkommen'], es: ['la renta'], fr: ['le revenu'], pt: ['a renda'] }, pos: 'noun', level: 'B1', category: 'economy' },
  { id: 'it3v111', de: 'la tassa', en: ['the tax'], gloss: { de: ['die Steuer'], es: ['el impuesto'], fr: ['l’impôt'], pt: ['o imposto'] }, pos: 'noun', level: 'B1', category: 'economy' },
  { id: 'it3v112', de: 'il risparmio', en: ['the saving'], gloss: { de: ['die Ersparnis'], es: ['el ahorro'], fr: ['l’épargne'], pt: ['a poupança'] }, pos: 'noun', level: 'B1', category: 'economy' },
  { id: 'it3v113', de: 'l’investimento', en: ['the investment'], gloss: { de: ['die Investition'], es: ['la inversión'], fr: ['l’investissement'], pt: ['o investimento'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'economy' },
  { id: 'it3v114', de: 'il debito', en: ['the debt'], gloss: { de: ['die Schuld'], es: ['la deuda'], fr: ['la dette'], pt: ['a dívida'] }, pos: 'noun', level: 'B1', category: 'economy' },
  { id: 'it3v115', de: 'la crescita', en: ['the growth'], gloss: { de: ['das Wachstum'], es: ['el crecimiento'], fr: ['la croissance'], pt: ['o crescimento'] }, pos: 'noun', level: 'B1', category: 'economy' },
  { id: 'it3v116', de: 'il bilancio', en: ['the budget', 'the balance sheet'], gloss: { de: ['der Haushalt'], es: ['el presupuesto'], fr: ['le budget'], pt: ['o orçamento'] }, pos: 'noun', level: 'B1', category: 'economy' },

  // ── technology & innovation ───────────────────────────────────────────
  { id: 'it3v117', de: 'la tecnologia', en: ['the technology'], gloss: { de: ['die Technologie'], es: ['la tecnología'], fr: ['la technologie'], pt: ['a tecnologia'] }, pos: 'noun', level: 'B1', category: 'technology' },
  { id: 'it3v118', de: 'il dispositivo', en: ['the device'], gloss: { de: ['das Gerät'], es: ['el dispositivo'], fr: ['l’appareil'], pt: ['o dispositivo'] }, pos: 'noun', level: 'B1', category: 'technology' },
  { id: 'it3v119', de: 'la connessione', en: ['the connection'], gloss: { de: ['die Verbindung'], es: ['la conexión'], fr: ['la connexion'], pt: ['a conexão'] }, pos: 'noun', level: 'B1', category: 'technology' },
  { id: 'it3v120', de: 'i dati', en: ['the data'], gloss: { de: ['die Daten'], es: ['los datos'], fr: ['les données'], pt: ['os dados'] }, pos: 'noun', level: 'B1', category: 'technology' },
  { id: 'it3v121', de: 'l’innovazione', en: ['the innovation'], gloss: { de: ['die Innovation'], es: ['la innovación'], fr: ['l’innovation'], pt: ['a inovação'] }, pos: 'noun', gender: 'f', level: 'B1', category: 'technology' },
  { id: 'it3v122', de: 'il progresso', en: ['the progress'], gloss: { de: ['der Fortschritt'], es: ['el progreso'], fr: ['le progrès'], pt: ['o progresso'] }, pos: 'noun', level: 'B1', category: 'technology' },
  { id: 'it3v123', de: 'aggiornare', en: ['to update'], gloss: { de: ['aktualisieren'], es: ['actualizar'], fr: ['mettre à jour'], pt: ['atualizar'] }, pos: 'verb', level: 'B1', category: 'technology' },

  // ── health & wellbeing ────────────────────────────────────────────────
  { id: 'it3v124', de: 'la salute', en: ['the health'], gloss: { de: ['die Gesundheit'], es: ['la salud'], fr: ['la santé'], pt: ['a saúde'] }, pos: 'noun', level: 'B1', category: 'health' },
  { id: 'it3v125', de: 'la cura', en: ['the treatment', 'the care'], gloss: { de: ['die Behandlung'], es: ['el tratamiento'], fr: ['le traitement'], pt: ['o tratamento'] }, pos: 'noun', level: 'B1', category: 'health' },
  { id: 'it3v126', de: 'la prevenzione', en: ['the prevention'], gloss: { de: ['die Vorbeugung'], es: ['la prevención'], fr: ['la prévention'], pt: ['a prevenção'] }, pos: 'noun', level: 'B1', category: 'health' },
  { id: 'it3v127', de: 'lo stress', en: ['the stress'], gloss: { de: ['der Stress'], es: ['el estrés'], fr: ['le stress'], pt: ['o estresse'] }, pos: 'noun', level: 'B1', category: 'health' },
  { id: 'it3v128', de: 'il benessere', en: ['the wellbeing'], gloss: { de: ['das Wohlbefinden'], es: ['el bienestar'], fr: ['le bien-être'], pt: ['o bem-estar'] }, pos: 'noun', level: 'B1', category: 'health' },
  { id: 'it3v129', de: 'guarire', en: ['to recover', 'to heal'], gloss: { de: ['heilen'], es: ['curarse'], fr: ['guérir'], pt: ['curar-se'] }, pos: 'verb', level: 'B1', category: 'health' },

  // ── culture & the arts ────────────────────────────────────────────────
  { id: 'it3v130', de: 'la cultura', en: ['the culture'], gloss: { de: ['die Kultur'], es: ['la cultura'], fr: ['la culture'], pt: ['a cultura'] }, pos: 'noun', level: 'B1', category: 'culture' },
  { id: 'it3v131', de: 'l’opera', en: ['the work'], gloss: { de: ['das Werk'], es: ['la obra'], fr: ['l’œuvre'], pt: ['a obra'] }, pos: 'noun', gender: 'f', level: 'B1', category: 'culture' },
  { id: 'it3v132', de: 'il romanzo', en: ['the novel'], gloss: { de: ['der Roman'], es: ['la novela'], fr: ['le roman'], pt: ['o romance'] }, pos: 'noun', level: 'B1', category: 'culture' },
  { id: 'it3v133', de: 'la mostra', en: ['the exhibition'], gloss: { de: ['die Ausstellung'], es: ['la exposición'], fr: ['l’exposition'], pt: ['a exposição'] }, pos: 'noun', level: 'B1', category: 'culture' },
  { id: 'it3v134', de: 'lo spettacolo', en: ['the show', 'the performance'], gloss: { de: ['die Vorstellung'], es: ['el espectáculo'], fr: ['le spectacle'], pt: ['o espetáculo'] }, pos: 'noun', level: 'B1', category: 'culture' },
  { id: 'it3v135', de: 'il regista', en: ['the director'], gloss: { de: ['der Regisseur'], es: ['el director'], fr: ['le réalisateur'], pt: ['o diretor'] }, pos: 'noun', level: 'B1', category: 'culture' },
  { id: 'it3v136', de: 'la trama', en: ['the plot'], gloss: { de: ['die Handlung'], es: ['la trama'], fr: ['l’intrigue'], pt: ['o enredo'] }, pos: 'noun', level: 'B1', category: 'culture' },

  // ── relationships ─────────────────────────────────────────────────────
  { id: 'it3v137', de: 'il rapporto', en: ['the relationship'], gloss: { de: ['die Beziehung'], es: ['la relación'], fr: ['la relation'], pt: ['a relação'] }, pos: 'noun', level: 'B1', category: 'relationships' },
  { id: 'it3v138', de: 'il litigio', en: ['the argument', 'the quarrel'], gloss: { de: ['der Streit'], es: ['la discusión'], fr: ['la dispute'], pt: ['a briga'] }, pos: 'noun', level: 'B1', category: 'relationships' },
  { id: 'it3v139', de: 'il compromesso', en: ['the compromise'], gloss: { de: ['der Kompromiss'], es: ['el acuerdo'], fr: ['le compromis'], pt: ['o acordo'] }, pos: 'noun', level: 'B1', category: 'relationships' },
  { id: 'it3v140', de: 'la coppia', en: ['the couple'], gloss: { de: ['das Paar'], es: ['la pareja'], fr: ['le couple'], pt: ['o casal'] }, pos: 'noun', level: 'B1', category: 'relationships' },
  { id: 'it3v141', de: 'il sostegno', en: ['the support'], gloss: { de: ['die Unterstützung'], es: ['el apoyo'], fr: ['le soutien'], pt: ['o apoio'] }, pos: 'noun', level: 'B1', category: 'relationships' },
  { id: 'it3v142', de: 'il malinteso', en: ['the misunderstanding'], gloss: { de: ['das Missverständnis'], es: ['el malentendido'], fr: ['le malentendu'], pt: ['o mal-entendido'] }, pos: 'noun', level: 'B1', category: 'relationships' },
  { id: 'it3v143', de: 'fidarsi', en: ['to trust'], gloss: { de: ['vertrauen'], es: ['fiarse'], fr: ['faire confiance'], pt: ['confiar'] }, pos: 'verb', level: 'B1', category: 'relationships' },

  // ── law & justice ─────────────────────────────────────────────────────
  { id: 'it3v144', de: 'il tribunale', en: ['the court'], gloss: { de: ['das Gericht'], es: ['el tribunal'], fr: ['le tribunal'], pt: ['o tribunal'] }, pos: 'noun', level: 'B1', category: 'law' },
  { id: 'it3v145', de: 'l’avvocato', en: ['the lawyer'], gloss: { de: ['der Anwalt'], es: ['el abogado'], fr: ['l’avocat'], pt: ['o advogado'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'law' },
  { id: 'it3v146', de: 'il reato', en: ['the offence', 'the crime'], gloss: { de: ['die Straftat'], es: ['el delito'], fr: ['le délit'], pt: ['o crime'] }, pos: 'noun', level: 'B1', category: 'law' },
  { id: 'it3v147', de: 'la giustizia', en: ['the justice'], gloss: { de: ['die Gerechtigkeit'], es: ['la justicia'], fr: ['la justice'], pt: ['a justiça'] }, pos: 'noun', level: 'B1', category: 'law' },
  { id: 'it3v148', de: 'la multa', en: ['the fine'], gloss: { de: ['die Geldstrafe'], es: ['la multa'], fr: ['l’amende'], pt: ['a multa'] }, pos: 'noun', level: 'B1', category: 'law' },
  { id: 'it3v149', de: 'vietare', en: ['to forbid'], gloss: { de: ['verbieten'], es: ['prohibir'], fr: ['interdire'], pt: ['proibir'] }, pos: 'verb', level: 'B1', category: 'law' },

  // ── reasoning ─────────────────────────────────────────────────────────
  { id: 'it3v150', de: 'il motivo', en: ['the reason'], gloss: { de: ['der Grund'], es: ['el motivo'], fr: ['la raison'], pt: ['o motivo'] }, pos: 'noun', level: 'B1', category: 'reasoning' },
  { id: 'it3v151', de: 'la causa', en: ['the cause'], gloss: { de: ['die Ursache'], es: ['la causa'], fr: ['la cause'], pt: ['a causa'] }, pos: 'noun', level: 'B1', category: 'reasoning' },
  { id: 'it3v152', de: 'la conseguenza', en: ['the consequence'], gloss: { de: ['die Folge'], es: ['la consecuencia'], fr: ['la conséquence'], pt: ['a consequência'] }, pos: 'noun', level: 'B1', category: 'reasoning' },
  { id: 'it3v153', de: 'l’ipotesi', en: ['the hypothesis'], gloss: { de: ['die Hypothese'], es: ['la hipótesis'], fr: ['l’hypothèse'], pt: ['a hipótese'] }, pos: 'noun', gender: 'f', level: 'B1', category: 'reasoning' },
  { id: 'it3v154', de: 'il fattore', en: ['the factor'], gloss: { de: ['der Faktor'], es: ['el factor'], fr: ['le facteur'], pt: ['o fator'] }, pos: 'noun', level: 'B1', category: 'reasoning' },
  { id: 'it3v155', de: 'il criterio', en: ['the criterion'], gloss: { de: ['das Kriterium'], es: ['el criterio'], fr: ['le critère'], pt: ['o critério'] }, pos: 'noun', level: 'B1', category: 'reasoning' },
  { id: 'it3v156', de: 'l’obiettivo', en: ['the objective', 'the target'], gloss: { de: ['das Ziel'], es: ['el objetivo'], fr: ['l’objectif'], pt: ['o objetivo'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'reasoning' },

  // ── more verbs ────────────────────────────────────────────────────────
  { id: 'it3v157', de: 'raggiungere', en: ['to reach', 'to achieve'], gloss: { de: ['erreichen'], es: ['alcanzar'], fr: ['atteindre'], pt: ['alcançar'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v158', de: 'ottenere', en: ['to obtain'], gloss: { de: ['erhalten'], es: ['obtener'], fr: ['obtenir'], pt: ['obter'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v159', de: 'sostituire', en: ['to replace'], gloss: { de: ['ersetzen'], es: ['sustituir'], fr: ['remplacer'], pt: ['substituir'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v160', de: 'ridurre', en: ['to reduce'], gloss: { de: ['reduzieren'], es: ['reducir'], fr: ['réduire'], pt: ['reduzir'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v161', de: 'aumentare', en: ['to increase'], gloss: { de: ['erhöhen'], es: ['aumentar'], fr: ['augmenter'], pt: ['aumentar'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v162', de: 'garantire', en: ['to guarantee'], gloss: { de: ['garantieren'], es: ['garantizar'], fr: ['garantir'], pt: ['garantir'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'it3v163', de: 'coinvolgere', en: ['to involve'], gloss: { de: ['einbeziehen'], es: ['involucrar'], fr: ['impliquer'], pt: ['envolver'] }, pos: 'verb', level: 'B1', category: 'verbs' },

  // ── more adjectives ───────────────────────────────────────────────────
  { id: 'it3v164', de: 'quotidiano', en: ['daily', 'everyday'], gloss: { de: ['täglich'], es: ['cotidiano'], fr: ['quotidien'], pt: ['cotidiano'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'it3v165', de: 'notevole', en: ['remarkable', 'considerable'], gloss: { de: ['bemerkenswert'], es: ['notable'], fr: ['remarquable'], pt: ['notável'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'it3v166', de: 'scarso', en: ['scarce', 'insufficient'], gloss: { de: ['knapp'], es: ['escaso'], fr: ['insuffisant'], pt: ['escasso'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'it3v167', de: 'diffuso', en: ['widespread'], gloss: { de: ['verbreitet'], es: ['extendido'], fr: ['répandu'], pt: ['difundido'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'it3v168', de: 'imprevisto', en: ['unexpected'], gloss: { de: ['unerwartet'], es: ['imprevisto'], fr: ['imprévu'], pt: ['imprevisto'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
];
