import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveVerifiedToolPage } from "@/lib/verified";
import { VerifiedDetail } from "@/components/verified/verified-detail";
import type { VerifiedInstrument } from "@/types/verified";

// Always render from the live report. `revalidate = 300` here made the page
// serve a stale attestation to anyone arriving just after a run finished (see
// the note on fetchJson in lib/verified.ts). The listing keeps its ISR window;
// this page is the one that makes a claim about a specific tool.
export const dynamic = "force-dynamic";

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
  const loaded = await resolveVerifiedToolPage(params.slug, atParam(searchParams), recipeParam(searchParams));
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
  const loaded = await resolveVerifiedToolPage(params.slug, atParam(searchParams), recipeParam(searchParams));
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
