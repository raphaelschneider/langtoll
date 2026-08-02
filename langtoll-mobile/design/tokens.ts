// Design tokens — LangToll's visual language: "the transit travelcard".
// A printed-ticket identity, matched to the landing page: mineral ticket-stock paper (day
// service) and deep rail-navy (night service), a deep rail-teal accent, a validation-green
// "correct/valid", and a stamp-vermilion "wrong/expired". Type is a heavy grotesque (Archivo)
// for signage headlines and a monospace (JetBrains Mono) for ticket data, labels and metrics.

export const palette = {
  // dark — "night service": deep rail-navy ground, paper-coloured ink.
  inkD: '#ECE7D8',
  inkSoftD: '#A2B2B6',
  inkFaintD: '#647579',
  inkWarmD: '#ECE7D8',
  paperD: '#0F161B', // rail navy
  surfaceD: '#17222B',
  surfaceAltD: '#1C2A34',
  lineD: 'rgba(236,231,216,0.16)',

  // signature (key names kept for compatibility; values are the travelcard identity).
  lime: '#5CBDCD',    // rail teal (bright, for dark) — accent / active pass / CTA
  limeSoft: '#A9DCE5',
  mint: '#4FC07C',    // validation green — "correct" / unlocked
  coral: '#F0684E',   // stamp vermilion — wrong / expired / danger
  amber: '#D9A44E',
  onLime: '#0B1417',  // ink on bright-teal surfaces
  white: '#FFFFFF',

  // light — "day service": mineral ticket-stock paper, warm printing ink.
  ink: '#191A17',
  inkSoft: '#565A54',
  inkFaint: '#8C8D81',
  inkWarm: '#2E302A',
  paper: '#E7E0CF', // buff ticket stock
  surface: '#F1ECDE',
  surfaceAlt: '#EDE6D6',
  line: 'rgba(25,26,23,0.14)',
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
  /** Subtle raised fill over the ground (adapts: paper-alpha dark, ink-alpha light). */
  fill: string;
  /** Stronger fill for tracks, inactive segments, hairline chips. */
  fillStrong: string;
  /** Signature accent (rail teal): CTAs, the active pass, correct answers. */
  accent: string;
  accentSoft: string;
  /** Ink to use on top of accent-filled surfaces. */
  onAccent: string;
  /** Calm success / unlocked / valid state (validation green). */
  pine: string;
  pineSoft: string;
  amber: string;
  /** Wrong answers, expired, destructive (stamp vermilion). */
  danger: string;
  /** Background gradient stops (ground → slightly lifted). */
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
  fill: 'rgba(236,231,216,0.05)',
  fillStrong: 'rgba(236,231,216,0.12)',
  accent: palette.lime,
  accentSoft: palette.limeSoft,
  onAccent: palette.onLime,
  pine: palette.mint,
  pineSoft: '#2E7A55',
  amber: palette.amber,
  danger: palette.coral,
  aurora: ['#0C1216', '#0F161B', '#16212A', '#22323C'],
  glassTint: 'rgba(23,34,43,0.45)',
  glassBorder: 'rgba(236,231,216,0.12)',
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
  fill: 'rgba(25,26,23,0.045)',
  fillStrong: 'rgba(25,26,23,0.09)',
  accent: '#1C5A66', // rail teal, deep enough to hold on paper
  accentSoft: '#CDE9EE',
  onAccent: '#F1ECDE',
  pine: '#2F9E5B',
  pineSoft: '#7FD1A0',
  amber: '#B5852A',
  danger: '#C63A24',
  aurora: ['#E7E0CF', '#E2DBC8', '#D8D0BB', '#C7BFA6'],
  glassTint: 'rgba(241,236,222,0.55)',
  glassBorder: 'rgba(255,255,255,0.6)',
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

// Typography. Display/signage = Archivo (grotesque); ticket data/labels/metrics = JetBrains
// Mono; body/UI = Archivo regular. (Fraunces + Inter are retired.)
export const font = {
  display: 'Archivo_800ExtraBold',
  displayLight: 'Archivo_600SemiBold',
  serifItalic: 'Archivo_500Medium', // legacy key — now the grotesque medium
  body: 'Archivo_400Regular',
  medium: 'Archivo_500Medium',
  semibold: 'Archivo_600SemiBold',
  mono: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
} as const;

export const type = {
  hero: { fontFamily: font.display, fontSize: 42, lineHeight: 46, letterSpacing: -1.2 },
  title: { fontFamily: font.display, fontSize: 28, lineHeight: 33, letterSpacing: -0.8 },
  headline: { fontFamily: font.display, fontSize: 22, lineHeight: 27, letterSpacing: -0.4 },
  serif: { fontFamily: font.body, fontSize: 18, lineHeight: 27 },
  body: { fontFamily: font.body, fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: font.medium, fontSize: 16, lineHeight: 24 },
  callout: { fontFamily: font.body, fontSize: 15, lineHeight: 22 },
  // ticket data / labels — monospace, the way a printed ticket sets them.
  label: { fontFamily: font.mono, fontSize: 13, lineHeight: 16, letterSpacing: 0.4 },
  caption: { fontFamily: font.mono, fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
  overline: {
    fontFamily: font.mono,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.8,
    textTransform: 'uppercase' as const,
  },
  metric: { fontFamily: font.mono, fontSize: 40, lineHeight: 44, letterSpacing: -1 },
} as const;

// Shadows. Depth from real drop shadows on both schemes (the ticket is a printed object).
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
  /** Rail-teal halo for the primary CTA / active pass. */
  glow: {
    shadowColor: palette.lime,
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
} as const;
