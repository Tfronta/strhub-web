/**
 * Read-only access to STRhub Verified attestations published on the engine's
 * `gh-pages` branch. Server-side fetch with ISR; no auth, no writes.
 *
 * Override the source with NEXT_PUBLIC_VERIFIED_BASE if the engine repo moves.
 */
import type {
  VerifiedIndex,
  VerifiedInstrument,
  VerifiedPublication,
  VerifiedReport,
} from "@/types/verified";
import {
  curatedNoteOf,
  findVersion,
  historyOf,
  repoEntries,
  type HistoryRow,
} from "@/lib/verified/history";

const BASE =
  process.env.NEXT_PUBLIC_VERIFIED_BASE ??
  "https://raw.githubusercontent.com/Tfronta/strhub-verified-next/gh-pages";

// Kept for any future listing that is genuinely just a directory. The catalogue
// is not one: its cards carry the badge level, the locus count and the read
// total, so a stale card states a superseded result about a named tool exactly
// the way a stale detail page does.
const REVALIDATE_SECONDS = 300;

/**
 * `fresh` bypasses the cache entirely for a single report.
 *
 * ISR is stale-while-revalidate: a request past the window is served the CACHED
 * copy and only then triggers regeneration in the background. Someone reloading
 * right after a verification run therefore sees the PREVIOUS run's result, and
 * the visit after that sees the one before it — the page sits a generation
 * behind for exactly the person most likely to be watching. That produced hours
 * of "the PDF and the site disagree", when the PDF (a static file) was right
 * every time and only the page was old. An attestation is a claim about
 * software; showing a superseded one is worse than showing it a second later.
 */
