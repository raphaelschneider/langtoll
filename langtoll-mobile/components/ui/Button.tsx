// Primary / ghost button built on the spring-press primitive.
import React from 'react';
import { View, StyleSheet, ActivityIndicator, type ViewStyle, type StyleProp } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { useTheme, radius, space, shadow } from '@/design/theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'pine' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  full?: boolean;
  /** Lime halo behind the button — for the one CTA that matters on a screen. */
  glow?: boolean;
  /** Optional leading Ionicons glyph, e.g. "lock-open". */
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  /** Keep a long label on one line by shrinking it (down to 80%) instead of wrapping. */
  fit?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
  full,
  glow,
  icon,
  fit,
}: Props) {
  const theme = useTheme();
  const isGhost = variant === 'ghost';
  const bg =
    variant === 'pine'
      ? theme.pine
      : variant === 'danger'
        ? theme.danger
        : isGhost
          ? 'transparent'
          : theme.accent;
  // Lime and mint are bright — they take dark ink, not white.
  const fg = isGhost ? theme.ink : theme.onAccent;

  return (
    <PressableScale
      onPress={disabled || loading ? () => {} : onPress}
      haptic={Haptics.ImpactFeedbackStyle.Medium}
      style={[
        styles.base,
        full && { alignSelf: 'stretch' },
        { backgroundColor: bg, opacity: disabled ? 0.4 : 1 },
        isGhost && { borderWidth: StyleSheet.hairlineWidth, borderColor: theme.line },
        glow && !disabled && [shadow.glow, { shadowColor: theme.accent }],
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <>
            {icon && <Ionicons name={icon} size={19} color={fg} />}
            <Text
              variant="bodyMedium"
              style={fit ? { color: fg, flexShrink: 1 } : { color: fg }}
              {...(fit ? { numberOfLines: 1, adjustsFontSizeToFit: true, minimumFontScale: 0.8 } : {})}
            >
              {label}
            </Text>
          </>
        )}
      </View>
    </PressableScale>
  );
}

/** The button's fixed height — exported so a layout can hold a slot for one. */
export const BUTTON_HEIGHT = 54;

const styles = StyleSheet.create({
  base: {
    height: BUTTON_HEIGHT,
    borderRadius: radius.pill,
    paddingHorizontal: space.xl,
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
});
