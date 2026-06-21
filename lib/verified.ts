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

// Revalidate every 5 minutes — short enough to reflect new runs promptly.
const REVALIDATE_SECONDS = 300;

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
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

export async function getVerifiedIndex(): Promise<VerifiedIndex> {
  const data = await fetchJson<VerifiedIndex>(`${BASE}/index.json`);
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
  return fetchJson<VerifiedReport>(`${BASE}/${slug}.json`);
}

/** Canonical URL of the per-tool static HTML page on gh-pages (fallback view). */
export function verifiedStaticPageUrl(slug: string): string {
  return `${BASE}/${slug}.html`;
}

export function contentStats(report: VerifiedReport) {
  const outs = report.content_detail?.outputs;
  return outs && outs.length > 0 ? outs[0].stats : undefined;
}
