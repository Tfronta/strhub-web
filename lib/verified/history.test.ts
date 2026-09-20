import { describe, expect, it } from "vitest";
import { curatedNoteOf, documentedOf, familyOf, findVersion, foldStrhubRuns, headOf, historyOf, newestOfKind, repoEntries, versionLabel } from "./history";
import type { VerifiedIndex, VerifiedIndexEntry } from "@/types/verified";

/**
 * A tool's history is ordered by when each commit was made, not by when it
 * was verified: verifying v2.0 today still puts v2.0 below v2.5. The rows come
 * from index/3 `versions`, or from the entry itself for older indexes, and the
 * pre-consolidation duplicates fold into one row per commit and panel.
 */
const REPO = "https://github.com/tfwillems/HipSTR";
const NEW = "12e989be4a8f9ab59f0c4c5da3784b82018cac82";
const OLD = "b2033bf000000000000000000000000000000000";
const OLDEST = "0a1b2c3000000000000000000000000000000000";

function entry(over: Partial<VerifiedIndexEntry>): VerifiedIndexEntry {
  return {
    slug: "hipstr", name: "HipSTR", level: "content", label: "Runs + Plausible output",
    generated: "2026-09-16T21:14:32+00:00", source_repo: REPO, source_ref: NEW, ci_run: null,
    distinct_str_loci: 21, distinct_snp_markers: 0, total_reads: 7851,
    dataset_types: ["illumina-bam-hg38"], report: "hipstr.json", page: "hipstr.html",
    ...over,
  };
}

describe("history order", () => {
  it("puts the newest commit first even when an older one was verified later", () => {
    const rows = historyOf([entry({
      sha: NEW, committed: "2026-02-01T00:00:00Z",
      versions: [
        { sha: NEW, version: "12e989b", committed: "2026-02-01T00:00:00Z", generated: "2026-09-16T00:00:00+00:00", level: "content", report: `hipstr/${NEW}/hipstr.json`, page: `hipstr/${NEW}/hipstr.html`, pdf: `hipstr/${NEW}/hipstr.pdf` },
        { sha: OLDEST, version: "v0.6", committed: "2018-05-01T00:00:00Z", generated: "2026-09-18T00:00:00+00:00", level: "runs", report: `hipstr/${OLDEST}/hipstr.json`, page: `hipstr/${OLDEST}/hipstr.html` },
        { sha: OLD, version: "v0.7", committed: "2019-09-04T00:00:00Z", generated: "2026-09-15T00:00:00+00:00", level: "content", report: `hipstr/${OLD}/hipstr.json`, page: `hipstr/${OLD}/hipstr.html` },
      ],
    })]);
    expect(rows.map((r) => r.sha)).toEqual([NEW, OLD, OLDEST]);
    expect(rows.map((r) => r.isNewest)).toEqual([true, false, false]);
    // The alias is what index.json listed first, whatever the order here.
    expect(rows.map((r) => r.isAlias)).toEqual([true, false, false]);
    // The pdf path is derived when the index did not carry one.
    expect(rows[2].pdf).toBe(`hipstr/${OLDEST}/hipstr.pdf`);
  });

  it("lists rows without a commit date after every dated one, by verification date", () => {
    const rows = historyOf([
      entry({ slug: "hipstr", sha: NEW, generated: "2026-09-16T00:00:00+00:00" }),
      entry({ slug: "hipstr-v0-7", sha: OLD, source_ref: OLD, generated: "2026-09-15T00:00:00+00:00", report: "hipstr-v0-7.json", page: "hipstr-v0-7.html" }),
      entry({ slug: "hipstr-dated", sha: OLDEST, source_ref: OLDEST, committed: "2018-05-01T00:00:00Z", generated: "2026-09-01T00:00:00+00:00", report: "hipstr-dated.json", page: "hipstr-dated.html" }),
    ]);
    expect(rows.map((r) => r.slug)).toEqual(["hipstr-dated", "hipstr", "hipstr-v0-7"]);
  });
});

