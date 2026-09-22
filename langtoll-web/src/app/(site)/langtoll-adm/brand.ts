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

/* Phones. The page is inline-styled for desktop; these override the sizes that
   force sideways scrolling: 32px gutters, 300-380px minimum panel widths, the
   40px title, one KPI card per row. Wide tables still scroll inside their card,
   with the first column (the device) pinned so a row stays readable. */
@media (max-width: 640px) {
  .adm { padding: 20px 14px 40px !important; }
  .adm .adm-h1 { font-size: 30px !important; margin: 2px 0 14px !important; }
  .adm .adm-h2 { font-size: 20px !important; }
  .adm .adm-tabs { overflow-x: auto; scrollbar-width: none; margin-bottom: 18px !important; }
  .adm .adm-tabs a { padding: 10px 12px !important; white-space: nowrap; }
  .adm .adm-grid { gap: 10px !important; }
  .adm .adm-stat { flex: 1 1 calc(50% - 5px) !important; min-width: 0 !important; padding: 14px 16px !important; border-radius: 16px !important; }
  .adm .adm-stat-label { font-size: 11px !important; letter-spacing: 0.8px !important; }
  .adm .adm-stat-value { font-size: 26px !important; }
  .adm .adm-panel { min-width: 0 !important; flex-basis: 100% !important; max-width: 100% !important; padding: 16px !important; border-radius: 16px !important; }
  .adm .fn-table th:first-child, .adm .fn-table td:first-child { position: sticky; left: 0; z-index: 1; background: var(--adm-surface); }
  .adm .adm-lookup input { width: 100% !important; box-sizing: border-box; }
  .adm .adm-lookup button { margin: 8px 0 0 !important; width: 100%; }
  .adm .adm-support table { display: block; overflow-x: auto; max-width: 100%; }
  .adm .adm-support code { word-break: break-all; }
  .adm .adm-support td:first-child:not(:only-child) { white-space: nowrap; }
}
`;
