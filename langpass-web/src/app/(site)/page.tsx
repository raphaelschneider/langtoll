// LangPass landing page — the "fare gate" pass metaphor, ported from the app's
// approved landing design. Dark graphite + acid lime, Fraunces + Inter (loaded in
// layout.tsx as CSS vars). Server-rendered; the pricing card reads the live price
// from MySQL, everything else is static CSS/JS motion.
/* eslint-disable @next/next/no-img-element */
import { getPricing, fmtPrice, yearlyDiscountPct, type Pricing } from '@/lib/settings';
import { Pass } from '@/components/landing/Pass';
import { ScrollReveals } from '@/components/landing/ScrollReveals';
import { HeroRotator } from '@/components/landing/HeroRotator';

// Statically cached, re-rendered in the background at most once an hour — so the MySQL price
// read happens ~once/hour regardless of traffic, never per visitor. The admin "Save" calls
// revalidatePath('/'), so price edits show up immediately rather than waiting for the window.
export const revalidate = 3600;

function buildJsonLd(p: Pricing) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'LangPass',
    operatingSystem: 'iOS',
    applicationCategory: 'EducationalApplication',
    description:
      'LangPass locks the apps that eat your nights until you have done your language reps. Five quick exercises buy 30 minutes of phone time, then the wall comes back — a real Screen Time fare gate on your worst habit. German, Spanish, Portuguese and more.',
    offers: [
      { '@type': 'Offer', price: '0', priceCurrency: p.currency, name: 'Free (the lock, forever)' },
      { '@type': 'Offer', price: String(p.monthly), priceCurrency: p.currency, name: 'LangPass Plus (monthly)' },
      { '@type': 'Offer', price: String(p.yearly), priceCurrency: p.currency, name: 'LangPass Plus (yearly)' },
    ],
    url: 'https://langpass.app',
    image: 'https://langpass.app/og.png',
  };
}

