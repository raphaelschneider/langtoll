// The words waiting below the sentence in the `order` exercise.
//
// Tap a word and it goes to the end of the sentence (the original behavior).
// DRAG it and it follows the finger up to the line, landing between whichever
// two words it is dropped over — the way anyone who has seen a word bank
// expects it to work, and the thing Ralph asked for more than once. Dropped
// anywhere else, it snaps back and nothing happens.
//
// The bank is a sibling of the scroll view holding the sentence (phones pin it
// under the thumb), so the dragged chip crosses a container boundary. Nothing
// on that path clips, and the bank is drawn after the scroll view, so the
// chip floats over it; the drop itself is resolved by the session against a
// fresh window measurement of the line.
import React, { useRef } from 'react';
import { View, StyleSheet, Animated as RNAnimated } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme, space, radius } from '@/design/theme';
import { withAlpha } from '@/lib/color';
import { useChipDrag } from './useChipDrag';

function BankChip({
  label,
  index,
  interactive,
  used,
  onTap,
  onDrop,
  onHold,
  onMove,
}: {
  label: string;
  index: number;
  interactive: boolean;
  used: boolean;
  onTap: (index: number) => void;
  onDrop: (index: number, pageX: number, pageY: number) => void;
  onHold?: (held: boolean) => void;
  onMove?: (index: number, pageX: number, pageY: number, width: number) => void;
}) {
  const theme = useTheme();
  const width = useRef(60);
  const { panHandlers, pan, dragging } = useChipDrag({
    index,
    interactive: interactive && !used,
    onTap,
    onDrop,
    onHold,
    onMove: (i, x, y) => onMove?.(i, x, y, width.current),
  });

  return (
    <View style={dragging ? styles.lifted : undefined} onLayout={(e) => (width.current = e.nativeEvent.layout.width)}>
      <RNAnimated.View
        {...panHandlers}
        accessible
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: !interactive || used }}
        style={[
          styles.chip,
          // A word that has gone up to the line leaves its SLOT behind: an empty
          // tile of the same size, so the bank never reflows and the word has a
          // place to come back to (Duolingo's bank; founder, 2026-10-04). The
          // label stays in the layout, invisible, to hold the width.
          used
            ? { backgroundColor: withAlpha(theme.ink, 0.06), borderColor: 'transparent' }
            : {
                backgroundColor: dragging ? withAlpha(theme.accent, 0.2) : theme.surface,
                borderColor: dragging ? withAlpha(theme.accent, 0.9) : theme.line,
              },
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale: dragging ? 1.08 : 1 },
            ],
          },
        ]}
      >
        <Text variant="bodyMedium" style={used ? { opacity: 0 } : undefined}>
          {label}
        </Text>
      </RNAnimated.View>
    </View>
  );
}

export function OrderBank({
  words,
  used,
  interactive,
  onTap,
  onDrop,
  onHold,
  onMove,
}: {
  words: string[];
  /** Indices already placed in the sentence — shown as empty slots, not draggable. */
  used: number[];
  interactive: boolean;
  onTap: (index: number) => void;
  /** pageX/pageY of the finger at release — the session resolves the slot. */
  onDrop: (index: number, pageX: number, pageY: number) => void;
  /** A chip is under the finger — see useChipDrag. */
  onHold?: (held: boolean) => void;
  /** The finger while dragging, with the chip's width — the line opens a gap there. */
  onMove?: (index: number, pageX: number, pageY: number, width: number) => void;
}) {
  return (
    <View style={styles.wrap}>
      {words.map((word, i) => (
        <BankChip
          key={`${word}-${i}`}
          label={word}
          index={i}
          interactive={interactive}
          used={used.includes(i)}
          onTap={onTap}
          onDrop={onDrop}
          onHold={onHold}
          onMove={onMove}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: {
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  // The dragged chip must float over its siblings — and over the line above.
  lifted: { zIndex: 10, elevation: 10 },
});
