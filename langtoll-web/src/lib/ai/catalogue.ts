// The shared topic catalogue: the seed list the generated content pool is built
// from.
//
// WHY A CATALOGUE AND NOT PER-USER PROMPTS
// Generated packs are cached by (language, level, topic) and served to everyone,
// so cost scales with DISTINCT CONTENT, not with users. A fixed list is therefore
// generated once — a few dollars total — and then read from the database forever.
// Per-user generation would scale with installs and is the thing to avoid.
//
// LEVEL BANDS — one list per band, not one list for everything.
//
// This started as a single list on the argument that the level is a prompt
// parameter, so "at the doctor" would be body parts at A1 and a specialist
// consultation at B2. That reasoning holds for a topic with an abstract register
// available to it. It does NOT hold for concrete everyday subjects: a generated
// fr/B2 pack for "a birthday party" came back with le gâteau, les bougies and
// "La fête commence à six heures du soir." There is no B2 version of birthday
// cake, so the model produced A1 content wearing a B2 label — exactly the
// "a B1 learner must never see hallo" failure, at scale.
//
// So concrete subjects are capped at A1/A2, abstract ones start at B1, and only
// topics with genuine range appear in both.
//
// GROWING IT
// Appending a string here is the cheapest content lever in the product: one line
// becomes 4 levels x 6 languages = 24 packs, reaching every user with NO app
// update and NO App Review cycle, because the pool is fetched, not bundled.
//
// Topics are deliberately concrete and everyday. Nothing political, medical-
// advisory, or otherwise unsuitable for a general-audience app — the generator
// also screens its output, but the catalogue should never rely on that.
export const CONCRETE_TOPICS: string[] = [
  // ── food & drink ──────────────────────────────────────────────────────
  'ordering at a restaurant',
  'in a coffee shop',
  'cooking dinner at home',
  'at the bakery',
  'food shopping at the market',
  'breakfast habits',
  'street food',
  'dietary restrictions',
  'inviting friends for a meal',
  'reading a menu',
  // ── travel & transport ────────────────────────────────────────────────
  'at the airport',
  'booking a hotel room',
  'taking the train',
  'asking for directions',
  'renting a car',
  'public transport in the city',
  'a weekend trip',
  'lost luggage',
  'buying tickets',
  'at passport control',
  // ── home & daily life ─────────────────────────────────────────────────
  'rooms in a house',
  'household chores',
  'a typical morning routine',
  'moving to a new flat',
  'furniture and decorating',
  'problems with the landlord',
  'doing the laundry',
  'neighbours',
  'recycling and rubbish',
  'a power cut',
  // ── work & study ──────────────────────────────────────────────────────
  'a job interview',
  'in a meeting',
  'sending a work email',
  'office equipment',
  'asking for time off',
  'studying for an exam',
  'at the university',
  'working from home',
  'a first day at work',
  'giving a presentation',
  // ── health & body ─────────────────────────────────────────────────────
  'at the doctor',
  'at the pharmacy',
  'parts of the body',
  'going to the dentist',
  'staying healthy',
  'at the gym',
  'sleeping badly',
  'a cold and a fever',
  'booking an appointment',
  'first aid',
  // ── shopping & money ──────────────────────────────────────────────────
  'buying clothes',
  'at the bank',
  'returning a purchase',
  'paying and prices',
  'at the post office',
  'shopping online',
  'a household budget',
  'bargaining at a market',
  'shoe shopping',
  'a broken appliance',
  // ── people & relationships ────────────────────────────────────────────
  'introducing yourself',
  'describing your family',
  'describing appearance',
  'describing character',
  'making plans with friends',
  'a birthday party',
  'apologising',
  'small talk with a colleague',
  'meeting the neighbours',
  'a wedding',
  // ── city & places ─────────────────────────────────────────────────────
  'in the city centre',
  'at the library',
  'going to the cinema',
  'at the museum',
  'in the park',
  'at the hairdresser',
  'places in a neighbourhood',
  'a football match',
  'at the swimming pool',
  'a music concert',
  // ── time, weather & nature ────────────────────────────────────────────
  'days and months',
  'telling the time',
  'the weather today',
  'the four seasons',
  'animals and pets',
  'plants and the garden',
  'at the seaside',
  'in the mountains',
  'a rainy day',
  'a public holiday',
  // ── technology & media ────────────────────────────────────────────────
  'using a smartphone',
  'the internet at home',
  'social media',
  'watching a series',
  'listening to music',
  'taking photographs',
  'a video call',
  'passwords and accounts',
  'reading the news',
  'a computer problem',
  // ── hobbies & feelings ────────────────────────────────────────────────
  'free time and hobbies',
  'playing a sport',
  'reading books',
  'learning an instrument',
  'cycling',
  'cooking as a hobby',
  'talking about feelings',
  'giving an opinion',
  'making a complaint',
  'plans for the future',
  // ── services & admin ──────────────────────────────────────────────────
  'at the police station',
  'filling in a form',
  'renewing a document',
  'at the town hall',
  'insurance and paperwork',
  'a delivery gone wrong',
  'calling customer service',
  'opening an account',
  'a lost phone',
  'reporting a problem',
  // ── eating & drinking, wider ──────────────────────────────────────────
  'vegetarian and vegan food',
  'desserts and sweets',
  'fruit and vegetables',
  'herbs and spices',
  'kitchen utensils',
  'a picnic',
  'a family recipe',
  'coffee and tea',
  'table manners',
  'a food delivery',
  // ── travel, wider ─────────────────────────────────────────────────────
  'packing a suitcase',
  'travel insurance',
  'a delayed flight',
  'camping',
  'a city tour',
  'souvenirs',
  'changing money',
  'travelling with children',
  'a road trip',
  'checking out of a hotel',
  // ── work, wider ───────────────────────────────────────────────────────
  'writing a CV',
  'salary and benefits',
  'a difficult colleague',
  'deadlines and pressure',
  'starting a business',
  'a team project',
  'training and courses',
  'career change',
  'remote work tools',
  'leaving a job',
  // ── study & language ──────────────────────────────────────────────────
  'learning a language',
  'in the classroom',
  'school subjects',
  'homework',
  'a school trip',
  'taking notes',
  'asking a teacher',
  'group work',
  'graduation',
  'studying abroad',
  // ── city life, wider ──────────────────────────────────────────────────
  'traffic and parking',
  'a taxi ride',
  'street signs',
  'a market day',
  'the local council',
  'a building site',
  'a queue',
  'noise in the street',
  'a festival',
  'volunteering',
  // ── home & family, wider ──────────────────────────────────────────────
  'looking after children',
  'a family celebration',
  'grandparents',
  'pets at home',
  'a garden project',
  'repairs around the house',
  'sharing a flat',
  'a house move',
  'family photographs',
  'a quiet evening at home',
  // ── health & wellbeing, wider ─────────────────────────────────────────
  'eating well',
  'stress and relaxation',
  'going for a walk',
  'an eye test',
  'vaccinations',
  'a hospital visit',
  'physiotherapy',
  'quitting a bad habit',
  'mental wellbeing',
  'a check-up',
  // ── leisure, wider ────────────────────────────────────────────────────
  'board games',
  'going dancing',
  'a theatre visit',
  'painting and drawing',
  'collecting things',
  'fishing',
  'running a race',
  'winter sports',
  'a day at the zoo',
  'watching a documentary',
  // ── abstract & opinion (upper levels lean on these) ───────────────────
  'the environment',
  'city versus countryside',
  'work-life balance',
  'technology and privacy',
  'traditions and customs',
  'saving and spending',
  'making a decision',
  'agreeing and disagreeing',
  'describing a change',
  'telling a story',
];

