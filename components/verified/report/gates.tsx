"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Info, Minus, X, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { useHeaded } from "./certificate";
import { VERIFIED_GATES, type VerifiedLevel } from "@/types/verified";
import { gateStates } from "@/lib/verified/gate-state";
import { cn } from "@/lib/utils";

/** A rung outside the standard ladder, e.g. a trial's "reproduces own example". */
export interface ExtraGateRow {
  key: string;
  label: string;
  meaning: string;
  passed: boolean;
}

/**
 * The ladder. One rung is where the run stopped; the ones above it were never
 * attempted. Marking them alike made a single stop look like several failures.
 */
export function GatesLadder({
  gates,
  extraRows = [],
  blockedAt,
  hideHowToRead = false,
}: {
  gates: Record<VerifiedLevel, boolean> | undefined;
  extraRows?: ExtraGateRow[];
  blockedAt?: VerifiedLevel;
  /** Suppresses the automated-runner explainer box on manual verification reports. */
  hideHowToRead?: boolean;
}) {
  const { t } = useLanguage();
  const st = gateStates(gates, VERIFIED_GATES.map((g) => g.key), blockedAt);
  const failed = VERIFIED_GATES.filter((g) => !gates?.[g.key]);
  const onlyContent = failed.length === 1 && failed[0].key === "content";
  const startsRow = extraRows.find((r) => r.key === "starts");
  const trailingExtraRows = extraRows.filter((r) => r.key !== "starts");
  const [howOpen, setHowOpen] = useState(() => failed.length > 0);
  const canKeys = ["can1", "can2", "can3", "can4", "can5", "can6"] as const;
  const cannotKeys = ["cannot1", "cannot2", "cannot3", "cannot4", "cannot5", "cannot6"] as const;

  const renderExtraRow = (r: ExtraGateRow) => (
    <div key={r.key} className="flex items-center gap-3 px-4 py-3.5 text-base">
      <span
        className={cn(
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs",
          r.passed ? "bg-teal-600 text-white" : "bg-muted text-muted-foreground",
        )}
      >
        {r.passed ? <Check className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
      </span>
      <span className="font-semibold whitespace-nowrap text-foreground">{r.label}</span>
      <span className="text-muted-foreground">{r.meaning}</span>
      <div className="ml-auto shrink-0 pl-2">
        {r.passed ? (
          <Badge variant="outline" className="border-teal-600/30 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300 font-semibold text-xs sm:text-sm">
            {t("verified.gate.state.pass")}
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal text-xs sm:text-sm">
            {t("verified.gate.state.skipped")}
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.gates")}</h2>)}
      <div className="mt-3 divide-y rounded-lg border">
        {VERIFIED_GATES.flatMap((g) => {
          const state = st[g.key];
          const gateRow = (
            <div key={g.key} className="flex items-center gap-3 px-4 py-3.5 text-base">
              <span
                className={cn(
                  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs",
                  state === "pass"
                    ? "bg-teal-600 text-white"
                    : state === "stopped"
                      ? "bg-red-600 text-white"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {state === "pass" ? <Check className="h-4 w-4" />
                  : state === "stopped" ? <X className="h-4 w-4" />
                    : <Minus className="h-4 w-4" />}
              </span>
              <span className="font-semibold whitespace-nowrap text-foreground">{t(g.labelKey)}</span>
              <span className="text-muted-foreground leading-snug">
                {t(g.meaningKey)}
                {state === "stopped" && (
                  <span className="ml-2 font-medium text-red-700 dark:text-red-400">{t("verified.gate.stoppedHere")}</span>
                )}
                {state === "blocked" && (
                  <span className="ml-2 font-medium">{t("verified.gate.blockedHere")}</span>
                )}
                {state === "not-reached" && !blockedAt && (
                  <span className="ml-2 italic">{t("verified.gate.notReached")}</span>
                )}
              </span>
              <div className="ml-auto shrink-0 pl-2">
                {state === "pass" && (
                  <Badge variant="outline" className="border-teal-600/30 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300 font-semibold text-xs sm:text-sm">
                    {t("verified.gate.state.pass")}
                  </Badge>
                )}
                {state === "stopped" && (
                  <Badge variant="destructive" className="bg-red-600 text-white dark:bg-red-700 font-semibold text-xs sm:text-sm">
                    {t("verified.gate.state.fail")}
                  </Badge>
                )}
                {state === "not-reached" && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal text-xs sm:text-sm">
                    {t("verified.gate.state.skipped")}
                  </Badge>
                )}
                {state === "blocked" && (
                  <Badge variant="secondary" className="text-xs">
                    {t("verified.gate.state.blocked")}
                  </Badge>
                )}
              </div>
            </div>
          );
          if (g.key === "installs" && startsRow) {
            return [gateRow, renderExtraRow(startsRow)];
          }
          return [gateRow];
        })}
        {trailingExtraRows.map(renderExtraRow)}
      </div>

      {/* Inline "How to read this result": open by default whenever a gate failed
          so a reviewer immediately sees what the ladder does and does not establish
          without having to navigate away from the report. */}
      {!hideHowToRead && (
      <div className="mt-4 rounded-lg border border-teal-600/35 bg-muted/40 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            aria-expanded={howOpen}
            onClick={() => setHowOpen((v) => !v)}
            className="inline-flex items-center gap-2 text-left text-base font-semibold text-foreground hover:text-primary"
          >
            <Info className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
            <span>{t("verified.gate.howToReadLink")}</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", howOpen && "rotate-180")} />
          </button>
          <Link
            href="/verified/how-to-read"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("verified.gate.howToReadOpenFull")}
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {howOpen && (
          <div className="mt-3 space-y-4 border-t border-border/80 pt-4 text-base leading-relaxed">
            <p className="text-muted-foreground">
              {t(failed.length > 0 && onlyContent
                ? "verified.gate.contentFailNote"
                : failed.length > 0 && !blockedAt
                  ? "verified.gate.stoppedEarlyNote"
                  : "verified.howToRead.lede")}
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  {t("verified.howToRead.canHeading")}
                </h3>
                <ul className="mt-2 space-y-1.5 text-sm sm:text-base text-muted-foreground">
                  {canKeys.map((k) => (
                    <li key={k} className="flex gap-2">
                      <span aria-hidden="true" className="text-teal-600">&bull;</span>
                      <span>{t(`verified.howToRead.${k}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("verified.howToRead.cannotHeading")}
                </h3>
                <ul className="mt-2 space-y-1.5 text-sm sm:text-base text-muted-foreground">
                  {cannotKeys.map((k) => (
                    <li key={k} className="flex gap-2">
                      <span aria-hidden="true" className="text-muted-foreground">&bull;</span>
                      <span>{t(`verified.howToRead.${k}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </>
  );
}
