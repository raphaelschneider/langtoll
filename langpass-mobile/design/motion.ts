// Motion constants — springs everywhere, nothing linear. See docs/DESIGN.md.
import { Easing } from 'react-native-reanimated';

export const spring = {
  // Soft settle for most UI (cards, sheets, presses releasing).
  soft: { damping: 18, stiffness: 140, mass: 1 },
  // Snappier for small controls (toggles, chips).
  snappy: { damping: 16, stiffness: 220, mass: 0.8 },
  // Bouncy for celebratory moments (milestones, completion).
  bouncy: { damping: 11, stiffness: 170, mass: 0.9 },
  // Gentle for large surfaces / page transitions.
  gentle: { damping: 22, stiffness: 110, mass: 1.1 },
} as const;

export const timing = {
  fast: { duration: 180, easing: Easing.out(Easing.cubic) },
  base: { duration: 280, easing: Easing.out(Easing.cubic) },
  slow: { duration: 480, easing: Easing.inOut(Easing.cubic) },
  reveal: { duration: 1100, easing: Easing.inOut(Easing.cubic) },
} as const;

// Press feedback scale.
export const press = {
  scale: 0.97,
} as const;
