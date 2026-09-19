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
 *
 * One commit can carry two runs: the repository's own instructions and a
 * recipe STRhub wrote (`instrument`). They are two facts about the commit,
 * two rows, and never fold into one; and the alias — what the card's badge
 * rests on — is the newest run that MAY stand behind it, not the newest
 * commit (publish_layout.alias_source). See lib/verified/instrument.ts.
 */
import type { VerifiedIndex, VerifiedIndexEntry, VerifiedInstrument, VerifiedLevel, VerifiedVersionEntry } from "@/types/verified";
import { mayStandBehindBadge } from "./instrument";

export interface HistoryRow {
  slug: string;
  sha: string | null;
  /** Null on an index from before the engine told instruments apart. */
  instrument: VerifiedInstrument | null;
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
    instrument: v.instrument ?? null,
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

/**
 * The rows of one index entry: its `versions`, or itself when it has none.
 * The alias row is the one the entry itself describes — its commit AND its
 * instrument, since the newest commit may be a curated run listed above the
 * documented one the badge rests on; on an index without instruments it is
 * the first row, which was the newest commit.
 */
export function rowsOf(entry: VerifiedIndexEntry): HistoryRow[] {
  const versions = entry.versions?.length
    ? entry.versions
    : [{
        sha: entry.sha ?? entry.source_ref ?? null,
        instrument: entry.instrument,
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
  const byInstrument = entry.instrument && entry.sha
    ? versions.findIndex((v) => v.sha === entry.sha && (v.instrument ?? null) === entry.instrument)
    : -1;
  const alias = byInstrument >= 0 ? byInstrument : 0;
  return versions.map((v, i) => rowOf(entry, v, i === alias));
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

/**
 * The kind of verification a row is: the tool (its family) on a panel, by
 * one instrument. A run of STRhub's recipe is not the newest of the
 * documented runs, nor an older one of them: it is its own kind.
 */
export function kindOf(row: HistoryRow): string {
  return `${familyOf(row)}|${row.dataset_types.join("+")}|${row.variant ?? ""}|${row.instrument ?? ""}`;
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
  // A run that reached no gate is nothing to list — unless it is one nobody
  // knew how to attempt: "could not be determined" is that finding, about
  // the documentation, and it publishes now (tanda 5b).
  const rows = entries.flatMap(rowsOf).filter((r) => r.level !== "none" || r.verdict === "undetermined");
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
 * commit was verified under several, and — since one commit can carry the
 * documented run and STRhub's — the instrument asked for, else the one that
 * may stand behind the badge; a commit that only has a curated run is still
 * found by its commit alone.
 */
export function findVersion(
  rows: HistoryRow[],
  at: string,
  slug?: string,
  instrument?: VerifiedInstrument,
): HistoryRow | undefined {
  const needle = at.trim().toLowerCase();
  if (!/^[0-9a-f]{7,40}$/.test(needle)) return undefined;
  const hits = rows.filter((r) => (r.sha ?? "").toLowerCase().startsWith(needle));
  const wanted = instrument
    ? hits.filter((r) => r.instrument === instrument)
    : hits.filter((r) => mayStandBehindBadge(r.instrument));
  const pool = wanted.length ? wanted : hits;
  return pool.find((r) => r.slug === slug) ?? pool[0];
}

/**
 * The row a tool's card rests on: the newest commit among the runs that may
 * stand behind the badge; failing any, the newest run of STRhub's recipe,
 * which the card must then present as "not verified as documented". Rows
 * are newest commit first, so the first eligible one is it. Mirrors
 * publish_layout.alias_source.
 */
export function headOf(rows: HistoryRow[]): HistoryRow | undefined {
  return rows.find((r) => mayStandBehindBadge(r.instrument)) ?? rows[0];
}

/** The newest run of STRhub's recipe among `rows` — the note, if there is one. */
export function curatedNoteOf(rows: HistoryRow[]): HistoryRow | undefined {
  return rows.find((r) => r.instrument === "curated");
}

/** The newest run that may stand behind the badge, of one slug. */
export function documentedOf(rows: HistoryRow[], slug: string): HistoryRow | undefined {
  return rows.find((r) => r.slug === slug && mayStandBehindBadge(r.instrument));
}

export function shortSha(sha: string | null | undefined): string {
  return (sha ?? "").slice(0, 7);
}

/** What a row is called: the version the report recorded, else the short commit. */
export function versionLabel(row: Pick<HistoryRow, "version" | "sha">): string {
  const v = row.version?.trim();
  return v && v !== shortSha(row.sha) ? v : shortSha(row.sha);
}

/**
 * A row as the page shows it: the run of the repository's own instructions,
 * and — as an annotation of it, never a row beside it — the run of STRhub's
 * recipe at the same commit, if there is one. A run of STRhub's recipe with
 * no documented sibling at its commit is its own row, and the page marks it
 * as not verified as documented.
 */
export interface DisplayRow {
  row: HistoryRow;
  strhub?: HistoryRow;
}

function sameToolAndCommit(a: HistoryRow, b: HistoryRow): boolean {
  return a.sha === b.sha && familyOf(a) === familyOf(b)
    && a.dataset_types.join("+") === b.dataset_types.join("+") && (a.variant ?? "") === (b.variant ?? "");
}

export function foldStrhubRuns(rows: HistoryRow[]): DisplayRow[] {
  const shown: DisplayRow[] = rows.filter((r) => r.instrument !== "curated").map((row) => ({ row }));
  const out: DisplayRow[] = [];
  for (const r of rows) {
    if (r.instrument !== "curated") {
      out.push(shown.find((d) => d.row === r)!);
      continue;
    }
    const host = shown.find((d) => !d.strhub && sameToolAndCommit(d.row, r));
    if (host) host.strhub = r;
    else out.push({ row: r });
  }
  return out;
}
