// LangToll landing page — the "fare gate" pass metaphor. The product IS a Screen Time fare
// gate: it locks the apps that eat your nights until you've done your reps, then the wall
// comes back. The design leans all the way into that — printed travelcard / transit-ticket
// identity: mineral ticket-stock paper, deep rail teal, a validation stamp (VALID / VOID),
// a guilloché safety-paper texture, and monospace ticket data. Fraunces/Inter and the old
// acid-lime-on-black are gone; type is a heavy grotesque (signage) + mono (ticket data) +
// warm serif (body). Dark theme is a "night service" navy variant.
//
// Server-rendered; the pricing card reads the live price from MySQL. The hero Pass is a
// client component whose countdown/EXPIRED animation is the actual product hook (the timer
// is your remaining phone time). The guilloché is a client <canvas>.
//
// Locale-aware: every user-visible string comes from COPY[locale] (src/lib/landing-copy.ts).
// English is served at `/`, the other five locales at `/<locale>` — both routes render this
// same component, so there is exactly one implementation of the page.
/* eslint-disable @next/next/no-img-element */
import { getPricing, fmtPrice, yearlyDiscountPct, type Pricing } from '@/lib/settings';
import { COPY, fill, pathForLocale, SITE_URL, HTML_LANG, type Locale } from '@/lib/landing-copy';
import { ScrollReveals } from '@/components/landing/ScrollReveals';
import { HeroLive } from '@/components/landing/HeroLive';
import { LanguageSwitcher } from '@/components/landing/LanguageSwitcher';
import { Logo } from '@/components/landing/Logo';
import { Guilloche } from '@/components/landing/Guilloche';

function buildJsonLd(p: Pricing, locale: Locale) {
  const c = COPY[locale];
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'LangToll',
    operatingSystem: 'iOS',
    applicationCategory: 'EducationalApplication',
    inLanguage: HTML_LANG[locale],
    description: c.jsonLd.description,
    // Only the FREE tier is stated as a price. Google requires structured prices
    // to match what the buyer actually pays, and Apple sets paid prices per
    // territory — a USD figure served to every country would be wrong in most of
    // them (and can get rich results demoted). The paid tiers are declared with a
    // price RANGE marker instead: eligible for the listing, honest everywhere.
    offers: [
      { '@type': 'Offer', price: '0', priceCurrency: p.currency, name: c.jsonLd.offerFree },
      {
        '@type': 'Offer',
        name: c.jsonLd.offerMonthly,
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: String(p.monthly),
          priceCurrency: p.currency,
          valueAddedTaxIncluded: true,
        },
      },
      {
        '@type': 'Offer',
        name: c.jsonLd.offerYearly,
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: String(p.yearly),
          priceCurrency: p.currency,
          valueAddedTaxIncluded: true,
        },
      },
    ],
    url: new URL(pathForLocale(locale), SITE_URL).toString(),
    image: `${SITE_URL}/og.png`,
  };
}

