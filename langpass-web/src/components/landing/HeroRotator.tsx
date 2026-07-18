'use client';
// Rotating hero copy, laid out so NOTHING shifts as it rotates:
//   • All headline variants are stacked in one grid cell (see .hero-headline), so the
//     headline box is always as tall as the tallest variant — the CTAs below never move.
//   • The sub-paragraph is static; only the language word rotates, and it lives in a
//     fixed-width slot (.lang) so the sentence never reflows horizontally or wraps.
// Both the active headline and the word cross-fade in sync. SSR shows the first variant.
//
// The copy (headlines + the localized name of each language) is passed in from the server so
// this component stays locale-agnostic — see COPY[locale].hero in src/lib/landing-copy.ts.
import { useEffect, useState } from 'react';
import type { LandingCopy } from '@/lib/landing-copy';
import type { Locale } from '@/lib/locales';

export function HeroRotator({ copy, locale }: { copy: LandingCopy['hero']; locale: Locale }) {
  // Never advertise the reader's own language back at them — a German visitor
  // seeing "Erst Deutsch, dann TikTok" is being sold a course in German. Each
  // locale ships four variants so three always remain after this filter.
  const variants = copy.variants.filter((v) => v.code !== locale);
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);

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

  const v = variants[i];

  return (
    <>
      {/* every headline occupies the same grid cell → box height = tallest variant */}
      <div className="hero-headline">
        {variants.map((vr, idx) => (
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
        {copy.subBefore}
        <span className="lang hero-rot" style={{ opacity: show ? 1 : 0 }}>{v.lang}</span>
        {copy.subAfter}
        <strong>{copy.subStrong}</strong>
        {copy.subTail}
      </p>
    </>
  );
}
