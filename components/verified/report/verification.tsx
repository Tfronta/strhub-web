"use client";

import { Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { useHeaded } from "./certificate";
import { cn } from "@/lib/utils";
import type { VerifiedMatrixLeg } from "@/types/verified";
import type { DatasetProvenance } from "@/lib/verified/dataset-provenance";

/** What the badge does and does not claim, side by side. Static by design. */
export function WhatWasVerified() {
  const { t } = useLanguage();
  return (
    <div className="mt-6 rounded-lg border bg-card p-5">
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
            {t("verified.whatVerified.verifiedHeading")}
          </p>
          {[
            "verified.whatVerified.sourceAvailable",
            "verified.whatVerified.installation",
            "verified.whatVerified.execution",
            "verified.whatVerified.outputGenerated",
          ].map((key) => (
            <div key={key} className="flex items-center gap-1.5 py-0.5">
              <Check className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span className="text-muted-foreground">{t(key)}</span>
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {t("verified.whatVerified.notHeading")}
          </p>
          {[
            "verified.whatVerified.accuracy",
            "verified.whatVerified.concordance",
            "verified.whatVerified.forensicValidity",
            "verified.whatVerified.regulatory",
          ].map((key) => (
            <div key={key} className="flex items-center gap-1.5 py-0.5">
              <Minus className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
              <span className="text-muted-foreground/70">{t(key)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** One row per leg: the tool's own data, and STRhub's reference sample. */
export function VerificationMatrix({ legs }: { legs: VerifiedMatrixLeg[] }) {
  const { t } = useLanguage();
  const visible = legs.filter((leg) => leg.fixture_source !== "strhub");
  if (visible.length === 0) return null;
  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.matrix.heading")}</h2>)}
      <div className="mt-3 divide-y rounded-lg border">
        {visible.map((leg) => {
          const state = !leg.available ? "na" : leg.passed ? "pass" : "fail";
          return (
            <div key={leg.leg} className="flex items-center gap-3 px-4 py-3 text-sm">
              <span
                className={cn(
                  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  state === "pass"
                    ? "bg-teal-600 text-white"
                    : state === "fail"
                      ? "bg-amber-500 text-white"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {state === "pass" ? <Check className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
              </span>
              <span className="font-semibold text-foreground">
                {leg.leg === "own"
                  ? t("verified.matrix.own")
                  : leg.leg === "external"
                    ? t("verified.matrix.external")
                    : leg.label}
              </span>
              {leg.dataset && (
                <span className="truncate text-xs text-muted-foreground">{leg.dataset}</span>
              )}
              <div className="ml-auto shrink-0 pl-2">
                {state === "pass" && (
                  <Badge variant="outline" className="border-teal-600/30 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300 font-semibold text-xs">
                    {t("verified.gate.state.pass")}
                  </Badge>
                )}
                {state === "fail" && (
                  <Badge variant="outline" className="border-amber-500/40 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-semibold text-xs">
                    {t("verified.gate.state.fail")}
                  </Badge>
                )}
                {state === "na" && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal text-xs">
                    {t("verified.matrix.na")}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/** Which public sample the tool was run on, and the loci that sample covers. */
export function VerificationData({
  provenance,
  hasStrhubFixture,
}: {
  provenance: (DatasetProvenance & { type: string })[];
  hasStrhubFixture: boolean;
}) {
  const { t } = useLanguage();
  if (provenance.length === 0 && !hasStrhubFixture) return null;
  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.data.heading")}</h2>)}
      <p className="mt-1 text-sm text-muted-foreground">{t("verified.data.note")}</p>

      {hasStrhubFixture && (
        <p className="mt-3 text-sm text-muted-foreground rounded-lg border border-border bg-muted/40 px-4 py-3">
          {t("verified.data.noOwnData")}
        </p>
      )}

      {provenance.length > 0 && (
        <>
          <div className="mt-3 space-y-3">
            {provenance.map((ds) => {
              const nameKey = `verified.data.provenance.${ds.type}.name`;
              const licKey = `verified.data.provenance.${ds.type}.license`;
              const localizedName = t(nameKey) !== nameKey ? t(nameKey) : ds.name;
              const localizedLicense = t(licKey) !== licKey ? t(licKey) : ds.license;
              return (
              <div key={ds.type} className="rounded-lg border bg-card p-4">
                <p className="text-sm font-semibold">{localizedName}</p>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                  <dt className="text-muted-foreground">{t("verified.data.source")}</dt>
                  <dd>
                    <a
                      href={ds.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {ds.source}
                    </a>
                  </dd>
                  {ds.doi && (
                    <>
                      <dt className="text-muted-foreground">{t("verified.data.doi")}</dt>
                      <dd>
                        <a
                          href={`https://doi.org/${ds.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {ds.doi}
                        </a>
                      </dd>
                    </>
                  )}
                  <dt className="text-muted-foreground">{t("verified.data.license")}</dt>
                  <dd className="text-muted-foreground">{localizedLicense}</dd>
                  {ds.referenceGenome && (
                    <>
                      <dt className="text-muted-foreground">{t("verified.data.refGenome")}</dt>
                      <dd>
                        <span className="font-medium">{ds.referenceGenome.assembly}</span>
                        <span className="text-muted-foreground ml-2">({ds.referenceGenome.mountPath})</span>
                      </dd>
                    </>
                  )}
                  <dt className="text-muted-foreground pt-1">{t("verified.data.lociTested")}</dt>
                  <dd className="pt-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      {ds.loci.length} {t("verified.data.lociCount")}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground/70 leading-relaxed">
                      {ds.loci.join(", ")}
                    </p>
                  </dd>
                </dl>
              </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{t("verified.data.lociScope")}</p>
        </>
      )}
    </>
  );
}
