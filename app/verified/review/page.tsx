import type { Metadata } from "next";
import { VerifiedStart } from "@/components/verified/verified-start";

export const metadata: Metadata = {
  title: { absolute: "Check a tool for a paper review | STRhub Verified" },
  description:
    "Paste the repository a manuscript cites and get a plain answer in minutes: does it install and run as documented? No code, no account, nothing published.",
};

export default function VerifiedReviewPage() {
  return <VerifiedStart role="reviewer" />;
}
