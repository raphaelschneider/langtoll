import type { VocabItem } from '@/content/german/types';

// French (fr-FR) B1 vocabulary. The `de` field holds the French text (see the
// note in content/german/types.ts). Nouns ship with their article, and the
// elided ones are kept deliberately — l’avis, l’inconvénient, l’impôt and
// l’espoir are masculine, l’égalité, l’actualité, l’émission and l’énergie are
// feminine, and the article no longer tells you which is which.
//
// Level discipline: A1 owns greetings, people, basic food, places, the core
// verbs, numbers and basic time. A2 owns the passé composé, the daily routine
// and reflexives, travel, shopping, work basics, health, weather, clothing,
// the house and comparatives. B1 is the register of argument — opinions stated
// and defended, abstract nouns, work and career, media, the environment, social
// issues, and the connectors that hold a paragraph together. Nothing here
// repeats fr1v### or fr2v###.
//
// `gloss` carries the other UI locales. English lives in `en` and is the
// guaranteed fallback; French itself is never glossed (a French-UI user is
// never offered French to learn), so each item covers de / es / it / pt.
// Categories stay at 10 items so the multiple-choice generator always finds
// same-category distractors.

export const B1_VOCAB: VocabItem[] = [
  // ── opinion & argument ────────────────────────────────────────────────
  { id: 'fr3v001', de: 'l’avis', en: ['the opinion', 'the view'], gloss: { de: ['die Ansicht'], es: ['el parecer'], it: ['il parere'], pt: ['a opinião'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'opinion' },
  { id: 'fr3v002', de: 'à mon avis', en: ['in my opinion'], gloss: { de: ['meiner Meinung nach'], es: ['en mi opinión'], it: ['secondo me'], pt: ['na minha opinião'] }, pos: 'phrase', level: 'B1', category: 'opinion' },
  { id: 'fr3v003', de: 'l’avantage', en: ['the advantage'], gloss: { de: ['der Vorteil'], es: ['la ventaja'], it: ['il vantaggio'], pt: ['a vantagem'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'opinion' },
  { id: 'fr3v004', de: 'l’inconvénient', en: ['the disadvantage', 'the drawback'], gloss: { de: ['der Nachteil'], es: ['el inconveniente'], it: ['lo svantaggio'], pt: ['a desvantagem'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'opinion' },
  { id: 'fr3v005', de: 'le débat', en: ['the debate'], gloss: { de: ['die Debatte'], es: ['el debate'], it: ['il dibattito'], pt: ['o debate'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'fr3v006', de: 'la preuve', en: ['the proof', 'the evidence'], gloss: { de: ['der Beweis'], es: ['la prueba'], it: ['la prova'], pt: ['a prova'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'fr3v007', de: 'soutenir', en: ['to maintain', 'to argue'], gloss: { de: ['behaupten'], es: ['sostener'], it: ['sostenere'], pt: ['sustentar'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'fr3v008', de: 'convaincre', en: ['to convince'], gloss: { de: ['überzeugen'], es: ['convencer'], it: ['convincere'], pt: ['convencer'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'fr3v009', de: 'être d’accord', en: ['to agree'], gloss: { de: ['einverstanden sein'], es: ['estar de acuerdo'], it: ['essere d’accordo'], pt: ['concordar'] }, pos: 'phrase', level: 'B1', category: 'opinion' },
  { id: 'fr3v010', de: 'contester', en: ['to dispute', 'to challenge'], gloss: { de: ['bestreiten'], es: ['cuestionar'], it: ['contestare'], pt: ['contestar'] }, pos: 'verb', level: 'B1', category: 'opinion' },

  // ── work & career ─────────────────────────────────────────────────────
  { id: 'fr3v011', de: 'la carrière', en: ['the career'], gloss: { de: ['die Karriere'], es: ['la carrera'], it: ['la carriera'], pt: ['a carreira'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'fr3v012', de: 'l’employeur', en: ['the employer'], gloss: { de: ['der Arbeitgeber'], es: ['el empleador'], it: ['il datore di lavoro'], pt: ['o empregador'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'work' },
  { id: 'fr3v013', de: 'l’employé', en: ['the employee'], gloss: { de: ['der Angestellte'], es: ['el empleado'], it: ['il dipendente'], pt: ['o funcionário'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'work' },
  { id: 'fr3v014', de: 'le contrat', en: ['the contract'], gloss: { de: ['der Vertrag'], es: ['el contrato'], it: ['il contratto'], pt: ['o contrato'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'fr3v015', de: 'la responsabilité', en: ['the responsibility'], gloss: { de: ['die Verantwortung'], es: ['la responsabilidad'], it: ['la responsabilità'], pt: ['a responsabilidade'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'fr3v016', de: 'l’expérience', en: ['the experience'], gloss: { de: ['die Erfahrung'], es: ['la experiencia'], it: ['l’esperienza'], pt: ['a experiência'] }, pos: 'noun', gender: 'f', level: 'B1', category: 'work' },
  { id: 'fr3v017', de: 'le stage', en: ['the internship', 'the work placement'], gloss: { de: ['das Praktikum'], es: ['las prácticas'], it: ['il tirocinio'], pt: ['o estágio'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'fr3v018', de: 'la démission', en: ['the resignation'], gloss: { de: ['die Kündigung'], es: ['la dimisión'], it: ['le dimissioni'], pt: ['a demissão'] }, pos: 'noun', level: 'B1', category: 'work' },
  { id: 'fr3v019', de: 'embaucher', en: ['to hire'], gloss: { de: ['einstellen'], es: ['contratar'], it: ['assumere'], pt: ['contratar'] }, pos: 'verb', level: 'B1', category: 'work' },
  { id: 'fr3v020', de: 'licencier', en: ['to make redundant', 'to dismiss'], gloss: { de: ['entlassen'], es: ['despedir'], it: ['licenziare'], pt: ['demitir'] }, pos: 'verb', level: 'B1', category: 'work' },

  // ── society ───────────────────────────────────────────────────────────
  { id: 'fr3v021', de: 'la société', en: ['the society'], gloss: { de: ['die Gesellschaft'], es: ['la sociedad'], it: ['la società'], pt: ['a sociedade'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'fr3v022', de: 'le gouvernement', en: ['the government'], gloss: { de: ['die Regierung'], es: ['el gobierno'], it: ['il governo'], pt: ['o governo'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'fr3v023', de: 'la loi', en: ['the law'], gloss: { de: ['das Gesetz'], es: ['la ley'], it: ['la legge'], pt: ['a lei'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'fr3v024', de: 'le droit', en: ['the right'], gloss: { de: ['das Recht'], es: ['el derecho'], it: ['il diritto'], pt: ['o direito'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'fr3v025', de: 'les élections', en: ['the elections'], gloss: { de: ['die Wahlen'], es: ['las elecciones'], it: ['le elezioni'], pt: ['as eleições'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'fr3v026', de: 'le chômage', en: ['the unemployment'], gloss: { de: ['die Arbeitslosigkeit'], es: ['el desempleo'], it: ['la disoccupazione'], pt: ['o desemprego'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'fr3v027', de: 'l’égalité', en: ['the equality'], gloss: { de: ['die Gleichheit'], es: ['la igualdad'], it: ['l’uguaglianza'], pt: ['a igualdade'] }, pos: 'noun', gender: 'f', level: 'B1', category: 'society' },
  { id: 'fr3v028', de: 'la pauvreté', en: ['the poverty'], gloss: { de: ['die Armut'], es: ['la pobreza'], it: ['la povertà'], pt: ['a pobreza'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'fr3v029', de: 'le citoyen', en: ['the citizen'], gloss: { de: ['der Bürger'], es: ['el ciudadano'], it: ['il cittadino'], pt: ['o cidadão'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'fr3v030', de: 'l’impôt', en: ['the tax'], gloss: { de: ['die Steuer'], es: ['el impuesto'], it: ['la tassa'], pt: ['o imposto'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'society' },

  // ── media & news ──────────────────────────────────────────────────────
  { id: 'fr3v031', de: 'le journal', en: ['the newspaper'], gloss: { de: ['die Zeitung'], es: ['el periódico'], it: ['il giornale'], pt: ['o jornal'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'fr3v032', de: 'l’actualité', en: ['the news', 'current affairs'], gloss: { de: ['die Nachrichten'], es: ['la actualidad'], it: ['l’attualità'], pt: ['a atualidade'] }, pos: 'noun', gender: 'f', level: 'B1', category: 'media' },
  { id: 'fr3v033', de: 'le journaliste', en: ['the journalist'], gloss: { de: ['der Journalist'], es: ['el periodista'], it: ['il giornalista'], pt: ['o jornalista'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'fr3v034', de: 'l’article', en: ['the article'], gloss: { de: ['der Artikel'], es: ['el artículo'], it: ['l’articolo'], pt: ['o artigo'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'media' },
  { id: 'fr3v035', de: 'la publicité', en: ['the advertising', 'the ad'], gloss: { de: ['die Werbung'], es: ['la publicidad'], it: ['la pubblicità'], pt: ['a publicidade'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'fr3v036', de: 'l’émission', en: ['the programme', 'the show'], gloss: { de: ['die Sendung'], es: ['el programa'], it: ['la trasmissione'], pt: ['o programa'] }, pos: 'noun', gender: 'f', level: 'B1', category: 'media' },
  { id: 'fr3v037', de: 'le réseau social', en: ['the social network'], gloss: { de: ['das soziale Netzwerk'], es: ['la red social'], it: ['il social network'], pt: ['a rede social'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'fr3v038', de: 'le sondage', en: ['the poll', 'the survey'], gloss: { de: ['die Umfrage'], es: ['la encuesta'], it: ['il sondaggio'], pt: ['a pesquisa'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'fr3v039', de: 'la chaîne', en: ['the channel'], gloss: { de: ['der Sender'], es: ['el canal'], it: ['il canale'], pt: ['o canal'] }, pos: 'noun', level: 'B1', category: 'media' },
  { id: 'fr3v040', de: 'diffuser', en: ['to broadcast', 'to spread'], gloss: { de: ['senden'], es: ['difundir'], it: ['diffondere'], pt: ['transmitir'] }, pos: 'verb', level: 'B1', category: 'media' },

  // ── environment ───────────────────────────────────────────────────────
  { id: 'fr3v041', de: 'l’environnement', en: ['the environment'], gloss: { de: ['die Umwelt'], es: ['el medio ambiente'], it: ['l’ambiente'], pt: ['o meio ambiente'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'environment' },
  { id: 'fr3v042', de: 'la pollution', en: ['the pollution'], gloss: { de: ['die Verschmutzung'], es: ['la contaminación'], it: ['l’inquinamento'], pt: ['a poluição'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'fr3v043', de: 'le réchauffement climatique', en: ['the global warming'], gloss: { de: ['die Erderwärmung'], es: ['el calentamiento global'], it: ['il riscaldamento globale'], pt: ['o aquecimento global'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'fr3v044', de: 'les déchets', en: ['the waste', 'the rubbish'], gloss: { de: ['der Müll'], es: ['los residuos'], it: ['i rifiuti'], pt: ['o lixo'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'fr3v045', de: 'le recyclage', en: ['the recycling'], gloss: { de: ['das Recycling'], es: ['el reciclaje'], it: ['il riciclaggio'], pt: ['a reciclagem'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'fr3v046', de: 'le gaspillage', en: ['the waste', 'the squandering'], gloss: { de: ['die Verschwendung'], es: ['el derroche'], it: ['lo spreco'], pt: ['o desperdício'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'fr3v047', de: 'l’énergie', en: ['the energy'], gloss: { de: ['die Energie'], es: ['la energía'], it: ['l’energia'], pt: ['a energia'] }, pos: 'noun', gender: 'f', level: 'B1', category: 'environment' },
  { id: 'fr3v048', de: 'durable', en: ['sustainable'], gloss: { de: ['nachhaltig'], es: ['sostenible'], it: ['sostenibile'], pt: ['sustentável'] }, pos: 'adj', level: 'B1', category: 'environment' },
  { id: 'fr3v049', de: 'polluer', en: ['to pollute'], gloss: { de: ['verschmutzen'], es: ['contaminar'], it: ['inquinare'], pt: ['poluir'] }, pos: 'verb', level: 'B1', category: 'environment' },
  { id: 'fr3v050', de: 'protéger', en: ['to protect'], gloss: { de: ['schützen'], es: ['proteger'], it: ['proteggere'], pt: ['proteger'] }, pos: 'verb', level: 'B1', category: 'environment' },

  // ── abstract nouns ────────────────────────────────────────────────────
  { id: 'fr3v051', de: 'la liberté', en: ['the freedom'], gloss: { de: ['die Freiheit'], es: ['la libertad'], it: ['la libertà'], pt: ['a liberdade'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'fr3v052', de: 'le développement', en: ['the development'], gloss: { de: ['die Entwicklung'], es: ['el desarrollo'], it: ['lo sviluppo'], pt: ['o desenvolvimento'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'fr3v053', de: 'l’engagement', en: ['the commitment'], gloss: { de: ['das Engagement'], es: ['el compromiso'], it: ['l’impegno'], pt: ['o compromisso'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'abstract' },
  { id: 'fr3v054', de: 'la confiance', en: ['the trust', 'the confidence'], gloss: { de: ['das Vertrauen'], es: ['la confianza'], it: ['la fiducia'], pt: ['a confiança'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'fr3v055', de: 'l’espoir', en: ['the hope'], gloss: { de: ['die Hoffnung'], es: ['la esperanza'], it: ['la speranza'], pt: ['a esperança'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'abstract' },
  { id: 'fr3v056', de: 'le sens', en: ['the meaning', 'the sense'], gloss: { de: ['der Sinn'], es: ['el sentido'], it: ['il senso'], pt: ['o sentido'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'fr3v057', de: 'le choix', en: ['the choice'], gloss: { de: ['die Wahl'], es: ['la elección'], it: ['la scelta'], pt: ['a escolha'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'fr3v058', de: 'le doute', en: ['the doubt'], gloss: { de: ['der Zweifel'], es: ['la duda'], it: ['il dubbio'], pt: ['a dúvida'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'fr3v059', de: 'le but', en: ['the aim', 'the goal'], gloss: { de: ['das Ziel'], es: ['el objetivo'], it: ['lo scopo'], pt: ['o objetivo'] }, pos: 'noun', level: 'B1', category: 'abstract' },
  { id: 'fr3v060', de: 'la réalité', en: ['the reality'], gloss: { de: ['die Realität'], es: ['la realidad'], it: ['la realtà'], pt: ['a realidade'] }, pos: 'noun', level: 'B1', category: 'abstract' },

  // ── discourse connectors ──────────────────────────────────────────────
  { id: 'fr3v061', de: 'cependant', en: ['however', 'nevertheless'], gloss: { de: ['jedoch'], es: ['sin embargo'], it: ['tuttavia'], pt: ['no entanto'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'fr3v062', de: 'donc', en: ['therefore', 'so'], gloss: { de: ['also'], es: ['por lo tanto'], it: ['quindi'], pt: ['portanto'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'fr3v063', de: 'bien que', en: ['although', 'even though'], gloss: { de: ['obwohl'], es: ['aunque'], it: ['benché'], pt: ['embora'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'fr3v064', de: 'malgré', en: ['despite', 'in spite of'], gloss: { de: ['trotz'], es: ['a pesar de'], it: ['nonostante'], pt: ['apesar de'] }, pos: 'prep', level: 'B1', category: 'connectors' },
  { id: 'fr3v065', de: 'en revanche', en: ['on the other hand'], gloss: { de: ['dagegen'], es: ['en cambio'], it: ['invece'], pt: ['em contrapartida'] }, pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'fr3v066', de: 'en outre', en: ['moreover', 'furthermore'], gloss: { de: ['außerdem'], es: ['además'], it: ['inoltre'], pt: ['além disso'] }, pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'fr3v067', de: 'afin que', en: ['so that', 'in order that'], gloss: { de: ['damit'], es: ['para que'], it: ['affinché'], pt: ['para que'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'fr3v068', de: 'pourtant', en: ['yet', 'and yet'], gloss: { de: ['dennoch'], es: ['sin embargo'], it: ['eppure'], pt: ['contudo'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'fr3v069', de: 'sinon', en: ['otherwise', 'or else'], gloss: { de: ['sonst'], es: ['si no'], it: ['altrimenti'], pt: ['senão'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'fr3v070', de: 'au contraire', en: ['on the contrary'], gloss: { de: ['im Gegenteil'], es: ['al contrario'], it: ['anzi'], pt: ['pelo contrário'] }, pos: 'adv', level: 'B1', category: 'connectors' },

  // ── emotions & inner life ─────────────────────────────────────────────
  { id: 'fr3v071', de: 'la honte', en: ['the shame'], gloss: { de: ['die Scham'], es: ['la vergüenza'], it: ['la vergogna'], pt: ['a vergonha'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'fr3v072', de: 'la fierté', en: ['the pride'], gloss: { de: ['der Stolz'], es: ['el orgullo'], it: ['l’orgoglio'], pt: ['o orgulho'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'fr3v073', de: 'la déception', en: ['the disappointment'], gloss: { de: ['die Enttäuschung'], es: ['la decepción'], it: ['la delusione'], pt: ['a decepção'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'fr3v074', de: 'la tristesse', en: ['the sadness'], gloss: { de: ['die Traurigkeit'], es: ['la tristeza'], it: ['la tristezza'], pt: ['a tristeza'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'fr3v075', de: 'l’inquiétude', en: ['the worry', 'the concern'], gloss: { de: ['die Sorge'], es: ['la preocupación'], it: ['la preoccupazione'], pt: ['a preocupação'] }, pos: 'noun', gender: 'f', level: 'B1', category: 'emotions' },
  { id: 'fr3v076', de: 'le soulagement', en: ['the relief'], gloss: { de: ['die Erleichterung'], es: ['el alivio'], it: ['il sollievo'], pt: ['o alívio'] }, pos: 'noun', level: 'B1', category: 'emotions' },
  { id: 'fr3v077', de: 'ému', en: ['moved', 'touched'], gloss: { de: ['gerührt'], es: ['conmovido'], it: ['commosso'], pt: ['comovido'] }, pos: 'adj', level: 'B1', category: 'emotions' },
  { id: 'fr3v078', de: 'déçu', en: ['disappointed'], gloss: { de: ['enttäuscht'], es: ['decepcionado'], it: ['deluso'], pt: ['decepcionado'] }, pos: 'adj', level: 'B1', category: 'emotions' },
  { id: 'fr3v079', de: 'se fâcher', en: ['to get angry'], gloss: { de: ['sich ärgern'], es: ['enfadarse'], it: ['arrabbiarsi'], pt: ['zangar-se'] }, pos: 'verb', level: 'B1', category: 'emotions' },
  { id: 'fr3v080', de: 's’inquiéter', en: ['to worry'], gloss: { de: ['sich sorgen'], es: ['preocuparse'], it: ['preoccuparsi'], pt: ['preocupar-se'] }, pos: 'verb', level: 'B1', category: 'emotions' },

  // ── education & knowledge ─────────────────────────────────────────────
  { id: 'fr3v081', de: 'la formation', en: ['the training', 'the education'], gloss: { de: ['die Ausbildung'], es: ['la formación'], it: ['la formazione'], pt: ['a formação'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'fr3v082', de: 'la recherche', en: ['the research'], gloss: { de: ['die Forschung'], es: ['la investigación'], it: ['la ricerca'], pt: ['a pesquisa'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'fr3v083', de: 'la connaissance', en: ['the knowledge'], gloss: { de: ['das Wissen'], es: ['el conocimiento'], it: ['la conoscenza'], pt: ['o conhecimento'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'fr3v084', de: 'la compétence', en: ['the skill', 'the competence'], gloss: { de: ['die Kompetenz'], es: ['la competencia'], it: ['la competenza'], pt: ['a competência'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'fr3v085', de: 'la bourse', en: ['the scholarship', 'the grant'], gloss: { de: ['das Stipendium'], es: ['la beca'], it: ['la borsa di studio'], pt: ['a bolsa de estudos'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'fr3v086', de: 'le diplôme', en: ['the diploma', 'the degree'], gloss: { de: ['das Diplom'], es: ['el diploma'], it: ['il diploma'], pt: ['o diploma'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'fr3v087', de: 'la licence', en: ['the bachelor’s degree'], gloss: { de: ['der Bachelorabschluss'], es: ['el grado'], it: ['la laurea triennale'], pt: ['a graduação'] }, pos: 'noun', level: 'B1', category: 'education' },
  { id: 'fr3v088', de: 'l’apprentissage', en: ['the learning', 'the apprenticeship'], gloss: { de: ['das Lernen'], es: ['el aprendizaje'], it: ['l’apprendimento'], pt: ['a aprendizagem'] }, pos: 'noun', gender: 'm', level: 'B1', category: 'education' },
  { id: 'fr3v089', de: 'approfondir', en: ['to deepen', 'to study in depth'], gloss: { de: ['vertiefen'], es: ['profundizar'], it: ['approfondire'], pt: ['aprofundar'] }, pos: 'verb', level: 'B1', category: 'education' },
  { id: 'fr3v090', de: 's’inscrire', en: ['to enrol', 'to sign up'], gloss: { de: ['sich einschreiben'], es: ['matricularse'], it: ['iscriversi'], pt: ['inscrever-se'] }, pos: 'verb', level: 'B1', category: 'education' },

  // ── adjectives ────────────────────────────────────────────────────────
  { id: 'fr3v091', de: 'efficace', en: ['effective', 'efficient'], gloss: { de: ['wirksam'], es: ['eficaz'], it: ['efficace'], pt: ['eficaz'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'fr3v092', de: 'conscient', en: ['aware', 'conscious'], gloss: { de: ['bewusst'], es: ['consciente'], it: ['consapevole'], pt: ['consciente'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'fr3v093', de: 'inévitable', en: ['inevitable'], gloss: { de: ['unvermeidlich'], es: ['inevitable'], it: ['inevitabile'], pt: ['inevitável'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'fr3v094', de: 'complexe', en: ['complex'], gloss: { de: ['komplex'], es: ['complejo'], it: ['complesso'], pt: ['complexo'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'fr3v095', de: 'urgent', en: ['urgent'], gloss: { de: ['dringend'], es: ['urgente'], it: ['urgente'], pt: ['urgente'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'fr3v096', de: 'fiable', en: ['reliable'], gloss: { de: ['zuverlässig'], es: ['fiable'], it: ['affidabile'], pt: ['conconfiável'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'fr3v097', de: 'croissant', en: ['growing', 'increasing'], gloss: { de: ['wachsend'], es: ['creciente'], it: ['crescente'], pt: ['crescente'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'fr3v098', de: 'superficiel', en: ['superficial', 'shallow'], gloss: { de: ['oberflächlich'], es: ['superficial'], it: ['superficiale'], pt: ['superficial'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'fr3v099', de: 'inquiétant', en: ['worrying', 'alarming'], gloss: { de: ['beunruhigend'], es: ['inquietante'], it: ['preoccupante'], pt: ['preocupante'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
  { id: 'fr3v100', de: 'remarquable', en: ['remarkable', 'outstanding'], gloss: { de: ['bemerkenswert'], es: ['notable'], it: ['notevole'], pt: ['notável'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
];
