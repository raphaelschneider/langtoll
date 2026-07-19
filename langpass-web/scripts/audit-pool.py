#!/usr/bin/env python3
"""Audit generated packs for the defects structural validation cannot see.

Written because I twice declared the pool fixed after looking at ONE pack, and
twice it was wrong — birthday candles at B2, then noun answers offered against
past participles. validate() checks shape: distractors exist, are not articles,
are not the answer. Everything below is about whether the exercise is actually
answerable and actually at its level.

Run ON the droplet (needs MySQL):
    set -a; . /etc/langpass/env; set +a
    python3 scripts/audit-pool.py            # every pack
    python3 scripts/audit-pool.py --limit 40 # quick sample
    python3 scripts/audit-pool.py --show 12  # print offending examples

Reports RATES per language/level. A number you can check beats an impression.
"""
import argparse
import json
import os
import subprocess
import sys
from collections import defaultdict

LOCALES = ["en", "de", "es", "fr", "it", "pt"]

# Blanking one of these tests nothing — the learner recalls grammar they already
# used to parse the rest of the sentence. Seen live: "[___] müssen die Abflugzeit
# verschieben." with the answer "Wir".
FUNCTION_WORDS = {
    "de": {"ich","du","er","sie","es","wir","ihr","man","mich","dich","sich","uns","euch",
           "ist","sind","war","waren","hat","haben","hatte","wird","werden","kann","muss","soll"},
    "en": {"i","you","he","she","it","we","they","me","him","her","us","them",
           "is","are","was","were","has","have","had","will","would","can","must","should"},
    "es": {"yo","tú","él","ella","nosotros","vosotros","ellos","me","te","se","nos",
           "es","son","era","fue","ha","han","había","será","puede","debe"},
    "fr": {"je","tu","il","elle","nous","vous","ils","elles","on","me","te","se",
           "est","sont","était","a","ont","avait","sera","peut","doit"},
    "it": {"io","tu","lui","lei","noi","voi","loro","mi","ti","si","ci",
           "è","sono","era","ha","hanno","aveva","sarà","può","deve"},
    "pt": {"eu","tu","ele","ela","nós","vocês","eles","me","te","se","nos",
           "é","são","era","foi","tem","têm","tinha","será","pode","deve"},
}

# Subordinating/argument connectors. B1/B2 sentences should reach for these; a
# level whose sentences almost never do is drifting downward.
CONNECTORS = {
    "de": {"weil","obwohl","dass","damit","während","dennoch","allerdings","sofern","falls","wenn","als","bevor","nachdem"},
    "en": {"because","although","whereas","unless","despite","however","therefore","while","since","provided","nevertheless"},
    "es": {"porque","aunque","mientras","sino","embargo","aunque","cuando","hasta","siempre","dado"},
    "fr": {"parce","bien","alors","tandis","cependant","néanmoins","toutefois","quoique","puisque","lorsque"},
    "it": {"perché","benché","mentre","tuttavia","sebbene","quindi","poiché","affinché","nonostante"},
    "pt": {"porque","embora","enquanto","contudo","portanto","porém","caso","desde","assim","apesar"},
}


def mysql(sql: str) -> str:
    env = os.environ
    cmd = ["mysql", "-h", env.get("DB_HOST", "localhost"), "-u", env.get("DB_USER", "root"),
           f"-p{env.get('DB_PASSWORD','')}", "-N", "-B", "-e", sql, env.get("DB_NAME", "langpass")]
    return subprocess.run(cmd, capture_output=True, text=True).stdout


def strip_punct(w: str) -> str:
    return w.strip("¿¡\"'()[].,!?;:»«").strip()


