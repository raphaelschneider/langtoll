// The ten-dot difficulty scale — one control for onboarding and Settings.
//
// A row of ten dots reads as a slider, and everyone who sees one drags it. The
// first version was ten separate buttons: dragging did nothing, which reads as
// broken ("this should be draggable, not only tappable" — Ralph, on device).
// So the whole row is ONE responder: a finger anywhere along it sets the value
// under the finger and keeps following it; a tap on a dot still lands on that
// dot. The dots are drawn, not pressed.
//
// PanResponder, not react-native-gesture-handler, for the same reason as
// FareSlider: no GestureHandlerRootView in the tree, and RNGH fails silently
// without one. Same two lessons baked in: never read locationX (relative to the
// touched child), and never cache the row's origin across gestures (stale after
// a scroll) — it is measured fresh at every finger-down.
import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, type LayoutChangeEvent } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { useTheme, space } from '@/design/theme';
import { withAlpha } from '@/lib/color';

const STEPS = 10;

export function DifficultyScale({
  value,
  onChange,
  easierLabel,
  harderLabel,
  accessibilityLabel,
  size = 28,
}: {
  /** 1…10 */
  value: number;
  onChange: (value: number) => void;
  easierLabel: string;
  harderLabel: string;
  accessibilityLabel: string;
  /** Dot diameter. */
  size?: number;
}) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const rowRef = useRef<View>(null);

  // The responder is created ONCE; everything its callbacks read goes through
  // a ref so an inline onChange from the parent never goes stale.
  const cfg = useRef({ value, onChange, width: 0, size, originX: 0 });
  cfg.current = { ...cfg.current, value, onChange, size };

  function commit(pageX: number) {
    const c = cfg.current;
    const travel = c.width - c.size;
    if (travel <= 0) return;
    const ratio = Math.min(1, Math.max(0, (pageX - c.originX - c.size / 2) / travel));
    const next = 1 + Math.round(ratio * (STEPS - 1));
    if (next !== c.value) {
      cfg.current.value = next;
      // One tick per dot crossed — the value really is discrete.
      Haptics.selectionAsync();
      c.onChange(next);
    }
  }

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // Own the gesture — the surrounding scroll must not steal a drag.
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (_e, g) => {
        // Fresh origin per gesture. A scroll cannot happen mid-gesture (we own
        // it), so caching for the duration of ONE gesture is safe.
        rowRef.current?.measureInWindow((x) => {
          cfg.current.originX = x;
          commit(g.x0);
        });
      },
      onPanResponderMove: (_e, g) => commit(g.moveX),
    })
  ).current;

  function onLayout(e: LayoutChangeEvent) {
    cfg.current.width = e.nativeEvent.layout.width;
    setWidth(e.nativeEvent.layout.width);
  }

  return (
    <View>
      <View
        ref={rowRef}
        onLayout={onLayout}
        {...pan.panHandlers}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ min: 1, max: STEPS, now: value, text: `${value}/${STEPS}` }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => {
          const next = e.nativeEvent.actionName === 'increment' ? value + 1 : value - 1;
          if (next >= 1 && next <= STEPS) onChange(next);
        }}
        // The dots are `size` tall; the padding lifts the touchable row to a
        // 44pt band without moving a pixel of what is drawn.
        style={[styles.row, { paddingVertical: Math.max(0, (44 - size) / 2) }]}
      >
        {Array.from({ length: STEPS }, (_, i) => i + 1).map((d) => (
          <View
            key={d}
            style={[
              styles.dot,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: d <= value ? withAlpha(theme.accent, 0.16) : theme.fill,
                borderColor: d <= value ? theme.accent : theme.line,
              },
            ]}
          >
            {d === value && width > 0 && (
              <View
                style={{
                  width: size * 0.43,
                  height: size * 0.43,
                  borderRadius: size * 0.215,
                  backgroundColor: theme.accent,
                }}
              />
            )}
          </View>
        ))}
      </View>
      <View style={styles.labels}>
        <Text variant="caption" color="inkFaint">
          {easierLabel}
        </Text>
        <Text variant="caption" color="inkFaint">
          {harderLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  dot: { borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.xs },
});
