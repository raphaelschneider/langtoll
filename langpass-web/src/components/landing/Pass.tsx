'use client';
// The hero pass — an interactive React client component.
//   • Desktop (fine pointer): hovering the card flips it ACTIVE → EXPIRED (stamp slams
//     in), and it tilts to the pointer. Leaving resets it and the countdown resumes.
//   • Mobile (coarse pointer): as the card scrolls up past the middle of the screen it
//     animates to EXPIRED on its own, so touch users see the same beat.
//   • Tap / Enter / Space toggles it too (keyboard-accessible).
// The barcode and perforation are real markup and the countdown is React state, so
// nothing here depends on a fragile inline <script>.
import { useEffect, useRef, useState } from 'react';

const BARCODE = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 2, 1, 4, 1, 3, 1, 2, 1, 1, 3];
const START = 29 * 60 + 37; // 29:37
const TOTAL = 30 * 60;

export function Pass() {
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
        aria-label={expired ? 'Expired pass' : 'Active pass — hover to see it expire'}
      >
        <div className="pass-head">
          <span className="label">LangPass</span>
          <span className="chip"><span className="dot" />{expired ? 'EXPIRED' : 'ACTIVE'}</span>
        </div>
        <div className="pass-timer">{timeStr}</div>
        <p className="pass-note">{expired ? 'do five reps to print another' : 'of phone time left'}</p>
        <div className="pass-track"><div className="pass-fill" style={{ width: `${fillPct}%` }} /></div>
        <div className="pass-passenger">
          <span className="label">Passenger</span>
          <div className="who">YOU</div>
        </div>
        <div className="perf">{Array.from({ length: 12 }).map((_, i) => <i key={i} />)}</div>
        <div className="pass-stub">
          <div className="barcode">{BARCODE.map((w, i) => <i key={i} style={{ width: w }} />)}</div>
          <div className="stub-meta">DE · A1<br />№ 0047</div>
        </div>
        <span className="stamp" aria-hidden>EXPIRED</span>
      </div>
    </div>
  );
}
