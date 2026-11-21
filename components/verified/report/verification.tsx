"use client";

import { Check, Minus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { useHeaded } from "./certificate";
import { cn } from "@/lib/utils";
import type { VerifiedMatrixLeg } from "@/types/verified";
import type { DatasetProvenance } from "@/lib/verified/dataset-provenance";

type StageOutcome = "pass" | "fail" | "not_attempted" | "not_established";

function stageStatuses(gates?: Record<string, boolean>, verdictCode?: string): { key: string; state: StageOutcome }[] {
  const g = gates ?? {};
  const avail = Boolean(g.available);
  const inst = Boolean(g.installs);
  const runs = Boolean(g.runs);
  const out = Boolean(g.io || g.content);
  if (verdictCode === "undetermined") {
    return [
      { key: "verified.whatVerified.sourceAvailable", state: avail ? "pass" : "fail" },
      { key: "verified.whatVerified.installation", state: inst ? "pass" : "not_attempted" },
      { key: "verified.whatVerified.execution", state: runs ? "pass" : "not_attempted" },
      { key: "verified.whatVerified.outputGenerated", state: out ? "pass" : runs ? "not_established" : "not_attempted" },
    ];
  }
  return [
    { key: "verified.whatVerified.sourceAvailable", state: avail ? "pass" : "fail" },
    { key: "verified.whatVerified.installation", state: !avail ? "not_attempted" : inst ? "pass" : "fail" },
    { key: "verified.whatVerified.execution", state: !inst ? "not_attempted" : runs ? "pass" : "fail" },
    { key: "verified.whatVerified.outputGenerated", state: !runs ? "not_attempted" : out ? "pass" : "fail" },
  ];
}

/** Real stage status derived from `gates` alongside what is outside scope. */
export function WhatWasVerified({
  gates,
  verdictCode,
}: {
  gates?: Record<string, boolean>;
  verdictCode?: string;
}) {
  const { t } = useLanguage();
  const stages = stageStatuses(gates, verdictCode);
  return (
    <div className="mt-6 rounded-lg border bg-card p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-base">
        <div>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
            {t("verified.whatVerified.verifiedHeading")}
          </p>
          {stages.map(({ key, state }) => (
            <div key={key} className="flex items-center justify-between gap-2 py-0.5">
              <span className="flex items-center gap-2">
                {state === "pass" ? (
                  <Check className="h-4 w-4 text-teal-600 shrink-0" />
                ) : state === "fail" ? (
                  <X className="h-4 w-4 text-red-600 shrink-0" />
                ) : (
                  <Minus className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                )}
                <span className="text-muted-foreground">{t(key)}</span>
              </span>
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-wide shrink-0",
                  state === "pass"
                    ? "text-teal-700 dark:text-teal-400"
                    : state === "fail"
                      ? "text-red-700 dark:text-red-400"
                      : "text-muted-foreground",
                )}
              >
                {state === "pass"
                  ? t("verified.gate.state.pass")
                  : state === "fail"
                    ? t("verified.gate.state.fail")
                    : state === "not_established"
                      ? t("verified.matrix.notEstablished")
                      : t("verified.matrix.notAttempted")}
              </span>
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {t("verified.whatVerified.notHeading")}
          </p>
          {[
            "verified.whatVerified.accuracy",
            "verified.whatVerified.concordance",
            "verified.whatVerified.forensicValidity",
            "verified.whatVerified.regulatory",
          ].map((key) => (
            <div key={key} className="flex items-center gap-2 py-0.5">
              <Minus className="h-4 w-4 text-muted-foreground/50 shrink-0" />
              <span className="text-muted-foreground/70">{t(key)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** One row per leg: the tool's own data, and STRhub's reference sample. */
export function VerificationMatrix({
  legs,
  installsPassed = true,
  verdictCode,
}: {
  legs: VerifiedMatrixLeg[];
  installsPassed?: boolean;
  verdictCode?: string;
}) {
  const { t } = useLanguage();
  const visible = legs.filter((leg) => leg.fixture_source !== "strhub");
  if (visible.length === 0) return null;
  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.matrix.heading")}</h2>)}
      <div className="mt-3 divide-y rounded-lg border">
        {visible.map((leg) => {
          const state = !installsPassed
            ? "not_attempted"
            : !leg.available
              ? "na"
              : leg.passed
                ? "pass"
                : verdictCode === "undetermined"
                  ? "not_established"
                  : "fail";
          return (
            <div key={leg.leg} className="flex items-center gap-3 px-4 py-3.5 text-base">
              <span
                className={cn(
                  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  state === "pass"
                    ? "bg-teal-600 text-white"
                    : state === "fail"
                      ? "bg-amber-500 text-white"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {state === "pass" ? <Check className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
              </span>
              <span className="font-semibold text-foreground">
                {leg.leg === "own"
                  ? t("verified.matrix.own")
                  : leg.leg === "external"
                    ? t("verified.matrix.external")
                    : leg.label}
              </span>
              {leg.dataset && (
                <span className="truncate text-sm text-muted-foreground">{leg.dataset}</span>
              )}
              <div className="ml-auto shrink-0 pl-2">
                {state === "pass" && (
                  <Badge variant="outline" className="border-teal-600/30 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300 font-semibold text-xs sm:text-sm">
                    {t("verified.gate.state.pass")}
                  </Badge>
                )}
                {state === "fail" && (
                  <Badge variant="outline" className="border-amber-500/40 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-semibold text-xs sm:text-sm">
                    {t("verified.gate.state.fail")}
                  </Badge>
                )}
                {state === "not_attempted" && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal text-xs sm:text-sm">
                    {t("verified.matrix.notAttempted")}
                  </Badge>
                )}
                {state === "not_established" && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal text-xs sm:text-sm">
                    {t("verified.matrix.notEstablished")}
                  </Badge>
                )}
                {state === "na" && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal text-xs sm:text-sm">
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

/** Which public sample the tool was run on (or selected for), and the loci that sample covers. */
export function VerificationData({
  provenance,
  hasStrhubFixture,
  installsPassed = true,
}: {
  provenance: (DatasetProvenance & { type: string })[];
  hasStrhubFixture: boolean;
  installsPassed?: boolean;
}) {
  const { t } = useLanguage();
  if (provenance.length === 0 && !hasStrhubFixture) return null;
  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.data.heading")}</h2>)}
      <p className="mt-1 text-base text-muted-foreground leading-relaxed">
        {installsPassed ? t("verified.data.note") : t("verified.data.noteNotRun")}
      </p>

      {hasStrhubFixture && (
        <p className="mt-3 text-base text-muted-foreground rounded-lg border border-border bg-muted/40 px-4 py-3 leading-relaxed">
          {installsPassed ? t("verified.data.noOwnData") : t("verified.data.noOwnDataNotRun")}
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
              <div key={ds.type} className="rounded-lg border bg-card p-5">
                <p className="text-base font-semibold">{localizedName}</p>
                <dl className="mt-2.5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
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
                    <p className="text-sm text-muted-foreground mb-1">
                      {ds.loci.length} {t("verified.data.lociCount")}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground/80 leading-relaxed">
                      {ds.loci.join(", ")}
                    </p>
                  </dd>
                </dl>
              </div>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t("verified.data.lociScope")}</p>
        </>
      )}
    </>
  );
}
