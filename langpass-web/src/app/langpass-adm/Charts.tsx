'use client';
// Interactive bar chart for the admin dashboard: hover any column to read that day's real number
// (and date) in a tooltip. A transparent full-height hit-rect per column makes even empty/tiny days
// hoverable. Kept as a small client island so the page itself stays a server component.
import { useState } from 'react';

const BRAND = { ink: '#14110E', inkSoft: '#6B6258', line: '#E7E1D8', surface: '#FFFFFF' };

export interface DayCount {
  day: string;
  n: number;
}

const fmtDay = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export function BarChart({ data, color, title }: { data: DayCount[]; color: string; title: string }) {
  // Fill a continuous 30-day window so gaps render as empty days (mirrors the old Bars()).
  const days: DayCount[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    days.push({ day: d, n: data.find((x) => x.day === d)?.n ?? 0 });
  }
  const max = Math.max(1, ...days.map((d) => d.n));
  const total = days.reduce((a, d) => a + d.n, 0);
  const [hover, setHover] = useState<number | null>(null);
  const W = 600;
  const H = 120;
  const bw = W / days.length;

  return (
    <div style={{ background: BRAND.surface, border: `1px solid ${BRAND.line}`, borderRadius: 20, padding: 24, flex: 1, minWidth: 320 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <div style={{ fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: BRAND.inkSoft, fontWeight: 600 }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: BRAND.inkSoft }}>{total.toLocaleString()} total</div>
      </div>

      <div style={{ position: 'relative' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          {days.map((d, i) => {
            const h = Math.max(2, (d.n / max) * (H - 18));
            const active = hover === i;
            return (
              <rect
                key={`bar-${d.day}`}
                x={i * bw + 2}
                y={H - h}
                width={bw - 4}
                height={h}
                rx={3}
                fill={d.n ? color : BRAND.line}
                opacity={active ? 1 : d.n ? 0.9 : 0.6}
              />
            );
          })}
          {/* transparent full-height hit areas so the whole column is hoverable, not just the bar */}
          {days.map((d, i) => (
            <rect
              key={`hit-${d.day}`}
              x={i * bw}
              y={0}
              width={bw}
              height={H}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((h) => (h === i ? null : h))}
            >
              <title>{`${fmtDay(d.day)} · ${d.n}`}</title>
            </rect>
          ))}
        </svg>

        {hover !== null && (
          <div
            style={{
              position: 'absolute',
              left: `${((hover + 0.5) / days.length) * 100}%`,
              top: -4,
              transform: 'translate(-50%, -100%)',
              background: BRAND.ink,
              color: '#fff',
              padding: '5px 9px',
              borderRadius: 8,
              fontSize: 12,
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              zIndex: 2,
            }}
          >
            <strong style={{ fontSize: 14 }}>{days[hover].n.toLocaleString()}</strong>{' '}
            <span style={{ opacity: 0.7 }}>· {fmtDay(days[hover].day)}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: BRAND.inkSoft, marginTop: 6 }}>
        <span>30 days ago</span>
        <span>peak {max.toLocaleString()}</span>
        <span>today</span>
      </div>
    </div>
  );
}
