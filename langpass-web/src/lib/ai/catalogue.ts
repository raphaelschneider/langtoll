// The shared topic catalogue: the seed list the generated content pool is built
// from.
//
// WHY A CATALOGUE AND NOT PER-USER PROMPTS
// Generated packs are cached by (language, level, topic) and served to everyone,
// so cost scales with DISTINCT CONTENT, not with users. A fixed list is therefore
// generated once — a few dollars total — and then read from the database forever.
// Per-user generation would scale with installs and is the thing to avoid.
//
// ONE LIST, EVERY LEVEL
// The level is a parameter of the generation prompt, so the same topic yields
// genuinely different content per level: "at the doctor" is body parts and "it
// hurts" at A1, and describing a chronic condition to a specialist at B2. That is
// why this is one list rather than four — it quadruples the pool for the price of
// authoring it once.
//
// GROWING IT
// Appending a string here is the cheapest content lever in the product: one line
// becomes 4 levels x 6 languages = 24 packs, reaching every user with NO app
// update and NO App Review cycle, because the pool is fetched, not bundled.
//
// Topics are deliberately concrete and everyday. Nothing political, medical-
// advisory, or otherwise unsuitable for a general-audience app — the generator
// also screens its output, but the catalogue should never rely on that.
export const TOPIC_CATALOGUE: string[] = [
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

/** Stable slug for the cache key — must match the generator's own slug rule. */
export function topicSlug(topic: string): string {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'topic';
}

export const CATALOGUE_SIZE = TOPIC_CATALOGUE.length;
