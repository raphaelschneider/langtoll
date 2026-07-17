// Wraps children with a soft spring entrance (fade + rise). Used for chat rows and cards.
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import type { ViewStyle, StyleProp } from 'react-native';
import { spring, timing } from '@/design/motion';

export function Entrance({
  children,
  delay = 0,
  from = 14,
  style,
  animate = true,
}: {
  children: React.ReactNode;
  delay?: number;
  from?: number;
  style?: StyleProp<ViewStyle>;
  /** When false, render in place with no entrance (e.g. bulk-loaded history / focus switch). */
  animate?: boolean;
}) {
  // Two drivers so opacity can't lag: `p` springs the rise, `o` fades the opacity on its own clean
  // timing. The old code read `opacity: withTiming(p.value, …)` — wrapping an already-animating value
  // in withTiming makes opacity CHASE a moving target every frame, so it lagged ~240ms behind and the
  // row sat near-invisible after mount (the "blank flicker before the message appears"). Reading the
  // values directly fixes it: the message fades in immediately and smoothly, like a real chat.
  const p = useSharedValue(animate ? 0 : 1);
  const o = useSharedValue(animate ? 0 : 1);
  useEffect(() => {
    if (animate) {
      p.value = withDelay(delay, withSpring(1, spring.soft));
      o.value = withDelay(delay, withTiming(1, timing.base));
    }
  }, [delay, p, o, animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: o.value,
    transform: [{ translateY: (1 - p.value) * from }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
