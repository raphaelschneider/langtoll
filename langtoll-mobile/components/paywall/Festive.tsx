// The paywall's party pieces (founder, 2026-09-29: "this is the most important screen of
// them all, we need to make it fun/inviting", "some stars and shit"). A one-time confetti
// burst when the wall opens and a few stars that twinkle on the yearly plan. Both sit
// under pointerEvents="none", both honour Reduce Motion (confetti skipped, stars still),
// and neither runs a loop that never ends off screen: the stars stop when unmounted.
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  Easing,
  ReduceMotion,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const PIECES = 26;

function Piece({ i, width, colors }: { i: number; width: number; colors: string[] }) {
  // Deterministic spread per index, so a re-render never reshuffles the burst.
  const seed = (n: number) => ((Math.sin(i * 97.13 + n * 13.7) + 1) / 2);
  const startX = seed(1) * width;
  const drift = (seed(2) - 0.5) * 120;
  const fall = 260 + seed(3) * 220;
  const spin = (seed(4) - 0.5) * 720;
  const delay = seed(5) * 250;
  const size = 6 + seed(6) * 6;
  const color = colors[i % colors.length]!;
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      delay,
      withTiming(1, { duration: 1400 + seed(7) * 700, easing: Easing.out(Easing.quad), reduceMotion: ReduceMotion.System }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: t.value < 0.75 ? 1 : 1 - (t.value - 0.75) / 0.25,
    transform: [
      { translateX: startX + drift * t.value },
      { translateY: -20 + fall * t.value },
      { rotate: `${spin * t.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        { width: size, height: size * (i % 3 === 0 ? 1 : 0.45), backgroundColor: color, borderRadius: i % 3 === 0 ? size : 1.5 },
        style,
      ]}
    />
  );
}

/** A single burst of confetti over the top of the screen, once, on mount. */
export function Confetti({ colors }: { colors: string[] }) {
  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();
  const pieces = useMemo(() => Array.from({ length: PIECES }, (_, i) => i), []);
  if (reduced) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((i) => (
        <Piece key={i} i={i} width={width} colors={colors} />
      ))}
    </View>
  );
}

/** A star that twinkles in place: scale and fade, offset so a group never pulses in unison. */
export function Twinkle({
  size,
  color,
  delay = 0,
  style,
}: {
  size: number;
  color: string;
  delay?: number;
  style?: object;
}) {
  const v = useSharedValue(0.4);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad), reduceMotion: ReduceMotion.System }),
          withTiming(0.4, { duration: 900, easing: Easing.inOut(Easing.quad), reduceMotion: ReduceMotion.System }),
        ),
        -1,
        false,
      ),
    );
    return () => cancelAnimation(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const anim = useAnimatedStyle(() => ({ opacity: v.value, transform: [{ scale: 0.8 + v.value * 0.3 }] }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute' }, style, anim]}>
      <Ionicons name="sparkles" size={size} color={color} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', top: 0, left: 0 },
});
