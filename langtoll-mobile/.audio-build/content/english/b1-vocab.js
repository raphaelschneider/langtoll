"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.B1_VOCAB = void 0;
// English B1 vocabulary. The `de` field holds the English text (see the note in
// content/german/types.ts — `de` is the "language being learned" slot regardless
// of pack). Nouns include the article ("the commitment") to mirror A1 and A2.
//
// B1 deliberately does not revisit A1 ground (greetings, family, numbers, basic
// food, common places, core verbs) or A2 ground (daily routine, travel, shopping,
// clothing, the house, health, weather, comparatives, past-simple workhorses).
// It is the level where a learner starts to hold a position: expressing and
// defending an opinion, workplace and career, society and law, media and news,
// the environment, the abstract nouns that arguments are built out of, and the
// discourse connectors (however, therefore, although, despite) that hold a
// paragraph together.
//
// As in A1 and A2 this pack is the one case where `en` is degenerate: the reading
// side and the target side are the same language. `en` still carries the bare
// word (article stripped) plus a clarifier where a regional or sense variant
// exists, because the type contract guarantees it as the fallback for any locale
// `gloss` misses. An English-UI user is never offered English to learn, so it is
// not shown in practice.
//
// `gloss` therefore covers ALL five other UI locales — de / es / fr / it / pt.
//
// Regional choices follow the neutral-international line A1 and A2 set: teach the
// more widely understood form ("the advertisement", "the CV") and list the other
// in `en` so a correct answer is never marked wrong. Categories stay at 10 items
// so the multiple-choice generator always finds same-category distractors.
exports.B1_VOCAB = [
    // ── opinion & argument ────────────────────────────────────────────────
    { id: 'en3v001', de: 'to agree', en: ['to agree'], gloss: { de: ['zustimmen'], es: ['estar de acuerdo'], fr: ['être d’accord'], it: ['essere d’accordo'], pt: ['concordar'] }, pos: 'verb', level: 'B1', category: 'opinion' },
    { id: 'en3v002', de: 'to disagree', en: ['to disagree'], gloss: { de: ['anderer Meinung sein', 'widersprechen'], es: ['no estar de acuerdo'], fr: ['ne pas être d’accord'], it: ['non essere d’accordo'], pt: ['discordar'] }, pos: 'verb', level: 'B1', category: 'opinion' },
    { id: 'en3v003', de: 'to argue', en: ['to argue'], gloss: { de: ['argumentieren', 'streiten'], es: ['discutir', 'argumentar'], fr: ['argumenter', 'se disputer'], it: ['discutere', 'sostenere'], pt: ['argumentar', 'discutir'] }, pos: 'verb', level: 'B1', category: 'opinion' },
    { id: 'en3v004', de: 'to convince', en: ['to convince'], gloss: { de: ['überzeugen'], es: ['convencer'], fr: ['convaincre'], it: ['convincere'], pt: ['convencer'] }, pos: 'verb', level: 'B1', category: 'opinion' },
    { id: 'en3v005', de: 'to admit', en: ['to admit'], gloss: { de: ['zugeben'], es: ['admitir', 'reconocer'], fr: ['admettre', 'reconnaître'], it: ['ammettere'], pt: ['admitir'] }, pos: 'verb', level: 'B1', category: 'opinion' },
    { id: 'en3v006', de: 'to suggest', en: ['to suggest'], gloss: { de: ['vorschlagen'], es: ['sugerir', 'proponer'], fr: ['suggérer', 'proposer'], it: ['suggerire', 'proporre'], pt: ['sugerir', 'propor'] }, pos: 'verb', level: 'B1', category: 'opinion' },
    { id: 'en3v007', de: 'to doubt', en: ['to doubt'], gloss: { de: ['bezweifeln'], es: ['dudar'], fr: ['douter'], it: ['dubitare'], pt: ['duvidar'] }, pos: 'verb', level: 'B1', category: 'opinion' },
    { id: 'en3v008', de: 'the argument', en: ['argument', 'the case'], gloss: { de: ['das Argument'], es: ['el argumento'], fr: ['l’argument'], it: ['l’argomento'], pt: ['o argumento'] }, pos: 'noun', level: 'B1', category: 'opinion' },
    { id: 'en3v009', de: 'the point of view', en: ['point of view', 'the standpoint'], gloss: { de: ['der Standpunkt'], es: ['el punto de vista'], fr: ['le point de vue'], it: ['il punto di vista'], pt: ['o ponto de vista'] }, pos: 'noun', level: 'B1', category: 'opinion' },
    { id: 'en3v010', de: 'as far as I am concerned', en: ['as far as I am concerned'], gloss: { de: ['was mich betrifft'], es: ['en lo que a mí respecta'], fr: ['en ce qui me concerne'], it: ['per quanto mi riguarda'], pt: ['no que me diz respeito'] }, pos: 'phrase', level: 'B1', category: 'opinion' },
    // ── work & career ─────────────────────────────────────────────────────
    { id: 'en3v011', de: 'the career', en: ['career'], gloss: { de: ['die Karriere', 'die Laufbahn'], es: ['la carrera'], fr: ['la carrière'], it: ['la carriera'], pt: ['a carreira'] }, pos: 'noun', level: 'B1', category: 'work' },
    { id: 'en3v012', de: 'the job interview', en: ['job interview'], gloss: { de: ['das Vorstellungsgespräch'], es: ['la entrevista de trabajo'], fr: ['l’entretien d’embauche'], it: ['il colloquio di lavoro'], pt: ['a entrevista de emprego'] }, pos: 'noun', level: 'B1', category: 'work' },
    { id: 'en3v013', de: 'the deadline', en: ['deadline'], gloss: { de: ['die Frist', 'der Abgabetermin'], es: ['la fecha límite', 'el plazo'], fr: ['le délai', 'la date limite'], it: ['la scadenza'], pt: ['o prazo'] }, pos: 'noun', level: 'B1', category: 'work' },
    { id: 'en3v014', de: 'the promotion', en: ['promotion'], gloss: { de: ['die Beförderung'], es: ['el ascenso'], fr: ['la promotion'], it: ['la promozione'], pt: ['a promoção'] }, pos: 'noun', level: 'B1', category: 'work' },
    { id: 'en3v015', de: 'the skill', en: ['skill', 'the ability'], gloss: { de: ['die Fähigkeit'], es: ['la habilidad', 'la competencia'], fr: ['la compétence'], it: ['la competenza', 'l’abilità'], pt: ['a habilidade', 'a competência'] }, pos: 'noun', level: 'B1', category: 'work' },
    { id: 'en3v016', de: 'the application', en: ['application'], gloss: { de: ['die Bewerbung'], es: ['la solicitud'], fr: ['la candidature'], it: ['la candidatura'], pt: ['a candidatura'] }, pos: 'noun', level: 'B1', category: 'work' },
    { id: 'en3v017', de: 'to apply', en: ['to apply'], gloss: { de: ['sich bewerben'], es: ['solicitar', 'postularse'], fr: ['postuler'], it: ['candidarsi'], pt: ['se candidatar'] }, pos: 'verb', level: 'B1', category: 'work' },
    { id: 'en3v018', de: 'to hire', en: ['to hire', 'to take on'], gloss: { de: ['einstellen'], es: ['contratar'], fr: ['embaucher'], it: ['assumere'], pt: ['contratar'] }, pos: 'verb', level: 'B1', category: 'work' },
    { id: 'en3v019', de: 'to resign', en: ['to resign', 'to quit'], gloss: { de: ['kündigen'], es: ['dimitir', 'renunciar'], fr: ['démissionner'], it: ['dimettersi'], pt: ['demitir-se'] }, pos: 'verb', level: 'B1', category: 'work' },
    { id: 'en3v020', de: 'to manage', en: ['to manage'], gloss: { de: ['leiten', 'verwalten'], es: ['dirigir', 'gestionar'], fr: ['gérer', 'diriger'], it: ['gestire', 'dirigere'], pt: ['gerir', 'gerenciar'] }, pos: 'verb', level: 'B1', category: 'work' },
    // ── society & politics ────────────────────────────────────────────────
    { id: 'en3v021', de: 'the government', en: ['government'], gloss: { de: ['die Regierung'], es: ['el gobierno'], fr: ['le gouvernement'], it: ['il governo'], pt: ['o governo'] }, pos: 'noun', level: 'B1', category: 'society' },
    { id: 'en3v022', de: 'the law', en: ['law'], gloss: { de: ['das Gesetz'], es: ['la ley'], fr: ['la loi'], it: ['la legge'], pt: ['a lei'] }, pos: 'noun', level: 'B1', category: 'society' },
    { id: 'en3v023', de: 'the society', en: ['society'], gloss: { de: ['die Gesellschaft'], es: ['la sociedad'], fr: ['la société'], it: ['la società'], pt: ['a sociedade'] }, pos: 'noun', level: 'B1', category: 'society' },
    { id: 'en3v024', de: 'the citizen', en: ['citizen'], gloss: { de: ['der Bürger'], es: ['el ciudadano'], fr: ['le citoyen'], it: ['il cittadino'], pt: ['o cidadão'] }, pos: 'noun', level: 'B1', category: 'society' },
    { id: 'en3v025', de: 'the community', en: ['community'], gloss: { de: ['die Gemeinschaft'], es: ['la comunidad'], fr: ['la communauté'], it: ['la comunità'], pt: ['a comunidade'] }, pos: 'noun', level: 'B1', category: 'society' },
    { id: 'en3v026', de: 'the crime', en: ['crime'], gloss: { de: ['das Verbrechen'], es: ['el delito'], fr: ['le crime'], it: ['il reato'], pt: ['o crime'] }, pos: 'noun', level: 'B1', category: 'society' },
    { id: 'en3v027', de: 'the tax', en: ['tax'], gloss: { de: ['die Steuer'], es: ['el impuesto'], fr: ['l’impôt'], it: ['la tassa'], pt: ['o imposto'] }, pos: 'noun', level: 'B1', category: 'society' },
    { id: 'en3v028', de: 'the poverty', en: ['poverty'], gloss: { de: ['die Armut'], es: ['la pobreza'], fr: ['la pauvreté'], it: ['la povertà'], pt: ['a pobreza'] }, pos: 'noun', level: 'B1', category: 'society' },
    { id: 'en3v029', de: 'to vote', en: ['to vote'], gloss: { de: ['wählen', 'abstimmen'], es: ['votar'], fr: ['voter'], it: ['votare'], pt: ['votar'] }, pos: 'verb', level: 'B1', category: 'society' },
    { id: 'en3v030', de: 'to protest', en: ['to protest'], gloss: { de: ['protestieren'], es: ['protestar'], fr: ['protester'], it: ['protestare'], pt: ['protestar'] }, pos: 'verb', level: 'B1', category: 'society' },
    // ── media & news ──────────────────────────────────────────────────────
    { id: 'en3v031', de: 'the news', en: ['news'], gloss: { de: ['die Nachrichten'], es: ['las noticias'], fr: ['les informations', 'les actualités'], it: ['le notizie'], pt: ['as notícias'] }, pos: 'noun', level: 'B1', category: 'media' },
    { id: 'en3v032', de: 'the headline', en: ['headline'], gloss: { de: ['die Schlagzeile'], es: ['el titular'], fr: ['le gros titre'], it: ['il titolo'], pt: ['a manchete'] }, pos: 'noun', level: 'B1', category: 'media' },
    { id: 'en3v033', de: 'the article', en: ['article'], gloss: { de: ['der Artikel'], es: ['el artículo'], fr: ['l’article'], it: ['l’articolo'], pt: ['o artigo'] }, pos: 'noun', level: 'B1', category: 'media' },
    { id: 'en3v034', de: 'the journalist', en: ['journalist', 'the reporter'], gloss: { de: ['der Journalist'], es: ['el periodista'], fr: ['le journaliste'], it: ['il giornalista'], pt: ['o jornalista'] }, pos: 'noun', level: 'B1', category: 'media' },
    { id: 'en3v035', de: 'the advertisement', en: ['advertisement', 'the ad'], gloss: { de: ['die Werbung'], es: ['el anuncio'], fr: ['la publicité'], it: ['la pubblicità'], pt: ['o anúncio'] }, pos: 'noun', level: 'B1', category: 'media' },
    { id: 'en3v036', de: 'the source', en: ['source'], gloss: { de: ['die Quelle'], es: ['la fuente'], fr: ['la source'], it: ['la fonte'], pt: ['a fonte'] }, pos: 'noun', level: 'B1', category: 'media' },
    { id: 'en3v037', de: 'the audience', en: ['audience'], gloss: { de: ['das Publikum'], es: ['el público'], fr: ['le public'], it: ['il pubblico'], pt: ['o público'] }, pos: 'noun', level: 'B1', category: 'media' },
    { id: 'en3v038', de: 'to publish', en: ['to publish'], gloss: { de: ['veröffentlichen'], es: ['publicar'], fr: ['publier'], it: ['pubblicare'], pt: ['publicar'] }, pos: 'verb', level: 'B1', category: 'media' },
    { id: 'en3v039', de: 'to broadcast', en: ['to broadcast', 'to air'], gloss: { de: ['senden', 'übertragen'], es: ['emitir'], fr: ['diffuser'], it: ['trasmettere'], pt: ['transmitir'] }, pos: 'verb', level: 'B1', category: 'media' },
    { id: 'en3v040', de: 'to share', en: ['to share'], gloss: { de: ['teilen'], es: ['compartir'], fr: ['partager'], it: ['condividere'], pt: ['compartilhar', 'partilhar'] }, pos: 'verb', level: 'B1', category: 'media' },
    // ── environment ───────────────────────────────────────────────────────
    { id: 'en3v041', de: 'the environment', en: ['environment'], gloss: { de: ['die Umwelt'], es: ['el medio ambiente'], fr: ['l’environnement'], it: ['l’ambiente'], pt: ['o meio ambiente'] }, pos: 'noun', level: 'B1', category: 'environment' },
    { id: 'en3v042', de: 'the climate', en: ['climate'], gloss: { de: ['das Klima'], es: ['el clima'], fr: ['le climat'], it: ['il clima'], pt: ['o clima'] }, pos: 'noun', level: 'B1', category: 'environment' },
    { id: 'en3v043', de: 'the pollution', en: ['pollution'], gloss: { de: ['die Verschmutzung'], es: ['la contaminación'], fr: ['la pollution'], it: ['l’inquinamento'], pt: ['a poluição'] }, pos: 'noun', level: 'B1', category: 'environment' },
    { id: 'en3v044', de: 'the waste', en: ['waste', 'the rubbish'], gloss: { de: ['der Abfall', 'der Müll'], es: ['los residuos', 'la basura'], fr: ['les déchets'], it: ['i rifiuti'], pt: ['o lixo'] }, pos: 'noun', level: 'B1', category: 'environment' },
    { id: 'en3v045', de: 'the energy', en: ['energy'], gloss: { de: ['die Energie'], es: ['la energía'], fr: ['l’énergie'], it: ['l’energia'], pt: ['a energia'] }, pos: 'noun', level: 'B1', category: 'environment' },
    { id: 'en3v046', de: 'the species', en: ['species'], gloss: { de: ['die Art'], es: ['la especie'], fr: ['l’espèce'], it: ['la specie'], pt: ['a espécie'] }, pos: 'noun', level: 'B1', category: 'environment' },
    { id: 'en3v047', de: 'to recycle', en: ['to recycle'], gloss: { de: ['recyceln'], es: ['reciclar'], fr: ['recycler'], it: ['riciclare'], pt: ['reciclar'] }, pos: 'verb', level: 'B1', category: 'environment' },
    { id: 'en3v048', de: 'to pollute', en: ['to pollute'], gloss: { de: ['verschmutzen'], es: ['contaminar'], fr: ['polluer'], it: ['inquinare'], pt: ['poluir'] }, pos: 'verb', level: 'B1', category: 'environment' },
    { id: 'en3v049', de: 'to protect', en: ['to protect'], gloss: { de: ['schützen'], es: ['proteger'], fr: ['protéger'], it: ['proteggere'], pt: ['proteger'] }, pos: 'verb', level: 'B1', category: 'environment' },
    { id: 'en3v050', de: 'to consume', en: ['to consume', 'to use up'], gloss: { de: ['verbrauchen'], es: ['consumir'], fr: ['consommer'], it: ['consumare'], pt: ['consumir'] }, pos: 'verb', level: 'B1', category: 'environment' },
    // ── abstract nouns ────────────────────────────────────────────────────
    { id: 'en3v051', de: 'the commitment', en: ['commitment'], gloss: { de: ['die Verpflichtung'], es: ['el compromiso'], fr: ['l’engagement'], it: ['l’impegno'], pt: ['o compromisso'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v052', de: 'the development', en: ['development'], gloss: { de: ['die Entwicklung'], es: ['el desarrollo'], fr: ['le développement'], it: ['lo sviluppo'], pt: ['o desenvolvimento'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v053', de: 'the freedom', en: ['freedom', 'the liberty'], gloss: { de: ['die Freiheit'], es: ['la libertad'], fr: ['la liberté'], it: ['la libertà'], pt: ['a liberdade'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v054', de: 'the effort', en: ['effort'], gloss: { de: ['die Anstrengung', 'die Mühe'], es: ['el esfuerzo'], fr: ['l’effort'], it: ['lo sforzo'], pt: ['o esforço'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v055', de: 'the reason', en: ['reason'], gloss: { de: ['der Grund'], es: ['la razón', 'el motivo'], fr: ['la raison'], it: ['il motivo'], pt: ['a razão', 'o motivo'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v056', de: 'the result', en: ['result', 'the outcome'], gloss: { de: ['das Ergebnis'], es: ['el resultado'], fr: ['le résultat'], it: ['il risultato'], pt: ['o resultado'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v057', de: 'the choice', en: ['choice'], gloss: { de: ['die Wahl'], es: ['la elección'], fr: ['le choix'], it: ['la scelta'], pt: ['a escolha'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v058', de: 'the risk', en: ['risk'], gloss: { de: ['das Risiko'], es: ['el riesgo'], fr: ['le risque'], it: ['il rischio'], pt: ['o risco'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v059', de: 'the purpose', en: ['purpose', 'the aim'], gloss: { de: ['der Zweck'], es: ['el propósito', 'la finalidad'], fr: ['le but'], it: ['lo scopo'], pt: ['o propósito', 'a finalidade'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v060', de: 'the influence', en: ['influence'], gloss: { de: ['der Einfluss'], es: ['la influencia'], fr: ['l’influence'], it: ['l’influenza'], pt: ['a influência'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    // ── discourse connectors ──────────────────────────────────────────────
    { id: 'en3v061', de: 'however', en: ['however'], gloss: { de: ['jedoch', 'allerdings'], es: ['sin embargo'], fr: ['cependant'], it: ['tuttavia'], pt: ['no entanto'] }, pos: 'adv', level: 'B1', category: 'connectors' },
    { id: 'en3v062', de: 'therefore', en: ['therefore'], gloss: { de: ['deshalb', 'daher'], es: ['por lo tanto'], fr: ['par conséquent', 'donc'], it: ['quindi', 'perciò'], pt: ['portanto'] }, pos: 'adv', level: 'B1', category: 'connectors' },
    { id: 'en3v063', de: 'although', en: ['although', 'even though'], gloss: { de: ['obwohl'], es: ['aunque'], fr: ['bien que'], it: ['anche se', 'sebbene'], pt: ['embora'] }, pos: 'conj', level: 'B1', category: 'connectors' },
    { id: 'en3v064', de: 'despite', en: ['despite', 'in spite of'], gloss: { de: ['trotz'], es: ['a pesar de'], fr: ['malgré'], it: ['nonostante'], pt: ['apesar de'] }, pos: 'prep', level: 'B1', category: 'connectors' },
    { id: 'en3v065', de: 'nevertheless', en: ['nevertheless'], gloss: { de: ['trotzdem'], es: ['no obstante'], fr: ['néanmoins'], it: ['ciononostante'], pt: ['mesmo assim'] }, pos: 'adv', level: 'B1', category: 'connectors' },
    { id: 'en3v066', de: 'moreover', en: ['moreover', 'furthermore'], gloss: { de: ['außerdem'], es: ['además'], fr: ['de plus'], it: ['inoltre'], pt: ['além disso'] }, pos: 'adv', level: 'B1', category: 'connectors' },
    { id: 'en3v067', de: 'whereas', en: ['whereas', 'while'], gloss: { de: ['während', 'wohingegen'], es: ['mientras que'], fr: ['alors que'], it: ['mentre'], pt: ['enquanto'] }, pos: 'conj', level: 'B1', category: 'connectors' },
    { id: 'en3v068', de: 'otherwise', en: ['otherwise'], gloss: { de: ['sonst', 'andernfalls'], es: ['si no', 'de lo contrario'], fr: ['sinon'], it: ['altrimenti'], pt: ['caso contrário'] }, pos: 'adv', level: 'B1', category: 'connectors' },
    { id: 'en3v069', de: 'in fact', en: ['in fact', 'actually'], gloss: { de: ['tatsächlich'], es: ['de hecho'], fr: ['en fait'], it: ['in effetti'], pt: ['na verdade'] }, pos: 'phrase', level: 'B1', category: 'connectors' },
    { id: 'en3v070', de: 'on the other hand', en: ['on the other hand'], gloss: { de: ['andererseits'], es: ['por otro lado'], fr: ['d’un autre côté'], it: ['d’altra parte'], pt: ['por outro lado'] }, pos: 'phrase', level: 'B1', category: 'connectors' },
    // ── emotions & attitude ───────────────────────────────────────────────
    { id: 'en3v071', de: 'proud', en: ['proud'], gloss: { de: ['stolz'], es: ['orgulloso'], fr: ['fier'], it: ['orgoglioso'], pt: ['orgulhoso'] }, pos: 'adj', level: 'B1', category: 'emotions' },
    { id: 'en3v072', de: 'disappointed', en: ['disappointed'], gloss: { de: ['enttäuscht'], es: ['decepcionado'], fr: ['déçu'], it: ['deluso'], pt: ['decepcionado'] }, pos: 'adj', level: 'B1', category: 'emotions' },
    { id: 'en3v073', de: 'relieved', en: ['relieved'], gloss: { de: ['erleichtert'], es: ['aliviado'], fr: ['soulagé'], it: ['sollevato'], pt: ['aliviado'] }, pos: 'adj', level: 'B1', category: 'emotions' },
    { id: 'en3v074', de: 'embarrassed', en: ['embarrassed'], gloss: { de: ['verlegen', 'peinlich berührt'], es: ['avergonzado'], fr: ['gêné'], it: ['imbarazzato'], pt: ['envergonhado'] }, pos: 'adj', level: 'B1', category: 'emotions' },
    { id: 'en3v075', de: 'frustrated', en: ['frustrated'], gloss: { de: ['frustriert'], es: ['frustrado'], fr: ['frustré'], it: ['frustrato'], pt: ['frustrado'] }, pos: 'adj', level: 'B1', category: 'emotions' },
    { id: 'en3v076', de: 'confident', en: ['confident', 'self-assured'], gloss: { de: ['selbstbewusst', 'zuversichtlich'], es: ['seguro de sí mismo'], fr: ['confiant'], it: ['sicuro di sé'], pt: ['confiante'] }, pos: 'adj', level: 'B1', category: 'emotions' },
    { id: 'en3v077', de: 'jealous', en: ['jealous'], gloss: { de: ['eifersüchtig'], es: ['celoso'], fr: ['jaloux'], it: ['geloso'], pt: ['ciumento'] }, pos: 'adj', level: 'B1', category: 'emotions' },
    { id: 'en3v078', de: 'to regret', en: ['to regret'], gloss: { de: ['bereuen'], es: ['arrepentirse de', 'lamentar'], fr: ['regretter'], it: ['pentirsi di', 'rimpiangere'], pt: ['arrepender-se de', 'lamentar'] }, pos: 'verb', level: 'B1', category: 'emotions' },
    { id: 'en3v079', de: 'to complain', en: ['to complain'], gloss: { de: ['sich beschweren'], es: ['quejarse'], fr: ['se plaindre'], it: ['lamentarsi'], pt: ['reclamar'] }, pos: 'verb', level: 'B1', category: 'emotions' },
    { id: 'en3v080', de: 'to trust', en: ['to trust'], gloss: { de: ['vertrauen'], es: ['confiar en'], fr: ['faire confiance à'], it: ['fidarsi di'], pt: ['confiar em'] }, pos: 'verb', level: 'B1', category: 'emotions' },
    // ── education & learning ──────────────────────────────────────────────
    { id: 'en3v081', de: 'the knowledge', en: ['knowledge'], gloss: { de: ['das Wissen'], es: ['el conocimiento'], fr: ['les connaissances', 'le savoir'], it: ['la conoscenza'], pt: ['o conhecimento'] }, pos: 'noun', level: 'B1', category: 'education' },
    { id: 'en3v082', de: 'the research', en: ['research'], gloss: { de: ['die Forschung'], es: ['la investigación'], fr: ['la recherche'], it: ['la ricerca'], pt: ['a pesquisa'] }, pos: 'noun', level: 'B1', category: 'education' },
    { id: 'en3v083', de: 'the degree', en: ['degree'], gloss: { de: ['der Abschluss'], es: ['el título'], fr: ['le diplôme'], it: ['la laurea'], pt: ['o diploma'] }, pos: 'noun', level: 'B1', category: 'education' },
    { id: 'en3v084', de: 'the subject', en: ['subject'], gloss: { de: ['das Fach'], es: ['la asignatura'], fr: ['la matière'], it: ['la materia'], pt: ['a disciplina'] }, pos: 'noun', level: 'B1', category: 'education' },
    { id: 'en3v085', de: 'the lecture', en: ['lecture'], gloss: { de: ['die Vorlesung'], es: ['la clase magistral'], fr: ['le cours magistral'], it: ['la lezione'], pt: ['a aula'] }, pos: 'noun', level: 'B1', category: 'education' },
    { id: 'en3v086', de: 'the essay', en: ['essay'], gloss: { de: ['der Aufsatz'], es: ['la redacción', 'el ensayo'], fr: ['la dissertation'], it: ['il tema', 'il saggio'], pt: ['a redação'] }, pos: 'noun', level: 'B1', category: 'education' },
    { id: 'en3v087', de: 'the scholarship', en: ['scholarship', 'the grant'], gloss: { de: ['das Stipendium'], es: ['la beca'], fr: ['la bourse'], it: ['la borsa di studio'], pt: ['a bolsa de estudos'] }, pos: 'noun', level: 'B1', category: 'education' },
    { id: 'en3v088', de: 'to improve', en: ['to improve'], gloss: { de: ['verbessern'], es: ['mejorar'], fr: ['améliorer'], it: ['migliorare'], pt: ['melhorar'] }, pos: 'verb', level: 'B1', category: 'education' },
    { id: 'en3v089', de: 'to achieve', en: ['to achieve'], gloss: { de: ['erreichen'], es: ['lograr', 'conseguir'], fr: ['atteindre', 'réaliser'], it: ['raggiungere'], pt: ['alcançar', 'conseguir'] }, pos: 'verb', level: 'B1', category: 'education' },
    { id: 'en3v090', de: 'to fail', en: ['to fail'], gloss: { de: ['scheitern', 'durchfallen'], es: ['fracasar', 'suspender'], fr: ['échouer'], it: ['fallire', 'essere bocciato'], pt: ['fracassar', 'reprovar'] }, pos: 'verb', level: 'B1', category: 'education' },
    // ── adjectives of judgement ───────────────────────────────────────────
    { id: 'en3v091', de: 'reliable', en: ['reliable', 'dependable'], gloss: { de: ['zuverlässig'], es: ['fiable'], fr: ['fiable'], it: ['affidabile'], pt: ['confiável'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
    { id: 'en3v092', de: 'reasonable', en: ['reasonable', 'sensible'], gloss: { de: ['vernünftig'], es: ['razonable'], fr: ['raisonnable'], it: ['ragionevole'], pt: ['razoável'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
    { id: 'en3v093', de: 'aware', en: ['aware', 'conscious'], gloss: { de: ['bewusst'], es: ['consciente'], fr: ['conscient'], it: ['consapevole'], pt: ['consciente'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
    { id: 'en3v094', de: 'successful', en: ['successful'], gloss: { de: ['erfolgreich'], es: ['exitoso', 'de éxito'], fr: ['qui réussit', 'à succès'], it: ['di successo'], pt: ['bem-sucedido'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
    { id: 'en3v095', de: 'responsible', en: ['responsible'], gloss: { de: ['verantwortlich'], es: ['responsable'], fr: ['responsable'], it: ['responsabile'], pt: ['responsável'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
    { id: 'en3v096', de: 'likely', en: ['likely', 'probable'], gloss: { de: ['wahrscheinlich'], es: ['probable'], fr: ['probable'], it: ['probabile'], pt: ['provável'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
    { id: 'en3v097', de: 'serious', en: ['serious'], gloss: { de: ['ernst'], es: ['serio', 'grave'], fr: ['sérieux', 'grave'], it: ['serio', 'grave'], pt: ['sério', 'grave'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
    { id: 'en3v098', de: 'willing', en: ['willing'], gloss: { de: ['bereit'], es: ['dispuesto'], fr: ['disposé', 'prêt'], it: ['disposto'], pt: ['disposto'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
    { id: 'en3v099', de: 'worthwhile', en: ['worthwhile', 'worth it'], gloss: { de: ['lohnenswert'], es: ['que merece la pena'], fr: ['qui en vaut la peine'], it: ['che vale la pena'], pt: ['que vale a pena'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
    { id: 'en3v100', de: 'affordable', en: ['affordable'], gloss: { de: ['erschwinglich'], es: ['asequible'], fr: ['abordable'], it: ['accessibile'], pt: ['acessível'] }, pos: 'adj', level: 'B1', category: 'adjectives' },
    // ── phrasal verbs ─────────────────────────────────────────────────────
    { id: 'en3v101', de: 'to put off', en: ['to put off', 'to postpone'], gloss: { de: ['verschieben', 'aufschieben'], es: ['aplazar', 'posponer'], fr: ['reporter', 'remettre'], it: ['rimandare'], pt: ['adiar'] }, pos: 'verb', level: 'B1', category: 'phrasal' },
    { id: 'en3v102', de: 'to give up', en: ['to give up'], gloss: { de: ['aufgeben'], es: ['dejar', 'rendirse'], fr: ['abandonner', 'renoncer'], it: ['rinunciare', 'smettere'], pt: ['desistir', 'parar'] }, pos: 'verb', level: 'B1', category: 'phrasal' },
    { id: 'en3v103', de: 'to turn down', en: ['to turn down', 'to reject'], gloss: { de: ['ablehnen'], es: ['rechazar'], fr: ['refuser'], it: ['rifiutare'], pt: ['recusar'] }, pos: 'verb', level: 'B1', category: 'phrasal' },
    { id: 'en3v104', de: 'to carry on', en: ['to carry on', 'to continue'], gloss: { de: ['weitermachen'], es: ['continuar', 'seguir'], fr: ['continuer'], it: ['continuare'], pt: ['continuar', 'prosseguir'] }, pos: 'verb', level: 'B1', category: 'phrasal' },
    { id: 'en3v105', de: 'to set up', en: ['to set up', 'to found'], gloss: { de: ['gründen', 'einrichten'], es: ['montar', 'establecer'], fr: ['créer', 'mettre en place'], it: ['fondare', 'creare'], pt: ['montar', 'fundar'] }, pos: 'verb', level: 'B1', category: 'phrasal' },
    { id: 'en3v106', de: 'to point out', en: ['to point out'], gloss: { de: ['hinweisen auf'], es: ['señalar'], fr: ['faire remarquer', 'signaler'], it: ['far notare'], pt: ['apontar', 'salientar'] }, pos: 'verb', level: 'B1', category: 'phrasal' },
    { id: 'en3v107', de: 'to deal with', en: ['to deal with', 'to handle'], gloss: { de: ['umgehen mit', 'sich befassen mit'], es: ['tratar con', 'ocuparse de'], fr: ['s’occuper de', 'traiter'], it: ['occuparsi di', 'affrontare'], pt: ['lidar com'] }, pos: 'verb', level: 'B1', category: 'phrasal' },
    { id: 'en3v108', de: 'to look after', en: ['to look after', 'to take care of'], gloss: { de: ['sich kümmern um'], es: ['cuidar de'], fr: ['s’occuper de'], it: ['prendersi cura di'], pt: ['cuidar de'] }, pos: 'verb', level: 'B1', category: 'phrasal' },
    { id: 'en3v109', de: 'to find out', en: ['to find out'], gloss: { de: ['herausfinden'], es: ['averiguar', 'descubrir'], fr: ['découvrir'], it: ['scoprire'], pt: ['descobrir'] }, pos: 'verb', level: 'B1', category: 'phrasal' },
    { id: 'en3v110', de: 'to break down', en: ['to break down'], gloss: { de: ['zusammenbrechen', 'kaputtgehen'], es: ['averiarse', 'fracasar'], fr: ['tomber en panne', 'échouer'], it: ['guastarsi', 'fallire'], pt: ['quebrar', 'fracassar'] }, pos: 'verb', level: 'B1', category: 'phrasal' },
    // ── technology ────────────────────────────────────────────────────────
    { id: 'en3v111', de: 'the device', en: ['device'], gloss: { de: ['das Gerät'], es: ['el dispositivo'], fr: ['l’appareil'], it: ['il dispositivo'], pt: ['o dispositivo'] }, pos: 'noun', level: 'B1', category: 'technology' },
    { id: 'en3v112', de: 'the screen', en: ['screen'], gloss: { de: ['der Bildschirm'], es: ['la pantalla'], fr: ['l’écran'], it: ['lo schermo'], pt: ['a tela'] }, pos: 'noun', level: 'B1', category: 'technology' },
    { id: 'en3v113', de: 'the software', en: ['software'], gloss: { de: ['die Software'], es: ['el software'], fr: ['le logiciel'], it: ['il software'], pt: ['o software'] }, pos: 'noun', level: 'B1', category: 'technology' },
    { id: 'en3v114', de: 'the network', en: ['network'], gloss: { de: ['das Netzwerk'], es: ['la red'], fr: ['le réseau'], it: ['la rete'], pt: ['a rede'] }, pos: 'noun', level: 'B1', category: 'technology' },
    { id: 'en3v115', de: 'the password', en: ['password'], gloss: { de: ['das Passwort'], es: ['la contraseña'], fr: ['le mot de passe'], it: ['la password'], pt: ['a senha'] }, pos: 'noun', level: 'B1', category: 'technology' },
    { id: 'en3v116', de: 'the file', en: ['file'], gloss: { de: ['die Datei'], es: ['el archivo'], fr: ['le fichier'], it: ['il file'], pt: ['o arquivo'] }, pos: 'noun', level: 'B1', category: 'technology' },
    { id: 'en3v117', de: 'the setting', en: ['setting'], gloss: { de: ['die Einstellung'], es: ['el ajuste'], fr: ['le paramètre'], it: ['l’impostazione'], pt: ['a configuração'] }, pos: 'noun', level: 'B1', category: 'technology' },
    { id: 'en3v118', de: 'to download', en: ['to download'], gloss: { de: ['herunterladen'], es: ['descargar'], fr: ['télécharger'], it: ['scaricare'], pt: ['baixar'] }, pos: 'verb', level: 'B1', category: 'technology' },
    { id: 'en3v119', de: 'to install', en: ['to install'], gloss: { de: ['installieren'], es: ['instalar'], fr: ['installer'], it: ['installare'], pt: ['instalar'] }, pos: 'verb', level: 'B1', category: 'technology' },
    { id: 'en3v120', de: 'to log in', en: ['to log in'], gloss: { de: ['sich anmelden', 'sich einloggen'], es: ['iniciar sesión'], fr: ['se connecter'], it: ['accedere'], pt: ['fazer login'] }, pos: 'verb', level: 'B1', category: 'technology' },
    // ── relationships ─────────────────────────────────────────────────────
    { id: 'en3v121', de: 'the relationship', en: ['relationship'], gloss: { de: ['die Beziehung'], es: ['la relación'], fr: ['la relation'], it: ['la relazione'], pt: ['o relacionamento'] }, pos: 'noun', level: 'B1', category: 'relationships' },
    { id: 'en3v122', de: 'the couple', en: ['couple'], gloss: { de: ['das Paar'], es: ['la pareja'], fr: ['le couple'], it: ['la coppia'], pt: ['o casal'] }, pos: 'noun', level: 'B1', category: 'relationships' },
    { id: 'en3v123', de: 'the partner', en: ['partner'], gloss: { de: ['der Partner'], es: ['el compañero'], fr: ['le partenaire'], it: ['il partner'], pt: ['o parceiro'] }, pos: 'noun', level: 'B1', category: 'relationships' },
    { id: 'en3v124', de: 'the wedding', en: ['wedding'], gloss: { de: ['die Hochzeit'], es: ['la boda'], fr: ['le mariage'], it: ['le nozze'], pt: ['o casamento'] }, pos: 'noun', level: 'B1', category: 'relationships' },
    { id: 'en3v125', de: 'the marriage', en: ['marriage'], gloss: { de: ['die Ehe'], es: ['el matrimonio'], fr: ['le mariage'], it: ['il matrimonio'], pt: ['o casamento'] }, pos: 'noun', level: 'B1', category: 'relationships' },
    { id: 'en3v126', de: 'to get on with', en: ['to get on with', 'to get along with'], gloss: { de: ['gut auskommen mit'], es: ['llevarse bien con'], fr: ['bien s’entendre avec'], it: ['andare d’accordo con'], pt: ['dar-se bem com'] }, pos: 'verb', level: 'B1', category: 'relationships' },
    { id: 'en3v127', de: 'to fall out', en: ['to fall out'], gloss: { de: ['sich zerstreiten'], es: ['enemistarse', 'pelearse'], fr: ['se brouiller'], it: ['litigare'], pt: ['brigar'] }, pos: 'verb', level: 'B1', category: 'relationships' },
    { id: 'en3v128', de: 'to look forward to', en: ['to look forward to'], gloss: { de: ['sich freuen auf'], es: ['tener ganas de'], fr: ['avoir hâte de'], it: ['non vedere l’ora di'], pt: ['estar ansioso por'] }, pos: 'phrase', level: 'B1', category: 'relationships' },
    { id: 'en3v129', de: 'loyal', en: ['loyal'], gloss: { de: ['treu', 'loyal'], es: ['leal'], fr: ['loyal'], it: ['leale'], pt: ['leal'] }, pos: 'adj', level: 'B1', category: 'relationships' },
    { id: 'en3v130', de: 'honest', en: ['honest'], gloss: { de: ['ehrlich'], es: ['honesto', 'sincero'], fr: ['honnête'], it: ['onesto'], pt: ['honesto'] }, pos: 'adj', level: 'B1', category: 'relationships' },
    // ── money & finance ───────────────────────────────────────────────────
    { id: 'en3v131', de: 'the budget', en: ['budget'], gloss: { de: ['das Budget'], es: ['el presupuesto'], fr: ['le budget'], it: ['il budget'], pt: ['o orçamento'] }, pos: 'noun', level: 'B1', category: 'money' },
    { id: 'en3v132', de: 'the loan', en: ['loan'], gloss: { de: ['der Kredit', 'das Darlehen'], es: ['el préstamo'], fr: ['le prêt'], it: ['il prestito'], pt: ['o empréstimo'] }, pos: 'noun', level: 'B1', category: 'money' },
    { id: 'en3v133', de: 'the debt', en: ['debt'], gloss: { de: ['die Schulden'], es: ['la deuda'], fr: ['la dette'], it: ['il debito'], pt: ['a dívida'] }, pos: 'noun', level: 'B1', category: 'money' },
    { id: 'en3v134', de: 'the savings', en: ['savings'], gloss: { de: ['die Ersparnisse'], es: ['los ahorros'], fr: ['les économies'], it: ['i risparmi'], pt: ['as economias'] }, pos: 'noun', level: 'B1', category: 'money' },
    { id: 'en3v135', de: 'the income', en: ['income'], gloss: { de: ['das Einkommen'], es: ['los ingresos'], fr: ['le revenu'], it: ['il reddito'], pt: ['a renda'] }, pos: 'noun', level: 'B1', category: 'money' },
    { id: 'en3v136', de: 'the expense', en: ['expense'], gloss: { de: ['die Ausgabe'], es: ['el gasto'], fr: ['la dépense'], it: ['la spesa'], pt: ['a despesa'] }, pos: 'noun', level: 'B1', category: 'money' },
    { id: 'en3v137', de: 'to afford', en: ['to afford'], gloss: { de: ['sich leisten können'], es: ['permitirse'], fr: ['avoir les moyens de'], it: ['permettersi'], pt: ['ter condições de pagar'] }, pos: 'verb', level: 'B1', category: 'money' },
    { id: 'en3v138', de: 'to save', en: ['to save'], gloss: { de: ['sparen'], es: ['ahorrar'], fr: ['économiser'], it: ['risparmiare'], pt: ['poupar', 'economizar'] }, pos: 'verb', level: 'B1', category: 'money' },
    { id: 'en3v139', de: 'to owe', en: ['to owe'], gloss: { de: ['schulden'], es: ['deber'], fr: ['devoir'], it: ['dovere'], pt: ['dever'] }, pos: 'verb', level: 'B1', category: 'money' },
    { id: 'en3v140', de: 'to invest', en: ['to invest'], gloss: { de: ['investieren'], es: ['invertir'], fr: ['investir'], it: ['investire'], pt: ['investir'] }, pos: 'verb', level: 'B1', category: 'money' },
    // ── civic & city life ─────────────────────────────────────────────────
    { id: 'en3v141', de: 'the council', en: ['council'], gloss: { de: ['der Stadtrat', 'die Stadtverwaltung'], es: ['el ayuntamiento'], fr: ['le conseil municipal'], it: ['il comune'], pt: ['a prefeitura'] }, pos: 'noun', level: 'B1', category: 'civic' },
    { id: 'en3v142', de: 'the committee', en: ['committee'], gloss: { de: ['der Ausschuss'], es: ['el comité'], fr: ['le comité'], it: ['la commissione'], pt: ['a comissão'] }, pos: 'noun', level: 'B1', category: 'civic' },
    { id: 'en3v143', de: 'the proposal', en: ['proposal'], gloss: { de: ['der Vorschlag'], es: ['la propuesta'], fr: ['la proposition'], it: ['la proposta'], pt: ['a proposta'] }, pos: 'noun', level: 'B1', category: 'civic' },
    { id: 'en3v144', de: 'the charity', en: ['charity'], gloss: { de: ['die Wohltätigkeitsorganisation'], es: ['la organización benéfica'], fr: ['l’association caritative'], it: ['l’associazione benefica'], pt: ['a instituição de caridade'] }, pos: 'noun', level: 'B1', category: 'civic' },
    { id: 'en3v145', de: 'the volunteer', en: ['volunteer'], gloss: { de: ['der Freiwillige'], es: ['el voluntario'], fr: ['le bénévole'], it: ['il volontario'], pt: ['o voluntário'] }, pos: 'noun', level: 'B1', category: 'civic' },
    { id: 'en3v146', de: 'the resident', en: ['resident'], gloss: { de: ['der Anwohner'], es: ['el residente'], fr: ['le résident'], it: ['il residente'], pt: ['o morador'] }, pos: 'noun', level: 'B1', category: 'civic' },
    { id: 'en3v147', de: 'the neighbourhood', en: ['neighbourhood', 'neighborhood'], gloss: { de: ['das Viertel'], es: ['el barrio'], fr: ['le quartier'], it: ['il quartiere'], pt: ['o bairro'] }, pos: 'noun', level: 'B1', category: 'civic' },
    { id: 'en3v148', de: 'the shortage', en: ['shortage'], gloss: { de: ['der Mangel'], es: ['la escasez'], fr: ['la pénurie'], it: ['la carenza'], pt: ['a escassez'] }, pos: 'noun', level: 'B1', category: 'civic' },
    { id: 'en3v149', de: 'the accommodation', en: ['accommodation', 'the housing'], gloss: { de: ['die Unterkunft'], es: ['el alojamiento'], fr: ['le logement'], it: ['l’alloggio'], pt: ['a hospedagem'] }, pos: 'noun', level: 'B1', category: 'civic' },
    { id: 'en3v150', de: 'the transport', en: ['transport', 'transportation'], gloss: { de: ['die Verkehrsmittel'], es: ['el transporte'], fr: ['les transports'], it: ['i trasporti'], pt: ['o transporte'] }, pos: 'noun', level: 'B1', category: 'civic' },
    // ── more abstract nouns ───────────────────────────────────────────────
    { id: 'en3v151', de: 'the evidence', en: ['evidence', 'the proof'], gloss: { de: ['die Beweise'], es: ['las pruebas'], fr: ['les preuves'], it: ['le prove'], pt: ['as provas'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v152', de: 'the conclusion', en: ['conclusion'], gloss: { de: ['die Schlussfolgerung'], es: ['la conclusión'], fr: ['la conclusion'], it: ['la conclusione'], pt: ['a conclusão'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v153', de: 'the advantage', en: ['advantage'], gloss: { de: ['der Vorteil'], es: ['la ventaja'], fr: ['l’avantage'], it: ['il vantaggio'], pt: ['a vantagem'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v154', de: 'the disadvantage', en: ['disadvantage', 'the drawback'], gloss: { de: ['der Nachteil'], es: ['la desventaja'], fr: ['l’inconvénient'], it: ['lo svantaggio'], pt: ['a desvantagem'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v155', de: 'the lack', en: ['lack'], gloss: { de: ['das Fehlen'], es: ['la falta'], fr: ['le manque'], it: ['la mancanza'], pt: ['a falta'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v156', de: 'the strategy', en: ['strategy'], gloss: { de: ['die Strategie'], es: ['la estrategia'], fr: ['la stratégie'], it: ['la strategia'], pt: ['a estratégia'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v157', de: 'the approach', en: ['approach'], gloss: { de: ['der Ansatz'], es: ['el enfoque'], fr: ['l’approche'], it: ['l’approccio'], pt: ['a abordagem'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v158', de: 'the pressure', en: ['pressure'], gloss: { de: ['der Druck'], es: ['la presión'], fr: ['la pression'], it: ['la pressione'], pt: ['a pressão'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v159', de: 'the attitude', en: ['attitude'], gloss: { de: ['die Haltung'], es: ['la actitud'], fr: ['l’attitude'], it: ['l’atteggiamento'], pt: ['a atitude'] }, pos: 'noun', level: 'B1', category: 'abstract' },
    { id: 'en3v160', de: 'the permission', en: ['permission'], gloss: { de: ['die Genehmigung'], es: ['el permiso'], fr: ['l’autorisation'], it: ['il permesso'], pt: ['a permissão'] }, pos: 'noun', level: 'B1', category: 'abstract' },
];
