// A full-width single-choice row: label, optional sub-label or trailing tag,
// and a check when selected. Shared by every "pick one" list (language, time
// of day, goal, speaker forms).
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { useTheme, radius, space } from '@/design/theme';
import { withAlpha } from '@/lib/color';

export function OptionRow({
  label,
  sub,
  selected,
  disabled,
  tag,
  onPress,
}: {
  label: string;
  /** Quieter second line under the label (e.g. the language's own name). */
  sub?: string;
  selected: boolean;
  disabled?: boolean;
  /** Trailing mono tag that replaces the check (e.g. "SOON"). */
  tag?: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: !!disabled }}
      style={[
        styles.option,
        {
          backgroundColor: selected ? withAlpha(theme.accent, 0.1) : theme.surface,
          borderColor: selected ? theme.accent : theme.line,
          opacity: disabled ? 0.45 : 1,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text variant="bodyMedium" style={{ color: selected ? theme.accent : theme.ink }}>
          {label}
        </Text>
        {sub ? (
          <Text variant="caption" color="inkFaint" style={{ marginTop: 1 }}>
            {sub}
          </Text>
        ) : null}
      </View>
      {tag ? (
        <Text variant="caption" color="inkFaint" style={{ letterSpacing: 1 }}>
          {tag}
        </Text>
      ) : selected ? (
        <Ionicons name="checkmark-circle" size={20} color={theme.accent} />
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    gap: space.sm,
  },
});