describe("folding the pre-consolidation catalogue", () => {
  it("keeps one row for one commit verified under two slugs on the same panel", () => {
    const rows = historyOf([
      entry({ slug: "hipstr-v0-7", version: "v0.7", sha: OLD, source_ref: OLD, report: "hipstr-v0-7.json", page: "hipstr-v0-7.html" }),
      entry({ slug: "hipstr-b2033bf", version: "b2033bf", sha: OLD, source_ref: OLD, report: "hipstr-b2033bf.json", page: "hipstr-b2033bf.html" }),
      entry({ slug: "hipstr-v0-7-y", version: "v0.7", sha: OLD, source_ref: OLD, dataset_types: ["illumina-bam-hg38-y"], report: "hipstr-v0-7-y.json", page: "hipstr-v0-7-y.html" }),
    ]);
    // Same commit, same panel → one row (the shorter slug on a tie); the Y-STR panel is its own row.
    expect(rows.map((r) => r.slug).sort()).toEqual(["hipstr-v0-7", "hipstr-v0-7-y"]);
    // Each panel's only row is the newest of its kind.
    expect(rows.every((r) => r.isNewest)).toBe(true);
  });

  it("marks the newest of each kind, so an older commit's Y-STR run is still the newest Y-STR run", () => {
    const rows = historyOf([
      entry({ slug: "hipstr", version: "12e989b", sha: NEW, committed: "2026-02-01T00:00:00Z" }),
      entry({ slug: "hipstr-v0-7", version: "v0.7", sha: OLD, source_ref: OLD, committed: "2019-09-04T00:00:00Z", report: "hipstr-v0-7.json", page: "hipstr-v0-7.html" }),
      entry({ slug: "hipstr-v0-7-y", version: "v0.7", sha: OLD, source_ref: OLD, committed: "2019-09-04T00:00:00Z", dataset_types: ["illumina-bam-hg38-y"], report: "hipstr-v0-7-y.json", page: "hipstr-v0-7-y.html" }),
    ]);
    const by = Object.fromEntries(rows.map((r) => [r.slug, r]));
    expect(by["hipstr"].isNewest).toBe(true);
    expect(by["hipstr-v0-7"].isNewest).toBe(false);
    expect(by["hipstr-v0-7-y"].isNewest).toBe(true);
    expect(newestOfKind(rows, by["hipstr-v0-7"])?.slug).toBe("hipstr");
    expect(newestOfKind(rows, by["hipstr-v0-7-y"])?.slug).toBe("hipstr-v0-7-y");
  });

  it("keeps the later verification when the same commit was verified twice", () => {
    const rows = historyOf([
      entry({ slug: "hipstr-b2033bf", version: "b2033bf", sha: OLD, source_ref: OLD, generated: "2026-08-01T00:00:00+00:00", report: "hipstr-b2033bf.json", page: "hipstr-b2033bf.html" }),
      entry({ slug: "hipstr-v0-7", version: "v0.7", sha: OLD, source_ref: OLD, generated: "2026-09-15T00:00:00+00:00", report: "hipstr-v0-7.json", page: "hipstr-v0-7.html" }),
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0].slug).toBe("hipstr-v0-7");
  });
});

