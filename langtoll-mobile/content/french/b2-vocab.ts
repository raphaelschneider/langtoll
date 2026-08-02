import type { VocabItem } from '@/content/german/types';

// French (fr-FR) B2 vocabulary. The `de` field holds the French text (see the
// note in content/german/types.ts). Nouns ship with their article, and the
// elided ones carry an explicit `gender` — l’enjeu, l’essor, l’échantillon,
// l’algorithme, l’avocat, l’endettement and l’étalement urbain are masculine,
// l’échéance, l’hypothèse, l’appartenance, l’amende, l’angoisse, l’inflation,
// l’offre and l’œuvre are feminine, and the article no longer tells you which
// is which.
//
// Level discipline: A1 owns greetings, people, basic food and the core verbs.
// A2 owns the passé composé, routine, travel and shopping. B1 owns stated
// opinion — the abstract noun, work, media, environment, and the connectors
// that hold a paragraph together. B2 is what comes after the opinion: the
// concession, the hedge, the qualification. It owns negotiation rather than
// jobs, disinformation rather than newspapers, hypothesis rather than
// research, and above all the machinery of nuance — néanmoins, dans la mesure
// où, il n’en reste pas moins que — plus the idiom a B1 learner never meets.
// Nothing here repeats fr1v###, fr2v### or fr3v###.
//
// `gloss` carries the other UI locales. English lives in `en` and is the
// guaranteed fallback; French itself is never glossed (a French-UI user is
// never offered French to learn), so each item covers de / es / it / pt.
// Categories stay at 10 items so the multiple-choice generator always finds
// same-category distractors.

