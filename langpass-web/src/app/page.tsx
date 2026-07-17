// LangPass landing page — the app's editorial quiet-luxury language, on the web.
// Server-rendered, CSS-only motion (aurora drift, entrance fades), real app screenshots.
/* eslint-disable @next/next/no-img-element */
import { getPricing, fmtPrice, yearlyDiscountPct, type Pricing } from '@/lib/settings';

// Statically cached, re-rendered in the background at most once an hour — so the MySQL price
// read happens ~once/hour regardless of traffic, never per visitor. The admin "Save" calls
// revalidatePath('/'), so price edits show up immediately rather than waiting for the window.
export const revalidate = 3600;

const C = {
  ink: '#14110E',
  soft: '#6B6258',
  faint: '#9C9488',
  paper: '#F6F3EE',
  surface: '#FFFFFF',
  line: '#E7E1D8',
  accent: '#C8553D',
  pine: '#2E5E4E',
};

function Phone({ src, alt, tilt = 0, poster }: { src: string; alt: string; tilt?: number; poster?: string }) {
  return (
    <div className="phone" style={{ transform: `rotate(${tilt}deg)` }}>
      {src.endsWith('.mp4') ? (
        // Muted + playsInline are what allow autoplay on iOS Safari; the poster (the video's own
        // first frame) paints instantly and stands in entirely for users with autoplay off.
        <video src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" aria-label={alt} />
      ) : (
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      )}
    </div>
  );
}