export default async function Home() {
  const pricing = await getPricing();
  const discount = yearlyDiscountPct(pricing);
  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(pricing)) }} />
      <style>{css}</style>

      <nav>
        <span className="brand">
          <svg className="brand-mark" width="30" height="23" viewBox="0 0 40 30" aria-hidden="true">
            <rect x="1" y="4" width="38" height="22" rx="6" fill="#c8ff4d" />
            <circle cx="1" cy="15" r="4" fill="#0a0a0c" />
            <circle cx="39" cy="15" r="4" fill="#0a0a0c" />
            <rect x="9" y="11" width="22" height="2.6" rx="1.3" fill="#0a0a0c" opacity="0.72" />
            <rect x="9" y="17.4" width="14" height="2.6" rx="1.3" fill="#0a0a0c" opacity="0.72" />
          </svg>
          <span className="wordmark">langpass</span>
        </span>
        <a className="nav-cta" href="#pricing">Get early access</a>
      </nav>

      {/* hero */}
      <header className="hero">
        <div>
          <p className="eyebrow">Your apps, behind a fare gate</p>
          <HeroRotator />
          <div className="cta-row">
            <a className="btn btn-lime" href="#pricing">Start my free week</a>
            <a className="btn btn-ghost" href="#how">See the deal</a>
          </div>
        </div>

        <Pass />
      </header>

      {/* how it works */}
      <section id="how">
        <div className="sec-head reveal">
          <p className="eyebrow">The deal</p>
          <h2>Your dopamine now charges a fare.</h2>
          <p className="lede">
            Every unlock costs exercises. Not a daily quota you can binge past at 8am — a toll,
            every single time.
          </p>
        </div>
        <div className="stubs">
          <div className="stub reveal">
            <span className="label">Fare gate · 1</span>
            <h3>Your feeds get a lock</h3>
            <p>
              Pick the apps that steal your time. iOS shields them at the system level — a real
              Screen Time wall, not a nag you can swipe away.
            </p>
          </div>
          <div className="stub reveal">
            <span className="label">Fare gate · 2</span>
            <h3>90 seconds of practice pays it</h3>
            <p>
              Real vocabulary and sentences in the language you&apos;re learning, tuned to your level.
              Answer well and your pass prints — stamped, numbered, with your name on it.
            </p>
          </div>
          <div className="stub reveal">
            <span className="label">Fare gate · 3</span>
            <h3>The pass expires</h3>
            <p>
              30 minutes later the wall is back — even if you never reopen LangPass. Scroll enough
              and you&apos;ll be fluent out of spite.
            </p>
          </div>
        </div>
      </section>

      {/* screenshots */}
      <section>
        <div className="sec-head reveal">
          <p className="eyebrow">The app</p>
          <h2>Built like a members club, not a classroom.</h2>
          <p className="lede">Graphite glass, one acid accent, and a ticket you&apos;ll actually want to earn.</p>
        </div>
        <div className="shots">
          <figure className="phone reveal" style={{ margin: 0 }}>
            <img
              src="/shots/pass-home.png"
              alt="LangPass home screen: an expired pass with the fare — 5 exercises for 30 minutes of phone time"
              loading="lazy"
              decoding="async"
            />
            <figcaption>The pass — expired, stamped, waiting.</figcaption>
          </figure>
          <figure className="phone reveal" style={{ margin: 0 }}>
            <img
              src="/shots/practice.png"
              alt="LangPass practice session: a German vocabulary exercise with voice playback"
              loading="lazy"
              decoding="async"
            />
            <figcaption>Practice — with a voice that speaks your language.</figcaption>
          </figure>
        </div>
      </section>

      {/* features */}
      <section>
        <div className="sec-head reveal">
          <p className="eyebrow">What&apos;s inside</p>
          <h2>Small sessions. Serious curriculum.</h2>
        </div>
        <div className="grid">
          <div className="card reveal">
            <span className="tag">OS-level</span>
            <h3>A wall, not a widget</h3>
            <p>Apple Screen Time shielding. Your apps stay locked until the fare is paid — no snooze, no swipe-away.</p>
          </div>
          <div className="card reveal">
            <span className="tag">A1 → B1</span>
            <h3>Levels that grow with you</h3>
            <p>Curated packs from first words to real conversations, per language. Onboarding reads your difficulty and starts you at the right one.</p>
          </div>
          <div className="card reveal">
            <span className="tag">7 drill types</span>
            <h3>Not just word-matching</h3>
            <p>Multiple choice, gendered-article drills, typed answers with accent-forgiving grading, cloze, sentence building, listening.</p>
          </div>
          <div className="card reveal">
            <span className="tag">Voice</span>
            <h3>Spoken natively, out loud</h3>
            <p>Every word and sentence read aloud on-device in the target language. Tap anything to hear it. Toggle it off in the library, obviously.</p>
          </div>
          <div className="card reveal">
            <span className="tag">Offline</span>
            <h3>Works with no signal</h3>
            <p>The whole curriculum ships in the app. Your 7am unlock doesn&apos;t care about your reception.</p>
          </div>
          <div className="card reveal">
            <span className="tag plus">Plus</span>
            <h3>AI topic packs &amp; strict mode</h3>
            <p>Generate vocabulary for your world — brunch orders, match-day slang, your job&apos;s jargon. And strict mode: no skips, no mercy.</p>
          </div>
        </div>
      </section>

      {/* versus */}
      <section>
        <div className="sec-head reveal">
          <p className="eyebrow">Why it works</p>
          <h2>Every other app begs you to open it.</h2>
          <p className="lede">LangPass owns the door to the apps you were opening anyway. Motivation is optional by design.</p>
        </div>
        <div className="versus">
          <div className="card them reveal">
            <h3>The streak-and-guilt model</h3>
            <ul>
              <li>Needs you to remember it exists</li>
              <li>One sad owl notification, easily ignored</li>
              <li>Daily goal binged at breakfast, forgotten by lunch</li>
            </ul>
          </div>
          <div className="card us reveal">
            <h3>The fare-gate model</h3>
            <ul>
              <li>Interrupts you at peak craving — 10× a day</li>
              <li>Re-locks automatically. There is no &ldquo;done for today&rdquo;</li>
              <li>Your worst habit becomes your study schedule</li>
            </ul>
          </div>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing">
        <div className="sec-head reveal">
          <p className="eyebrow">Fare table</p>
          <h2>Week one is the full experience. Free.</h2>
        </div>
        <div className="price-card reveal">
          <div>
            <h3>LangPass Plus</h3>
            <p className="fine">
              Custom fares, strict mode, the full curriculum, AI topic packs, and every language we
              add. The lock itself stays free forever.
            </p>
          </div>
          <div className="price-side">
            <div className="price-num">
              {fmtPrice(pricing.yearly, pricing.currency)}<small> / year</small>
            </div>
            <p className="fine">
              or {fmtPrice(pricing.monthly, pricing.currency)}/mo
              {discount > 0 ? ` — save ${discount}% on the year` : ''}. 7-day free trial, no card to start.
            </p>
            <div className="cta-row" style={{ justifyContent: 'flex-end' }}>
              <a className="btn btn-lime" href="mailto:hello@langpass.app?subject=Early%20access">Get early access</a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <span className="wordmark">langpass</span>
        <span className="fine">
          Learn first, scroll later. · German, Spanish &amp; Portuguese — new languages every month ·{' '}
          <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · © 2026 LangPass
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

nav { display: flex; align-items: center; justify-content: space-between; padding: 28px 0 0; }
.brand { display: inline-flex; align-items: center; gap: 10px; }
.brand-mark { display: block; flex: none; }
.wordmark { font-family: var(--font-fraunces), Georgia, serif; font-style: italic; font-size: 22px; letter-spacing: -0.01em; }
.nav-cta { font-size: 14px; font-weight: 600; text-decoration: none; border: 1px solid var(--line); border-radius: 999px; padding: 9px 18px; transition: border-color 0.2s ease; }
.nav-cta:hover { border-color: var(--lime-line); color: var(--lime-text); }

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
.hero .sub .lang { display: inline-block; width: 5.9em; text-align: center; white-space: nowrap; color: var(--lime-text); font-weight: 600; }
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
  .hero { grid-template-columns: 1fr; padding-top: 56px; gap: 44px; }
  .stubs, .grid, .versus { grid-template-columns: 1fr; }
  .price-card { grid-template-columns: 1fr; }
  .price-side { text-align: left; }
}
`;
