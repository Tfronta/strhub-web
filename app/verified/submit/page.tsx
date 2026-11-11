import type { Metadata } from "next";
import { VerifiedStart } from "@/components/verified/verified-start";

export const metadata: Metadata = {
  title: { absolute: "Verify a tool | STRhub Verified" },
  description:
    "Enter a public GitHub repository to check whether STRhub can run the documented procedure at a pinned commit. Results stay outside the public catalogue.",
};

export default function VerifiedSubmitPage({
  searchParams,
}: {
  searchParams: { repo?: string | string[] };
}) {
  // "Test another version" on a report arrives with the repository chosen.
  const repo = Array.isArray(searchParams.repo) ? searchParams.repo[0] : searchParams.repo;
  return <VerifiedStart role="owner" initialRepo={repo?.trim() ?? ""} />;
}
