import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getVerifiedIndex,
  getVerifiedReport,
  getVerifiedReportAt,
  verifiedFileUrl,
  verifiedPdfUrl,
  verifiedReportJsonUrl,
  verifiedStaticPageUrl,
} from "@/lib/verified";
import { curatedNoteOf, findVersion, historyOf, repoEntries, type HistoryRow } from "@/lib/verified/history";
import { VerifiedDetail } from "@/components/verified/verified-detail";
import type { VerifiedInstrument, VerifiedReport } from "@/types/verified";

// Always render from the live report. `revalidate = 300` here made the page
// serve a stale attestation to anyone arriving just after a run finished (see
// the note on fetchJson in lib/verified.ts). The listing keeps its ISR window;
// this page is the one that makes a claim about a specific tool.
export const dynamic = "force-dynamic";

interface Loaded {
  report: VerifiedReport;
  staticPageUrl: string;
  pdfUrl: string;
  jsonUrl: string;
  history?: { rows: HistoryRow[]; current: HistoryRow };
  /** The run of STRhub's own recipe for this slug, when the page is not it. */
  note?: { row: HistoryRow; report: VerifiedReport };
}

/**
 * The newest run of STRhub's recipe for this slug, fetched, when the run on
 * the page may stand behind the badge: it is shown under the documented
 * result as a note. A page that IS that run has no note.
 */
async function noteFor(rows: HistoryRow[], slug: string, current: HistoryRow | undefined) {
  if (!current || current.instrument === "curated") return undefined;
  const row = curatedNoteOf(rows.filter((r) => r.slug === slug));
  if (!row) return undefined;
  const report = await getVerifiedReportAt(row.report);
  return report ? { row, report } : undefined;
}

/**
 * The tool at one commit: the newest (the root files) unless `?at=<sha>` names
 * an older one, which lives in `<slug>/<sha>/` on gh-pages — and, with
 * `&recipe=curated`, the run of STRhub's recipe at that commit, which lives
 * beside the documented one. The history — every commit of the repository,
 * in every variant — comes from index.json, and an `at` that names no
 * verified commit is a bad link, not a fallback.
 */
async function load(slug: string, at: string | undefined, recipe: VerifiedInstrument | undefined): Promise<Loaded | null> {
  const index = await getVerifiedIndex();
  const entry = index.tools.find((t) => t.slug === slug);
  const rows = entry ? historyOf(repoEntries(index, entry.source_repo)) : [];

  if (at) {
    const row = findVersion(rows, at, slug, recipe);
    if (!row) return null;
    const report = await getVerifiedReportAt(row.report);
    if (!report) return null;
    return {
      report,
      staticPageUrl: verifiedFileUrl(row.page),
      pdfUrl: verifiedFileUrl(row.pdf),
      jsonUrl: verifiedFileUrl(row.report),
      history: { rows, current: row },
      note: await noteFor(rows, slug, row),
    };
  }

  const report = await getVerifiedReport(slug);
  if (!report) return null;
  const current = rows.find((r) => r.slug === slug && r.isAlias);
  return {
    report,
    staticPageUrl: verifiedStaticPageUrl(slug),
    pdfUrl: verifiedPdfUrl(slug),
    jsonUrl: verifiedReportJsonUrl(slug),
    history: current ? { rows, current } : undefined,
    note: await noteFor(rows, slug, current),
  };
}

type Search = { at?: string | string[]; recipe?: string | string[] };

function atParam(searchParams: Search): string | undefined {
  const at = Array.isArray(searchParams.at) ? searchParams.at[0] : searchParams.at;
  return at?.trim() || undefined;
}

/** Only the one instrument a link needs to name: the run beside the documented one. */
function recipeParam(searchParams: Search): VerifiedInstrument | undefined {
  const recipe = Array.isArray(searchParams.recipe) ? searchParams.recipe[0] : searchParams.recipe;
  return recipe?.trim() === "curated" ? "curated" : undefined;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Search;
}): Promise<Metadata> {
  const loaded = await load(params.slug, atParam(searchParams), recipeParam(searchParams));
  if (!loaded) return { title: "STRhub Verified" };
  const { report } = loaded;
  const repoName = report.source?.repo?.replace(/\/+$/, "").split("/").pop();
  const version = report.tool.version ? ` ${report.tool.version}` : "";
  return {
    title: { absolute: `${repoName || report.tool.name}${version} | STRhub Verified` },
    description: report.scope,
  };
}

export default async function VerifiedToolPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Search;
}) {
  const loaded = await load(params.slug, atParam(searchParams), recipeParam(searchParams));
  if (!loaded) notFound();
  return (
    <VerifiedDetail
      report={loaded.report}
      slug={params.slug}
      staticPageUrl={loaded.staticPageUrl}
      pdfUrl={loaded.pdfUrl}
      jsonUrl={loaded.jsonUrl}
      history={loaded.history}
      note={loaded.note}
    />
  );
}
