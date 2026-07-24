"use client";

/**
 * The level-2 request screen. Two states, and which one you get is not up to us:
 *
 *  - eligible   → the engine found an environment ceiling. Explain it, show the
 *                 reason code, and hand over a prefilled contact email.
 *  - otherwise  → the free path still applies. Say so plainly and point at the
 *                 free help channel. No "ask anyway" affordance: the paid tier
 *                 is not something to be talked into.
 *
 * Contact-only by design (decision 1a): no payment or ticket state lives in the
 * platform, so the certificate stays the only artifact the site ever publishes.
 */
import Link from "next/link";
import { ArrowLeft, LifeBuoy, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { SiteFooter } from "@/components/site-footer";
import { PageTitle } from "@/components/page-title";
import { manualRequestMailto, reasonI18nKey } from "@/lib/verified/manual";
import type { VerifiedManualVerification } from "@/types/verified";

const CONTACT_EMAIL = "contact@strhub.app";
// Read from env rather than `window.location`: this renders on the server first,
// and a value that only exists after hydration would mismatch the mailto href.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://strhub.io";

export function VerifiedManualRequest({
  slug,
  toolName,
  manual,
  ciRun,
}: {
  slug: string;
  toolName: string;
  /** Null whenever the report is missing, or was checked and did not qualify. */
  manual: VerifiedManualVerification | null;
  ciRun?: string;
}) {
  const { t } = useLanguage();

  const backHref = slug ? `/verified/${encodeURIComponent(slug)}` : "/verified";

  const key = manual ? reasonI18nKey(manual.reason_code) : null;
  const translated = key ? t(key) : null;
  // Fall back to the engine's English when a reason id has no string yet, so a
  // new engine rule degrades to plain text rather than a raw i18n key.
  const reason =
    translated && key && translated !== key ? translated : manual?.reason ?? "";

  const mailto = manual
    ? manualRequestMailto({
        email: CONTACT_EMAIL,
        slug,
        toolName,
        manual,
        ciRun,
        reportUrl: `${SITE_URL}/verified/${slug}`,
        subjectLabel: t("verified.manual.mailSubject"),
        bodyIntro: t("verified.manual.mailIntro"),
      })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-3xl px-4 py-8 md:px-0">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {slug ? t("verified.manual.backToReport") : t("verified.backToList")}
        </Link>

        <div className="mt-4">
          <PageTitle title={t("verified.manual.pageTitle")} />
        </div>

        {manual ? (
          <>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              {t("verified.manual.pageSubtitle")}
            </p>

            <section className="mt-6 rounded-xl border border-border bg-gradient-to-br from-card to-card/50 p-6 shadow-sm dark:border-white/10">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <LifeBuoy className="h-5 w-5 text-muted-foreground" />
                {t("verified.manual.whyHeading")}
              </h2>
              <p className="mt-3 text-sm">{reason}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                {t("verified.manual.notAFault")}
              </p>
              <dl className="mt-4 grid gap-x-6 gap-y-1 text-xs text-muted-foreground sm:grid-cols-[auto_1fr]">
                {/* Absent on the pre-flight path: there is no attestation yet,
                    which is the whole point of catching it before the run. */}
                {slug && (
                  <>
                    <dt>{t("verified.manual.toolLabel")}</dt>
                    <dd className="font-medium text-foreground">
                      {toolName} <span className="font-normal">({slug})</span>
                    </dd>
                  </>
                )}
                <dt>{t("verified.manual.reasonCodeLabel")}</dt>
                <dd>
                  <code className="rounded bg-muted px-1 py-0.5 text-foreground">
                    {manual.reason_code}
                  </code>{" "}
                  ({manual.basis})
                </dd>
              </dl>
            </section>

            <section className="mt-6 rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold">
                {t("verified.manual.whatYouGetHeading")}
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>{t("verified.manual.whatYouGet1")}</li>
                <li>{t("verified.manual.whatYouGet2")}</li>
                <li>{t("verified.manual.whatYouGet3")}</li>
              </ul>
              {mailto && (
                <a
                  href={mailto}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  <Mail className="h-4 w-4" />
                  {t("verified.manual.emailCta")}
                </a>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                {t("verified.manual.emailHint")}
              </p>
            </section>
          </>
        ) : (
          /* Not eligible — the free, automated path still applies. This is the
             common case for someone who arrived by editing the URL or who is
             stuck on the form, and it must not read as a rejection. */
          <section className="mt-6 rounded-xl border border-border bg-muted/40 p-6">
            <h2 className="text-lg font-semibold">
              {t("verified.manual.notEligibleHeading")}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("verified.manual.notEligibleBody")}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("verified.manual.freeHelp")}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/verified/submit"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                {t("verified.submit.cta")}
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  t("verified.manual.helpMailSubject"),
                )}`}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                <Mail className="h-4 w-4" />
                {t("verified.manual.freeHelpCta")}
              </a>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
