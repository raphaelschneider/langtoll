// Responsive layout — the iPad axis of the design system.
//
// Everything here keys off the WINDOW, never the device. iPadOS 26 runs every
// app in a resizable window: the same iPad Air is 1180pt wide full-screen and
// ~500pt in Split View, and it changes under you while the app is running.
// Anything that reads a device model, or samples Dimensions once at module
// load, is wrong by construction — that was the bug App Review saw (FareGate
// froze window.width/2 at import time and never moved again).
//
// Two size classes, matching how the screens actually want to be drawn:
//
//   compact  (< 700pt)  every iPhone, and an iPad in a narrow window. The
//                       layout the app was designed in: one column, full-bleed.
//   regular  (>= 700pt) iPad full-screen or half of a large one. Content is
//                       capped and centred rather than stretched — an 1180pt
//                       run of body text is unreadable, and a 1180pt-wide
//                       button is the "crowded, hard to use" rejection.
//
// `wide` is a THIRD threshold, and it is a pure width test — not "is the device
// in landscape". Orientation is a bad proxy once windows resize: a landscape
// iPad in a half-width Split View is 570pt and wants one column, while a 13"
// iPad in portrait is 1032pt and has ample room for two. Width is the thing the
// layout actually cares about, so width is what is asked. Above the threshold
// home puts the pass beside the wallet; below it, one column.
import { useWindowDimensions, type ViewStyle } from 'react-native';

/** Window width at or above which the iPad layout takes over. */
export const REGULAR_MIN = 700;

/** Single-column content cap. Chosen for line length, not for the device. */
export const MAX_CONTENT = 640;

/** Two-pane cap — the pass and the wallet side by side, still not sprawling. */
export const MAX_WIDE_CONTENT = 1040;

/** Window width at or above which two panes beat one column. */
export const WIDE_MIN = 900;

export interface Layout {
  width: number;
  height: number;
  /** Phone-shaped: the original single-column design. */
  compact: boolean;
  /** iPad-shaped: capped, centred, larger type. */
  regular: boolean;
  /** Wide enough for two panes side by side (a pure width test — see above). */
  wide: boolean;
  landscape: boolean;
  /** Horizontal screen padding; roomier on iPad. */
  gutter: number;
  /** Max width for a single column of content at this size. */
  maxContent: number;
  /**
   * Type/− and icon-size multiplier. iPad is held further from the face and
   * has more pixels to spend, so the whole scale steps up rather than leaving
   * phone-sized text marooned in the middle of a big screen.
   */
  scale: number;
}

export function useLayout(): Layout {
  const { width, height } = useWindowDimensions();
  const regular = width >= REGULAR_MIN;
  const landscape = width > height;
  return {
    width,
    height,
    compact: !regular,
    regular,
    wide: width >= WIDE_MIN,
    landscape,
    gutter: regular ? 40 : 24,
    maxContent: regular ? MAX_CONTENT : width,
    scale: regular ? 1.15 : 1,
  };
}

/**
 * Round a scaled dimension to a whole point. Fractional font sizes and paddings
 * render soft on iOS, and the 4pt grid the spacing tokens are built on stops
 * meaning anything once halves creep in.
 */
export function scaled(value: number, scale: number): number {
  return Math.round(value * scale);
}

/**
 * Cap-and-centre one horizontal band of a screen — a header, a scroll body, a
 * footer. Applied per band rather than as one wrapper around the whole screen
 * so full-bleed things (the aurora, a scroll view's own bounce area) still
 * reach the edges while the CONTENT inside them stays a readable width.
 *
 * Returns null on compact, where the band is simply the screen: no wrapper
 * views, no style churn, and the phone layout is bit-for-bit what it was.
 */
export function band(layout: Layout, max: number = layout.maxContent): ViewStyle | null {
  return layout.regular ? { width: '100%', maxWidth: max, alignSelf: 'center' } : null;
}

/**
 * How far to bias a centred body upward, in points. Geometric centre reads LOW
 * to the eye — the optical centre of a composition sits above the middle — so
 * every centred screen shifts up by half the padding this puts below it.
 *
 * A share of the window rather than a constant: a 1376pt-tall iPad in portrait
 * has room for a 200pt shove, an 820pt landscape window does not, and the same
 * fraction gives each the right one.
 */
export function opticalBias(layout: Layout): number {
  return layout.regular ? Math.round(layout.height * 0.15) : 0;
}

/**
 * Centre a screen's body in the space its header and footer leave, biased
 * upward. Null on compact, where the phone layout is untouched.
 *
 * The caller owns the flex: pair it with `flex: 1` on a plain View, or
 * `flexGrow: 1` on a ScrollView's contentContainerStyle (which is what lets a
 * short body centre while a long one still scrolls).
 */
export function opticalCenter(layout: Layout): ViewStyle | null {
  return layout.regular
    ? { justifyContent: 'center', paddingBottom: opticalBias(layout) }
    : null;
}