export async function Landing({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const pricing = await getPricing();
  const discount = yearlyDiscountPct(pricing);

  // The travelcard's "issued" date — current date (ISR-cached, so refreshed at most hourly),
  // formatted like a printed ticket ("21 JUL 2026"). Derived, never frozen into copy.
  const issued = new Date()
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();

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

      {/* hero — headline + travelcard rotate in lockstep (HeroLive owns the rotation) */}
      <header className="hero">
        <Guilloche />
        <HeroLive hero={c.hero} pass={c.pass} locale={locale} issued={issued} />
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

      {/* meet Tolly — straight after the fare mechanic: the one who charges it.
          Five moods + real device captures (Ralph's phone), not mocks. */}
      <section>
        <div className="sec-head reveal">
          <p className="eyebrow">{c.tolly.eyebrow}</p>
          <h2>{c.tolly.title}</h2>
          <p className="lede">{c.tolly.lede}</p>
        </div>
        <div className="tolly-row">
          {(['happy', 'stern', 'sad', 'asleep', 'celebrate'] as const).map((mood, i) => (
            <figure className="tolly-card reveal" key={mood} style={{ margin: 0 }}>
              <img src={`/tolly/tolly-${mood}.png`} alt={c.tolly.captions[i]} loading="lazy" decoding="async" />
              <figcaption>{c.tolly.captions[i]}</figcaption>
            </figure>
          ))}
        </div>
        {/* no inline margin here — the stylesheet centers this block (inline margin:0
            was silently overriding `margin: 48px auto 0` and pinning it left) */}
        <figure className="tolly-island reveal">
          <img src="/tolly/island.png" alt="" loading="lazy" decoding="async" />
          <img src="/tolly/lockscreen.png" alt={c.tolly.captions[5]} loading="lazy" decoding="async" />
          <figcaption>{c.tolly.captions[5]}</figcaption>
        </figure>
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
          {/* Live loops, not stills: the unlock ritual and a practice beat. The poster IS each
              loop's first frame (the refreshed static screenshots), so play start doesn't flash. */}
          <figure className="phone reveal" style={{ margin: 0 }}>
            <video
              src="/shots/pass-loop.mp4"
              poster="/shots/pass-home.png"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={c.shots.passAlt}
            />
            <figcaption>{c.shots.passCaption}</figcaption>
          </figure>
          {/* One phone, the core ritual — practice-loop.mp4 and wallet-loop.mp4 stay in
              public/shots for marketing use, deliberately not shown here (Ralph: the
              main-usage loop alone is more than enough). */}
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
              {/* the last card is the paid tier — stamp tag instead of rail */}
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
            {/* Apple prices per territory (Brazil is not US ÷ FX), and the app's
                paywall shows the storefront's own figure. So the page quotes a
                REFERENCE price — "from $39.99" — and says where the real one
                lives. A page that promises a number the checkout won't honour is
                a conversion killer and a consumer-law problem in the EU and BR. */}
            <div className="price-num">
              <small className="price-from">{c.pricing.fromPrefix}</small>
              {fmtPrice(pricing.yearly, pricing.currency)}<small>{c.pricing.perYear}</small>
            </div>
            <p className="fine">{monthlyLine}</p>
            <p className="fine price-local">{c.pricing.localNote}</p>
            <div className="cta-row" style={{ justifyContent: 'flex-end' }}>
              <a
                className="btn btn-lime"
                href={`mailto:hello@langtoll.app?subject=${encodeURIComponent(c.pricing.ctaMailSubject)}`}
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
  --bg: #E7E0CF;
  --surface: #F1ECDE;
  --surface2: #EDE6D6;
  --ink: #191A17;
  --soft: #565A54;
  --faint: #8C8D81;
  --line: rgba(25, 26, 23, 0.14);
  --line-2: rgba(25, 26, 23, 0.07);
  --rail: #1C5A66;
  --rail-bright: #2C7E8C;
  --rail-soft: rgba(28, 90, 102, 0.12);
  --rail-line: rgba(28, 90, 102, 0.42);
  --stamp: #C63A24;
  --stamp-soft: rgba(198, 58, 36, 0.12);
  --valid: #2F9E5B;
  --valid-soft: rgba(47, 158, 91, 0.13);
  --shadow: 0 26px 60px -28px rgba(25, 26, 23, 0.5);
  --radius: 10px;

  --sans: "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
  --mono: ui-monospace, "SF Mono", "SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace;
  --body: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0F161B;
    --surface: #17222B;
    --surface2: #1C2A34;
    --ink: #ECE7D8;
    --soft: #A2B2B6;
    --faint: #647579;
    --line: rgba(236, 231, 216, 0.16);
    --line-2: rgba(236, 231, 216, 0.07);
    --rail: #5CBDCD;
    --rail-bright: #82D6E3;
    --rail-soft: rgba(92, 189, 205, 0.14);
    --rail-line: rgba(92, 189, 205, 0.42);
    --stamp: #F0684E;
    --stamp-soft: rgba(240, 104, 78, 0.16);
    --valid: #4FC07C;
    --valid-soft: rgba(79, 192, 124, 0.16);
    --shadow: 0 26px 60px -24px rgba(0, 0, 0, 0.7);
  }
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--body);
  font-size: 17px;
  line-height: 1.62;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
