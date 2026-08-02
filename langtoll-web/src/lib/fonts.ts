// Shared next/font instances. Two root layouts render the <html>/<body> shell — the English
// one at `/` and the localized one at `/<locale>` — and both need the same font CSS vars, so
// the font loaders live here and are imported by both. next/font requires the loader to be
// called at module scope, which this satisfies; importing the same module twice reuses one
// instance rather than emitting the font twice.
import { Fraunces, Inter } from 'next/font/google';

export const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

/** className for <body> — both layouts use the same shell. */
export const fontClassName = `${fraunces.variable} ${inter.variable} antialiased`;
