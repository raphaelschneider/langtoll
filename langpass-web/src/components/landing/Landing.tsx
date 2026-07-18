// LangPass landing page — the "fare gate" pass metaphor, ported from the app's
// approved landing design. Dark graphite + acid lime, Fraunces + Inter (loaded in
// the layout as CSS vars). Server-rendered; the pricing card reads the live price
// from MySQL, everything else is static CSS/JS motion.
//
// Locale-aware: every user-visible string comes from COPY[locale] (src/lib/landing-copy.ts).
// English is served at `/`, the other five locales at `/<locale>` — both routes render this
// same component, so there is exactly one implementation of the page.
/* eslint-disable @next/next/no-img-element */
import { getPricing, fmtPrice, yearlyDiscountPct, type Pricing } from '@/lib/settings';
import { COPY, fill, pathForLocale, SITE_URL, HTML_LANG, type Locale } from '@/lib/landing-copy';
import { Pass } from '@/components/landing/Pass';
import { ScrollReveals } from '@/components/landing/ScrollReveals';
import { HeroRotator } from '@/components/landing/HeroRotator';
import { LanguageSwitcher } from '@/components/landing/LanguageSwitcher';
import { Logo } from '@/components/landing/Logo';

function buildJsonLd(p: Pricing, locale: Locale) {
  const c = COPY[locale];
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'LangPass',
    operatingSystem: 'iOS',
    applicationCategory: 'EducationalApplication',
    inLanguage: HTML_LANG[locale],
    description: c.jsonLd.description,
    offers: [
      { '@type': 'Offer', price: '0', priceCurrency: p.currency, name: c.jsonLd.offerFree },
      { '@type': 'Offer', price: String(p.monthly), priceCurrency: p.currency, name: c.jsonLd.offerMonthly },
      { '@type': 'Offer', price: String(p.yearly), priceCurrency: p.currency, name: c.jsonLd.offerYearly },
    ],
    url: new URL(pathForLocale(locale), SITE_URL).toString(),
    image: `${SITE_URL}/og.png`,
  };
}