.wrap { max-width: 1080px; margin: 0 auto; padding: 0 26px; }
h1, h2, h3 { font-family: var(--sans); font-weight: 800; letter-spacing: -0.02em; text-wrap: balance; margin: 0; }
p { margin: 0; }
a { color: inherit; }

.eyebrow { font-family: var(--mono); font-size: 12px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--rail); }
.label { font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: var(--faint); }

/* Scoped to the DIRECT child nav — LanguageSwitcher renders its own nav element. */
.wrap > nav { display: flex; align-items: center; justify-content: space-between; padding: 26px 0 0; gap: 16px; flex-wrap: wrap; }
.brand { display: inline-flex; align-items: center; gap: 10px; }
.logo { flex: none; }
.logo-word { font-family: var(--sans); font-weight: 800; letter-spacing: -0.02em; color: var(--ink); }
.logo-word b { color: var(--rail); font-weight: 800; }
.nav-right { display: inline-flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.nav-cta { font-family: var(--mono); font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; background: var(--ink); color: var(--bg); border-radius: 3px; padding: 10px 16px; transition: background 0.18s ease; white-space: nowrap; }
.nav-cta:hover { background: var(--rail); }

/* language switcher — quiet, legible enough to find your language without hunting */
.lang-switch { display: inline-flex; align-items: center; gap: 10px; flex-wrap: wrap; font-family: var(--mono); font-size: 12px; letter-spacing: 0.04em; }
.lang-switch a { color: var(--faint); text-decoration: none; transition: color 0.2s ease; }
.lang-switch a:hover { color: var(--rail); }
.lang-switch a.is-current { color: var(--ink); font-weight: 600; cursor: default; }

/* ---- buttons ---- */
.btn { display: inline-flex; align-items: center; gap: 9px; text-decoration: none; font-family: var(--mono); font-weight: 500; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 3px; padding: 15px 24px; border: 1px solid transparent; transition: transform 0.12s ease, background 0.18s ease, border-color 0.18s ease; }
.btn:active { transform: translateY(1px); }
.btn-lime { background: var(--rail); color: var(--surface); }
.btn-lime:hover { background: var(--rail-bright); }
.btn-ghost { border-color: var(--line); color: var(--ink); }
.btn-ghost:hover { border-color: var(--rail); color: var(--rail); }

/* ---- hero ---- */
.hero { position: relative; display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); gap: 56px; align-items: center; padding: 84px 0 76px; }
.guilloche { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
.hero > div, .hero .pass-scene { position: relative; z-index: 1; }
.hero h1 { font-family: var(--sans); font-size: clamp(40px, 6vw, 70px); line-height: 1.0; margin: 0; }
.hero-headline { display: grid; align-items: center; margin-top: 20px; }
.hero-headline > h1 { grid-area: 1 / 1; }
.hero .sub { margin-top: 22px; font-size: 19px; color: var(--soft); max-width: 33em; }
.hero .sub strong { color: var(--ink); font-weight: 400; box-shadow: inset 0 -0.5em 0 var(--rail-soft); }
.hero .sub .lang { display: inline-block; min-width: 5.9em; text-align: center; white-space: nowrap; color: var(--rail); font-weight: 600; }
.hero-rot { transition: opacity 0.36s ease; }
@media (prefers-reduced-motion: reduce) { .hero-rot { transition: none; } }
.cta-row { display: flex; gap: 14px; margin-top: 34px; flex-wrap: wrap; }

/* ---- the season travelcard (rendered by HeroLive; language rotates with the hero) ---- */
.pass-scene { perspective: 1400px; position: relative; }
/* Tolly perched on the travelcard's top edge — outside .pass because it clips overflow. */
.tolly-perch { position: absolute; top: -44px; right: 28px; width: 78px; height: auto; z-index: 2; pointer-events: none; }
.pass {
  position: relative; overflow: hidden; cursor: pointer;
  background: var(--surface); color: var(--ink);
  border: 1px solid var(--line); border-left: 8px solid var(--rail);
  border-radius: 12px; padding: 24px 24px 20px;
  box-shadow: var(--shadow); transform-style: preserve-3d;
  transition: transform 0.2s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}
@media (prefers-reduced-motion: no-preference) {
  .pass.print { animation: printcard 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes printcard { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
}
.pass.expired { border-left-color: var(--stamp); box-shadow: 0 24px 54px -30px rgba(198, 58, 36, 0.5); }
.pass-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.pass-issuer { display: inline-flex; align-items: center; gap: 9px; font-family: var(--sans); font-weight: 800; font-size: 15px; letter-spacing: -0.01em; }
.pass-issuer svg { flex: none; color: var(--rail); }
.pass-class { text-align: right; font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--faint); line-height: 1.55; }
.pass-lang { margin-top: 20px; }
.pass-lang .big { font-family: var(--sans); font-weight: 800; font-size: 44px; letter-spacing: -0.03em; line-height: 0.96; }
.pass-from { font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--soft); margin-top: 9px; }
.stamp { position: absolute; font-family: var(--sans); font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; border: 3px solid currentColor; border-radius: 8px; pointer-events: none; }
.stamp-valid { top: 78px; right: 22px; font-size: 26px; color: var(--valid); padding: 5px 15px; transform: rotate(-11deg); opacity: 0.92; transition: opacity 0.3s ease; }
.stamp-expired { top: 46%; left: 50%; font-size: 40px; color: var(--stamp); padding: 4px 16px; transform: translate(-50%, -50%) rotate(-13deg) scale(1.5); opacity: 0; transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.pass.expired .stamp-valid { opacity: 0; }
.pass.expired .stamp-expired { opacity: 0.92; transform: translate(-50%, -50%) rotate(-13deg) scale(1); }
@media (prefers-reduced-motion: reduce) { .stamp-expired { transition: opacity 0.2s ease; transform: translate(-50%, -50%) rotate(-13deg); } }
.pass-lines { display: flex; gap: 8px; margin-top: 20px; }
.pass-lines i { width: 14px; height: 14px; border-radius: 50%; }
.perf { display: flex; align-items: center; gap: 8px; margin: 20px 0 16px; }
.perf i { flex: 1; height: 1px; background: repeating-linear-gradient(to right, var(--line) 0 4px, transparent 4px 8px); }
.perf span { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--faint); }
.pass-data { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 18px; }
.pass-data .k { display: block; font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--faint); }
.pass-data .v { display: block; font-family: var(--mono); font-size: 13.5px; letter-spacing: 0.03em; color: var(--ink); font-variant-numeric: tabular-nums; margin-top: 3px; }
.pass-data .v-timer { color: var(--valid); transition: color 0.4s ease; }
.pass.expired .pass-data .v-timer { color: var(--stamp); }
.pass-foot { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin-top: 20px; }
.barcode { display: flex; align-items: flex-end; gap: 2px; height: 34px; }
.barcode i { background: var(--ink); opacity: 0.82; height: 100%; }
.pass-serial { font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; color: var(--soft); }

