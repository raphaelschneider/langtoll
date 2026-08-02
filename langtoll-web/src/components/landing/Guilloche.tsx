'use client';
// The safety-paper guilloché behind the hero — the fine interference-line pattern printed on
// real travel documents and tickets, reinforcing the fare-gate metaphor. Purely decorative
// (aria-hidden). Drawn on <canvas> rather than hand-authored SVG paths; it reads the live
// --rail accent so it re-tints correctly in the light "day service" and dark "night service"
// themes. Static — no animation loop — so it never reads as busy, and it costs nothing after
// first paint. Redraws only on resize (debounced) and once after mount to pick up the theme.
import { useEffect, useRef } from 'react';

const CURVES = [
  { R: 210, r: 52, d: 150, alpha: 0.16, turns: 52 },
  { R: 170, r: 34, d: 120, alpha: 0.11, turns: 40 },
  { R: 250, r: 67, d: 190, alpha: 0.08, turns: 68 },
];

export function Guilloche() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const accent = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--rail').trim() || '#1C5A66';

    const draw = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // Centre the rosette over the pass (right column on desktop, behind everything on mobile).
      const cx = w * (w > 900 ? 0.72 : 0.5);
      const cy = h * 0.46;
      ctx.strokeStyle = accent();
      ctx.lineWidth = 0.6;
      for (const p of CURVES) {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        const steps = p.turns * 60;
        const k = (p.R - p.r) / p.r;
        for (let i = 0; i <= steps; i++) {
          const t = (i / 60) * Math.PI * 2;
          const x = cx + (p.R - p.r) * Math.cos(t) + p.d * Math.cos(k * t);
          const y = cy + (p.R - p.r) * Math.sin(t) - p.d * Math.sin(k * t);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    draw();
    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(draw, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className="guilloche" aria-hidden="true" />;
}