function Feature({
  overline,
  title,
  body,
  bullets,
  shot,
  poster,
  flip = false,
}: {
  overline: string;
  title: string;
  body: string;
  bullets: string[];
  shot: string;
  poster?: string;
  flip?: boolean;
}) {
  return (
    <section className={`feature ${flip ? 'flip' : ''}`}>
      <div className="feature-text">
        <div className="overline">{overline}</div>
        <h3 className="serif">{title}</h3>
        <p>{body}</p>
        <ul>
          {bullets.map((b) => (
            <li key={b}>
              <span className="tick">✓</span> {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="feature-shot">
        <Phone src={shot} alt={title} poster={poster} tilt={flip ? 2.5 : -2.5} />
      </div>
    </section>
  );
}

function buildJsonLd(p: Pricing) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'LangPass',
    operatingSystem: 'iOS',
    applicationCategory: 'HealthApplication',
    description:
      'A private AI injury-recovery companion. Tap where it hurts, check in daily, get adaptive exercise plans, and keep your comeback as an illustrated journey — all stored on your device.',
    offers: [
      { '@type': 'Offer', price: '0', priceCurrency: p.currency, name: 'Free' },
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
    <main className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(pricing)) }} />
      <style>{css}</style>

      {/* aurora */}
      <div className="aurora" aria-hidden />

      {/* nav */}
      <header className="nav">
        <a className="brand" href="#top">
          <img src="/logo.png" alt="LangPass" />
          <span>LangPass</span>
        </a>
        <nav>
          <a href="#features">Features</a>
          <a href="#memory">Memory</a>
          <a href="#privacy">Privacy</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <a className="cta-pill" href="#download">
          Get the app
        </a>
      </header>

      {/* hero */}
      <section className="hero" id="top">
        <div className="hero-text">
          <div className="overline">Injury recovery, reimagined</div>
          <h1 className="serif">
            Recovery,
            <br />
            one good day
            <br />
            at a time.
          </h1>
          <p className="lede">
            A thoughtful recovery companion for anyone with a body that&apos;s mending — from a first
            gentle comeback to a seasoned athlete&apos;s return. Check in each morning, get a plan tuned
            to how you actually feel, and watch your comeback become a story worth keeping.
          </p>
          <div className="hero-ctas" id="download">
            <a className="store-badge" href="#" aria-label="Coming soon to the App Store">
              <span aria-hidden="true">
                <svg viewBox="0 0 384 512" width="22" height="22" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C61.2 141.4 0 184.6 0 272.3c0 25.9 4.7 52.7 14.2 80.3 12.6 36.3 58.1 125.5 105.6 124.1 24.8-.6 42.3-17.6 74.6-17.6 31.3 0 47.5 17.6 74.6 17.6 47.9-.7 89.1-81.7 101.1-118.1-64.3-30.3-61-88.8-61-89.9zm-44.7-179c21.6-25.7 19.6-49.1 19-57.6-19.1 1.1-41.2 13-53.8 27.7-13.9 15.8-22.1 35.3-20.3 56.8 20.7 1.6 39.5-9 55.1-26.9z" /></svg>
              </span>
              <span>
                <small>Coming soon to the</small>
                App Store
              </span>
            </a>
            <a className="ghost-link" href="#equipment">
              See how it works ↓
            </a>
          </div>
          <div className="chips">
            <span>Private by design</span>
            <span>AI recovery companion</span>
            <span>Your journey, illustrated</span>
          </div>
        </div>
        <div className="hero-shot">
          <div className="phone" style={{ transform: 'rotate(-4deg)' }}>
            {/* Above the fold: preload in full; the poster (its own first frame) paints first. */}
            <video
              src="/shots/hero-scroll.mp4"
              poster="/shots/hero-scroll-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="LangPass Today — your daily recovery conversation"
            />
          </div>
        </div>
      </section>

      {/* equipment — straight after the hero */}
      <section className="equipment" id="equipment">
        <div className="overline">Your gear, your rules</div>
        <h2 className="serif">A band on the floor, or a full rack.</h2>
        <p className="equipment-lede">
          Tell LangPass what you have to hand — nothing but bodyweight, a single resistance band, a
          couple of dumbbells, or the run of a gym — and every plan is built from only that. Never a
          movement you can&apos;t set up, never a machine you don&apos;t own. Travelling with empty
          hands today? Say so, and tomorrow bends to match.
        </p>
        <div className="equipment-duo">
          <figure>
            <Phone src="/shots/equipment-home.jpg?v=250705d" alt="A band exercise built for home" tilt={-2.5} />
            <figcaption>At home, with a single band</figcaption>
          </figure>
          <figure>
            <Phone src="/shots/equipment-gym.jpg?v=250705b" alt="A machine exercise built for the gym" tilt={2.5} />
            <figcaption>At the gym, on the machines</figcaption>
          </figure>
        </div>
      </section>

      {/* features */}
      <div id="features">
        <Feature
          overline="Every morning"
          title="A companion who actually listens."
          body="Meet Sage! Tell him you slept badly, that your elbow's at a five, that you've only got a band today, that you're motivated anyway — and today's plan bends around you. Gentle on the hard days, ambitious on the good ones."
          bullets={['Daily check-ins in your own words', 'Plans that adapt to pain, energy, sleep & the gear you have', 'Just talk — no forms, no tapping required']}
          shot="/shots/companion-scroll.mp4"
          poster="/shots/companion-scroll-poster.jpg"
        />
        {/* memory — the headline new capability: Sage remembers, and follows up unprompted */}
        <section className="memory" id="memory">
          <div className="memory-text">
            <div className="overline">Sage remembers</div>
            <h3 className="serif">A coach who never forgets you.</h3>
            <p>
              Tell Sage something once and it sticks — the single band you train with, the desk days
              that set your elbow off, the eccentric lowers that finally helped. Every plan quietly
              bends around what Sage knows, so you never repeat yourself.
            </p>
            <p className="memory-follow">
              And when you mention Saturday tennis with Jonas, Sage writes it down — then opens the
              week with <em>&ldquo;how did tennis go — did the elbow speak up afterwards?&rdquo;</em>{' '}
              It&apos;s the difference between an app and someone in your corner.
            </p>
            <div className="mem-chips">
              <span className="mc mc-pref">♥ Prefers short morning sessions</span>
              <span className="mc mc-trig">⚡ Elbow flares at the keyboard</span>
              <span className="mc mc-help">✓ Eccentric lowers helped</span>
              <span className="mc mc-fu">🗓 Ask about Saturday tennis</span>
            </div>
            <p className="memory-note">Every memory lives only on your phone — yours to see, and to make Sage forget with one tap.</p>
          </div>
          <div className="memory-shot">
            <Phone src="/shots/memories.jpg?v=250705" alt="What Sage remembers about you — kept on your device" tilt={2.5} />
          </div>
        </section>

        <Feature
          overline="Where it hurts"
          title="Show it. Don't spell it."
          body="Tap the exact muscle on a sculpted, rotatable body. LangPass surfaces the common conditions for that spot — to explore, never a diagnosis. Left and right detected automatically."
          bullets={['Anatomically real, individually tappable muscles', 'Female and male models', 'Pain and duration, captured in seconds']}
          shot="/shots/bodymap.jpg?v=250705"
          flip
        />
        <Feature
          overline="The journey"
          title="A recovery worth remembering."
          body="Every day becomes a page: your words, your numbers, and studio illustrations generated for your exercises and your anatomy. A magazine of your comeback — one journey per injury."
          bullets={['Magazine-style timeline', 'Art generated for your movements', 'Milestones woven into the story']}
          shot="/shots/journey.jpg"
        />
        <Feature
          overline="Momentum"
          title="Progress you can feel."
          body="Streaks that forgive, badges earned by showing up, and pain trends that quietly prove it's working — even when it doesn't feel like it."
          bullets={['Streak ring & weekly rhythm', 'Badges for grit, not vanity', 'Pain trending, week over week']}
          shot="/shots/progress.jpg?v=250708"
          flip
        />
      </div>

      {/* privacy band */}
      <section className="privacy" id="privacy">
        <div className="privacy-inner">
          <div className="overline">Private by design</div>
          <h2 className="serif">Your recovery is your business.</h2>
          <div className="privacy-grid">
            <div>
              <h4>Lives on your phone</h4>
              <p>Your injuries, your whole program, daily plans, progress, pain logs and conversations are stored only on your device. No account. No cloud profile. Nothing to leak — and since we never ask for your email, we couldn&apos;t send you a marketing blast if we wanted to.</p>
            </div>
            <div>
              <h4>AI on a need-to-know basis</h4>
              <p>Each reply sends only the slice of context it needs, and we keep none of it — our servers count tokens, never store words. Nothing you share is ever used to train AI models. Everything Sage knows about you lives on your phone, not in a data center: the intelligence visits, your story stays home.</p>
            </div>
            <div>
              <h4>Yours to take or destroy</h4>
              <p>Back up everything as a file you keep — sealed, if you choose, with a passphrase only you know (we couldn&apos;t open it if we tried) — and restore it on a new phone. Or erase it all in one tap. Deleting really deletes — no soft-delete flag, no thirty-day grace period, no copy quietly lingering. When it&apos;s gone, it&apos;s gone for good.</p>
            </div>
          </div>
          <a className="ghost-link" href="/privacy">
            Read the privacy policy →
          </a>
        </div>
      </section>

      {/* pricing */}
      <section className="pricing" id="pricing">
        <div className="overline">Pricing</div>
        <h2 className="serif">Start free. Stay because it works.</h2>
        <p className="pricing-sub">Every recovery starts with <strong>7 days of full LangPass+</strong>, on us — the whole progressive program, unlimited Sage, every illustration. Keep it, or drop to Free anytime. No card to try it.</p>
        <div className="cards">
          <div className="card">
            <h4>Free</h4>
            <div className="price">$0</div>
            <ul>
              <li>One tracked injury</li>
              <li>A basic daily plan from your check-in</li>
              <li>Up to three exercises a day</li>
              <li>Bodyweight exercises only</li>
              <li>Live chat with Sage is LangPass+</li>
              <li>Tap-the-muscle injury finder</li>
              <li>Journey, streaks & badges</li>
            </ul>
          </div>
          <div className="card plus">
            {discount > 0 && <div className="ribbon">🎁 LAUNCH DEAL</div>}
            <h4>LangPass Plus</h4>
            <div className="price">
              {fmtPrice(pricing.monthly, pricing.currency)}<small>/mo</small> <span className="or">or</span>{' '}
              {fmtPrice(pricing.yearly, pricing.currency)}<small>/yr</small>
            </div>
            {discount > 0 && <div className="plus-save">🎁 Launch deal — save {discount}% on the annual plan!</div>}
            <ul>
              <li>Your progressive program — adapts &amp; advances as you heal</li>
              <li>Unlimited daily conversations</li>
              <li>Your full daily plan — no exercise cap</li>
              <li>Unlimited injuries &amp; journeys</li>
              <li>Plans for any equipment — bands, dumbbells, full gym</li>
              <li>Studio illustrations for every exercise</li>
              <li>Full history &amp; weekly trends</li>
            </ul>
          </div>
        </div>
        <p className="pt-anchor">
          Most people see a physio just a handful of times — often <strong>$50–150 a visit</strong>.
          LangPass Plus is there every day in between, for <strong>{fmtPrice(pricing.monthly, pricing.currency)} a month</strong>.
        </p>
      </section>

      {/* final cta */}
      <section className="final">
        <h2 className="serif">Be kind to your body.</h2>
        <p>It&apos;s the only one doing the recovering.</p>
        <a className="store-badge dark" href="#download">
          <span aria-hidden="true">
            <svg viewBox="0 0 384 512" width="22" height="22" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C61.2 141.4 0 184.6 0 272.3c0 25.9 4.7 52.7 14.2 80.3 12.6 36.3 58.1 125.5 105.6 124.1 24.8-.6 42.3-17.6 74.6-17.6 31.3 0 47.5 17.6 74.6 17.6 47.9-.7 89.1-81.7 101.1-118.1-64.3-30.3-61-88.8-61-89.9zm-44.7-179c21.6-25.7 19.6-49.1 19-57.6-19.1 1.1-41.2 13-53.8 27.7-13.9 15.8-22.1 35.3-20.3 56.8 20.7 1.6 39.5-9 55.1-26.9z" /></svg>
          </span>
          <span>
            <small>Coming soon to the</small>
            App Store
          </span>
        </a>
      </section>

      {/* footer */}
      <footer className="footer">
        <div>
          <img src="/logo.png" alt="" width={28} height={28} style={{ borderRadius: 7 }} />
          <span>© 2026 LangPass</span>
        </div>
        <nav>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
        <p>LangPass is a wellness companion, not a medical device. Always consult a healthcare professional about injuries.</p>
      </footer>
    </main>
  );
}

