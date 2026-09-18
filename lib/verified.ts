/**
 * Read-only access to STRhub Verified attestations published on the engine's
 * `gh-pages` branch. Server-side fetch with ISR; no auth, no writes.
 *
 * Override the source with NEXT_PUBLIC_VERIFIED_BASE if the engine repo moves.
 */
import type { VerifiedIndex, VerifiedReport } from "@/types/verified";

const BASE =
  process.env.NEXT_PUBLIC_VERIFIED_BASE ??
  "https://raw.githubusercontent.com/Tfronta/strhub-verified/gh-pages";

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
): Promise<VerifiedReport | null> {
  // Guard against path traversal — slugs are flat file stems.
  if (!/^[A-Za-z0-9._-]+$/.test(slug)) return null;
  return fetchJson<VerifiedReport>(`${BASE}/${slug}.json`, true);
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
export async function getVerifiedReportAt(path: string): Promise<VerifiedReport | null> {
  if (!/^[A-Za-z0-9._-]+(\/[A-Za-z0-9._-]+)*\.json$/.test(path)) return null;
  return fetchJson<VerifiedReport>(verifiedFileUrl(path), true);
}

export function contentStats(report: VerifiedReport) {
  const outs = report.content_detail?.outputs;
  return outs && outs.length > 0 ? outs[0].stats : undefined;
}
