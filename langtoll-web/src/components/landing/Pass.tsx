'use client';
// The hero pass — an interactive React client component, now styled as the travelcard.
//   • Desktop (fine pointer): hovering the card flips it ACTIVE → EXPIRED (the green VALID
//     stamp fades and the red EXPIRED stamp slams in), and it tilts to the pointer. Leaving
//     resets it and the countdown resumes.
//   • Mobile (coarse pointer): as the card scrolls up past the middle of the screen it
//     animates to EXPIRED on its own, so touch users see the same beat.
//   • Tap / Enter / Space toggles it too (keyboard-accessible).
// The countdown IS the product: the timer is the phone-time your reps bought; EXPIRED means
// the wall is back. The barcode, line dots, perforation and stamps are real markup, so nothing
// depends on a fragile inline <script>. All wording comes in as `copy` (COPY[locale].pass).
import { useEffect, useRef, useState } from 'react';
import type { LandingCopy } from '@/lib/landing-copy';

const BARCODE = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 2, 1, 4, 1, 3, 1, 2, 1, 1, 3];
// The six lines the pass is valid on — transit-line colours, matched to the languages board.
const LINES = ['#C63A24', '#1C5A66', '#2E7D46', '#B5852A', '#7A4EA3', '#35618E'];
const START = 29 * 60 + 37; // 29:37
const TOTAL = 30 * 60;

export function Pass({ copy }: { copy: LandingCopy['pass'] }) {
  const [expired, setExpired] = useState(false);
  const [left, setLeft] = useState(START);
  const sceneRef = useRef<HTMLDivElement>(null);
  const passRef = useRef<HTMLDivElement>(null);

  // Live countdown (paused when expired or when the user prefers reduced motion).
  useEffect(() => {
    if (expired) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setLeft((p) => (p <= 27 * 60 ? START : p - 1)), 1000);
    return () => clearInterval(id);
  }, [expired]);

  // Interaction: hover-to-expire + tilt on desktop; scroll-to-expire on mobile.
  useEffect(() => {
    const scene = sceneRef.current;
    const pass = passRef.current;
    if (!scene || !pass) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (fine) {
      const enter = () => setExpired(true);
      const leave = () => {
        setExpired(false);
        pass.style.transform = '';
      };
      const move = (e: MouseEvent) => {
        if (reduce) return;
        const r = scene.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        pass.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      };
      scene.addEventListener('mouseenter', enter);
      scene.addEventListener('mouseleave', leave);
      scene.addEventListener('mousemove', move);
      return () => {
        scene.removeEventListener('mouseenter', enter);
        scene.removeEventListener('mouseleave', leave);
        scene.removeEventListener('mousemove', move);
      };
    }

    // Coarse pointer: expire once the card's center scrolls above 55% of the viewport.
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

  const m = Math.floor(left / 60);
  const s = left % 60;
  const timeStr = expired ? '00:00' : `${m}:${s < 10 ? '0' : ''}${s}`;
  const fillPct = expired ? 0 : (left / TOTAL) * 100;
  const toggle = () => setExpired((e) => !e);

  return (
    <div className="pass-scene" ref={sceneRef}>
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
        aria-label={expired ? copy.ariaExpired : copy.ariaActive}
      >
        <div className="pass-head">
          <span className="pass-issuer">
            <svg width="18" height="18" viewBox="0 0 30 30" aria-hidden="true">
              <circle cx="15" cy="15" r="13" fill="none" stroke="currentColor" strokeWidth="3" />
              <rect x="4" y="12.5" width="22" height="5" fill="currentColor" />
            </svg>
            {copy.brandLabel}
          </span>
          <span className="chip"><span className="dot" />{expired ? copy.stateExpired : copy.stateActive}</span>
        </div>

        <div className="pass-timer">{timeStr}</div>
        <p className="pass-note">{expired ? copy.noteExpired : copy.noteActive}</p>
        <div className="pass-track"><div className="pass-fill" style={{ width: `${fillPct}%` }} /></div>

        <div className="pass-lines" aria-hidden="true">
          {LINES.map((c, i) => <i key={i} style={{ background: c }} />)}
        </div>

        <div className="perf" aria-hidden="true" />

        <div className="pass-data">
          <div>
            <span className="k">{copy.passengerLabel}</span>
            <span className="v">{copy.passengerName}</span>
          </div>
          <div className="pass-stub">
            <span className="barcode" aria-hidden="true">{BARCODE.map((w, i) => <i key={i} style={{ width: w }} />)}</span>
            <span className="stub-meta">{copy.stubMeta}<br />№ 0047</span>
          </div>
        </div>

        <span className="stamp stamp-valid" aria-hidden>{copy.stateActive}</span>
        <span className="stamp stamp-expired" aria-hidden>{copy.stamp}</span>
      </div>
    </div>
  );
}