// Subjects with genuine abstract range — argument, speculation, consequence,
// nuance. These are what B1 and B2 draw on; a concrete topic cannot carry that
// register no matter what level the prompt asks for.
export const ABSTRACT_TOPICS: string[] = [
  // ── work & economy ────────────────────────────────────────────────────
  'negotiating a contract', 'workplace hierarchy', 'automation and jobs',
  'the gig economy', 'inflation and prices', 'taxation', 'inequality of income',
  'starting over in a new career', 'burnout culture', 'productivity and its limits',
  'unions and bargaining', 'remote work and belonging', 'the cost of housing',
  'consumer debt', 'entrepreneurship and risk',
  // ── media & information ───────────────────────────────────────────────
  'misinformation', 'press freedom', 'sourcing and evidence', 'clickbait economics',
  'algorithmic feeds', 'privacy and surveillance', 'anonymity online',
  'the attention economy', 'public broadcasting', 'documentary versus propaganda',
  // ── science & environment ─────────────────────────────────────────────
  'climate adaptation', 'renewable energy trade-offs', 'biodiversity loss',
  'scientific consensus', 'vaccination and public health', 'water scarcity',
  'urban air quality', 'waste and recycling policy', 'space exploration',
  'the ethics of research',
  // ── society & identity ────────────────────────────────────────────────
  'migration and belonging', 'bilingual identity', 'generational difference',
  'tradition versus modernity', 'regional accents and prejudice',
  'gender roles at work', 'ageing populations', 'volunteering and civic duty',
  'social mobility', 'community and isolation',
  // ── law, ethics & governance ──────────────────────────────────────────
  'the right to protest', 'privacy versus security', 'criminal rehabilitation',
  'jury and judgement', 'contracts and obligation', 'intellectual property',
  'whistleblowing', 'regulating new technology', 'consumer protection',
  'freedom and its limits',
  // ── psychology & behaviour ────────────────────────────────────────────
  'motivation and habit', 'memory and forgetting', 'decision fatigue',
  'risk perception', 'stress and resilience', 'persuasion and influence',
  'procrastination', 'attention and focus', 'grief and adjustment',
  'confidence and doubt',
  // ── culture & the arts ────────────────────────────────────────────────
  'what makes a classic', 'translation and meaning', 'censorship in art',
  'the value of criticism', 'adaptation from book to film', 'street art and legality',
  'museums and restitution', 'live performance versus recording',
  'nostalgia in culture', 'humour across cultures',
  // ── argument & abstraction ────────────────────────────────────────────
  'agreeing to disagree', 'cause and consequence', 'weighing evidence',
  'hypothesis and speculation', 'regret and hindsight', 'compromise',
  'making a difficult decision', 'explaining a misunderstanding',
  'defending an unpopular view', 'changing your mind',
];

