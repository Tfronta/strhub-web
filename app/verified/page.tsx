import type { Metadata } from "next";
import { getVerifiedIndex } from "@/lib/verified";
import { VerifiedList } from "@/components/verified/verified-list";

// Same reason as the detail page: these cards show each tool's badge level,
// locus count and read total, so an ISR window makes the catalogue assert a
// superseded result about a named tool.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "STRhub Verified — Reproducible-execution attestations",
  description:
    "Independent, automated attestations that forensic STR tools install and run end-to-end, producing plausible output — verified on public source at a pinned commit.",
};

export default async function VerifiedPage() {
  const index = await getVerifiedIndex();
  return <VerifiedList index={index} />;
}
