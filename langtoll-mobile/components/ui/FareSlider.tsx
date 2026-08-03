// A dragged value picker for the fare.
//
// Deliberately PanResponder and not react-native-gesture-handler: RNGH v2 needs
// a GestureHandlerRootView wrapping the tree, the app root has none, and a
// missing root makes gestures fail SILENTLY rather than loudly. PanResponder
// ships with React Native, needs no provider, and a slider snapping to at most
// a dozen stops does not need the UI-thread gesture path.
//
// The track is also tappable: dragging a 28pt knob is precise, but landing on
// "45" directly is faster, and a control that only responds to drags reads as
// broken to anyone who tries tapping it first.
import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, type LayoutChangeEvent } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { useTheme, space, radius } from '@/design/theme';
import { withAlpha } from '@/lib/color';

const KNOB = 28;
const TRACK_H = 6;

export interface FareSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** Renders the current value; defaults to the bare number. */
  format?: (value: number) => string;
  /** Labels under the two ends, e.g. "10 min" / "1 h". */
  minLabel?: string;
  maxLabel?: string;
}

export function FareSlider({
  value,
  min,
  max,
  step,
  onChange,
  format,
  minLabel,
  maxLabel,
}: FareSliderProps) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);

  // The PanResponder is created ONCE, so every value its callbacks read must go
  // through a ref — otherwise they close over the first render forever. That
  // includes onChange: a parent passing an inline arrow would have its very
  // first closure called for the lifetime of the screen.
  const cfg = useRef({ value, min, max, step, width: 0, onChange });
  cfg.current = { ...cfg.current, value, min, max, step, onChange };

  /** Commit a value from an x offset relative to the track's own left edge. */
  function commitFromX(x: number) {
    const c = cfg.current;
    const travel = c.width - KNOB;
    if (travel <= 0) return;
    const ratio = Math.min(1, Math.max(0, (x - KNOB / 2) / travel));
    const raw = c.min + ratio * (c.max - c.min);
    const next = Math.min(c.max, Math.max(c.min, Math.round(raw / c.step) * c.step));
    if (next !== c.value) {
      cfg.current.value = next;
      // One tick per step crossed — the drag feels detented rather than smooth,
      // which is honest: the value really is discrete.
      Haptics.selectionAsync();
      c.onChange(next);
    }
  }

  const pan = useRef(
    (() => {
      // Anchored to where the touch started plus its delta, rather than to page
      // coordinates from measure(): a page origin goes stale the moment the
      // surrounding ScrollView moves, and this control lives inside one.
      let startX = 0;
      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        // Claim the gesture so the parent ScrollView cannot steal a drag.
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e) => {
          startX = e.nativeEvent.locationX;
          commitFromX(startX);
        },
        onPanResponderMove: (_e, g) => commitFromX(startX + g.dx),
      });
    })()
  ).current;

  function onLayout(e: LayoutChangeEvent) {
    const w = e.nativeEvent.layout.width;
    cfg.current.width = w;
    setWidth(w);
  }

  const ratio = max > min ? (value - min) / (max - min) : 0;
  const travel = Math.max(0, width - KNOB);
  const knobLeft = ratio * travel;

  return (
    <View style={{ marginTop: space.sm }}>
      <Text variant="title" center style={{ marginBottom: space.sm }}>
        {format ? format(value) : `${value}`}
      </Text>

      <View
        onLayout={onLayout}
        style={styles.hit}
        {...pan.panHandlers}
        accessible
        accessibilityRole="adjustable"
        accessibilityValue={{ min, max, now: value }}
      >
        <View style={[styles.track, { backgroundColor: withAlpha(theme.ink, 0.12) }]} />
        <View
          style={[
            styles.track,
            styles.fill,
            { backgroundColor: theme.accent, width: knobLeft + KNOB / 2 },
          ]}
        />
        <View
          style={[
            styles.knob,
            { left: knobLeft, backgroundColor: theme.accent, borderColor: theme.paper },
          ]}
        />
      </View>

      {(minLabel || maxLabel) && (
        <View style={styles.ends}>
          <Text variant="caption" color="inkFaint">
            {minLabel}
          </Text>
          <Text variant="caption" color="inkFaint">
            {maxLabel}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Tall enough to be a comfortable touch target while the track stays thin.
  hit: { height: KNOB + space.md, justifyContent: 'center' },
  track: { height: TRACK_H, borderRadius: radius.pill },
  fill: { position: 'absolute', left: 0 },
  knob: {
    position: 'absolute',
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    borderWidth: 3,
  },
  ends: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
});
