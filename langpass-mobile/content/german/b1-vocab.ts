import type { VocabItem } from './types';

// German B1 vocabulary. Opinions, work life, society, environment, abstract
// verbs, connectors — the language of actual conversations.

export const B1_VOCAB: VocabItem[] = [
  // ── opinions & discussion ─────────────────────────────────────────────
  { id: 'b1v001', de: 'die Meinung', en: ['the opinion'], gloss: { es: ['la opinión'], fr: ['l’opinion'], it: ['l’opinione'], pt: ['a opinião'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'b1v002', de: 'der Vorschlag', en: ['the suggestion', 'the proposal'], gloss: { es: ['la propuesta', 'la sugerencia'], fr: ['la proposition', 'la suggestion'], it: ['la proposta', 'il suggerimento'], pt: ['a proposta', 'a sugestão'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'b1v003', de: 'der Vorteil', en: ['the advantage'], gloss: { es: ['la ventaja'], fr: ['l’avantage'], it: ['il vantaggio'], pt: ['a vantagem'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'b1v004', de: 'der Nachteil', en: ['the disadvantage'], gloss: { es: ['la desventaja'], fr: ['l’inconvénient'], it: ['lo svantaggio'], pt: ['a desvantagem'] }, pos: 'noun', level: 'B1', category: 'opinion' },
  { id: 'b1v005', de: 'zustimmen', en: ['to agree'], gloss: { es: ['estar de acuerdo'], fr: ['être d’accord'], it: ['essere d’accordo'], pt: ['concordar'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'b1v006', de: 'widersprechen', en: ['to contradict', 'to disagree'], gloss: { es: ['contradecir', 'llevar la contraria'], fr: ['contredire', 'ne pas être d’accord'], it: ['contraddire', 'dissentire'], pt: ['contradizer', 'discordar'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'b1v007', de: 'überzeugen', en: ['to convince'], gloss: { es: ['convencer'], fr: ['convaincre'], it: ['convincere'], pt: ['convencer'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'b1v008', de: 'behaupten', en: ['to claim'], gloss: { es: ['afirmar'], fr: ['affirmer'], it: ['affermare'], pt: ['afirmar'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'b1v009', de: 'begründen', en: ['to justify', 'to give reasons'], gloss: { es: ['justificar', 'fundamentar'], fr: ['justifier', 'motiver'], it: ['giustificare', 'motivare'], pt: ['justificar', 'fundamentar'] }, pos: 'verb', level: 'B1', category: 'opinion' },
  { id: 'b1v010', de: 'meiner Meinung nach', en: ['in my opinion'], gloss: { es: ['en mi opinión'], fr: ['à mon avis'], it: ['secondo me'], pt: ['na minha opinião'] }, pos: 'phrase', level: 'B1', category: 'opinion' },

  // ── work & career ─────────────────────────────────────────────────────
  { id: 'b1v011', de: 'die Erfahrung', en: ['the experience'], gloss: { es: ['la experiencia'], fr: ['l’expérience'], it: ['l’esperienza'], pt: ['a experiência'] }, pos: 'noun', level: 'B1', category: 'career' },
  { id: 'b1v012', de: 'die Verantwortung', en: ['the responsibility'], gloss: { es: ['la responsabilidad'], fr: ['la responsabilité'], it: ['la responsabilità'], pt: ['a responsabilidade'] }, pos: 'noun', level: 'B1', category: 'career' },
  { id: 'b1v013', de: 'die Fähigkeit', en: ['the ability', 'the skill'], gloss: { es: ['la capacidad', 'la habilidad'], fr: ['la capacité', 'la compétence'], it: ['la capacità', 'l’abilità'], pt: ['a capacidade', 'a habilidade'] }, pos: 'noun', level: 'B1', category: 'career' },
  { id: 'b1v014', de: 'der Lebenslauf', en: ['the CV', 'the CV'], gloss: { es: ['el currículum'], fr: ['le CV'], it: ['il curriculum'], pt: ['o currículo'] }, pos: 'noun', level: 'B1', category: 'career' },
  { id: 'b1v015', de: 'das Vorstellungsgespräch', en: ['the job interview'], gloss: { es: ['la entrevista de trabajo'], fr: ['l’entretien d’embauche'], it: ['il colloquio di lavoro'], pt: ['a entrevista de emprego'] }, pos: 'noun', level: 'B1', category: 'career' },
  { id: 'b1v016', de: 'die Weiterbildung', en: ['the further training'], gloss: { es: ['la formación continua'], fr: ['la formation continue'], it: ['la formazione continua'], pt: ['a formação continuada'] }, pos: 'noun', level: 'B1', category: 'career' },
  { id: 'b1v017', de: 'befördern', en: ['to promote'], gloss: { es: ['ascender'], fr: ['promouvoir'], it: ['promuovere'], pt: ['promover'] }, pos: 'verb', level: 'B1', category: 'career' },
  { id: 'b1v018', de: 'einstellen', en: ['to hire'], gloss: { es: ['contratar'], fr: ['embaucher'], it: ['assumere'], pt: ['contratar'] }, pos: 'verb', level: 'B1', category: 'career' },
  { id: 'b1v019', de: 'entlassen', en: ['to dismiss', 'to make redundant'], gloss: { es: ['despedir', 'echar del trabajo'], fr: ['licencier', 'mettre à la porte'], it: ['licenziare', 'mandare via'], pt: ['demitir', 'mandar embora'] }, pos: 'verb', level: 'B1', category: 'career' },
  { id: 'b1v020', de: 'selbstständig', en: ['self-employed', 'independent'], gloss: { es: ['autónomo', 'independiente'], fr: ['indépendant', 'à son compte'], it: ['autonomo', 'indipendente'], pt: ['autônomo', 'independente'] }, pos: 'adj', level: 'B1', category: 'career' },

  // ── society & news ────────────────────────────────────────────────────
  { id: 'b1v021', de: 'die Gesellschaft', en: ['the society'], gloss: { es: ['la sociedad'], fr: ['la société'], it: ['la società'], pt: ['a sociedade'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v022', de: 'die Regierung', en: ['the government'], gloss: { es: ['el gobierno'], fr: ['le gouvernement'], it: ['il governo'], pt: ['o governo'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v023', de: 'die Wahl', en: ['the election', 'the choice'], gloss: { es: ['la elección', 'la opción'], fr: ['l’élection', 'le choix'], it: ['l’elezione', 'la scelta'], pt: ['a eleição', 'a escolha'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v024', de: 'das Gesetz', en: ['the law'], gloss: { es: ['la ley'], fr: ['la loi'], it: ['la legge'], pt: ['a lei'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v025', de: 'die Nachrichten', en: ['the news'], gloss: { es: ['las noticias'], fr: ['les informations'], it: ['le notizie'], pt: ['as notícias'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v026', de: 'die Arbeitslosigkeit', en: ['the unemployment'], gloss: { es: ['el paro', 'el desempleo'], fr: ['le chômage'], it: ['la disoccupazione'], pt: ['o desemprego'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v027', de: 'die Gerechtigkeit', en: ['the justice', 'the fairness'], gloss: { es: ['la justicia', 'la equidad'], fr: ['la justice', 'l’équité'], it: ['la giustizia', 'l’equità'], pt: ['a justiça', 'a equidade'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v028', de: 'öffentlich', en: ['public'], gloss: { es: ['público'], fr: ['public'], it: ['pubblico'], pt: ['público'] }, pos: 'adj', level: 'B1', category: 'society' },
  { id: 'b1v029', de: 'die Bevölkerung', en: ['the population'], gloss: { es: ['la población'], fr: ['la population'], it: ['la popolazione'], pt: ['a população'] }, pos: 'noun', level: 'B1', category: 'society' },
  { id: 'b1v030', de: 'sich engagieren', en: ['to get involved', 'to volunteer'], gloss: { es: ['comprometerse', 'implicarse'], fr: ['s’engager', 'faire du bénévolat'], it: ['impegnarsi', 'fare volontariato'], pt: ['engajar-se', 'fazer trabalho voluntário'] }, pos: 'verb', level: 'B1', category: 'society' },

  // ── environment ───────────────────────────────────────────────────────
  { id: 'b1v031', de: 'die Umwelt', en: ['the environment'], gloss: { es: ['el medio ambiente'], fr: ['l’environnement'], it: ['l’ambiente'], pt: ['o meio ambiente'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'b1v032', de: 'der Klimawandel', en: ['the climate change'], gloss: { es: ['el cambio climático'], fr: ['le changement climatique'], it: ['il cambiamento climatico'], pt: ['a mudança climática'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'b1v033', de: 'der Müll', en: ['the rubbish', 'the rubbish'], gloss: { es: ['la basura'], fr: ['les ordures', 'les déchets'], it: ['la spazzatura', 'i rifiuti'], pt: ['o lixo'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'b1v034', de: 'die Verschmutzung', en: ['the pollution'], gloss: { es: ['la contaminación'], fr: ['la pollution'], it: ['l’inquinamento'], pt: ['a poluição'] }, pos: 'noun', level: 'B1', category: 'environment' },
  { id: 'b1v035', de: 'erneuerbar', en: ['renewable'], gloss: { es: ['renovable'], fr: ['renouvelable'], it: ['rinnovabile'], pt: ['renovável'] }, pos: 'adj', level: 'B1', category: 'environment' },
  { id: 'b1v036', de: 'verbrauchen', en: ['to consume', 'to use up'], gloss: { es: ['consumir', 'gastar'], fr: ['consommer', 'user'], it: ['consumare', 'esaurire'], pt: ['consumir', 'gastar'] }, pos: 'verb', level: 'B1', category: 'environment' },
  { id: 'b1v037', de: 'vermeiden', en: ['to avoid'], gloss: { es: ['evitar'], fr: ['éviter'], it: ['evitare'], pt: ['evitar'] }, pos: 'verb', level: 'B1', category: 'environment' },
  { id: 'b1v038', de: 'schützen', en: ['to protect'], gloss: { es: ['proteger'], fr: ['protéger'], it: ['proteggere'], pt: ['proteger'] }, pos: 'verb', level: 'B1', category: 'environment' },
  { id: 'b1v039', de: 'recyceln', en: ['to recycle'], gloss: { es: ['reciclar'], fr: ['recycler'], it: ['riciclare'], pt: ['reciclar'] }, pos: 'verb', level: 'B1', category: 'environment' },
  { id: 'b1v040', de: 'nachhaltig', en: ['sustainable'], gloss: { es: ['sostenible'], fr: ['durable'], it: ['sostenibile'], pt: ['sustentável'] }, pos: 'adj', level: 'B1', category: 'environment' },

  // ── relationships & emotions ──────────────────────────────────────────
  { id: 'b1v041', de: 'das Vertrauen', en: ['the trust'], gloss: { es: ['la confianza'], fr: ['la confiance'], it: ['la fiducia'], pt: ['a confiança'] }, pos: 'noun', level: 'B1', category: 'relationships' },
  { id: 'b1v042', de: 'die Beziehung', en: ['the relationship'], gloss: { es: ['la relación'], fr: ['la relation'], it: ['la relazione'], pt: ['a relação'] }, pos: 'noun', level: 'B1', category: 'relationships' },
  { id: 'b1v043', de: 'der Streit', en: ['the argument', 'the quarrel'], gloss: { es: ['la discusión', 'la pelea'], fr: ['la dispute', 'la querelle'], it: ['il litigio', 'la lite'], pt: ['a briga', 'a discussão'] }, pos: 'noun', level: 'B1', category: 'relationships' },
  { id: 'b1v044', de: 'sich verlassen auf', en: ['to rely on'], gloss: { es: ['contar con', 'fiarse de'], fr: ['compter sur', 'se fier à'], it: ['contare su', 'fidarsi di'], pt: ['contar com', 'confiar em'] }, pos: 'phrase', level: 'B1', category: 'relationships' },
  { id: 'b1v045', de: 'sich trennen', en: ['to separate', 'to break up'], gloss: { es: ['separarse', 'romper'], fr: ['se séparer', 'rompre'], it: ['separarsi', 'lasciarsi'], pt: ['separar-se', 'terminar'] }, pos: 'verb', level: 'B1', category: 'relationships' },
  { id: 'b1v046', de: 'sich versöhnen', en: ['to reconcile', 'to make up'], gloss: { es: ['reconciliarse', 'hacer las paces'], fr: ['se réconcilier', 'faire la paix'], it: ['riconciliarsi', 'fare pace'], pt: ['reconciliar-se', 'fazer as pazes'] }, pos: 'verb', level: 'B1', category: 'relationships' },
  { id: 'b1v047', de: 'vermissen', en: ['to miss (someone)'], gloss: { es: ['echar de menos'], fr: ['manquer (à quelqu’un)'], it: ['sentire la mancanza di'], pt: ['sentir falta de'] }, pos: 'verb', level: 'B1', category: 'relationships' },
  { id: 'b1v048', de: 'verzeihen', en: ['to forgive'], gloss: { es: ['perdonar'], fr: ['pardonner'], it: ['perdonare'], pt: ['perdoar'] }, pos: 'verb', level: 'B1', category: 'relationships' },
  { id: 'b1v049', de: 'die Enttäuschung', en: ['the disappointment'], gloss: { es: ['la decepción'], fr: ['la déception'], it: ['la delusione'], pt: ['a decepção'] }, pos: 'noun', level: 'B1', category: 'relationships' },
  { id: 'b1v050', de: 'eifersüchtig sein auf', en: ['to be jealous of'], gloss: { es: ['tener celos de'], fr: ['être jaloux de'], it: ['essere geloso di'], pt: ['ter ciúmes de'] }, pos: 'phrase', level: 'B1', category: 'relationships' },

  // ── abstract verbs ────────────────────────────────────────────────────
  { id: 'b1v051', de: 'sich entscheiden', en: ['to decide'], gloss: { es: ['decidirse'], fr: ['se décider'], it: ['decidersi'], pt: ['decidir-se'] }, pos: 'verb', level: 'B1', category: 'abstract' },
  { id: 'b1v052', de: 'sich gewöhnen an', en: ['to get used to'], gloss: { es: ['acostumbrarse a'], fr: ['s’habituer à'], it: ['abituarsi a'], pt: ['acostumar-se a'] }, pos: 'phrase', level: 'B1', category: 'abstract' },
  { id: 'b1v053', de: 'sich vorstellen', en: ['to imagine', 'to introduce oneself'], gloss: { es: ['imaginarse', 'presentarse'], fr: ['s’imaginer', 'se présenter'], it: ['immaginarsi', 'presentarsi'], pt: ['imaginar', 'apresentar-se'] }, pos: 'verb', level: 'B1', category: 'abstract' },
  { id: 'b1v054', de: 'erreichen', en: ['to achieve', 'to reach'], gloss: { es: ['lograr', 'alcanzar'], fr: ['atteindre', 'obtenir'], it: ['raggiungere', 'ottenere'], pt: ['alcançar', 'atingir'] }, pos: 'verb', level: 'B1', category: 'abstract' },
  { id: 'b1v055', de: 'verbessern', en: ['to improve'], gloss: { es: ['mejorar'], fr: ['améliorer'], it: ['migliorare'], pt: ['melhorar'] }, pos: 'verb', level: 'B1', category: 'abstract' },
  { id: 'b1v056', de: 'entwickeln', en: ['to develop'], gloss: { es: ['desarrollar'], fr: ['développer'], it: ['sviluppare'], pt: ['desenvolver'] }, pos: 'verb', level: 'B1', category: 'abstract' },
  { id: 'b1v057', de: 'vergleichen', en: ['to compare'], gloss: { es: ['comparar'], fr: ['comparer'], it: ['confrontare'], pt: ['comparar'] }, pos: 'verb', level: 'B1', category: 'abstract' },
  { id: 'b1v058', de: 'beeinflussen', en: ['to influence'], gloss: { es: ['influir en'], fr: ['influencer'], it: ['influenzare'], pt: ['influenciar'] }, pos: 'verb', level: 'B1', category: 'abstract' },
  { id: 'b1v059', de: 'verzichten auf', en: ['to do without', 'to give up'], gloss: { es: ['renunciar a', 'prescindir de'], fr: ['renoncer à', 'se passer de'], it: ['rinunciare a', 'fare a meno di'], pt: ['abrir mão de', 'renunciar a'] }, pos: 'phrase', level: 'B1', category: 'abstract' },
  { id: 'b1v060', de: 'sich lohnen', en: ['to be worth it'], gloss: { es: ['merecer la pena'], fr: ['valoir la peine'], it: ['valere la pena'], pt: ['valer a pena'] }, pos: 'verb', level: 'B1', category: 'abstract' },

  // ── connectors & structure ────────────────────────────────────────────
  { id: 'b1v061', de: 'obwohl', en: ['although'], gloss: { es: ['aunque'], fr: ['bien que'], it: ['anche se', 'benché'], pt: ['embora'] }, pos: 'conj', level: 'B1', category: 'connectors' },
  { id: 'b1v062', de: 'trotzdem', en: ['nevertheless', 'still'], gloss: { es: ['aun así', 'a pesar de eso'], fr: ['quand même', 'malgré tout'], it: ['tuttavia', 'lo stesso'], pt: ['mesmo assim', 'ainda assim'] }, pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'b1v063', de: 'deshalb', en: ['therefore', 'that is why'], gloss: { es: ['por eso', 'por lo tanto'], fr: ['c’est pourquoi', 'donc'], it: ['perciò', 'quindi'], pt: ['por isso', 'portanto'] }, pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'b1v064', de: 'außerdem', en: ['besides', 'moreover'], gloss: { es: ['además'], fr: ['en outre', 'de plus'], it: ['inoltre'], pt: ['além disso'] }, pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'b1v065', de: 'allerdings', en: ['however', 'though'], gloss: { es: ['sin embargo', 'no obstante'], fr: ['cependant', 'toutefois'], it: ['tuttavia', 'però'], pt: ['no entanto', 'porém'] }, pos: 'adv', level: 'B1', category: 'connectors' },
  { id: 'b1v066', de: 'entweder … oder', en: ['either … or'], gloss: { es: ['o … o'], fr: ['soit … soit'], it: ['o … o'], pt: ['ou … ou'] }, pos: 'phrase', level: 'B1', category: 'connectors' },
  { id: 'b1v067', de: 'weder … noch', en: ['neither … nor'], gloss: { es: ['ni … ni'], fr: ['ni … ni'], it: ['né … né'], pt: ['nem … nem'] }, pos: 'phrase', level: 'B1', category: 'connectors' },
  { id: 'b1v068', de: 'sowohl … als auch', en: ['both … and'], gloss: { es: ['tanto … como'], fr: ['aussi bien … que'], it: ['sia … sia'], pt: ['tanto … quanto'] }, pos: 'phrase', level: 'B1', category: 'connectors' },
  { id: 'b1v069', de: 'je … desto', en: ['the … the (comparative)'], gloss: { es: ['cuanto más … más'], fr: ['plus … plus'], it: ['più … più'], pt: ['quanto mais … mais'] }, pos: 'phrase', level: 'B1', category: 'connectors' },
  { id: 'b1v070', de: 'falls', en: ['in case', 'if'], gloss: { es: ['en caso de que', 'si'], fr: ['au cas où', 'si'], it: ['nel caso in cui', 'se'], pt: ['caso', 'se'] }, pos: 'conj', level: 'B1', category: 'connectors' },

  // ── everyday idioms ───────────────────────────────────────────────────
  { id: 'b1v071', de: 'Daumen drücken', en: ['to keep one’s fingers crossed'], gloss: { es: ['cruzar los dedos'], fr: ['croiser les doigts'], it: ['incrociare le dita'], pt: ['cruzar os dedos', 'torcer'] }, pos: 'phrase', level: 'B1', category: 'idioms' },
  { id: 'b1v072', de: 'auf dem Laufenden sein', en: ['to be up to date'], gloss: { es: ['estar al día'], fr: ['être au courant'], it: ['essere aggiornato'], pt: ['estar por dentro'] }, pos: 'phrase', level: 'B1', category: 'idioms' },
  { id: 'b1v073', de: 'unter vier Augen', en: ['in private', 'between the two of us'], gloss: { es: ['a solas'], fr: ['en tête-à-tête'], it: ['a quattr’occhi'], pt: ['a sós'] }, pos: 'phrase', level: 'B1', category: 'idioms' },
  { id: 'b1v074', de: 'die Nase voll haben', en: ['to be fed up'], gloss: { es: ['estar harto'], fr: ['en avoir marre'], it: ['averne abbastanza'], pt: ['estar de saco cheio'] }, pos: 'phrase', level: 'B1', category: 'idioms' },
  { id: 'b1v075', de: 'ins Fettnäpfchen treten', en: ['to put one’s foot in it'], gloss: { es: ['meter la pata'], fr: ['mettre les pieds dans le plat'], it: ['fare una gaffe'], pt: ['dar uma mancada'] }, pos: 'phrase', level: 'B1', category: 'idioms' },
  { id: 'b1v076', de: 'um den heißen Brei reden', en: ['to beat around the bush'], gloss: { es: ['andarse por las ramas'], fr: ['tourner autour du pot'], it: ['girare intorno al problema'], pt: ['fazer rodeios'] }, pos: 'phrase', level: 'B1', category: 'idioms' },
  { id: 'b1v077', de: 'zwei Fliegen mit einer Klappe', en: ['two birds with one stone'], gloss: { es: ['matar dos pájaros de un tiro'], fr: ['faire d’une pierre deux coups'], it: ['prendere due piccioni con una fava'], pt: ['matar dois coelhos com uma cajadada'] }, pos: 'phrase', level: 'B1', category: 'idioms' },
  { id: 'b1v078', de: 'Hals- und Beinbruch', en: ['break a leg', 'good luck'], gloss: { es: ['mucha suerte'], fr: ['bonne chance'], it: ['in bocca al lupo'], pt: ['boa sorte'] }, pos: 'phrase', level: 'B1', category: 'idioms' },
];
