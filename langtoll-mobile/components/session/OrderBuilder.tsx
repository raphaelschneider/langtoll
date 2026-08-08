// The sentence being built in the `order` exercise — with drag-to-reorder.
//
// Tap a placed word to send it back (the original behavior). Drag it and it
// follows the finger; drop it near another word and the sentence reorders
// around it — changing your mind no longer means dismantling the sentence.
//
// PanResponder, not react-native-gesture-handler, for the same reason as
// FareSlider: no GestureHandlerRootView in the tree, and RNGH fails silently
// without one. Two lessons from that slider are baked in: never trust
// locationX (relative to the touched child), and never trust a cached page
// origin (stale after scrolls) — the drop target is computed from page
// coordinates against a measureInWindow taken at RELEASE time.
import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Animated as RNAnimated } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { useTheme, space, radius } from '@/design/theme';
import { withAlpha } from '@/lib/color';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function DraggableChip({
  label,
  index,
  interactive,
  onTap,
  onDrop,
  registerRect,
}: {
  label: string;
  index: number;
  interactive: boolean;
  onTap: (index: number) => void;
  /** pageX/pageY of the finger at release — parent resolves the drop slot. */
  onDrop: (index: number, pageX: number, pageY: number) => void;
  registerRect: (index: number, rect: Rect) => void;
}) {
  const theme = useTheme();
  const pan = useRef(new RNAnimated.ValueXY()).current;
  const [dragging, setDragging] = useState(false);

  // Refs so the once-created responder never closes over stale props.
  const live = useRef({ index, interactive, onTap, onDrop, moved: false });
  live.current = { ...live.current, index, interactive, onTap, onDrop };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => live.current.interactive,
      onMoveShouldSetPanResponder: (_e, g) =>
        live.current.interactive && (Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4),
      // Own the gesture — the surrounding scroll must not steal a reorder.
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        live.current.moved = false;
      },
      onPanResponderMove: (_e, g) => {
        if (Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4) {
          if (!live.current.moved) {
            live.current.moved = true;
            setDragging(true);
            Haptics.selectionAsync();
          }
          pan.setValue({ x: g.dx, y: g.dy });
        }
      },
      onPanResponderRelease: (_e, g) => {
        pan.setValue({ x: 0, y: 0 });
        setDragging(false);
        if (live.current.moved) {
          live.current.onDrop(live.current.index, g.moveX, g.moveY);
        } else {
          live.current.onTap(live.current.index);
        }
      },
      onPanResponderTerminate: () => {
        pan.setValue({ x: 0, y: 0 });
        setDragging(false);
      },
    })
  ).current;

  return (
    <Animated.View
      layout={LinearTransition.duration(160)}
      onLayout={(e) =>
        registerRect(index, {
          x: e.nativeEvent.layout.x,
          y: e.nativeEvent.layout.y,
          w: e.nativeEvent.layout.width,
          h: e.nativeEvent.layout.height,
        })
      }
      style={dragging ? styles.lifted : undefined}
    >
      <RNAnimated.View
        {...responder.panHandlers}
        style={[
          styles.chip,
          {
            backgroundColor: withAlpha(theme.accent, dragging ? 0.28 : 0.12),
            borderColor: withAlpha(theme.accent, dragging ? 0.9 : 0.4),
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale: dragging ? 1.08 : 1 },
            ],
          },
        ]}
      >
        <Text variant="bodyMedium" style={{ color: theme.accent }}>
          {label}
        </Text>
      </RNAnimated.View>
    </Animated.View>
  );
}

export function OrderBuilder({
  words,
  interactive,
  onRemoveAt,
  onReorder,
}: {
  words: string[];
  interactive: boolean;
  onRemoveAt: (index: number) => void;
  onReorder: (from: number, to: number) => void;
}) {
  const wrapRef = useRef<View>(null);
  const rects = useRef(new Map<number, Rect>());

  function registerRect(index: number, rect: Rect) {
    rects.current.set(index, rect);
  }

  function handleDrop(from: number, pageX: number, pageY: number) {
    // Fresh origin at release time — a cached one goes stale under scrolling.
    wrapRef.current?.measureInWindow((wx, wy) => {
      const x = pageX - wx;
      const y = pageY - wy;
      let best = from;
      let bestDist = Number.POSITIVE_INFINITY;
      for (let i = 0; i < words.length; i++) {
        const r = rects.current.get(i);
        if (!r) continue;
        const cx = r.x + r.w / 2;
        const cy = r.y + r.h / 2;
        // Rows matter more than columns in a wrapped line: weight y heavier so
        // a drop lands in the row under the finger, not a nearer chip one row up.
        const dist = (x - cx) ** 2 + 3 * (y - cy) ** 2;
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      if (best !== from) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onReorder(from, best);
      }
    });
  }

  return (
    <View ref={wrapRef} style={styles.wrap}>
      {words.map((word, i) => (
        <DraggableChip
          key={`${word}-${i}`}
          label={word}
          index={i}
          interactive={interactive}
          onTap={onRemoveAt}
          onDrop={handleDrop}
          registerRect={registerRect}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  // The dragged chip must float over its siblings, not slide beneath them.
  lifted: { zIndex: 10, elevation: 10 },
});
