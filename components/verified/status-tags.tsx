"use client";

import { Check, Minus, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import {
  classifyAuto,
  classifyManual,
  type AutoStatusSummary,
  type ManualStatusSummary,
  type StatusRowInput,
} from "@/lib/verified/status-summary";

const AUTO_STYLE: Record<AutoStatusSummary["kind"], string> = {
  pass: "border-teal-600/35 bg-teal-50/90 text-teal-900 dark:border-teal-500/40 dark:bg-teal-950/50 dark:text-teal-200",
  pass_errors: "border-amber-600/35 bg-amber-50/90 text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/50 dark:text-amber-200",
  fail: "border-red-600/35 bg-red-50/90 text-red-900 dark:border-red-500/40 dark:bg-red-950/50 dark:text-red-200",
  undetermined: "border-slate-400/40 bg-slate-100/80 text-slate-700 dark:border-slate-600/50 dark:bg-slate-800/60 dark:text-slate-300",
  out_of_scope: "border-slate-400/40 bg-slate-100/80 text-slate-700 dark:border-slate-600/50 dark:bg-slate-800/60 dark:text-slate-300",
  none: "border-slate-400/40 bg-slate-100/80 text-slate-700 dark:border-slate-600/50 dark:bg-slate-800/60 dark:text-slate-300",
};

const MANUAL_STYLE: Record<ManualStatusSummary["kind"], string> = {
  pass: "border-teal-600/35 bg-teal-50/90 text-teal-900 dark:border-teal-500/40 dark:bg-teal-950/50 dark:text-teal-200",
  pass_errors: "border-teal-500/35 bg-teal-50/75 text-teal-900 dark:border-teal-400/40 dark:bg-teal-950/45 dark:text-teal-200",
  fail: "border-amber-600/40 bg-amber-50/85 text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200",
};

function StatusIcon({
  state,
  className,
}: {
  state: "pass" | "fail" | "neutral";
  className?: string;
}) {
  if (state === "pass") return <Check className={cn("h-3 w-3 shrink-0 stroke-[2.5]", className)} aria-hidden />;
  if (state === "fail") return <X className={cn("h-3 w-3 shrink-0 stroke-[2.5]", className)} aria-hidden />;
  return <Minus className={cn("h-3 w-3 shrink-0 stroke-[2.5]", className)} aria-hidden />;
}

/**
 * Two-line Automatic / Manual status badges.
 * Line 1 always shows the Automatic (documented) verdict; Line 2 appears
 * only when a Manual verification exists for the tool or commit.
 */
export function VerificationStatusTags({
  autoRow,
  manualRow,
  size = "sm",
  className,
}: {
  autoRow: StatusRowInput | null | undefined;
  manualRow?: StatusRowInput | null;
  size?: "sm" | "md";
  className?: string;
}) {
  const { t } = useLanguage();
  const auto = classifyAuto(autoRow);
  const manual = classifyManual(manualRow);

  const pillSize =
    size === "md"
      ? "px-2.5 py-1 text-xs gap-1.5"
      : "px-2 py-0.5 text-[11px] gap-1.5";

  const autoIconState =
    auto.kind === "pass" || auto.kind === "pass_errors"
      ? "pass"
      : auto.kind === "fail"
        ? "fail"
        : "neutral";

  const autoOutcome = (() => {
    switch (auto.kind) {
      case "pass":
        return t("verified.statusTag.auto.pass", { passed: String(auto.gatesPassed), total: "5" });
      case "pass_errors":
        return t("verified.statusTag.auto.passErrors", { passed: String(auto.gatesPassed), total: "5" });
      case "fail":
        return t("verified.statusTag.auto.fail", { passed: String(auto.gatesPassed), total: "5" });
      case "undetermined":
        return t("verified.statusTag.auto.undetermined");
      case "out_of_scope":
        return t("verified.statusTag.auto.outOfScope");
      case "none":
        return t("verified.statusTag.auto.none");
    }
  })();

  const manualOutcome = manual
    ? (() => {
        switch (manual.kind) {
          case "pass":
            return t("verified.statusTag.manual.pass", { passed: String(manual.gatesPassed), total: "5" });
          case "pass_errors":
            return t("verified.statusTag.manual.passErrors", { passed: String(manual.gatesPassed), total: "5" });
          case "fail":
            return t("verified.statusTag.manual.fail", { passed: String(manual.gatesPassed), total: "5" });
        }
      })()
    : null;

  return (
    <div className={cn("flex flex-col items-start gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex items-center rounded-md border font-medium leading-tight tabular-nums max-w-full",
          pillSize,
          AUTO_STYLE[auto.kind],
        )}
      >
        <StatusIcon state={autoIconState} />
        <span className="truncate">
          <span className="font-semibold">{t("verified.statusTag.autoLabel")}</span>
          <span className="mx-1 opacity-55">·</span>
          <span>{autoOutcome}</span>
        </span>
      </span>

      {manual && manualOutcome && (
        <span
          className={cn(
            "inline-flex items-center rounded-md border font-medium leading-tight tabular-nums max-w-full",
            pillSize,
            MANUAL_STYLE[manual.kind],
          )}
        >
          <StatusIcon state={manual.kind === "fail" ? "fail" : "pass"} />
          <span className="truncate">
            <span className="font-semibold">{t("verified.statusTag.manualLabel")}</span>
            <span className="mx-1 opacity-55">·</span>
            <span>{manualOutcome}</span>
          </span>
        </span>
      )}
    </div>
  );
}
