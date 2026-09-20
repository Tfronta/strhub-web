"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}: {
  gates: Record<VerifiedLevel, boolean> | undefined;
  extraRows?: ExtraGateRow[];
}) {
  const { t } = useLanguage();
  const st = gateStates(gates, VERIFIED_GATES.map((g) => g.key));
  const failed = VERIFIED_GATES.filter((g) => !gates?.[g.key]);
  const onlyContent = failed.length === 1 && failed[0].key === "content";

  return (
    <>
      {!useHeaded() && (<h2 className="mt-10 text-xl font-semibold">{t("verified.gates")}</h2>)}
      <div className="mt-3 divide-y rounded-lg border">
        {VERIFIED_GATES.map((g) => {
          const state = st[g.key];
          return (
            <div key={g.key} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span
                className={cn(
                  "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  state === "pass"
                    ? "bg-teal-600 text-white"
                    : state === "stopped"
                      ? "bg-red-600 text-white"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {state === "pass" ? <Check className="h-3 w-3" />
                  : state === "stopped" ? <X className="h-3 w-3" />
                    : <Minus className="h-3 w-3" />}
              </span>
              <span className="font-medium whitespace-nowrap">{g.label}</span>
              <span className="text-muted-foreground">
                {t(g.meaningKey)}
                {state === "stopped" && (
                  <span className="ml-2 font-medium text-red-700 dark:text-red-400">{t("verified.gate.stoppedHere")}</span>
                )}
                {state === "not-reached" && (
                  <span className="ml-2 italic">{t("verified.gate.notReached")}</span>
                )}
              </span>
            </div>
          );
        })}
        {extraRows.map((r) => (
          <div key={r.key} className="flex items-center gap-3 px-4 py-2.5 text-sm">
            <span
              className={cn(
                "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                r.passed ? "bg-teal-600 text-white" : "bg-muted text-muted-foreground",
              )}
            >
              {r.passed ? <Check className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            </span>
            <span className="font-medium whitespace-nowrap">{r.label}</span>
            <span className="text-muted-foreground">{r.meaning}</span>
          </div>
        ))}
      </div>

      {/* A run that stopped before the top step used to say nothing at all
          unless it was the content gate specifically. A reviewer then read the
          ladder as a verdict on the software, which is the one thing it is not
          entitled to be. */}
      {failed.length > 0 && (
        <p className="mt-3 text-sm text-muted-foreground italic rounded-lg border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-950/20 px-4 py-3">
          {t(onlyContent ? "verified.gate.contentFailNote" : "verified.gate.stoppedEarlyNote")}{" "}
          <Link
            href="/verified/how-to-read"
            className="not-italic font-medium text-foreground underline underline-offset-2"
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
