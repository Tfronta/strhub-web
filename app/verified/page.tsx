import type { Metadata } from "next";
import { getVerifiedIndex } from "@/lib/verified";
import { VerifiedList } from "@/components/verified/verified-list";

// Same reason as the detail page: these cards show each tool's badge level,
// locus count and read total, so an ISR window makes the catalogue assert a
// superseded result about a named tool.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "STRhub Verified: reproducible-execution attestations" },
  description:
    "Independent, automated attestations of documented execution: verifying whether forensic STR tools install and run end-to-end strictly following public repository instructions in clean, reproducible environments. Does not evaluate genotype concordance or claim casework fitness.",
};

export default async function VerifiedPage() {
  const index = await getVerifiedIndex();
  return <VerifiedList index={index} />;
}
