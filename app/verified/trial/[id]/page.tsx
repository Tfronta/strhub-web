import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VerifiedTrial } from "@/components/verified/verified-trial";
import { TRIAL_ID_RE, TRIAL_ROLES, type TrialRole } from "@/lib/verified/trial";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Test run | STRhub Verified" },
  robots: { index: false, follow: false },
};

export default function VerifiedTrialPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { as?: string };
}) {
  if (!TRIAL_ID_RE.test(params.id)) notFound();
  const as = searchParams.as ?? "";
  const role: TrialRole = (TRIAL_ROLES as readonly string[]).includes(as) ? (as as TrialRole) : "reviewer";
  return <VerifiedTrial id={params.id} role={role} />;
}
