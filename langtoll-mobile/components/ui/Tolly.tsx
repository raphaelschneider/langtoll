// Tolly — the toll operator. One component, one `mood` prop, so every surface
// pulls the same character and the moods stay a closed set (the art direction
// lives in brand/tolly/, regenerated only via edits off the m0 reference).
// Transparent PNGs: they sit on night-navy and day-paper alike.
import React from 'react';
import { Image, type StyleProp, type ImageStyle } from 'react-native';

const SOURCES = {
  happy: require('../../assets/tolly/tolly-happy.png'),
  sad: require('../../assets/tolly/tolly-sad.png'),
  stern: require('../../assets/tolly/tolly-stern.png'),
  asleep: require('../../assets/tolly/tolly-asleep.png'),
  celebrate: require('../../assets/tolly/tolly-celebrate.png'),
  /** Half-body, paws at the bottom edge — made for gripping a card/screen edge. */
  peek: require('../../assets/tolly/tolly-peek.png'),
  /** Peek, but glum — for watching over an EXPIRED pass. */
  peekSad: require('../../assets/tolly/tolly-peek-sad.png'),
} as const;

export type TollyMood = keyof typeof SOURCES;

export function Tolly({
  mood,
  size = 120,
  style,
}: {
  mood: TollyMood;
  /** Rendered square bounding box in pt; the art keeps its own aspect within it. */
  size?: number;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={SOURCES[mood]}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
      accessibilityLabel={`Tolly, ${mood}`}
    />
  );
}
