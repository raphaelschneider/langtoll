// The selectable pill — one implementation for every chip row in the app
// (levels, fares, apps, locales, dev language rig). Onboarding and Settings
// each used to carry their own copy with slightly different padding, so the
// same control sat 2pt taller on one screen than the other.
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { useTheme, radius } from '@/design/theme';
import { withAlpha } from '@/lib/color';

export function Chip({
  label,
  selected,
  onPress,
  disabled,
  locked,
  style,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  /** A Plus-only choice: still tappable (it opens the offer), marked with a lock. */
  locked?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      // Explicit: with the lock glyph beside it the label no longer derives
      // from a lone child Text, and VoiceOver (and Maestro) would read nothing.
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled: !!disabled }}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? withAlpha(theme.accent, 0.12) : theme.surface,
          borderColor: selected ? theme.accent : theme.line,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        <Text variant="bodyMedium" style={{ color: selected ? theme.accent : locked ? theme.inkSoft : theme.ink }}>
          {label}
        </Text>
        {locked && <Ionicons name="lock-closed" size={13} color={theme.inkFaint} />}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
});
