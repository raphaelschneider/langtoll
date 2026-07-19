import type { VocabItem } from '@/content/german/types';

// English B2 vocabulary. The `de` field holds the English text (see the note in
// content/german/types.ts — `de` is the "language being learned" slot regardless
// of pack). Nouns include the article ("the leverage") to mirror A1, A2 and B1.
//
// B2 is where the learner stops reporting and starts reasoning. It therefore
// avoids every headword A1 (greetings, numbers, food, places), A2 (routine,
// travel, shopping, health, weather) and B1 (opinion verbs, work basics,
// society, media basics, the environment, the common connectors) already teach.
// What is new here is abstraction and stance: hypotheses and hedging, cause and
// consequence, concession, the vocabulary of negotiation, law, economics,
// psychology, the ethics of technology and arts criticism — plus the phrasal
// verbs and fixed collocations that a B1 syllabus never reaches.
//
// As in the earlier packs this is the one case where `en` is degenerate: the
// reading side and the target side are the same language. `en` still carries the
// bare word (article stripped) plus a clarifier where a regional or sense
// variant exists, because the type contract guarantees it as the fallback for
// any locale `gloss` misses. An English-UI user is never offered English to
// learn, so it is not shown in practice.
//
// `gloss` therefore covers ALL five other UI locales — de / es / fr / it / pt.
//
// Regional line: unlike A1–B1's neutral-international choice, B2 commits to
// BRITISH English throughout — spelling (colour, realise, centre, subsidise,
// sceptical) and vocabulary (the pavement, the roadworks, the high street, the
// terraced house, redundancy, to get round to). The American variant is listed in
// `en` wherever one exists, so a correct answer is never marked wrong.
// Categories stay at 10 items so the multiple-choice generator always finds
// same-category distractors.

