// A pressable that springs down on touch and fires a haptic — the base feel for every
// interactive surface in the app.
import React from 'react';
import { Pressable, type PressableProps, type ViewStyle, type StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { spring, press } from '@/design/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  haptic?: Haptics.ImpactFeedbackStyle | null;
}

export function PressableScale({
  children,
  style,
  scaleTo = press.scale,
  haptic = Haptics.ImpactFeedbackStyle.Light,
  onPressIn,
  onPress,
  ...rest
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, spring.snappy);
        onPressIn?.(e);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, spring.soft);
      }}
      onPress={(e) => {
        if (haptic != null) Haptics.impactAsync(haptic).catch(() => {});
        onPress?.(e);
      }}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