export const B2_VOCAB: VocabItem[] = [
  // ── negotiation ───────────────────────────────────────────────────────
  { id: 'fr4v001', de: 'la négociation', en: ['the negotiation'], gloss: { de: ['die Verhandlung'], es: ['la negociación'], it: ['la trattativa'], pt: ['a negociação'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'fr4v002', de: 'le compromis', en: ['the compromise'], gloss: { de: ['der Kompromiss'], es: ['el compromiso'], it: ['il compromesso'], pt: ['o compromisso'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'fr4v003', de: 'l’enjeu', en: ['the stake', 'what is at stake'], gloss: { de: ['der Einsatz'], es: ['lo que está en juego'], it: ['la posta in gioco'], pt: ['o que está em jogo'] }, pos: 'noun', gender: 'm', level: 'B2', category: 'negotiation' },
  { id: 'fr4v004', de: 'la marge de manœuvre', en: ['the room for manoeuvre'], gloss: { de: ['der Spielraum'], es: ['el margen de maniobra'], it: ['il margine di manovra'], pt: ['a margem de manobra'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'fr4v005', de: 'le rapport de force', en: ['the balance of power'], gloss: { de: ['das Kräfteverhältnis'], es: ['la correlación de fuerzas'], it: ['il rapporto di forza'], pt: ['a relação de forças'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'fr4v006', de: 'la contrepartie', en: ['the concession in return', 'the trade-off'], gloss: { de: ['die Gegenleistung'], es: ['la contrapartida'], it: ['la contropartita'], pt: ['a contrapartida'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'fr4v007', de: 'revoir à la baisse', en: ['to revise downwards'], gloss: { de: ['nach unten korrigieren'], es: ['revisar a la baja'], it: ['rivedere al ribasso'], pt: ['rever em baixa'] }, pos: 'phrase', level: 'B2', category: 'negotiation' },
  { id: 'fr4v008', de: 'céder du terrain', en: ['to give ground'], gloss: { de: ['Boden preisgeben'], es: ['ceder terreno'], it: ['cedere terreno'], pt: ['ceder terreno'] }, pos: 'phrase', level: 'B2', category: 'negotiation' },
  { id: 'fr4v009', de: 'trancher', en: ['to settle a question', 'to decide once and for all'], gloss: { de: ['entscheiden'], es: ['zanjar'], it: ['decidere'], pt: ['decidir'] }, pos: 'verb', level: 'B2', category: 'negotiation' },
  { id: 'fr4v010', de: 'l’échéance', en: ['the deadline', 'the due date'], gloss: { de: ['die Frist'], es: ['el plazo'], it: ['la scadenza'], pt: ['o prazo'] }, pos: 'noun', gender: 'f', level: 'B2', category: 'negotiation' },

  // ── information & disinformation ──────────────────────────────────────
  { id: 'fr4v011', de: 'la désinformation', en: ['the disinformation'], gloss: { de: ['die Desinformation'], es: ['la desinformación'], it: ['la disinformazione'], pt: ['a desinformação'] }, pos: 'noun', level: 'B2', category: 'information' },
  { id: 'fr4v012', de: 'la rédaction', en: ['the editorial team', 'the newsroom'], gloss: { de: ['die Redaktion'], es: ['la redacción'], it: ['la redazione'], pt: ['a redação'] }, pos: 'noun', level: 'B2', category: 'information' },
  { id: 'fr4v013', de: 'la une', en: ['the front page'], gloss: { de: ['die Titelseite'], es: ['la portada'], it: ['la prima pagina'], pt: ['a primeira página'] }, pos: 'noun', level: 'B2', category: 'information' },
  { id: 'fr4v014', de: 'le traitement médiatique', en: ['the media coverage'], gloss: { de: ['die mediale Berichterstattung'], es: ['el tratamiento mediático'], it: ['il trattamento mediatico'], pt: ['o tratamento mediático'] }, pos: 'noun', level: 'B2', category: 'information' },
  { id: 'fr4v015', de: 'la ligne éditoriale', en: ['the editorial line'], gloss: { de: ['die redaktionelle Linie'], es: ['la línea editorial'], it: ['la linea editoriale'], pt: ['a linha editorial'] }, pos: 'noun', level: 'B2', category: 'information' },
  { id: 'fr4v016', de: 'le recoupement', en: ['the cross-checking', 'the corroboration'], gloss: { de: ['der Abgleich'], es: ['el cotejo'], it: ['il riscontro incrociato'], pt: ['o cruzamento de fontes'] }, pos: 'noun', level: 'B2', category: 'information' },
  { id: 'fr4v017', de: 'relayer', en: ['to pass on', 'to relay'], gloss: { de: ['weiterverbreiten'], es: ['retransmitir'], it: ['rilanciare'], pt: ['retransmitir'] }, pos: 'verb', level: 'B2', category: 'information' },
  { id: 'fr4v018', de: 'démentir', en: ['to deny', 'to refute officially'], gloss: { de: ['dementieren'], es: ['desmentir'], it: ['smentire'], pt: ['desmentir'] }, pos: 'verb', level: 'B2', category: 'information' },
  { id: 'fr4v019', de: 'la véracité', en: ['the truthfulness', 'the veracity'], gloss: { de: ['die Wahrhaftigkeit'], es: ['la veracidad'], it: ['la veridicità'], pt: ['a veracidade'] }, pos: 'noun', level: 'B2', category: 'information' },
  { id: 'fr4v020', de: 's’avérer', en: ['to turn out to be', 'to prove to be'], gloss: { de: ['sich herausstellen'], es: ['resultar'], it: ['rivelarsi'], pt: ['revelar-se'] }, pos: 'verb', level: 'B2', category: 'information' },

  // ── science & method ──────────────────────────────────────────────────
  { id: 'fr4v021', de: 'l’hypothèse', en: ['the hypothesis'], gloss: { de: ['die Hypothese'], es: ['la hipótesis'], it: ['l’ipotesi'], pt: ['a hipótese'] }, pos: 'noun', gender: 'f', level: 'B2', category: 'science' },
  { id: 'fr4v022', de: 'la démarche', en: ['the approach', 'the procedure'], gloss: { de: ['das Vorgehen'], es: ['el planteamiento'], it: ['l’approccio'], pt: ['a abordagem'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'fr4v023', de: 'l’échantillon', en: ['the sample'], gloss: { de: ['die Stichprobe'], es: ['la muestra'], it: ['il campione'], pt: ['a amostra'] }, pos: 'noun', gender: 'm', level: 'B2', category: 'science' },
  { id: 'fr4v024', de: 'le constat', en: ['the finding', 'the observation'], gloss: { de: ['die Feststellung'], es: ['la constatación'], it: ['la constatazione'], pt: ['a constatação'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'fr4v025', de: 'la corrélation', en: ['the correlation'], gloss: { de: ['die Korrelation'], es: ['la correlación'], it: ['la correlazione'], pt: ['a correlação'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'fr4v026', de: 'le biais', en: ['the bias'], gloss: { de: ['die Verzerrung'], es: ['el sesgo'], it: ['la distorsione'], pt: ['o viés'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'fr4v027', de: 'réfuter', en: ['to refute'], gloss: { de: ['widerlegen'], es: ['refutar'], it: ['confutare'], pt: ['refutar'] }, pos: 'verb', level: 'B2', category: 'science' },
  { id: 'fr4v028', de: 'recueillir', en: ['to collect', 'to gather'], gloss: { de: ['erheben'], es: ['recopilar'], it: ['raccogliere'], pt: ['recolher'] }, pos: 'verb', level: 'B2', category: 'science' },
  { id: 'fr4v029', de: 'probant', en: ['conclusive', 'convincing'], gloss: { de: ['schlüssig'], es: ['concluyente'], it: ['convincente'], pt: ['conclusivo'] }, pos: 'adj', level: 'B2', category: 'science' },
  { id: 'fr4v030', de: 'la marge d’erreur', en: ['the margin of error'], gloss: { de: ['die Fehlermarge'], es: ['el margen de error'], it: ['il margine di errore'], pt: ['a margem de erro'] }, pos: 'noun', level: 'B2', category: 'science' },

  // ── climate & resources ───────────────────────────────────────────────
  { id: 'fr4v031', de: 'l’empreinte carbone', en: ['the carbon footprint'], gloss: { de: ['der CO2-Fußabdruck'], es: ['la huella de carbono'], it: ['l’impronta di carbonio'], pt: ['a pegada de carbono'] }, pos: 'noun', gender: 'f', level: 'B2', category: 'climate' },
  { id: 'fr4v032', de: 'la biodiversité', en: ['the biodiversity'], gloss: { de: ['die Artenvielfalt'], es: ['la biodiversidad'], it: ['la biodiversità'], pt: ['a biodiversidade'] }, pos: 'noun', level: 'B2', category: 'climate' },
  { id: 'fr4v033', de: 'la sécheresse', en: ['the drought'], gloss: { de: ['die Dürre'], es: ['la sequía'], it: ['la siccità'], pt: ['a seca'] }, pos: 'noun', level: 'B2', category: 'climate' },
  { id: 'fr4v034', de: 'le littoral', en: ['the coastline'], gloss: { de: ['die Küste'], es: ['el litoral'], it: ['il litorale'], pt: ['o litoral'] }, pos: 'noun', level: 'B2', category: 'climate' },
  { id: 'fr4v035', de: 'la sobriété énergétique', en: ['the reduced energy use'], gloss: { de: ['der sparsame Energieverbrauch'], es: ['la sobriedad energética'], it: ['la sobrietà energetica'], pt: ['a sobriedade energética'] }, pos: 'noun', level: 'B2', category: 'climate' },
  { id: 'fr4v036', de: 'l’essor', en: ['the boom', 'the rapid growth'], gloss: { de: ['der Aufschwung'], es: ['el auge'], it: ['la forte crescita'], pt: ['o crescimento acelerado'] }, pos: 'noun', gender: 'm', level: 'B2', category: 'climate' },
  { id: 'fr4v037', de: 'enrayer', en: ['to curb', 'to halt'], gloss: { de: ['eindämmen'], es: ['frenar'], it: ['arginare'], pt: ['travar'] }, pos: 'verb', level: 'B2', category: 'climate' },
  { id: 'fr4v038', de: 'préconiser', en: ['to recommend', 'to advocate'], gloss: { de: ['empfehlen'], es: ['preconizar'], it: ['raccomandare'], pt: ['preconizar'] }, pos: 'verb', level: 'B2', category: 'climate' },
  { id: 'fr4v039', de: 'néfaste', en: ['harmful', 'damaging'], gloss: { de: ['schädlich'], es: ['nefasto'], it: ['nefasto'], pt: ['nefasto'] }, pos: 'adj', level: 'B2', category: 'climate' },
  { id: 'fr4v040', de: 'le seuil', en: ['the threshold'], gloss: { de: ['die Schwelle'], es: ['el umbral'], it: ['la soglia'], pt: ['o limiar'] }, pos: 'noun', level: 'B2', category: 'climate' },

  // ── culture & identity ────────────────────────────────────────────────
  { id: 'fr4v041', de: 'l’appartenance', en: ['the belonging'], gloss: { de: ['die Zugehörigkeit'], es: ['la pertenencia'], it: ['l’appartenenza'], pt: ['o pertencimento'] }, pos: 'noun', gender: 'f', level: 'B2', category: 'identity' },
  { id: 'fr4v042', de: 'le métissage', en: ['the cultural mixing'], gloss: { de: ['die Vermischung der Kulturen'], es: ['el mestizaje'], it: ['il meticciato'], pt: ['a mestiçagem'] }, pos: 'noun', level: 'B2', category: 'identity' },
  { id: 'fr4v043', de: 'la transmission', en: ['the passing on', 'the handing down'], gloss: { de: ['die Weitergabe'], es: ['la transmisión'], it: ['la trasmissione'], pt: ['a transmissão'] }, pos: 'noun', level: 'B2', category: 'identity' },
  { id: 'fr4v044', de: 'les mœurs', en: ['the customs', 'the mores'], gloss: { de: ['die Sitten'], es: ['las costumbres'], it: ['i costumi'], pt: ['os costumes'] }, pos: 'noun', level: 'B2', category: 'identity' },
  { id: 'fr4v045', de: 'le repère', en: ['the point of reference', 'the landmark'], gloss: { de: ['der Anhaltspunkt'], es: ['el punto de referencia'], it: ['il punto di riferimento'], pt: ['o ponto de referência'] }, pos: 'noun', level: 'B2', category: 'identity' },
  { id: 'fr4v046', de: 'le déracinement', en: ['the uprooting'], gloss: { de: ['die Entwurzelung'], es: ['el desarraigo'], it: ['lo sradicamento'], pt: ['o desenraizamento'] }, pos: 'noun', level: 'B2', category: 'identity' },
  { id: 'fr4v047', de: 'revendiquer', en: ['to claim', 'to assert'], gloss: { de: ['beanspruchen'], es: ['reivindicar'], it: ['rivendicare'], pt: ['reivindicar'] }, pos: 'verb', level: 'B2', category: 'identity' },
  { id: 'fr4v048', de: 's’épanouir', en: ['to flourish', 'to thrive'], gloss: { de: ['sich entfalten'], es: ['realizarse'], it: ['realizzarsi'], pt: ['realizar-se'] }, pos: 'verb', level: 'B2', category: 'identity' },
  { id: 'fr4v049', de: 'le clivage', en: ['the divide', 'the split'], gloss: { de: ['die Kluft'], es: ['la brecha'], it: ['la frattura'], pt: ['a clivagem'] }, pos: 'noun', level: 'B2', category: 'identity' },
  { id: 'fr4v050', de: 'ancré', en: ['rooted', 'deeply anchored'], gloss: { de: ['verankert'], es: ['arraigado'], it: ['radicato'], pt: ['enraizado'] }, pos: 'adj', level: 'B2', category: 'identity' },

  // ── law & justice ─────────────────────────────────────────────────────
  { id: 'fr4v051', de: 'le témoignage', en: ['the testimony', 'the account'], gloss: { de: ['die Aussage'], es: ['el testimonio'], it: ['la testimonianza'], pt: ['o testemunho'] }, pos: 'noun', level: 'B2', category: 'justice' },
  { id: 'fr4v052', de: 'le tribunal', en: ['the court'], gloss: { de: ['das Gericht'], es: ['el tribunal'], it: ['il tribunale'], pt: ['o tribunal'] }, pos: 'noun', level: 'B2', category: 'justice' },
  { id: 'fr4v053', de: 'l’avocat', en: ['the lawyer'], gloss: { de: ['der Anwalt'], es: ['el abogado'], it: ['l’avvocato'], pt: ['o advogado'] }, pos: 'noun', gender: 'm', level: 'B2', category: 'justice' },
  { id: 'fr4v054', de: 'la peine', en: ['the sentence', 'the penalty'], gloss: { de: ['die Strafe'], es: ['la pena'], it: ['la pena'], pt: ['a pena'] }, pos: 'noun', level: 'B2', category: 'justice' },
  { id: 'fr4v055', de: 'le recours', en: ['the appeal', 'the legal remedy'], gloss: { de: ['der Einspruch'], es: ['el recurso'], it: ['il ricorso'], pt: ['o recurso'] }, pos: 'noun', level: 'B2', category: 'justice' },
  { id: 'fr4v056', de: 'la présomption d’innocence', en: ['the presumption of innocence'], gloss: { de: ['die Unschuldsvermutung'], es: ['la presunción de inocencia'], it: ['la presunzione di innocenza'], pt: ['a presunção de inocência'] }, pos: 'noun', level: 'B2', category: 'justice' },
  { id: 'fr4v057', de: 'porter plainte', en: ['to file a complaint'], gloss: { de: ['Anzeige erstatten'], es: ['presentar una denuncia'], it: ['sporgere denuncia'], pt: ['apresentar queixa'] }, pos: 'phrase', level: 'B2', category: 'justice' },
  { id: 'fr4v058', de: 'enfreindre', en: ['to break a rule', 'to infringe'], gloss: { de: ['verstoßen gegen'], es: ['infringir'], it: ['infrangere'], pt: ['infringir'] }, pos: 'verb', level: 'B2', category: 'justice' },
  { id: 'fr4v059', de: 'l’amende', en: ['the fine'], gloss: { de: ['die Geldstrafe'], es: ['la multa'], it: ['la multa'], pt: ['a multa'] }, pos: 'noun', gender: 'f', level: 'B2', category: 'justice' },
  { id: 'fr4v060', de: 'équitable', en: ['fair', 'equitable'], gloss: { de: ['gerecht'], es: ['equitativo'], it: ['equo'], pt: ['equitativo'] }, pos: 'adj', level: 'B2', category: 'justice' },

  // ── economics ─────────────────────────────────────────────────────────
  { id: 'fr4v061', de: 'la conjoncture', en: ['the economic climate'], gloss: { de: ['die Konjunktur'], es: ['la coyuntura'], it: ['la congiuntura'], pt: ['a conjuntura'] }, pos: 'noun', level: 'B2', category: 'economics' },
  { id: 'fr4v062', de: 'l’inflation', en: ['the inflation'], gloss: { de: ['die Inflation'], es: ['la inflación'], it: ['l’inflazione'], pt: ['a inflação'] }, pos: 'noun', gender: 'f', level: 'B2', category: 'economics' },
  { id: 'fr4v063', de: 'le pouvoir d’achat', en: ['the purchasing power'], gloss: { de: ['die Kaufkraft'], es: ['el poder adquisitivo'], it: ['il potere d’acquisto'], pt: ['o poder de compra'] }, pos: 'noun', level: 'B2', category: 'economics' },
  { id: 'fr4v064', de: 'l’endettement', en: ['the indebtedness'], gloss: { de: ['die Verschuldung'], es: ['el endeudamiento'], it: ['l’indebitamento'], pt: ['o endividamento'] }, pos: 'noun', gender: 'm', level: 'B2', category: 'economics' },
  { id: 'fr4v065', de: 'l’offre', en: ['the supply'], gloss: { de: ['das Angebot'], es: ['la oferta'], it: ['l’offerta'], pt: ['a oferta'] }, pos: 'noun', gender: 'f', level: 'B2', category: 'economics' },
  { id: 'fr4v066', de: 'la demande', en: ['the demand'], gloss: { de: ['die Nachfrage'], es: ['la demanda'], it: ['la domanda'], pt: ['a procura'] }, pos: 'noun', level: 'B2', category: 'economics' },
  { id: 'fr4v067', de: 'le placement', en: ['the investment'], gloss: { de: ['die Geldanlage'], es: ['la inversión'], it: ['l’investimento'], pt: ['a aplicação'] }, pos: 'noun', level: 'B2', category: 'economics' },
  { id: 'fr4v068', de: 'la relance', en: ['the stimulus', 'the recovery push'], gloss: { de: ['die Konjunkturbelebung'], es: ['la reactivación'], it: ['il rilancio'], pt: ['a retoma'] }, pos: 'noun', level: 'B2', category: 'economics' },
  { id: 'fr4v069', de: 'rentable', en: ['profitable'], gloss: { de: ['rentabel'], es: ['rentable'], it: ['redditizio'], pt: ['rentável'] }, pos: 'adj', level: 'B2', category: 'economics' },
  { id: 'fr4v070', de: 's’effondrer', en: ['to collapse'], gloss: { de: ['zusammenbrechen'], es: ['desplomarse'], it: ['crollare'], pt: ['desabar'] }, pos: 'verb', level: 'B2', category: 'economics' },

  // ── psychology ────────────────────────────────────────────────────────
  { id: 'fr4v071', de: 'le comportement', en: ['the behaviour'], gloss: { de: ['das Verhalten'], es: ['el comportamiento'], it: ['il comportamento'], pt: ['o comportamento'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'fr4v072', de: 'la prise de conscience', en: ['the realisation', 'the dawning awareness'], gloss: { de: ['die Bewusstwerdung'], es: ['la toma de conciencia'], it: ['la presa di coscienza'], pt: ['a tomada de consciência'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'fr4v073', de: 'le ressenti', en: ['the felt experience', 'the subjective impression'], gloss: { de: ['das Empfinden'], es: ['la vivencia'], it: ['la percezione soggettiva'], pt: ['a vivência'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'fr4v074', de: 'l’estime de soi', en: ['the self-esteem'], gloss: { de: ['das Selbstwertgefühl'], es: ['la autoestima'], it: ['l’autostima'], pt: ['a autoestima'] }, pos: 'noun', gender: 'f', level: 'B2', category: 'psychology' },
  { id: 'fr4v075', de: 'l’angoisse', en: ['the anxiety', 'the dread'], gloss: { de: ['die Angst'], es: ['la angustia'], it: ['l’angoscia'], pt: ['a angústia'] }, pos: 'noun', gender: 'f', level: 'B2', category: 'psychology' },
  { id: 'fr4v076', de: 'le deuil', en: ['the grief', 'the mourning'], gloss: { de: ['die Trauer'], es: ['el duelo'], it: ['il lutto'], pt: ['o luto'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'fr4v077', de: 'la résilience', en: ['the resilience'], gloss: { de: ['die Resilienz'], es: ['la resiliencia'], it: ['la resilienza'], pt: ['a resiliência'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'fr4v078', de: 'surmonter', en: ['to overcome'], gloss: { de: ['überwinden'], es: ['superar'], it: ['superare'], pt: ['superar'] }, pos: 'verb', level: 'B2', category: 'psychology' },
  { id: 'fr4v079', de: 'assumer', en: ['to own', 'to take on fully'], gloss: { de: ['übernehmen'], es: ['asumir'], it: ['assumersi'], pt: ['assumir'] }, pos: 'verb', level: 'B2', category: 'psychology' },
  { id: 'fr4v080', de: 'lucide', en: ['clear-sighted', 'lucid'], gloss: { de: ['klarsichtig'], es: ['lúcido'], it: ['lucido'], pt: ['lúcido'] }, pos: 'adj', level: 'B2', category: 'psychology' },

  // ── technology & ethics ───────────────────────────────────────────────
  { id: 'fr4v081', de: 'l’intelligence artificielle', en: ['the artificial intelligence'], gloss: { de: ['die künstliche Intelligenz'], es: ['la inteligencia artificial'], it: ['l’intelligenza artificiale'], pt: ['a inteligência artificial'] }, pos: 'noun', gender: 'f', level: 'B2', category: 'technology' },
  { id: 'fr4v082', de: 'le traçage', en: ['the tracking'], gloss: { de: ['die Nachverfolgung'], es: ['el rastreo'], it: ['il tracciamento'], pt: ['o rastreio'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'fr4v083', de: 'la confidentialité', en: ['the confidentiality'], gloss: { de: ['die Vertraulichkeit'], es: ['la confidencialidad'], it: ['la riservatezza'], pt: ['a confidencialidade'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'fr4v084', de: 'le piratage', en: ['the hacking'], gloss: { de: ['das Hacken'], es: ['la piratería informática'], it: ['la pirateria informatica'], pt: ['a pirataria informática'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'fr4v085', de: 'la surveillance', en: ['the surveillance', 'the monitoring'], gloss: { de: ['die Überwachung'], es: ['la vigilancia'], it: ['la sorveglianza'], pt: ['a vigilância'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'fr4v086', de: 'l’algorithme', en: ['the algorithm'], gloss: { de: ['der Algorithmus'], es: ['el algoritmo'], it: ['l’algoritmo'], pt: ['o algoritmo'] }, pos: 'noun', gender: 'm', level: 'B2', category: 'technology' },
  { id: 'fr4v087', de: 'le consentement', en: ['the consent'], gloss: { de: ['die Einwilligung'], es: ['el consentimiento'], it: ['il consenso'], pt: ['o consentimento'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'fr4v088', de: 'détourner', en: ['to divert', 'to misuse'], gloss: { de: ['zweckentfremden'], es: ['desviar'], it: ['sviare'], pt: ['desviar'] }, pos: 'verb', level: 'B2', category: 'technology' },
  { id: 'fr4v089', de: 'encadrer', en: ['to regulate', 'to set limits on'], gloss: { de: ['regulieren'], es: ['regular'], it: ['regolamentare'], pt: ['regulamentar'] }, pos: 'verb', level: 'B2', category: 'technology' },
  { id: 'fr4v090', de: 'intrusif', en: ['intrusive'], gloss: { de: ['aufdringlich'], es: ['intrusivo'], it: ['invadente'], pt: ['intrusivo'] }, pos: 'adj', level: 'B2', category: 'technology' },

  // ── urban life ────────────────────────────────────────────────────────
  { id: 'fr4v091', de: 'la banlieue', en: ['the suburbs', 'the outskirts'], gloss: { de: ['der Vorort'], es: ['las afueras'], it: ['la periferia'], pt: ['os subúrbios'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'fr4v092', de: 'l’étalement urbain', en: ['the urban sprawl'], gloss: { de: ['die Zersiedelung'], es: ['la expansión urbana'], it: ['l’espansione urbana'], pt: ['a expansão urbana'] }, pos: 'noun', gender: 'm', level: 'B2', category: 'urban' },
  { id: 'fr4v093', de: 'le logement', en: ['the housing'], gloss: { de: ['der Wohnraum'], es: ['la vivienda'], it: ['l’alloggio'], pt: ['a habitação'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'fr4v094', de: 'les embouteillages', en: ['the traffic jams'], gloss: { de: ['die Staus'], es: ['los atascos'], it: ['gli ingorghi'], pt: ['os engarrafamentos'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'fr4v095', de: 'la mixité sociale', en: ['the social mix'], gloss: { de: ['die soziale Durchmischung'], es: ['la mezcla social'], it: ['la mescolanza sociale'], pt: ['a mistura social'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'fr4v096', de: 'le loyer', en: ['the rent'], gloss: { de: ['die Miete'], es: ['el alquiler'], it: ['l’affitto'], pt: ['o aluguel'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'fr4v097', de: 'le chantier', en: ['the building site', 'the works'], gloss: { de: ['die Baustelle'], es: ['la obra'], it: ['il cantiere'], pt: ['a obra'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'fr4v098', de: 's’entasser', en: ['to be crammed together'], gloss: { de: ['sich drängen'], es: ['amontonarse'], it: ['ammassarsi'], pt: ['amontoar-se'] }, pos: 'verb', level: 'B2', category: 'urban' },
  { id: 'fr4v099', de: 'bruyant', en: ['noisy'], gloss: { de: ['laut'], es: ['ruidoso'], it: ['rumoroso'], pt: ['barulhento'] }, pos: 'adj', level: 'B2', category: 'urban' },
  { id: 'fr4v100', de: 'la densité', en: ['the density'], gloss: { de: ['die Dichte'], es: ['la densidad'], it: ['la densità'], pt: ['a densidade'] }, pos: 'noun', level: 'B2', category: 'urban' },

  // ── arts & criticism ──────────────────────────────────────────────────
  { id: 'fr4v101', de: 'l’œuvre', en: ['the work of art'], gloss: { de: ['das Werk'], es: ['la obra'], it: ['l’opera'], pt: ['a obra'] }, pos: 'noun', gender: 'f', level: 'B2', category: 'arts' },
  { id: 'fr4v102', de: 'la mise en scène', en: ['the staging', 'the direction'], gloss: { de: ['die Inszenierung'], es: ['la puesta en escena'], it: ['la messa in scena'], pt: ['a encenação'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'fr4v103', de: 'le récit', en: ['the narrative', 'the story'], gloss: { de: ['die Erzählung'], es: ['el relato'], it: ['il racconto'], pt: ['a narrativa'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'fr4v104', de: 'le chef-d’œuvre', en: ['the masterpiece'], gloss: { de: ['das Meisterwerk'], es: ['la obra maestra'], it: ['il capolavoro'], pt: ['a obra-prima'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'fr4v105', de: 'la critique', en: ['the review', 'the criticism'], gloss: { de: ['die Kritik'], es: ['la crítica'], it: ['la critica'], pt: ['a crítica'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'fr4v106', de: 'le rythme', en: ['the pace', 'the rhythm'], gloss: { de: ['das Tempo'], es: ['el ritmo'], it: ['il ritmo'], pt: ['o ritmo'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'fr4v107', de: 'la portée', en: ['the significance', 'the scope'], gloss: { de: ['die Tragweite'], es: ['el alcance'], it: ['la portata'], pt: ['o alcance'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'fr4v108', de: 'déconcertant', en: ['disconcerting', 'baffling'], gloss: { de: ['verwirrend'], es: ['desconcertante'], it: ['sconcertante'], pt: ['desconcertante'] }, pos: 'adj', level: 'B2', category: 'arts' },
  { id: 'fr4v109', de: 'saisissant', en: ['striking', 'gripping'], gloss: { de: ['packend'], es: ['impactante'], it: ['impressionante'], pt: ['impressionante'] }, pos: 'adj', level: 'B2', category: 'arts' },
  { id: 'fr4v110', de: 'susciter', en: ['to arouse', 'to provoke a reaction'], gloss: { de: ['hervorrufen'], es: ['suscitar'], it: ['suscitare'], pt: ['suscitar'] }, pos: 'verb', level: 'B2', category: 'arts' },

  // ── argumentative connectors ──────────────────────────────────────────
  { id: 'fr4v111', de: 'néanmoins', en: ['nevertheless'], gloss: { de: ['nichtsdestotrotz'], es: ['no obstante'], it: ['nondimeno'], pt: ['não obstante'] }, pos: 'adv', level: 'B2', category: 'argument' },
  { id: 'fr4v112', de: 'toutefois', en: ['however', 'that said'], gloss: { de: ['allerdings'], es: ['sin embargo'], it: ['tuttavia'], pt: ['todavia'] }, pos: 'adv', level: 'B2', category: 'argument' },
  { id: 'fr4v113', de: 'quoique', en: ['although', 'even if'], gloss: { de: ['obgleich'], es: ['aunque'], it: ['sebbene'], pt: ['se bem que'] }, pos: 'conj', level: 'B2', category: 'argument' },
  { id: 'fr4v114', de: 'dans la mesure où', en: ['insofar as', 'given that'], gloss: { de: ['insofern als'], es: ['en la medida en que'], it: ['nella misura in cui'], pt: ['na medida em que'] }, pos: 'conj', level: 'B2', category: 'argument' },
  { id: 'fr4v115', de: 'à condition que', en: ['provided that'], gloss: { de: ['vorausgesetzt, dass'], es: ['a condición de que'], it: ['a condizione che'], pt: ['desde que'] }, pos: 'conj', level: 'B2', category: 'argument' },
  { id: 'fr4v116', de: 'or', en: ['now', 'and yet'], gloss: { de: ['nun aber'], es: ['ahora bien'], it: ['orbene'], pt: ['ora'] }, pos: 'conj', level: 'B2', category: 'argument' },
  { id: 'fr4v117', de: 'd’autant plus que', en: ['all the more so because'], gloss: { de: ['umso mehr, als'], es: ['tanto más cuanto que'], it: ['tanto più che'], pt: ['tanto mais que'] }, pos: 'conj', level: 'B2', category: 'argument' },
  { id: 'fr4v118', de: 'faute de quoi', en: ['failing which'], gloss: { de: ['andernfalls'], es: ['de lo contrario'], it: ['altrimenti'], pt: ['caso contrário'] }, pos: 'conj', level: 'B2', category: 'argument' },
  { id: 'fr4v119', de: 'en dépit de', en: ['in spite of'], gloss: { de: ['ungeachtet'], es: ['a pesar de'], it: ['malgrado'], pt: ['apesar de'] }, pos: 'prep', level: 'B2', category: 'argument' },
  { id: 'fr4v120', de: 'par conséquent', en: ['consequently'], gloss: { de: ['folglich'], es: ['por consiguiente'], it: ['di conseguenza'], pt: ['por conseguinte'] }, pos: 'adv', level: 'B2', category: 'argument' },

  // ── hedging & register ────────────────────────────────────────────────
  { id: 'fr4v121', de: 'il se pourrait que', en: ['it might well be that'], gloss: { de: ['es könnte sein, dass'], es: ['podría ser que'], it: ['potrebbe darsi che'], pt: ['poderia ser que'] }, pos: 'phrase', level: 'B2', category: 'hedging' },
  { id: 'fr4v122', de: 'avoir tendance à', en: ['to tend to'], gloss: { de: ['dazu neigen'], es: ['tender a'], it: ['tendere a'], pt: ['tender a'] }, pos: 'phrase', level: 'B2', category: 'hedging' },
  { id: 'fr4v123', de: 'dans une certaine mesure', en: ['to a certain extent'], gloss: { de: ['in gewissem Maße'], es: ['hasta cierto punto'], it: ['in una certa misura'], pt: ['até certo ponto'] }, pos: 'phrase', level: 'B2', category: 'hedging' },
  { id: 'fr4v124', de: 'il n’en reste pas moins que', en: ['the fact remains that'], gloss: { de: ['es bleibt dennoch dabei, dass'], es: ['no deja de ser cierto que'], it: ['resta comunque il fatto che'], pt: ['não deixa de ser verdade que'] }, pos: 'phrase', level: 'B2', category: 'hedging' },
  { id: 'fr4v125', de: 'sous réserve de', en: ['subject to'], gloss: { de: ['vorbehaltlich'], es: ['a reserva de'], it: ['con riserva di'], pt: ['sob reserva de'] }, pos: 'prep', level: 'B2', category: 'hedging' },
  { id: 'fr4v126', de: 'quitte à', en: ['even if it means'], gloss: { de: ['auch auf die Gefahr hin, zu'], es: ['aun a riesgo de'], it: ['anche a costo di'], pt: ['mesmo correndo o risco de'] }, pos: 'prep', level: 'B2', category: 'hedging' },
  { id: 'fr4v127', de: 'loin s’en faut', en: ['far from it'], gloss: { de: ['bei Weitem nicht'], es: ['ni mucho menos'], it: ['tutt’altro'], pt: ['longe disso'] }, pos: 'phrase', level: 'B2', category: 'hedging' },
  { id: 'fr4v128', de: 'force est de constater que', en: ['one has to admit that'], gloss: { de: ['man muss feststellen, dass'], es: ['hay que constatar que'], it: ['bisogna constatare che'], pt: ['é forçoso constatar que'] }, pos: 'phrase', level: 'B2', category: 'hedging' },
  { id: 'fr4v129', de: 'nuancer', en: ['to qualify', 'to add nuance to'], gloss: { de: ['differenzieren'], es: ['matizar'], it: ['sfumare'], pt: ['matizar'] }, pos: 'verb', level: 'B2', category: 'hedging' },
  { id: 'fr4v130', de: 'sous-entendre', en: ['to imply'], gloss: { de: ['andeuten'], es: ['dar a entender'], it: ['sottintendere'], pt: ['subentender'] }, pos: 'verb', level: 'B2', category: 'hedging' },

  // ── idioms ────────────────────────────────────────────────────────────
  { id: 'fr4v131', de: 'avoir beau', en: ['however much one does'], gloss: { de: ['so sehr auch'], es: ['por más que'], it: ['per quanto'], pt: ['por mais que'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'fr4v132', de: 'mettre les points sur les i', en: ['to spell things out'], gloss: { de: ['die Dinge klarstellen'], es: ['poner los puntos sobre las íes'], it: ['mettere i puntini sulle i'], pt: ['pôr os pontos nos is'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'fr4v133', de: 'tomber à l’eau', en: ['to fall through'], gloss: { de: ['ins Wasser fallen'], es: ['irse al agua'], it: ['andare in fumo'], pt: ['ir por água abaixo'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'fr4v134', de: 'prendre du recul', en: ['to step back', 'to gain perspective'], gloss: { de: ['Abstand gewinnen'], es: ['tomar distancia'], it: ['prendere le distanze'], pt: ['tomar distância'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'fr4v135', de: 'tenir tête à', en: ['to stand up to'], gloss: { de: ['die Stirn bieten'], es: ['hacer frente a'], it: ['tener testa a'], pt: ['fazer frente a'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'fr4v136', de: 'au pied levé', en: ['at a moment’s notice'], gloss: { de: ['aus dem Stegreif'], es: ['de improviso'], it: ['su due piedi'], pt: ['de improviso'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'fr4v137', de: 'faire le point', en: ['to take stock'], gloss: { de: ['Bilanz ziehen'], es: ['hacer balance'], it: ['fare il punto'], pt: ['fazer um balanço'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'fr4v138', de: 'sauter aux yeux', en: ['to be glaringly obvious'], gloss: { de: ['ins Auge springen'], es: ['saltar a la vista'], it: ['saltare agli occhi'], pt: ['saltar aos olhos'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'fr4v139', de: 'remettre en question', en: ['to call into question'], gloss: { de: ['infrage stellen'], es: ['cuestionar'], it: ['rimettere in discussione'], pt: ['pôr em causa'] }, pos: 'phrase', level: 'B2', category: 'idioms' },
  { id: 'fr4v140', de: 'à double tranchant', en: ['double-edged'], gloss: { de: ['zweischneidig'], es: ['de doble filo'], it: ['a doppio taglio'], pt: ['de dois gumes'] }, pos: 'phrase', level: 'B2', category: 'idioms' },

  // ── nuanced adjectives ────────────────────────────────────────────────
  { id: 'fr4v141', de: 'nuancé', en: ['nuanced', 'measured'], gloss: { de: ['differenziert'], es: ['matizado'], it: ['sfumato'], pt: ['matizado'] }, pos: 'adj', level: 'B2', category: 'nuance' },
  { id: 'fr4v142', de: 'pertinent', en: ['relevant', 'apt'], gloss: { de: ['relevant'], es: ['pertinente'], it: ['pertinente'], pt: ['pertinente'] }, pos: 'adj', level: 'B2', category: 'nuance' },
  { id: 'fr4v143', de: 'tranché', en: ['clear-cut', 'categorical'], gloss: { de: ['eindeutig'], es: ['tajante'], it: ['netto'], pt: ['categórico'] }, pos: 'adj', level: 'B2', category: 'nuance' },
  { id: 'fr4v144', de: 'contraignant', en: ['restrictive', 'binding'], gloss: { de: ['einschränkend'], es: ['restrictivo'], it: ['vincolante'], pt: ['restritivo'] }, pos: 'adj', level: 'B2', category: 'nuance' },
  { id: 'fr4v145', de: 'incontournable', en: ['unavoidable', 'essential'], gloss: { de: ['unumgänglich'], es: ['ineludible'], it: ['imprescindibile'], pt: ['incontornável'] }, pos: 'adj', level: 'B2', category: 'nuance' },
  { id: 'fr4v146', de: 'ambigu', en: ['ambiguous'], gloss: { de: ['mehrdeutig'], es: ['ambiguo'], it: ['ambiguo'], pt: ['ambíguo'] }, pos: 'adj', level: 'B2', category: 'nuance' },
  { id: 'fr4v147', de: 'discutable', en: ['debatable', 'questionable'], gloss: { de: ['fragwürdig'], es: ['discutible'], it: ['discutibile'], pt: ['discutível'] }, pos: 'adj', level: 'B2', category: 'nuance' },
  { id: 'fr4v148', de: 'délibéré', en: ['deliberate', 'intentional'], gloss: { de: ['absichtlich'], es: ['deliberado'], it: ['deliberato'], pt: ['deliberado'] }, pos: 'adj', level: 'B2', category: 'nuance' },
  { id: 'fr4v149', de: 'sous-jacent', en: ['underlying'], gloss: { de: ['zugrunde liegend'], es: ['subyacente'], it: ['sottostante'], pt: ['subjacente'] }, pos: 'adj', level: 'B2', category: 'nuance' },
  { id: 'fr4v150', de: 'flagrant', en: ['blatant', 'glaring'], gloss: { de: ['offensichtlich'], es: ['flagrante'], it: ['flagrante'], pt: ['flagrante'] }, pos: 'adj', level: 'B2', category: 'nuance' },
];