def audit_pack(pack: dict) -> list[tuple[str, str]]:
    """Return (defect, example) pairs for one pack."""
    lang = pack.get("language", "")
    out: list[tuple[str, str]] = []
    fn = FUNCTION_WORDS.get(lang, set())

    for v in pack.get("vocab", []):
        g = v.get("gloss") or {}
        missing = [l for l in LOCALES if l != lang and l not in g]
        if missing:
            out.append(("vocab missing glosses", f"{v.get('de')} missing {','.join(missing)}"))

    for s in pack.get("sentences", []):
        words = (s.get("de") or "").split()
        ci = s.get("clozeIndex", -1)
        if not (0 <= ci < len(words)):
            out.append(("cloze index out of range", s.get("de", "")))
            continue
        answer = strip_punct(words[ci])
        dis = [strip_punct(d) for d in (s.get("clozeDistractors") or [])]
        shown = " ".join("[___]" if i == ci else w for i, w in enumerate(words))

        if answer.lower() in fn:
            out.append(("blank is a function word", f"{shown}  answer={answer}"))

        # Capitalisation as a cheap part-of-speech proxy. In German a noun is
        # capitalised, so a capitalised answer against lowercase distractors means
        # a noun slot offering verbs. Skip sentence-initial answers, which are
        # capitalised for position rather than word class.
        if ci > 0 and dis:
            a_upper = answer[:1].isupper()
            d_upper = [d[:1].isupper() for d in dis if d]
            if d_upper and any(u != a_upper for u in d_upper):
                out.append(("distractor case mismatch", f"{shown}  answer={answer}  options={dis}"))

        # A distractor identical to the answer, or repeated, makes the item unanswerable.
        if len({d.lower() for d in dis}) != len(dis):
            out.append(("duplicate distractors", f"{shown}  options={dis}"))
        if any(d.lower() == answer.lower() for d in dis):
            out.append(("answer among distractors", f"{shown}  answer={answer}"))

        g = s.get("gloss") or {}
        missing = [l for l in LOCALES if l != lang and l not in g]
        if missing:
            out.append(("sentence missing glosses", f"{s.get('de')} missing {','.join(missing)}"))

    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--show", type=int, default=6, help="examples to print per defect")
    args = ap.parse_args()

    sql = "SELECT language, level, topic, pack FROM topic_packs"
    if args.limit:
        sql += f" ORDER BY RAND() LIMIT {args.limit}"
    rows = [r for r in mysql(sql).split("\n") if r.strip()]
    if not rows:
        print("no packs found (is the env sourced?)")
        sys.exit(1)

    defects = defaultdict(list)
    per_cell = defaultdict(lambda: {"packs": 0, "bad": 0})
    level_stats = defaultdict(lambda: {"words": 0, "sentences": 0, "connectors": 0})
    total = 0

    for row in rows:
        parts = row.split("\t")
        if len(parts) < 4:
            continue
        lang, level, topic, raw = parts[0], parts[1], parts[2], "\t".join(parts[3:])
        try:
            pack = json.loads(raw)
        except json.JSONDecodeError:
            defects["unparseable pack"].append(f"{lang}/{level}/{topic}")
            continue
        pack.setdefault("language", lang)
        total += 1
        cell = f"{lang}/{level}"
        per_cell[cell]["packs"] += 1

        found = audit_pack(pack)
        if found:
            per_cell[cell]["bad"] += 1
        for kind, example in found:
            defects[kind].append(f"[{lang}/{level}] {example}")

        conn = CONNECTORS.get(lang, set())
        for s in pack.get("sentences", []):
            ws = (s.get("de") or "").split()
            level_stats[level]["sentences"] += 1
            level_stats[level]["words"] += len(ws)
            if any(strip_punct(w).lower() in conn for w in ws):
                level_stats[level]["connectors"] += 1

    print(f"audited {total} packs\n")

    print("── defects ─────────────────────────────────────────────")
    if not defects:
        print("  none\n")
    for kind, rows_ in sorted(defects.items(), key=lambda kv: -len(kv[1])):
        print(f"\n{kind}: {len(rows_)}")
        for r in rows_[: args.show]:
            print(f"    {r}")
        if len(rows_) > args.show:
            print(f"    … and {len(rows_) - args.show} more")

    print("\n── level signal (drift check) ──────────────────────────")
    print(f"  {'level':<6}{'sentences':>10}{'avg words':>11}{'% with connector':>18}")
    for level in sorted(level_stats):
        st = level_stats[level]
        n = max(st["sentences"], 1)
        print(f"  {level:<6}{st['sentences']:>10}{st['words']/n:>11.1f}{100*st['connectors']/n:>17.0f}%")

    print("\n── packs with at least one defect, by cell ─────────────")
    for cell in sorted(per_cell):
        c = per_cell[cell]
        pct = 100 * c["bad"] / max(c["packs"], 1)
        flag = "  <<<" if pct > 20 else ""
        print(f"  {cell:<10}{c['bad']:>4}/{c['packs']:<5}{pct:>5.0f}%{flag}")


if __name__ == "__main__":
    main()