/* ---- sections + tear-line dividers ---- */
section { position: relative; padding: 78px 0; border-top: 2px dashed var(--line); }
section::before, section::after { content: ''; position: absolute; top: -13px; width: 24px; height: 24px; border-radius: 50%; background: var(--bg); border: 2px solid var(--line); }
section::before { left: -12px; } section::after { right: -12px; }
.sec-head { max-width: 640px; }
.sec-head h2 { font-size: clamp(28px, 3.8vw, 42px); line-height: 1.08; margin-top: 14px; }
.sec-head .lede { color: var(--soft); margin-top: 16px; font-size: 18px; }

/* ---- how it works → a route line with stops ---- */
.stubs { position: relative; display: grid; grid-template-columns: 1fr; gap: 0; margin-top: 46px; }
.stubs::before { content: ''; position: absolute; left: 8px; top: 6px; bottom: 30px; width: 2px; background: var(--line); }
.stub { position: relative; padding: 0 0 40px 52px; background: none; border: none; }
.stub:last-child { padding-bottom: 0; }
.stub::before { content: ''; position: absolute; left: 0; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: var(--bg); border: 2px solid var(--rail); box-shadow: 0 0 0 4px var(--rail-soft); }
.stub .label { color: var(--rail); }
.stub h3 { font-size: 22px; margin-top: 6px; }
.stub p { color: var(--soft); font-size: 16.5px; margin-top: 8px; max-width: 46em; }

