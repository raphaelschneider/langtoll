import type { VocabItem } from '@/content/german/types';

// Brazilian Portuguese (pt-BR) B1 vocabulary. The `de` field holds the
// Portuguese text (see the note in content/german/types.ts). Nouns include the
// article (o/a) since knowing gender is part of the exercise.
//
// B1 is the register of actual argument: opinions and how to defend them,
// work and career, society and the news, the environment, abstract nouns and
// the discourse connectors that hold a subordinate clause together. Nothing
// here repeats the A1/A2 packs — no greetings, no food, no daily routine.
//
// `gloss` carries the other UI locales. English lives in `en` and is the
// guaranteed fallback; Portuguese itself is never glossed (a Portuguese-UI
// user is never offered Portuguese to learn), so each item covers de/es/fr/it.

export const B1_VOCAB: VocabItem[] = [
  // ── opinion & argument ────────────────────────────────────────────────
  { id: 'pt3v001', de: 'a opinião', en: ['the opinion'], gloss: { de: ['die Meinung'], es: ['la opinión'], fr: ['l’opinion'], it: ['l’opinione'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'pt3v002', de: 'o ponto de vista', en: ['the point of view'], gloss: { de: ['der Standpunkt'], es: ['el punto de vista'], fr: ['le point de vue'], it: ['il punto di vista'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'pt3v003', de: 'a vantagem', en: ['the advantage'], gloss: { de: ['der Vorteil'], es: ['la ventaja'], fr: ['l’avantage'], it: ['il vantaggio'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'pt3v004', de: 'a desvantagem', en: ['the disadvantage', 'the drawback'], gloss: { de: ['der Nachteil'], es: ['la desventaja'], fr: ['l’inconvénient'], it: ['lo svantaggio'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'pt3v005', de: 'o argumento', en: ['the argument (reasoning)'], gloss: { de: ['das Argument'], es: ['el argumento'], fr: ['l’argument'], it: ['l’argomento'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'pt3v006', de: 'concordar', en: ['to agree'], gloss: { de: ['zustimmen'], es: ['estar de acuerdo'], fr: ['être d’accord'], it: ['essere d’accordo'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'pt3v007', de: 'discordar', en: ['to disagree'], gloss: { de: ['widersprechen'], es: ['discrepar'], fr: ['ne pas être d’accord'], it: ['dissentire'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'pt3v008', de: 'convencer', en: ['to convince'], gloss: { de: ['überzeugen'], es: ['convencer'], fr: ['convaincre'], it: ['convincere'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'pt3v009', de: 'duvidar', en: ['to doubt'], gloss: { de: ['bezweifeln'], es: ['dudar'], fr: ['douter'], it: ['dubitare'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'pt3v010', de: 'na minha opinião', en: ['in my opinion'], gloss: { de: ['meiner Meinung nach'], es: ['en mi opinión'], fr: ['à mon avis'], it: ['secondo me'] }, pos: 'phrase', level: 'B1', category: 'opinion' },

  // ── work & career ─────────────────────────────────────────────────────
  { id: 'pt3v011', de: 'a carreira', en: ['the career'], gloss: { de: ['die Karriere'], es: ['la carrera profesional'], fr: ['la carrière'], it: ['la carriera'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'pt3v012', de: 'o desempenho', en: ['the performance'], gloss: { de: ['die Leistung'], es: ['el rendimiento'], fr: ['la performance'], it: ['il rendimento'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'pt3v013', de: 'o cargo', en: ['the position', 'the post'], gloss: { de: ['die Stelle'], es: ['el cargo'], fr: ['le poste'], it: ['la posizione'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'pt3v014', de: 'a entrevista de emprego', en: ['the job interview'], gloss: { de: ['das Vorstellungsgespräch'], es: ['la entrevista de trabajo'], fr: ['l’entretien d’embauche'], it: ['il colloquio di lavoro'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'pt3v015', de: 'o currículo', en: ['the CV', 'the CV'], gloss: { de: ['der Lebenslauf'], es: ['el currículum'], fr: ['le CV'], it: ['il curriculum'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'pt3v016', de: 'a remuneração', en: ['the remuneration', 'the compensation'], gloss: { de: ['die Vergütung'], es: ['la remuneración'], fr: ['la rémunération'], it: ['la retribuzione'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'pt3v017', de: 'a produtividade', en: ['the productivity'], gloss: { de: ['die Produktivität'], es: ['la productividad'], fr: ['la productivité'], it: ['la produttività'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'pt3v018', de: 'o prazo', en: ['the deadline'], gloss: { de: ['die Frist'], es: ['el plazo'], fr: ['le délai'], it: ['la scadenza'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'pt3v019', de: 'contratar', en: ['to hire'], gloss: { de: ['einstellen'], es: ['contratar'], fr: ['embaucher'], it: ['assumere'] }, pos: 'verb', level: 'B1', category: 'work' },
  { id: 'pt3v020', de: 'demitir', en: ['to fire', 'to make redundant'], gloss: { de: ['entlassen'], es: ['despedir'], fr: ['licencier'], it: ['licenziare'] }, pos: 'verb', level: 'B1', category: 'work' },

  // ── society & politics ────────────────────────────────────────────────
  { id: 'pt3v021', de: 'a sociedade', en: ['the society'], gloss: { de: ['die Gesellschaft'], es: ['la sociedad'], fr: ['la société'], it: ['la società'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'pt3v022', de: 'o governo', en: ['the government'], gloss: { de: ['die Regierung'], es: ['el gobierno'], fr: ['le gouvernement'], it: ['il governo'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'pt3v023', de: 'a lei', en: ['the law'], gloss: { de: ['das Gesetz'], es: ['la ley'], fr: ['la loi'], it: ['la legge'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'pt3v024', de: 'a eleição', en: ['the election'], gloss: { de: ['die Wahl'], es: ['la elección'], fr: ['l’élection'], it: ['l’elezione'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'pt3v025', de: 'o direito', en: ['the right (entitlement)'], gloss: { de: ['das Recht'], es: ['el derecho'], fr: ['le droit'], it: ['il diritto'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'pt3v026', de: 'a desigualdade', en: ['the inequality'], gloss: { de: ['die Ungleichheit'], es: ['la desigualdad'], fr: ['l’inégalité'], it: ['la disuguaglianza'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'pt3v027', de: 'a pobreza', en: ['the poverty'], gloss: { de: ['die Armut'], es: ['la pobreza'], fr: ['la pauvreté'], it: ['la povertà'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'pt3v028', de: 'o desemprego', en: ['the unemployment'], gloss: { de: ['die Arbeitslosigkeit'], es: ['el desempleo'], fr: ['le chômage'], it: ['la disoccupazione'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'pt3v029', de: 'o imposto', en: ['the tax'], gloss: { de: ['die Steuer'], es: ['el impuesto'], fr: ['l’impôt'], it: ['la tassa'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'pt3v030', de: 'a cidadania', en: ['the citizenship'], gloss: { de: ['die Staatsbürgerschaft'], es: ['la ciudadanía'], fr: ['la citoyenneté'], it: ['la cittadinanza'] }, pos: 'noun', level: 'B1', category: 'society' },

  // ── media & news ──────────────────────────────────────────────────────
  { id: 'pt3v031', de: 'a notícia', en: ['the news item', 'the piece of news'], gloss: { de: ['die Nachricht'], es: ['la noticia'], fr: ['la nouvelle'], it: ['la notizia'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'pt3v032', de: 'o jornal', en: ['the newspaper'], gloss: { de: ['die Zeitung'], es: ['el periódico'], fr: ['le journal'], it: ['il giornale'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'pt3v033', de: 'a imprensa', en: ['the press'], gloss: { de: ['die Presse'], es: ['la prensa'], fr: ['la presse'], it: ['la stampa'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'pt3v034', de: 'a reportagem', en: ['the report', 'the news story'], gloss: { de: ['die Reportage'], es: ['el reportaje'], fr: ['le reportage'], it: ['il servizio'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'pt3v035', de: 'a entrevista', en: ['the interview'], gloss: { de: ['das Interview'], es: ['la entrevista'], fr: ['l’interview'], it: ['l’intervista'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'pt3v036', de: 'a manchete', en: ['the headline'], gloss: { de: ['die Schlagzeile'], es: ['el titular'], fr: ['le gros titre'], it: ['il titolo di prima pagina'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'pt3v037', de: 'a fonte', en: ['the source'], gloss: { de: ['die Quelle'], es: ['la fuente'], fr: ['la source'], it: ['la fonte'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'pt3v038', de: 'a rede social', en: ['the social network'], gloss: { de: ['das soziale Netzwerk'], es: ['la red social'], fr: ['le réseau social'], it: ['il social network'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'pt3v039', de: 'a publicidade', en: ['the advertising'], gloss: { de: ['die Werbung'], es: ['la publicidad'], fr: ['la publicité'], it: ['la pubblicità'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'pt3v040', de: 'divulgar', en: ['to spread', 'to publicise'], gloss: { de: ['verbreiten'], es: ['divulgar'], fr: ['diffuser'], it: ['divulgare'] }, pos: 'verb', level: 'B1', category: 'media' },

  // ── environment ───────────────────────────────────────────────────────
  { id: 'pt3v041', de: 'o meio ambiente', en: ['the environment'], gloss: { de: ['die Umwelt'], es: ['el medio ambiente'], fr: ['l’environnement'], it: ['l’ambiente'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'pt3v042', de: 'as mudanças climáticas', en: ['the climate change'], gloss: { de: ['der Klimawandel'], es: ['el cambio climático'], fr: ['le changement climatique'], it: ['il cambiamento climatico'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'pt3v043', de: 'a poluição', en: ['the pollution'], gloss: { de: ['die Verschmutzung'], es: ['la contaminación'], fr: ['la pollution'], it: ['l’inquinamento'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'pt3v044', de: 'o lixo', en: ['the rubbish', 'the waste'], gloss: { de: ['der Müll'], es: ['la basura'], fr: ['les ordures'], it: ['la spazzatura'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'pt3v045', de: 'a reciclagem', en: ['the recycling'], gloss: { de: ['das Recycling'], es: ['el reciclaje'], fr: ['le recyclage'], it: ['il riciclaggio'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'pt3v046', de: 'o desmatamento', en: ['the deforestation'], gloss: { de: ['die Abholzung'], es: ['la deforestación'], fr: ['la déforestation'], it: ['la deforestazione'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'pt3v047', de: 'a energia renovável', en: ['the renewable energy'], gloss: { de: ['die erneuerbare Energie'], es: ['la energía renovable'], fr: ['l’énergie renouvelable'], it: ['l’energia rinnovabile'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'pt3v048', de: 'poluir', en: ['to pollute'], gloss: { de: ['verschmutzen'], es: ['contaminar'], fr: ['polluer'], it: ['inquinare'] }, pos: 'verb', level: 'B1', category: 'environment' },
  { id: 'pt3v049', de: 'preservar', en: ['to preserve'], gloss: { de: ['bewahren'], es: ['preservar'], fr: ['préserver'], it: ['preservare'] }, pos: 'verb', level: 'B1', category: 'environment' },
  { id: 'pt3v050', de: 'sustentável', en: ['sustainable'], gloss: { de: ['nachhaltig'], es: ['sostenible'], fr: ['durable'], it: ['sostenibile'] }, pos: 'adj', level: 'B1', category: 'environment' },

  // ── abstract nouns ────────────────────────────────────────────────────
  { id: 'pt3v051', de: 'a liberdade', en: ['the freedom'], gloss: { de: ['die Freiheit'], es: ['la libertad'], fr: ['la liberté'], it: ['la libertà'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'pt3v052', de: 'o desenvolvimento', en: ['the development'], gloss: { de: ['die Entwicklung'], es: ['el desarrollo'], fr: ['le développement'], it: ['lo sviluppo'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'pt3v053', de: 'a igualdade', en: ['the equality'], gloss: { de: ['die Gleichheit'], es: ['la igualdad'], fr: ['l’égalité'], it: ['l’uguaglianza'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'pt3v054', de: 'o conhecimento', en: ['the knowledge'], gloss: { de: ['das Wissen'], es: ['el conocimiento'], fr: ['la connaissance'], it: ['la conoscenza'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'pt3v055', de: 'a realidade', en: ['the reality'], gloss: { de: ['die Realität'], es: ['la realidad'], fr: ['la réalité'], it: ['la realtà'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'pt3v056', de: 'o objetivo', en: ['the goal', 'the objective'], gloss: { de: ['das Ziel'], es: ['el objetivo'], fr: ['l’objectif'], it: ['l’obiettivo'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'pt3v057', de: 'a mudança', en: ['the change'], gloss: { de: ['die Veränderung'], es: ['el cambio'], fr: ['le changement'], it: ['il cambiamento'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'pt3v058', de: 'o esforço', en: ['the effort'], gloss: { de: ['die Anstrengung'], es: ['el esfuerzo'], fr: ['l’effort'], it: ['lo sforzo'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'pt3v059', de: 'a consciência', en: ['the awareness', 'the conscience'], gloss: { de: ['das Bewusstsein'], es: ['la conciencia'], fr: ['la conscience'], it: ['la coscienza'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'pt3v060', de: 'o sentido', en: ['the meaning', 'the sense'], gloss: { de: ['der Sinn'], es: ['el sentido'], fr: ['le sens'], it: ['il senso'] }, pos: 'noun', level: 'B1', category: 'abstract' },

  // ── connectors & discourse markers ────────────────────────────────────
  { id: 'pt3v061', de: 'no entanto', en: ['however', 'nevertheless'], gloss: { de: ['jedoch'], es: ['sin embargo'], fr: ['cependant'], it: ['tuttavia'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'pt3v062', de: 'portanto', en: ['therefore'], gloss: { de: ['deshalb'], es: ['por lo tanto'], fr: ['donc'], it: ['quindi'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'pt3v063', de: 'embora', en: ['although', 'even though'], gloss: { de: ['obwohl'], es: ['aunque'], fr: ['bien que'], it: ['benché'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'pt3v064', de: 'apesar de', en: ['despite', 'in spite of'], gloss: { de: ['trotz'], es: ['a pesar de'], fr: ['malgré'], it: ['nonostante'] }, pos: 'prep', level: 'B1', category: 'connectors' },
  { id: 'pt3v065', de: 'além disso', en: ['besides', 'moreover'], gloss: { de: ['außerdem'], es: ['además'], fr: ['de plus'], it: ['inoltre'] }, pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'pt3v066', de: 'por isso', en: ['that is why', 'for that reason'], gloss: { de: ['darum'], es: ['por eso'], fr: ['c’est pourquoi'], it: ['perciò'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'pt3v067', de: 'ou seja', en: ['that is to say', 'in other words'], gloss: { de: ['das heißt'], es: ['o sea'], fr: ['c’est-à-dire'], it: ['cioè'] }, pos: 'phrase', level: 'B1', category: 'connectors' },
  { id: 'pt3v068', de: 'desde que', en: ['as long as', 'provided that'], gloss: { de: ['sofern'], es: ['siempre que'], fr: ['à condition que'], it: ['purché'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'pt3v069', de: 'enquanto', en: ['while', 'whereas'], gloss: { de: ['während'], es: ['mientras'], fr: ['pendant que'], it: ['mentre'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'pt3v070', de: 'caso', en: ['in case', 'if'], gloss: { de: ['falls'], es: ['en caso de que'], fr: ['au cas où'], it: ['nel caso in cui'] }, pos: 'conj', level: 'B1', category: 'connectors' },

  // ── emotions & inner states ───────────────────────────────────────────
  { id: 'pt3v071', de: 'a preocupação', en: ['the worry', 'the concern'], gloss: { de: ['die Sorge'], es: ['la preocupación'], fr: ['l’inquiétude'], it: ['la preoccupazione'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'pt3v072', de: 'a decepção', en: ['the disappointment'], gloss: { de: ['die Enttäuschung'], es: ['la decepción'], fr: ['la déception'], it: ['la delusione'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'pt3v073', de: 'o orgulho', en: ['the pride'], gloss: { de: ['der Stolz'], es: ['el orgullo'], fr: ['la fierté'], it: ['l’orgoglio'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'pt3v074', de: 'a vergonha', en: ['the shame', 'the embarrassment'], gloss: { de: ['die Scham'], es: ['la vergüenza'], fr: ['la honte'], it: ['la vergogna'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'pt3v075', de: 'o alívio', en: ['the relief'], gloss: { de: ['die Erleichterung'], es: ['el alivio'], fr: ['le soulagement'], it: ['il sollievo'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'pt3v076', de: 'a raiva', en: ['the anger'], gloss: { de: ['die Wut'], es: ['la rabia'], fr: ['la colère'], it: ['la rabbia'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'pt3v077', de: 'o receio', en: ['the apprehension', 'the fear'], gloss: { de: ['die Befürchtung'], es: ['el temor'], fr: ['la crainte'], it: ['il timore'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'pt3v078', de: 'a confiança', en: ['the trust', 'the confidence'], gloss: { de: ['das Vertrauen'], es: ['la confianza'], fr: ['la confiance'], it: ['la fiducia'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'pt3v079', de: 'arrepender-se', en: ['to regret'], gloss: { de: ['bereuen'], es: ['arrepentirse'], fr: ['regretter'], it: ['pentirsi'] }, pos: 'verb', level: 'B1', category: 'emotions' },
  { id: 'pt3v080', de: 'emocionar-se', en: ['to be moved', 'to get emotional'], gloss: { de: ['gerührt sein'], es: ['emocionarse'], fr: ['être ému'], it: ['commuoversi'] }, pos: 'verb', level: 'B1', category: 'emotions' },

  // ── abstract verbs ────────────────────────────────────────────────────
  { id: 'pt3v081', de: 'alcançar', en: ['to achieve', 'to reach'], gloss: { de: ['erreichen'], es: ['alcanzar'], fr: ['atteindre'], it: ['raggiungere'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'pt3v082', de: 'melhorar', en: ['to improve'], gloss: { de: ['verbessern'], es: ['mejorar'], fr: ['améliorer'], it: ['migliorare'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'pt3v083', de: 'desenvolver', en: ['to develop'], gloss: { de: ['entwickeln'], es: ['desarrollar'], fr: ['développer'], it: ['sviluppare'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'pt3v084', de: 'exigir', en: ['to demand', 'to require'], gloss: { de: ['verlangen'], es: ['exigir'], fr: ['exiger'], it: ['esigere'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'pt3v085', de: 'permitir', en: ['to allow'], gloss: { de: ['erlauben'], es: ['permitir'], fr: ['permettre'], it: ['permettere'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'pt3v086', de: 'evitar', en: ['to avoid'], gloss: { de: ['vermeiden'], es: ['evitar'], fr: ['éviter'], it: ['evitare'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'pt3v087', de: 'perceber', en: ['to notice', 'to realise'], gloss: { de: ['bemerken'], es: ['darse cuenta'], fr: ['se rendre compte'], it: ['accorgersi'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'pt3v088', de: 'reconhecer', en: ['to recognise', 'to acknowledge'], gloss: { de: ['anerkennen'], es: ['reconocer'], fr: ['reconnaître'], it: ['riconoscere'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'pt3v089', de: 'investir', en: ['to invest'], gloss: { de: ['investieren'], es: ['invertir'], fr: ['investir'], it: ['investire'] }, pos: 'verb', level: 'B1', category: 'verbs' },
  { id: 'pt3v090', de: 'enfrentar', en: ['to face', 'to confront'], gloss: { de: ['sich stellen'], es: ['enfrentar'], fr: ['affronter'], it: ['affrontare'] }, pos: 'verb', level: 'B1', category: 'verbs' },

  // ── adjectives ────────────────────────────────────────────────────────
  { id: 'pt3v091', de: 'exigente', en: ['demanding'], gloss: { de: ['anspruchsvoll'], es: ['exigente'], fr: ['exigeant'], it: ['esigente'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'pt3v092', de: 'capaz', en: ['capable', 'able'], gloss: { de: ['fähig'], es: ['capaz'], fr: ['capable'], it: ['capace'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'pt3v093', de: 'disposto', en: ['willing'], gloss: { de: ['bereit'], es: ['dispuesto'], fr: ['disposé'], it: ['disposto'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'pt3v094', de: 'preocupante', en: ['worrying', 'concerning'], gloss: { de: ['besorgniserregend'], es: ['preocupante'], fr: ['inquiétant'], it: ['preoccupante'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'pt3v095', de: 'imprescindível', en: ['essential', 'indispensable'], gloss: { de: ['unerlässlich'], es: ['imprescindible'], fr: ['indispensable'], it: ['indispensabile'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'pt3v096', de: 'eficaz', en: ['effective'], gloss: { de: ['wirksam'], es: ['eficaz'], fr: ['efficace'], it: ['efficace'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'pt3v097', de: 'justo', en: ['fair', 'just'], gloss: { de: ['gerecht'], es: ['justo'], fr: ['juste'], it: ['giusto'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'pt3v098', de: 'complexo', en: ['complex'], gloss: { de: ['komplex'], es: ['complejo'], fr: ['complexe'], it: ['complesso'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'pt3v099', de: 'acessível', en: ['affordable', 'accessible'], gloss: { de: ['erschwinglich'], es: ['asequible'], fr: ['abordable'], it: ['accessibile'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'pt3v100', de: 'surpreendente', en: ['surprising'], gloss: { de: ['überraschend'], es: ['sorprendente'], fr: ['surprenant'], it: ['sorprendente'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
];
