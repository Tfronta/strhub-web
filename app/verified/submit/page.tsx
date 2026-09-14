import type { Metadata } from "next";
import { VerifiedStart } from "@/components/verified/verified-start";

export const metadata: Metadata = {
  title: { absolute: "Verify a tool | STRhub Verified" },
  description:
    "Paste a public repository. STRhub works out how to install and run the tool, rehearses it in a clean environment, and publishes nothing until you say so.",
};

export default function VerifiedSubmitPage() {
  return <VerifiedStart role="owner" />;
}
