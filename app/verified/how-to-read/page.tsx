/**
 * Static explainer linked from every attestation. No report data, so it can be
 * fully cached, unlike the per-tool pages.
 */
import type { Metadata } from "next";
import { VerifiedHowToRead } from "@/components/verified/verified-how-to-read";

export const metadata: Metadata = {
  title: "How to read a result — STRhub Verified",
  description:
    "What a STRhub Verified result records, what a result that stops early means, and which questions it can and cannot answer.",
};

export default function VerifiedHowToReadPage() {
  return <VerifiedHowToRead />;
}
