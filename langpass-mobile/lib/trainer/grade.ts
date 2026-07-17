// Answer grading for typed German input. Forgiving on the things that don't prove
// you know the word (case, punctuation, ss/ß, umlaut digraphs ae/oe/ue) and strict
// on the things that do (the actual letters).

/** Normalize a German string for comparison. */
export function normalizeGerman(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:'’"«»„“”()]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue');
}

/** Also accept typing the umlaut digraph directly ("fuer" for "für"). */
function variants(s: string): string[] {
  const n = normalizeGerman(s);
  return [n];
}

/**
 * Grade a typed German answer against the expected string.
 * Articles are required when the expected answer has one (knowing der/die/das IS
 * the exercise for nouns), but we accept the bare word as "almost" so the UI can
 * show a gentle correction instead of a hard fail.
 */
export type Grade = 'correct' | 'almost' | 'wrong';

export function gradeTyped(expected: string, given: string): Grade {
  const exp = normalizeGerman(expected);
  const got = normalizeGerman(given);
  if (!got) return 'wrong';
  if (variants(expected).includes(got)) return 'correct';

  // Bare noun without its article — knows the word, missed the gender.
  const articles = ['der ', 'die ', 'das '];
  for (const a of articles) {
    if (exp.startsWith(a) && exp.slice(a.length) === got) return 'almost';
    // wrong article, right noun
    if (exp.startsWith(a) && articles.some((b) => b !== a && got === b + exp.slice(a.length)))
      return 'almost';
  }

  // Single-character slip on words long enough that it's clearly a typo, not a guess.
  if (exp.length >= 5 && levenshtein(exp, got) === 1) return 'almost';

  return 'wrong';
}

/** Grade a word-ordering answer: exact sequence after normalization. */
export function gradeOrder(expected: string, given: string[]): Grade {
  if (!given.length) return 'wrong';
  return normalizeGerman(given.join(' ')) === normalizeGerman(expected) ? 'correct' : 'wrong';
}

function levenshtein(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 1) return 2; // we only care about 0/1
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = cur;
  }
  return prev[n];
}
