"use client";

import { ExternalLink, Flag, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedReport } from "@/types/verified";
import { buildDisputeLink } from "@/lib/verified/dispute";
import { attestationContactMailto, CONTACT_EMAIL } from "@/lib/verified/contact";

/** What the result does and does not claim, at the foot of every report. */
export function ScopeBlock({ scope }: { scope: string }) {
  const { t } = useLanguage();
  return (
    <>
      <h2 className="mt-10 text-xl font-semibold">{t("verified.scope")}</h2>
      <div className="mt-3 rounded-lg border-l-4 border-teal-600 bg-muted/50 p-4 text-sm">
        <p>{scope}</p>
        <p className="mt-3 text-muted-foreground">{t("verified.scopeNote")}</p>
      </div>
    </>
  );
}

/**
 * The other half of the evidence links: a reader who opens one and finds it
 * does not say what STRhub claims needs a way to say so. It files against
 * STRhub's own repository, not the tool's — this questions what STRhub
 * published — and it only prefills GitHub's form; nothing is sent from here.
 *
 * The issue is public and needs a GitHub account, which is right for a
 * disputed claim and wrong for everyone else: a reviewer with a question, an
 * author who would rather write first. The second line is for them, and it is
 * the address itself, so a reader without a mail client can still copy it.
 */
export function DisputeCard({
  report,
  slug,
  staticPageUrl,
}: {
  report: VerifiedReport;
  slug: string;
  staticPageUrl: string;
}) {
  const { t } = useLanguage();
  const dispute = buildDisputeLink(report, slug, staticPageUrl);
  const mailto = attestationContactMailto(report, slug, staticPageUrl, t("verified.dispute.mailSubject"));
  return (
    <div className="mt-6 rounded-lg border bg-muted/40 p-4">
      <h2 className="text-sm font-semibold">{t("verified.dispute.heading")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("verified.dispute.note")}</p>
      {dispute.url && !dispute.tooLong && (
        <>
          <a
            href={dispute.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Flag className="h-3.5 w-3.5" />
            {t("verified.dispute.cta")}
            <ExternalLink className="h-3 w-3" />
          </a>
          <p className="mt-1.5 text-xs text-muted-foreground">{t("verified.dispute.hint")}</p>
        </>
      )}
      <p className="mt-3 border-t pt-3 text-sm text-muted-foreground">
        {t("verified.dispute.orEmail")}{" "}
        <a href={mailto} className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
          <Mail className="h-3.5 w-3.5" />
          {CONTACT_EMAIL}
        </a>
      </p>
    </div>
  );
}
