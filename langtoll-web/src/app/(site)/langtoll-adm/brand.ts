// The admin's palette and type — LangToll's tokens, following the system colour scheme the way
// the landing does: ticket-stock paper and printing ink by day, rail navy and cream by night.
// Every BRAND value is a CSS variable, so the same inline styles (and SVG fills) flip with the
// scheme; the variables are declared once by BRAND_CSS on the admin's <main class="adm">.
export const BRAND = {
  ink: 'var(--adm-ink)',
  inkSoft: 'var(--adm-soft)',
  inkFaint: 'var(--adm-faint)',
  paper: 'var(--adm-paper)',
  surface: 'var(--adm-surface)',
  surfaceAlt: 'var(--adm-surface2)',
  line: 'var(--adm-line)',
  /** rail teal — CTAs, active tab, the brand word */
  accent: 'var(--adm-rail)',
  /** ink to use on top of accent-filled surfaces */
  onAccent: 'var(--adm-on-rail)',
  /** validation green — good numbers */
  pine: 'var(--adm-valid)',
  amber: 'var(--adm-amber)',
  /** stamp vermilion — failures, destructive */
  danger: 'var(--adm-stamp)',
} as const;

export const FONT = {
  display: 'var(--font-archivo), ui-sans-serif, system-ui',
  mono: 'var(--font-jetbrains), ui-monospace, SFMono-Regular, monospace',
} as const;

export const BRAND_CSS = `
.adm {
  --adm-paper: #E7E0CF; --adm-surface: #F1ECDE; --adm-surface2: #EDE6D6;
  --adm-ink: #191A17; --adm-soft: #565A54; --adm-faint: #8C8D81;
  --adm-line: rgba(25, 26, 23, 0.14);
  --adm-rail: #1C5A66; --adm-on-rail: #F1ECDE;
  --adm-valid: #2F9E5B; --adm-amber: #B5852A; --adm-stamp: #C63A24;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  .adm {
    --adm-paper: #0F161B; --adm-surface: #17222B; --adm-surface2: #1C2A34;
    --adm-ink: #ECE7D8; --adm-soft: #A2B2B6; --adm-faint: #647579;
    --adm-line: rgba(236, 231, 216, 0.16);
    --adm-rail: #5CBDCD; --adm-on-rail: #0B1417;
    --adm-valid: #4FC07C; --adm-amber: #D9A44E; --adm-stamp: #F0684E;
    color-scheme: dark;
  }
}
.adm input, .adm select, .adm textarea { color: var(--adm-ink); background: var(--adm-surface); border-color: var(--adm-line); }
.adm code { color: var(--adm-ink); }
`;