async function fetchJson<T>(url: string, fresh = false): Promise<T | null> {
  try {
    const res = await fetch(
      url,
      fresh ? { cache: "no-store" } : { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function isCatalogueGhost(entry: VerifiedIndex["tools"][number]): boolean {
  // Older gh-pages builds mistakenly listed index.json as a tool report.
  return entry.slug === "index" || entry.report === "index.json";
}

/**
 * @param options.fresh Bypass the fetch cache (default). The Verified pages
 *   must always show the latest attestation (see above); the sitemap does not
 *   need that and passes `fresh: false` so it can be served from ISR.
 */
export async function getVerifiedIndex(
  options: { fresh?: boolean } = {}
): Promise<VerifiedIndex> {
  const fresh = options.fresh ?? true;
  const data = await fetchJson<VerifiedIndex>(`${BASE}/index.json`, fresh);
  if (!data) {
    return {
      schema: "strhub-verified/index/1",
      generated: new Date().toISOString(),
      count: 0,
      tools: [],
    };
  }
  const tools = data.tools.filter((t) => !isCatalogueGhost(t));
  return { ...data, count: tools.length, tools };
}

export async function getVerifiedReport(
  slug: string
): Promise<VerifiedPublication | null> {
  // Guard against path traversal — slugs are flat file stems.
  if (!/^[A-Za-z0-9._-]+$/.test(slug)) return null;
  return fetchJson<VerifiedPublication>(`${BASE}/${slug}.json`, true);
}

/** Canonical URL of the per-tool static HTML page on gh-pages (fallback view). */
export function verifiedStaticPageUrl(slug: string): string {
  return `${BASE}/${slug}.html`;
}

/** The PDF the engine writes next to the report, for a reader who wants to keep it. */
export function verifiedPdfUrl(slug: string): string {
  return `${BASE}/${slug}.pdf`;
}

/** The report itself: what this page renders, for a reader who wants the record. */
export function verifiedReportJsonUrl(slug: string): string {
  return `${BASE}/${slug}.json`;
}

/** A file on gh-pages by its path in index.json (`hipstr/<sha>/hipstr.pdf`). */
export function verifiedFileUrl(path: string): string {
  return `${BASE}/${path.replace(/^\/+/, "")}`;
}

/**
 * The report of one commit, by the path index.json gives for it. The root
 * `<slug>.json` is the newest commit; older ones live in `<slug>/<sha>/`.
 */
export async function getVerifiedReportAt(path: string): Promise<VerifiedPublication | null> {
  if (!/^[A-Za-z0-9._-]+(\/[A-Za-z0-9._-]+)*\.json$/.test(path)) return null;
  return fetchJson<VerifiedPublication>(verifiedFileUrl(path), true);
}

export function contentStats(report: VerifiedReport) {
  const outs = report.content_detail?.outputs;
  return outs && outs.length > 0 ? outs[0].stats : undefined;
}

export interface LoadedVerifiedPage {
  report: VerifiedPublication;
  staticPageUrl: string;
  pdfUrl: string;
  jsonUrl: string;
  history?: { rows: HistoryRow[]; current: HistoryRow };
  note?: { row: HistoryRow; report: VerifiedReport };
}

export interface VerifiedFetcherDeps {
  getIndex: () => Promise<VerifiedIndex>;
  getReport: (slug: string) => Promise<VerifiedPublication | null>;
  getReportAt: (path: string) => Promise<VerifiedPublication | null>;
}

const defaultDeps: VerifiedFetcherDeps = {
  getIndex: () => getVerifiedIndex(),
  getReport: (slug) => getVerifiedReport(slug),
  getReportAt: (path) => getVerifiedReportAt(path),
};

async function noteForSlug(
  rows: HistoryRow[],
  slug: string,
  current: HistoryRow | undefined,
  deps: VerifiedFetcherDeps,
): Promise<{ row: HistoryRow; report: VerifiedReport } | undefined> {
  if (!current || current.instrument === "curated") return undefined;
  const row = curatedNoteOf(rows.filter((r) => r.slug === slug));
  if (!row) return undefined;
  const report = await deps.getReportAt(row.report);
  return report && report.record_type !== "editorial_review" ? { row, report } : undefined;
}

/**
 * Resolve `/verified/<slug>` (including `?at=<sha>`, `?recipe=curated`, and
 * curated-only entries whose `entry.report` points to `<slug>/<sha>-curated/<slug>.json`
 * without a root `<slug>.json` file).
 */
export async function resolveVerifiedToolPage(
  slug: string,
  at?: string,
  recipe?: VerifiedInstrument,
  deps: VerifiedFetcherDeps = defaultDeps,
): Promise<LoadedVerifiedPage | null> {
  if (!/^[A-Za-z0-9._-]+$/.test(slug)) return null;
  const index = await deps.getIndex();
  const entry = index.tools.find((t) => t.slug === slug);
  const peers = entry ? repoEntries(index, entry.source_repo) : [];
  const rows = entry ? historyOf(peers.length > 0 ? peers : [entry]) : [];

  if (at) {
    const row = findVersion(rows, at, slug, recipe);
    if (!row) return null;
    const report = await deps.getReportAt(row.report);
    if (!report) return null;
    return {
      report,
      staticPageUrl: verifiedFileUrl(row.page),
      pdfUrl: verifiedFileUrl(row.pdf),
      jsonUrl: verifiedFileUrl(row.report),
      history: { rows, current: row },
      note: await noteForSlug(rows, slug, row, deps),
    };
  }

  // Direct `?recipe=curated` without `?at=` resolves the newest curated run of `slug`.
  if (recipe === "curated") {
    const curatedRow =
      curatedNoteOf(rows.filter((r) => r.slug === slug)) ??
      rows.find((r) => r.slug === slug && r.instrument === "curated");
    if (!curatedRow) return null;
    const report = await deps.getReportAt(curatedRow.report);
    if (!report) return null;
    return {
      report,
      staticPageUrl: verifiedFileUrl(curatedRow.page),
      pdfUrl: verifiedFileUrl(curatedRow.pdf),
      jsonUrl: verifiedFileUrl(curatedRow.report),
      history: { rows, current: curatedRow },
      note: undefined,
    };
  }

  const current = rows.find((r) => r.slug === slug && r.isAlias) ?? rows.find((r) => r.slug === slug);
  const indexedReportPath = current?.report ?? entry?.report;
  const indexedIsSubdir = Boolean(indexedReportPath && indexedReportPath !== `${slug}.json`);

  let report: VerifiedPublication | null = null;
  let usedIndexedPath = false;

  if (indexedIsSubdir && indexedReportPath) {
    report = await deps.getReportAt(indexedReportPath);
    if (report) usedIndexedPath = true;
  }
  if (!report) {
    report = await deps.getReport(slug);
  }
  if (!report && indexedReportPath && !usedIndexedPath) {
    report = await deps.getReportAt(indexedReportPath);
    if (report) usedIndexedPath = true;
  }
  if (!report) return null;

  const reportPath = usedIndexedPath && indexedReportPath ? indexedReportPath : `${slug}.json`;
  const pagePath = usedIndexedPath
    ? current?.page ?? entry?.page ?? reportPath.replace(/\.json$/, ".html")
    : `${slug}.html`;
  const pdfPath = usedIndexedPath
    ? current?.pdf ?? reportPath.replace(/\.json$/, ".pdf")
    : `${slug}.pdf`;

  return {
    report,
    staticPageUrl: usedIndexedPath ? verifiedFileUrl(pagePath) : verifiedStaticPageUrl(slug),
    pdfUrl: usedIndexedPath ? verifiedFileUrl(pdfPath) : verifiedPdfUrl(slug),
    jsonUrl: usedIndexedPath ? verifiedFileUrl(reportPath) : verifiedReportJsonUrl(slug),
    history: current ? { rows, current } : undefined,
    note: await noteForSlug(rows, slug, current, deps),
  };
}

/** Fetch root `<slug>.json`, falling back to `entry.report` from `index.json` when stored in a subdir. */
export async function getVerifiedReportOrIndexed(
  slug: string,
  deps: VerifiedFetcherDeps = defaultDeps,
): Promise<VerifiedPublication | null> {
  const direct = await deps.getReport(slug);
  if (direct) return direct;
  const index = await deps.getIndex();
  const entry = index.tools.find((t) => t.slug === slug);
  if (!entry?.report) return null;
  return deps.getReportAt(entry.report);
}
