#!/usr/bin/env python3
"""Structural validation for every authored content pack.

These rules were previously enforced only on the SERVER, for AI-generated packs
(see langpass-web .../topics/generate/route.ts). Authored content was never
checked, so the same defects the rules exist to prevent shipped in the bundle:
sentences whose blank falls on the final word (trailing punctuation gives the
answer away) or on an article (blanking "der" tests nothing).

    python3 scripts/validate-content.py            # report
    python3 scripts/validate-content.py --strict   # exit 1 if anything fails

Item literals are one per line by convention, which is what makes a regex read
sufficient here — if that ever stops being true this will under-report, so the
line count is printed as a sanity check against content-report.py.
"""
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LANGS = ["english", "german", "spanish", "french", "italian", "portuguese"]
LEVELS = ["a1", "a2", "b1", "b2"]

# Mirrors the server's list — articles across all six taught languages.
ARTICLES = {
    "der","die","das","den","dem","des","ein","eine","einen","einem","einer","eines",
    "el","la","los","las","un","una","unos","unas",
    "le","les","une","du","de",
    "il","lo","gli","i","uno","gl'",
    "o","a","os","as","um","uma",
    "the",
}

FIELD = {
    "id": re.compile(r"\bid:\s*'([^']*)'"),
    "de": re.compile(r"\bde:\s*'((?:[^'\\]|\\.)*)'"),
    "cloze": re.compile(r"\bclozeIndex:\s*(\d+)"),
    "distractors": re.compile(r"\bclozeDistractors:\s*\[([^\]]*)\]"),
    "level": re.compile(r"\blevel:\s*'([^']*)'"),
}
STRINGS = re.compile(r"'((?:[^'\\]|\\.)*)'")


def bare(w: str) -> str:
    return w.strip().strip("¿¡\"'()").rstrip(".,!?;:\"')").lower()


def parse(path: Path):
    if not path.is_file():
        return []
    out = []
    for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.startswith("  {"):
            continue
        item = {"line": n}
        for key, rx in FIELD.items():
            m = rx.search(line)
            if m:
                item[key] = m.group(1)
        if "distractors" in item:
            item["distractors"] = [s for s in STRINGS.findall(item["distractors"])]
        out.append(item)
    return out


def main() -> None:
    strict = "--strict" in sys.argv
    problems = defaultdict(list)
    total = 0

    for lang in LANGS:
        headwords = {}  # de -> "level/id", for cross-level duplicate detection
        for lvl in LEVELS:
            for kind in ("vocab", "sentences"):
                rel = f"content/{lang}/{lvl}-{kind}.ts"
                items = parse(ROOT / rel)
                total += len(items)
                seen_ids = set()
                for it in items:
                    where = f"{rel}:{it['line']}"
                    iid = it.get("id", "?")

                    if iid in seen_ids:
                        problems["duplicate id"].append(f"{where}  {iid}")
                    seen_ids.add(iid)

                    if it.get("level", "").lower() != lvl:
                        problems["level field mismatches filename"].append(
                            f"{where}  {iid} says level '{it.get('level')}'")

                    de = it.get("de", "")
                    if kind == "vocab" and de:
                        prior = headwords.get(de)
                        if prior:
                            problems["duplicate headword"].append(f"{where}  '{de}' also at {prior}")
                        else:
                            headwords[de] = f"{lvl}/{iid}"

                    if "cloze" not in it:
                        continue
                    words = de.split()
                    ci = int(it["cloze"])
                    dis = it.get("distractors", [])

                    if ci >= len(words):
                        problems["clozeIndex out of range"].append(f"{where}  {iid}")
                        continue
                    if ci == len(words) - 1:
                        problems["blank is the final word"].append(f"{where}  {iid}  '{de}'")
                    if bare(words[ci]) in ARTICLES:
                        problems["blank is an article"].append(f"{where}  {iid}  blanks '{words[ci]}'")
                    if len(dis) != 3:
                        problems["wrong distractor count"].append(f"{where}  {iid}  has {len(dis)}")
                    answer = bare(words[ci])
                    if any(bare(d) == answer for d in dis):
                        problems["distractor equals answer"].append(f"{where}  {iid}")
                    if any(bare(d) in ARTICLES for d in dis):
                        problems["article used as distractor"].append(f"{where}  {iid}")
                    if len({bare(d) for d in dis}) != len(dis):
                        problems["repeated distractors"].append(f"{where}  {iid}")

    print(f"scanned {total} items\n")
    if not problems:
        print("✓ no structural problems found")
        return
    count = 0
    for kind, rows in sorted(problems.items(), key=lambda kv: -len(kv[1])):
        count += len(rows)
        print(f"── {kind}  ({len(rows)})")
        for r in rows[:12]:
            print(f"     {r}")
        if len(rows) > 12:
            print(f"     … and {len(rows) - 12} more")
        print()
    print(f"{count} problems across {len(problems)} categories")
    if strict:
        sys.exit(1)


if __name__ == "__main__":
    main()
