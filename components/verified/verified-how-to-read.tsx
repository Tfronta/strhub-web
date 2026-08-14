"use client";

/**
 * The destination behind "How to read this result".
 *
 * Written for a reviewer assessing a manuscript, not for a programmer: no
 * container, no dependency solver, no version pins. The report itself already
 * carries the technical detail; what it could not carry, without turning into a
 * thesis, is what a result below the top step does and does not mean.
 */
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { SiteFooter } from "@/components/site-footer";

export function VerifiedHowToRead() {
  const { t } = useLanguage();

  // can6/cannot6 are the two halves of the same question. A report says who
  // submitted a tool, which is not the same as the tool's maintainer having
  // anything to do with it — and a reviewer who conflates the two reads the
  // whole page as carrying a weight it never claimed.
  const can = ["can1", "can2", "can3", "can4", "can5", "can6"];
  const cannot = ["cannot1", "cannot2", "cannot3", "cannot4", "cannot5", "cannot6"];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/verified"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("verified.backToList")}
        </Link>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          {t("verified.howToRead.title")}
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {t("verified.howToRead.lede")}
        </p>

        <h2 className="mt-10 text-xl font-semibold">
          {t("verified.howToRead.stoppedHeading")}
        </h2>
        <div className="mt-3 space-y-3 rounded-lg border-l-4 border-teal-600 bg-muted/50 px-4 py-3">
          <p className="text-sm leading-relaxed">
            {t("verified.howToRead.stoppedBody")}
          </p>
          <p className="text-sm leading-relaxed">
            {t("verified.howToRead.stoppedBody2")}
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold">
              {t("verified.howToRead.canHeading")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {can.map((k) => (
                <li key={k} className="flex gap-2">
                  <span aria-hidden="true" className="text-teal-600">
                    &bull;
                  </span>
                  <span>{t(`verified.howToRead.${k}`)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-base font-semibold">
              {t("verified.howToRead.cannotHeading")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {cannot.map((k) => (
                <li key={k} className="flex gap-2">
                  <span aria-hidden="true" className="text-muted-foreground">
                    &bull;
                  </span>
                  <span>{t(`verified.howToRead.${k}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h2 className="mt-10 text-xl font-semibold">
          {t("verified.howToRead.developerHeading")}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {t("verified.howToRead.developerBody")}
        </p>

        <p className="mt-10 border-t pt-6 text-sm text-muted-foreground leading-relaxed">
          {t("verified.scopeNote")}
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}
