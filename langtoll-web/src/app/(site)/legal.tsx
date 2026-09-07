// Shared shell for the legal pages (/terms, /privacy): the landing's own tokens — ticket-stock
// paper and printing ink by day, rail navy and cream by night — the same eyebrow, headings and
// hairlines, so a legal page reads as a page of the site and not as a template it was born in.
import type { ReactNode } from 'react';

const css = `
.legal {
  --bg: #E7E0CF; --surface: #F1ECDE; --ink: #191A17; --soft: #565A54; --faint: #8C8D81;
  --line: rgba(25, 26, 23, 0.14); --rail: #1C5A66; --stamp: #C63A24;
  --sans: "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
  --mono: ui-monospace, "SF Mono", "SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace;
  --body: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  min-height: 100vh; background: var(--bg); color: var(--ink); padding: 64px 24px 80px;
  font-family: var(--body); font-size: 17px; line-height: 1.62;
}
@media (prefers-color-scheme: dark) {
  .legal {
    --bg: #0F161B; --surface: #17222B; --ink: #ECE7D8; --soft: #A2B2B6; --faint: #647579;
    --line: rgba(236, 231, 216, 0.16); --rail: #5CBDCD; --stamp: #F0684E;
  }
}
.legal .wrap { max-width: 760px; margin: 0 auto; }
.legal .eyebrow { font-family: var(--mono); font-size: 12px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--rail); }
.legal .eyebrow a { color: inherit; text-decoration: none; }
.legal h1 { font-family: var(--sans); font-weight: 800; letter-spacing: -0.02em; font-size: clamp(34px, 5vw, 44px); line-height: 1.05; margin: 8px 0 8px; }
.legal h2 { font-family: var(--sans); font-weight: 800; letter-spacing: -0.015em; font-size: 22px; margin: 40px 0 10px; }
.legal .updated { font-family: var(--mono); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--faint); margin: 0 0 28px; }
.legal p, .legal li { color: var(--soft); margin: 0 0 12px; }
.legal li { margin-bottom: 8px; }
.legal ul { padding-left: 22px; }
.legal strong { color: var(--ink); font-weight: 600; }
.legal a { color: var(--rail); text-decoration: underline; text-underline-offset: 3px; text-decoration-color: rgba(28, 90, 102, 0.4); }
.legal a:hover { text-decoration-color: currentColor; }
.legal .foot { border-top: 1px solid var(--line); margin-top: 48px; padding-top: 16px; font-family: var(--mono); font-size: 12px; letter-spacing: 0.04em; color: var(--faint); display: flex; gap: 16px; flex-wrap: wrap; }
`;

export function LegalShell({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="legal">
      <style>{css}</style>
      <div className="wrap">
        <div className="eyebrow">
          <a href="/">LangToll</a>
        </div>
        <h1>{title}</h1>
        <p className="updated">Last updated {updated}</p>
        {children}
        <div className="foot">
          <span>Erst lernen, dann scrollen.</span>
          <a href="/terms">Terms of Use</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="mailto:support@langtoll.app">support@langtoll.app</a>
        </div>
      </div>
    </main>
  );
}