export const B2_VOCAB: VocabItem[] = [
  // ── work & negotiation ────────────────────────────────────────────────
  { id: 'en4v001', de: 'to negotiate', en: ['to negotiate'], gloss: { de: ['verhandeln'], es: ['negociar'], fr: ['négocier'], it: ['negoziare', 'trattare'], pt: ['negociar'] }, pos: 'verb', level: 'B2', category: 'negotiation' },
  { id: 'en4v002', de: 'the compromise', en: ['compromise', 'the middle ground'], gloss: { de: ['der Kompromiss'], es: ['el acuerdo mutuo', 'el término medio'], fr: ['le compromis'], it: ['il compromesso'], pt: ['o meio-termo', 'a concessão mútua'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'en4v003', de: 'the leverage', en: ['leverage', 'the bargaining power'], gloss: { de: ['die Verhandlungsmacht', 'der Hebel'], es: ['la ventaja negociadora', 'el poder de negociación'], fr: ['le levier', 'le moyen de pression'], it: ['il potere contrattuale', 'la leva'], pt: ['o poder de negociação'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'en4v004', de: 'the concession', en: ['concession'], gloss: { de: ['das Zugeständnis'], es: ['la concesión'], fr: ['la concession'], it: ['la concessione'], pt: ['a concessão'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'en4v005', de: 'the stakeholder', en: ['stakeholder', 'the interested party'], gloss: { de: ['der Interessenvertreter', 'der Beteiligte'], es: ['la parte interesada'], fr: ['la partie prenante'], it: ['la parte interessata'], pt: ['a parte interessada'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'en4v006', de: 'to delegate', en: ['to delegate'], gloss: { de: ['delegieren'], es: ['delegar'], fr: ['déléguer'], it: ['delegare'], pt: ['delegar'] }, pos: 'verb', level: 'B2', category: 'negotiation' },
  { id: 'en4v007', de: 'to undermine', en: ['to undermine'], gloss: { de: ['untergraben'], es: ['socavar', 'minar'], fr: ['saper', 'miner'], it: ['minare'], pt: ['minar', 'solapar'] }, pos: 'verb', level: 'B2', category: 'negotiation' },
  { id: 'en4v008', de: 'the appraisal', en: ['appraisal', 'the performance review'], gloss: { de: ['die Leistungsbeurteilung', 'das Mitarbeitergespräch'], es: ['la evaluación del desempeño'], fr: ['l’évaluation annuelle'], it: ['la valutazione del rendimento'], pt: ['a avaliação de desempenho'] }, pos: 'noun', level: 'B2', category: 'negotiation' },
  { id: 'en4v009', de: 'to outsource', en: ['to outsource'], gloss: { de: ['auslagern', 'outsourcen'], es: ['subcontratar', 'externalizar'], fr: ['externaliser', 'sous-traiter'], it: ['esternalizzare'], pt: ['terceirizar', 'subcontratar'] }, pos: 'verb', level: 'B2', category: 'negotiation' },
  { id: 'en4v010', de: 'the redundancy', en: ['redundancy', 'the layoff'], gloss: { de: ['die betriebsbedingte Kündigung'], es: ['el despido por reducción de plantilla'], fr: ['le licenciement économique'], it: ['il licenziamento per esubero'], pt: ['o despedimento por redundância'] }, pos: 'noun', level: 'B2', category: 'negotiation' },

  // ── media & information ───────────────────────────────────────────────
  { id: 'en4v011', de: 'the coverage', en: ['coverage'], gloss: { de: ['die Berichterstattung'], es: ['la cobertura'], fr: ['la couverture médiatique'], it: ['la copertura mediatica'], pt: ['a cobertura'] }, pos: 'noun', level: 'B2', category: 'information' },
  { id: 'en4v012', de: 'the bias', en: ['bias'], gloss: { de: ['die Voreingenommenheit', 'die Befangenheit'], es: ['el sesgo'], fr: ['le parti pris', 'le biais'], it: ['il pregiudizio', 'la parzialità'], pt: ['o viés', 'a parcialidade'] }, pos: 'noun', level: 'B2', category: 'information' },
  { id: 'en4v013', de: 'the scrutiny', en: ['scrutiny', 'the close examination'], gloss: { de: ['die genaue Prüfung'], es: ['el escrutinio', 'el examen minucioso'], fr: ['l’examen minutieux'], it: ['l’esame attento'], pt: ['o escrutínio', 'o exame minucioso'] }, pos: 'noun', level: 'B2', category: 'information' },
  { id: 'en4v014', de: 'the disclaimer', en: ['disclaimer'], gloss: { de: ['der Haftungsausschluss'], es: ['el descargo de responsabilidad'], fr: ['la clause de non-responsabilité'], it: ['la clausola di esclusione di responsabilità'], pt: ['o aviso legal'] }, pos: 'noun', level: 'B2', category: 'information' },
  { id: 'en4v015', de: 'to allege', en: ['to allege'], gloss: { de: ['behaupten', 'unterstellen'], es: ['alegar'], fr: ['alléguer', 'prétendre'], it: ['sostenere', 'affermare'], pt: ['alegar'] }, pos: 'verb', level: 'B2', category: 'information' },
  { id: 'en4v016', de: 'to retract', en: ['to retract'], gloss: { de: ['zurückziehen', 'widerrufen'], es: ['retractarse de'], fr: ['rétracter'], it: ['ritrattare'], pt: ['retratar-se de'] }, pos: 'verb', level: 'B2', category: 'information' },
  { id: 'en4v017', de: 'the outlet', en: ['outlet', 'the media organisation'], gloss: { de: ['das Presseorgan', 'das Medium'], es: ['el medio de comunicación'], fr: ['l’organe de presse'], it: ['la testata'], pt: ['o veículo de comunicação'] }, pos: 'noun', level: 'B2', category: 'information' },
  { id: 'en4v018', de: 'the hearsay', en: ['hearsay'], gloss: { de: ['das Hörensagen'], es: ['los rumores', 'lo que se oye decir'], fr: ['les ouï-dire'], it: ['il sentito dire'], pt: ['o boato', 'o ouvir dizer'] }, pos: 'noun', level: 'B2', category: 'information' },
  { id: 'en4v019', de: 'the narrative', en: ['narrative'], gloss: { de: ['das Narrativ', 'die Darstellung'], es: ['la narrativa', 'el relato'], fr: ['le récit'], it: ['la narrazione'], pt: ['a narrativa'] }, pos: 'noun', level: 'B2', category: 'information' },
  { id: 'en4v020', de: 'to corroborate', en: ['to corroborate'], gloss: { de: ['bestätigen', 'erhärten'], es: ['corroborar'], fr: ['corroborer'], it: ['corroborare'], pt: ['corroborar'] }, pos: 'verb', level: 'B2', category: 'information' },

  // ── science & the environment ─────────────────────────────────────────
  { id: 'en4v021', de: 'the hypothesis', en: ['hypothesis'], gloss: { de: ['die Hypothese'], es: ['la hipótesis'], fr: ['l’hypothèse'], it: ['l’ipotesi'], pt: ['a hipótese'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'en4v022', de: 'the correlation', en: ['correlation'], gloss: { de: ['die Korrelation', 'der Zusammenhang'], es: ['la correlación'], fr: ['la corrélation'], it: ['la correlazione'], pt: ['a correlação'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'en4v023', de: 'the drawback', en: ['drawback', 'the downside'], gloss: { de: ['der Nachteil'], es: ['el inconveniente'], fr: ['l’inconvénient'], it: ['lo svantaggio'], pt: ['o inconveniente', 'a desvantagem'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'en4v024', de: 'the threshold', en: ['threshold'], gloss: { de: ['die Schwelle', 'der Grenzwert'], es: ['el umbral'], fr: ['le seuil'], it: ['la soglia'], pt: ['o limiar'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'en4v025', de: 'to offset', en: ['to offset', 'to compensate for'], gloss: { de: ['ausgleichen', 'kompensieren'], es: ['compensar'], fr: ['compenser'], it: ['compensare'], pt: ['compensar'] }, pos: 'verb', level: 'B2', category: 'science' },
  { id: 'en4v026', de: 'to mitigate', en: ['to mitigate'], gloss: { de: ['abmildern', 'abschwächen'], es: ['mitigar'], fr: ['atténuer'], it: ['mitigare'], pt: ['mitigar'] }, pos: 'verb', level: 'B2', category: 'science' },
  { id: 'en4v027', de: 'the depletion', en: ['depletion'], gloss: { de: ['die Erschöpfung der Ressourcen'], es: ['el agotamiento'], fr: ['l’épuisement'], it: ['l’esaurimento'], pt: ['o esgotamento'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'en4v028', de: 'the breakthrough', en: ['breakthrough'], gloss: { de: ['der Durchbruch'], es: ['el avance decisivo'], fr: ['la percée'], it: ['la svolta decisiva'], pt: ['o avanço decisivo'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'en4v029', de: 'the constraint', en: ['constraint', 'the limitation'], gloss: { de: ['die Einschränkung', 'der Zwang'], es: ['la restricción'], fr: ['la contrainte'], it: ['il vincolo'], pt: ['a restrição'] }, pos: 'noun', level: 'B2', category: 'science' },
  { id: 'en4v030', de: 'to yield', en: ['to yield', 'to produce'], gloss: { de: ['ergeben', 'hervorbringen'], es: ['arrojar', 'producir'], fr: ['donner', 'produire'], it: ['dare', 'produrre'], pt: ['render', 'produzir'] }, pos: 'verb', level: 'B2', category: 'science' },

  // ── culture & identity ────────────────────────────────────────────────
  { id: 'en4v031', de: 'the heritage', en: ['heritage'], gloss: { de: ['das Erbe'], es: ['el patrimonio'], fr: ['le patrimoine'], it: ['il patrimonio'], pt: ['o património'] }, pos: 'noun', level: 'B2', category: 'identity' },
  { id: 'en4v032', de: 'the upbringing', en: ['upbringing'], gloss: { de: ['die Erziehung'], es: ['la crianza'], fr: ['l’éducation'], it: ['l’educazione ricevuta'], pt: ['a criação'] }, pos: 'noun', level: 'B2', category: 'identity' },
  { id: 'en4v033', de: 'the stereotype', en: ['stereotype'], gloss: { de: ['das Klischee', 'das Stereotyp'], es: ['el estereotipo'], fr: ['le stéréotype'], it: ['lo stereotipo'], pt: ['o estereótipo'] }, pos: 'noun', level: 'B2', category: 'identity' },
  { id: 'en4v034', de: 'the sense of belonging', en: ['sense of belonging'], gloss: { de: ['das Zugehörigkeitsgefühl'], es: ['el sentido de pertenencia'], fr: ['le sentiment d’appartenance'], it: ['il senso di appartenenza'], pt: ['o sentimento de pertença'] }, pos: 'noun', level: 'B2', category: 'identity' },
  { id: 'en4v035', de: 'to assimilate', en: ['to assimilate'], gloss: { de: ['sich anpassen', 'assimilieren'], es: ['asimilarse'], fr: ['s’assimiler'], it: ['assimilarsi'], pt: ['assimilar-se'] }, pos: 'verb', level: 'B2', category: 'identity' },
  { id: 'en4v036', de: 'the mother tongue', en: ['mother tongue', 'the native language'], gloss: { de: ['die Muttersprache'], es: ['la lengua materna'], fr: ['la langue maternelle'], it: ['la lingua madre'], pt: ['a língua materna'] }, pos: 'noun', level: 'B2', category: 'identity' },
  { id: 'en4v037', de: 'the custom', en: ['custom'], gloss: { de: ['der Brauch'], es: ['la costumbre'], fr: ['la coutume'], it: ['l’usanza'], pt: ['o costume'] }, pos: 'noun', level: 'B2', category: 'identity' },
  { id: 'en4v038', de: 'multicultural', en: ['multicultural'], gloss: { de: ['multikulturell'], es: ['multicultural'], fr: ['multiculturel'], it: ['multiculturale'], pt: ['multicultural'] }, pos: 'adj', level: 'B2', category: 'identity' },
  { id: 'en4v039', de: 'the diaspora', en: ['diaspora'], gloss: { de: ['die Diaspora'], es: ['la diáspora'], fr: ['la diaspora'], it: ['la diaspora'], pt: ['a diáspora'] }, pos: 'noun', level: 'B2', category: 'identity' },
  { id: 'en4v040', de: 'to embrace', en: ['to embrace', 'to take on wholeheartedly'], gloss: { de: ['annehmen', 'sich zu eigen machen'], es: ['abrazar', 'adoptar'], fr: ['adopter', 'embrasser'], it: ['abbracciare', 'adottare'], pt: ['abraçar', 'adotar'] }, pos: 'verb', level: 'B2', category: 'identity' },

  // ── law & rights ──────────────────────────────────────────────────────
  { id: 'en4v041', de: 'the trial', en: ['trial'], gloss: { de: ['der Prozess'], es: ['el juicio'], fr: ['le procès'], it: ['il processo'], pt: ['o julgamento'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'en4v042', de: 'the verdict', en: ['verdict'], gloss: { de: ['das Urteil'], es: ['el veredicto'], fr: ['le verdict'], it: ['il verdetto'], pt: ['o veredicto'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'en4v043', de: 'the testimony', en: ['testimony'], gloss: { de: ['die Zeugenaussage'], es: ['el testimonio'], fr: ['le témoignage'], it: ['la testimonianza'], pt: ['o testemunho'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'en4v044', de: 'the liability', en: ['liability', 'the legal responsibility'], gloss: { de: ['die Haftung'], es: ['la responsabilidad legal'], fr: ['la responsabilité juridique'], it: ['la responsabilità civile'], pt: ['a responsabilidade legal'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'en4v045', de: 'the defendant', en: ['defendant', 'the accused'], gloss: { de: ['der Angeklagte'], es: ['el acusado'], fr: ['l’accusé'], it: ['l’imputato'], pt: ['o réu'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'en4v046', de: 'to enforce', en: ['to enforce'], gloss: { de: ['durchsetzen'], es: ['hacer cumplir'], fr: ['faire respecter', 'appliquer'], it: ['far rispettare'], pt: ['fazer cumprir'] }, pos: 'verb', level: 'B2', category: 'law' },
  { id: 'en4v047', de: 'to appeal', en: ['to appeal', 'to lodge an appeal'], gloss: { de: ['Berufung einlegen'], es: ['apelar', 'recurrir'], fr: ['faire appel'], it: ['fare ricorso'], pt: ['recorrer'] }, pos: 'verb', level: 'B2', category: 'law' },
  { id: 'en4v048', de: 'the loophole', en: ['loophole'], gloss: { de: ['das Schlupfloch'], es: ['el vacío legal'], fr: ['le vide juridique'], it: ['la scappatoia'], pt: ['a lacuna legal'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'en4v049', de: 'the consent', en: ['consent'], gloss: { de: ['die Einwilligung', 'die Zustimmung'], es: ['el consentimiento'], fr: ['le consentement'], it: ['il consenso'], pt: ['o consentimento'] }, pos: 'noun', level: 'B2', category: 'law' },
  { id: 'en4v050', de: 'the entitlement', en: ['entitlement'], gloss: { de: ['der Anspruch'], es: ['el derecho adquirido'], fr: ['le droit acquis'], it: ['il diritto acquisito'], pt: ['o direito adquirido'] }, pos: 'noun', level: 'B2', category: 'law' },

  // ── economics ─────────────────────────────────────────────────────────
  { id: 'en4v051', de: 'the inflation', en: ['inflation'], gloss: { de: ['die Inflation'], es: ['la inflación'], fr: ['l’inflation'], it: ['l’inflazione'], pt: ['a inflação'] }, pos: 'noun', level: 'B2', category: 'economics' },
  { id: 'en4v052', de: 'the deficit', en: ['deficit'], gloss: { de: ['das Defizit'], es: ['el déficit'], fr: ['le déficit'], it: ['il disavanzo'], pt: ['o défice', 'o déficit'] }, pos: 'noun', level: 'B2', category: 'economics' },
  { id: 'en4v053', de: 'the surplus', en: ['surplus'], gloss: { de: ['der Überschuss'], es: ['el excedente'], fr: ['l’excédent'], it: ['l’eccedenza'], pt: ['o excedente'] }, pos: 'noun', level: 'B2', category: 'economics' },
  { id: 'en4v054', de: 'the supply chain', en: ['supply chain'], gloss: { de: ['die Lieferkette'], es: ['la cadena de suministro'], fr: ['la chaîne d’approvisionnement'], it: ['la catena di fornitura'], pt: ['a cadeia de fornecimento'] }, pos: 'noun', level: 'B2', category: 'economics' },
  { id: 'en4v055', de: 'the recession', en: ['recession'], gloss: { de: ['die Rezession'], es: ['la recesión'], fr: ['la récession'], it: ['la recessione'], pt: ['a recessão'] }, pos: 'noun', level: 'B2', category: 'economics' },
  { id: 'en4v056', de: 'the turnover', en: ['turnover', 'the revenue'], gloss: { de: ['der Umsatz'], es: ['la facturación'], fr: ['le chiffre d’affaires'], it: ['il fatturato'], pt: ['o volume de negócios'] }, pos: 'noun', level: 'B2', category: 'economics' },
  { id: 'en4v057', de: 'to subsidise', en: ['to subsidise', 'to subsidize'], gloss: { de: ['subventionieren'], es: ['subvencionar'], fr: ['subventionner'], it: ['sovvenzionare'], pt: ['subsidiar'] }, pos: 'verb', level: 'B2', category: 'economics' },
  { id: 'en4v058', de: 'the incentive', en: ['incentive'], gloss: { de: ['der Anreiz'], es: ['el incentivo'], fr: ['l’incitation'], it: ['l’incentivo'], pt: ['o incentivo'] }, pos: 'noun', level: 'B2', category: 'economics' },
  { id: 'en4v059', de: 'the asset', en: ['asset'], gloss: { de: ['der Vermögenswert'], es: ['el activo'], fr: ['l’actif'], it: ['il bene patrimoniale'], pt: ['o ativo'] }, pos: 'noun', level: 'B2', category: 'economics' },
  { id: 'en4v060', de: 'to fluctuate', en: ['to fluctuate'], gloss: { de: ['schwanken'], es: ['fluctuar'], fr: ['fluctuer'], it: ['oscillare'], pt: ['flutuar', 'oscilar'] }, pos: 'verb', level: 'B2', category: 'economics' },

  // ── psychology ────────────────────────────────────────────────────────
  { id: 'en4v061', de: 'the resilience', en: ['resilience'], gloss: { de: ['die Widerstandsfähigkeit', 'die Resilienz'], es: ['la resiliencia'], fr: ['la résilience'], it: ['la resilienza'], pt: ['a resiliência'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'en4v062', de: 'the perception', en: ['perception'], gloss: { de: ['die Wahrnehmung'], es: ['la percepción'], fr: ['la perception'], it: ['la percezione'], pt: ['a percepção'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'en4v063', de: 'the grief', en: ['grief'], gloss: { de: ['die Trauer'], es: ['el duelo', 'la aflicción'], fr: ['le deuil', 'le chagrin'], it: ['il lutto', 'il dolore'], pt: ['o luto', 'a dor'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'en4v064', de: 'the coping mechanism', en: ['coping mechanism'], gloss: { de: ['die Bewältigungsstrategie'], es: ['el mecanismo de afrontamiento'], fr: ['le mécanisme d’adaptation'], it: ['il meccanismo di adattamento'], pt: ['o mecanismo de enfrentamento'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'en4v065', de: 'to cope with', en: ['to cope with'], gloss: { de: ['zurechtkommen mit'], es: ['hacer frente a'], fr: ['faire face à'], it: ['far fronte a'], pt: ['lidar com'] }, pos: 'verb', level: 'B2', category: 'psychology' },
  { id: 'en4v066', de: 'the mindset', en: ['mindset'], gloss: { de: ['die Denkweise'], es: ['la mentalidad'], fr: ['l’état d’esprit'], it: ['la mentalità'], pt: ['a mentalidade'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'en4v067', de: 'self-conscious', en: ['self-conscious'], gloss: { de: ['gehemmt', 'befangen'], es: ['cohibido'], fr: ['mal à l’aise', 'complexé'], it: ['a disagio', 'impacciato'], pt: ['inibido', 'constrangido'] }, pos: 'adj', level: 'B2', category: 'psychology' },
  { id: 'en4v068', de: 'the reluctance', en: ['reluctance'], gloss: { de: ['die Abneigung', 'das Zögern'], es: ['la reticencia'], fr: ['la réticence'], it: ['la riluttanza'], pt: ['a relutância'] }, pos: 'noun', level: 'B2', category: 'psychology' },
  { id: 'en4v069', de: 'to dwell on', en: ['to dwell on'], gloss: { de: ['grübeln über'], es: ['darle vueltas a'], fr: ['ressasser'], it: ['rimuginare su'], pt: ['remoer', 'ficar remoendo'] }, pos: 'verb', level: 'B2', category: 'psychology' },
  { id: 'en4v070', de: 'the empathy', en: ['empathy'], gloss: { de: ['das Einfühlungsvermögen', 'die Empathie'], es: ['la empatía'], fr: ['l’empathie'], it: ['l’empatia'], pt: ['a empatia'] }, pos: 'noun', level: 'B2', category: 'psychology' },

  // ── technology & ethics ───────────────────────────────────────────────
  { id: 'en4v071', de: 'the surveillance', en: ['surveillance'], gloss: { de: ['die Überwachung'], es: ['la vigilancia'], fr: ['la surveillance'], it: ['la sorveglianza'], pt: ['a vigilância'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'en4v072', de: 'the algorithm', en: ['algorithm'], gloss: { de: ['der Algorithmus'], es: ['el algoritmo'], fr: ['l’algorithme'], it: ['l’algoritmo'], pt: ['o algoritmo'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'en4v073', de: 'the privacy', en: ['privacy'], gloss: { de: ['die Privatsphäre'], es: ['la privacidad'], fr: ['la vie privée'], it: ['la riservatezza'], pt: ['a privacidade'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'en4v074', de: 'the accountability', en: ['accountability'], gloss: { de: ['die Rechenschaftspflicht'], es: ['la rendición de cuentas'], fr: ['la reddition de comptes'], it: ['la responsabilità di rendere conto'], pt: ['a prestação de contas'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'en4v075', de: 'the safeguard', en: ['safeguard'], gloss: { de: ['die Schutzmaßnahme'], es: ['la salvaguardia'], fr: ['la garantie', 'la sauvegarde'], it: ['la salvaguardia'], pt: ['a salvaguarda'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'en4v076', de: 'to automate', en: ['to automate'], gloss: { de: ['automatisieren'], es: ['automatizar'], fr: ['automatiser'], it: ['automatizzare'], pt: ['automatizar'] }, pos: 'verb', level: 'B2', category: 'technology' },
  { id: 'en4v077', de: 'the breach', en: ['breach'], gloss: { de: ['der Verstoß', 'die Sicherheitsverletzung'], es: ['la violación', 'la brecha'], fr: ['la violation', 'la faille'], it: ['la violazione'], pt: ['a violação', 'a brecha'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'en4v078', de: 'to opt out', en: ['to opt out'], gloss: { de: ['sich abmelden', 'nicht teilnehmen'], es: ['darse de baja', 'optar por no participar'], fr: ['se désinscrire', 'refuser de participer'], it: ['rinunciare', 'non aderire'], pt: ['optar por não participar'] }, pos: 'verb', level: 'B2', category: 'technology' },
  { id: 'en4v079', de: 'the trade-off', en: ['trade-off'], gloss: { de: ['die Abwägung', 'der Zielkonflikt'], es: ['la contrapartida'], fr: ['l’arbitrage', 'la contrepartie'], it: ['il compromesso fra due esigenze'], pt: ['a contrapartida'] }, pos: 'noun', level: 'B2', category: 'technology' },
  { id: 'en4v080', de: 'addictive', en: ['addictive'], gloss: { de: ['suchterzeugend'], es: ['adictivo'], fr: ['addictif'], it: ['che dà dipendenza'], pt: ['viciante'] }, pos: 'adj', level: 'B2', category: 'technology' },

  // ── urban life ────────────────────────────────────────────────────────
  { id: 'en4v081', de: 'the commute', en: ['commute', 'the daily journey to work'], gloss: { de: ['der Arbeitsweg'], es: ['el trayecto diario al trabajo'], fr: ['le trajet quotidien'], it: ['il tragitto casa-lavoro'], pt: ['o trajeto diário para o trabalho'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'en4v082', de: 'the congestion', en: ['congestion'], gloss: { de: ['die Verkehrsüberlastung'], es: ['la congestión'], fr: ['les embouteillages'], it: ['la congestione del traffico'], pt: ['o congestionamento'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'en4v083', de: 'the outskirts', en: ['outskirts'], gloss: { de: ['der Stadtrand'], es: ['las afueras'], fr: ['la périphérie'], it: ['la periferia'], pt: ['os arredores'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'en4v084', de: 'the roadworks', en: ['roadworks', 'the road construction'], gloss: { de: ['die Straßenbauarbeiten'], es: ['las obras en la carretera'], fr: ['les travaux routiers'], it: ['i lavori stradali'], pt: ['as obras na estrada'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'en4v085', de: 'the high street', en: ['high street', 'the main shopping street'], gloss: { de: ['die Haupteinkaufsstraße'], es: ['la calle principal'], fr: ['la rue commerçante principale'], it: ['la via principale dei negozi'], pt: ['a rua principal de comércio'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'en4v086', de: 'the pavement', en: ['pavement', 'the sidewalk'], gloss: { de: ['der Bürgersteig'], es: ['la acera'], fr: ['le trottoir'], it: ['il marciapiede'], pt: ['o passeio', 'a calçada'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'en4v087', de: 'the terraced house', en: ['terraced house', 'the row house'], gloss: { de: ['das Reihenhaus'], es: ['la casa adosada'], fr: ['la maison mitoyenne'], it: ['la casa a schiera'], pt: ['a casa geminada'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'en4v088', de: 'the tenant', en: ['tenant'], gloss: { de: ['der Mieter'], es: ['el inquilino'], fr: ['le locataire'], it: ['l’inquilino'], pt: ['o inquilino'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'en4v089', de: 'the landlord', en: ['landlord'], gloss: { de: ['der Vermieter'], es: ['el casero', 'el arrendador'], fr: ['le propriétaire'], it: ['il padrone di casa'], pt: ['o senhorio'] }, pos: 'noun', level: 'B2', category: 'urban' },
  { id: 'en4v090', de: 'the planning permission', en: ['planning permission', 'the building permit'], gloss: { de: ['die Baugenehmigung'], es: ['la licencia de obras'], fr: ['le permis de construire'], it: ['il permesso di costruire'], pt: ['a licença de construção'] }, pos: 'noun', level: 'B2', category: 'urban' },

  // ── the arts & criticism ──────────────────────────────────────────────
  { id: 'en4v091', de: 'the review', en: ['review', 'the critique'], gloss: { de: ['die Rezension', 'die Kritik'], es: ['la crítica', 'la reseña'], fr: ['la critique'], it: ['la recensione'], pt: ['a crítica', 'a resenha'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'en4v092', de: 'the plot', en: ['plot', 'the storyline'], gloss: { de: ['die Handlung'], es: ['la trama'], fr: ['l’intrigue'], it: ['la trama'], pt: ['o enredo'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'en4v093', de: 'the portrayal', en: ['portrayal'], gloss: { de: ['die Darstellung'], es: ['la representación'], fr: ['la représentation'], it: ['la rappresentazione'], pt: ['a representação'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'en4v094', de: 'the masterpiece', en: ['masterpiece'], gloss: { de: ['das Meisterwerk'], es: ['la obra maestra'], fr: ['le chef-d’œuvre'], it: ['il capolavoro'], pt: ['a obra-prima'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'en4v095', de: 'the imagery', en: ['imagery'], gloss: { de: ['die Bildsprache'], es: ['las imágenes'], fr: ['les images'], it: ['le immagini'], pt: ['as imagens'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'en4v096', de: 'overrated', en: ['overrated'], gloss: { de: ['überbewertet'], es: ['sobrevalorado'], fr: ['surestimé'], it: ['sopravvalutato'], pt: ['superestimado'] }, pos: 'adj', level: 'B2', category: 'arts' },
  { id: 'en4v097', de: 'compelling', en: ['compelling', 'gripping'], gloss: { de: ['fesselnd'], es: ['cautivador'], fr: ['captivant'], it: ['avvincente'], pt: ['cativante'] }, pos: 'adj', level: 'B2', category: 'arts' },
  { id: 'en4v098', de: 'the acclaim', en: ['acclaim'], gloss: { de: ['die Anerkennung', 'das Lob'], es: ['la aclamación', 'los elogios'], fr: ['les éloges'], it: ['il plauso'], pt: ['a aclamação', 'os elogios'] }, pos: 'noun', level: 'B2', category: 'arts' },
  { id: 'en4v099', de: 'to depict', en: ['to depict'], gloss: { de: ['darstellen', 'schildern'], es: ['representar', 'retratar'], fr: ['dépeindre'], it: ['raffigurare'], pt: ['retratar'] }, pos: 'verb', level: 'B2', category: 'arts' },
  { id: 'en4v100', de: 'the nuance', en: ['nuance'], gloss: { de: ['die Nuance'], es: ['el matiz'], fr: ['la nuance'], it: ['la sfumatura'], pt: ['a nuance', 'o matiz'] }, pos: 'noun', level: 'B2', category: 'arts' },

  // ── connectors of argument ────────────────────────────────────────────
  { id: 'en4v101', de: 'albeit', en: ['albeit'], gloss: { de: ['wenn auch'], es: ['si bien', 'aunque'], fr: ['quoique'], it: ['sebbene'], pt: ['ainda que'] }, pos: 'conj', level: 'B2', category: 'argument' },
  { id: 'en4v102', de: 'notwithstanding', en: ['notwithstanding'], gloss: { de: ['ungeachtet'], es: ['a pesar de', 'no obstante'], fr: ['nonobstant'], it: ['nonostante'], pt: ['não obstante'] }, pos: 'prep', level: 'B2', category: 'argument' },
  { id: 'en4v103', de: 'insofar as', en: ['insofar as'], gloss: { de: ['insofern als'], es: ['en la medida en que'], fr: ['dans la mesure où'], it: ['nella misura in cui'], pt: ['na medida em que'] }, pos: 'conj', level: 'B2', category: 'argument' },
  { id: 'en4v104', de: 'provided that', en: ['provided that', 'as long as'], gloss: { de: ['vorausgesetzt, dass'], es: ['siempre que'], fr: ['à condition que'], it: ['a condizione che'], pt: ['desde que'] }, pos: 'conj', level: 'B2', category: 'argument' },
  { id: 'en4v105', de: 'hence', en: ['hence'], gloss: { de: ['daher', 'folglich'], es: ['de ahí', 'por consiguiente'], fr: ['d’où', 'par conséquent'], it: ['di conseguenza'], pt: ['daí', 'por conseguinte'] }, pos: 'adv', level: 'B2', category: 'argument' },
  { id: 'en4v106', de: 'conversely', en: ['conversely'], gloss: { de: ['umgekehrt'], es: ['a la inversa'], fr: ['inversement'], it: ['viceversa'], pt: ['inversamente'] }, pos: 'adv', level: 'B2', category: 'argument' },
  { id: 'en4v107', de: 'thereby', en: ['thereby'], gloss: { de: ['dadurch'], es: ['de ese modo'], fr: ['de ce fait'], it: ['in tal modo'], pt: ['desse modo'] }, pos: 'adv', level: 'B2', category: 'argument' },
  { id: 'en4v108', de: 'with regard to', en: ['with regard to', 'as regards'], gloss: { de: ['in Bezug auf'], es: ['con respecto a'], fr: ['en ce qui concerne'], it: ['per quanto riguarda'], pt: ['no que diz respeito a'] }, pos: 'prep', level: 'B2', category: 'argument' },
  { id: 'en4v109', de: 'to that end', en: ['to that end'], gloss: { de: ['zu diesem Zweck'], es: ['con ese fin'], fr: ['à cette fin'], it: ['a tal fine'], pt: ['para esse fim'] }, pos: 'phrase', level: 'B2', category: 'argument' },
  { id: 'en4v110', de: 'by and large', en: ['by and large', 'on the whole'], gloss: { de: ['im Großen und Ganzen'], es: ['en términos generales'], fr: ['dans l’ensemble'], it: ['nel complesso'], pt: ['de um modo geral'] }, pos: 'phrase', level: 'B2', category: 'argument' },

  // ── hedging & register ────────────────────────────────────────────────
  { id: 'en4v111', de: 'arguably', en: ['arguably'], gloss: { de: ['wohl', 'man könnte sagen'], es: ['posiblemente', 'se podría decir'], fr: ['sans doute', 'on pourrait dire'], it: ['probabilmente', 'si potrebbe dire'], pt: ['possivelmente', 'talvez se possa dizer'] }, pos: 'adv', level: 'B2', category: 'register' },
  { id: 'en4v112', de: 'presumably', en: ['presumably'], gloss: { de: ['vermutlich'], es: ['presumiblemente'], fr: ['vraisemblablement'], it: ['presumibilmente'], pt: ['presumivelmente'] }, pos: 'adv', level: 'B2', category: 'register' },
  { id: 'en4v113', de: 'to some extent', en: ['to some extent'], gloss: { de: ['bis zu einem gewissen Grad'], es: ['hasta cierto punto'], fr: ['dans une certaine mesure'], it: ['in una certa misura'], pt: ['até certo ponto'] }, pos: 'phrase', level: 'B2', category: 'register' },
  { id: 'en4v114', de: 'I take your point', en: ['I take your point'], gloss: { de: ['Ich verstehe, was Sie meinen'], es: ['Entiendo lo que dices'], fr: ['Je comprends votre point de vue'], it: ['Capisco il tuo punto di vista'], pt: ['Entendo o seu ponto de vista'] }, pos: 'phrase', level: 'B2', category: 'register' },
  { id: 'en4v115', de: 'with all due respect', en: ['with all due respect'], gloss: { de: ['bei allem Respekt'], es: ['con todo respeto'], fr: ['avec tout le respect que je vous dois'], it: ['con tutto il rispetto'], pt: ['com todo o respeito'] }, pos: 'phrase', level: 'B2', category: 'register' },
  { id: 'en4v116', de: 'to be inclined to', en: ['to be inclined to'], gloss: { de: ['dazu neigen'], es: ['inclinarse a', 'ser propenso a'], fr: ['être enclin à'], it: ['essere propenso a'], pt: ['ser inclinado a', 'tender a'] }, pos: 'phrase', level: 'B2', category: 'register' },
  { id: 'en4v117', de: 'it strikes me that', en: ['it strikes me that'], gloss: { de: ['mir fällt auf, dass'], es: ['me llama la atención que'], fr: ['il me semble que'], it: ['mi colpisce il fatto che'], pt: ['chama-me a atenção que'] }, pos: 'phrase', level: 'B2', category: 'register' },
  { id: 'en4v118', de: 'to put it bluntly', en: ['to put it bluntly'], gloss: { de: ['um es deutlich zu sagen'], es: ['para decirlo sin rodeos'], fr: ['pour parler franchement'], it: ['per dirla senza giri di parole'], pt: ['para dizer sem rodeios'] }, pos: 'phrase', level: 'B2', category: 'register' },
  { id: 'en4v119', de: 'to concede', en: ['to concede'], gloss: { de: ['einräumen', 'zugestehen'], es: ['conceder', 'reconocer'], fr: ['concéder'], it: ['concedere'], pt: ['conceder'] }, pos: 'verb', level: 'B2', category: 'register' },
  { id: 'en4v120', de: 'to bear in mind', en: ['to bear in mind'], gloss: { de: ['bedenken', 'berücksichtigen'], es: ['tener en cuenta'], fr: ['garder à l’esprit'], it: ['tenere presente'], pt: ['ter em conta'] }, pos: 'phrase', level: 'B2', category: 'register' },

  // ── phrasal verbs ─────────────────────────────────────────────────────
  { id: 'en4v121', de: 'to put up with', en: ['to put up with'], gloss: { de: ['ertragen', 'sich abfinden mit'], es: ['aguantar', 'soportar'], fr: ['supporter'], it: ['sopportare'], pt: ['aturar', 'suportar'] }, pos: 'verb', level: 'B2', category: 'phrasal' },
  { id: 'en4v122', de: 'to come across as', en: ['to come across as'], gloss: { de: ['wirken wie'], es: ['dar la impresión de'], fr: ['donner l’impression d’être'], it: ['dare l’impressione di'], pt: ['dar a impressão de'] }, pos: 'verb', level: 'B2', category: 'phrasal' },
  { id: 'en4v123', de: 'to back down', en: ['to back down'], gloss: { de: ['nachgeben', 'einen Rückzieher machen'], es: ['echarse atrás'], fr: ['faire marche arrière'], it: ['fare marcia indietro'], pt: ['recuar', 'voltar atrás'] }, pos: 'verb', level: 'B2', category: 'phrasal' },
  { id: 'en4v124', de: 'to bring about', en: ['to bring about'], gloss: { de: ['herbeiführen', 'bewirken'], es: ['provocar', 'ocasionar'], fr: ['provoquer', 'entraîner'], it: ['provocare', 'causare'], pt: ['provocar', 'ocasionar'] }, pos: 'verb', level: 'B2', category: 'phrasal' },
  { id: 'en4v125', de: 'to carry out', en: ['to carry out'], gloss: { de: ['durchführen'], es: ['llevar a cabo'], fr: ['mener à bien', 'effectuer'], it: ['svolgere', 'effettuare'], pt: ['levar a cabo', 'realizar'] }, pos: 'verb', level: 'B2', category: 'phrasal' },
  { id: 'en4v126', de: 'to rule out', en: ['to rule out'], gloss: { de: ['ausschließen'], es: ['descartar'], fr: ['exclure', 'écarter'], it: ['escludere'], pt: ['descartar', 'excluir'] }, pos: 'verb', level: 'B2', category: 'phrasal' },
  { id: 'en4v127', de: 'to look into', en: ['to look into'], gloss: { de: ['untersuchen', 'prüfen'], es: ['investigar'], fr: ['se pencher sur', 'examiner'], it: ['esaminare', 'indagare su'], pt: ['investigar', 'analisar'] }, pos: 'verb', level: 'B2', category: 'phrasal' },
  { id: 'en4v128', de: 'to fall through', en: ['to fall through'], gloss: { de: ['scheitern', 'ins Wasser fallen'], es: ['venirse abajo', 'fracasar'], fr: ['tomber à l’eau'], it: ['andare a monte'], pt: ['ir por água abaixo', 'fracassar'] }, pos: 'verb', level: 'B2', category: 'phrasal' },
  { id: 'en4v129', de: 'to sort out', en: ['to sort out'], gloss: { de: ['klären', 'in Ordnung bringen'], es: ['resolver', 'arreglar'], fr: ['régler'], it: ['sistemare', 'risolvere'], pt: ['resolver', 'arranjar'] }, pos: 'verb', level: 'B2', category: 'phrasal' },
  { id: 'en4v130', de: 'to get round to', en: ['to get round to', 'to get around to'], gloss: { de: ['endlich dazu kommen'], es: ['encontrar el momento para'], fr: ['trouver le temps de'], it: ['trovare il tempo di'], pt: ['arranjar tempo para'] }, pos: 'verb', level: 'B2', category: 'phrasal' },

  // ── collocations ──────────────────────────────────────────────────────
  { id: 'en4v131', de: 'to reach a consensus', en: ['to reach a consensus'], gloss: { de: ['einen Konsens erzielen'], es: ['llegar a un consenso'], fr: ['parvenir à un consensus'], it: ['raggiungere un consenso'], pt: ['chegar a um consenso'] }, pos: 'phrase', level: 'B2', category: 'collocations' },
  { id: 'en4v132', de: 'to draw a conclusion', en: ['to draw a conclusion'], gloss: { de: ['eine Schlussfolgerung ziehen'], es: ['sacar una conclusión'], fr: ['tirer une conclusion'], it: ['trarre una conclusione'], pt: ['tirar uma conclusão'] }, pos: 'phrase', level: 'B2', category: 'collocations' },
  { id: 'en4v133', de: 'to raise an objection', en: ['to raise an objection'], gloss: { de: ['einen Einwand erheben'], es: ['plantear una objeción'], fr: ['soulever une objection'], it: ['sollevare un’obiezione'], pt: ['levantar uma objeção'] }, pos: 'phrase', level: 'B2', category: 'collocations' },
  { id: 'en4v134', de: 'to take something for granted', en: ['to take something for granted'], gloss: { de: ['etwas für selbstverständlich halten'], es: ['dar algo por sentado'], fr: ['considérer quelque chose comme acquis'], it: ['dare qualcosa per scontato'], pt: ['dar algo como garantido'] }, pos: 'phrase', level: 'B2', category: 'collocations' },
  { id: 'en4v135', de: 'to bear the brunt', en: ['to bear the brunt'], gloss: { de: ['die Hauptlast tragen'], es: ['llevar la peor parte'], fr: ['subir le plus gros'], it: ['subire il peso maggiore'], pt: ['levar a pior parte'] }, pos: 'phrase', level: 'B2', category: 'collocations' },
  { id: 'en4v136', de: 'to set a precedent', en: ['to set a precedent'], gloss: { de: ['einen Präzedenzfall schaffen'], es: ['sentar un precedente'], fr: ['créer un précédent'], it: ['creare un precedente'], pt: ['abrir um precedente'] }, pos: 'phrase', level: 'B2', category: 'collocations' },
  { id: 'en4v137', de: 'to strike a balance', en: ['to strike a balance'], gloss: { de: ['ein Gleichgewicht finden'], es: ['encontrar un equilibrio'], fr: ['trouver un équilibre'], it: ['trovare un equilibrio'], pt: ['encontrar um equilíbrio'] }, pos: 'phrase', level: 'B2', category: 'collocations' },
  { id: 'en4v138', de: 'to meet a requirement', en: ['to meet a requirement'], gloss: { de: ['eine Anforderung erfüllen'], es: ['cumplir un requisito'], fr: ['satisfaire à une exigence'], it: ['soddisfare un requisito'], pt: ['cumprir um requisito'] }, pos: 'phrase', level: 'B2', category: 'collocations' },
  { id: 'en4v139', de: 'to pose a threat', en: ['to pose a threat'], gloss: { de: ['eine Bedrohung darstellen'], es: ['suponer una amenaza'], fr: ['représenter une menace'], it: ['rappresentare una minaccia'], pt: ['representar uma ameaça'] }, pos: 'phrase', level: 'B2', category: 'collocations' },
  { id: 'en4v140', de: 'to gain traction', en: ['to gain traction'], gloss: { de: ['an Zugkraft gewinnen'], es: ['ganar terreno'], fr: ['gagner du terrain'], it: ['prendere piede'], pt: ['ganhar terreno'] }, pos: 'phrase', level: 'B2', category: 'collocations' },

  // ── adjectives of judgement ───────────────────────────────────────────
  { id: 'en4v141', de: 'ambiguous', en: ['ambiguous'], gloss: { de: ['mehrdeutig'], es: ['ambiguo'], fr: ['ambigu'], it: ['ambiguo'], pt: ['ambíguo'] }, pos: 'adj', level: 'B2', category: 'judgement' },
  { id: 'en4v142', de: 'plausible', en: ['plausible'], gloss: { de: ['plausibel'], es: ['plausible', 'verosímil'], fr: ['plausible'], it: ['plausibile'], pt: ['plausível'] }, pos: 'adj', level: 'B2', category: 'judgement' },
  { id: 'en4v143', de: 'inevitable', en: ['inevitable'], gloss: { de: ['unvermeidlich'], es: ['inevitable'], fr: ['inévitable'], it: ['inevitabile'], pt: ['inevitável'] }, pos: 'adj', level: 'B2', category: 'judgement' },
  { id: 'en4v144', de: 'contentious', en: ['contentious', 'controversial'], gloss: { de: ['umstritten'], es: ['polémico'], fr: ['controversé'], it: ['controverso'], pt: ['controverso'] }, pos: 'adj', level: 'B2', category: 'judgement' },
  { id: 'en4v145', de: 'thorough', en: ['thorough'], gloss: { de: ['gründlich'], es: ['minucioso', 'exhaustivo'], fr: ['minutieux', 'approfondi'], it: ['accurato', 'approfondito'], pt: ['minucioso', 'exaustivo'] }, pos: 'adj', level: 'B2', category: 'judgement' },
  { id: 'en4v146', de: 'redundant', en: ['redundant', 'superfluous'], gloss: { de: ['überflüssig'], es: ['superfluo', 'redundante'], fr: ['superflu', 'redondant'], it: ['superfluo', 'ridondante'], pt: ['supérfluo', 'redundante'] }, pos: 'adj', level: 'B2', category: 'judgement' },
  { id: 'en4v147', de: 'feasible', en: ['feasible', 'workable'], gloss: { de: ['machbar', 'durchführbar'], es: ['factible', 'viable'], fr: ['faisable', 'réalisable'], it: ['fattibile'], pt: ['viável', 'exequível'] }, pos: 'adj', level: 'B2', category: 'judgement' },
  { id: 'en4v148', de: 'detrimental', en: ['detrimental', 'harmful'], gloss: { de: ['schädlich', 'nachteilig'], es: ['perjudicial'], fr: ['préjudiciable', 'néfaste'], it: ['dannoso'], pt: ['prejudicial'] }, pos: 'adj', level: 'B2', category: 'judgement' },
  { id: 'en4v149', de: 'sceptical', en: ['sceptical', 'skeptical'], gloss: { de: ['skeptisch'], es: ['escéptico'], fr: ['sceptique'], it: ['scettico'], pt: ['céptico', 'cético'] }, pos: 'adj', level: 'B2', category: 'judgement' },
  { id: 'en4v150', de: 'far-fetched', en: ['far-fetched'], gloss: { de: ['weit hergeholt'], es: ['inverosímil', 'traído por los pelos'], fr: ['tiré par les cheveux'], it: ['inverosimile'], pt: ['inverosímil', 'forçado'] }, pos: 'adj', level: 'B2', category: 'judgement' },
];
