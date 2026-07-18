import type { VocabItem } from '@/content/german/types';

// Spanish (Peninsular (Spain)) B1 vocabulary. The `de` field holds the Spanish text
// (see the note in content/german/types.ts). Nouns include the article (el/la).
//
// B1 is where the learner stops labelling the world and starts arguing about
// it: opinions and how to defend them, abstract nouns, work and career, media,
// environment, social issues, and the discourse connectors that hold a real
// paragraph together. Nothing here repeats A1 (greetings, numbers, family,
// basic food, core verbs) or A2 (past tense basics, travel, shopping, health,
// routine, clothing, weather).
//
// `gloss` carries the other UI locales — de / fr / it / pt. English lives in
// `en` and is the guaranteed fallback; Spanish itself is never glossed.
//
// Regionalisms are avoided: where Spain and Latin America split (el enfado /
// el enojo, suspender / reprobar) we teach the form that reads as neutral on
// both sides of the Atlantic.

export const B1_VOCAB: VocabItem[] = [
  // ── opinion & argument ────────────────────────────────────────────────
  { id: 'es3v001', de: 'la opinión', en: ['the opinion'], gloss: { de: ['die Meinung'], fr: ['l’opinion'], it: ['l’opinione'], pt: ['a opinião'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'es3v002', de: 'el punto de vista', en: ['the point of view'], gloss: { de: ['der Standpunkt'], fr: ['le point de vue'], it: ['il punto di vista'], pt: ['o ponto de vista'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'es3v003', de: 'el argumento', en: ['the argument', 'the reasoning'], gloss: { de: ['das Argument'], fr: ['l’argument'], it: ['l’argomento'], pt: ['o argumento'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'es3v004', de: 'la ventaja', en: ['the advantage'], gloss: { de: ['der Vorteil'], fr: ['l’avantage'], it: ['il vantaggio'], pt: ['a vantagem'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'es3v005', de: 'la desventaja', en: ['the disadvantage', 'the drawback'], gloss: { de: ['der Nachteil'], fr: ['l’inconvénient'], it: ['lo svantaggio'], pt: ['a desvantagem'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'es3v006', de: 'estar de acuerdo', en: ['to agree'], gloss: { de: ['einverstanden sein'], fr: ['être d’accord'], it: ['essere d’accordo'], pt: ['concordar'] }, pos: 'phrase', level: 'B1', category: 'opinion' },
  { id: 'es3v007', de: 'convencer', en: ['to convince'], gloss: { de: ['überzeugen'], fr: ['convaincre'], it: ['convincere'], pt: ['convencer'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'es3v008', de: 'reconocer', en: ['to admit', 'to acknowledge'], gloss: { de: ['zugeben'], fr: ['reconnaître'], it: ['riconoscere'], pt: ['reconhecer'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'es3v009', de: 'en mi opinión', en: ['in my opinion'], gloss: { de: ['meiner Meinung nach'], fr: ['à mon avis'], it: ['secondo me'], pt: ['na minha opinião'] }, pos: 'phrase', level: 'B1', category: 'opinion' },
  { id: 'es3v010', de: 'debatir', en: ['to debate'], gloss: { de: ['debattieren'], fr: ['débattre'], it: ['dibattere'], pt: ['debater'] }, pos: 'verb', level: 'B1', category: 'opinion' },

  // ── work & career ─────────────────────────────────────────────────────
  { id: 'es3v011', de: 'el puesto', en: ['the position', 'the post'], gloss: { de: ['die Stelle'], fr: ['le poste'], it: ['la posizione'], pt: ['o cargo'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'es3v012', de: 'la remuneración', en: ['the remuneration', 'the compensation'], gloss: { de: ['die Vergütung'], fr: ['la rémunération'], it: ['la retribuzione'], pt: ['a remuneração'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'es3v013', de: 'la entrevista de trabajo', en: ['the job interview'], gloss: { de: ['das Vorstellungsgespräch'], fr: ['l’entretien d’embauche'], it: ['il colloquio di lavoro'], pt: ['a entrevista de emprego'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'es3v014', de: 'el contrato', en: ['the contract'], gloss: { de: ['der Vertrag'], fr: ['le contrat'], it: ['il contratto'], pt: ['o contrato'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'es3v015', de: 'el rendimiento', en: ['the performance', 'the output'], gloss: { de: ['die Leistung'], fr: ['la performance'], it: ['il rendimento'], pt: ['o desempenho'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'es3v016', de: 'el ascenso', en: ['the promotion'], gloss: { de: ['die Beförderung'], fr: ['la promotion'], it: ['la promozione'], pt: ['a promoção'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'es3v017', de: 'contratar', en: ['to hire'], gloss: { de: ['einstellen'], fr: ['embaucher'], it: ['assumere'], pt: ['contratar'] }, pos: 'verb', level: 'B1', category: 'work' },
  { id: 'es3v018', de: 'despedir', en: ['to fire', 'to make redundant'], gloss: { de: ['entlassen'], fr: ['licencier'], it: ['licenziare'], pt: ['demitir'] }, pos: 'verb', level: 'B1', category: 'work' },
  { id: 'es3v019', de: 'la carrera', en: ['the career'], gloss: { de: ['die Laufbahn'], fr: ['la carrière'], it: ['la carriera'], pt: ['a carreira'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'es3v020', de: 'el plazo', en: ['the deadline', 'the time limit'], gloss: { de: ['die Frist'], fr: ['le délai'], it: ['la scadenza'], pt: ['o prazo'] }, pos: 'noun', level: 'B1', category: 'work' },

  // ── society & politics ────────────────────────────────────────────────
  { id: 'es3v021', de: 'la sociedad', en: ['the society'], gloss: { de: ['die Gesellschaft'], fr: ['la société'], it: ['la società'], pt: ['a sociedade'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'es3v022', de: 'el gobierno', en: ['the government'], gloss: { de: ['die Regierung'], fr: ['le gouvernement'], it: ['il governo'], pt: ['o governo'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'es3v023', de: 'la ley', en: ['the law'], gloss: { de: ['das Gesetz'], fr: ['la loi'], it: ['la legge'], pt: ['a lei'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'es3v024', de: 'el derecho', en: ['the right'], gloss: { de: ['das Recht'], fr: ['le droit'], it: ['il diritto'], pt: ['o direito'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'es3v025', de: 'la igualdad', en: ['the equality'], gloss: { de: ['die Gleichheit'], fr: ['l’égalité'], it: ['l’uguaglianza'], pt: ['a igualdade'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'es3v026', de: 'la pobreza', en: ['the poverty'], gloss: { de: ['die Armut'], fr: ['la pauvreté'], it: ['la povertà'], pt: ['a pobreza'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'es3v027', de: 'el desempleo', en: ['the unemployment'], gloss: { de: ['die Arbeitslosigkeit'], fr: ['le chômage'], it: ['la disoccupazione'], pt: ['o desemprego'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'es3v028', de: 'la población', en: ['the population'], gloss: { de: ['die Bevölkerung'], fr: ['la population'], it: ['la popolazione'], pt: ['a população'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'es3v029', de: 'el ciudadano', en: ['the citizen'], gloss: { de: ['der Bürger'], fr: ['le citoyen'], it: ['il cittadino'], pt: ['o cidadão'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'es3v030', de: 'votar', en: ['to vote'], gloss: { de: ['wählen'], fr: ['voter'], it: ['votare'], pt: ['votar'] }, pos: 'verb', level: 'B1', category: 'society' },

  // ── media & news ──────────────────────────────────────────────────────
  { id: 'es3v031', de: 'las noticias', en: ['the news'], gloss: { de: ['die Nachrichten'], fr: ['les informations'], it: ['le notizie'], pt: ['as notícias'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'es3v032', de: 'el periódico', en: ['the newspaper'], gloss: { de: ['die Zeitung'], fr: ['le journal'], it: ['il giornale'], pt: ['o jornal'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'es3v033', de: 'el periodista', en: ['the journalist'], gloss: { de: ['der Journalist'], fr: ['le journaliste'], it: ['il giornalista'], pt: ['o jornalista'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'es3v034', de: 'el titular', en: ['the headline'], gloss: { de: ['die Schlagzeile'], fr: ['le titre'], it: ['il titolo'], pt: ['a manchete'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'es3v035', de: 'la publicidad', en: ['the advertising'], gloss: { de: ['die Werbung'], fr: ['la publicité'], it: ['la pubblicità'], pt: ['a publicidade'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'es3v036', de: 'la red social', en: ['the social network'], gloss: { de: ['das soziale Netzwerk'], fr: ['le réseau social'], it: ['il social network'], pt: ['a rede social'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'es3v037', de: 'la fuente', en: ['the source'], gloss: { de: ['die Quelle'], fr: ['la source'], it: ['la fonte'], pt: ['a fonte'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'es3v038', de: 'el rumor', en: ['the rumour'], gloss: { de: ['das Gerücht'], fr: ['la rumeur'], it: ['la diceria'], pt: ['o boato'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'es3v039', de: 'informar', en: ['to report', 'to inform'], gloss: { de: ['berichten'], fr: ['informer'], it: ['informare'], pt: ['informar'] }, pos: 'verb', level: 'B1', category: 'media' },
  { id: 'es3v040', de: 'difundir', en: ['to spread', 'to broadcast'], gloss: { de: ['verbreiten'], fr: ['diffuser'], it: ['diffondere'], pt: ['divulgar'] }, pos: 'verb', level: 'B1', category: 'media' },

  // ── environment ───────────────────────────────────────────────────────
  { id: 'es3v041', de: 'el medio ambiente', en: ['the environment'], gloss: { de: ['die Umwelt'], fr: ['l’environnement'], it: ['l’ambiente'], pt: ['o meio ambiente'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'es3v042', de: 'el cambio climático', en: ['the climate change'], gloss: { de: ['der Klimawandel'], fr: ['le changement climatique'], it: ['il cambiamento climatico'], pt: ['a mudança climática'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'es3v043', de: 'la contaminación', en: ['the pollution'], gloss: { de: ['die Verschmutzung'], fr: ['la pollution'], it: ['l’inquinamento'], pt: ['a poluição'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'es3v044', de: 'los residuos', en: ['the waste'], gloss: { de: ['die Abfälle'], fr: ['les déchets'], it: ['i rifiuti'], pt: ['o lixo'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'es3v045', de: 'el reciclaje', en: ['the recycling'], gloss: { de: ['das Recycling'], fr: ['le recyclage'], it: ['il riciclaggio'], pt: ['a reciclagem'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'es3v046', de: 'la sequía', en: ['the drought'], gloss: { de: ['die Dürre'], fr: ['la sécheresse'], it: ['la siccità'], pt: ['a seca'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'es3v047', de: 'la energía renovable', en: ['the renewable energy'], gloss: { de: ['die erneuerbare Energie'], fr: ['l’énergie renouvelable'], it: ['l’energia rinnovabile'], pt: ['a energia renovável'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'es3v048', de: 'sostenible', en: ['sustainable'], gloss: { de: ['nachhaltig'], fr: ['durable'], it: ['sostenibile'], pt: ['sustentável'] }, pos: 'adj', level: 'B1', category: 'environment' },
  { id: 'es3v049', de: 'contaminar', en: ['to pollute'], gloss: { de: ['verschmutzen'], fr: ['polluer'], it: ['inquinare'], pt: ['poluir'] }, pos: 'verb', level: 'B1', category: 'environment' },
  { id: 'es3v050', de: 'ahorrar', en: ['to save (resources, money)'], gloss: { de: ['sparen'], fr: ['économiser'], it: ['risparmiare'], pt: ['economizar'] }, pos: 'verb', level: 'B1', category: 'environment' },

  // ── abstract nouns ────────────────────────────────────────────────────
  { id: 'es3v051', de: 'la libertad', en: ['the freedom'], gloss: { de: ['die Freiheit'], fr: ['la liberté'], it: ['la libertà'], pt: ['a liberdade'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'es3v052', de: 'el desarrollo', en: ['the development'], gloss: { de: ['die Entwicklung'], fr: ['le développement'], it: ['lo sviluppo'], pt: ['o desenvolvimento'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'es3v053', de: 'el compromiso', en: ['the commitment'], gloss: { de: ['die Verpflichtung'], fr: ['l’engagement'], it: ['l’impegno'], pt: ['o compromisso'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'es3v054', de: 'el esfuerzo', en: ['the effort'], gloss: { de: ['die Anstrengung'], fr: ['l’effort'], it: ['lo sforzo'], pt: ['o esforço'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'es3v055', de: 'la confianza', en: ['the trust', 'the confidence'], gloss: { de: ['das Vertrauen'], fr: ['la confiance'], it: ['la fiducia'], pt: ['a confiança'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'es3v056', de: 'el riesgo', en: ['the risk'], gloss: { de: ['das Risiko'], fr: ['le risque'], it: ['il rischio'], pt: ['o risco'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'es3v057', de: 'la costumbre', en: ['the habit', 'the custom'], gloss: { de: ['die Gewohnheit'], fr: ['l’habitude'], it: ['l’abitudine'], pt: ['o costume'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'es3v058', de: 'el objetivo', en: ['the goal', 'the objective'], gloss: { de: ['das Ziel'], fr: ['l’objectif'], it: ['l’obiettivo'], pt: ['o objetivo'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'es3v059', de: 'la realidad', en: ['the reality'], gloss: { de: ['die Wirklichkeit'], fr: ['la réalité'], it: ['la realtà'], pt: ['a realidade'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'es3v060', de: 'el sentido', en: ['the meaning', 'the sense'], gloss: { de: ['der Sinn'], fr: ['le sens'], it: ['il senso'], pt: ['o sentido'] }, pos: 'noun', level: 'B1', category: 'abstract' },

  // ── connectors & discourse ────────────────────────────────────────────
  { id: 'es3v061', de: 'sin embargo', en: ['however', 'nevertheless'], gloss: { de: ['jedoch'], fr: ['cependant'], it: ['tuttavia'], pt: ['no entanto'] }, pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'es3v062', de: 'por lo tanto', en: ['therefore'], gloss: { de: ['folglich'], fr: ['par conséquent'], it: ['pertanto'], pt: ['portanto'] }, pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'es3v063', de: 'aunque', en: ['although', 'even if'], gloss: { de: ['obwohl'], fr: ['bien que'], it: ['anche se'], pt: ['embora'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'es3v064', de: 'a pesar de', en: ['despite', 'in spite of'], gloss: { de: ['trotz'], fr: ['malgré'], it: ['nonostante'], pt: ['apesar de'] }, pos: 'prep', level: 'B1', category: 'connectors' },
  { id: 'es3v065', de: 'además', en: ['besides', 'moreover'], gloss: { de: ['außerdem'], fr: ['de plus'], it: ['inoltre'], pt: ['além disso'] }, pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'es3v066', de: 'en cambio', en: ['on the other hand', 'whereas'], gloss: { de: ['hingegen'], fr: ['en revanche'], it: ['invece'], pt: ['por outro lado'] }, pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'es3v067', de: 'es decir', en: ['that is to say', 'in other words'], gloss: { de: ['das heißt'], fr: ['c’est-à-dire'], it: ['cioè'], pt: ['ou seja'] }, pos: 'phrase', level: 'B1', category: 'connectors' },
  { id: 'es3v068', de: 'mientras que', en: ['whereas', 'while'], gloss: { de: ['während'], fr: ['tandis que'], it: ['mentre'], pt: ['enquanto'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'es3v069', de: 'siempre que', en: ['as long as', 'provided that'], gloss: { de: ['sofern'], fr: ['pourvu que'], it: ['purché'], pt: ['desde que'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'es3v070', de: 'para que', en: ['so that'], gloss: { de: ['damit'], fr: ['pour que'], it: ['affinché'], pt: ['para que'] }, pos: 'conj', level: 'B1', category: 'connectors' },

  // ── emotions & inner life ─────────────────────────────────────────────
  { id: 'es3v071', de: 'el orgullo', en: ['the pride'], gloss: { de: ['der Stolz'], fr: ['la fierté'], it: ['l’orgoglio'], pt: ['o orgulho'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'es3v072', de: 'la vergüenza', en: ['the shame', 'the embarrassment'], gloss: { de: ['die Scham'], fr: ['la honte'], it: ['la vergogna'], pt: ['a vergonha'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'es3v073', de: 'el enfado', en: ['the anger', 'the annoyance'], gloss: { de: ['der Ärger'], fr: ['la colère'], it: ['la rabbia'], pt: ['a raiva'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'es3v074', de: 'la tristeza', en: ['the sadness'], gloss: { de: ['die Traurigkeit'], fr: ['la tristesse'], it: ['la tristezza'], pt: ['a tristeza'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'es3v075', de: 'la preocupación', en: ['the worry', 'the concern'], gloss: { de: ['die Sorge'], fr: ['l’inquiétude'], it: ['la preoccupazione'], pt: ['a preocupação'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'es3v076', de: 'la sorpresa', en: ['the surprise'], gloss: { de: ['die Überraschung'], fr: ['la surprise'], it: ['la sorpresa'], pt: ['a surpresa'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'es3v077', de: 'el temor', en: ['the apprehension', 'the fear'], gloss: { de: ['das Misstrauen'], fr: ['la méfiance'], it: ['la diffidenza'], pt: ['o receio'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'es3v078', de: 'atreverse', en: ['to dare'], gloss: { de: ['sich trauen'], fr: ['oser'], it: ['osare'], pt: ['atrever-se'] }, pos: 'verb', level: 'B1', category: 'emotions' },
  { id: 'es3v079', de: 'arrepentirse', en: ['to regret'], gloss: { de: ['bereuen'], fr: ['regretter'], it: ['pentirsi'], pt: ['arrepender-se'] }, pos: 'verb', level: 'B1', category: 'emotions' },
  { id: 'es3v080', de: 'emocionante', en: ['exciting', 'moving'], gloss: { de: ['aufregend'], fr: ['passionnant'], it: ['emozionante'], pt: ['emocionante'] }, pos: 'adj', level: 'B1', category: 'emotions' },

  // ── education & learning ──────────────────────────────────────────────
  { id: 'es3v081', de: 'la formación', en: ['the training', 'the education'], gloss: { de: ['die Ausbildung'], fr: ['la formation'], it: ['la formazione'], pt: ['a formação'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'es3v082', de: 'la carrera universitaria', en: ['the university degree course'], gloss: { de: ['das Studium'], fr: ['les études universitaires'], it: ['il corso di laurea'], pt: ['o curso universitário'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'es3v083', de: 'la beca', en: ['the scholarship', 'the grant'], gloss: { de: ['das Stipendium'], fr: ['la bourse'], it: ['la borsa di studio'], pt: ['a bolsa de estudos'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'es3v084', de: 'el título', en: ['the degree', 'the qualification'], gloss: { de: ['der Abschluss'], fr: ['le diplôme'], it: ['il titolo di studio'], pt: ['o diploma'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'es3v085', de: 'la asignatura', en: ['the subject (school)'], gloss: { de: ['das Fach'], fr: ['la matière'], it: ['la materia'], pt: ['a disciplina'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'es3v086', de: 'el conocimiento', en: ['the knowledge'], gloss: { de: ['das Wissen'], fr: ['la connaissance'], it: ['la conoscenza'], pt: ['o conhecimento'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'es3v087', de: 'el aprendizaje', en: ['the learning'], gloss: { de: ['das Lernen'], fr: ['l’apprentissage'], it: ['l’apprendimento'], pt: ['a aprendizagem'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'es3v088', de: 'aprobar', en: ['to pass (an exam)'], gloss: { de: ['bestehen'], fr: ['réussir'], it: ['superare'], pt: ['ser aprovado'] }, pos: 'verb', level: 'B1', category: 'education' },
  { id: 'es3v089', de: 'suspender', en: ['to fail (an exam)'], gloss: { de: ['durchfallen'], fr: ['échouer'], it: ['essere bocciato'], pt: ['reprovar'] }, pos: 'verb', level: 'B1', category: 'education' },
  { id: 'es3v090', de: 'investigar', en: ['to research', 'to investigate'], gloss: { de: ['erforschen'], fr: ['faire des recherches'], it: ['fare ricerca'], pt: ['pesquisar'] }, pos: 'verb', level: 'B1', category: 'education' },

  // ── adjectives ────────────────────────────────────────────────────────
  { id: 'es3v091', de: 'imprescindible', en: ['essential', 'indispensable'], gloss: { de: ['unverzichtbar'], fr: ['indispensable'], it: ['indispensabile'], pt: ['imprescindível'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'es3v092', de: 'capaz', en: ['capable', 'able'], gloss: { de: ['fähig'], fr: ['capable'], it: ['capace'], pt: ['capaz'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'es3v093', de: 'eficaz', en: ['effective'], gloss: { de: ['wirksam'], fr: ['efficace'], it: ['efficace'], pt: ['eficaz'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'es3v094', de: 'injusto', en: ['unfair', 'unjust'], gloss: { de: ['ungerecht'], fr: ['injuste'], it: ['ingiusto'], pt: ['injusto'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'es3v095', de: 'exigente', en: ['demanding'], gloss: { de: ['anspruchsvoll'], fr: ['exigeant'], it: ['esigente'], pt: ['exigente'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'es3v096', de: 'dispuesto', en: ['willing', 'ready'], gloss: { de: ['bereit'], fr: ['prêt'], it: ['disposto'], pt: ['disposto'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'es3v097', de: 'sorprendente', en: ['surprising'], gloss: { de: ['überraschend'], fr: ['surprenant'], it: ['sorprendente'], pt: ['surpreendente'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'es3v098', de: 'escaso', en: ['scarce', 'limited'], gloss: { de: ['knapp'], fr: ['rare'], it: ['scarso'], pt: ['escasso'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'es3v099', de: 'cotidiano', en: ['everyday', 'daily'], gloss: { de: ['alltäglich'], fr: ['quotidien'], it: ['quotidiano'], pt: ['cotidiano'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'es3v100', de: 'arriesgado', en: ['risky'], gloss: { de: ['riskant'], fr: ['risqué'], it: ['rischioso'], pt: ['arriscado'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
];
