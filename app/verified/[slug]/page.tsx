import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getVerifiedReport,
  verifiedStaticPageUrl,
} from "@/lib/verified";
import { VerifiedDetail } from "@/components/verified/verified-detail";

// Always render from the live report. `revalidate = 300` here made the page
// serve a stale attestation to anyone arriving just after a run finished (see
// the note on fetchJson in lib/verified.ts). The listing keeps its ISR window;
// this page is the one that makes a claim about a specific tool.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const report = await getVerifiedReport(params.slug);
  if (!report) return { title: "STRhub Verified" };
  const repoName = report.source?.repo?.replace(/\/+$/, "").split("/").pop();
  return {
    title: `${repoName || report.tool.name} — STRhub Verified`,
    description: report.scope,
  };
}

export default async function VerifiedToolPage({
  params,
}: {
  params: { slug: string };
}) {
  const report = await getVerifiedReport(params.slug);
  if (!report) notFound();
  return (
    <VerifiedDetail
      report={report}
      slug={params.slug}
      staticPageUrl={verifiedStaticPageUrl(params.slug)}
    />
  );
}
