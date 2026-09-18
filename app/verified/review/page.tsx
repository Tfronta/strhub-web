import type { Metadata } from "next";
import { VerifiedStart } from "@/components/verified/verified-start";

export const metadata: Metadata = {
  title: { absolute: "Check a tool for a paper review | STRhub Verified" },
  description:
    "Paste the repository a manuscript cites and get a plain answer in minutes: does it install and run as documented? No code, no account, nothing published.",
};

export default function VerifiedReviewPage({
  searchParams,
}: {
  searchParams: { repo?: string | string[] };
}) {
  // "Test another version" on a report arrives with the repository chosen.
  const repo = Array.isArray(searchParams.repo) ? searchParams.repo[0] : searchParams.repo;
  return <VerifiedStart role="reviewer" initialRepo={repo?.trim() ?? ""} />;
}
