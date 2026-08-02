'use client';
// The hero, as one live unit so the travelcard and the headline rotate in lockstep — AND the
// card keeps the phone-time countdown + expiration animation (the product hook).
//
//   • ROTATION: a single index drives both columns. The left headline/sub cycle languages; the
//     card reprints for the same language each beat — big endonym (ENDONYMS), PASS NO. suffix
//     and serial (the language code), cross-fading in sync. The reader's own language is
//     filtered out; every locale ships four variants so three survive the filter.
//   • COUNTDOWN: the "VALID THRU" field is the live phone-time meter (29:37, ticking down).
//   • EXPIRATION: hover (desktop) or scroll past centre (mobile) — or tap/Enter/Space — flips
//     the card to EXPIRED: the green VALID stamp fades, the red EXPIRED stamp slams in, the
//     left rail and timer turn vermilion, the clock hits 00:00. Desktop also tilts to pointer.
//
// All ticket wording comes from COPY[locale].pass(.card); only the rotating language name/code
// is derived here.
import { useEffect, useRef, useState } from 'react';
import { ENDONYMS, type Locale } from '@/lib/locales';
import type { LandingCopy } from '@/lib/landing-copy';

const BARCODE = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 2, 1, 4, 1, 3, 1, 2, 1, 1, 3];
// The six lines the pass is valid on — transit-line colours, matched to the languages board.
const LINES = ['#C63A24', '#1C5A66', '#2E7D46', '#B5852A', '#7A4EA3', '#35618E'];
const START = 29 * 60 + 37; // 29:37

