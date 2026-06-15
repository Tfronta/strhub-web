import type { Metadata } from "next";
import { getVerifiedIndex } from "@/lib/verified";
import { VerifiedList } from "@/components/verified/verified-list";

// Attestations are static snapshots; refresh at most hourly.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "STRhub Verified — Reproducible-execution attestations",
  description:
    "Independent, automated attestations that forensic STR tools install and run end-to-end, producing plausible output — verified on public source at a pinned commit.",
};

export default async function VerifiedPage() {
  const index = await getVerifiedIndex();
  return <VerifiedList index={index} />;
}
