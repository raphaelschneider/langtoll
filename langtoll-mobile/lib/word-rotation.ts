// Picks the vocabulary deck the Dynamic Island rotates through while a pass is
// active — the island floats above the very apps the user just unlocked, so the
// pass window itself becomes passive exposure.
//
// Priority is pedagogical, not random: words the user has MET and keeps getting
// wrong (low streak) come first — the island is the spaced echo of the session
// that bought this pass. Unseen words pad the deck only when strugglers run
// out; mastered words (streak >= 3) stay out entirely, because reading what you
// already know teaches nothing.
//
// Works for every pack: activePack() is already localized, so `de` holds the
// target-language word (whatever the language) and `en` the user's own.
import { getState } from '@/lib/store';
import { activePack } from '@/lib/pack';

export const ROTATION_DECK_SIZE = 12;
// Keep in sync with the 80pt compact-slot cap in PassActivityWidget.swift.
export const MAX_ISLAND_CHARS = 18;

/** [targetWord, translation] pairs, priority-ordered. May be empty (fresh install). */
export function pickRotationDeck(): [string, string][] {
  const { progress } = getState();
  const vocab = activePack().vocab;

  const struggling = vocab
    .filter((v) => {
      const p = progress[v.id];
      return p && p.seen > 0 && p.streak < 3;
    })
    .sort((a, b) => {
      const pa = progress[a.id];
      const pb = progress[b.id];
      // Lowest streak first; ties broken by most recently seen, so the words
      // from the session that JUST ended lead the rotation.
      if (pa.streak !== pb.streak) return pa.streak - pb.streak;
      return (pb.last_seen_at ?? '').localeCompare(pa.last_seen_at ?? '');
    });

  const unseen = vocab.filter((v) => !progress[v.id]);

  // Longest pair the compact island renders with dignity: the 80pt slots
  // shrink text to fit, and past ~18 characters a side the shrink crosses
  // from "small" to "dust". Over-long pairs stay in the lessons — they just
  // don't ride the island; the deck has alternates to spare.
  const fitsIsland = (v: (typeof vocab)[number]) =>
    v.de.length <= MAX_ISLAND_CHARS && (v.en[0]?.length ?? 0) <= MAX_ISLAND_CHARS;

  return [...struggling, ...unseen]
    .filter(fitsIsland)
    .slice(0, ROTATION_DECK_SIZE)
    .map((v) => [v.de, v.en[0]] as [string, string]);
}
