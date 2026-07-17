'use client';
// Progressive-enhancement scroll reveals. The server renders .reveal content fully
// VISIBLE, so with no JS (or before hydration) nothing is hidden. On mount we only
// arm the elements that are still below the fold — they fade up as they scroll in —
// and leave anything already on screen untouched, so there's no flash.
import { useEffect } from 'react';

export function ScrollReveals() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; // leave everything visible
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      const inView = r.top < window.innerHeight && r.bottom > 0;
      if (!inView) {
        el.classList.add('armed');
        io.observe(el);
      }
    });
    return () => io.disconnect();
  }, []);

  return null;
}
