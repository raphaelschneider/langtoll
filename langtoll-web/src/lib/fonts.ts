// Shared next/font instances. Two root layouts render the <html>/<body> shell — the English
// one at `/` and the localized one at `/<locale>` — and both need the same font CSS vars, so
// the font loaders live here and are imported by both. next/font requires the loader to be
// called at module scope, which this satisfies; importing the same module twice reuses one
// instance rather than emitting the font twice.
import { Fraunces, Inter, Archivo, JetBrains_Mono } from 'next/font/google';

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

// The app's own type pairing (design/tokens.ts in langtoll-mobile): a heavy grotesque for
// signage and a monospace for ticket data. The admin wears it so the dashboard reads as
// LangToll, not as a generic template.
export const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  weight: ['400', '500', '600', '800'],
});

export const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['500', '700'],
});

export const adminFontClassName = `${archivo.variable} ${jetbrainsMono.variable} antialiased`;
