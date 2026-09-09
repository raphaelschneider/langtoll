// Themed text bound to the type scale. `variant` selects the role; `color` overrides.
//
// The type scale is authored at phone size and scaled up on iPad here, in ONE
// place, rather than by sprinkling responsive font sizes through the screens.
// Call-site overrides (`style={{ fontSize: 24 }}`) are scaled too — otherwise
// every hand-tuned size in the app would stay phone-sized on a 1180pt screen,
// which is precisely the "text marooned in a big layout" look.
import React from 'react';
import { StyleSheet, Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { useTheme, type as typeScale } from '@/design/theme';
import { useLayout, scaled } from '@/design/layout';

type Variant = keyof typeof typeScale;
type ColorKey = 'ink' | 'inkSoft' | 'inkFaint' | 'accent' | 'pine' | 'surface' | 'amber' | 'danger';

interface Props extends TextProps {
  variant?: Variant;
  color?: ColorKey;
  center?: boolean;
  style?: TextStyle | TextStyle[];
}

export function Text({
  variant = 'body',
  color = 'ink',
  center,
  style,
  children,
  ...rest
}: Props) {
  const theme = useTheme();
  const { scale } = useLayout();
  // Flattened in the original cascade order — variant, then the color prop,
  // then `center`, then the call site's own style LAST. A call site passing
  // `style={{ color: theme.amber }}` must still win over the `color` prop.
  const flat =
    StyleSheet.flatten<TextStyle>([
      typeScale[variant] as TextStyle,
      { color: theme[color] },
      center ? { textAlign: 'center' } : null,
      style,
    ]) ?? {};
  if (scale !== 1) {
    if (typeof flat.fontSize === 'number') flat.fontSize = scaled(flat.fontSize, scale);
    if (typeof flat.lineHeight === 'number') flat.lineHeight = scaled(flat.lineHeight, scale);
  }
  return (
    <RNText {...rest} style={flat}>
      {children}
    </RNText>
  );
}
