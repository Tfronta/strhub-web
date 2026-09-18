/**
 * A tool's history: every commit it was verified at, in the software's order.
 *
 * Two clocks. `committed` is when the commit was made and is what orders the
 * rows — verifying v2.0 today still puts v2.0 below v2.5. `generated` is when
 * STRhub verified it and is shown on each row. The rule mirrors the engine's
 * publish_layout.rank: a row that knows its commit date outranks one that
 * does not; among those that do, the commit date decides; the verification
 * date only breaks ties. Pure, so it can be held to that by tests.
 *
 * Rows come from index.json's `versions` (schema /3) and, for entries from
 * before it, from the entry itself. The pre-consolidation slugs (`hipstr-v0-7`
 * and `hipstr-b2033bf` are the same commit twice) are folded here by commit
 * and panel until the engine's one-off migration retires them.
 */
import type { VerifiedIndex, VerifiedIndexEntry, VerifiedLevel, VerifiedVersionEntry } from "@/types/verified";

export interface HistoryRow {
  slug: string;
  sha: string | null;
  version: string | null;
  variant: string | null;
  committed: string | null;
  generated: string | null;
  level: VerifiedLevel;
  verdict: string | null;
  errors_reported: boolean;
  dataset_types: string[];
  /** Paths relative to the gh-pages root. */
  report: string;
  page: string;
  pdf: string;
  /** The alias row of its slug: what `/verified/<slug>` shows without `?at=`. */
  isAlias: boolean;
  /**
   * The newest commit among the rows of its kind — the same tool on the same
   * panel. The Y-STR run of an older commit is still the newest Y-STR run.
   */
  isNewest: boolean;
}

const LEVEL_RANK: Record<VerifiedLevel, number> = {
  none: 0, available: 1, installs: 2, runs: 3, io: 4, content: 5,
};

function rowOf(entry: VerifiedIndexEntry, v: VerifiedVersionEntry, isAlias: boolean): HistoryRow {
  return {
    slug: entry.slug,
    sha: v.sha ?? null,
    version: v.version ?? null,
    variant: v.variant ?? entry.variant ?? null,
    committed: v.committed ?? null,
    generated: v.generated ?? null,
    level: v.level,
    verdict: v.verdict ?? null,
    errors_reported: v.errors_reported ?? false,
    dataset_types: entry.dataset_types ?? [],
    report: v.report,
    page: v.page,
    pdf: v.pdf ?? v.report.replace(/\.json$/, ".pdf"),
    isAlias,
    isNewest: false,
  };
}

/** The rows of one index entry: its `versions`, or itself when it has none. */
export function rowsOf(entry: VerifiedIndexEntry): HistoryRow[] {
  const versions = entry.versions?.length
    ? entry.versions
    : [{
        sha: entry.sha ?? entry.source_ref ?? null,
        version: entry.version,
        variant: entry.variant,
        committed: entry.committed,
        generated: entry.generated,
        level: entry.level,
        label: entry.label,
        verdict: entry.verdict,
        errors_reported: entry.errors_reported,
        ci_run: entry.ci_run,
        report: entry.report,
        page: entry.page,
        pdf: entry.report.replace(/\.json$/, ".pdf"),
      } satisfies VerifiedVersionEntry];
  return versions.map((v, i) => rowOf(entry, v, i === 0));
}

/** Newest commit first; unknown commit dates last, by verification date. */
export function compareRows(a: HistoryRow, b: HistoryRow): number {
  const ka = a.committed ? 1 : 0;
  const kb = b.committed ? 1 : 0;
  if (ka !== kb) return kb - ka;
  if (a.committed !== b.committed) return (b.committed ?? "").localeCompare(a.committed ?? "");
  if (a.generated !== b.generated) return (b.generated ?? "").localeCompare(a.generated ?? "");
  return LEVEL_RANK[b.level] - LEVEL_RANK[a.level] || a.slug.localeCompare(b.slug);
}

