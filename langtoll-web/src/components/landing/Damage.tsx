'use client';
// "The damage" — the app's onboarding mirror as a web widget. Tap the apps that
// steal your nights and watch the number grow: the same heavy-user minutes, the
// same eight-hour cap, the same forty-year horizon as the phone (src/lib/damage.ts
// mirrors langtoll-mobile/lib/projection.ts). The number counts up because a
// jump reads as a lookup and a climb reads as a bill.
import { useEffect, useRef, useState } from 'react';
import { APPS, DEFAULT_APPS, damage, estimateDailyMinutes, formatDaily } from '@/lib/damage';
import { fill, type LandingCopy } from '@/lib/landing-copy';

const COUNT_MS = 520;

export function Damage({ copy, htmlLang, ctaHref }: { copy: LandingCopy['damage']; htmlLang: string; ctaHref: string }) {
  const [picked, setPicked] = useState<readonly string[]>(DEFAULT_APPS);
  const target = estimateDailyMinutes(picked);
  const [shown, setShown] = useState(target);
  const fromRef = useRef(target);
  const raf = useRef(0);

  // Count from the last shown value to the new one; reduced motion jumps.
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    const from = fromRef.current;
    if (from === target) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fromRef.current = target;
      setShown(target);
      return;
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / COUNT_MS);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(from + (target - from) * eased);
      setShown(v);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);

  function toggle(app: string) {
    setPicked((p) => (p.includes(app) ? p.filter((a) => a !== app) : [...p, app]));
  }

  // The lines are computed from the settled target, not the animating value:
  // the days and years must match the number the visitor ends up reading.
  const d = damage(target, copy.course);
  const n = new Intl.NumberFormat(htmlLang);

  return (
    <div className="damage">
      <div className="damage-pick reveal">
        <p className="damage-hint">{copy.hint}</p>
        <div className="damage-chips" role="group" aria-label={copy.title}>
          {APPS.map((app) => {
            const on = picked.includes(app);
            return (
              <button
                key={app}
                type="button"
                className={on ? 'chip on' : 'chip'}
                aria-pressed={on}
                onClick={() => toggle(app)}
              >
                {app}
              </button>
            );
          })}
        </div>
      </div>
      <div className="damage-bill reveal">
        <p className="damage-num" aria-live="polite">{formatDaily(shown)}</p>
        <p className="damage-line">{copy.line}</p>
        <p className="damage-sub">{fill(copy.sub, { days: d.daysPerYear, horizon: 40, years: d.yearsLost })}</p>
        <p className="damage-fluent">
          {fill(copy.fluent, { hours: n.format(d.hoursPerYear), fluent: n.format(d.fluentHours), lang: copy.lang })}
        </p>
        <p className="damage-note">{copy.note}</p>
        <div className="cta-row">
          <a className="btn btn-lime" href={ctaHref}>{copy.cta}</a>
        </div>
      </div>
    </div>
  );
}