export function HeroLive({
  hero,
  pass,
  locale,
  issued,
}: {
  hero: LandingCopy['hero'];
  pass: LandingCopy['pass'];
  locale: Locale;
  issued: string;
}) {
  const variants = hero.variants.filter((v) => v.code !== locale);
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);
  const [expired, setExpired] = useState(false);
  const [left, setLeft] = useState(START);
  const sceneRef = useRef<HTMLDivElement>(null);
  const passRef = useRef<HTMLDivElement>(null);

  // Language rotation — drives both the headline and the card.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = setInterval(() => {
      if (reduce) {
        setI((v) => (v + 1) % variants.length);
        return;
      }
      setShow(false);
      window.setTimeout(() => {
        setI((v) => (v + 1) % variants.length);
        setShow(true);
      }, 380);
    }, 4200);
    return () => clearInterval(id);
  }, [variants.length]);

  // Phone-time countdown (paused when expired or when the user prefers reduced motion).
  useEffect(() => {
    if (expired) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setLeft((p) => (p <= 27 * 60 ? START : p - 1)), 1000);
    return () => clearInterval(id);
  }, [expired]);

  // Expiration: hover-to-expire on desktop; scroll-to-expire on mobile. (The
  // pointer 3D tilt is gone — Tolly perches on the scene, not the card, so a
  // card that leaned under a static Tolly read as broken. App-side gyro tilt
  // was removed for the same reason.)
  useEffect(() => {
    const scene = sceneRef.current;
    const pass = passRef.current;
    if (!scene || !pass) return;
    const fine = window.matchMedia('(pointer: fine)').matches;

    if (fine) {
      const enter = () => setExpired(true);
      const leave = () => setExpired(false);
      scene.addEventListener('mouseenter', enter);
      scene.addEventListener('mouseleave', leave);
      return () => {
        scene.removeEventListener('mouseenter', enter);
        scene.removeEventListener('mouseleave', leave);
      };
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = pass.getBoundingClientRect();
        const center = r.top + r.height / 2;
        setExpired(center < window.innerHeight * 0.55);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const v = variants[i];
  const code = v.code.toUpperCase();
  const bigName = ENDONYMS[v.code];
  const fromName = ENDONYMS[locale];
  const card = pass.card;
  const mm = Math.floor(left / 60);
  const ss = left % 60;
  const timeStr = expired ? '00:00' : `${mm}:${ss < 10 ? '0' : ''}${ss}`;
  const toggle = () => setExpired((e) => !e);

  return (
    <>
      <div>
        <p className="eyebrow">{hero.eyebrow}</p>

        {/* every headline occupies the same grid cell → box height = tallest variant */}
        <div className="hero-headline">
          {variants.map((vr, idx) => (
            <h1 key={idx} className="hero-rot" aria-hidden={idx !== i} style={{ opacity: idx === i && show ? 1 : 0 }}>
              {vr.headline}
            </h1>
          ))}
        </div>

        {/* static sub — only the language word rotates, in a fixed-width slot (no reflow) */}
        <p className="sub">
          {hero.subBefore}
          <span className="lang hero-rot" style={{ opacity: show ? 1 : 0 }}>{v.lang}</span>
          {hero.subAfter}
          <strong>{hero.subStrong}</strong>
          {hero.subTail}
        </p>

        <div className="cta-row">
          <a className="btn btn-lime" href="#pricing">{hero.ctaPrimary}</a>
          <a className="btn btn-ghost" href="#how">{hero.ctaSecondary}</a>
        </div>
      </div>

      {/* the season travelcard — reprints for the rotating language, counts down, expires */}
      <div className="pass-scene" ref={sceneRef}>
        {/* Tolly at the booth — same perch as the app's home card and the app icon.
            Watches while the pass is valid; sulks when the visitor expires it. */}
        <img
          className="tolly-perch"
          src={expired ? '/tolly/tolly-peek-sad.png' : '/tolly/tolly-peek.png'}
          alt=""
          aria-hidden="true"
          width={78}
        />
        <div
          className={`pass print${expired ? ' expired' : ''}`}
          ref={passRef}
          role="button"
          tabIndex={0}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggle();
            }
          }}
          aria-label={expired ? pass.ariaExpired : pass.ariaActive}
        >
          <div className="pass-head">
            <span className="pass-issuer">
              <svg width="18" height="18" viewBox="0 0 30 30" aria-hidden="true">
                <circle cx="15" cy="15" r="13" fill="none" stroke="currentColor" strokeWidth="3" />
                <rect x="4" y="12.5" width="22" height="5" fill="currentColor" />
              </svg>
              {pass.brandLabel}
            </span>
            <span className="pass-class">{card.classLine}<br />{card.subLine}</span>
          </div>

          <div className="pass-lang">
            <div className="big hero-rot" style={{ opacity: show ? 1 : 0 }}>{bigName}</div>
            <div className="pass-from">{card.from} · {fromName}</div>
          </div>

          <span className="stamp stamp-valid" aria-hidden="true">{card.valid}</span>
          <span className="stamp stamp-expired" aria-hidden="true">{pass.stamp}</span>

          <div className="pass-lines" aria-hidden="true">
            {LINES.map((c, idx) => <i key={idx} style={{ background: c }} />)}
          </div>

          <div className="perf" aria-hidden="true"><i /><span>{card.tear}</span><i /></div>

          <div className="pass-data">
            <div><span className="k">{card.passNo}</span><span className="v hero-rot" style={{ opacity: show ? 1 : 0 }}>LP·0042·{code}</span></div>
            <div><span className="k">{card.issued}</span><span className="v">{issued}</span></div>
            <div><span className="k">{card.validThru}</span><span className="v v-timer">{timeStr}</span></div>
            <div><span className="k">{card.holder}</span><span className="v">{card.holderValue}</span></div>
          </div>

          <div className="pass-foot">
            <span className="barcode" aria-hidden="true">{BARCODE.map((w, idx) => <i key={idx} style={{ width: w }} />)}</span>
            <span className="pass-serial hero-rot" style={{ opacity: show ? 1 : 0 }}>✱ LP26·{code}·0042 ✱</span>
          </div>
        </div>
      </div>
    </>
  );
}
