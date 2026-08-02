// The LangToll logo — Tolly's face locked up with a two-tone grotesque wordmark.
//
// The mark is the mascot (matching the app icon and app header); the transit
// roundel now lives on his cap. The wordmark is set in the page's signage
// grotesque (var(--sans)), "Lang" in ink and "Toll" in the rail accent, so the word
// itself carries the two-tone transit identity rather than reading as plain text.
//
// One knob: `height` scales the whole lockup proportionally (roundel, gap, and word).
// Colours come from CSS custom properties, so it sits correctly on the light "day
// service" paper and the dark "night service" navy alike, in both nav and footer.
// (`id` is accepted for call-site compatibility but no longer needed — the old mark
// used a per-instance SVG mask id; this one has no mask.)

export function Logo({ height = 34 }: { height?: number; id?: string }) {
  // The official mark is the fare-paid pose (Ralph's call): full-body Tolly with
  // the stamped ticket — 620x640, near square.
  const tollyW = Math.round(height * (620 / 640));
  return (
    <span
      className="logo"
      role="img"
      aria-label="LangToll"
      style={{ display: 'inline-flex', alignItems: 'flex-end', gap: Math.round(height * 0.26) }}
    >
      {/* Tolly is the mark now (matches the app header + icon); the roundel lives on his cap. */}
      <img
        src="/tolly/tolly-happy.png"
        alt=""
        aria-hidden="true"
        width={tollyW}
        height={height}
        style={{ flex: 'none', objectFit: 'contain' }}
      />
      <span
        className="logo-word"
        style={{ fontSize: Math.round(height * 0.62), lineHeight: 1, paddingBottom: Math.round(height * 0.05) }}
      >
        Lang<b>Toll</b>
      </span>
    </span>
  );
}
