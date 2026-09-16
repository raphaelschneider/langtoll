// The sentence being built in the `order` exercise — with drag-to-reorder.
//
// Tap a placed word to send it back (the original behavior). Drag it and it
// follows the finger; drop it near another word and the sentence reorders
// around it — changing your mind no longer means dismantling the sentence.
// Drop it clear below the line and it goes back to the bank.
//
// The bank below drags INTO this line too: `slotAt` (via ref) turns a page
// point into an insertion index, so the session can resolve a drop from
// outside without knowing where the words sit.
//
// Two lessons from FareSlider are baked in: never trust locationX (relative
// to the touched child), and never trust a cached page origin (stale after
// scrolls) — every drop is resolved against a measureInWindow taken at
// RELEASE time.
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet, Animated as RNAnimated } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { useTheme, space, radius } from '@/design/theme';
import { withAlpha } from '@/lib/color';
import { useChipDrag } from './useChipDrag';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** How far below the line a placed word may be dropped and still count as "back to the bank". */
const REMOVE_BELOW_PT = 32;
/** How far outside the line a bank word may be dropped and still land in it. */
const INSERT_SLACK_PT = 28;

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
  onDrop: (index: number, pageX: number, pageY: number) => void;
  registerRect: (index: number, rect: Rect) => void;
}) {
  const theme = useTheme();
  const { panHandlers, pan, dragging } = useChipDrag({ index, interactive, onTap, onDrop });

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
        {...panHandlers}
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

export interface OrderBuilderHandle {
  /**
   * Resolve a page point to an insertion index into `words`, or null when the
   * point is not over the line. Async because the line's origin is measured
   * fresh at call time.
   */
  slotAt: (pageX: number, pageY: number, cb: (slot: number | null) => void) => void;
}

export const OrderBuilder = forwardRef<
  OrderBuilderHandle,
  {
    words: string[];
    interactive: boolean;
    onRemoveAt: (index: number) => void;
    onReorder: (from: number, to: number) => void;
  }
>(function OrderBuilder({ words, interactive, onRemoveAt, onReorder }, ref) {
  const wrapRef = useRef<View>(null);
  const rects = useRef(new Map<number, Rect>());
  const size = useRef({ w: 0, h: 0 });

  function registerRect(index: number, rect: Rect) {
    rects.current.set(index, rect);
  }

  /** Nearest placed word to a point in the line's own coordinates. */
  function nearest(x: number, y: number): { index: number; rect: Rect } | null {
    let best: { index: number; rect: Rect } | null = null;
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
        best = { index: i, rect: r };
      }
    }
    return best;
  }

  useImperativeHandle(ref, () => ({
    slotAt(pageX, pageY, cb) {
      const node = wrapRef.current;
      if (!node) return cb(null);
      node.measureInWindow((wx, wy, ww, wh) => {
        const x = pageX - wx;
        const y = pageY - wy;
        const inside =
          x >= -INSERT_SLACK_PT && x <= (ww || size.current.w) + INSERT_SLACK_PT &&
          y >= -INSERT_SLACK_PT && y <= (wh || size.current.h) + INSERT_SLACK_PT;
        if (!inside) return cb(null);
        const n = nearest(x, y);
        if (!n) return cb(words.length);
        // Left half of the nearest word → before it; right half → after it.
        cb(x < n.rect.x + n.rect.w / 2 ? n.index : n.index + 1);
      });
    },
  }));

  function handleDrop(from: number, pageX: number, pageY: number) {
    // Fresh origin at release time — a cached one goes stale under scrolling.
    wrapRef.current?.measureInWindow((wx, wy, _ww, wh) => {
      const x = pageX - wx;
      const y = pageY - wy;
      // Clear below the line: the word goes back to the bank.
      if (y > (wh || size.current.h) + REMOVE_BELOW_PT) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onRemoveAt(from);
        return;
      }
      const n = nearest(x, y);
      if (n && n.index !== from) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onReorder(from, n.index);
      }
    });
  }

  return (
    <View
      ref={wrapRef}
      style={styles.wrap}
      onLayout={(e) => {
        size.current = { w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height };
      }}
    >
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
});

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, minHeight: 36 },
  chip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  // The dragged chip must float over its siblings, not slide beneath them.
  lifted: { zIndex: 10, elevation: 10 },
});