describe("what counts as the same verification", () => {
  it("takes a slug's own version out of its name, and nothing else", () => {
    expect(familyOf({ slug: "hipstr-v0-7", version: "v0.7" })).toBe("hipstr");
    expect(familyOf({ slug: "hipstr-b2033bf", version: "b2033bf" })).toBe("hipstr");
    expect(familyOf({ slug: "hipstr-v0-7-y", version: "v0.7" })).toBe("hipstr-y");
    expect(familyOf({ slug: "hipstr", version: "12e989b" })).toBe("hipstr");
    expect(familyOf({ slug: "gangstr-v2-5", version: "v2.5" })).toBe("gangstr");
    // A kit is not a version: two kits at one commit are two verifications.
    expect(familyOf({ slug: "strait-razor-ForenSeqv1.27", version: "v3" })).toBe("strait-razor-ForenSeqv1.27");
    expect(familyOf({ slug: "strait-razor-PowerSeqv2.31", version: "v3" })).toBe("strait-razor-PowerSeqv2.31");
    expect(familyOf({ slug: "x", version: null })).toBe("x");
  });

  it("keeps two kits of one tool at one commit as two rows", () => {
    const rows = historyOf([
      entry({ slug: "strait-razor-ForenSeqv1.27", version: "v3", sha: OLD, source_ref: OLD, dataset_types: ["illumina-str-fastq"], report: "a.json", page: "a.html" }),
      entry({ slug: "strait-razor-PowerSeqv2.31", version: "v3", sha: OLD, source_ref: OLD, dataset_types: ["illumina-str-fastq"], report: "b.json", page: "b.html" }),
    ]);
    expect(rows).toHaveLength(2);
  });
});

describe("finding a version", () => {
  const rows = historyOf([entry({
    sha: NEW, versions: [
      { sha: NEW, committed: "2026-02-01T00:00:00Z", level: "content", report: "a.json", page: "a.html" },
      { sha: OLD, committed: "2019-09-04T00:00:00Z", level: "content", report: "b.json", page: "b.html" },
    ],
  })]);

  it("resolves the seven-character prefix the page prints", () => {
    expect(findVersion(rows, "b2033bf")?.sha).toBe(OLD);
    expect(findVersion(rows, OLD)?.sha).toBe(OLD);
    expect(findVersion(rows, "B2033BF")?.sha).toBe(OLD);
  });

  it("refuses anything that is not a commit", () => {
    expect(findVersion(rows, "v0.7")).toBeUndefined();
    expect(findVersion(rows, "b2033")).toBeUndefined();
    expect(findVersion(rows, "../index")).toBeUndefined();
  });
});

describe("the same tool across variants", () => {
  it("collects every entry of the repository, however the URL was written", () => {
    const index: VerifiedIndex = {
      schema: "strhub-verified/index/3", generated: "", count: 3,
      tools: [
        entry({ slug: "hipstr" }),
        entry({ slug: "hipstr-y", source_repo: "https://github.com/tfwillems/HipSTR/", dataset_types: ["illumina-bam-hg38-y"] }),
        entry({ slug: "gangstr", source_repo: "https://github.com/gymreklab/gangstr" }),
      ],
    };
    expect(repoEntries(index, REPO).map((e) => e.slug)).toEqual(["hipstr", "hipstr-y"]);
    expect(repoEntries(index, null)).toEqual([]);
  });
});

describe("what a row is called", () => {
  it("is the version when the report recorded one, else the short commit", () => {
    expect(versionLabel({ version: "v0.7", sha: OLD })).toBe("v0.7");
    expect(versionLabel({ version: "b2033bf", sha: OLD })).toBe("b2033bf");
    expect(versionLabel({ version: null, sha: NEW })).toBe("12e989b");
  });
});

/**
 * One commit can carry two runs: the repository's own instructions and a
 * recipe STRhub wrote. They are two facts, two rows; the alias is the newest
 * run that may stand behind the badge, not the newest commit; and a tool
 * with no documented run yet heads with its curated one, marked.
 */
