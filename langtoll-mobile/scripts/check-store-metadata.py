#!/usr/bin/env python3
"""Enforce App Store field limits on store/appstore-metadata.md.

Name/Subtitle/Keywords are effectively permanent — changing them after launch
costs a full review cycle — so a silent truncation at submission time is
expensive. This parses the doc and fails loudly instead.

Checks:
  - Name ≤30, Subtitle ≤30, Keywords ≤100, Promotional ≤170, Description ≤4000
  - keywords: comma-separated, no space after commas (wasted characters)
  - NO WORD REPEATED across Name/Subtitle/Keywords of the same locale — Apple
    combines words across those fields, so a duplicate buys nothing and costs
    characters.

Usage: python3 scripts/check-store-metadata.py
"""
from __future__ import annotations

import os
import re
import sys
import unicodedata

DOC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "store", "appstore-metadata.md")
LIMITS = {"name": 30, "subtitle": 30, "keywords": 100, "promotional": 170, "description": 4000}
# Words Apple already indexes elsewhere or that waste space.
STOPWORDS = {"the", "a", "an", "and", "or", "to", "for", "your", "you", "app", "apps"}


def norm(word: str) -> str:
    """Fold accents/case so 'Übe' and 'ube' count as the same token."""
    w = unicodedata.normalize("NFKD", word.lower())
    return "".join(c for c in w if not unicodedata.combining(c))


def words(text: str) -> set[str]:
    return {norm(w) for w in re.findall(r"[^\s,:—–\-]+", text) if norm(w) not in STOPWORDS}


def fail(msg: str) -> None:
    print(f"FAIL  {msg}")
    fail.count += 1


fail.count = 0


def check_locale(label: str, name: str, subtitle: str, keywords: str) -> None:
    for field, value in (("name", name), ("subtitle", subtitle), ("keywords", keywords)):
        n = len(value)
        limit = LIMITS[field]
        status = "ok  " if n <= limit else "FAIL"
        if n > limit:
            fail(f"{label} {field}: {n}/{limit} chars — over by {n - limit}")
        else:
            print(f"ok    {label} {field}: {n}/{limit}")
    if ", " in keywords:
        fail(f"{label} keywords: has a space after a comma — each one wastes a character")
    dupes = (words(name) | words(subtitle)) & words(keywords)
    if dupes:
        fail(f"{label} repeats {sorted(dupes)} in keywords — Apple combines fields; drop them")


def main() -> None:
    text = open(DOC, encoding="utf-8").read()

    # Primary locale: fenced blocks under the English headings.
    def block(header: str) -> str:
        m = re.search(rf"\*\*{header}\*\*[^\n]*\n```\n(.*?)\n```", text, re.S)
        return m.group(1).strip() if m else ""

    en_name, en_sub = block("Name"), block("Subtitle")
    en_kw, en_promo = block("Keywords"), block("Promotional text")
    en_desc = block("Description")
    check_locale("en-US", en_name, en_sub, en_kw)
    for field, value in (("promotional", en_promo), ("description", en_desc)):
        n, limit = len(value), LIMITS[field]
        if n > limit:
            fail(f"en-US {field}: {n}/{limit} chars — over by {n - limit}")
        else:
            print(f"ok    en-US {field}: {n}/{limit}")

    # Localizations: "- Name: `…`" bullet triples under each ### heading.
    for loc in re.finditer(r"### ([^\n(]+)\(([^)]+)\)\n(.*?)(?=\n###|\n---|\Z)", text, re.S):
        label = loc.group(2).strip()
        body = loc.group(3)
        got = {}
        for field in ("Name", "Subtitle", "Keywords"):
            m = re.search(rf"- {field}: `([^`]*)`", body)
            if m:
                got[field.lower()] = m.group(1)
        if len(got) == 3:
            check_locale(label, got["name"], got["subtitle"], got["keywords"])

    print()
    if fail.count:
        print(f"{fail.count} problem(s) — fix before pasting into App Store Connect.")
        sys.exit(1)
    print("All fields within Apple's limits, no cross-field waste.")


if __name__ == "__main__":
    main()
