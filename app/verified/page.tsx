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
    "Independent, automated attestations of documented execution. We verify whether an STR tool installs and runs end-to-end strictly following the instructions in its public repository, in a clean and reproducible environment. Our purpose is to help authors and users identify documentation or environment friction to collaborate on fixes. Does not evaluate genotype concordance nor constitute evidence for forensic casework fitness.",
};

export default async function VerifiedPage() {
  const index = await getVerifiedIndex();
  return <VerifiedList index={index} />;
}