describe("two instruments", () => {
  // STRspy as the engine settled it: the curated run is at the newest commit,
  // the documented alias is an older one that failed.
  const strspy = entry({
    slug: "strspy-ont", name: "STRspy", source_repo: "https://github.com/unique379r/strspy",
    sha: OLD, source_ref: OLD, instrument: "documented", level: "installs", verdict: "fails",
    dataset_types: ["ont-bam-hg38"],
    versions: [
      { sha: NEW, instrument: "curated", committed: "2024-01-01T00:00:00Z", generated: "2026-09-16T00:00:00+00:00", level: "io", verdict: "runs", report: `strspy-ont/${NEW}/curated/strspy-ont.json`, page: `strspy-ont/${NEW}/curated/strspy-ont.html` },
      { sha: OLD, instrument: "documented", committed: "2023-06-01T00:00:00Z", generated: "2026-09-18T00:00:00+00:00", level: "installs", verdict: "fails", report: `strspy-ont/${OLD}/strspy-ont.json`, page: `strspy-ont/${OLD}/strspy-ont.html` },
      { sha: OLD, instrument: "curated", committed: "2023-06-01T00:00:00Z", generated: "2026-09-17T00:00:00+00:00", level: "io", verdict: "runs", report: `strspy-ont/${OLD}/curated/strspy-ont.json`, page: `strspy-ont/${OLD}/curated/strspy-ont.html` },
    ],
  });

  it("keeps the documented run and STRhub's at one commit as two rows", () => {
    const rows = historyOf([strspy]);
    expect(rows.map((r) => [r.sha, r.instrument])).toEqual([[NEW, "curated"], [OLD, "documented"], [OLD, "curated"]]);
  });

  it("marks as the alias the run the index entry describes, not the newest commit", () => {
    const rows = historyOf([strspy]);
    expect(rows.map((r) => r.isAlias)).toEqual([false, true, false]);
    // Without instruments in the index, the first row was the newest commit and the alias.
    const legacy = historyOf([entry({ sha: NEW, versions: [
      { sha: NEW, committed: "2026-02-01T00:00:00Z", level: "content", report: "a.json", page: "a.html" },
      { sha: OLD, committed: "2019-09-04T00:00:00Z", level: "content", report: "b.json", page: "b.html" },
    ] })]);
    expect(legacy.map((r) => r.isAlias)).toEqual([true, false]);
  });

  it("is its own kind: the newest curated run is not an older documented one", () => {
    const rows = historyOf([strspy]);
    expect(rows.map((r) => r.isNewest)).toEqual([true, true, false]);
    expect(newestOfKind(rows, rows[2])).toBe(rows[0]);
  });

  it("heads a card with the newest run that may stand behind the badge", () => {
    const rows = historyOf([strspy]);
    expect(headOf(rows)?.sha).toBe(OLD);
    expect(headOf(rows)?.instrument).toBe("documented");
    expect(curatedNoteOf(rows)?.sha).toBe(NEW);
    expect(documentedOf(rows, "strspy-ont")?.sha).toBe(OLD);
    expect(documentedOf(rows, "other")).toBeUndefined();
  });

  it("heads a tool with no documented run with its curated one", () => {
    const rows = historyOf([entry({ slug: "gangstr", sha: NEW, instrument: "curated", versions: [
      { sha: NEW, instrument: "curated", committed: "2026-02-01T00:00:00Z", level: "content", report: "gangstr/x/curated/gangstr.json", page: "gangstr/x/curated/gangstr.html" },
    ] })]);
    expect(headOf(rows)?.instrument).toBe("curated");
    expect(rows[0].isAlias).toBe(true);
  });

  it("finds the documented run at a commit unless STRhub's recipe is asked for", () => {
    const rows = historyOf([strspy]);
    expect(findVersion(rows, "b2033bf", "strspy-ont")?.instrument).toBe("documented");
    expect(findVersion(rows, "b2033bf", "strspy-ont", "curated")?.instrument).toBe("curated");
    // A commit that only has a curated run is still found by its commit alone.
    expect(findVersion(rows, "12e989b", "strspy-ont")?.instrument).toBe("curated");
    // And asking for a curated run at a commit that has none falls back to what is there.
    expect(findVersion(rows, "12e989b", "strspy-ont", "documented")?.instrument).toBe("curated");
  });

  it("shows STRhub's run as an annotation of its commit's row, and alone only when the commit has no documented run", () => {
    const rows = historyOf([strspy]);
    const shown = foldStrhubRuns(rows);
    // dafdee7 has only STRhub's run: its own row. b2033bf has both: one row, annotated.
    expect(shown.map((d) => [d.row.sha, d.row.instrument, d.strhub?.instrument ?? null]))
      .toEqual([[NEW, "curated", null], [OLD, "documented", "curated"]]);
    // The Y-STR run of the same commit is another tool's row, not this one's annotation.
    const withY = historyOf([strspy, entry({ slug: "strspy-y", sha: OLD, source_ref: OLD, instrument: "curated", dataset_types: ["ont-bam-hg38-y"], report: "y.json", page: "y.html", versions: [
      { sha: OLD, instrument: "curated", committed: "2023-06-01T00:00:00Z", level: "io", report: "y.json", page: "y.html" },
    ] })]);
    expect(foldStrhubRuns(withY).filter((d) => d.row.sha === OLD).map((d) => [d.row.slug, d.strhub?.slug ?? null]))
      .toEqual([["strspy-ont", "strspy-ont"], ["strspy-y", null]]);
  });

  it("folds STRhub's run onto the documented row whatever variant its recipe called itself", () => {
    // HipSTR's curated recipe says "Autosomal (hg38)"; the documented run of the same commit says nothing.
    const rows = historyOf([entry({ slug: "hipstr", sha: OLD, source_ref: OLD, instrument: "documented", versions: [
      { sha: OLD, instrument: "documented", committed: "2021-05-10T00:00:00Z", generated: "2026-09-18T00:00:00+00:00", level: "content", report: "a.json", page: "a.html" },
      { sha: OLD, instrument: "curated", variant: "Autosomal (hg38)", committed: "2021-05-10T00:00:00Z", generated: "2026-09-19T00:00:00+00:00", level: "content", report: "b.json", page: "b.html" },
    ] })]);
    const shown = foldStrhubRuns(rows);
    expect(shown).toHaveLength(1);
    expect(shown[0].row.instrument).toBe("documented");
    expect(shown[0].strhub?.instrument).toBe("curated");
  });

  it("leaves a retired run out of the rows, the head and the note, but still finds it by its link", () => {
    const stone = { retired: "2026-09-20T00:00:00+00:00", reason: "its recipe is no longer committed" };
    const rows = historyOf([entry({ slug: "straitrazor", sha: OLD, source_ref: OLD, instrument: "documented", versions: [
      { sha: OLD, instrument: "documented", committed: "2025-08-18T00:00:00Z", level: "content", report: "a.json", page: "a.html" },
      { sha: OLD, instrument: "curated", retired: stone, committed: "2025-08-18T00:00:00Z", level: "content", report: "b.json", page: "b.html" },
    ] })]);
    expect(foldStrhubRuns(rows)).toEqual([{ row: rows[0] }]);
    expect(curatedNoteOf(rows)).toBeUndefined();
    expect(findVersion(rows, "b2033bf", "straitrazor", "curated")?.retired).toEqual(stone);
    // A tool whose every run is retired heads with nothing.
    const gone = historyOf([entry({ slug: "x", sha: OLD, source_ref: OLD, instrument: "curated", versions: [
      { sha: OLD, instrument: "curated", retired: stone, level: "content", report: "b.json", page: "b.html" },
    ] })]);
    expect(headOf(gone)).toBeUndefined();
  });

  it("lists a run nobody knew how to attempt, though it reached no gate", () => {
    const rows = historyOf([entry({ slug: "readme-less", sha: NEW, instrument: "documented", level: "none", verdict: "undetermined", versions: [
      { sha: NEW, instrument: "documented", committed: "2026-02-01T00:00:00Z", level: "none", verdict: "undetermined", report: "r.json", page: "r.html" },
      { sha: OLD, instrument: "documented", committed: "2019-09-04T00:00:00Z", level: "none", verdict: "fails", report: "s.json", page: "s.html" },
    ] })]);
    expect(rows.map((r) => r.sha)).toEqual([NEW]);
  });
});