/* ---- languages → lines-served board, flags kept, transit-line colour stripe ---- */
.langs { list-style: none; margin: 44px 0 0; padding: 0; border: 1px solid var(--line); border-radius: 6px; overflow: hidden; }
.lang-card { display: flex; align-items: center; gap: 14px; padding: 16px 20px; min-width: 0; background: var(--surface); border-top: 1px solid var(--line-2); border-left: 4px solid var(--faint); }
.lang-card:first-child { border-top: none; }
.langs .lang-card:nth-child(1) { border-left-color: #C63A24; }
.langs .lang-card:nth-child(2) { border-left-color: #1C5A66; }
.langs .lang-card:nth-child(3) { border-left-color: #2E7D46; }
.langs .lang-card:nth-child(4) { border-left-color: #B5852A; }
.langs .lang-card:nth-child(5) { border-left-color: #7A4EA3; }
.langs .lang-card:nth-child(6) { border-left-color: #35618E; }
.lang-flag { font-size: 24px; line-height: 1; flex: none; }
.lang-name { font-family: var(--sans); font-weight: 800; font-size: 19px; letter-spacing: -0.01em; }
.lang-levels { margin-left: auto; font-family: var(--mono); font-size: 12.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--soft); white-space: nowrap; }

/* ---- screenshots ---- */
.shots { display: flex; gap: 40px; justify-content: center; margin-top: 48px; flex-wrap: wrap; }
.phone { width: 290px; border-radius: 42px; padding: 10px; background: var(--surface2); border: 1px solid var(--line); box-shadow: var(--shadow); }
.phone img, .phone video { width: 100%; display: block; border-radius: 34px; aspect-ratio: 402 / 874; object-fit: cover; }
/* Meet-Tolly: five booth windows + the island capture. Cards share the pass surface language. */
.tolly-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 18px; margin-top: 40px; }
.tolly-card { background: var(--surface2); border: 1px solid var(--line); border-radius: 18px; padding: 22px 16px 14px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px; }
.tolly-card img { width: 76%; max-width: 150px; height: auto; display: block; margin: 0 auto; }
.tolly-card figcaption, .tolly-island figcaption { font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.06em; color: var(--faint); text-transform: uppercase; line-height: 1.6; }
.tolly-card figcaption { margin-top: auto; }
.tolly-island { margin: 48px auto 0; text-align: center; display: grid; gap: 16px; justify-items: center; max-width: 560px; }
.tolly-island img { width: 100%; border-radius: 22px; border: 1px solid var(--line); display: block; }
.tolly-island figcaption { padding-top: 4px; }
.phone figcaption { text-align: center; font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.06em; color: var(--faint); padding: 12px 0 6px; text-transform: uppercase; }

/* ---- features → ticket cards ---- */
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 46px; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 24px; transition: border-color 0.2s ease; }
.card:hover { border-color: var(--rail-line); }
.card h3 { font-size: 19px; }
.card p { color: var(--soft); font-size: 15px; margin-top: 8px; }
.card .tag { display: inline-block; font-family: var(--mono); font-size: 10px; font-weight: 500; letter-spacing: 0.12em; color: var(--rail); border: 1px solid var(--rail-line); border-radius: 999px; padding: 3px 9px; margin-bottom: 12px; text-transform: uppercase; }
.card .tag.plus { color: var(--stamp); border-color: var(--stamp); background: var(--stamp-soft); }

/* ---- versus → two tickets, VOID vs VALID stamps ---- */
.versus { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 46px; }
.versus .card { position: relative; overflow: hidden; padding: 26px; }
.versus .card.them { opacity: 0.74; }
.versus .card.us { border-color: var(--valid); }
.versus .card h3 { font-size: 20px; }
.versus .them h3 { color: var(--soft); }
.versus ul { list-style: none; margin: 18px 0 0; padding: 0; }
.versus li { position: relative; padding-left: 24px; margin-top: 12px; color: var(--soft); font-size: 15.5px; }
.versus li::before { position: absolute; left: 0; top: 0; font-family: var(--mono); font-weight: 700; }
.versus .them li::before { content: '\\00d7'; color: var(--stamp); font-size: 16px; top: -1px; }
.versus .us li { color: var(--ink); }
.versus .us li::before { content: '\\2713'; color: var(--valid); }
.versus .card::before { position: absolute; top: 20px; right: 18px; font-family: var(--sans); font-weight: 800; font-size: 16px; letter-spacing: 0.05em; text-transform: uppercase; border: 2.5px solid currentColor; border-radius: 6px; padding: 3px 10px; transform: rotate(-9deg); opacity: 0.88; }
.versus .them::before { content: 'VOID'; color: var(--stamp); }
.versus .us::before { content: 'VALID'; color: var(--valid); }

/* ---- pricing → season-pass stub ---- */
.price-card { position: relative; overflow: hidden; margin-top: 46px; border-radius: var(--radius); border: 1px solid var(--line); border-left: 8px solid var(--valid); background: var(--surface); padding: 38px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 32px; align-items: center; box-shadow: var(--shadow); }
.price-card h3 { font-size: 27px; }
.price-card .fine { color: var(--soft); font-size: 15px; margin-top: 12px; }
.price-side .fine { font-family: var(--mono); font-size: 12px; letter-spacing: 0.03em; }
.price-num { font-family: var(--mono); font-size: 52px; font-weight: 600; line-height: 1; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.price-num small { font-family: var(--mono); font-size: 15px; color: var(--soft); font-weight: 400; letter-spacing: 0; }
.price-num .price-from { margin-right: 8px; font-size: 14px; text-transform: lowercase; }
.price-local { margin-top: 6px; opacity: 0.75; }
.price-side { text-align: right; }

/* ---- footer ---- */
footer { border-top: 1px solid var(--line); padding: 40px 0 64px; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 12px; }
footer .fine { font-family: var(--mono); font-size: 12px; letter-spacing: 0.03em; color: var(--faint); }
footer .fine a { text-decoration: none; border-bottom: 1px solid var(--line); }
footer .fine a:hover { color: var(--rail); border-color: var(--rail); }

/* reveal — server renders visible; ScrollReveals only arms below-the-fold elements */
.reveal.armed { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.armed.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .reveal.armed { opacity: 1; transform: none; transition: none; } }

:focus-visible { outline: 2px solid var(--rail); outline-offset: 3px; border-radius: 4px; }

@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; padding-top: 48px; gap: 44px; }
  .grid, .versus { grid-template-columns: 1fr; }
  .price-card { grid-template-columns: 1fr; }
  .price-side { text-align: left; }
}
@media (max-width: 560px) {
  .nav-right { width: 100%; justify-content: space-between; gap: 12px; }
  .lang-levels { font-size: 11.5px; }
}
`;