const css = `
:root { color-scheme: light; }
* { box-sizing: border-box; }
.page {
  font-family: var(--font-inter), ui-sans-serif, system-ui;
  background: ${C.paper};
  color: ${C.ink};
  overflow-x: hidden;
  position: relative;
}
.serif { font-family: var(--font-fraunces), Georgia, serif; font-weight: 600; letter-spacing: -0.5px; }

/* aurora — a slow, living warm gradient across the whole page (two layers drifting apart) */
.aurora {
  position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
  background:
    radial-gradient(48% 22% at 84% 3%, rgba(200,85,61,0.20), transparent 70%),
    radial-gradient(44% 20% at 6% 13%, rgba(217,154,78,0.17), transparent 70%),
    radial-gradient(60% 28% at 50% 44%, rgba(232,167,147,0.12), transparent 72%),
    radial-gradient(50% 24% at 92% 80%, rgba(46,94,78,0.11), transparent 72%);
  animation: drift1 30s ease-in-out infinite alternate;
}
.aurora::after {
  content: ""; position: absolute; inset: 0;
  background:
    radial-gradient(40% 18% at 16% 62%, rgba(200,85,61,0.10), transparent 70%),
    radial-gradient(46% 22% at 80% 34%, rgba(217,154,78,0.10), transparent 72%);
  animation: drift2 42s ease-in-out infinite alternate;
}
@keyframes drift1 { from { transform: translate3d(0,0,0) } to { transform: translate3d(0,-24px,0) } }
@keyframes drift2 { from { transform: translate3d(0,0,0) } to { transform: translate3d(22px,18px,0) } }
@keyframes rise { from { opacity: 0; transform: translateY(22px) } to { opacity: 1; transform: none } }
@keyframes float { from { transform: translateY(0) } to { transform: translateY(-14px) } }

/* nav */
.nav {
  position: sticky; top: 0; z-index: 10;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 14px clamp(20px, 5vw, 56px);
  background: rgba(246,243,238,0.72); backdrop-filter: blur(14px);
  border-bottom: 1px solid ${C.line};
}
.brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: ${C.ink};
  font-family: var(--font-fraunces), serif; font-weight: 600; font-size: 20px; }
.brand img { width: 34px; height: 34px; border-radius: 9px; }
.nav nav { display: flex; gap: 26px; }
.nav nav a { color: ${C.soft}; text-decoration: none; font-size: 14.5px; }
.nav nav a:hover { color: ${C.ink}; }
.cta-pill {
  background: ${C.accent}; color: #fff; text-decoration: none; font-size: 14.5px; font-weight: 500;
  padding: 10px 18px; border-radius: 999px; transition: transform .15s ease, box-shadow .15s ease;
}
.cta-pill:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(200,85,61,0.35); }

/* hero */
.hero {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 1.05fr 0.95fr; align-items: center;
  gap: clamp(24px, 5vw, 64px);
  padding: clamp(48px, 8vw, 110px) clamp(20px, 6vw, 72px) clamp(40px, 6vw, 90px);
  max-width: 1200px; margin: 0 auto;
}
.hero-text { animation: rise .8s ease both; }
.overline { font-size: 12px; letter-spacing: 2.2px; text-transform: uppercase; color: ${C.accent}; font-weight: 700; }
.hero h1 { font-size: clamp(44px, 6.5vw, 76px); line-height: 1.02; margin: 14px 0 20px; }
.lede { font-size: clamp(16px, 1.6vw, 19px); line-height: 1.65; color: ${C.soft}; max-width: 480px; margin: 0 0 28px; }
.hero-ctas { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.store-badge {
  display: inline-flex; align-items: center; gap: 10px;
  background: ${C.ink}; color: #fff; text-decoration: none;
  padding: 11px 20px; border-radius: 14px; line-height: 1.15;
  transition: transform .15s ease, box-shadow .15s ease;
}
.store-badge:hover { transform: translateY(-1px); box-shadow: 0 10px 26px rgba(20,17,14,0.3); }
.store-badge span:first-child { font-size: 26px; }
.store-badge small { display: block; font-size: 10.5px; opacity: .75; }
.store-badge span:last-child { font-size: 17px; font-weight: 600; }
.ghost-link { color: ${C.ink}; text-decoration: none; font-size: 15px; border-bottom: 1px solid ${C.line}; padding-bottom: 2px; }
.chips { display: flex; gap: 10px; margin-top: 26px; flex-wrap: wrap; }
.chips span {
  font-size: 12.5px; color: ${C.soft};
  background: rgba(255,255,255,0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 4px 14px rgba(59,42,26,0.06);
  padding: 7px 13px; border-radius: 999px;
}

/* phone frame — gently floating for soft depth (the tilt stays via the inline transform) */
.hero-shot { display: flex; justify-content: center; animation: float 8s ease-in-out infinite alternate; }
.phone {
  background: ${C.ink}; border-radius: 46px; padding: 11px;
  box-shadow: 0 36px 90px rgba(59,42,26,0.26), 0 8px 24px rgba(59,42,26,0.14);
  width: min(330px, 80vw); transition: transform .3s ease;
}
.phone:hover { transform: rotate(0deg) translateY(-6px) !important; }
.phone img, .phone video { width: 100%; display: block; border-radius: 36px; }

/* features */
.feature {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 1fr 1fr; align-items: center;
  gap: clamp(24px, 5vw, 72px);
  padding: clamp(40px, 6vw, 84px) clamp(20px, 6vw, 72px);
  max-width: 1140px; margin: 0 auto;
}
.feature.flip .feature-text { order: 2; }
.feature.flip .feature-shot { order: 1; }
.feature h3 { font-size: clamp(30px, 3.6vw, 44px); line-height: 1.08; margin: 12px 0 14px; }
.feature p { color: ${C.soft}; line-height: 1.7; font-size: 16.5px; max-width: 440px; }
.feature ul { list-style: none; padding: 0; margin: 22px 0 0; }
.feature li { color: ${C.ink}; margin-bottom: 10px; font-size: 15.5px; }
.tick { color: ${C.pine}; font-weight: 700; margin-right: 8px; }
.feature-shot { display: flex; justify-content: center; animation: float 9s ease-in-out infinite alternate; }
.feature.flip .feature-shot { animation-duration: 10.5s; }

/* equipment */
.equipment { max-width: 1040px; margin: 0 auto; padding: clamp(40px, 6vw, 84px) clamp(20px, 6vw, 72px); text-align: center; position: relative; z-index: 1; }
.equipment h2 { font-size: clamp(30px, 4vw, 48px); margin: 12px 0 16px; }
.equipment-lede { color: ${C.soft}; line-height: 1.7; font-size: 16.5px; max-width: 560px; margin: 0 auto 44px; }
.equipment-duo { display: flex; justify-content: center; gap: clamp(24px, 5vw, 64px); flex-wrap: wrap; }
.equipment-duo figure { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 16px; animation: float 8.5s ease-in-out infinite alternate; }
.equipment-duo figure:nth-child(2) { animation-duration: 10s; }
.equipment-duo figcaption { font-size: 12.5px; letter-spacing: 1.8px; text-transform: uppercase; color: ${C.faint}; font-weight: 700; }

/* memory — the standout new capability: a warm panel, chips that read like real memories */
.memory {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 1.05fr 0.95fr; align-items: center;
  gap: clamp(24px, 5vw, 72px);
  max-width: 1140px; margin: clamp(22px, 3.5vw, 44px) auto;
  padding: clamp(36px, 5vw, 72px) clamp(24px, 6vw, 64px);
  background: linear-gradient(135deg, rgba(46,94,78,0.06), rgba(200,85,61,0.06));
  border: 1px solid ${C.line}; border-radius: 32px;
  box-shadow: 0 28px 72px rgba(59,42,26,0.10);
}
.memory h3 { font-size: clamp(30px, 3.6vw, 44px); line-height: 1.08; margin: 12px 0 14px; }
.memory p { color: ${C.soft}; line-height: 1.7; font-size: 16.5px; max-width: 460px; }
.memory-follow { margin-top: 14px; }
.memory-follow em { color: ${C.pine}; font-style: italic; }
.mem-chips { display: flex; flex-wrap: wrap; gap: 9px; margin: 24px 0 18px; }
.mc {
  font-size: 13px; padding: 8px 13px; border-radius: 999px; font-weight: 500;
  background: rgba(255,255,255,0.75); border: 1px solid rgba(255,255,255,0.7);
  box-shadow: 0 4px 14px rgba(59,42,26,0.06); color: ${C.ink};
}
.mc-pref { color: ${C.accent}; } .mc-trig { color: #B0781F; }
.mc-help { color: ${C.pine}; } .mc-fu { color: ${C.pine}; border-color: rgba(46,94,78,0.3); background: rgba(46,94,78,0.08); }
.memory-note { font-size: 14px !important; color: ${C.faint} !important; margin-top: 4px; }
.memory-shot { display: flex; justify-content: center; animation: float 9.5s ease-in-out infinite alternate; }

/* privacy — a light raised panel matching the rest of the page, with soft sub-cards */
.privacy {
  background: ${C.surface}; color: ${C.ink}; position: relative; z-index: 1;
  max-width: 1140px; margin: clamp(22px, 3.5vw, 44px) auto;
  border: 1px solid ${C.line}; border-radius: 32px;
  box-shadow: 0 28px 72px rgba(59,42,26,0.10);
}
.privacy-inner { max-width: 1040px; margin: 0 auto; padding: clamp(40px, 6vw, 76px) clamp(20px, 6vw, 60px); }
.privacy h2 { font-size: clamp(34px, 4.4vw, 54px); margin: 12px 0 36px; }
.privacy-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(16px, 3vw, 28px); margin-bottom: 36px; }
.privacy-grid > div {
  background: ${C.paper}; border: 1px solid ${C.line};
  border-radius: 18px; padding: clamp(18px, 2.4vw, 26px);
}
.privacy h4 { font-size: 17px; margin: 0 0 8px; color: ${C.ink}; }
.privacy p { color: ${C.soft}; line-height: 1.65; font-size: 15px; margin: 0; }

/* pricing */
.pricing { max-width: 1040px; margin: 0 auto; padding: clamp(56px, 7vw, 96px) clamp(20px, 6vw, 72px); text-align: center; position: relative; z-index: 1; }
.pricing h2 { font-size: clamp(32px, 4vw, 48px); margin: 12px 0 14px; }
.pricing-sub { max-width: 600px; margin: 0 auto 38px; color: ${C.soft}; font-size: 16px; line-height: 1.6; }
.pricing-sub strong { color: ${C.accent}; font-weight: 600; }
.cards { display: grid; grid-template-columns: repeat(2, minmax(0, 380px)); gap: 24px; justify-content: center; }
.card {
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(10px) saturate(1.06); -webkit-backdrop-filter: blur(10px) saturate(1.06);
  border: 1px solid rgba(255,255,255,0.65); border-radius: 24px;
  padding: 32px 28px; text-align: left; position: relative;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 18px 50px rgba(59,42,26,0.10);
  transition: transform .3s ease, box-shadow .3s ease;
}
.card:hover { transform: translateY(-6px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 30px 70px rgba(59,42,26,0.16); }
.card h4 { margin: 0 0 6px; font-size: 15px; letter-spacing: 1.4px; text-transform: uppercase; color: ${C.soft}; }
.card .price { font-family: var(--font-fraunces), serif; font-size: 38px; font-weight: 600; margin-bottom: 18px; }
.card .price small { font-size: 17px; color: ${C.soft}; font-weight: 400; }
.card .or { font-size: 15px; color: ${C.faint}; font-family: var(--font-inter); }
.card ul { list-style: none; padding: 0; margin: 0; }
.card li { padding: 9px 0; border-top: 1px solid ${C.line}; color: ${C.soft}; font-size: 15px; }
.card.plus {
  border: 1px solid rgba(200,85,61,0.45);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), 0 28px 70px rgba(200,85,61,0.18);
  transform: translateY(-10px) scale(1.015);
  overflow: hidden; /* clips the diagonal launch-deal ribbon into a corner banner */
}
.card.plus:hover { transform: translateY(-16px) scale(1.015); }
.card.plus h4 { color: ${C.accent}; }
.pt-anchor { max-width: 560px; margin: 36px auto 0; color: ${C.soft}; font-size: 16px; line-height: 1.6; }
.pt-anchor strong { color: ${C.ink}; font-weight: 600; }
.plus-save { margin-top: -8px; margin-bottom: 14px; color: ${C.accent}; font-size: 13.5px; font-weight: 600; }
/* festive diagonal corner banner */
.ribbon {
  position: absolute; top: 26px; right: -52px; width: 190px;
  text-align: center; transform: rotate(45deg);
  background: linear-gradient(135deg, ${C.accent}, #E8A24A);
  color: #fff; font-size: 12px; font-weight: 700; letter-spacing: .4px;
  padding: 7px 0; box-shadow: 0 6px 16px rgba(200,85,61,0.30);
}

/* final */
.final { text-align: center; padding: clamp(48px, 7vw, 90px) 20px; position: relative; z-index: 1; }
.final h2 { font-size: clamp(34px, 4.6vw, 56px); margin: 0 0 8px; }
.final p { color: ${C.soft}; margin: 0 0 28px; font-size: 17px; }

/* footer */
.footer {
  border-top: 1px solid ${C.line};
  padding: 28px clamp(20px, 6vw, 72px) 40px;
  display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
  color: ${C.soft}; font-size: 13.5px; position: relative; z-index: 1;
}
.footer > div { display: flex; align-items: center; gap: 10px; }
.footer nav { display: flex; gap: 18px; }
.footer a { color: ${C.soft}; text-decoration: none; }
.footer a:hover { color: ${C.ink}; }
.footer p { margin: 0; flex-basis: 100%; color: ${C.faint}; }

/* responsive */
@media (max-width: 880px) {
  .nav nav { display: none; }
  .hero { grid-template-columns: 1fr; text-align: center; padding-top: 44px; }
  .lede { margin-inline: auto; }
  .hero-ctas, .chips { justify-content: center; }
  .feature { grid-template-columns: 1fr; text-align: center; }
  .feature.flip .feature-text { order: 1; }
  .feature.flip .feature-shot { order: 2; }
  .feature p { margin-inline: auto; }
  .feature ul { display: inline-block; text-align: left; }
  .memory { grid-template-columns: 1fr; text-align: center; }
  .memory-text { order: 1; }
  .memory-shot { order: 2; }
  .memory p { margin-inline: auto; }
  .mem-chips { justify-content: center; }
  .privacy-grid { grid-template-columns: 1fr; }
  .cards { grid-template-columns: minmax(0, 420px); }
  .card.plus { transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .aurora, .aurora::after, .hero-shot, .feature-shot, .equipment-duo figure, .memory-shot { animation: none !important; }
}
`;
