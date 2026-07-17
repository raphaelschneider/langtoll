// The pass-issuing moment: the ticket prints (slides up with a slight tilt and
// settles), then a PAID stamp slams onto it with overshoot and a heavy haptic.
// Wraps PassCard so the done-screen just swaps <PassCard> for <PassIssue>.
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { PassCard } from './PassCard';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/design/theme';
import { t } from '@/lib/i18n';

const STAMP_DELAY = 750;

type PassCardProps = React.ComponentProps<typeof PassCard>;

export function PassIssue(props: PassCardProps) {
  const theme = useTheme();

  // the ticket prints…
  const rise = useSharedValue(0);
  // …then the stamp slams
  const stamp = useSharedValue(0);

  useEffect(() => {
    rise.value = withSpring(1, { damping: 16, stiffness: 90, mass: 1.1 });
    stamp.value = withDelay(
      STAMP_DELAY,
      withSpring(1, { damping: 12, stiffness: 260, mass: 0.7 })
    );
    const h = setTimeout(
      () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
      STAMP_DELAY + 60
    );
    return () => clearTimeout(h);
  }, [rise, stamp]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: rise.value,
    transform: [
      { translateY: (1 - rise.value) * 260 },
      { rotate: `${(1 - rise.value) * -5}deg` },
    ],
  }));

  const stampStyle = useAnimatedStyle(() => ({
    opacity: stamp.value,
    transform: [{ scale: 2.6 - stamp.value * 1.6 }, { rotate: '-14deg' }],
  }));

  return (
    <Animated.View style={cardStyle}>
      <PassCard {...props} />
      <Animated.View pointerEvents="none" style={[styles.stamp, stampStyle]}>
        <View style={[styles.stampBox, { borderColor: theme.accent }]}>
          <Text
            variant="overline"
            style={{ color: theme.accent, fontSize: 22, lineHeight: 26, letterSpacing: 4 }}
          >
            {t('pass.paid')}
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stamp: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampBox: {
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: 'rgba(200,255,77,0.08)',
  },
});
