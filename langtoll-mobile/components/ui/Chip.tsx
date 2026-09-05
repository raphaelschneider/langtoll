// The selectable pill — one implementation for every chip row in the app
// (levels, fares, apps, locales, dev language rig). Onboarding and Settings
// each used to carry their own copy with slightly different padding, so the
// same control sat 2pt taller on one screen than the other.
import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { useTheme, radius } from '@/design/theme';
import { withAlpha } from '@/lib/color';

export function Chip({
  label,
  selected,
  onPress,
  disabled,
  style,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
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
      <Text variant="bodyMedium" style={{ color: selected ? theme.accent : theme.ink }}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
});
