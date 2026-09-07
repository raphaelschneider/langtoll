// The admin's palette and type — LangToll's "day service" (design/tokens.ts, light theme):
// mineral ticket-stock paper, warm printing ink, deep rail-teal accent, validation green,
// stamp vermilion. One module so the page, the charts and the copy button agree.
export const BRAND = {
  ink: '#191A17',
  inkSoft: '#565A54',
  inkFaint: '#8C8D81',
  paper: '#E7E0CF',
  surface: '#F1ECDE',
  surfaceAlt: '#EDE6D6',
  line: 'rgba(25,26,23,0.14)',
  /** rail teal, deep enough to hold on paper — CTAs, active tab, the brand word */
  accent: '#1C5A66',
  /** the bright night-service teal, for bars and highlights on cream */
  accentBright: '#5CBDCD',
  onAccent: '#F1ECDE',
  /** validation green — good numbers */
  pine: '#2F9E5B',
  amber: '#B5852A',
  /** stamp vermilion — failures, destructive */
  danger: '#C63A24',
} as const;

export const FONT = {
  display: 'var(--font-archivo), ui-sans-serif, system-ui',
  mono: 'var(--font-jetbrains), ui-monospace, SFMono-Regular, monospace',
} as const;
