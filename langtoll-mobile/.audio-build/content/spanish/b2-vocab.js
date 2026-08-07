"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.B2_VOCAB = void 0;
// Spanish (Peninsular (Spain)) B2 vocabulary. The `de` field holds the Spanish
// text (see the note in content/german/types.ts). Nouns include the article
// (el/la).
//
// B2 is where the learner stops stating positions and starts qualifying them:
// hedging, concession, speculation, cause and consequence, and the difference
// between what is said and what is meant. The lexis follows — argument
// connectors a B1 pack never reaches (no obstante, por mucho que, de ahí que),
// register markers for disagreeing politely, and the abstract nouns that let
// you talk about the shape of an argument rather than its subject.
//
// Domains are deliberately adult and non-domestic: negotiation, media and
// information integrity, science, law, economics, psychology, the ethics of
// technology, urban life and arts criticism. Nothing here repeats A1, A2 or B1.
//
// `gloss` carries the other UI locales — de / fr / it / pt. English lives in
// `en` and is the guaranteed fallback; Spanish itself is never glossed.
//
// Peninsular throughout, as decided for this pack: el móvil, el coche, el
// ordenador, vosotros. No Latin American variants.
exports.B2_VOCAB = [
    // ── work & negotiation ────────────────────────────────────────────────
    { id: 'es4v001', de: 'la negociación', en: ['the negotiation'], gloss: { de: ['die Verhandlung'], fr: ['la négociation'], it: ['la trattativa'], pt: ['a negociação'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
    { id: 'es4v002', de: 'el convenio', en: ['the collective agreement'], gloss: { de: ['der Tarifvertrag'], fr: ['la convention collective'], it: ['il contratto collettivo'], pt: ['a convenção coletiva'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
    { id: 'es4v003', de: 'la plantilla', en: ['the workforce', 'the staff'], gloss: { de: ['die Belegschaft'], fr: ['le personnel'], it: ['l’organico'], pt: ['o quadro de pessoal'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
    { id: 'es4v004', de: 'la jornada laboral', en: ['the working day', 'the working hours'], gloss: { de: ['der Arbeitstag'], fr: ['la journée de travail'], it: ['la giornata lavorativa'], pt: ['a jornada de trabalho'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
    { id: 'es4v005', de: 'la contrapartida', en: ['the trade-off', 'the concession in return'], gloss: { de: ['die Gegenleistung'], fr: ['la contrepartie'], it: ['la contropartita'], pt: ['a contrapartida'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
    { id: 'es4v006', de: 'la cláusula', en: ['the clause'], gloss: { de: ['die Klausel'], fr: ['la clause'], it: ['la clausola'], pt: ['a cláusula'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
    { id: 'es4v007', de: 'el sindicato', en: ['the trade union'], gloss: { de: ['die Gewerkschaft'], fr: ['le syndicat'], it: ['il sindacato'], pt: ['o sindicato'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
    { id: 'es4v008', de: 'ceder', en: ['to give ground', 'to concede'], gloss: { de: ['nachgeben'], fr: ['céder'], it: ['cedere'], pt: ['ceder'] }, pos: 'verb', level: 'B2', category: 'negotiation' },
    { id: 'es4v009', de: 'llegar a un acuerdo', en: ['to reach an agreement'], gloss: { de: ['eine Einigung erzielen'], fr: ['parvenir à un accord'], it: ['raggiungere un accordo'], pt: ['chegar a um acordo'] }, pos: 'phrase', level: 'B2', category: 'negotiation' },
    { id: 'es4v010', de: 'consensuar', en: ['to agree by consensus', 'to hammer out'], gloss: { de: ['einvernehmlich vereinbaren'], fr: ['décider par consensus'], it: ['concordare'], pt: ['acordar por consenso'] }, pos: 'verb', level: 'B2', category: 'negotiation' },
    // ── media & information ───────────────────────────────────────────────
    { id: 'es4v011', de: 'el sesgo', en: ['the bias'], gloss: { de: ['die Voreingenommenheit'], fr: ['le biais'], it: ['il pregiudizio'], pt: ['o enviesamento'] }, pos: 'noun', level: 'B2', category: 'media' },
    { id: 'es4v012', de: 'el bulo', en: ['the hoax', 'the false story'], gloss: { de: ['die Falschmeldung'], fr: ['l’intox'], it: ['la bufala'], pt: ['a notícia falsa'] }, pos: 'noun', level: 'B2', category: 'media' },
    { id: 'es4v013', de: 'la desinformación', en: ['the disinformation'], gloss: { de: ['die Desinformation'], fr: ['la désinformation'], it: ['la disinformazione'], pt: ['a desinformação'] }, pos: 'noun', level: 'B2', category: 'media' },
    { id: 'es4v014', de: 'la portada', en: ['the front page', 'the cover'], gloss: { de: ['die Titelseite'], fr: ['la une'], it: ['la prima pagina'], pt: ['a capa'] }, pos: 'noun', level: 'B2', category: 'media' },
    { id: 'es4v015', de: 'el editorial', en: ['the editorial', 'the leader column'], gloss: { de: ['der Leitartikel'], fr: ['l’éditorial'], it: ['l’editoriale'], pt: ['o editorial'] }, pos: 'noun', level: 'B2', category: 'media' },
    { id: 'es4v016', de: 'la cobertura', en: ['the coverage'], gloss: { de: ['die Berichterstattung'], fr: ['la couverture médiatique'], it: ['la copertura'], pt: ['a cobertura'] }, pos: 'noun', level: 'B2', category: 'media' },
    { id: 'es4v017', de: 'la primicia', en: ['the scoop', 'the exclusive'], gloss: { de: ['die Exklusivmeldung'], fr: ['le scoop'], it: ['lo scoop'], pt: ['o furo jornalístico'] }, pos: 'noun', level: 'B2', category: 'media' },
    { id: 'es4v018', de: 'la audiencia', en: ['the audience', 'the ratings'], gloss: { de: ['die Zuschauerzahl'], fr: ['l’audience'], it: ['l’ascolto'], pt: ['a audiência'] }, pos: 'noun', level: 'B2', category: 'media' },
    { id: 'es4v019', de: 'contrastar', en: ['to cross-check', 'to verify against'], gloss: { de: ['gegenprüfen'], fr: ['recouper'], it: ['riscontrare'], pt: ['confrontar'] }, pos: 'verb', level: 'B2', category: 'media' },
    { id: 'es4v020', de: 'tergiversar', en: ['to distort', 'to twist (words)'], gloss: { de: ['verdrehen'], fr: ['déformer'], it: ['travisare'], pt: ['distorcer'] }, pos: 'verb', level: 'B2', category: 'media' },
    // ── science & environment ─────────────────────────────────────────────
    { id: 'es4v021', de: 'la hipótesis', en: ['the hypothesis'], gloss: { de: ['die Hypothese'], fr: ['l’hypothèse'], it: ['l’ipotesi'], pt: ['a hipótese'] }, pos: 'noun', level: 'B2', category: 'science' },
    { id: 'es4v022', de: 'el ensayo clínico', en: ['the clinical trial'], gloss: { de: ['die klinische Studie'], fr: ['l’essai clinique'], it: ['la sperimentazione clinica'], pt: ['o ensaio clínico'] }, pos: 'noun', level: 'B2', category: 'science' },
    { id: 'es4v023', de: 'la huella de carbono', en: ['the carbon footprint'], gloss: { de: ['der CO2-Fußabdruck'], fr: ['l’empreinte carbone'], it: ['l’impronta di carbonio'], pt: ['a pegada de carbono'] }, pos: 'noun', level: 'B2', category: 'science' },
    { id: 'es4v024', de: 'el vertido', en: ['the spill', 'the discharge'], gloss: { de: ['die Einleitung von Abwasser'], fr: ['le déversement'], it: ['lo sversamento'], pt: ['o derrame'] }, pos: 'noun', level: 'B2', category: 'science' },
    { id: 'es4v025', de: 'la biodiversidad', en: ['the biodiversity'], gloss: { de: ['die Artenvielfalt'], fr: ['la biodiversité'], it: ['la biodiversità'], pt: ['a biodiversidade'] }, pos: 'noun', level: 'B2', category: 'science' },
    { id: 'es4v026', de: 'el calentamiento global', en: ['the global warming'], gloss: { de: ['die Erderwärmung'], fr: ['le réchauffement climatique'], it: ['il riscaldamento globale'], pt: ['o aquecimento global'] }, pos: 'noun', level: 'B2', category: 'science' },
    { id: 'es4v027', de: 'el hallazgo', en: ['the finding', 'the discovery'], gloss: { de: ['der Befund'], fr: ['la découverte'], it: ['la scoperta'], pt: ['a descoberta'] }, pos: 'noun', level: 'B2', category: 'science' },
    { id: 'es4v028', de: 'descartar', en: ['to rule out'], gloss: { de: ['ausschließen'], fr: ['écarter'], it: ['escludere'], pt: ['descartar'] }, pos: 'verb', level: 'B2', category: 'science' },
    { id: 'es4v029', de: 'constatar', en: ['to establish (as fact)', 'to note'], gloss: { de: ['feststellen'], fr: ['constater'], it: ['constatare'], pt: ['constatar'] }, pos: 'verb', level: 'B2', category: 'science' },
    { id: 'es4v030', de: 'agotar', en: ['to deplete', 'to use up'], gloss: { de: ['erschöpfen'], fr: ['épuiser'], it: ['esaurire'], pt: ['esgotar'] }, pos: 'verb', level: 'B2', category: 'science' },
    // ── culture & identity ────────────────────────────────────────────────
    { id: 'es4v031', de: 'el arraigo', en: ['the roots', 'the deep attachment to a place'], gloss: { de: ['die Verwurzelung'], fr: ['l’enracinement'], it: ['il radicamento'], pt: ['o enraizamento'] }, pos: 'noun', level: 'B2', category: 'identity' },
    { id: 'es4v032', de: 'la pertenencia', en: ['the belonging'], gloss: { de: ['die Zugehörigkeit'], fr: ['l’appartenance'], it: ['l’appartenenza'], pt: ['a pertença'] }, pos: 'noun', level: 'B2', category: 'identity' },
    { id: 'es4v033', de: 'la convivencia', en: ['the coexistence', 'living together'], gloss: { de: ['das Zusammenleben'], fr: ['la coexistence'], it: ['la convivenza'], pt: ['a convivência'] }, pos: 'noun', level: 'B2', category: 'identity' },
    { id: 'es4v034', de: 'el prejuicio', en: ['the prejudice'], gloss: { de: ['das Vorurteil'], fr: ['le préjugé'], it: ['il pregiudizio'], pt: ['o preconceito'] }, pos: 'noun', level: 'B2', category: 'identity' },
    { id: 'es4v035', de: 'la herencia cultural', en: ['the cultural heritage'], gloss: { de: ['das kulturelle Erbe'], fr: ['l’héritage culturel'], it: ['l’eredità culturale'], pt: ['a herança cultural'] }, pos: 'noun', level: 'B2', category: 'identity' },
    { id: 'es4v036', de: 'la lengua materna', en: ['the mother tongue'], gloss: { de: ['die Muttersprache'], fr: ['la langue maternelle'], it: ['la lingua madre'], pt: ['a língua materna'] }, pos: 'noun', level: 'B2', category: 'identity' },
    { id: 'es4v037', de: 'el estereotipo', en: ['the stereotype'], gloss: { de: ['das Klischee'], fr: ['le stéréotype'], it: ['lo stereotipo'], pt: ['o estereótipo'] }, pos: 'noun', level: 'B2', category: 'identity' },
    { id: 'es4v038', de: 'la brecha generacional', en: ['the generation gap'], gloss: { de: ['die Generationenkluft'], fr: ['le fossé des générations'], it: ['il divario generazionale'], pt: ['o fosso geracional'] }, pos: 'noun', level: 'B2', category: 'identity' },
    { id: 'es4v039', de: 'el legado', en: ['the legacy'], gloss: { de: ['das Vermächtnis'], fr: ['l’héritage'], it: ['il lascito'], pt: ['o legado'] }, pos: 'noun', level: 'B2', category: 'identity' },
    { id: 'es4v040', de: 'integrarse', en: ['to integrate', 'to fit in'], gloss: { de: ['sich integrieren'], fr: ['s’intégrer'], it: ['integrarsi'], pt: ['integrar-se'] }, pos: 'verb', level: 'B2', category: 'identity' },
    // ── law & rights ──────────────────────────────────────────────────────
    { id: 'es4v041', de: 'la sentencia', en: ['the ruling', 'the judgment'], gloss: { de: ['das Urteil'], fr: ['le jugement'], it: ['la sentenza'], pt: ['a sentença'] }, pos: 'noun', level: 'B2', category: 'law' },
    { id: 'es4v042', de: 'el juicio', en: ['the trial'], gloss: { de: ['der Prozess'], fr: ['le procès'], it: ['il processo'], pt: ['o julgamento'] }, pos: 'noun', level: 'B2', category: 'law' },
    { id: 'es4v043', de: 'la demanda', en: ['the lawsuit', 'the claim'], gloss: { de: ['die Klage'], fr: ['la plainte'], it: ['la causa'], pt: ['a ação judicial'] }, pos: 'noun', level: 'B2', category: 'law' },
    { id: 'es4v044', de: 'el testigo', en: ['the witness'], gloss: { de: ['der Zeuge'], fr: ['le témoin'], it: ['il testimone'], pt: ['a testemunha'] }, pos: 'noun', level: 'B2', category: 'law' },
    { id: 'es4v045', de: 'la normativa', en: ['the regulations'], gloss: { de: ['die Vorschriften'], fr: ['la réglementation'], it: ['la normativa'], pt: ['a regulamentação'] }, pos: 'noun', level: 'B2', category: 'law' },
    { id: 'es4v046', de: 'el recurso', en: ['the appeal (legal)'], gloss: { de: ['die Berufung'], fr: ['le recours'], it: ['il ricorso'], pt: ['o recurso'] }, pos: 'noun', level: 'B2', category: 'law' },
    { id: 'es4v047', de: 'el deber', en: ['the duty'], gloss: { de: ['die Pflicht'], fr: ['le devoir'], it: ['il dovere'], pt: ['o dever'] }, pos: 'noun', level: 'B2', category: 'law' },
    { id: 'es4v048', de: 'la libertad de expresión', en: ['the freedom of speech'], gloss: { de: ['die Meinungsfreiheit'], fr: ['la liberté d’expression'], it: ['la libertà di espressione'], pt: ['a liberdade de expressão'] }, pos: 'noun', level: 'B2', category: 'law' },
    { id: 'es4v049', de: 'vulnerar', en: ['to infringe', 'to breach'], gloss: { de: ['verletzen'], fr: ['enfreindre'], it: ['violare'], pt: ['violar'] }, pos: 'verb', level: 'B2', category: 'law' },
    { id: 'es4v050', de: 'amparar', en: ['to protect (in law)', 'to safeguard'], gloss: { de: ['schützen'], fr: ['protéger'], it: ['tutelare'], pt: ['amparar'] }, pos: 'verb', level: 'B2', category: 'law' },
    // ── economics ─────────────────────────────────────────────────────────
    { id: 'es4v051', de: 'la inflación', en: ['the inflation'], gloss: { de: ['die Inflation'], fr: ['l’inflation'], it: ['l’inflazione'], pt: ['a inflação'] }, pos: 'noun', level: 'B2', category: 'economics' },
    { id: 'es4v052', de: 'la carga fiscal', en: ['the tax burden'], gloss: { de: ['die Steuerlast'], fr: ['la charge fiscale'], it: ['il carico fiscale'], pt: ['a carga fiscal'] }, pos: 'noun', level: 'B2', category: 'economics' },
    { id: 'es4v053', de: 'el endeudamiento', en: ['the indebtedness'], gloss: { de: ['die Verschuldung'], fr: ['l’endettement'], it: ['l’indebitamento'], pt: ['o endividamento'] }, pos: 'noun', level: 'B2', category: 'economics' },
    { id: 'es4v054', de: 'la rentabilidad', en: ['the profitability', 'the return'], gloss: { de: ['die Rentabilität'], fr: ['la rentabilité'], it: ['la redditività'], pt: ['a rentabilidade'] }, pos: 'noun', level: 'B2', category: 'economics' },
    { id: 'es4v055', de: 'el poder adquisitivo', en: ['the purchasing power'], gloss: { de: ['die Kaufkraft'], fr: ['le pouvoir d’achat'], it: ['il potere d’acquisto'], pt: ['o poder de compra'] }, pos: 'noun', level: 'B2', category: 'economics' },
    { id: 'es4v056', de: 'la subvención', en: ['the subsidy', 'the grant'], gloss: { de: ['die Subvention'], fr: ['la subvention'], it: ['la sovvenzione'], pt: ['o subsídio'] }, pos: 'noun', level: 'B2', category: 'economics' },
    { id: 'es4v057', de: 'el crecimiento', en: ['the growth'], gloss: { de: ['das Wachstum'], fr: ['la croissance'], it: ['la crescita'], pt: ['o crescimento'] }, pos: 'noun', level: 'B2', category: 'economics' },
    { id: 'es4v058', de: 'la recesión', en: ['the recession'], gloss: { de: ['die Rezession'], fr: ['la récession'], it: ['la recessione'], pt: ['a recessão'] }, pos: 'noun', level: 'B2', category: 'economics' },
    { id: 'es4v059', de: 'repercutir', en: ['to have a knock-on effect on'], gloss: { de: ['sich auswirken'], fr: ['se répercuter'], it: ['ripercuotersi'], pt: ['repercutir'] }, pos: 'verb', level: 'B2', category: 'economics' },
    { id: 'es4v060', de: 'encarecer', en: ['to push up the price of'], gloss: { de: ['verteuern'], fr: ['renchérir'], it: ['far rincarare'], pt: ['encarecer'] }, pos: 'verb', level: 'B2', category: 'economics' },
    // ── psychology & inner life ───────────────────────────────────────────
    { id: 'es4v061', de: 'la autoestima', en: ['the self-esteem'], gloss: { de: ['das Selbstwertgefühl'], fr: ['l’estime de soi'], it: ['l’autostima'], pt: ['a autoestima'] }, pos: 'noun', level: 'B2', category: 'psychology' },
    { id: 'es4v062', de: 'el estado de ánimo', en: ['the mood', 'the state of mind'], gloss: { de: ['die Stimmung'], fr: ['l’état d’esprit'], it: ['lo stato d’animo'], pt: ['o estado de espírito'] }, pos: 'noun', level: 'B2', category: 'psychology' },
    { id: 'es4v063', de: 'el rechazo', en: ['the rejection'], gloss: { de: ['die Ablehnung'], fr: ['le rejet'], it: ['il rifiuto'], pt: ['a rejeição'] }, pos: 'noun', level: 'B2', category: 'psychology' },
    { id: 'es4v064', de: 'el sentimiento de culpa', en: ['the feeling of guilt'], gloss: { de: ['das Schuldgefühl'], fr: ['le sentiment de culpabilité'], it: ['il senso di colpa'], pt: ['o sentimento de culpa'] }, pos: 'noun', level: 'B2', category: 'psychology' },
    { id: 'es4v065', de: 'el apego', en: ['the attachment'], gloss: { de: ['die Bindung'], fr: ['l’attachement'], it: ['l’attaccamento'], pt: ['o apego'] }, pos: 'noun', level: 'B2', category: 'psychology' },
    { id: 'es4v066', de: 'la resiliencia', en: ['the resilience'], gloss: { de: ['die Widerstandsfähigkeit'], fr: ['la résilience'], it: ['la resilienza'], pt: ['a resiliência'] }, pos: 'noun', level: 'B2', category: 'psychology' },
    { id: 'es4v067', de: 'el agotamiento', en: ['the exhaustion', 'the burnout'], gloss: { de: ['die Erschöpfung'], fr: ['l’épuisement'], it: ['l’esaurimento'], pt: ['o esgotamento'] }, pos: 'noun', level: 'B2', category: 'psychology' },
    { id: 'es4v068', de: 'el vínculo', en: ['the bond', 'the tie'], gloss: { de: ['die Verbindung'], fr: ['le lien'], it: ['il legame'], pt: ['o vínculo'] }, pos: 'noun', level: 'B2', category: 'psychology' },
    { id: 'es4v069', de: 'afrontar', en: ['to face up to', 'to confront'], gloss: { de: ['sich stellen'], fr: ['affronter'], it: ['affrontare'], pt: ['enfrentar'] }, pos: 'verb', level: 'B2', category: 'psychology' },
    { id: 'es4v070', de: 'sobrellevar', en: ['to cope with', 'to bear'], gloss: { de: ['ertragen'], fr: ['supporter'], it: ['sopportare'], pt: ['suportar'] }, pos: 'verb', level: 'B2', category: 'psychology' },
    // ── technology & its ethics ───────────────────────────────────────────
    { id: 'es4v071', de: 'el algoritmo', en: ['the algorithm'], gloss: { de: ['der Algorithmus'], fr: ['l’algorithme'], it: ['l’algoritmo'], pt: ['o algoritmo'] }, pos: 'noun', level: 'B2', category: 'technology' },
    { id: 'es4v072', de: 'los datos personales', en: ['the personal data'], gloss: { de: ['die personenbezogenen Daten'], fr: ['les données personnelles'], it: ['i dati personali'], pt: ['os dados pessoais'] }, pos: 'noun', level: 'B2', category: 'technology' },
    { id: 'es4v073', de: 'el anonimato', en: ['the anonymity'], gloss: { de: ['die Anonymität'], fr: ['l’anonymat'], it: ['l’anonimato'], pt: ['o anonimato'] }, pos: 'noun', level: 'B2', category: 'technology' },
    { id: 'es4v074', de: 'la vigilancia', en: ['the surveillance'], gloss: { de: ['die Überwachung'], fr: ['la surveillance'], it: ['la sorveglianza'], pt: ['a vigilância'] }, pos: 'noun', level: 'B2', category: 'technology' },
    { id: 'es4v075', de: 'el aprendizaje automático', en: ['the machine learning'], gloss: { de: ['das maschinelle Lernen'], fr: ['l’apprentissage automatique'], it: ['l’apprendimento automatico'], pt: ['a aprendizagem automática'] }, pos: 'noun', level: 'B2', category: 'technology' },
    { id: 'es4v076', de: 'el consentimiento', en: ['the consent'], gloss: { de: ['die Einwilligung'], fr: ['le consentement'], it: ['il consenso'], pt: ['o consentimento'] }, pos: 'noun', level: 'B2', category: 'technology' },
    { id: 'es4v077', de: 'la huella digital', en: ['the digital footprint'], gloss: { de: ['der digitale Fußabdruck'], fr: ['l’empreinte numérique'], it: ['l’impronta digitale'], pt: ['a pegada digital'] }, pos: 'noun', level: 'B2', category: 'technology' },
    { id: 'es4v078', de: 'el dilema', en: ['the dilemma'], gloss: { de: ['das Dilemma'], fr: ['le dilemme'], it: ['il dilemma'], pt: ['o dilema'] }, pos: 'noun', level: 'B2', category: 'technology' },
    { id: 'es4v079', de: 'rastrear', en: ['to track', 'to trace'], gloss: { de: ['nachverfolgen'], fr: ['pister'], it: ['tracciare'], pt: ['rastrear'] }, pos: 'verb', level: 'B2', category: 'technology' },
    { id: 'es4v080', de: 'almacenar', en: ['to store'], gloss: { de: ['speichern'], fr: ['stocker'], it: ['archiviare'], pt: ['armazenar'] }, pos: 'verb', level: 'B2', category: 'technology' },
    // ── urban life ────────────────────────────────────────────────────────
    { id: 'es4v081', de: 'la especulación inmobiliaria', en: ['the property speculation'], gloss: { de: ['die Immobilienspekulation'], fr: ['la spéculation immobilière'], it: ['la speculazione immobiliare'], pt: ['a especulação imobiliária'] }, pos: 'noun', level: 'B2', category: 'city' },
    { id: 'es4v082', de: 'la vivienda', en: ['the housing', 'the dwelling'], gloss: { de: ['die Wohnung'], fr: ['le logement'], it: ['l’alloggio'], pt: ['a habitação'] }, pos: 'noun', level: 'B2', category: 'city' },
    { id: 'es4v083', de: 'el casco antiguo', en: ['the old town'], gloss: { de: ['die Altstadt'], fr: ['le vieux centre'], it: ['il centro storico'], pt: ['o centro histórico'] }, pos: 'noun', level: 'B2', category: 'city' },
    { id: 'es4v084', de: 'las afueras', en: ['the outskirts'], gloss: { de: ['der Stadtrand'], fr: ['la périphérie'], it: ['la periferia'], pt: ['os arredores'] }, pos: 'noun', level: 'B2', category: 'city' },
    { id: 'es4v085', de: 'el atasco', en: ['the traffic jam'], gloss: { de: ['der Stau'], fr: ['l’embouteillage'], it: ['l’ingorgo'], pt: ['o engarrafamento'] }, pos: 'noun', level: 'B2', category: 'city' },
    { id: 'es4v086', de: 'la zona peatonal', en: ['the pedestrian area'], gloss: { de: ['die Fußgängerzone'], fr: ['la zone piétonne'], it: ['la zona pedonale'], pt: ['a zona pedonal'] }, pos: 'noun', level: 'B2', category: 'city' },
    { id: 'es4v087', de: 'la contaminación acústica', en: ['the noise pollution'], gloss: { de: ['die Lärmbelastung'], fr: ['la pollution sonore'], it: ['l’inquinamento acustico'], pt: ['a poluição sonora'] }, pos: 'noun', level: 'B2', category: 'city' },
    { id: 'es4v088', de: 'el urbanismo', en: ['the urban planning'], gloss: { de: ['die Stadtplanung'], fr: ['l’urbanisme'], it: ['l’urbanistica'], pt: ['o urbanismo'] }, pos: 'noun', level: 'B2', category: 'city' },
    { id: 'es4v089', de: 'desplazarse', en: ['to get around', 'to commute'], gloss: { de: ['sich fortbewegen'], fr: ['se déplacer'], it: ['spostarsi'], pt: ['deslocar-se'] }, pos: 'verb', level: 'B2', category: 'city' },
    { id: 'es4v090', de: 'rehabilitar', en: ['to renovate (a building)'], gloss: { de: ['sanieren'], fr: ['réhabiliter'], it: ['ristrutturare'], pt: ['reabilitar'] }, pos: 'verb', level: 'B2', category: 'city' },
    // ── arts & criticism ──────────────────────────────────────────────────
    { id: 'es4v091', de: 'la corriente artística', en: ['the artistic movement'], gloss: { de: ['die Kunstströmung'], fr: ['le courant artistique'], it: ['la corrente artistica'], pt: ['a corrente artística'] }, pos: 'noun', level: 'B2', category: 'arts' },
    { id: 'es4v092', de: 'el reparto', en: ['the cast'], gloss: { de: ['die Besetzung'], fr: ['la distribution'], it: ['il cast'], pt: ['o elenco'] }, pos: 'noun', level: 'B2', category: 'arts' },
    { id: 'es4v093', de: 'la puesta en escena', en: ['the staging'], gloss: { de: ['die Inszenierung'], fr: ['la mise en scène'], it: ['la messa in scena'], pt: ['a encenação'] }, pos: 'noun', level: 'B2', category: 'arts' },
    { id: 'es4v094', de: 'el estreno', en: ['the premiere', 'the opening night'], gloss: { de: ['die Premiere'], fr: ['la première'], it: ['la prima'], pt: ['a estreia'] }, pos: 'noun', level: 'B2', category: 'arts' },
    { id: 'es4v095', de: 'la trama', en: ['the plot'], gloss: { de: ['die Handlung'], fr: ['l’intrigue'], it: ['la trama'], pt: ['a trama'] }, pos: 'noun', level: 'B2', category: 'arts' },
    { id: 'es4v096', de: 'el personaje', en: ['the character (in a story)'], gloss: { de: ['die Figur'], fr: ['le personnage'], it: ['il personaggio'], pt: ['a personagem'] }, pos: 'noun', level: 'B2', category: 'arts' },
    { id: 'es4v097', de: 'la reseña', en: ['the review (written)'], gloss: { de: ['die Rezension'], fr: ['le compte rendu'], it: ['la recensione'], pt: ['a recensão'] }, pos: 'noun', level: 'B2', category: 'arts' },
    { id: 'es4v098', de: 'la banda sonora', en: ['the soundtrack'], gloss: { de: ['der Soundtrack'], fr: ['la bande originale'], it: ['la colonna sonora'], pt: ['a banda sonora'] }, pos: 'noun', level: 'B2', category: 'arts' },
    { id: 'es4v099', de: 'ambientar', en: ['to set (a story in a place or time)'], gloss: { de: ['ansiedeln'], fr: ['situer'], it: ['ambientare'], pt: ['ambientar'] }, pos: 'verb', level: 'B2', category: 'arts' },
    { id: 'es4v100', de: 'plasmar', en: ['to capture', 'to give shape to'], gloss: { de: ['zum Ausdruck bringen'], fr: ['traduire'], it: ['dare forma a'], pt: ['plasmar'] }, pos: 'verb', level: 'B2', category: 'arts' },
    // ── connectors of argument ────────────────────────────────────────────
    { id: 'es4v101', de: 'no obstante', en: ['nevertheless', 'nonetheless'], gloss: { de: ['nichtsdestotrotz'], fr: ['néanmoins'], it: ['ciò nonostante'], pt: ['não obstante'] }, pos: 'adv', level: 'B2', category: 'connectors' },
    { id: 'es4v102', de: 'salvo que', en: ['unless', 'except if'], gloss: { de: ['es sei denn, dass'], fr: ['sauf si'], it: ['a meno che'], pt: ['salvo se'] }, pos: 'conj', level: 'B2', category: 'connectors' },
    { id: 'es4v103', de: 'por mucho que', en: ['however much', 'no matter how much'], gloss: { de: ['so sehr auch'], fr: ['quoi que l’on fasse'], it: ['per quanto'], pt: ['por mais que'] }, pos: 'conj', level: 'B2', category: 'connectors' },
    { id: 'es4v104', de: 'dado que', en: ['given that'], gloss: { de: ['angesichts dessen, dass'], fr: ['étant donné que'], it: ['dato che'], pt: ['dado que'] }, pos: 'conj', level: 'B2', category: 'connectors' },
    { id: 'es4v105', de: 'habida cuenta de que', en: ['in view of the fact that'], gloss: { de: ['in Anbetracht dessen, dass'], fr: ['compte tenu du fait que'], it: ['tenuto conto che'], pt: ['tendo em conta que'] }, pos: 'conj', level: 'B2', category: 'connectors' },
    { id: 'es4v106', de: 'con tal de que', en: ['as long as', 'on condition that'], gloss: { de: ['unter der Bedingung, dass'], fr: ['à condition que'], it: ['a condizione che'], pt: ['contanto que'] }, pos: 'conj', level: 'B2', category: 'connectors' },
    { id: 'es4v107', de: 'de ahí que', en: ['hence', 'which is why'], gloss: { de: ['daher'], fr: ['d’où le fait que'], it: ['da qui'], pt: ['daí que'] }, pos: 'conj', level: 'B2', category: 'connectors' },
    { id: 'es4v108', de: 'ahora bien', en: ['that said', 'having said that'], gloss: { de: ['allerdings'], fr: ['cela dit'], it: ['detto questo'], pt: ['dito isto'] }, pos: 'phrase', level: 'B2', category: 'connectors' },
    { id: 'es4v109', de: 'en cuanto a', en: ['as regards', 'when it comes to'], gloss: { de: ['was … betrifft'], fr: ['quant à'], it: ['quanto a'], pt: ['quanto a'] }, pos: 'prep', level: 'B2', category: 'connectors' },
    { id: 'es4v110', de: 'por consiguiente', en: ['consequently'], gloss: { de: ['infolgedessen'], fr: ['en conséquence'], it: ['di conseguenza'], pt: ['por conseguinte'] }, pos: 'adv', level: 'B2', category: 'connectors' },
    // ── hedging & register ────────────────────────────────────────────────
    { id: 'es4v111', de: 'me temo que', en: ['I’m afraid that'], gloss: { de: ['ich fürchte, dass'], fr: ['je crains que'], it: ['temo che'], pt: ['receio que'] }, pos: 'phrase', level: 'B2', category: 'register' },
    { id: 'es4v112', de: 'cabe destacar', en: ['it is worth highlighting'], gloss: { de: ['hervorzuheben ist'], fr: ['il convient de souligner'], it: ['va sottolineato'], pt: ['importa destacar'] }, pos: 'phrase', level: 'B2', category: 'register' },
    { id: 'es4v113', de: 'hasta cierto punto', en: ['up to a point', 'to some extent'], gloss: { de: ['bis zu einem gewissen Grad'], fr: ['jusqu’à un certain point'], it: ['fino a un certo punto'], pt: ['até certo ponto'] }, pos: 'phrase', level: 'B2', category: 'register' },
    { id: 'es4v114', de: 'en la medida en que', en: ['insofar as', 'to the extent that'], gloss: { de: ['insofern als'], fr: ['dans la mesure où'], it: ['nella misura in cui'], pt: ['na medida em que'] }, pos: 'phrase', level: 'B2', category: 'register' },
    { id: 'es4v115', de: 'todo apunta a que', en: ['everything suggests that'], gloss: { de: ['alles deutet darauf hin, dass'], fr: ['tout laisse penser que'], it: ['tutto lascia pensare che'], pt: ['tudo indica que'] }, pos: 'phrase', level: 'B2', category: 'register' },
    { id: 'es4v116', de: 'si no me equivoco', en: ['if I’m not mistaken'], gloss: { de: ['wenn ich mich nicht irre'], fr: ['si je ne me trompe pas'], it: ['se non sbaglio'], pt: ['se não me engano'] }, pos: 'phrase', level: 'B2', category: 'register' },
    { id: 'es4v117', de: 'con el debido respeto', en: ['with all due respect'], gloss: { de: ['bei allem Respekt'], fr: ['avec tout le respect que je vous dois'], it: ['con tutto il rispetto'], pt: ['com o devido respeito'] }, pos: 'phrase', level: 'B2', category: 'register' },
    { id: 'es4v118', de: 'no acabo de ver', en: ['I’m not quite convinced by'], gloss: { de: ['ich bin nicht ganz überzeugt von'], fr: ['je ne suis pas vraiment convaincu par'], it: ['non mi convince del tutto'], pt: ['não me convence de todo'] }, pos: 'phrase', level: 'B2', category: 'register' },
    { id: 'es4v119', de: 'por así decirlo', en: ['so to speak'], gloss: { de: ['sozusagen'], fr: ['pour ainsi dire'], it: ['per così dire'], pt: ['por assim dizer'] }, pos: 'phrase', level: 'B2', category: 'register' },
    { id: 'es4v120', de: 'a mi modo de ver', en: ['the way I see it'], gloss: { de: ['aus meiner Sicht'], fr: ['à mon sens'], it: ['a mio modo di vedere'], pt: ['a meu ver'] }, pos: 'phrase', level: 'B2', category: 'register' },
    // ── abstract & nuance ─────────────────────────────────────────────────
    { id: 'es4v121', de: 'el matiz', en: ['the nuance', 'the shade of meaning'], gloss: { de: ['die Nuance'], fr: ['la nuance'], it: ['la sfumatura'], pt: ['o matiz'] }, pos: 'noun', level: 'B2', category: 'abstract' },
    { id: 'es4v122', de: 'el planteamiento', en: ['the approach', 'the framing'], gloss: { de: ['der Ansatz'], fr: ['l’approche'], it: ['l’impostazione'], pt: ['a abordagem'] }, pos: 'noun', level: 'B2', category: 'abstract' },
    { id: 'es4v123', de: 'la índole', en: ['the nature', 'the kind'], gloss: { de: ['die Art'], fr: ['la nature'], it: ['l’indole'], pt: ['a índole'] }, pos: 'noun', level: 'B2', category: 'abstract' },
    { id: 'es4v124', de: 'el alcance', en: ['the scope', 'the reach'], gloss: { de: ['die Tragweite'], fr: ['la portée'], it: ['la portata'], pt: ['o alcance'] }, pos: 'noun', level: 'B2', category: 'abstract' },
    { id: 'es4v125', de: 'la premisa', en: ['the premise'], gloss: { de: ['die Prämisse'], fr: ['la prémisse'], it: ['la premessa'], pt: ['a premissa'] }, pos: 'noun', level: 'B2', category: 'abstract' },
    { id: 'es4v126', de: 'la salvedad', en: ['the caveat', 'the proviso'], gloss: { de: ['der Vorbehalt'], fr: ['la réserve'], it: ['la riserva'], pt: ['a ressalva'] }, pos: 'noun', level: 'B2', category: 'abstract' },
    { id: 'es4v127', de: 'el trasfondo', en: ['the underlying background'], gloss: { de: ['der Hintergrund'], fr: ['l’arrière-plan'], it: ['lo sfondo'], pt: ['o pano de fundo'] }, pos: 'noun', level: 'B2', category: 'abstract' },
    { id: 'es4v128', de: 'la disyuntiva', en: ['the either-or choice'], gloss: { de: ['die Zwickmühle'], fr: ['l’alternative'], it: ['il bivio'], pt: ['a encruzilhada'] }, pos: 'noun', level: 'B2', category: 'abstract' },
    { id: 'es4v129', de: 'la coyuntura', en: ['the current situation', 'the juncture'], gloss: { de: ['die Lage'], fr: ['la conjoncture'], it: ['la congiuntura'], pt: ['a conjuntura'] }, pos: 'noun', level: 'B2', category: 'abstract' },
    { id: 'es4v130', de: 'el desenlace', en: ['the outcome', 'the ending'], gloss: { de: ['der Ausgang'], fr: ['le dénouement'], it: ['l’epilogo'], pt: ['o desfecho'] }, pos: 'noun', level: 'B2', category: 'abstract' },
    // ── verbs of nuance ───────────────────────────────────────────────────
    { id: 'es4v131', de: 'matizar', en: ['to qualify', 'to add nuance to'], gloss: { de: ['differenzieren'], fr: ['nuancer'], it: ['precisare'], pt: ['matizar'] }, pos: 'verb', level: 'B2', category: 'nuance' },
    { id: 'es4v132', de: 'conllevar', en: ['to entail', 'to bring with it'], gloss: { de: ['mit sich bringen'], fr: ['entraîner'], it: ['comportare'], pt: ['acarretar'] }, pos: 'verb', level: 'B2', category: 'nuance' },
    { id: 'es4v133', de: 'desprenderse de', en: ['to follow from', 'to be inferred from'], gloss: { de: ['sich ergeben aus'], fr: ['ressortir de'], it: ['risultare da'], pt: ['depreender-se de'] }, pos: 'phrase', level: 'B2', category: 'nuance' },
    { id: 'es4v134', de: 'restar importancia a', en: ['to play down'], gloss: { de: ['herunterspielen'], fr: ['minimiser'], it: ['sminuire'], pt: ['minimizar a importância de'] }, pos: 'phrase', level: 'B2', category: 'nuance' },
    { id: 'es4v135', de: 'recalcar', en: ['to stress', 'to underline'], gloss: { de: ['betonen'], fr: ['insister sur'], it: ['ribadire'], pt: ['frisar'] }, pos: 'verb', level: 'B2', category: 'nuance' },
    { id: 'es4v136', de: 'rebatir', en: ['to refute', 'to counter'], gloss: { de: ['widerlegen'], fr: ['réfuter'], it: ['confutare'], pt: ['refutar'] }, pos: 'verb', level: 'B2', category: 'nuance' },
    { id: 'es4v137', de: 'prever', en: ['to foresee', 'to anticipate'], gloss: { de: ['vorhersehen'], fr: ['prévoir'], it: ['prevedere'], pt: ['prever'] }, pos: 'verb', level: 'B2', category: 'nuance' },
    { id: 'es4v138', de: 'propiciar', en: ['to bring about', 'to give rise to'], gloss: { de: ['begünstigen'], fr: ['favoriser'], it: ['propiziare'], pt: ['propiciar'] }, pos: 'verb', level: 'B2', category: 'nuance' },
    { id: 'es4v139', de: 'eludir', en: ['to dodge', 'to sidestep'], gloss: { de: ['ausweichen'], fr: ['éluder'], it: ['eludere'], pt: ['furtar-se a'] }, pos: 'verb', level: 'B2', category: 'nuance' },
    { id: 'es4v140', de: 'socavar', en: ['to undermine'], gloss: { de: ['untergraben'], fr: ['saper'], it: ['minare'], pt: ['minar'] }, pos: 'verb', level: 'B2', category: 'nuance' },
    // ── adjectives ────────────────────────────────────────────────────────
    { id: 'es4v141', de: 'ambiguo', en: ['ambiguous'], gloss: { de: ['mehrdeutig'], fr: ['ambigu'], it: ['ambiguo'], pt: ['ambíguo'] }, pos: 'adj', level: 'B2', category: 'adjectives' },
    { id: 'es4v142', de: 'rotundo', en: ['categorical', 'emphatic'], gloss: { de: ['kategorisch'], fr: ['catégorique'], it: ['categorico'], pt: ['categórico'] }, pos: 'adj', level: 'B2', category: 'adjectives' },
    { id: 'es4v143', de: 'insostenible', en: ['untenable', 'unsustainable'], gloss: { de: ['unhaltbar'], fr: ['intenable'], it: ['insostenibile'], pt: ['insustentável'] }, pos: 'adj', level: 'B2', category: 'adjectives' },
    { id: 'es4v144', de: 'inequívoco', en: ['unmistakable', 'unequivocal'], gloss: { de: ['unmissverständlich'], fr: ['sans équivoque'], it: ['inequivocabile'], pt: ['inequívoco'] }, pos: 'adj', level: 'B2', category: 'adjectives' },
    { id: 'es4v145', de: 'pertinente', en: ['relevant', 'pertinent'], gloss: { de: ['sachdienlich'], fr: ['pertinent'], it: ['pertinente'], pt: ['pertinente'] }, pos: 'adj', level: 'B2', category: 'adjectives' },
    { id: 'es4v146', de: 'endeble', en: ['flimsy', 'weak (of an argument)'], gloss: { de: ['schwach'], fr: ['fragile'], it: ['debole'], pt: ['frágil'] }, pos: 'adj', level: 'B2', category: 'adjectives' },
    { id: 'es4v147', de: 'contundente', en: ['compelling', 'conclusive'], gloss: { de: ['schlagend'], fr: ['sans appel'], it: ['schiacciante'], pt: ['contundente'] }, pos: 'adj', level: 'B2', category: 'adjectives' },
    { id: 'es4v148', de: 'llamativo', en: ['striking', 'eye-catching'], gloss: { de: ['auffällig'], fr: ['frappant'], it: ['vistoso'], pt: ['chamativo'] }, pos: 'adj', level: 'B2', category: 'adjectives' },
    { id: 'es4v149', de: 'polémico', en: ['controversial'], gloss: { de: ['umstritten'], fr: ['polémique'], it: ['controverso'], pt: ['polémico'] }, pos: 'adj', level: 'B2', category: 'adjectives' },
    { id: 'es4v150', de: 'verosímil', en: ['plausible', 'believable'], gloss: { de: ['glaubhaft'], fr: ['vraisemblable'], it: ['verosimile'], pt: ['verosímil'] }, pos: 'adj', level: 'B2', category: 'adjectives' },
];
