/**
 * Level 2 — manual verification request.
 *
 * Reached only from an attestation the ENGINE marked eligible. Eligibility is
 * re-checked here, server-side, against the published report: the gate has to
 * live where the data is, or hand-typing a slug into the URL would walk straight
 * past it. An ineligible (or unknown) slug gets the free path instead, never the
 * offer — including the case that motivated the whole design, an author who is
 * simply stuck on the form, whom we help for free.
 */
import type { Metadata } from "next";
import { getVerifiedReport } from "@/lib/verified";
import {
  declaredManualRecord,
  isCompatibilityFlag,
  isManualEligible,
} from "@/lib/verified/manual";
import { VerifiedManualRequest } from "@/components/verified/verified-manual-request";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Manual verification — STRhub Verified",
};

export default async function VerifiedManualPage({
  searchParams,
}: {
  searchParams: { slug?: string; declared?: string };
}) {
  const slug = searchParams.slug?.trim() || "";
  const report = slug ? await getVerifiedReport(slug) : null;

  // Two ways to be here, and neither is us picking a favourite:
  //  - a published report the engine stamped eligible (trigger B, detected), or
  //  - a pre-flight declaration from the submit form (trigger A), which has no
  //    report by design — the point of the pre-flight is to skip the doomed run.
  // Anything else falls through to the free path.
  const declared = searchParams.declared?.trim() || "";
  const manual = isManualEligible(report)
    ? report!.manual_verification!
    : isCompatibilityFlag(declared)
      ? declaredManualRecord(declared)
      : null;

  return (
    <VerifiedManualRequest
      slug={slug}
      toolName={report?.tool?.name ?? slug}
      manual={manual}
      ciRun={report?.ci_run}
    />
  );
}