/**
 * The slug with its version taken out: `hipstr-v0-7`, `hipstr-b2033bf` and
 * `hipstr` are one family; `hipstr-v0-7-y` is `hipstr-y`. The version is
 * written into a slug the way the engine writes slugs (lower case, runs of
 * anything else as a dash), and only a slug that carries ITS OWN version is
 * trimmed: `strait-razor-ForenSeqv1.27` at version v3 keeps its name, because
 * that suffix is a kit, and a kit is a different verification.
 */
export function familyOf(row: Pick<HistoryRow, "slug" | "version">): string {
  const v = (row.version ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (!v) return row.slug;
  // `v` is [a-z0-9-] only, so it needs no escaping in the pattern.
  const trimmed = row.slug.replace(new RegExp(`-${v}(?=-|$)`), "");
  return trimmed || row.slug;
}

/** The kind of verification a row is: the tool (its family) on a panel. */
export function kindOf(row: HistoryRow): string {
  return `${familyOf(row)}|${row.dataset_types.join("+")}|${row.variant ?? ""}`;
}

/** What makes two rows the same verification: the kind and the commit. */
function sameRun(a: HistoryRow, b: HistoryRow): boolean {
  return a.sha === b.sha && kindOf(a) === kindOf(b);
}

/**
 * The history of every entry given, folded and ordered. Two rows for one
 * commit and panel are one verification listed under two slugs (the
 * pre-consolidation catalogue); the later verification is kept, and on a tie
 * the shorter slug, which is the consolidated one.
 */
export function historyOf(entries: VerifiedIndexEntry[]): HistoryRow[] {
  const rows = entries.flatMap(rowsOf).filter((r) => r.level !== "none");
  const kept: HistoryRow[] = [];
  for (const row of rows) {
    const i = kept.findIndex((k) => sameRun(k, row));
    if (i < 0) {
      kept.push(row);
      continue;
    }
    const k = kept[i];
    const later = (row.generated ?? "").localeCompare(k.generated ?? "");
    if (later > 0 || (later === 0 && row.slug.length < k.slug.length)) kept[i] = row;
  }
  kept.sort(compareRows);
  const seen = new Set<string>();
  for (const row of kept) {
    const kind = kindOf(row);
    row.isNewest = !seen.has(kind);
    seen.add(kind);
  }
  return kept;
}

/** The newest row of `row`'s kind: what a reader of an older commit is pointed at. */
export function newestOfKind(rows: HistoryRow[], row: HistoryRow): HistoryRow | undefined {
  const kind = kindOf(row);
  return rows.find((r) => kindOf(r) === kind);
}

/** Every entry of the repository `repo` — the same tool, in every variant. */
export function repoEntries(index: VerifiedIndex, repo: string | null | undefined): VerifiedIndexEntry[] {
  if (!repo) return [];
  const key = repo.replace(/\/+$/, "").toLowerCase();
  return index.tools.filter((t) => (t.source_repo ?? "").replace(/\/+$/, "").toLowerCase() === key);
}

/**
 * The row `at` names: a commit SHA or an unambiguous prefix of one (seven
 * characters, as the page prints them). Prefers the slug asked for when a
 * commit was verified under several.
 */
export function findVersion(rows: HistoryRow[], at: string, slug?: string): HistoryRow | undefined {
  const needle = at.trim().toLowerCase();
  if (!/^[0-9a-f]{7,40}$/.test(needle)) return undefined;
  const hits = rows.filter((r) => (r.sha ?? "").toLowerCase().startsWith(needle));
  return hits.find((r) => r.slug === slug) ?? hits[0];
}

export function shortSha(sha: string | null | undefined): string {
  return (sha ?? "").slice(0, 7);
}

/** What a row is called: the version the report recorded, else the short commit. */
export function versionLabel(row: Pick<HistoryRow, "version" | "sha">): string {
  const v = row.version?.trim();
  return v && v !== shortSha(row.sha) ? v : shortSha(row.sha);
}
