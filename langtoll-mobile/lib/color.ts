// Small color utilities for shaders and interpolation.

/** "#RRGGBB" -> [r, g, b] in 0..1 for SkSL float3 uniforms. */
export function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return [r, g, b];
}

/** "#RRGGBB" + alpha (0..1) -> "rgba(r, g, b, a)". Lets components tint theme
 *  colors (accent, danger…) without hardcoding a specific hue's rgba. */
export function withAlpha(hex: string, a: number): string {
  const [r, g, b] = hexToRgb01(hex);
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
}

/** Mix between two "#RRGGBB" colors by t in 0..1. */
export function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb01(a);
  const [br, bg, bb] = hexToRgb01(b);
  const to = (x: number) =>
    Math.round(Math.max(0, Math.min(1, x)) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(ar + (br - ar) * t)}${to(ag + (bg - ag) * t)}${to(ab + (bb - ab) * t)}`;
}

/** Pain level (1-10) on the calm pine -> amber -> terracotta gradient. */
export function painColor(level: number): string {
  const t = Math.max(0, Math.min(1, (level - 1) / 9));
  return t < 0.5 ? mixHex('#2E5E4E', '#D99A4E', t / 0.5) : mixHex('#D99A4E', '#C8553D', (t - 0.5) / 0.5);
}
