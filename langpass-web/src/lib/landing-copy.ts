// Landing-page message catalogue — the ONLY place user-visible landing copy lives.
//
// Deliberately a plain typed object rather than an i18n library: the landing page is one
// page, statically rendered, and the whole point is SEO-indexable HTML per locale. A
// runtime i18n runtime would buy us nothing and cost a dependency.
//
// SCOPE: the landing page only. /privacy, /terms and /langpass-adm stay English-only by
// deliberate decision (legal text + internal tooling).
//
// TRANSLATORS: fill in every locale entry below. `en` is the source of truth — the other
// locales currently hold VERBATIM ENGLISH placeholders. Notes:
//   • Placeholders `{price}` and `{pct}` in the pricing strings are substituted at render
//     time; keep them intact.
//   • `hero.variants` are the rotating headlines. They are deliberately written in the
//     TARGET language being learned (German/Spanish/Portuguese), with `lang` being the
//     name of that language *in the reader's* language. Translate `lang`, and keep the
//     headline in its own language (only the app names / framing may be adapted).
//   • `pass.*` renders inside the ticket graphic — keep it SHORT, it must not wrap.
//   • Endonyms in the language switcher are never translated (see ENDONYMS below).

// Locale primitives live in ./locales so the edge middleware can import them without pulling in
// this file's six full copy catalogues. Re-exported here so landing code has a single import.
import type { Locale } from '@/lib/locales';

export {
  LOCALES,
  DEFAULT_LOCALE,
  NON_DEFAULT_LOCALES,
  SITE_URL,
  LOCALE_COOKIE,
  ENDONYMS,
  HTML_LANG,
  OG_LOCALE,
  isLocale,
  pathForLocale,
  landingAlternates,
  type Locale,
} from '@/lib/locales';

/** Simple `{token}` interpolation — no dependency, no runtime format machinery. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------

export interface HeroVariant {
  /** Headline, written in the language being learned. */
  headline: string;
  /** That language's name, in the reader's language (goes in "…your ___ reps"). */
  lang: string;
  /**
   * Which language this variant advertises. The renderer drops the variant whose
   * code matches the reader's locale — telling a German visitor "Erst Deutsch,
   * dann TikTok" is selling them their own language. Every locale therefore
   * carries FOUR variants so three always survive the filter.
   */
  code: Locale;
}

export interface StubCopy {
  label: string;
  title: string;
  body: string;
}

export interface FeatureCopy {
  tag: string;
  title: string;
  body: string;
}

