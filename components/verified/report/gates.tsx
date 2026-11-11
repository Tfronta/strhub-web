"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}: {
  gates: Record<VerifiedLevel, boolean> | undefined;
  extraRows?: ExtraGateRow[];
  blockedAt?: VerifiedLevel;
}) {
  const { t } = useLanguage();
  const st = gateStates(gates, VERIFIED_GATES.map((g) => g.key), blockedAt);
  const failed = VERIFIED_GATES.filter((g) => !gates?.[g.key]);
  const onlyContent = failed.length === 1 && failed[0].key === "content";
  const startsRow = extraRows.find((r) => r.key === "starts");
  const trailingExtraRows = extraRows.filter((r) => r.key !== "starts");

  const renderExtraRow = (r: ExtraGateRow) => (
    <div key={r.key} className="flex items-center gap-3 px-4 py-3 text-sm">
      <span
        className={cn(
          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
          r.passed ? "bg-teal-600 text-white" : "bg-muted text-muted-foreground",
        )}
      >
        {r.passed ? <Check className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
      </span>
      <span className="font-semibold whitespace-nowrap text-foreground">{r.label}</span>
      <span className="text-muted-foreground">{r.meaning}</span>
      <div className="ml-auto shrink-0 pl-2">
        {r.passed ? (
          <Badge variant="outline" className="border-teal-600/30 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300 font-semibold text-xs">
            {t("verified.gate.state.pass")}
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal text-xs">
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
            <div key={g.key} className="flex items-center gap-3 px-4 py-3 text-sm">
              <span
                className={cn(
                  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
                  state === "pass"
                    ? "bg-teal-600 text-white"
                    : state === "stopped"
                      ? "bg-red-600 text-white"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {state === "pass" ? <Check className="h-3.5 w-3.5" />
                  : state === "stopped" ? <X className="h-3.5 w-3.5" />
                    : <Minus className="h-3.5 w-3.5" />}
              </span>
              <span className="font-semibold whitespace-nowrap text-foreground">{t(g.labelKey)}</span>
              <span className="text-muted-foreground">
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
                  <Badge variant="outline" className="border-teal-600/30 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300 font-semibold text-xs">
                    {t("verified.gate.state.pass")}
                  </Badge>
                )}
                {state === "stopped" && (
                  <Badge variant="destructive" className="bg-red-600 text-white dark:bg-red-700 font-semibold text-xs">
                    {t("verified.gate.state.fail")}
                  </Badge>
                )}
                {state === "not-reached" && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal text-xs">
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

      {/* A run that stopped before the top step used to say nothing at all
          unless it was the content gate specifically. A reviewer then read the
          ladder as a verdict on the software, which is the one thing it is not
          entitled to be. */}
      {failed.length > 0 && !blockedAt && (
        <p className="mt-3 text-sm text-muted-foreground rounded-lg border border-border bg-muted/40 px-4 py-3">
          {t(onlyContent ? "verified.gate.contentFailNote" : "verified.gate.stoppedEarlyNote")}{" "}
          <Link
            href="/verified/how-to-read"
            className="font-medium text-foreground underline underline-offset-2"
          >
            {t("verified.gate.howToReadLink")}
          </Link>
        </p>
      )}
    </>
  );
}

/** A run's logs: either a link to the published file, or the text itself. */
export interface ReportLog {
  leg: string;
  label: string;
  href?: string;
  text?: string;
}

/**
 * The execution logs. A published report links each file on gh-pages; a trial
 * carries the text inside its artifact, so the same list opens it inline.
 */
export function LogLinks({ logs }: { logs: ReportLog[] }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState<string | null>(null);
  if (logs.length === 0) return null;
  const inline = logs.filter((l) => l.text !== undefined);
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-3">
        {logs.map((l) =>
          l.href ? (
            <a
              key={l.leg}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t("verified.log.view")}
              {logs.length > 1 ? ` (${l.label})` : ""}
            </a>
          ) : (
            <Button
              key={l.leg}
              variant={open === l.leg ? "default" : "outline"}
              size="sm"
              onClick={() => setOpen(open === l.leg ? null : l.leg)}
            >
              {t("verified.log.view")}
              {inline.length > 1 ? ` (${l.label})` : ""}
            </Button>
          ),
        )}
      </div>
      {open && (
        <pre className="mt-3 max-h-96 overflow-auto rounded-md bg-muted p-3 text-xs">
          <code>{logs.find((l) => l.leg === open)?.text}</code>
        </pre>
      )}
    </div>
  );
}
