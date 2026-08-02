import type { VocabItem } from '@/content/german/types';

// Brazilian Portuguese (pt-BR) B2 vocabulary. The `de` field holds the
// Portuguese text (see the note in content/german/types.ts). Nouns include the
// article (o/a) since knowing gender is part of the exercise.
//
// B2 is the register of nuance: hedging, concession, speculation, cause and
// consequence stated carefully rather than bluntly. The lexicon here is the one
// a Brazilian reads in an op-ed, hears in a negotiation or a courtroom summary,
// or uses to disagree with a superior without breaking the room. Nothing here
// repeats the A1/A2/B1 packs — no work basics, no plain opinion verbs.
//
// `gloss` carries the other UI locales. English lives in `en` and is the
// guaranteed fallback; Portuguese itself is never glossed (a Portuguese-UI
// user is never offered Portuguese to learn), so each item covers de/es/fr/it.

export const B2_VOCAB: VocabItem[] = [
  // ── negotiation & workplace politics ──────────────────────────────────
  { id: 'pt4v001', de: 'a negociação', en: ['the negotiation'], gloss: { de: ['die Verhandlung'], es: ['la negociación'], fr: ['la négociation'], it: ['la trattativa'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'pt4v002', de: 'o acordo', en: ['the agreement', 'the deal'], gloss: { de: ['die Vereinbarung'], es: ['el acuerdo'], fr: ['l’accord'], it: ['l’accordo'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'pt4v003', de: 'a contrapartida', en: ['the trade-off', 'the quid pro quo'], gloss: { de: ['die Gegenleistung'], es: ['la contrapartida'], fr: ['la contrepartie'], it: ['il contraccambio'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'pt4v004', de: 'a ressalva', en: ['the caveat', 'the proviso'], gloss: { de: ['der Vorbehalt'], es: ['la salvedad'], fr: ['la réserve'], it: ['la riserva'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'pt4v005', de: 'o impasse', en: ['the deadlock', 'the stalemate'], gloss: { de: ['die Sackgasse'], es: ['el punto muerto'], fr: ['l’impasse'], it: ['lo stallo'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'pt4v006', de: 'a concessão', en: ['the concession'], gloss: { de: ['das Zugeständnis'], es: ['la concesión'], fr: ['la concession'], it: ['la concessione'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'pt4v007', de: 'o parecer', en: ['the expert opinion', 'the formal ruling'], gloss: { de: ['das Gutachten'], es: ['el dictamen'], fr: ['l’avis'], it: ['il parere'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'pt4v008', de: 'a pauta', en: ['the agenda (of a meeting)'], gloss: { de: ['die Tagesordnung'], es: ['el orden del día'], fr: ['l’ordre du jour'], it: ['l’ordine del giorno'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'pt4v009', de: 'a alçada', en: ['the remit', 'the jurisdiction'], gloss: { de: ['der Zuständigkeitsbereich'], es: ['la competencia'], fr: ['le ressort'], it: ['la competenza'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'pt4v010', de: 'a margem de manobra', en: ['the room for manoeuvre'], gloss: { de: ['der Spielraum'], es: ['el margen de maniobra'], fr: ['la marge de manœuvre'], it: ['il margine di manovra'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'pt4v011', de: 'ponderar', en: ['to weigh up', 'to consider carefully'], gloss: { de: ['abwägen'], es: ['sopesar'], fr: ['peser'], it: ['ponderare'] }, pos: 'verb', level: 'B2', category: 'negotiation' },
  { id: 'pt4v012', de: 'ceder', en: ['to give ground', 'to yield'], gloss: { de: ['nachgeben'], es: ['ceder'], fr: ['céder'], it: ['cedere'] }, pos: 'verb', level: 'B2', category: 'negotiation' },
  { id: 'pt4v013', de: 'viabilizar', en: ['to make feasible', 'to enable'], gloss: { de: ['ermöglichen'], es: ['hacer viable'], fr: ['rendre possible'], it: ['rendere possibile'] }, pos: 'verb', level: 'B2', category: 'negotiation' },
  { id: 'pt4v014', de: 'entravar', en: ['to hinder', 'to hold up'], gloss: { de: ['hemmen'], es: ['obstaculizar'], fr: ['entraver'], it: ['ostacolare'] }, pos: 'verb', level: 'B2', category: 'negotiation' },

  // ── media & information ───────────────────────────────────────────────
  { id: 'pt4v015', de: 'a desinformação', en: ['the disinformation'], gloss: { de: ['die Desinformation'], es: ['la desinformación'], fr: ['la désinformation'], it: ['la disinformazione'] }, pos: 'noun', level: 'B2', category: 'media' },
  { id: 'pt4v016', de: 'o viés', en: ['the bias'], gloss: { de: ['die Voreingenommenheit'], es: ['el sesgo'], fr: ['le biais'], it: ['il pregiudizio'] }, pos: 'noun', level: 'B2', category: 'media' },
  { id: 'pt4v017', de: 'a apuração', en: ['the fact-checking', 'the investigation'], gloss: { de: ['die Recherche'], es: ['la verificación'], fr: ['la vérification'], it: ['la verifica'] }, pos: 'noun', level: 'B2', category: 'media' },
  { id: 'pt4v018', de: 'o veículo de comunicação', en: ['the media outlet'], gloss: { de: ['das Medienhaus'], es: ['el medio de comunicación'], fr: ['l’organe de presse'], it: ['la testata'] }, pos: 'noun', level: 'B2', category: 'media' },
  { id: 'pt4v019', de: 'a cobertura', en: ['the coverage'], gloss: { de: ['die Berichterstattung'], es: ['la cobertura'], fr: ['la couverture'], it: ['la copertura'] }, pos: 'noun', level: 'B2', category: 'media' },
  { id: 'pt4v020', de: 'o boato', en: ['the rumour'], gloss: { de: ['das Gerücht'], es: ['el rumor'], fr: ['la rumeur'], it: ['la diceria'] }, pos: 'noun', level: 'B2', category: 'media' },
  { id: 'pt4v021', de: 'a censura', en: ['the censorship'], gloss: { de: ['die Zensur'], es: ['la censura'], fr: ['la censure'], it: ['la censura'] }, pos: 'noun', level: 'B2', category: 'media' },
  { id: 'pt4v022', de: 'o sigilo', en: ['the confidentiality'], gloss: { de: ['die Geheimhaltung'], es: ['el sigilo'], fr: ['le secret'], it: ['la riservatezza'] }, pos: 'noun', level: 'B2', category: 'media' },
  { id: 'pt4v023', de: 'a repercussão', en: ['the fallout', 'the repercussion'], gloss: { de: ['das Echo'], es: ['la repercusión'], fr: ['les retombées'], it: ['la ripercussione'] }, pos: 'noun', level: 'B2', category: 'media' },
  { id: 'pt4v024', de: 'a narrativa', en: ['the narrative'], gloss: { de: ['das Narrativ'], es: ['la narrativa'], fr: ['le récit'], it: ['la narrazione'] }, pos: 'noun', level: 'B2', category: 'media' },
  { id: 'pt4v025', de: 'o alcance', en: ['the reach'], gloss: { de: ['die Reichweite'], es: ['el alcance'], fr: ['la portée'], it: ['la portata'] }, pos: 'noun', level: 'B2', category: 'media' },
  { id: 'pt4v026', de: 'desmentir', en: ['to deny', 'to debunk'], gloss: { de: ['dementieren'], es: ['desmentir'], fr: ['démentir'], it: ['smentire'] }, pos: 'verb', level: 'B2', category: 'media' },
  { id: 'pt4v027', de: 'apurar', en: ['to look into', 'to verify'], gloss: { de: ['recherchieren'], es: ['investigar'], fr: ['enquêter'], it: ['verificare'] }, pos: 'verb', level: 'B2', category: 'media' },
  { id: 'pt4v028', de: 'tendencioso', en: ['biased', 'slanted'], gloss: { de: ['tendenziös'], es: ['tendencioso'], fr: ['tendancieux'], it: ['tendenzioso'] }, pos: 'adj', level: 'B2', category: 'media' },

  // ── science & environment ─────────────────────────────────────────────
  { id: 'pt4v029', de: 'a metodologia', en: ['the methodology'], gloss: { de: ['die Methodik'], es: ['la metodología'], fr: ['la méthodologie'], it: ['la metodologia'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'pt4v030', de: 'a hipótese', en: ['the hypothesis'], gloss: { de: ['die Hypothese'], es: ['la hipótesis'], fr: ['l’hypothèse'], it: ['l’ipotesi'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'pt4v031', de: 'a evidência', en: ['the evidence'], gloss: { de: ['der Beleg'], es: ['la evidencia'], fr: ['la preuve'], it: ['l’evidenza'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'pt4v032', de: 'a amostra', en: ['the sample'], gloss: { de: ['die Stichprobe'], es: ['la muestra'], fr: ['l’échantillon'], it: ['il campione'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'pt4v033', de: 'o experimento', en: ['the experiment'], gloss: { de: ['das Experiment'], es: ['el experimento'], fr: ['l’expérience'], it: ['l’esperimento'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'pt4v034', de: 'a comprovação', en: ['the proof', 'the confirmation'], gloss: { de: ['der Nachweis'], es: ['la comprobación'], fr: ['la confirmation'], it: ['la conferma'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'pt4v035', de: 'o aquecimento global', en: ['the global warming'], gloss: { de: ['die Erderwärmung'], es: ['el calentamiento global'], fr: ['le réchauffement climatique'], it: ['il riscaldamento globale'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'pt4v036', de: 'a emissão', en: ['the emission'], gloss: { de: ['die Emission'], es: ['la emisión'], fr: ['l’émission'], it: ['l’emissione'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'pt4v037', de: 'a biodiversidade', en: ['the biodiversity'], gloss: { de: ['die Artenvielfalt'], es: ['la biodiversidad'], fr: ['la biodiversité'], it: ['la biodiversità'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'pt4v038', de: 'o desperdício', en: ['the waste', 'the squandering'], gloss: { de: ['die Verschwendung'], es: ['el desperdicio'], fr: ['le gaspillage'], it: ['lo spreco'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'pt4v039', de: 'a seca', en: ['the drought'], gloss: { de: ['die Dürre'], es: ['la sequía'], fr: ['la sécheresse'], it: ['la siccità'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'pt4v040', de: 'a enchente', en: ['the flood'], gloss: { de: ['die Überschwemmung'], es: ['la inundación'], fr: ['l’inondation'], it: ['l’alluvione'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'pt4v041', de: 'comprovar', en: ['to prove', 'to substantiate'], gloss: { de: ['nachweisen'], es: ['comprobar'], fr: ['prouver'], it: ['dimostrare'] }, pos: 'verb', level: 'B2', category: 'science' },
  { id: 'pt4v042', de: 'mitigar', en: ['to mitigate'], gloss: { de: ['abmildern'], es: ['mitigar'], fr: ['atténuer'], it: ['mitigare'] }, pos: 'verb', level: 'B2', category: 'science' },
  { id: 'pt4v043', de: 'irreversível', en: ['irreversible'], gloss: { de: ['unumkehrbar'], es: ['irreversible'], fr: ['irréversible'], it: ['irreversibile'] }, pos: 'adj', level: 'B2', category: 'science' },

  // ── culture & identity ────────────────────────────────────────────────
  { id: 'pt4v044', de: 'a identidade', en: ['the identity'], gloss: { de: ['die Identität'], es: ['la identidad'], fr: ['l’identité'], it: ['l’identità'] }, pos: 'noun', level: 'B2', category: 'culture' },
  { id: 'pt4v045', de: 'o pertencimento', en: ['the sense of belonging'], gloss: { de: ['die Zugehörigkeit'], es: ['la pertenencia'], fr: ['l’appartenance'], it: ['l’appartenenza'] }, pos: 'noun', level: 'B2', category: 'culture' },
  { id: 'pt4v046', de: 'a herança cultural', en: ['the cultural heritage'], gloss: { de: ['das kulturelle Erbe'], es: ['la herencia cultural'], fr: ['l’héritage culturel'], it: ['l’eredità culturale'] }, pos: 'noun', level: 'B2', category: 'culture' },
  { id: 'pt4v047', de: 'o legado', en: ['the legacy'], gloss: { de: ['das Vermächtnis'], es: ['el legado'], fr: ['le legs'], it: ['il lascito'] }, pos: 'noun', level: 'B2', category: 'culture' },
  { id: 'pt4v048', de: 'a raiz', en: ['the root'], gloss: { de: ['die Wurzel'], es: ['la raíz'], fr: ['la racine'], it: ['la radice'] }, pos: 'noun', level: 'B2', category: 'culture' },
  { id: 'pt4v049', de: 'o sotaque', en: ['the accent'], gloss: { de: ['der Akzent'], es: ['el acento'], fr: ['l’accent'], it: ['l’accento'] }, pos: 'noun', level: 'B2', category: 'culture' },
  { id: 'pt4v050', de: 'a gíria', en: ['the slang'], gloss: { de: ['die Umgangssprache'], es: ['la jerga'], fr: ['l’argot'], it: ['il gergo'] }, pos: 'noun', level: 'B2', category: 'culture' },
  { id: 'pt4v051', de: 'o preconceito', en: ['the prejudice'], gloss: { de: ['das Vorurteil'], es: ['el prejuicio'], fr: ['le préjugé'], it: ['il pregiudizio'] }, pos: 'noun', level: 'B2', category: 'culture' },
  { id: 'pt4v052', de: 'a convivência', en: ['the coexistence', 'the living together'], gloss: { de: ['das Zusammenleben'], es: ['la convivencia'], fr: ['la coexistence'], it: ['la convivenza'] }, pos: 'noun', level: 'B2', category: 'culture' },
  { id: 'pt4v053', de: 'o vínculo', en: ['the bond', 'the tie'], gloss: { de: ['die Bindung'], es: ['el vínculo'], fr: ['le lien'], it: ['il legame'] }, pos: 'noun', level: 'B2', category: 'culture' },
  { id: 'pt4v054', de: 'resgatar', en: ['to reclaim', 'to revive'], gloss: { de: ['wiederbeleben'], es: ['rescatar'], fr: ['faire revivre'], it: ['recuperare'] }, pos: 'verb', level: 'B2', category: 'culture' },
  { id: 'pt4v055', de: 'enraizado', en: ['deep-rooted'], gloss: { de: ['tief verwurzelt'], es: ['arraigado'], fr: ['enraciné'], it: ['radicato'] }, pos: 'adj', level: 'B2', category: 'culture' },

  // ── law & rights ──────────────────────────────────────────────────────
  { id: 'pt4v056', de: 'o julgamento', en: ['the trial', 'the judgement'], gloss: { de: ['das Gerichtsverfahren'], es: ['el juicio'], fr: ['le procès'], it: ['il processo'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'pt4v057', de: 'o tribunal', en: ['the court'], gloss: { de: ['das Gericht'], es: ['el tribunal'], fr: ['le tribunal'], it: ['il tribunale'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'pt4v058', de: 'o juiz', en: ['the judge'], gloss: { de: ['der Richter'], es: ['el juez'], fr: ['le juge'], it: ['il giudice'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'pt4v059', de: 'a testemunha', en: ['the witness'], gloss: { de: ['der Zeuge'], es: ['el testigo'], fr: ['le témoin'], it: ['il testimone'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'pt4v060', de: 'o depoimento', en: ['the testimony', 'the statement'], gloss: { de: ['die Aussage'], es: ['la declaración'], fr: ['le témoignage'], it: ['la deposizione'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'pt4v061', de: 'a sentença', en: ['the verdict', 'the sentence'], gloss: { de: ['das Urteil'], es: ['la sentencia'], fr: ['la sentence'], it: ['la sentenza'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'pt4v062', de: 'o recurso', en: ['the appeal'], gloss: { de: ['die Berufung'], es: ['el recurso'], fr: ['le recours'], it: ['il ricorso'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'pt4v063', de: 'o dever', en: ['the duty'], gloss: { de: ['die Pflicht'], es: ['el deber'], fr: ['le devoir'], it: ['il dovere'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'pt4v064', de: 'a norma', en: ['the rule', 'the standard'], gloss: { de: ['die Norm'], es: ['la norma'], fr: ['la norme'], it: ['la norma'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'pt4v065', de: 'a punição', en: ['the punishment'], gloss: { de: ['die Bestrafung'], es: ['el castigo'], fr: ['la punition'], it: ['la punizione'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'pt4v066', de: 'vigorar', en: ['to be in force'], gloss: { de: ['gelten'], es: ['estar en vigor'], fr: ['être en vigueur'], it: ['essere in vigore'] }, pos: 'verb', level: 'B2', category: 'law' },
  { id: 'pt4v067', de: 'cumprir', en: ['to comply with', 'to fulfil'], gloss: { de: ['erfüllen'], es: ['cumplir'], fr: ['respecter'], it: ['adempiere'] }, pos: 'verb', level: 'B2', category: 'law' },
  { id: 'pt4v068', de: 'vigente', en: ['in force', 'current'], gloss: { de: ['geltend'], es: ['vigente'], fr: ['en vigueur'], it: ['vigente'] }, pos: 'adj', level: 'B2', category: 'law' },

  // ── economics ─────────────────────────────────────────────────────────
  { id: 'pt4v069', de: 'a recessão', en: ['the recession'], gloss: { de: ['die Rezession'], es: ['la recesión'], fr: ['la récession'], it: ['la recessione'] }, pos: 'noun', level: 'B2', category: 'economy' },
  { id: 'pt4v070', de: 'a arrecadação', en: ['the tax revenue', 'the takings'], gloss: { de: ['das Steueraufkommen'], es: ['la recaudación'], fr: ['les recettes fiscales'], it: ['il gettito fiscale'] }, pos: 'noun', level: 'B2', category: 'economy' },
  { id: 'pt4v071', de: 'o endividamento', en: ['the indebtedness'], gloss: { de: ['die Verschuldung'], es: ['el endeudamiento'], fr: ['l’endettement'], it: ['l’indebitamento'] }, pos: 'noun', level: 'B2', category: 'economy' },
  { id: 'pt4v072', de: 'o patrimônio', en: ['the assets', 'the wealth'], gloss: { de: ['das Vermögen'], es: ['el patrimonio'], fr: ['le patrimoine'], it: ['il patrimonio'] }, pos: 'noun', level: 'B2', category: 'economy' },
  { id: 'pt4v073', de: 'a rentabilidade', en: ['the profitability'], gloss: { de: ['die Rentabilität'], es: ['la rentabilidad'], fr: ['la rentabilité'], it: ['la redditività'] }, pos: 'noun', level: 'B2', category: 'economy' },
  { id: 'pt4v074', de: 'o prejuízo', en: ['the loss', 'the damage'], gloss: { de: ['der Verlust'], es: ['la pérdida'], fr: ['la perte'], it: ['la perdita'] }, pos: 'noun', level: 'B2', category: 'economy' },
  { id: 'pt4v075', de: 'a oferta', en: ['the supply', 'the offer'], gloss: { de: ['das Angebot'], es: ['la oferta'], fr: ['l’offre'], it: ['l’offerta'] }, pos: 'noun', level: 'B2', category: 'economy' },
  { id: 'pt4v076', de: 'a demanda', en: ['the demand'], gloss: { de: ['die Nachfrage'], es: ['la demanda'], fr: ['la demande'], it: ['la domanda'] }, pos: 'noun', level: 'B2', category: 'economy' },
  { id: 'pt4v077', de: 'a taxa de juros', en: ['the interest rate'], gloss: { de: ['der Zinssatz'], es: ['la tasa de interés'], fr: ['le taux d’intérêt'], it: ['il tasso d’interesse'] }, pos: 'noun', level: 'B2', category: 'economy' },
  { id: 'pt4v078', de: 'o câmbio', en: ['the exchange rate'], gloss: { de: ['der Wechselkurs'], es: ['el tipo de cambio'], fr: ['le taux de change'], it: ['il tasso di cambio'] }, pos: 'noun', level: 'B2', category: 'economy' },
  { id: 'pt4v079', de: 'a poupança', en: ['the savings'], gloss: { de: ['die Ersparnisse'], es: ['los ahorros'], fr: ['l’épargne'], it: ['il risparmio'] }, pos: 'noun', level: 'B2', category: 'economy' },
  { id: 'pt4v080', de: 'arcar com', en: ['to bear (a cost)', 'to foot'], gloss: { de: ['tragen'], es: ['correr con'], fr: ['assumer'], it: ['farsi carico di'] }, pos: 'verb', level: 'B2', category: 'economy' },
  { id: 'pt4v081', de: 'encarecer', en: ['to make more expensive'], gloss: { de: ['verteuern'], es: ['encarecer'], fr: ['renchérir'], it: ['rincarare'] }, pos: 'verb', level: 'B2', category: 'economy' },

  // ── psychology & behaviour ────────────────────────────────────────────
  { id: 'pt4v082', de: 'o comportamento', en: ['the behaviour'], gloss: { de: ['das Verhalten'], es: ['el comportamiento'], fr: ['le comportement'], it: ['il comportamento'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'pt4v083', de: 'a percepção', en: ['the perception'], gloss: { de: ['die Wahrnehmung'], es: ['la percepción'], fr: ['la perception'], it: ['la percezione'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'pt4v084', de: 'o hábito', en: ['the habit'], gloss: { de: ['die Gewohnheit'], es: ['el hábito'], fr: ['l’habitude'], it: ['l’abitudine'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'pt4v085', de: 'a autoestima', en: ['the self-esteem'], gloss: { de: ['das Selbstwertgefühl'], es: ['la autoestima'], fr: ['l’estime de soi'], it: ['l’autostima'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'pt4v086', de: 'o transtorno', en: ['the disorder'], gloss: { de: ['die Störung'], es: ['el trastorno'], fr: ['le trouble'], it: ['il disturbo'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'pt4v087', de: 'a ansiedade', en: ['the anxiety'], gloss: { de: ['die Angst'], es: ['la ansiedad'], fr: ['l’anxiété'], it: ['l’ansia'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'pt4v088', de: 'o estímulo', en: ['the stimulus'], gloss: { de: ['der Reiz'], es: ['el estímulo'], fr: ['le stimulus'], it: ['lo stimolo'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'pt4v089', de: 'a resiliência', en: ['the resilience'], gloss: { de: ['die Widerstandsfähigkeit'], es: ['la resiliencia'], fr: ['la résilience'], it: ['la resilienza'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'pt4v090', de: 'o vício', en: ['the addiction'], gloss: { de: ['die Sucht'], es: ['la adicción'], fr: ['la dépendance'], it: ['la dipendenza'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'pt4v091', de: 'a empatia', en: ['the empathy'], gloss: { de: ['die Empathie'], es: ['la empatía'], fr: ['l’empathie'], it: ['l’empatia'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'pt4v092', de: 'amadurecer', en: ['to mature', 'to grow up'], gloss: { de: ['reifen'], es: ['madurar'], fr: ['mûrir'], it: ['maturare'] }, pos: 'verb', level: 'B2', category: 'psychology' },
  { id: 'pt4v093', de: 'desabafar', en: ['to get it off one’s chest', 'to open up'], gloss: { de: ['sich aussprechen'], es: ['desahogarse'], fr: ['se confier'], it: ['sfogarsi'] }, pos: 'verb', level: 'B2', category: 'psychology' },

  // ── technology & ethics ───────────────────────────────────────────────
  { id: 'pt4v094', de: 'o aprendizado de máquina', en: ['the machine learning'], gloss: { de: ['das maschinelle Lernen'], es: ['el aprendizaje automático'], fr: ['l’apprentissage automatique'], it: ['l’apprendimento automatico'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'pt4v095', de: 'a criptografia', en: ['the encryption'], gloss: { de: ['die Verschlüsselung'], es: ['el cifrado'], fr: ['le chiffrement'], it: ['la crittografia'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'pt4v096', de: 'o dispositivo', en: ['the device'], gloss: { de: ['das Gerät'], es: ['el dispositivo'], fr: ['l’appareil'], it: ['il dispositivo'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'pt4v097', de: 'o rastreamento', en: ['the tracking'], gloss: { de: ['die Nachverfolgung'], es: ['el rastreo'], fr: ['le pistage'], it: ['il tracciamento'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'pt4v098', de: 'a vigilância', en: ['the surveillance'], gloss: { de: ['die Überwachung'], es: ['la vigilancia'], fr: ['la surveillance'], it: ['la sorveglianza'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'pt4v099', de: 'o consentimento', en: ['the consent'], gloss: { de: ['die Einwilligung'], es: ['el consentimiento'], fr: ['le consentement'], it: ['il consenso'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'pt4v100', de: 'a responsabilidade', en: ['the responsibility'], gloss: { de: ['die Verantwortung'], es: ['la responsabilidad'], fr: ['la responsabilité'], it: ['la responsabilità'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'pt4v101', de: 'o risco', en: ['the risk'], gloss: { de: ['das Risiko'], es: ['el riesgo'], fr: ['le risque'], it: ['il rischio'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'pt4v102', de: 'a automação', en: ['the automation'], gloss: { de: ['die Automatisierung'], es: ['la automatización'], fr: ['l’automatisation'], it: ['l’automazione'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'pt4v103', de: 'o vazamento', en: ['the leak'], gloss: { de: ['das Datenleck'], es: ['la filtración'], fr: ['la fuite'], it: ['la fuga di dati'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'pt4v104', de: 'monitorar', en: ['to monitor'], gloss: { de: ['überwachen'], es: ['monitorear'], fr: ['surveiller'], it: ['monitorare'] }, pos: 'verb', level: 'B2', category: 'technology' },
  { id: 'pt4v105', de: 'regulamentar', en: ['to regulate'], gloss: { de: ['regulieren'], es: ['regular'], fr: ['réglementer'], it: ['regolamentare'] }, pos: 'verb', level: 'B2', category: 'technology' },
  { id: 'pt4v106', de: 'questionável', en: ['questionable'], gloss: { de: ['fragwürdig'], es: ['cuestionable'], fr: ['discutable'], it: ['discutibile'] }, pos: 'adj', level: 'B2', category: 'technology' },

  // ── urban life ────────────────────────────────────────────────────────
  { id: 'pt4v107', de: 'o trânsito', en: ['the traffic'], gloss: { de: ['der Verkehr'], es: ['el tráfico'], fr: ['la circulation'], it: ['il traffico'] }, pos: 'noun', level: 'B2', category: 'city' },
  { id: 'pt4v108', de: 'o congestionamento', en: ['the traffic jam'], gloss: { de: ['der Stau'], es: ['el atasco'], fr: ['l’embouteillage'], it: ['l’ingorgo'] }, pos: 'noun', level: 'B2', category: 'city' },
  { id: 'pt4v109', de: 'o pedestre', en: ['the pedestrian'], gloss: { de: ['der Fußgänger'], es: ['el peatón'], fr: ['le piéton'], it: ['il pedone'] }, pos: 'noun', level: 'B2', category: 'city' },
  { id: 'pt4v110', de: 'a calçada', en: ['the pavement', 'the sidewalk'], gloss: { de: ['der Gehweg'], es: ['la acera'], fr: ['le trottoir'], it: ['il marciapiede'] }, pos: 'noun', level: 'B2', category: 'city' },
  { id: 'pt4v111', de: 'a periferia', en: ['the outskirts'], gloss: { de: ['der Stadtrand'], es: ['las afueras'], fr: ['la périphérie'], it: ['la periferia'] }, pos: 'noun', level: 'B2', category: 'city' },
  { id: 'pt4v112', de: 'o aluguel', en: ['the rent'], gloss: { de: ['die Miete'], es: ['el alquiler'], fr: ['le loyer'], it: ['l’affitto'] }, pos: 'noun', level: 'B2', category: 'city' },
  { id: 'pt4v113', de: 'a moradia', en: ['the housing'], gloss: { de: ['das Wohnen'], es: ['la vivienda'], fr: ['le logement'], it: ['l’alloggio'] }, pos: 'noun', level: 'B2', category: 'city' },
  { id: 'pt4v114', de: 'o saneamento', en: ['the sanitation'], gloss: { de: ['die Abwasserentsorgung'], es: ['el saneamiento'], fr: ['l’assainissement'], it: ['la rete fognaria'] }, pos: 'noun', level: 'B2', category: 'city' },
  { id: 'pt4v115', de: 'a obra', en: ['the construction work'], gloss: { de: ['die Baustelle'], es: ['la obra'], fr: ['les travaux'], it: ['il cantiere'] }, pos: 'noun', level: 'B2', category: 'city' },
  { id: 'pt4v116', de: 'lotado', en: ['packed', 'crowded'], gloss: { de: ['überfüllt'], es: ['abarrotado'], fr: ['bondé'], it: ['affollato'] }, pos: 'adj', level: 'B2', category: 'city' },

  // ── arts & criticism ──────────────────────────────────────────────────
  { id: 'pt4v117', de: 'a crítica', en: ['the review', 'the criticism'], gloss: { de: ['die Kritik'], es: ['la crítica'], fr: ['la critique'], it: ['la critica'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'pt4v118', de: 'a obra-prima', en: ['the masterpiece'], gloss: { de: ['das Meisterwerk'], es: ['la obra maestra'], fr: ['le chef-d’œuvre'], it: ['il capolavoro'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'pt4v119', de: 'o enredo', en: ['the plot'], gloss: { de: ['die Handlung'], es: ['la trama'], fr: ['l’intrigue'], it: ['la trama'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'pt4v120', de: 'o personagem', en: ['the character'], gloss: { de: ['die Figur'], es: ['el personaje'], fr: ['le personnage'], it: ['il personaggio'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'pt4v121', de: 'a trilha sonora', en: ['the soundtrack'], gloss: { de: ['der Soundtrack'], es: ['la banda sonora'], fr: ['la bande originale'], it: ['la colonna sonora'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'pt4v122', de: 'o roteiro', en: ['the screenplay', 'the script'], gloss: { de: ['das Drehbuch'], es: ['el guion'], fr: ['le scénario'], it: ['la sceneggiatura'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'pt4v123', de: 'a estreia', en: ['the premiere'], gloss: { de: ['die Premiere'], es: ['el estreno'], fr: ['la première'], it: ['la prima'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'pt4v124', de: 'o público', en: ['the audience'], gloss: { de: ['das Publikum'], es: ['el público'], fr: ['le public'], it: ['il pubblico'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'pt4v125', de: 'a atuação', en: ['the acting', 'the performance'], gloss: { de: ['die schauspielerische Leistung'], es: ['la actuación'], fr: ['le jeu d’acteur'], it: ['l’interpretazione'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'pt4v126', de: 'previsível', en: ['predictable'], gloss: { de: ['vorhersehbar'], es: ['previsible'], fr: ['prévisible'], it: ['prevedibile'] }, pos: 'adj', level: 'B2', category: 'arts' },
  { id: 'pt4v127', de: 'marcante', en: ['striking', 'memorable'], gloss: { de: ['eindrucksvoll'], es: ['marcante'], fr: ['marquant'], it: ['incisivo'] }, pos: 'adj', level: 'B2', category: 'arts' },

  // ── connectors of argument ────────────────────────────────────────────
  { id: 'pt4v128', de: 'contudo', en: ['however', 'yet'], gloss: { de: ['allerdings'], es: ['no obstante'], fr: ['toutefois'], it: ['nondimeno'] }, pos: 'conj', level: 'B2', category: 'connectors' },
  { id: 'pt4v129', de: 'ainda que', en: ['even if', 'even though'], gloss: { de: ['selbst wenn'], es: ['aun cuando'], fr: ['même si'], it: ['anche se'] }, pos: 'conj', level: 'B2', category: 'connectors' },
  { id: 'pt4v130', de: 'uma vez que', en: ['given that', 'since'], gloss: { de: ['da'], es: ['dado que'], fr: ['étant donné que'], it: ['dato che'] }, pos: 'conj', level: 'B2', category: 'connectors' },
  { id: 'pt4v131', de: 'ao passo que', en: ['whereas'], gloss: { de: ['wohingegen'], es: ['mientras que'], fr: ['tandis que'], it: ['mentre invece'] }, pos: 'conj', level: 'B2', category: 'connectors' },
  { id: 'pt4v132', de: 'por outro lado', en: ['on the other hand'], gloss: { de: ['andererseits'], es: ['por otro lado'], fr: ['d’un autre côté'], it: ['d’altro canto'] }, pos: 'phrase', level: 'B2', category: 'connectors' },
  { id: 'pt4v133', de: 'em contrapartida', en: ['in return', 'conversely'], gloss: { de: ['im Gegenzug'], es: ['en contrapartida'], fr: ['en contrepartie'], it: ['in compenso'] }, pos: 'phrase', level: 'B2', category: 'connectors' },
  { id: 'pt4v134', de: 'a fim de que', en: ['so that', 'in order that'], gloss: { de: ['damit'], es: ['a fin de que'], fr: ['afin que'], it: ['affinché'] }, pos: 'conj', level: 'B2', category: 'connectors' },
  { id: 'pt4v135', de: 'de antemão', en: ['beforehand', 'in advance'], gloss: { de: ['im Voraus'], es: ['de antemano'], fr: ['d’avance'], it: ['in anticipo'] }, pos: 'adv', level: 'B2', category: 'connectors' },
  { id: 'pt4v136', de: 'na medida em que', en: ['insofar as'], gloss: { de: ['insofern als'], es: ['en la medida en que'], fr: ['dans la mesure où'], it: ['nella misura in cui'] }, pos: 'conj', level: 'B2', category: 'connectors' },
  { id: 'pt4v137', de: 'tendo em vista', en: ['in view of', 'given'], gloss: { de: ['angesichts'], es: ['teniendo en cuenta'], fr: ['compte tenu de'], it: ['tenuto conto di'] }, pos: 'phrase', level: 'B2', category: 'connectors' },
  { id: 'pt4v138', de: 'por sua vez', en: ['in turn'], gloss: { de: ['seinerseits'], es: ['a su vez'], fr: ['à son tour'], it: ['a sua volta'] }, pos: 'phrase', level: 'B2', category: 'connectors' },
  { id: 'pt4v139', de: 'de modo que', en: ['so that', 'with the result that'], gloss: { de: ['sodass'], es: ['de modo que'], fr: ['de sorte que'], it: ['di modo che'] }, pos: 'conj', level: 'B2', category: 'connectors' },
  { id: 'pt4v140', de: 'salvo se', en: ['unless'], gloss: { de: ['es sei denn'], es: ['salvo si'], fr: ['sauf si'], it: ['salvo che'] }, pos: 'conj', level: 'B2', category: 'connectors' },
  { id: 'pt4v141', de: 'vale ressaltar', en: ['it is worth stressing'], gloss: { de: ['es sei betont'], es: ['cabe destacar'], fr: ['il convient de souligner'], it: ['va sottolineato'] }, pos: 'phrase', level: 'B2', category: 'connectors' },

  // ── hedging & register ────────────────────────────────────────────────
  { id: 'pt4v142', de: 'ao que tudo indica', en: ['by all indications'], gloss: { de: ['allem Anschein nach'], es: ['al parecer'], fr: ['selon toute apparence'], it: ['a quanto pare'] }, pos: 'phrase', level: 'B2', category: 'register' },
  { id: 'pt4v143', de: 'se não me engano', en: ['if I am not mistaken'], gloss: { de: ['wenn ich mich nicht irre'], es: ['si no me equivoco'], fr: ['si je ne me trompe pas'], it: ['se non mi sbaglio'] }, pos: 'phrase', level: 'B2', category: 'register' },
  { id: 'pt4v144', de: 'com todo o respeito', en: ['with all due respect'], gloss: { de: ['bei allem Respekt'], es: ['con todo respeto'], fr: ['sauf votre respect'], it: ['con tutto il rispetto'] }, pos: 'phrase', level: 'B2', category: 'register' },
  { id: 'pt4v145', de: 'até certo ponto', en: ['up to a point'], gloss: { de: ['bis zu einem gewissen Grad'], es: ['hasta cierto punto'], fr: ['jusqu’à un certain point'], it: ['fino a un certo punto'] }, pos: 'phrase', level: 'B2', category: 'register' },
  { id: 'pt4v146', de: 'de certa forma', en: ['in a way', 'in a sense'], gloss: { de: ['gewissermaßen'], es: ['en cierto modo'], fr: ['d’une certaine manière'], it: ['in un certo senso'] }, pos: 'phrase', level: 'B2', category: 'register' },
  { id: 'pt4v147', de: 'cabe lembrar', en: ['it is worth recalling'], gloss: { de: ['man sollte daran erinnern'], es: ['conviene recordar'], fr: ['il convient de rappeler'], it: ['va ricordato'] }, pos: 'phrase', level: 'B2', category: 'register' },
  { id: 'pt4v148', de: 'sendo assim', en: ['that being so', 'accordingly'], gloss: { de: ['demnach'], es: ['siendo así'], fr: ['cela étant'], it: ['stando così le cose'] }, pos: 'phrase', level: 'B2', category: 'register' },
  { id: 'pt4v149', de: 'em última análise', en: ['ultimately', 'in the final analysis'], gloss: { de: ['letztlich'], es: ['en última instancia'], fr: ['en fin de compte'], it: ['in ultima analisi'] }, pos: 'phrase', level: 'B2', category: 'register' },

  // ── idioms & collocations ─────────────────────────────────────────────
  { id: 'pt4v150', de: 'dar conta do recado', en: ['to be up to the job', 'to deliver'], gloss: { de: ['die Sache schaffen'], es: ['dar la talla'], fr: ['être à la hauteur'], it: ['essere all’altezza'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'pt4v151', de: 'pôr em xeque', en: ['to call into question'], gloss: { de: ['infrage stellen'], es: ['poner en jaque'], fr: ['remettre en question'], it: ['mettere in discussione'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'pt4v152', de: 'abrir mão de', en: ['to give up', 'to waive'], gloss: { de: ['verzichten auf'], es: ['renunciar a'], fr: ['renoncer à'], it: ['rinunciare a'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'pt4v153', de: 'levar em conta', en: ['to take into account'], gloss: { de: ['berücksichtigen'], es: ['tener en cuenta'], fr: ['prendre en compte'], it: ['tenere conto di'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'pt4v154', de: 'tirar proveito de', en: ['to take advantage of'], gloss: { de: ['Nutzen ziehen aus'], es: ['sacar provecho de'], fr: ['tirer parti de'], it: ['trarre vantaggio da'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'pt4v155', de: 'ficar em cima do muro', en: ['to sit on the fence'], gloss: { de: ['sich nicht festlegen'], es: ['nadar entre dos aguas'], fr: ['ménager la chèvre et le chou'], it: ['non prendere posizione'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'pt4v156', de: 'dar margem a', en: ['to give rise to', 'to leave room for'], gloss: { de: ['Anlass geben zu'], es: ['dar pie a'], fr: ['donner lieu à'], it: ['dare adito a'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'pt4v157', de: 'correr atrás do prejuízo', en: ['to make up lost ground'], gloss: { de: ['Versäumtes nachholen'], es: ['recuperar el terreno perdido'], fr: ['rattraper le retard'], it: ['recuperare il terreno perduto'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'pt4v158', de: 'estar por dentro', en: ['to be in the know'], gloss: { de: ['im Bilde sein'], es: ['estar al tanto'], fr: ['être au courant'], it: ['essere al corrente'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'pt4v159', de: 'pesar na balança', en: ['to weigh in the balance', 'to count'], gloss: { de: ['ins Gewicht fallen'], es: ['pesar en la balanza'], fr: ['peser dans la balance'], it: ['pesare sulla bilancia'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
];
