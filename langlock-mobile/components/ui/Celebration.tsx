// The all-done moment. When the last exercise of the day is checked off, brand-colored
// confetti drifts down over a frosted card: Sage, a serif headline, the streak, and one
// button to take the win. No extra taps required to "finish" the day — this IS the finish.
import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Text } from './Text';
import { Button } from './Button';
import { useTheme, radius, space, palette } from '@/design/theme';

const SAGE = require('../../assets/images/sage.png');
const CONFETTI_COLORS = [palette.accent, palette.pine, palette.amber, palette.accentSoft, '#7FA593'];
const PIECES = 18;

function Confetto({ index, height }: { index: number; height: number }) {
  const fall = useSharedValue(0);
  const seed = useMemo(
    () => ({
      x: Math.random(),
      delay: Math.random() * 900,
      duration: 2600 + Math.random() * 1800,
      size: 7 + Math.random() * 7,
      spin: (Math.random() - 0.5) * 720,
      sway: (Math.random() - 0.5) * 70,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      round: Math.random() > 0.5,
    }),
    [index]
  );

  useEffect(() => {
    fall.value = withDelay(
      seed.delay,
      withRepeat(withTiming(1, { duration: seed.duration, easing: Easing.in(Easing.quad) }), -1)
    );
  }, [fall, seed]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: -30 + fall.value * (height + 60) },
      { translateX: Math.sin(fall.value * Math.PI * 2) * seed.sway },
      { rotate: `${fall.value * seed.spin}deg` },
    ],
    opacity: fall.value < 0.9 ? 1 : (1 - fall.value) * 10,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: 0,
          left: `${8 + seed.x * 84}%`,
          width: seed.size,
          height: seed.size * (seed.round ? 1 : 1.7),
          borderRadius: seed.round ? seed.size / 2 : 2.5,
          backgroundColor: seed.color,
        },
        style,
      ]}
    />
  );
}

export function Celebration({
  name,
  streak,
  onClose,
}: {
  name: string | null;
  streak: number;
  onClose: () => void;
}) {
  const theme = useTheme();
  const { height } = useWindowDimensions();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(300)} style={StyleSheet.absoluteFill}>
      <BlurView intensity={36} tint={theme.scheme === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.glassTint }]} />

      {Array.from({ length: PIECES }, (_, i) => (
        <Confetto key={i} index={i} height={height} />
      ))}

      <View style={styles.center}>
        <Animated.View
          entering={FadeInDown.duration(450).easing(Easing.out(Easing.cubic)).delay(120)}
          style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}
        >
          <Image source={SAGE} style={styles.sage} />
          <Text variant="overline" color="accent" center style={{ marginTop: space.md }}>
            All done for today
          </Text>
          <Text variant="title" color="ink" center style={{ marginTop: 4 }}>
            {name ? `That's everything, ${name}.` : "That's everything."}
          </Text>
          <Text variant="serif" color="inkSoft" center style={{ marginTop: space.sm }}>
            Every exercise, done. Your body keeps score — and today it scored for you.
          </Text>

          <View style={[styles.streak, { backgroundColor: theme.surfaceAlt, borderColor: theme.line }]}>
            <Ionicons name="flame" size={16} color={theme.accent} />
            <Text variant="label" color="ink">
              {streak}-day streak
            </Text>
          </View>

          <Button label="Take the win" variant="pine" onPress={onClose} full style={{ marginTop: space.lg }} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: space.xl,
    alignItems: 'center',
    shadowColor: '#3B2A1A',
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 16 },
  },
  sage: { width: 84, height: 84, borderRadius: 42 },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: space.lg,
  },
});
