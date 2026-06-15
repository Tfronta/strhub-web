import type { Metadata } from "next";
import { VerifiedSubmitForm } from "@/components/verified/verified-submit-form";

export const metadata: Metadata = {
  title: "Verify a tool — STRhub Verified",
  description:
    "Self-service certification that your forensic STR tool installs and runs end-to-end on its public source at a pinned commit. STRhub stores no source code.",
};

export default function VerifiedSubmitPage() {
  return <VerifiedSubmitForm />;
}
