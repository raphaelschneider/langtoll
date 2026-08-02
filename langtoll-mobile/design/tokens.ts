// Design tokens — LangPass's visual language: "the members-club pass".
// Dark, luminous, glass all over. Obsidian-violet base, a living aurora glow,
// and acid lime as the single signature accent — the color of an earned pass.
// Editorial contrast: Fraunces serif display over Inter UI.

export const palette = {
  // dark (primary scheme — the app lives at night)
  // Lifted graphite: a slate charcoal clearly off pure black, so surfaces read
  // as material rather than void. The lime accent stays the only real hue;
  // aurora glows in desaturated slate for depth, not color.
  inkD: '#F4F4F7', // near-white, neutral
  inkSoftD: '#AEAEBA',
  inkFaintD: '#70707C',
  inkWarmD: '#E2E2E8',
  paperD: '#17171C', // slate charcoal
  surfaceD: '#222229',
  surfaceAltD: '#2B2B34',
  lineD: 'rgba(255,255,255,0.11)',

  // signature
  lime: '#C8FF4D', // acid lime — the pass, the CTA, "correct"
  limeSoft: '#E5FFA3',
  mint: '#5FE8B0', // unlocked / calm success
  coral: '#FF5C7A', // wrong answer / danger
  amber: '#FFC24D', // "almost" / warnings
  onLime: '#101403', // text on lime surfaces
  white: '#FFFFFF',

  // light — daylight version of the same graphite/lime system: warm-neutral
  // paper, near-black ink, no violet cast.
  ink: '#17181C',
  inkSoft: '#565863',
  inkFaint: '#8A8C97',
  inkWarm: '#2E3038',
  paper: '#F1F1EE', // warm off-white
  surface: '#FFFFFF',
  surfaceAlt: '#F8F8F5',
  line: '#E3E3DE',
} as const;

export type ColorScheme = 'light' | 'dark';

export interface Theme {
  scheme: ColorScheme;
  ink: string;
  inkSoft: string;
  inkFaint: string;
  inkWarm: string;
  paper: string;
  surface: string;
  surfaceAlt: string;
  line: string;
  /** Subtle raised fill over the ground (adapts: white-alpha dark, ink-alpha light). */
  fill: string;
  /** Stronger fill for tracks, inactive segments, hairline chips. */
  fillStrong: string;
  /** Signature accent (acid lime): CTAs, the active pass, correct answers. */
  accent: string;
  accentSoft: string;
  /** Ink to use on top of accent-filled surfaces. */
  onAccent: string;
  /** Calm success / unlocked state. */
  pine: string;
  pineSoft: string;
  amber: string;
  /** Wrong answers, destructive. */
  danger: string;
  /** Aurora background gradient stops (deep base → violet glow). */
  aurora: [string, string, string, string];
  /** Glass tint for blurred surfaces. */
  glassTint: string;
  glassBorder: string;
}

export const darkTheme: Theme = {
  scheme: 'dark',
  ink: palette.inkD,
  inkSoft: palette.inkSoftD,
  inkFaint: palette.inkFaintD,
  inkWarm: palette.inkWarmD,
  paper: palette.paperD,
  surface: palette.surfaceD,
  surfaceAlt: palette.surfaceAltD,
  line: palette.lineD,
  fill: 'rgba(255,255,255,0.05)',
  fillStrong: 'rgba(255,255,255,0.11)',
  accent: palette.lime,
  accentSoft: palette.limeSoft,
  onAccent: palette.onLime,
  pine: palette.mint,
  pineSoft: '#2E7A5C',
  amber: palette.amber,
  danger: palette.coral,
  aurora: ['#141419', '#20202A', '#32323F', '#4C4C60'],
  glassTint: 'rgba(34,34,41,0.42)',
  glassBorder: 'rgba(255,255,255,0.12)',
};

export const lightTheme: Theme = {
  scheme: 'light',
  ink: palette.ink,
  inkSoft: palette.inkSoft,
  inkFaint: palette.inkFaint,
  inkWarm: palette.inkWarm,
  paper: palette.paper,
  surface: palette.surface,
  surfaceAlt: palette.surfaceAlt,
  line: palette.line,
  fill: 'rgba(20,22,28,0.045)',
  fillStrong: 'rgba(20,22,28,0.08)',
  accent: '#8FD400', // lime, deepened so it holds against white but stays punchy
  accentSoft: '#EAFFB8',
  onAccent: '#141A00',
  pine: '#178A5E',
  pineSoft: '#7FD6B0',
  amber: '#D99A4E',
  danger: '#E04463',
  aurora: ['#F1F1EE', '#EAEAE4', '#DEDED6', '#C8CBBA'],
  glassTint: 'rgba(255,255,255,0.55)',
  glassBorder: 'rgba(255,255,255,0.7)',
};

// Spacing — 4pt base grid.
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  pill: 999,
} as const;

// Typography. Display = Fraunces (serif), UI/body = Inter.
export const font = {
  display: 'Fraunces_600SemiBold',
  displayLight: 'Fraunces_400Regular',
  serifItalic: 'Fraunces_500Medium_Italic',
  body: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
} as const;

export const type = {
  hero: { fontFamily: font.display, fontSize: 42, lineHeight: 46, letterSpacing: -0.8 },
  title: { fontFamily: font.display, fontSize: 28, lineHeight: 33, letterSpacing: -0.4 },
  headline: { fontFamily: font.display, fontSize: 22, lineHeight: 27, letterSpacing: -0.2 },
  serif: { fontFamily: font.displayLight, fontSize: 18, lineHeight: 27 },
  body: { fontFamily: font.body, fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: font.medium, fontSize: 16, lineHeight: 24 },
  callout: { fontFamily: font.body, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: font.semibold, fontSize: 13, lineHeight: 16, letterSpacing: 0.2 },
  caption: { fontFamily: font.medium, fontSize: 12, lineHeight: 16, letterSpacing: 0.3 },
  overline: {
    fontFamily: font.semibold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.6,
    textTransform: 'uppercase' as const,
  },
  metric: { fontFamily: font.display, fontSize: 40, lineHeight: 44, letterSpacing: -0.5 },
} as const;

// Shadows. On the dark scheme depth comes from glow, not drop shadows.
export const shadow = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },
  soft: {
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  /** Lime halo for the primary CTA / active pass. */
  glow: {
    shadowColor: palette.lime,
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
} as const;
