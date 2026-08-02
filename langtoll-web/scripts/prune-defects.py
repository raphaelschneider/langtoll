#!/usr/bin/env python3
"""Delete the sentences the audit flags — a pure database pass, zero API calls.

Reuses audit-pool.py's own detection so this can never disagree with the audit
about what counts as defective. Drops ONLY the offending sentences; vocab and
the rest of each pack stay untouched. A pack losing one sentence out of twelve
is invisible to the learner; an unanswerable exercise is not.

    python3 scripts/prune-defects.py --dry    # list what would be dropped
    python3 scripts/prune-defects.py          # do it
"""
import importlib.util
import json
import os
import subprocess
import sys

spec = importlib.util.spec_from_file_location(
    "audit", os.path.join(os.path.dirname(__file__), "audit-pool.py"))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


def mysql_update(key: str, pack: dict) -> None:
    env = os.environ
    payload = json.dumps({"key": key, "pack": pack})
    # Feed JSON via stdin to a tiny python-mysql shim? No driver installed —
    # use mysql CLI with a here-string built safely through subprocess input.
    sql = "UPDATE topic_packs SET pack = @p WHERE content_key = @k"
    stmt = (
        "SET @p = '" + json.dumps(pack).replace("\\", "\\\\").replace("'", "''") + "'; "
        "SET @k = '" + key.replace("'", "''") + "'; " + sql + ";"
    )
    r = subprocess.run(
        ["mysql", "-h", env["DB_HOST"], "-u", env["DB_USER"],
         f"-p{env['DB_PASSWORD']}", env["DB_NAME"]],
        input=stmt, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"update failed for {key}: {r.stderr[:200]}")


def main() -> None:
    dry = "--dry" in sys.argv
    rows = [r for r in audit.mysql("SELECT content_key, pack FROM topic_packs").split("\n") if r.strip()]
    touched = dropped = 0

    for row in rows:
        key, raw = row.split("\t", 1)
        try:
            pack = json.loads(raw)
        except json.JSONDecodeError:
            continue
        pack.setdefault("language", key.split(":")[0])
        defects = audit.audit_pack(pack)
        if not defects:
            continue

        # Two example formats: gloss defects quote the raw sentence, cloze
        # defects quote it with the blank masked as [___]. Match both, else the
        # function-word blanks survive the prune (they did, first run).
        def masked(sent):
            w = (sent.get("de") or "").split()
            ci = sent.get("clozeIndex", -1)
            if not (0 <= ci < len(w)):
                return None
            return " ".join("[___]" if i == ci else x for i, x in enumerate(w))

        bad_texts = set()
        for _, example in defects:
            for sent in pack.get("sentences", []):
                de = sent.get("de")
                if not de:
                    continue
                if de in example or ((m := masked(sent)) and m in example):
                    bad_texts.add(de)
        if not bad_texts:
            continue

        before = len(pack["sentences"])
        for t in sorted(bad_texts):
            print(f"  {key}: DROP \"{t[:70]}\"")
        if dry:
            touched += 1
            dropped += len(bad_texts)
            continue

        pack["sentences"] = [s for s in pack["sentences"] if s.get("de") not in bad_texts]
        mysql_update(key, pack)
        touched += 1
        dropped += before - len(pack["sentences"])

    print(f"\n{'would touch' if dry else 'touched'} {touched} packs, "
          f"{'would drop' if dry else 'dropped'} {dropped} sentences")


if __name__ == "__main__":
    main()
