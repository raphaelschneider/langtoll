// A rotary dial for the unlock time (founder, 2026-09-30: "instead of this simple drag
// that goes horizontally, we should make it a rotator"). Turning a knob is what a ticket
// machine does, and it fits an uneven scale: 5-minute clicks up to an hour, 15-minute
// clicks up to two, one haptic tick per stop.
//
// PanResponder, not gesture-handler, for the same reason as FareSlider: the app has no
// GestureHandlerRootView and a missing root fails silently. Touches are read in page
// coordinates against the dial's measured centre, because locationX is relative to
// whichever child was touched (FareSlider's "always starts from 10 min" bug).
import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/design/theme';
import { withAlpha } from '@/lib/color';

const SWEEP = 300; // degrees of travel; the gap sits at the bottom
const START = -SWEEP / 2; // degrees from 12 o'clock, clockwise positive

export function FareDial({
  value,
  stops,
  onChange,
  format,
  caption,
  size = 232,
}: {
  value: number;
  /** The allowed values, ascending. */
  stops: readonly number[];
  onChange: (value: number) => void;
  format: (value: number) => string;
  /** Small line under the value, e.g. "per unlock". */
  caption?: string;
  size?: number;
}) {
  const theme = useTheme();
  const index = Math.max(0, stops.indexOf(value));
  const ref = useRef<View>(null);
  const centre = useRef({ x: 0, y: 0 });
  // Callbacks read through a ref: the responder is created once.
  const cfg = useRef({ index, stops, onChange });
  cfg.current = { index, stops, onChange };
  const [active, setActive] = useState(false);

  const stroke = 14;
  const r = size / 2 - stroke;
  const cx = size / 2;
  const cy = size / 2;

  const angleOf = (i: number) => START + (SWEEP * i) / Math.max(1, stops.length - 1);
  const point = (deg: number, radius = r) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  function commitAt(pageX: number, pageY: number) {
    const c = cfg.current;
    const dx = pageX - centre.current.x;
    const dy = pageY - centre.current.y;
    let deg = (Math.atan2(dx, -dy) * 180) / Math.PI; // 0 at top, clockwise
    // In the gap at the bottom: hold the end nearest to where the finger came from.
    if (deg > SWEEP / 2 || deg < -SWEEP / 2) deg = c.index > (c.stops.length - 1) / 2 ? SWEEP / 2 : -SWEEP / 2;
    const i = Math.round(((deg - START) / SWEEP) * (c.stops.length - 1));
    const next = Math.min(c.stops.length - 1, Math.max(0, i));
    // One stop at a time: a finger swept across the gap must not leap end to end.
    if (Math.abs(next - c.index) > c.stops.length / 2) return;
    if (next !== c.index) {
      c.index = next;
      Haptics.selectionAsync();
      c.onChange(c.stops[next]!);
    }
  }

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // A dial inside a ScrollView must keep the gesture once it has it.
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        setActive(true);
        const { pageX, pageY } = e.nativeEvent;
        ref.current?.measure((_x, _y, w, h, px, py) => {
          centre.current = { x: px + w / 2, y: py + h / 2 };
          commitAt(pageX, pageY);
        });
      },
      onPanResponderMove: (e) => commitAt(e.nativeEvent.pageX, e.nativeEvent.pageY),
      onPanResponderRelease: () => setActive(false),
      onPanResponderTerminate: () => setActive(false),
    }),
  ).current;

  const arc = (from: number, to: number) => {
    const p = Skia.Path.Make();
    p.addArc({ x: cx - r, y: cy - r, width: r * 2, height: r * 2 }, from - 90, to - from);
    return p;
  };
  const knob = point(angleOf(index));
  // A tick at every whole hour and at the ends, so the scale reads at a glance.
  const ticks = stops
    .map((m, i) => ({ m, i }))
    .filter(({ m, i }) => m % 60 === 0 || i === 0)
    .map(({ i }) => ({ a: point(angleOf(i), r - stroke - 4), b: point(angleOf(i), r - stroke - 12) }));

  return (
    <View
      ref={ref}
      {...pan.panHandlers}
      style={{ width: size, height: size, alignSelf: 'center' }}
      accessible
      accessibilityRole="adjustable"
      accessibilityValue={{ text: format(value) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        const d = e.nativeEvent.actionName === 'increment' ? 1 : -1;
        const next = Math.min(stops.length - 1, Math.max(0, index + d));
        if (next !== index) onChange(stops[next]!);
      }}
    >
      <Canvas style={StyleSheet.absoluteFill}>
        <Path path={arc(START, START + SWEEP)} style="stroke" strokeWidth={stroke} strokeCap="round" color={theme.fillStrong} />
        <Path path={arc(START, angleOf(index))} style="stroke" strokeWidth={stroke} strokeCap="round" color={theme.accent} />
        {ticks.map((tk, i) => {
          const p = Skia.Path.Make();
          p.moveTo(tk.a.x, tk.a.y);
          p.lineTo(tk.b.x, tk.b.y);
          return <Path key={i} path={p} style="stroke" strokeWidth={2} strokeCap="round" color={withAlpha(theme.ink, 0.35)} />;
        })}
        <Circle cx={knob.x} cy={knob.y} r={active ? stroke + 3 : stroke} color={theme.ink} />
        <Circle cx={knob.x} cy={knob.y} r={(active ? stroke + 3 : stroke) - 4} color={theme.accent} />
      </Canvas>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.centre]}>
        <Text variant="title" center>
          {format(value)}
        </Text>
        {caption ? (
          <Text variant="callout" color="inkSoft" center style={{ marginTop: 2 }}>
            {caption}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centre: { alignItems: 'center', justifyContent: 'center' },
});
