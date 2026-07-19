#!/usr/bin/env python3
"""Content inventory: what a learner can actually be served, before vs after.

"Before" is read from a git ref rather than remembered, so the comparison cannot
drift no matter how many edits land in between.

    python3 scripts/content-report.py [baseline-ref]     # default: HEAD

Counts item object-literals (one per line, indent 2) in the vocab/sentence packs.
The generated pool is reported SEPARATELY: it is served from the backend and never
enters the app binary, so folding it into the authored count would overstate what
ships and understate what the pool buys.
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO = ROOT.parent
LANGS = ["english", "german", "spanish", "french", "italian", "portuguese"]
LEVELS = ["a1", "a2", "b1", "b2"]
KINDS = ["vocab", "sentences"]
# Per generated pack, from the generation prompt in the topics route.
VOCAB_PER_PACK, SENTENCES_PER_PACK = 14, 4


def count_text(text: str) -> int:
    return sum(1 for line in text.splitlines() if line.startswith("  {"))


def count_worktree(rel: str) -> int:
    p = ROOT / rel
    return count_text(p.read_text(encoding="utf-8")) if p.is_file() else 0


def count_baseline(ref: str, rel: str) -> int:
    try:
        out = subprocess.run(
            ["git", "show", f"{ref}:langpass-mobile/{rel}"],
            cwd=REPO, capture_output=True, text=True, check=False,
        )
        return count_text(out.stdout) if out.returncode == 0 else 0
    except Exception:
        return 0


def mult(before: int, after: int) -> str:
    if before == 0:
        return "NEW" if after else "-"
    return f"{after / before:.1f}x"


def main() -> None:
    ref = sys.argv[1] if len(sys.argv) > 1 else "HEAD"
    w = "{:<12} {:<8} {:>10} {:>10} {:>9}"
    print(w.format("LANGUAGE", "LEVEL", "BEFORE", "AFTER", "CHANGE"))
    print("-" * 53)

    tot_b = tot_a = 0
    for lang in LANGS:
        lb = la = 0
        for lvl in LEVELS:
            b = a = 0
            for kind in KINDS:
                rel = f"content/{lang}/{lvl}-{kind}.ts"
                b += count_baseline(ref, rel)
                a += count_worktree(rel)
            if not b and not a:
                continue
            lb, la = lb + b, la + a
            print(w.format(lang, lvl.upper(), b, a, mult(b, a)))
        tot_b, tot_a = tot_b + lb, tot_a + la
        print(w.format("", "total", lb, la, mult(lb, la)))
        print("-" * 53)

    print(w.format("ALL", "BUNDLED", tot_b, tot_a, mult(tot_b, tot_a)))

    cat = REPO / "langpass-web/src/lib/ai/catalogue.ts"
    if cat.is_file():
        topics = sum(1 for line in cat.read_text(encoding="utf-8").splitlines()
                     if line.strip().startswith("'") and line.rstrip().endswith("',"))
        # Every catalogue topic is generated per language and per level.
        packs = topics * len(LANGS) * len([l for l in LEVELS if l != "b2" or True])
        pool = packs * (VOCAB_PER_PACK + SENTENCES_PER_PACK)
        print(w.format("ALL", "POOL", 0, pool, "NEW"))
        print(w.format("ALL", "COMBINED", tot_b, tot_a + pool, mult(tot_b, tot_a + pool)))
        print(f"\n  pool = {topics} topics x {len(LANGS)} languages x {len(LEVELS)} levels "
              f"= {packs} packs, generated once and shared by every user")


if __name__ == "__main__":
    main()