/**
 * Topics for a level. A1/A2 stay on concrete everyday subjects; B1/B2 get the
 * abstract set PLUS the concrete topics that genuinely carry an adult register
 * (a job interview or a hospital visit has a B2 version; birthday candles do not).
 */
const CONCRETE_WITH_RANGE = new Set([
  'a job interview', 'in a meeting', 'asking for time off', 'giving a presentation',
  'at the doctor', 'a hospital visit', 'mental wellbeing', 'quitting a bad habit',
  'at the bank', 'a household budget', 'insurance and paperwork', 'renting a flat',
  'problems with the landlord', 'calling customer service', 'making a complaint',
  'travel insurance', 'a delayed flight', 'career change', 'leaving a job',
  'salary and benefits', 'a difficult colleague', 'deadlines and pressure',
  'starting a business', 'studying abroad', 'the local council', 'volunteering',
]);

export function topicsForLevel(level: string): string[] {
  const upper = level.toUpperCase();
  if (upper === 'A1' || upper === 'A2') return CONCRETE_TOPICS;
  return [...ABSTRACT_TOPICS, ...CONCRETE_TOPICS.filter((t) => CONCRETE_WITH_RANGE.has(t))];
}

/** Stable slug for the cache key — must match the generator's own slug rule. */
export function topicSlug(topic: string): string {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'topic';
}

export const CATALOGUE_SIZE = CONCRETE_TOPICS.length + ABSTRACT_TOPICS.length;
