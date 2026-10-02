"""Window STRbase Variant Allele sequences to the ISFG minimum range for STRNaming.

Produces the `isfg` sequences stored in data/strnaming_names.json: the exact
input that gives each published STRNaming name.

    npx tsx scripts/dump-strbase-sequences.ts > strbase.json
    python3 scripts/strnaming-window-strbase.py strbase.json out/
    strnaming name-sequences -r out/ranges.bed out/strnaming_in.tsv out/strnaming_out.tsv

Each STRbase sequence (GRCh38 forward strand) is cut at the ISFG minimum range
of its FSSG row (data/fssg_motif_data.json). Each side is found on its own:
- outer anchor: the k bases of the FSSG full-range flank next to the minimum
  range, k = 10 down to 6, used when it occurs exactly once in the STRbase
  sequence (overlapping matches count), never inside the reference minimum
  range, and, on the right, after the left boundary;
- inner anchor, if no outer one: the first / last 10 bases of the reference
  minimum range, exact and unique, else unique with at most one mismatch.
A sequence with no anchor on a side does not span the range (not_covered).
A name is published only when its CE equals the STRbase allele designation;
otherwise the row is held for review.

Regenerated 2026-10-02 with STRNaming 1.2.1: all 1569 published names, the 7
held rows and the 15 not_covered rows reproduce.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def occurrences(hay: str, needle: str) -> list[int]:
    out, i = [], hay.find(needle)
    while i != -1:
        out.append(i)
        i = hay.find(needle, i + 1)
    return out


def unique_fuzzy(hay: str, needle: str) -> int | None:
    n = len(needle)
    hits = [
        i
        for i in range(len(hay) - n + 1)
        if sum(a != b for a, b in zip(hay[i : i + n], needle)) <= 1
    ]
    return hits[0] if len(hits) == 1 else None


def inner(seq: str, anchor: str) -> int | None:
    hits = occurrences(seq, anchor)
    return hits[0] if len(hits) == 1 else unique_fuzzy(seq, anchor)


def window(seq: str, row: dict) -> str | None:
    full, mr, fr = row["fullRangeSequence"], row["minimumRange"], row["fullRange"]
    off = mr["start"] - fr["start"]
    ref = full[off : off + mr["length"]]
    left_flank, right_flank = full[:off], full[off + mr["length"] :]

    start = None
    for k in range(10, 5, -1):
        anchor = left_flank[-k:]
        if len(anchor) == k and anchor not in ref:
            hits = occurrences(seq, anchor)
            if len(hits) == 1:
                start = hits[0] + k
                break
    if start is None:
        start = inner(seq, ref[:10])

    end = None
    for k in range(10, 5, -1):
        anchor = right_flank[:k]
        if len(anchor) == k and anchor not in ref:
            hits = occurrences(seq, anchor)
            if len(hits) == 1 and (start is None or hits[0] >= start):
                end = hits[0]
                break
    if end is None:
        pos = inner(seq, ref[-10:])
        end = pos + 10 if pos is not None else None

    if start is None or end is None or end <= start:
        return None
    return seq[start:end]


def main(strbase_path: str, out_dir: str) -> None:
    fssg = json.loads((ROOT / "data/fssg_motif_data.json").read_text())
    strbase = json.loads(Path(strbase_path).read_text())
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)

    strip = lambda s: re.sub(r"[\s_-]", "", s.lower())
    row_for = {strip(name): name for name in fssg}

    windows, tsv = {}, []
    for marker, seqs in strbase.items():
        row = fssg[row_for[strip(marker)]]
        windows[marker] = []
        for s in seqs:
            w = window(s["sequence"].upper(), row)
            windows[marker].append({"allele": s["allele"], "isfg": w})
            if w:
                tsv.append(f"{row['locus'].replace(' ', '_')}\t{w}")

    (out / "windows.json").write_text(json.dumps(windows))
    (out / "strnaming_in.tsv").write_text("\n".join(tsv) + "\n")
    with (out / "ranges.bed").open("w") as bed:
        for name, row in fssg.items():
            mr = row["minimumRange"]
            if mr:
                bed.write(f"{mr['chrom']}\t{mr['start'] - 1}\t{mr['end']}\t{name.replace(' ', '_')}\t0\t+\n")
    covered = sum(1 for rows in windows.values() for r in rows if r["isfg"])
    total = sum(len(rows) for rows in windows.values())
    print(f"{covered}/{total} sequences span the ISFG minimum range")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
