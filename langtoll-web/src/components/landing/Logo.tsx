// The LangPass logo — ONE image, not a mark with text set beside it.
//
// Mark and logotype live in a single <svg> with a shared coordinate system, so
// they scale, space and align as one locked-up graphic. Passing a height is the
// only knob; everything inside keeps its proportions.
//
// The mark: a speech bubble with a keyhole punched through it — speech bubble =
// the language, keyhole = the lock. It deliberately contains NO letter: the
// earlier mark centred an italic Fraunces "l", which at nav size loses every
// distinguishing feature and reads as a "1".
//
// The keyhole is punched with a MASK rather than filled with the page colour, so
// the logo sits correctly on dark sections, lime blocks and light cards alike.
//
// `id` must be unique per instance — SVG ids are document-global, and a repeated
// mask id silently breaks whichever copy paints second.

export function Logo({ height = 34, id = 'lp' }: { height?: number; id?: string }) {
  const maskId = `${id}-keyhole`;
  // 168x32 user units: 32 for the mark, a 12-unit gap, ~124 for the logotype.
  const width = Math.round((height * 168) / 32);

  return (
    <svg
      className="logo"
      width={width}
      height={height}
      viewBox="0 0 168 32"
      role="img"
      aria-label="LangPass"
    >
      <defs>
        <mask id={maskId}>
          {/* white keeps, black punches through */}
          <rect width="32" height="32" fill="#fff" />
          <circle cx="16" cy="12" r="2.6" fill="#000" />
          <path d="M14.7 13.6h2.6l.9 4.6h-4.4z" fill="#000" />
        </mask>
      </defs>

      <path
        d="M4 9a5 5 0 015-5h14a5 5 0 015 5v9a5 5 0 01-5 5h-7l-6 5v-5H9a5 5 0 01-5-5z"
        className="logo-mark"
        mask={`url(#${maskId})`}
      />

      {/* Logotype, baseline-aligned to the mark's optical centre. Two-tone so the
          word carries the transit metaphor instead of reading as plain text. */}
      <text
        x="44"
        y="24"
        fontFamily="var(--font-fraunces), Georgia, serif"
        fontStyle="italic"
        fontSize="30"
        letterSpacing="-0.6"
      >
        <tspan className="logo-lang">lang</tspan>
        <tspan className="logo-pass">pass</tspan>
      </text>
    </svg>
  );
}
