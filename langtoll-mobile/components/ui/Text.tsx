// Themed text bound to the type scale. `variant` selects the role; `color` overrides.
import React from 'react';
import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { useTheme, type as typeScale } from '@/design/theme';

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
  return (
    <RNText
      {...rest}
      style={[
        typeScale[variant] as TextStyle,
        { color: theme[color] },
        center && { textAlign: 'center' },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
