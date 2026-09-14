import type { Metadata } from "next";
import { getVerifiedIndex } from "@/lib/verified";
import { VerifiedCheck } from "@/components/verified/verified-check";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Is it my setup, or the tool? | STRhub Verified" },
  description:
    "Compare with a clean environment that ran the tool, or rehearse it in one. Paste your error and STRhub says what kind it is.",
};

export default async function VerifiedCheckPage() {
  const index = await getVerifiedIndex();
  return <VerifiedCheck index={index} />;
}