export interface LandingCopy {
  /** <title> and <meta name="description"> for this locale. */
  seo: {
    title: string;
    description: string;
    /** OpenGraph/Twitter image alt text. */
    ogImageAlt: string;
  };
  /** schema.org MobileApplication payload (indexed, so it is localized too). */
  jsonLd: {
    description: string;
    offerFree: string;
    offerMonthly: string;
    offerYearly: string;
  };
  nav: {
    cta: string;
  };
  hero: {
    eyebrow: string;
    /** Rotating headlines + the name of the language each one is in. */
    variants: HeroVariant[];
    /** Sub-paragraph, split around the rotating language word:
     *  `subBefore` + <lang> + `subAfter` + <strong>subStrong</strong> + `subTail` */
    subBefore: string;
    subAfter: string;
    subStrong: string;
    subTail: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  /** Text inside the ticket graphic. Keep short — it must not wrap. */
  pass: {
    brandLabel: string;
    stateActive: string;
    stateExpired: string;
    noteActive: string;
    noteExpired: string;
    passengerLabel: string;
    passengerName: string;
    stubMeta: string;
    stamp: string;
    ariaActive: string;
    ariaExpired: string;
  };
  how: {
    eyebrow: string;
    title: string;
    lede: string;
    stubs: [StubCopy, StubCopy, StubCopy];
  };
  shots: {
    eyebrow: string;
    title: string;
    lede: string;
    passAlt: string;
    passCaption: string;
    practiceAlt: string;
    practiceCaption: string;
  };
  features: {
    eyebrow: string;
    title: string;
    cards: FeatureCopy[];
  };
  versus: {
    eyebrow: string;
    title: string;
    lede: string;
    themTitle: string;
    themPoints: string[];
    usTitle: string;
    usPoints: string[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    planName: string;
    planBlurb: string;
    /** Suffix after the yearly figure, e.g. " / year". */
    perYear: string;
    /** `{price}` = formatted monthly price. */
    monthlyNote: string;
    /** `{pct}` = yearly saving. Appended to monthlyNote only when there is a saving. */
    saveNote: string;
    /** Appended after monthlyNote (+ saveNote). */
    trialNote: string;
    cta: string;
    /** mailto: subject line for the early-access link. */
    ctaMailSubject: string;
  };
  /**
   * The six languages we teach, with flags. The flag encodes the VARIANT we
   * ship, which is a deliberate product decision: BR Portuguese (not PT),
   * British English (not US), Peninsular Spanish.
   */
  languages: {
    eyebrow: string;
    title: string;
    lede: string;
    /** Level range shown on every card — identical for all six languages. */
    levels: string;
    items: { flag: string; name: string }[];
  };
  footer: {
    tagline: string;
    privacy: string;
    terms: string;
    copyright: string;
  };
  switcher: {
    /** aria-label for the language switcher nav. */
    ariaLabel: string;
  };
}

// ---------------------------------------------------------------------------
// en — source of truth
// ---------------------------------------------------------------------------

const en: LandingCopy = {
  seo: {
    title: 'LangPass — Lock the apps. Learn the language.',
    description:
      'LangPass locks the apps that eat your nights until you have done your language reps. Five quick exercises buy 30 minutes of phone time, then the wall comes back. A real Screen Time fare gate on your worst habit — German, Spanish, French, Italian, Portuguese and English.',
    ogImageAlt: 'LangPass — lock the apps, learn the language.',
  },
  jsonLd: {
    description:
      'LangPass locks the apps that eat your nights until you have done your language reps. Five quick exercises buy 30 minutes of phone time, then the wall comes back — a real Screen Time fare gate on your worst habit. German, Spanish, French, Italian, Portuguese and English.',
    offerFree: 'Free (the lock, forever)',
    offerMonthly: 'LangPass Plus (monthly)',
    offerYearly: 'LangPass Plus (yearly)',
  },
  nav: {
    cta: 'Get early access',
  },
  hero: {
    eyebrow: 'Your apps, behind a fare gate',
    variants: [
      { headline: 'Erst Deutsch, dann TikTok.', lang: 'German', code: 'de' },
      { headline: 'Primero español, luego Instagram.', lang: 'Spanish', code: 'es' },
      { headline: 'Primeiro português, depois YouTube.', lang: 'Portuguese', code: 'pt' },
      { headline: 'D’abord le français, ensuite Netflix.', lang: 'French', code: 'fr' },
      { headline: 'Prima l’italiano, poi Reddit.', lang: 'Italian', code: 'it' },
      { headline: 'English first, TikTok after.', lang: 'English', code: 'en' },
    ],
    subBefore: 'LangPass locks the apps that eat your nights — until you’ve done your ',
    subAfter: ' reps. ',
    subStrong: 'Five quick exercises buy 30 minutes of phone time.',
    subTail: ' Then the wall comes back. You’ll learn, because you can’t not.',
    ctaPrimary: 'Start my free week',
    ctaSecondary: 'See the deal',
  },
  pass: {
    brandLabel: 'LangPass',
    stateActive: 'ACTIVE',
    stateExpired: 'EXPIRED',
    noteActive: 'of phone time left',
    noteExpired: 'do five reps to print another',
    passengerLabel: 'Passenger',
    passengerName: 'YOU',
    stubMeta: 'DE · A1',
    stamp: 'EXPIRED',
    ariaActive: 'Active pass — hover to see it expire',
    ariaExpired: 'Expired pass',
  },
  how: {
    eyebrow: 'The deal',
    title: 'Your dopamine now charges a fare.',
    lede:
      'Every unlock costs exercises. Not a daily quota you can binge past at 8am — a toll, every single time.',
    stubs: [
      {
        label: 'Fare gate · 1',
        title: 'Your feeds get a lock',
        body:
          'Pick the apps that steal your time. iOS shields them at the system level — a real Screen Time wall, not a nag you can swipe away.',
      },
      {
        label: 'Fare gate · 2',
        title: '90 seconds of practice pays it',
        body:
          'Real vocabulary and sentences in the language you’re learning, tuned to your level. Answer well and your pass prints — stamped, numbered, with your name on it.',
      },
      {
        label: 'Fare gate · 3',
        title: 'The pass expires',
        body:
          '30 minutes later the wall is back — even if you never reopen LangPass. Scroll enough and you’ll be fluent out of spite.',
      },
    ],
  },
  shots: {
    eyebrow: 'The app',
    title: 'Built like a members club, not a classroom.',
    lede: 'Graphite glass, one acid accent, and a ticket you’ll actually want to earn.',
    passAlt:
      'LangPass home screen: an expired pass with the fare — 5 exercises for 30 minutes of phone time',
    passCaption: 'The pass — expired, stamped, waiting.',
    practiceAlt: 'LangPass practice session: a German vocabulary exercise with voice playback',
    practiceCaption: 'Practice — with a voice that speaks your language.',
  },
  features: {
    eyebrow: 'What’s inside',
    title: 'Small sessions. Serious curriculum.',
    cards: [
      {
        tag: 'OS-level',
        title: 'A wall, not a widget',
        body:
          'Apple Screen Time shielding. Your apps stay locked until the fare is paid — no snooze, no swipe-away.',
      },
      {
        tag: 'A1 → B1',
        title: 'Levels that grow with you',
        body:
          'Curated packs from first words to real conversations, per language. Onboarding reads your difficulty and starts you at the right one.',
      },
      {
        tag: '7 drill types',
        title: 'Not just word-matching',
        body:
          'Multiple choice, gendered-article drills, typed answers with accent-forgiving grading, cloze, sentence building, listening.',
      },
      {
        tag: 'Voice',
        title: 'Spoken natively, out loud',
        body:
          'Every word and sentence read aloud on-device in the target language. Tap anything to hear it. Toggle it off in the library, obviously.',
      },
      {
        tag: 'Offline',
        title: 'Works with no signal',
        body: 'The whole curriculum ships in the app. Your 7am unlock doesn’t care about your reception.',
      },
      {
        tag: 'Plus',
        title: 'AI topic packs & strict mode',
        body:
          'Generate vocabulary for your world — brunch orders, match-day slang, your job’s jargon. And strict mode: no skips, no mercy.',
      },
    ],
  },
  versus: {
    eyebrow: 'Why it works',
    title: 'Every other app begs you to open it.',
    lede:
      'LangPass owns the door to the apps you were opening anyway. Motivation is optional by design.',
    themTitle: 'The streak-and-guilt model',
    themPoints: [
      'Needs you to remember it exists',
      'One sad owl notification, easily ignored',
      'Daily goal binged at breakfast, forgotten by lunch',
    ],
    usTitle: 'The fare-gate model',
    usPoints: [
      'Interrupts you at peak craving — 10× a day',
      'Re-locks automatically. There is no “done for today”',
      'Your worst habit becomes your study schedule',
    ],
  },
  pricing: {
    eyebrow: 'Fare table',
    title: 'Week one is the full experience. Free.',
    planName: 'LangPass Plus',
    planBlurb:
      'Custom fares, strict mode, the full curriculum, AI topic packs, and every language we add. The lock itself stays free forever.',
    perYear: ' / year',
    monthlyNote: 'or {price}/mo',
    saveNote: ' — save {pct}% on the year',
    trialNote: '. 7-day free trial, no card to start.',
    cta: 'Get early access',
    ctaMailSubject: 'Early access',
  },
  languages: {
    eyebrow: 'Six languages',
    title: 'Pick the one your nights pay for.',
    lede: 'Every language ships A1 to B1 — a real curriculum, not a phrasebook.',
    levels: 'A1 – B1',
    items: [
      { flag: '🇩🇪', name: 'German' },
      { flag: '🇪🇸', name: 'Spanish' },
      { flag: '🇧🇷', name: 'Portuguese' },
      { flag: '🇫🇷', name: 'French' },
      { flag: '🇮🇹', name: 'Italian' },
      { flag: '🇬🇧', name: 'English' },
    ],
  },
  footer: {
    tagline: 'Learn first, scroll later. · Six languages, A1 to B1 — new levels every month',
    privacy: 'Privacy',
    terms: 'Terms',
    copyright: '© 2026 LangPass',
  },
  switcher: {
    ariaLabel: 'Language',
  },
};

// ---------------------------------------------------------------------------
// Translations
//
// PLACEHOLDERS: de/es/fr/it/pt below are byte-for-byte copies of the `en` catalogue, spelled
// out in full rather than cloned at runtime so a translator can edit each string in place and
// the diff shows exactly what has (and has not) been translated yet. Replace the values, never
// the shape — the `LandingCopy` type will catch a missing or misspelled key.
// ---------------------------------------------------------------------------

// German — translated. Voice: du, transit metaphor per lib/i18n/de.ts.
const de: LandingCopy = {
  seo: {
    title: 'LangPass — Apps sperren. Sprache lernen.',
    description:
      'LangPass sperrt die Apps, die deine Abende fressen — bis du geübt hast. Fünf kurze Übungen kaufen 30 Minuten Handyzeit, dann steht die Wand wieder. Eine echte Schranke aus Apples Bildschirmzeit, vor deiner schlimmsten Gewohnheit.',
    ogImageAlt: 'LangPass — Apps sperren, Sprache lernen.',
  },
  jsonLd: {
    description:
      'LangPass sperrt die Apps, die deine Abende fressen, bis du deine Übungen gemacht hast. Fünf kurze Übungen kaufen 30 Minuten Handyzeit, dann steht die Wand wieder — eine echte Schranke aus Apples Bildschirmzeit vor deiner schlimmsten Gewohnheit. Deutsch, Spanisch, Portugiesisch und mehr.',
    offerFree: 'Kostenlos (die Sperre, für immer)',
    offerMonthly: 'LangPass Plus (monatlich)',
    offerYearly: 'LangPass Plus (jährlich)',
  },
  nav: {
    cta: 'Früh dabei sein',
  },
  hero: {
    eyebrow: 'Deine Apps, hinter der Schranke',
    variants: [
      { headline: 'Erst Deutsch, dann TikTok.', lang: 'Deutsch', code: 'de' },
      { headline: 'Primero español, luego Instagram.', lang: 'Spanisch', code: 'es' },
      { headline: 'Primeiro português, depois YouTube.', lang: 'Portugiesisch', code: 'pt' },
      { headline: 'D’abord le français, ensuite Netflix.', lang: 'Französisch', code: 'fr' },
      { headline: 'Prima l’italiano, poi Reddit.', lang: 'Italienisch', code: 'it' },
      { headline: 'English first, TikTok after.', lang: 'Englisch', code: 'en' },
    ],
    subBefore: 'LangPass sperrt die Apps, die deine Abende fressen — bis du deine Übungen auf ',
    subAfter: ' gemacht hast. ',
    subStrong: 'Fünf kurze Übungen kaufen 30 Minuten Handyzeit.',
    subTail: ' Dann steht die Wand wieder. Du wirst lernen — weil du nicht anders kannst.',
    ctaPrimary: 'Gratis-Woche starten',
    ctaSecondary: 'Den Deal ansehen',
  },
  pass: {
    brandLabel: 'LangPass',
    stateActive: 'AKTIV',
    stateExpired: 'ABGELAUFEN',
    noteActive: 'Handyzeit übrig',
    noteExpired: 'fünf Übungen, neuer Pass',
    passengerLabel: 'Fahrgast',
    passengerName: 'DU',
    stubMeta: 'DE · A1',
    // Renders as the big rotated stamp graphic: "ABGELAUFEN" overflows the card on phones,
    // so use the shorter word a real German ticket carries once it stops being valid.
    stamp: 'UNGÜLTIG',
    ariaActive: 'Aktiver Pass — drüberfahren, um ihn ablaufen zu sehen',
    ariaExpired: 'Abgelaufener Pass',
  },
  how: {
    eyebrow: 'Der Deal',
    title: 'Dein Dopamin hat jetzt einen Fahrpreis.',
    lede:
      'Jedes Entsperren kostet Übungen. Kein Tagespensum, das du um acht Uhr früh wegballerst — eine Maut, jedes einzelne Mal.',
    stubs: [
      {
        label: 'Schranke · 1',
        title: 'Deine Feeds bekommen ein Schloss',
        body:
          'Wähl die Apps, die dir die Zeit stehlen. iOS sperrt sie auf Systemebene — eine echte Wand aus der Bildschirmzeit, kein Hinweis, den du wegwischst.',
      },
      {
        label: 'Schranke · 2',
        title: '90 Sekunden Üben zahlen ihn',
        body:
          'Echte Vokabeln und Sätze in deiner Zielsprache, passend zu deinem Niveau. Antworte gut, und dein Pass wird gedruckt — abgestempelt, nummeriert, mit deinem Namen drauf.',
      },
      {
        label: 'Schranke · 3',
        title: 'Der Pass läuft ab',
        body:
          '30 Minuten später steht die Wand wieder — auch wenn du LangPass nie wieder öffnest. Scroll genug, und du wirst aus Trotz fließend.',
      },
    ],
  },
  shots: {
    eyebrow: 'Die App',
    title: 'Gebaut wie ein Members Club, nicht wie ein Klassenzimmer.',
    lede: 'Graphitglas, ein einziger greller Akzent und eine Fahrkarte, die du dir verdienen willst.',
    passAlt:
      'LangPass-Startbildschirm: ein abgelaufener Pass mit dem Fahrpreis — 5 Übungen für 30 Minuten Handyzeit',
    passCaption: 'Der Pass — abgelaufen, abgestempelt, wartend.',
    practiceAlt: 'LangPass-Übungssession: eine deutsche Vokabelübung mit Sprachausgabe',
    practiceCaption: 'Üben — mit einer Stimme, die deine Sprache spricht.',
  },
  features: {
    eyebrow: 'Was drinsteckt',
    title: 'Kurze Sessions. Ernst gemeintes Curriculum.',
    cards: [
      {
        tag: 'Systemebene',
        title: 'Eine Wand, kein Widget',
        body:
          'Sperre über Apples Bildschirmzeit. Deine Apps bleiben zu, bis der Fahrpreis bezahlt ist — kein Snooze, kein Wegwischen.',
      },
      {
        tag: 'A1 → B1',
        title: 'Niveaus, die mit dir wachsen',
        body:
          'Kuratierte Pakete von den ersten Wörtern bis zu echten Gesprächen, pro Sprache. Das Onboarding liest deine Schwierigkeit und setzt dich richtig ein.',
      },
      {
        tag: '7 Übungstypen',
        title: 'Mehr als Wörter zuordnen',
        body:
          'Multiple Choice, Artikeltraining, getippte Antworten mit nachsichtiger Akzent-Bewertung, Lückentexte, Satzbau, Hörverstehen.',
      },
      {
        tag: 'Stimme',
        title: 'Muttersprachlich, laut vorgelesen',
        body:
          'Jedes Wort und jeder Satz wird direkt auf dem Gerät in der Zielsprache vorgelesen. Tipp drauf, um es zu hören. Abschaltbar in der Bibliothek, klar.',
      },
      {
        tag: 'Offline',
        title: 'Läuft ohne Empfang',
        body: 'Das ganze Curriculum steckt in der App. Deine Entsperrung um sieben Uhr früh schert sich nicht um dein Netz.',
      },
      {
        tag: 'Plus',
        title: 'KI-Themenpakete & strikter Modus',
        body:
          'Erstell dir Vokabeln für deine Welt — Brunch bestellen, Stadion-Slang, der Jargon aus deinem Job. Und strikter Modus: kein Überspringen, keine Gnade.',
      },
    ],
  },
  versus: {
    eyebrow: 'Warum es funktioniert',
    title: 'Jede andere App bettelt darum, geöffnet zu werden.',
    lede:
      'LangPass sitzt an der Tür zu den Apps, die du sowieso aufgemacht hättest. Motivation ist hier bewusst optional.',
    themTitle: 'Das Modell aus Serie und schlechtem Gewissen',
    themPoints: [
      'Du musst dich daran erinnern, dass es existiert',
      'Eine traurige Eulen-Benachrichtigung, leicht zu ignorieren',
      'Tagesziel beim Frühstück weggeballert, bis mittags vergessen',
    ],
    usTitle: 'Das Schranken-Modell',
    usPoints: [
      'Unterbricht dich beim größten Verlangen — 10× am Tag',
      'Sperrt automatisch wieder zu. Es gibt kein „für heute erledigt“',
      'Deine schlimmste Gewohnheit wird dein Lernplan',
    ],
  },
  pricing: {
    eyebrow: 'Fahrpreistabelle',
    title: 'Woche eins ist das volle Erlebnis. Gratis.',
    planName: 'LangPass Plus',
    planBlurb:
      'Eigener Fahrpreis, strikter Modus, das volle Curriculum, KI-Themenpakete und jede Sprache, die dazukommt. Die Sperre selbst bleibt für immer kostenlos.',
    perYear: ' / Jahr',
    monthlyNote: 'oder {price}/Monat',
    saveNote: ' — {pct} % günstiger im Jahr',
    trialNote: '. 7 Tage gratis, keine Karte zum Starten.',
    cta: 'Früh dabei sein',
    ctaMailSubject: 'Früher Zugang',
  },
  languages: {
    eyebrow: 'Sechs Sprachen',
    title: 'Wähl die, für die deine Nächte zahlen.',
    lede: 'Jede Sprache kommt mit A1 bis B1 — echtes Curriculum, kein Sprachführer.',
    levels: 'A1 – B1',
    items: [
      { flag: '🇩🇪', name: 'Deutsch' },
      { flag: '🇪🇸', name: 'Spanisch' },
      { flag: '🇧🇷', name: 'Portugiesisch' },
      { flag: '🇫🇷', name: 'Französisch' },
      { flag: '🇮🇹', name: 'Italienisch' },
      { flag: '🇬🇧', name: 'Englisch' },
    ],
  },
  footer: {
    tagline: 'Erst lernen, dann scrollen. · Sechs Sprachen, A1 bis B1 — jeden Monat neue Level',
    privacy: 'Datenschutz',
    terms: 'AGB',
    copyright: '© 2026 LangPass',
  },
  switcher: {
    ariaLabel: 'Sprache',
  },
};

// Spanish (Peninsular) — translated. Voice: tú, transit metaphor per lib/i18n/es.ts.
const es: LandingCopy = {
  seo: {
    title: 'LangPass — Bloquea las apps. Aprende el idioma.',
    description:
      'LangPass bloquea las apps que te comen las noches hasta que haces tus repeticiones. Cinco ejercicios compran 30 minutos de móvil y luego vuelve el muro.',
    ogImageAlt: 'LangPass — bloquea las apps, aprende el idioma.',
  },
  jsonLd: {
    description:
      'LangPass bloquea las apps que te comen las noches hasta que haces tus repeticiones. Cinco ejercicios rápidos compran 30 minutos de móvil y luego vuelve el muro: un torniquete de Tiempo de uso de verdad sobre tu peor hábito. Alemán, español, portugués y más.',
    offerFree: 'Gratis (el bloqueo, para siempre)',
    offerMonthly: 'LangPass Plus (mensual)',
    offerYearly: 'LangPass Plus (anual)',
  },
  nav: {
    cta: 'Conseguir acceso anticipado',
  },
  hero: {
    eyebrow: 'Tus apps, detrás del torniquete',
    variants: [
      { headline: 'Erst Deutsch, dann TikTok.', lang: 'alemán', code: 'de' },
      { headline: 'Primero español, luego Instagram.', lang: 'español', code: 'es' },
      { headline: 'Primeiro português, depois YouTube.', lang: 'portugués', code: 'pt' },
      { headline: 'D’abord le français, ensuite Netflix.', lang: 'francés', code: 'fr' },
      { headline: 'Prima l’italiano, poi Reddit.', lang: 'italiano', code: 'it' },
      { headline: 'English first, TikTok after.', lang: 'inglés', code: 'en' },
    ],
    subBefore: 'LangPass bloquea las apps que te comen las noches — hasta que hagas tus repeticiones de ',
    subAfter: '. ',
    subStrong: 'Cinco ejercicios rápidos compran 30 minutos de móvil.',
    subTail: ' Después vuelve el muro. Vas a aprender, porque no te queda otra.',
    ctaPrimary: 'Empezar mi semana gratis',
    ctaSecondary: 'Ver el trato',
  },
  pass: {
    brandLabel: 'LangPass',
    stateActive: 'ACTIVO',
    stateExpired: 'CADUCADO',
    noteActive: 'de móvil te quedan',
    noteExpired: 'cinco ejercicios y sale otro',
    passengerLabel: 'Pasajero',
    passengerName: 'TÚ',
    stubMeta: 'DE · A1',
    stamp: 'CADUCADO',
    ariaActive: 'Pase activo — pasa el ratón para verlo caducar',
    ariaExpired: 'Pase caducado',
  },
  how: {
    eyebrow: 'El trato',
    title: 'Tu dopamina ahora paga tarifa.',
    lede:
      'Cada desbloqueo cuesta ejercicios. No es un cupo diario que te ventilas a las ocho de la mañana: es un peaje, cada vez.',
    stubs: [
      {
        label: 'Torniquete · 1',
        title: 'Tus feeds se quedan bajo llave',
        body:
          'Elige las apps que te roban el tiempo. iOS las tapa a nivel de sistema — un muro de Tiempo de uso de verdad, no un aviso que apartas de un gesto.',
      },
      {
        label: 'Torniquete · 2',
        title: '90 segundos de práctica lo pagan',
        body:
          'Vocabulario y frases reales en el idioma que estás aprendiendo, a tu nivel. Responde bien y tu pase se imprime — sellado, numerado y con tu nombre.',
      },
      {
        label: 'Torniquete · 3',
        title: 'El pase caduca',
        body:
          'A los 30 minutos vuelve el muro, aunque no vuelvas a abrir LangPass. Scrollea lo suficiente y acabarás hablándolo por pura cabezonería.',
      },
    ],
  },
  shots: {
    eyebrow: 'La app',
    title: 'Hecha como un club privado, no como un aula.',
    lede: 'Cristal grafito, un solo acento ácido y un billete que querrás ganarte.',
    passAlt:
      'Pantalla de inicio de LangPass: un pase caducado con la tarifa — 5 ejercicios por 30 minutos de móvil',
    passCaption: 'El pase — caducado, sellado, esperando.',
    practiceAlt: 'Sesión de práctica de LangPass: un ejercicio de vocabulario de alemán con voz',
    practiceCaption: 'Práctica — con una voz que habla tu idioma.',
  },
  features: {
    eyebrow: 'Qué lleva dentro',
    title: 'Sesiones cortas. Plan de estudios en serio.',
    cards: [
      {
        tag: 'A nivel de sistema',
        title: 'Un muro, no un widget',
        body:
          'Bloqueo con Tiempo de uso de Apple. Tus apps siguen cerradas hasta que pagues la tarifa: sin posponer, sin apartarlo de un gesto.',
      },
      {
        tag: 'A1 → B1',
        title: 'Niveles que crecen contigo',
        body:
          'Packs cuidados que van de las primeras palabras a conversaciones reales, en cada idioma. El onboarding mide tu nivel y te coloca en el que toca.',
      },
      {
        tag: '7 tipos de ejercicio',
        title: 'Más que emparejar palabras',
        body:
          'Opción múltiple, artículos y género, respuestas escritas que perdonan las tildes, rellenar huecos, construir frases y escucha.',
      },
      {
        tag: 'Voz',
        title: 'Pronunciado como un nativo, en alto',
        body:
          'Cada palabra y cada frase se leen en alto en el idioma que aprendes, en el propio móvil. Toca lo que sea para oírlo. Y se apaga desde la biblioteca, claro.',
      },
      {
        tag: 'Sin conexión',
        title: 'Funciona sin cobertura',
        body: 'Todo el plan de estudios viene dentro de la app. A tu desbloqueo de las siete de la mañana le da igual tu cobertura.',
      },
      {
        tag: 'Plus',
        title: 'Packs temáticos con IA y modo estricto',
        body:
          'Genera vocabulario de tu mundo: pedir el brunch, jerga de la grada, el argot de tu curro. Y modo estricto: sin saltarse nada, sin piedad.',
      },
    ],
  },
  versus: {
    eyebrow: 'Por qué funciona',
    title: 'Las demás apps te suplican que las abras.',
    lede:
      'LangPass es la dueña de la puerta de las apps que ibas a abrir igual. La motivación sobra, por diseño.',
    themTitle: 'El modelo de racha y culpa',
    themPoints: [
      'Necesita que te acuerdes de que existe',
      'Una notificación de un búho triste, fácil de ignorar',
      'Objetivo diario ventilado en el desayuno y olvidado a la hora de comer',
    ],
    usTitle: 'El modelo del torniquete',
    usPoints: [
      'Te corta en pleno antojo — 10 veces al día',
      'Se vuelve a bloquear solo. No existe el “ya está por hoy”',
      'Tu peor hábito se convierte en tu horario de estudio',
    ],
  },
  pricing: {
    eyebrow: 'Tabla de tarifas',
    title: 'La primera semana es la experiencia completa. Gratis.',
    planName: 'LangPass Plus',
    planBlurb:
      'Tarifas a tu medida, modo estricto, el plan de estudios completo, packs temáticos con IA y todos los idiomas que vayamos añadiendo. El bloqueo en sí es gratis para siempre.',
    perYear: ' / año',
    monthlyNote: 'o {price}/mes',
    saveNote: ' — ahorra un {pct}% con el anual',
    trialNote: '. 7 días de prueba gratis, sin tarjeta para empezar.',
    cta: 'Conseguir acceso anticipado',
    ctaMailSubject: 'Acceso anticipado',
  },
  languages: {
    eyebrow: 'Seis idiomas',
    title: 'Elige el que van a pagar tus noches.',
    lede: 'Cada idioma llega de A1 a B1 — currículo de verdad, no un manual de frases.',
    levels: 'A1 – B1',
    items: [
      { flag: '🇩🇪', name: 'Alemán' },
      { flag: '🇪🇸', name: 'Español' },
      { flag: '🇧🇷', name: 'Portugués' },
      { flag: '🇫🇷', name: 'Francés' },
      { flag: '🇮🇹', name: 'Italiano' },
      { flag: '🇬🇧', name: 'Inglés' },
    ],
  },
  footer: {
    tagline: 'Primero aprende, luego scrollea. · Seis idiomas, de A1 a B1 — niveles nuevos cada mes',
    privacy: 'Privacidad',
    terms: 'Términos',
    copyright: '© 2026 LangPass',
  },
  switcher: {
    ariaLabel: 'Idioma',
  },
};

// French — translated. Voice: tu, transit metaphor per lib/i18n/fr.ts.
const fr: LandingCopy = {
  seo: {
    title: 'LangPass — Verrouille tes apps. Apprends la langue.',
    description:
      'LangPass verrouille les apps qui bouffent tes soirées. Cinq exercices = 30 min de téléphone, puis le mur revient. Allemand, espagnol, portugais.',
    ogImageAlt: 'LangPass — verrouille les apps, apprends la langue.',
  },
  jsonLd: {
    description:
      'LangPass verrouille les apps qui bouffent tes soirées tant que tu n’as pas fait tes exercices. Cinq exercices rapides t’achètent 30 minutes de téléphone, puis le mur revient — un vrai portillon Temps d’écran sur ta pire habitude. Allemand, espagnol, portugais et plus encore.',
    offerFree: 'Gratuit (le verrou, pour toujours)',
    offerMonthly: 'LangPass Plus (mensuel)',
    offerYearly: 'LangPass Plus (annuel)',
  },
  nav: {
    cta: 'Accès anticipé',
  },
  hero: {
    eyebrow: 'Tes apps, derrière le portillon',
    variants: [
      { headline: 'Erst Deutsch, dann TikTok.', lang: 'allemand', code: 'de' },
      { headline: 'Primero español, luego Instagram.', lang: 'espagnol', code: 'es' },
      { headline: 'Primeiro português, depois YouTube.', lang: 'portugais', code: 'pt' },
      { headline: 'D’abord le français, ensuite Netflix.', lang: 'français', code: 'fr' },
      { headline: 'Prima l’italiano, poi Reddit.', lang: 'italien', code: 'it' },
      { headline: 'English first, TikTok after.', lang: 'anglais', code: 'en' },
    ],
    subBefore:
      'LangPass verrouille les apps qui bouffent tes soirées — tant que tu n’as pas fait tes exercices en ',
    subAfter: '. ',
    subStrong: 'Cinq exercices rapides t’achètent 30 minutes de téléphone.',
    subTail: ' Puis le mur revient. Tu vas apprendre, parce que tu n’as pas le choix.',
    ctaPrimary: 'Démarrer ma semaine gratuite',
    ctaSecondary: 'Voir le deal',
  },
  pass: {
    brandLabel: 'LangPass',
    stateActive: 'VALIDE',
    stateExpired: 'EXPIRÉ',
    noteActive: 'de temps restant',
    noteExpired: 'cinq exercices, nouveau pass',
    passengerLabel: 'Passager',
    passengerName: 'TOI',
    stubMeta: 'DE · A1',
    stamp: 'EXPIRÉ',
    ariaActive: 'Pass valide — survole-le pour le voir expirer',
    ariaExpired: 'Pass expiré',
  },
  how: {
    eyebrow: 'Le deal',
    title: 'Ta dopamine a maintenant un tarif.',
    lede:
      'Chaque déverrouillage coûte des exercices. Pas un quota journalier que tu expédies à 8 h — un tarif à payer, à chaque fois.',
    stubs: [
      {
        label: 'Portillon · 1',
        title: 'Tes feeds passent sous clé',
        body:
          'Choisis les apps qui te volent ton temps. iOS les bloque au niveau système — un vrai mur Temps d’écran, pas une notif qu’on balaie d’un doigt.',
      },
      {
        label: 'Portillon · 2',
        title: '90 secondes d’exercices paient le tarif',
        body:
          'Du vrai vocabulaire et de vraies phrases dans la langue que tu apprends, calibrés sur ton niveau. Réponds bien et ton pass s’imprime — composté, numéroté, à ton nom.',
      },
      {
        label: 'Portillon · 3',
        title: 'Le pass expire',
        body:
          '30 minutes plus tard, le mur est de retour — même si tu ne rouvres jamais LangPass. Scrolle assez et tu deviendras bilingue par pure rancune.',
      },
    ],
  },
  shots: {
    eyebrow: 'L’app',
    title: 'Conçue comme un club privé, pas comme une salle de classe.',
    lede: 'Verre graphite, un seul accent acide, et un ticket que tu auras envie de mériter.',
    passAlt:
      'Écran d’accueil LangPass : un pass expiré avec le tarif — 5 exercices pour 30 minutes de téléphone',
    passCaption: 'Le pass — expiré, composté, en attente.',
    practiceAlt:
      'Session d’entraînement LangPass : un exercice de vocabulaire allemand avec lecture audio',
    practiceCaption: 'L’entraînement — avec une voix qui parle ta langue.',
  },
  features: {
    eyebrow: 'Ce qu’il y a dedans',
    title: 'Sessions courtes. Programme sérieux.',
    cards: [
      {
        tag: 'Niveau système',
        title: 'Un mur, pas un widget',
        body:
          'Blocage par Temps d’écran d’Apple. Tes apps restent verrouillées tant que le tarif n’est pas payé — pas de report, pas de balayage.',
      },
      {
        tag: 'A1 → B1',
        title: 'Des niveaux qui grandissent avec toi',
        body:
          'Des packs choisis, des premiers mots aux vraies conversations, langue par langue. L’onboarding lit ta difficulté et te place au bon niveau.',
      },
      {
        tag: '7 types d’exercices',
        title: 'Pas juste des mots à relier',
        body:
          'QCM, articles à genrer, réponses écrites avec correction tolérante aux accents, textes à trous, phrases à reconstruire, écoute.',
      },
      {
        tag: 'Voix',
        title: 'Prononcé par un natif, à voix haute',
        body:
          'Chaque mot et chaque phrase lus à voix haute sur l’appareil, dans la langue cible. Touche n’importe quoi pour l’entendre. Désactivable dans la bibliothèque, évidemment.',
      },
      {
        tag: 'Hors ligne',
        title: 'Marche sans réseau',
        body: 'Tout le programme est embarqué dans l’app. Ton déverrouillage de 7 h se moque de ta couverture.',
      },
      {
        tag: 'Plus',
        title: 'Packs thématiques IA & mode strict',
        body:
          'Génère le vocabulaire de ton monde à toi — commander un brunch, l’argot des soirs de match, le jargon de ton boulot. Et le mode strict : aucune impasse, aucune pitié.',
      },
    ],
  },
  versus: {
    eyebrow: 'Pourquoi ça marche',
    title: 'Toutes les autres apps te supplient de les ouvrir.',
    lede:
      'LangPass tient la porte des apps que tu allais ouvrir de toute façon. La motivation est optionnelle, par construction.',
    themTitle: 'Le modèle série-et-culpabilité',
    themPoints: [
      'Il faut d’abord que tu te souviennes qu’elle existe',
      'Une notif de hibou triste, vite ignorée',
      'Objectif du jour expédié au petit-déj, oublié à midi',
    ],
    usTitle: 'Le modèle portillon',
    usPoints: [
      'Te coupe au pic de manque — 10 fois par jour',
      'Se reverrouille tout seul. Il n’y a pas de « fini pour aujourd’hui »',
      'Ta pire habitude devient ton emploi du temps de révisions',
    ],
  },
  pricing: {
    eyebrow: 'Grille tarifaire',
    title: 'La première semaine, c’est l’expérience complète. Gratuite.',
    planName: 'LangPass Plus',
    planBlurb:
      'Tarifs sur mesure, mode strict, tout le programme, les packs thématiques IA et chaque langue qu’on ajoute. Le verrou, lui, reste gratuit pour toujours.',
    perYear: ' / an',
    monthlyNote: 'ou {price}/mois',
    saveNote: ' — {pct} % d’économie sur l’année',
    trialNote: '. 7 jours d’essai gratuit, sans carte pour démarrer.',
    cta: 'Accès anticipé',
    ctaMailSubject: 'Accès anticipé',
  },
  languages: {
    eyebrow: 'Six langues',
    title: 'Choisis celle que tes soirées vont payer.',
    lede: 'Chaque langue va de A1 à B1 — un vrai programme, pas un guide de conversation.',
    levels: 'A1 – B1',
    items: [
      { flag: '🇩🇪', name: 'Allemand' },
      { flag: '🇪🇸', name: 'Espagnol' },
      { flag: '🇧🇷', name: 'Portugais' },
      { flag: '🇫🇷', name: 'Français' },
      { flag: '🇮🇹', name: 'Italien' },
      { flag: '🇬🇧', name: 'Anglais' },
    ],
  },
  footer: {
    tagline:
      'Apprends d’abord, scrolle après. · Six langues, de A1 à B1 — de nouveaux niveaux chaque mois',
    privacy: 'Confidentialité',
    terms: 'Conditions',
    copyright: '© 2026 LangPass',
  },
  switcher: {
    ariaLabel: 'Langue',
  },
};

// Italian — translated. Voice: tu, transit metaphor per lib/i18n/it.ts.
const it: LandingCopy = {
  seo: {
    title: 'LangPass — Blocca le app. Impara la lingua.',
    description:
      'LangPass blocca le app che ti mangiano le serate finché non ti sei allenato. Cinque esercizi valgono 30 minuti di telefono, poi il muro torna su.',
    ogImageAlt: 'LangPass — blocca le app, impara la lingua.',
  },
  jsonLd: {
    description:
      'LangPass blocca le app che ti mangiano le serate finché non ti sei allenato nella lingua che studi. Cinque esercizi veloci valgono 30 minuti di telefono, poi il muro torna su — un tornello vero, con Tempo di utilizzo, sul tuo vizio peggiore. Tedesco, spagnolo, portoghese e altre.',
    offerFree: 'Gratis (il blocco, per sempre)',
    offerMonthly: 'LangPass Plus (mensile)',
    offerYearly: 'LangPass Plus (annuale)',
  },
  nav: {
    cta: 'Accesso anticipato',
  },
  hero: {
    eyebrow: 'Le tue app, dietro al tornello',
    variants: [
      { headline: 'Erst Deutsch, dann TikTok.', lang: 'tedesco', code: 'de' },
      { headline: 'Primero español, luego Instagram.', lang: 'spagnolo', code: 'es' },
      { headline: 'Primeiro português, depois YouTube.', lang: 'portoghese', code: 'pt' },
      { headline: 'D’abord le français, ensuite Netflix.', lang: 'francese', code: 'fr' },
      { headline: 'Prima l’italiano, poi Reddit.', lang: 'italiano', code: 'it' },
      { headline: 'English first, TikTok after.', lang: 'inglese', code: 'en' },
    ],
    subBefore: 'LangPass blocca le app che ti mangiano le serate — finché non ti sei allenato in ',
    subAfter: '. ',
    subStrong: 'Cinque esercizi veloci valgono 30 minuti di telefono.',
    subTail: ' Poi il muro torna su. Imparerai — perché non puoi farne a meno.',
    ctaPrimary: 'Inizia la settimana gratis',
    ctaSecondary: 'Guarda il patto',
  },
  pass: {
    brandLabel: 'LangPass',
    stateActive: 'VALIDO',
    stateExpired: 'SCADUTO',
    noteActive: 'di telefono rimasti',
    noteExpired: 'cinque esercizi, un altro pass',
    passengerLabel: 'Passeggero',
    passengerName: 'TU',
    stubMeta: 'DE · A1',
    stamp: 'SCADUTO',
    ariaActive: 'Pass valido — passa sopra per vederlo scadere',
    ariaExpired: 'Pass scaduto',
  },
  how: {
    eyebrow: 'Il patto',
    title: 'La tua dopamina adesso ha una tariffa.',
    lede:
      'Ogni sblocco costa esercizi. Non una quota giornaliera che liquidi alle otto di mattina — un pedaggio, tutte le volte.',
    stubs: [
      {
        label: 'Tornello · 1',
        title: 'I tuoi feed finiscono sotto chiave',
        body:
          'Scegli le app che ti rubano il tempo. iOS le blocca a livello di sistema — un muro vero di Tempo di utilizzo, non un avviso che scacci con un dito.',
      },
      {
        label: 'Tornello · 2',
        title: '90 secondi di esercizi pagano la tariffa',
        body:
          'Vocaboli e frasi vere nella lingua che stai imparando, tarati sul tuo livello. Rispondi bene e il tuo pass viene stampato — obliterato, numerato, con il tuo nome sopra.',
      },
      {
        label: 'Tornello · 3',
        title: 'Il pass scade',
        body:
          'Dopo 30 minuti il muro è di nuovo su — anche se LangPass non lo riapri più. Scrolla abbastanza e diventerai fluente per ripicca.',
      },
    ],
  },
  shots: {
    eyebrow: 'L’app',
    title: 'Fatta come un club privato, non come un’aula.',
    lede: 'Vetro grafite, un solo accento acido e un biglietto che ti verrà voglia di guadagnarti.',
    passAlt:
      'Schermata principale di LangPass: un pass scaduto con la tariffa — 5 esercizi per 30 minuti di telefono',
    passCaption: 'Il pass — scaduto, timbrato, in attesa.',
    practiceAlt: 'Sessione di allenamento LangPass: un esercizio di vocaboli tedeschi con riproduzione vocale',
    practiceCaption: 'Allenamento — con una voce che parla la tua lingua.',
  },
  features: {
    eyebrow: 'Cosa c’è dentro',
    title: 'Sessioni brevi. Programma serio.',
    cards: [
      {
        tag: 'Di sistema',
        title: 'Un muro, non un widget',
        body:
          'Blocco con Tempo di utilizzo di Apple. Le tue app restano chiuse finché non paghi la tariffa — niente rinvii, niente scorciatoie.',
      },
      {
        tag: 'A1 → B1',
        title: 'Livelli che crescono con te',
        body:
          'Pacchetti curati, dalle prime parole alle conversazioni vere, per ogni lingua. L’onboarding legge la tua difficoltà e ti mette al livello giusto.',
      },
      {
        tag: '7 tipi di esercizio',
        title: 'Non solo abbinare parole',
        body:
          'Scelta multipla, articoli e generi, risposte scritte con correzione che perdona gli accenti, completamento, costruzione di frasi, ascolto.',
      },
      {
        tag: 'Voce',
        title: 'Pronuncia madrelingua, ad alta voce',
        body:
          'Ogni parola e ogni frase lette ad alta voce sul telefono, nella lingua che studi. Tocca qualsiasi cosa per sentirla. Nella libreria la spegni, ovviamente.',
      },
      {
        tag: 'Offline',
        title: 'Funziona senza campo',
        body: 'Tutto il programma è dentro l’app. Al tuo sblocco delle 7 di mattina non importa nulla della tua linea.',
      },
      {
        tag: 'Plus',
        title: 'Pacchetti AI a tema e modalità severa',
        body:
          'Genera vocaboli per il tuo mondo — ordinare il brunch, lo slang da stadio, il gergo del tuo lavoro. E la modalità severa: niente salti, nessuna pietà.',
      },
    ],
  },
  versus: {
    eyebrow: 'Perché funziona',
    title: 'Tutte le altre app ti supplicano di aprirle.',
    lede:
      'LangPass comanda la porta delle app che aprivi comunque. La motivazione è opzionale, di proposito.',
    themTitle: 'Il modello streak e sensi di colpa',
    themPoints: [
      'Devi ricordarti che esiste',
      'Una notifica triste col gufo, facile da ignorare',
      'Obiettivo del giorno liquidato a colazione, dimenticato a pranzo',
    ],
    usTitle: 'Il modello tornello',
    usPoints: [
      'Ti interrompe quando la voglia è al massimo — 10 volte al giorno',
      'Si richiude da solo. Non esiste il “per oggi ho finito”',
      'Il tuo vizio peggiore diventa il tuo piano di studio',
    ],
  },
  pricing: {
    eyebrow: 'Tariffario',
    title: 'La prima settimana è tutto quanto. Gratis.',
    planName: 'LangPass Plus',
    planBlurb:
      'Tariffe su misura, modalità severa, il programma completo, i pacchetti AI a tema e ogni lingua che aggiungiamo. Il blocco, di suo, resta gratis per sempre.',
    perYear: ' / anno',
    monthlyNote: 'oppure {price}/mese',
    saveNote: ' — risparmi il {pct}% sull’anno',
    trialNote: '. 7 giorni di prova gratis, senza carta.',
    cta: 'Accesso anticipato',
    ctaMailSubject: 'Accesso anticipato',
  },
  languages: {
    eyebrow: 'Sei lingue',
    title: 'Scegli quella che pagheranno le tue serate.',
    lede: 'Ogni lingua va da A1 a B1 — un programma vero, non un frasario.',
    levels: 'A1 – B1',
    items: [
      { flag: '🇩🇪', name: 'Tedesco' },
      { flag: '🇪🇸', name: 'Spagnolo' },
      { flag: '🇧🇷', name: 'Portoghese' },
      { flag: '🇫🇷', name: 'Francese' },
      { flag: '🇮🇹', name: 'Italiano' },
      { flag: '🇬🇧', name: 'Inglese' },
    ],
  },
  footer: {
    tagline: 'Prima impari, poi scrolli. · Sei lingue, da A1 a B1 — nuovi livelli ogni mese',
    privacy: 'Privacy',
    terms: 'Termini',
    copyright: '© 2026 LangPass',
  },
  switcher: {
    ariaLabel: 'Lingua',
  },
};

// Brazilian Portuguese — translated. Voice: você, transit metaphor per ../langpass-mobile/lib/i18n/pt.ts.
const pt: LandingCopy = {
  seo: {
    title: 'LangPass — Tranque os apps. Aprenda o idioma.',
    description:
      'O LangPass tranca os apps que comem suas noites até você treinar o idioma. Cinco exercícios compram 30 minutos de celular. Depois a catraca volta.',
    ogImageAlt: 'LangPass — tranque os apps, aprenda o idioma.',
  },
  jsonLd: {
    description:
      'O LangPass tranca os apps que comem suas noites até você treinar o idioma. Cinco exercícios rápidos compram 30 minutos de celular, depois a catraca volta — uma catraca de verdade, no Tempo de Uso, em cima do seu pior vício. Alemão, espanhol, português e mais.',
    offerFree: 'Grátis (a tranca, pra sempre)',
    offerMonthly: 'LangPass Plus (mensal)',
    offerYearly: 'LangPass Plus (anual)',
  },
  nav: {
    cta: 'Quero acesso antecipado',
  },
  hero: {
    eyebrow: 'Seus apps, atrás da catraca',
    variants: [
      { headline: 'Erst Deutsch, dann TikTok.', lang: 'alemão', code: 'de' },
      { headline: 'Primero español, luego Instagram.', lang: 'espanhol', code: 'es' },
      { headline: 'Primeiro português, depois YouTube.', lang: 'português', code: 'pt' },
      { headline: 'D’abord le français, ensuite Netflix.', lang: 'francês', code: 'fr' },
      { headline: 'Prima l’italiano, poi Reddit.', lang: 'italiano', code: 'it' },
      { headline: 'English first, TikTok after.', lang: 'inglês', code: 'en' },
    ],
    subBefore: 'O LangPass tranca os apps que comem suas noites — até você treinar seu ',
    subAfter: '. ',
    subStrong: 'Cinco exercícios rápidos compram 30 minutos de celular.',
    subTail: ' Depois a catraca volta. Você vai aprender, porque não tem como escapar.',
    ctaPrimary: 'Começar minha semana grátis',
    ctaSecondary: 'Ver o trato',
  },
  pass: {
    brandLabel: 'LangPass',
    stateActive: 'ATIVO',
    stateExpired: 'VENCIDO',
    noteActive: 'de celular restantes',
    noteExpired: 'cinco exercícios e sai outro',
    passengerLabel: 'Passageiro',
    passengerName: 'VOCÊ',
    stubMeta: 'DE · A1',
    stamp: 'VENCIDO',
    ariaActive: 'Passe ativo — aponte o cursor para ver ele vencer',
    ariaExpired: 'Passe vencido',
  },
  how: {
    eyebrow: 'O trato',
    title: 'Agora sua dopamina paga tarifa.',
    lede:
      'Cada liberação custa exercícios. Não é meta diária que você zera às 8 da manhã — é pedágio, toda vez.',
    stubs: [
      {
        label: 'Catraca · 1',
        title: 'Seus feeds ganham uma tranca',
        body:
          'Escolha os apps que roubam seu tempo. O iOS bloqueia no nível do sistema — muro de Tempo de Uso de verdade, não um avisinho que você tira com um deslize.',
      },
      {
        label: 'Catraca · 2',
        title: '90 segundos de treino pagam a tarifa',
        body:
          'Vocabulário e frases de verdade no idioma que você está aprendendo, no seu nível. Acertou, seu passe é impresso — carimbado, numerado, com seu nome nele.',
      },
      {
        label: 'Catraca · 3',
        title: 'O passe vence',
        body:
          '30 minutos depois o muro está de volta — mesmo que você nunca mais abra o LangPass. Role o suficiente e você fica fluente de raiva.',
      },
    ],
  },
  shots: {
    eyebrow: 'O app',
    title: 'Feito como clube fechado, não como sala de aula.',
    lede: 'Vidro grafite, um único tom ácido e um bilhete que você vai querer conquistar.',
    passAlt:
      'Tela inicial do LangPass: um passe vencido com a tarifa — 5 exercícios por 30 minutos de celular',
    passCaption: 'O passe — vencido, carimbado, esperando.',
    practiceAlt: 'Sessão de treino do LangPass: exercício de vocabulário em alemão com áudio',
    practiceCaption: 'Treino — com uma voz que fala o idioma de verdade.',
  },
  features: {
    eyebrow: 'O que tem dentro',
    title: 'Sessões curtas. Currículo sério.',
    cards: [
      {
        tag: 'No sistema',
        title: 'Um muro, não um widget',
        body:
          'Bloqueio do Tempo de Uso da Apple. Seus apps ficam trancados até a tarifa ser paga — sem soneca, sem deslizar pro lado.',
      },
      {
        tag: 'A1 → B1',
        title: 'Níveis que crescem com você',
        body:
          'Pacotes selecionados, das primeiras palavras a conversas de verdade, em cada idioma. O onboarding lê sua dificuldade e te coloca no nível certo.',
      },
      {
        tag: '7 tipos de exercício',
        title: 'Não é só ligar palavrinha com palavrinha',
        body:
          'Múltipla escolha, artigo e gênero, resposta escrita com correção que perdoa acento, lacuna, montar frase, escuta.',
      },
      {
        tag: 'Voz',
        title: 'Falado em voz alta, do jeito nativo',
        body:
          'Cada palavra e cada frase lida em voz alta no próprio aparelho, no idioma que você aprende. Toque em qualquer coisa pra ouvir. Dá pra desligar, claro.',
      },
      {
        tag: 'Offline',
        title: 'Funciona sem sinal',
        body: 'O currículo inteiro vem dentro do app. Sua liberação das 7 da manhã não liga pra sua operadora.',
      },
      {
        tag: 'Plus',
        title: 'Pacotes de temas com IA e modo linha-dura',
        body:
          'Gere vocabulário do seu mundo — pedido no brunch, gíria de jogo, o jargão do seu trabalho. E o modo linha-dura: sem pular, sem dó.',
      },
    ],
  },
  versus: {
    eyebrow: 'Por que funciona',
    title: 'Todo outro app implora pra você abrir.',
    lede:
      'O LangPass é dono da porta dos apps que você ia abrir de qualquer jeito. Motivação aqui é opcional, de propósito.',
    themTitle: 'O modelo da ofensiva e da culpa',
    themPoints: [
      'Depende de você lembrar que ele existe',
      'Uma notificação de coruja triste, fácil de ignorar',
      'Meta diária zerada no café da manhã, esquecida no almoço',
    ],
    usTitle: 'O modelo da catraca',
    usPoints: [
      'Te interrompe no pico da fissura — 10× por dia',
      'Tranca sozinho de novo. Não existe “já fiz hoje”',
      'Seu pior vício vira sua grade de estudo',
    ],
  },
  pricing: {
    eyebrow: 'Tabela de tarifas',
    title: 'A primeira semana é a experiência completa. De graça.',
    planName: 'LangPass Plus',
    planBlurb:
      'Tarifa sob medida, modo linha-dura, o currículo completo, pacotes de temas com IA e todo idioma que a gente lançar. A tranca em si é grátis pra sempre.',
    perYear: ' / ano',
    monthlyNote: 'ou {price}/mês',
    saveNote: ' — economize {pct}% no ano',
    trialNote: '. 7 dias grátis, sem cartão pra começar.',
    cta: 'Quero acesso antecipado',
    ctaMailSubject: 'Acesso antecipado',
  },
  languages: {
    eyebrow: 'Seis idiomas',
    title: 'Escolha o que suas noites vão pagar.',
    lede: 'Todo idioma vai de A1 a B1 — currículo de verdade, não um guia de frases.',
    levels: 'A1 – B1',
    items: [
      { flag: '🇩🇪', name: 'Alemão' },
      { flag: '🇪🇸', name: 'Espanhol' },
      { flag: '🇧🇷', name: 'Português' },
      { flag: '🇫🇷', name: 'Francês' },
      { flag: '🇮🇹', name: 'Italiano' },
      { flag: '🇬🇧', name: 'Inglês' },
    ],
  },
  footer: {
    tagline: 'Aprenda primeiro, depois scroll. · Seis idiomas, de A1 a B1 — níveis novos todo mês',
    privacy: 'Privacidade',
    terms: 'Termos',
    copyright: '© 2026 LangPass',
  },
  switcher: {
    ariaLabel: 'Idioma',
  },
};

export const COPY: Record<Locale, LandingCopy> = { en, de, es, fr, it, pt };
