// One drag behaviour for every chip in the `order` exercise — the words placed
// in the sentence AND the words waiting in the bank below. Tap and drag are
// told apart by movement: under 4pt is a tap, past it the chip follows the
// finger and the release hands the parent the finger's PAGE coordinates to
// resolve against a fresh window measurement.
//
// PanResponder, not react-native-gesture-handler: no GestureHandlerRootView in
// the tree, and RNGH fails silently without one.
import { useRef, useState } from 'react';
import { PanResponder, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

export function useChipDrag({
  index,
  interactive,
  onTap,
  onDrop,
}: {
  index: number;
  interactive: boolean;
  onTap: (index: number) => void;
  /** pageX/pageY of the finger at release — the parent resolves the target. */
  onDrop: (index: number, pageX: number, pageY: number) => void;
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [dragging, setDragging] = useState(false);

  // Refs so the once-created responder never closes over stale props.
  const live = useRef({ index, interactive, onTap, onDrop, moved: false });
  live.current = { ...live.current, index, interactive, onTap, onDrop };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => live.current.interactive,
      onMoveShouldSetPanResponder: (_e, g) =>
        live.current.interactive && (Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4),
      // Own the gesture — the surrounding scroll must not steal a drag.
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
        if (live.current.moved) live.current.onDrop(live.current.index, g.moveX, g.moveY);
        else live.current.onTap(live.current.index);
      },
      onPanResponderTerminate: () => {
        pan.setValue({ x: 0, y: 0 });
        setDragging(false);
      },
    })
  ).current;

  return { panHandlers: responder.panHandlers, pan, dragging };
}