export async function Landing({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const pricing = await getPricing();
  const discount = yearlyDiscountPct(pricing);

  // "or $12.99/mo — save 61% on the year. 7-day free trial, no card to start."
  const monthlyLine =
    fill(c.pricing.monthlyNote, { price: fmtPrice(pricing.monthly, pricing.currency) }) +
    (discount > 0 ? fill(c.pricing.saveNote, { pct: discount }) : '') +
    c.pricing.trialNote;

  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(pricing, locale)) }} />
      <style>{css}</style>

      <nav>
        <Logo height={36} id="nav" />
        <span className="nav-right">
          <LanguageSwitcher current={locale} ariaLabel={c.switcher.ariaLabel} />
          <a className="nav-cta" href="#pricing">{c.nav.cta}</a>
        </span>
      </nav>

      {/* hero */}
      <header className="hero">
        <div>
          <p className="eyebrow">{c.hero.eyebrow}</p>
          <HeroRotator copy={c.hero} locale={locale} />
          <div className="cta-row">
            <a className="btn btn-lime" href="#pricing">{c.hero.ctaPrimary}</a>
            <a className="btn btn-ghost" href="#how">{c.hero.ctaSecondary}</a>
          </div>
        </div>

        <Pass copy={c.pass} />
      </header>

      {/* how it works */}
      <section id="how">
        <div className="sec-head reveal">
          <p className="eyebrow">{c.how.eyebrow}</p>
          <h2>{c.how.title}</h2>
          <p className="lede">{c.how.lede}</p>
        </div>
        <div className="stubs">
          {c.how.stubs.map((s) => (
            <div className="stub reveal" key={s.label}>
              <span className="label">{s.label}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* languages we teach — flags encode the VARIANT (BR, GB, ES) */}
      <section id="languages">
        <div className="sec-head reveal">
          <p className="eyebrow">{c.languages.eyebrow}</p>
          <h2>{c.languages.title}</h2>
          <p className="lede">{c.languages.lede}</p>
        </div>
        <ul className="langs">
          {c.languages.items.map((l) => (
            <li className="lang-card reveal" key={l.name}>
              <span className="lang-flag" aria-hidden="true">{l.flag}</span>
              <span className="lang-name">{l.name}</span>
              <span className="lang-levels">{c.languages.levels}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* screenshots */}
      <section>
        <div className="sec-head reveal">
          <p className="eyebrow">{c.shots.eyebrow}</p>
          <h2>{c.shots.title}</h2>
          <p className="lede">{c.shots.lede}</p>
        </div>
        <div className="shots">
          <figure className="phone reveal" style={{ margin: 0 }}>
            <img src="/shots/pass-home.png" alt={c.shots.passAlt} loading="lazy" decoding="async" />
            <figcaption>{c.shots.passCaption}</figcaption>
          </figure>
          <figure className="phone reveal" style={{ margin: 0 }}>
            <img src="/shots/practice.png" alt={c.shots.practiceAlt} loading="lazy" decoding="async" />
            <figcaption>{c.shots.practiceCaption}</figcaption>
          </figure>
        </div>
      </section>

      {/* features */}
      <section>
        <div className="sec-head reveal">
          <p className="eyebrow">{c.features.eyebrow}</p>
          <h2>{c.features.title}</h2>
        </div>
        <div className="grid">
          {c.features.cards.map((f, i) => (
            <div className="card reveal" key={i}>
              {/* the last card is the paid tier — coral tag instead of lime */}
              <span className={i === c.features.cards.length - 1 ? 'tag plus' : 'tag'}>{f.tag}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* versus */}
      <section>
        <div className="sec-head reveal">
          <p className="eyebrow">{c.versus.eyebrow}</p>
          <h2>{c.versus.title}</h2>
          <p className="lede">{c.versus.lede}</p>
        </div>
        <div className="versus">
          <div className="card them reveal">
            <h3>{c.versus.themTitle}</h3>
            <ul>
              {c.versus.themPoints.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
          <div className="card us reveal">
            <h3>{c.versus.usTitle}</h3>
            <ul>
              {c.versus.usPoints.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing">
        <div className="sec-head reveal">
          <p className="eyebrow">{c.pricing.eyebrow}</p>
          <h2>{c.pricing.title}</h2>
        </div>
        <div className="price-card reveal">
          <div>
            <h3>{c.pricing.planName}</h3>
            <p className="fine">{c.pricing.planBlurb}</p>
          </div>
          <div className="price-side">
            <div className="price-num">
              {fmtPrice(pricing.yearly, pricing.currency)}<small>{c.pricing.perYear}</small>
            </div>
            <p className="fine">{monthlyLine}</p>
            <div className="cta-row" style={{ justifyContent: 'flex-end' }}>
              <a
                className="btn btn-lime"
                href={`mailto:hello@langpass.app?subject=${encodeURIComponent(c.pricing.ctaMailSubject)}`}
              >
                {c.pricing.cta}
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <Logo height={26} id="footer" />
        <span className="fine">
          {c.footer.tagline} ·{' '}
          {/* legal pages are English-only by decision — no locale prefix */}
          <a href="/privacy" hrefLang="en">{c.footer.privacy}</a> ·{' '}
          <a href="/terms" hrefLang="en">{c.footer.terms}</a> · {c.footer.copyright}
        </span>
      </footer>

      <ScrollReveals />
    </div>
  );
}

const css = `
:root {
  --bg: #0a0a0c;
  --surface: #141417;
  --surface2: #1b1b1f;
  --ink: #f2f2f4;
  --soft: #a6a6b0;
  --faint: #63636e;
  --line: rgba(255, 255, 255, 0.09);
  --lime: #c8ff4d;
  --lime-soft: rgba(200, 255, 77, 0.12);
  --lime-line: rgba(200, 255, 77, 0.4);
  --lime-text: #c8ff4d;
  --on-lime: #101403;
  --coral: #ff5c7a;
  --coral-soft: rgba(255, 92, 122, 0.12);
  --glow: 0 0 48px rgba(200, 255, 77, 0.25);
  --radius: 24px;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-inter), -apple-system, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.wrap { max-width: 1060px; margin: 0 auto; padding: 0 24px; }
h1, h2, h3 { font-family: var(--font-fraunces), Georgia, serif; font-weight: 600; text-wrap: balance; margin: 0; }
p { margin: 0; }
a { color: inherit; }

.eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--lime-text); }
.label { font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--faint); }

/* Scoped to the DIRECT child nav. LanguageSwitcher renders its own nav element,
   and a bare element selector leaked this padding into it, pushing the switcher
   ~28px below the logo and the CTA. */
.wrap > nav { display: flex; align-items: center; justify-content: space-between; padding: 28px 0 0; gap: 16px; flex-wrap: wrap; }
.brand { display: inline-flex; align-items: center; gap: 10px; }
.brand-mark { display: block; flex: none; color: var(--lime); }
.logo { display: block; flex: none; }
.logo-mark { fill: var(--lime); }
.logo-lang { fill: var(--ink); }
.logo-pass { fill: var(--lime); }
.nav-right { display: inline-flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.nav-cta { font-size: 14px; font-weight: 600; text-decoration: none; border: 1px solid var(--line); border-radius: 999px; padding: 9px 18px; transition: border-color 0.2s ease; white-space: nowrap; }
.nav-cta:hover { border-color: var(--lime-line); color: var(--lime-text); }

/* Language switcher — quiet by default, but legible enough that a visitor who can't read
   the page still finds their language without hunting for it. */
/* Six cards on a 3x2 grid. auto-fit/minmax(150px) put all six on one row on a
   wide viewport, and the content (flag + name + nowrap level range) is wider
   than 150px — so the cards overflowed and visually overlapped their neighbour.
   Explicit column counts keep every card wider than its contents at all sizes. */
.langs { list-style: none; margin: 28px 0 0; padding: 0; display: grid; gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr)); }
.lang-card { display: flex; align-items: center; gap: 12px; padding: 14px 16px;
  min-width: 0; border: 1px solid var(--line); border-radius: 14px; background: var(--fill); }
.lang-flag { font-size: 26px; line-height: 1; flex: none; }
/* Flags are decorative: the language NAME is the accessible label, and an emoji
   flag reads as a country to a screen reader, not a language. */
.lang-name { font-weight: 600; }
.lang-levels { margin-left: auto; font-size: 12px; color: var(--faint); white-space: nowrap; }
.lang-switch { display: inline-flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 12.5px; }
.lang-switch a { color: var(--faint); text-decoration: none; transition: color 0.2s ease; }
.lang-switch a:hover { color: var(--lime-text); }
.lang-switch a.is-current { color: var(--ink); font-weight: 600; cursor: default; }

/* minmax(0, …) so a longer rotating headline can't steal width from the pass column (the
   pass stays put; only the text wraps). */
.hero { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); gap: 56px; align-items: center; padding: 96px 0 72px; }
.hero h1 { font-size: clamp(44px, 6.4vw, 76px); line-height: 1.02; letter-spacing: -0.02em; margin: 0; }
/* Every headline variant occupies the SAME grid cell, so the headline box is always as
   tall as the tallest variant — the sub-paragraph and CTAs below never move as it rotates.
   Shorter variants are vertically centered in that reserved box so they're not stuck at the
   top with a gap underneath. */
.hero-headline { display: grid; align-items: center; }
.hero-headline > h1 { grid-area: 1 / 1; }
.hero .sub { margin-top: 24px; font-size: 18px; color: var(--soft); max-width: 34em; }
.hero .sub strong { color: var(--ink); font-weight: 600; }
/* Fixed-width, centered slot: the rotating language word can never reflow or wrap the
   sentence, so the sub stays pinned in place. */
/* The rotating language name sits in a fixed-width slot so the sentence never
   reflows as it cycles. min-width, not width: a hard width clips the longest
   value, and German's "Portugiesisch" (~117px at 18px bold) overflows the 5.9em
   the English/Romance names fit in. min-width keeps the no-reflow behaviour for
   every locale while letting the one long name take the room it needs. */
.hero .sub .lang { display: inline-block; min-width: 5.9em; text-align: center; white-space: nowrap; color: var(--lime-text); font-weight: 600; }
/* cross-fade the rotating headline + the language word (in sync) */
.hero-rot { transition: opacity 0.36s ease; }
@media (prefers-reduced-motion: reduce) { .hero-rot { transition: none; } }
.cta-row { display: flex; gap: 14px; margin-top: 36px; flex-wrap: wrap; }
.btn { display: inline-block; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 999px; padding: 15px 28px; transition: transform 0.15s ease; }
.btn:active { transform: scale(0.97); }
.btn-lime { background: var(--lime); color: var(--on-lime); box-shadow: var(--glow); }
.btn-ghost { border: 1px solid var(--line); color: var(--ink); }
.btn-ghost:hover { border-color: var(--lime-line); }

.pass-scene { perspective: 1100px; }
.pass { position: relative; overflow: hidden; cursor: pointer; background: linear-gradient(160deg, var(--surface2), var(--surface)); border: 1px solid var(--lime-line); border-radius: var(--radius); padding: 26px; box-shadow: var(--glow); transform-style: preserve-3d; transition: transform 0.2s ease, border-color 0.4s ease, box-shadow 0.4s ease; }
@media (prefers-reduced-motion: no-preference) {
  .pass.print { animation: print 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes print { from { opacity: 0; transform: translateY(120px) rotate(-4deg); } to { opacity: 1; transform: translateY(0) rotate(0); } }
  .pass::after { content: ''; position: absolute; top: -60%; bottom: -60%; left: -30%; width: 80px; background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.09), transparent); transform: rotate(18deg); animation: shimmer 3.4s ease-in-out 1.4s infinite; }
  @keyframes shimmer { 0% { left: -30%; } 55% { left: 115%; } 100% { left: 115%; } }
}
/* expired state — chip, timer, track shift to coral/faint; shimmer stops; stamp slams in */
.pass.expired { border-color: var(--coral-soft); box-shadow: 0 0 40px rgba(255, 92, 122, 0.18); }
.pass.expired::after { animation: none; opacity: 0; }
.pass-head { display: flex; align-items: center; justify-content: space-between; }
.chip { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; color: var(--lime-text); background: var(--lime-soft); border: 1px solid var(--lime-line); border-radius: 999px; padding: 5px 12px; transition: color 0.4s ease, background 0.4s ease, border-color 0.4s ease; }
.chip .dot { width: 6px; height: 6px; border-radius: 3px; background: var(--lime-text); transition: background 0.4s ease; }
.pass.expired .chip { color: var(--coral); background: var(--coral-soft); border-color: var(--coral-soft); }
.pass.expired .chip .dot { background: var(--coral); }
.pass-timer { font-family: var(--font-fraunces), Georgia, serif; font-weight: 600; font-size: 58px; line-height: 1; color: var(--lime-text); margin-top: 22px; font-variant-numeric: tabular-nums; transition: color 0.4s ease; }
.pass.expired .pass-timer { color: var(--faint); }
.pass-note { color: var(--soft); font-size: 15px; margin-top: 4px; }
.pass-track { height: 4px; border-radius: 2px; background: var(--line); margin-top: 20px; overflow: hidden; }
.pass-fill { height: 100%; border-radius: 2px; background: var(--lime); transition: width 0.5s ease, background 0.4s ease; }
.pass.expired .pass-fill { background: var(--faint); }
.stamp {
  position: absolute; top: 46%; left: 50%;
  transform: translate(-50%, -50%) rotate(-13deg) scale(1.5);
  font-family: var(--font-fraunces), Georgia, serif; font-weight: 700;
  font-size: 44px; letter-spacing: 0.06em; color: var(--coral);
  border: 3px solid var(--coral); border-radius: 10px; padding: 4px 18px;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.pass.expired .stamp { opacity: 0.92; transform: translate(-50%, -50%) rotate(-13deg) scale(1); }
@media (prefers-reduced-motion: reduce) { .stamp { transition: opacity 0.2s ease; transform: translate(-50%, -50%) rotate(-13deg); } }
.pass-passenger { margin-top: 18px; }
.pass-passenger .who { font-size: 13px; font-weight: 600; letter-spacing: 0.14em; margin-top: 2px; }
.perf { display: flex; gap: 6px; margin: 20px 0; }
.perf i { flex: 1; height: 1px; background: var(--line); }
.pass-stub { display: flex; align-items: flex-end; justify-content: space-between; }
.barcode { display: flex; align-items: flex-end; gap: 2px; height: 24px; }
.barcode i { background: var(--soft); opacity: 0.85; height: 100%; }
.stub-meta { text-align: right; font-size: 12px; color: var(--faint); letter-spacing: 0.12em; font-variant-numeric: tabular-nums; }

section { padding: 72px 0; border-top: 1px solid var(--line); }
.sec-head { max-width: 620px; }
.sec-head h2 { font-size: clamp(30px, 4vw, 44px); line-height: 1.1; letter-spacing: -0.015em; margin-top: 14px; }
.sec-head .lede { color: var(--soft); margin-top: 16px; font-size: 17px; }

.stubs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 44px; }
.stub { background: var(--surface); border: 1px solid var(--line); border-radius: 20px; padding: 24px; position: relative; }
.stub .label { color: var(--lime-text); }
.stub h3 { font-size: 21px; margin-top: 10px; }
.stub p { color: var(--soft); font-size: 15px; margin-top: 8px; }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 44px; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: 20px; padding: 24px; transition: border-color 0.2s ease; }
.card:hover { border-color: var(--lime-line); }
.card h3 { font-size: 19px; }
.card p { color: var(--soft); font-size: 14.5px; margin-top: 8px; }
.card .tag { display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: 0.14em; color: var(--lime-text); border: 1px solid var(--lime-line); border-radius: 999px; padding: 3px 9px; margin-bottom: 12px; text-transform: uppercase; }
.card .tag.plus { color: var(--coral); border-color: var(--coral-soft); background: var(--coral-soft); }

.shots { display: flex; gap: 40px; justify-content: center; margin-top: 48px; flex-wrap: wrap; }
.phone { width: 290px; border-radius: 42px; padding: 10px; background: var(--surface2); border: 1px solid var(--line); box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45); }
.phone img { width: 100%; display: block; border-radius: 34px; }
.phone figcaption { text-align: center; font-size: 13px; color: var(--faint); padding: 12px 0 6px; }

.versus { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 44px; }
.versus .card h3 { font-size: 18px; }
.versus .them h3 { color: var(--soft); }
.versus ul { margin: 12px 0 0; padding: 0 0 0 18px; color: var(--soft); font-size: 14.5px; }
.versus li { margin-top: 6px; }
.versus .us { border-color: var(--lime-line); }

.price-card { margin-top: 44px; border-radius: var(--radius); border: 1px solid var(--lime-line); background: var(--surface); padding: 36px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 32px; align-items: center; box-shadow: var(--glow); }
.price-card h3 { font-size: 26px; }
.price-card .fine { color: var(--soft); font-size: 15px; margin-top: 12px; }
.price-num { font-family: var(--font-fraunces), Georgia, serif; font-size: 52px; font-weight: 600; line-height: 1; }
.price-num small { font-size: 17px; color: var(--soft); font-family: var(--font-inter), sans-serif; font-weight: 400; }
.price-side { text-align: right; }

footer { border-top: 1px solid var(--line); padding: 40px 0 64px; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 12px; }
footer .fine { color: var(--faint); font-size: 13px; }
footer .fine a { text-decoration: none; border-bottom: 1px solid var(--line); }
footer .fine a:hover { color: var(--lime-text); }

/* Visible by default (no-JS safe). ScrollReveals only arms below-the-fold elements. */
.reveal.armed { opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.armed.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .reveal.armed { opacity: 1; transform: none; transition: none; } }

:focus-visible { outline: 2px solid var(--lime-text); outline-offset: 3px; border-radius: 6px; }

@media (max-width: 860px) {
  .langs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hero { grid-template-columns: 1fr; padding-top: 56px; gap: 44px; }
  .stubs, .grid, .versus { grid-template-columns: 1fr; }
  .price-card { grid-template-columns: 1fr; }
  .price-side { text-align: left; }
}
/* Narrow screens: the six endonyms get their own line under the brand rather than
   squeezing the CTA off the row. */
@media (max-width: 620px) {
  .nav-right { width: 100%; justify-content: space-between; gap: 12px; }
  .langs { grid-template-columns: minmax(0, 1fr); }
  .lang-switch { gap: 8px; font-size: 12px; }
}
`;
