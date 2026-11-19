import type { Metadata } from "next";
import { VerifiedRequirements } from "@/components/verified/verified-requirements";

export const metadata: Metadata = {
  title: { absolute: "Documentation requirements | STRhub Verified" },
  description:
    "Minimum documentation requirements for automated verification in STRhub Verified, plus the manual review option.",
};

export default function VerifiedRequirementsPage() {
  return <VerifiedRequirements />;
}
