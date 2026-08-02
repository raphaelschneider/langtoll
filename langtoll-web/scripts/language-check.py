#!/usr/bin/env python3
"""Is each pack's text actually in the language it claims?

Written after 640 English packs shipped with GERMAN taught text and passed three
audits, because every check measured structure — cloze slots, gloss shape,
sentence length — and none asked the one question a human asks first: is this
even English?

Method: stopword profiling. Function words are the most frequent words in any
language and almost never overlap across these six once diacritics and a few
signature words are included. Score every taught sentence and every gloss string
against all six profiles; report where the winner disagrees with the label.
No API calls, runs in seconds, zero cost.

    python3 scripts/language-check.py           # sweep everything
    python3 scripts/language-check.py --show 8  # more examples
"""
import argparse
import json
import os
import re
import subprocess
from collections import defaultdict

# High-frequency words + signature diacritics per language. Deliberately skewed
# toward words that do NOT collide across the six (so no bare "a", "die", "no").
PROFILES = {
    "de": {"der","die","das","und","ist","nicht","ich","wir","sie","ein","eine","einen","mit","für",
           "auf","dem","den","des","zum","zur","haben","hat","sind","wird","werden","wenn","weil",
           "obwohl","aber","auch","noch","schon","sehr","kann","muss","über","für","müssen","möchte"},
    "en": {"the","and","is","are","not","you","we","they","have","has","with","for","this","that",
           "was","were","will","would","can","must","of","to","in","on","at","because","although",
           "when","where","what","how","do","does","did","don't","doesn't"},
    "es": {"el","los","las","es","está","son","y","no","yo","nosotros","con","para","por","que",
           "una","uno","del","al","tiene","tienen","pero","también","muy","puede","cuando","aunque",
           "porque","dónde","cómo","qué","hay","más","según","ción"},
    "fr": {"le","la","les","est","sont","et","ne","pas","je","nous","ils","avec","pour","que","une",
           "des","du","au","aux","dans","mais","aussi","très","peut","quand","parce","bien","où",
           "c'est","n'est","qu'il","d'un","d'une","être","avoir","était"},
    "it": {"il","lo","gli","è","sono","e","non","io","noi","con","per","che","una","uno","del",
           "della","nel","ma","anche","molto","può","quando","perché","dove","come","cosa","ci",
           "si","più","già","così","dell'","un'"},
    "pt": {"o","os","as","é","são","e","não","eu","nós","com","para","por","que","uma","um","do",
           "da","dos","das","no","na","mas","também","muito","pode","quando","embora","porque",
           "onde","como","já","mais","você","vocês","tem","têm","está","estão","ção","ão"},
}

WORD = re.compile(r"[a-zA-ZäöüßáéíóúàèìòùâêîôûãõçñÄÖÜ'']+")


def mysql(sql: str) -> str:
    env = os.environ
    cmd = ["mysql", "-h", env.get("DB_HOST", "localhost"), "-u", env.get("DB_USER", "root"),
           f"-p{env.get('DB_PASSWORD','')}", "-N", "-B", "-e", sql, env.get("DB_NAME", "langtoll")]
    return subprocess.run(cmd, capture_output=True, text=True).stdout


def guess(text: str) -> tuple[str | None, float]:
    """Best-scoring language for a text, with its margin over the runner-up."""
    words = [w.lower() for w in WORD.findall(text)]
    if len(words) < 3:
        return None, 0.0  # too short to judge
    scores = {lang: sum(1 for w in words if w in prof) / len(words) for lang, prof in PROFILES.items()}
    ranked = sorted(scores.items(), key=lambda kv: -kv[1])
    (top, ts), (_, second) = ranked[0], ranked[1]
    if ts < 0.15:
        return None, 0.0  # nothing matched confidently
    return top, ts - second


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--show", type=int, default=4)
    args = ap.parse_args()

    rows = [r for r in mysql("SELECT language, level, topic, pack FROM topic_packs").split("\n") if r.strip()]
    taught_bad = defaultdict(list)   # (claimed, guessed) -> examples
    gloss_bad = defaultdict(list)
    cells = defaultdict(lambda: [0, 0])  # cell -> [packs, packs with taught-lang mismatch]
    total = 0

    for row in rows:
        parts = row.split("\t")
        if len(parts) < 4:
            continue
        lang, level, topic, raw = parts[0], parts[1], parts[2], "\t".join(parts[3:])
        try:
            pack = json.loads(raw)
        except json.JSONDecodeError:
            continue
        total += 1
        cell = f"{lang}/{level}"
        cells[cell][0] += 1

        # Taught text: vote across all sentences, so one ambiguous line can't flag a pack.
        sentences = [s.get("de", "") for s in pack.get("sentences", [])]
        votes = defaultdict(int)
        for text in sentences:
            g, margin = guess(text)
            if g and margin > 0.05:
                votes[g] += 1
        if votes:
            winner = max(votes, key=lambda k: votes[k])
            if winner != lang and votes[winner] >= max(2, len(sentences) // 2):
                cells[cell][1] += 1
                taught_bad[(lang, winner)].append(f"[{cell}] {topic}: \"{sentences[0][:60]}\"")

        # Glosses: each locale's strings should be in that locale.
        for s in pack.get("sentences", []):
            for loc, val in (s.get("gloss") or {}).items():
                if loc not in PROFILES or not isinstance(val, str):
                    continue
                g, margin = guess(val)
                if g and g != loc and margin > 0.15:
                    gloss_bad[(loc, g)].append(f"[{cell}] gloss.{loc} reads as {g}: \"{val[:60]}\"")

    print(f"swept {total} packs\n")

    print("── taught text in the wrong language ──────────────────")
    if not taught_bad:
        print("  none")
    for (claimed, got), rows_ in sorted(taught_bad.items(), key=lambda kv: -len(kv[1])):
        print(f"\n  claims {claimed}, reads as {got}: {len(rows_)} packs")
        for r in rows_[: args.show]:
            print(f"     {r}")
        if len(rows_) > args.show:
            print(f"     … and {len(rows_) - args.show} more")

    print("\n── glosses in the wrong language ──────────────────────")
    if not gloss_bad:
        print("  none")
    for (claimed, got), rows_ in sorted(gloss_bad.items(), key=lambda kv: -len(kv[1])):
        print(f"\n  gloss.{claimed} reads as {got}: {len(rows_)} strings")
        for r in rows_[: args.show]:
            print(f"     {r}")
        if len(rows_) > args.show:
            print(f"     … and {len(rows_) - args.show} more")

    print("\n── mismatched packs by cell ───────────────────────────")
    for cell in sorted(cells):
        packs, bad = cells[cell]
        flag = "  <<<" if bad else ""
        print(f"  {cell:<10}{bad:>4}/{packs}{flag}")


if __name__ == "__main__":
    main()
