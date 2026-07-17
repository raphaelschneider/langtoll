'use client';
// Rotating hero copy, laid out so NOTHING shifts as it rotates:
//   • All headline variants are stacked in one grid cell (see .hero-headline), so the
//     headline box is always as tall as the tallest variant — the CTAs below never move.
//   • The sub-paragraph is static; only the language word rotates, and it lives in a
//     fixed-width slot (.lang) so the sentence never reflows horizontally or wraps.
// Both the active headline and the word cross-fade in sync. SSR shows the first variant.
import { useEffect, useState } from 'react';

const VARIANTS = [
  { headline: 'Erst Deutsch, dann TikTok.', lang: 'German' },
  { headline: 'Primero español, luego Instagram.', lang: 'Spanish' },
  { headline: 'Primeiro português, depois YouTube.', lang: 'Portuguese' },
];

export function HeroRotator() {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = setInterval(() => {
      if (reduce) {
        setI((v) => (v + 1) % VARIANTS.length);
        return;
      }
      setShow(false);
      window.setTimeout(() => {
        setI((v) => (v + 1) % VARIANTS.length);
        setShow(true);
      }, 380);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const v = VARIANTS[i];

  return (
    <>
      {/* every headline occupies the same grid cell → box height = tallest variant */}
      <div className="hero-headline">
        {VARIANTS.map((vr, idx) => (
          <h1
            key={idx}
            className="hero-rot"
            aria-hidden={idx !== i}
            style={{ opacity: idx === i && show ? 1 : 0 }}
          >
            {vr.headline}
          </h1>
        ))}
      </div>
      {/* static sub — only the language word rotates, in a fixed-width slot (no reflow) */}
      <p className="sub">
        LangPass locks the apps that eat your nights — until you&apos;ve done your{' '}
        <span className="lang hero-rot" style={{ opacity: show ? 1 : 0 }}>{v.lang}</span> reps.{' '}
        <strong>Five quick exercises buy 30 minutes of phone time.</strong> Then the wall comes
        back. You&apos;ll learn, because you can&apos;t not.
      </p>
    </>
  );
}
