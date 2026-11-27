"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Copy, Terminal } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedReport } from "@/types/verified";
import type { TerminalOutputSummary } from "@/lib/verified/output-evidence";
import { cn } from "@/lib/utils";
import { ConclusionBox } from "./certificate";
import { EvidenceList } from "./findings";
import { RecordedTerminal, type ReportLog } from "./terminal";

function AnnexCodeCard({
  label,
  code,
  note,
}: {
  label: string;
  code: string;
  note?: string;
}) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="rounded-lg border bg-background p-4 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" aria-hidden />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          )}
          <span>
            {copied
              ? t("verified.strhubDid.copiedCommand")
              : t("verified.strhubDid.copyCommand")}
          </span>
        </button>
      </div>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
      <pre className="max-h-72 overflow-auto rounded-md border bg-muted p-3 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function TechnicalAnnex({
  report,
  strictLogs,
  assistedLogs,
  preferredStrictLeg,
  installBlocked,
  strictOutputSummary,
  assistedOutputSummary,
  outputSectionHref,
  strictDockerfile,
  repoDockerfile,
  localizedCaveats,
  conclusionItems,
  defaultOpen = false,
}: {
  report: VerifiedReport;
  strictLogs: ReportLog[];
  assistedLogs: ReportLog[];
  preferredStrictLeg: string;
  installBlocked: boolean;
  strictOutputSummary?: TerminalOutputSummary | null;
  assistedOutputSummary?: TerminalOutputSummary | null;
  outputSectionHref?: string;
  strictDockerfile?: string;
  repoDockerfile?: boolean;
  localizedCaveats?: string[];
  conclusionItems?: { title: string; body: string }[];
  defaultOpen?: boolean;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    function checkHash() {
      if (typeof window === "undefined") return;
      const h = window.location.hash;
      if (
        h === "#verified-technical-annex" ||
        h === "#verified-annex-run1" ||
        h === "#verified-annex-run2"
      ) {
        setOpen(true);
      }
    }
    function onOpenEvent() {
      setOpen(true);
    }
    checkHash();
    window.addEventListener("hashchange", checkHash);
    window.addEventListener("strhub:open-annex", onOpenEvent);
    return () => {
      window.removeEventListener("hashchange", checkHash);
      window.removeEventListener("strhub:open-annex", onOpenEvent);
    };
  }, []);

  const strictCmd = report.run?.effective_cmd || report.run?.cmd || "";
  const stepOutcome = report.run?.step_outcome;
  const strictCmdNote =
    stepOutcome === "success"
      ? t("verified.commandEvidence.success")
      : stepOutcome === "failure"
        ? t("verified.commandEvidence.failure")
        : stepOutcome === "skipped"
          ? t("verified.commandEvidence.skipped")
          : undefined;

  const assisted = report.assisted_run;
  const assistedVc = assisted?.verified_commands;
  const preferredAssistedLeg =
    assisted?.gates?.installs === false ? "assisted-build" : "assisted-external";
  const strictPassed =
    report.verdict?.code === "runs" ||
    Boolean(report.gates?.runs && report.gates?.io);

  const hasRun1Block = Boolean(
    (!installBlocked && (strictCmd || strictDockerfile || repoDockerfile)) ||
      strictLogs.length > 0,
  );
  const hasAnyContent = Boolean(
    hasRun1Block ||
      (!installBlocked && localizedCaveats?.length) ||
      assisted?.attempted ||
      report.evidence?.length ||
      conclusionItems?.length,
  );
  if (!hasAnyContent) return null;

  return (
    <section
      id="verified-technical-annex"
      className="mt-10 scroll-mt-20 overflow-hidden rounded-lg border bg-card"
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40 sm:px-6"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden />
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              {t("verified.annex.heading")}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("verified.annex.subtitle")}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-semibold text-foreground">
          <span>{open ? t("verified.annex.collapse") : t("verified.annex.expand")}</span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </span>
      </button>

      <div className={cn("space-y-8 border-t bg-muted/15 p-5 sm:p-6", !open && "hidden")}>
        {/* Block 1: Literal Run 1 */}
        {hasRun1Block && (
          <div id="verified-annex-run1" className="scroll-mt-20 space-y-4">
            <h3 className="text-base font-semibold text-foreground">
              {t("verified.annex.run1Heading")}
            </h3>
            {!installBlocked && strictCmd && (
              <AnnexCodeCard
                label={
                  stepOutcome === "success" || stepOutcome === "failure"
                    ? t("verified.commandEvidence.submitted")
                    : t("verified.commandEvidence.planned")
                }
                code={strictCmd}
                note={strictCmdNote}
              />
            )}
            {!installBlocked && (
              repoDockerfile ? (
                <p className="text-sm text-muted-foreground">
                  {t("verified.trial.recipeRepoDockerfile")}
                </p>
              ) : strictDockerfile ? (
                <AnnexCodeCard
                  label={t("verified.annex.run1Dockerfile")}
                  code={strictDockerfile}
                />
              ) : null
            )}
            {strictLogs.length > 0 && (open || installBlocked) && (
              <RecordedTerminal
                logs={strictLogs}
                preferredLeg={preferredStrictLeg}
                preflight={installBlocked}
                outputSummary={strictOutputSummary}
                outputSectionHref={outputSectionHref}
                scrollToEnd={!strictPassed}
              />
            )}
          </div>
        )}

        {/* Block 2: Assisted Run 2 */}
        {assisted?.attempted && (
          <div
            id="verified-annex-run2"
            className="scroll-mt-20 space-y-4 border-t pt-6"
          >
            <h3 className="text-base font-semibold text-foreground">
              {t("verified.annex.run2Heading")}
            </h3>
            {assistedVc?.run && (
              <AnnexCodeCard
                label={t("verified.annex.run2ContainerCmd")}
                code={assistedVc.run}
                note={t("verified.annex.run2ContainerNote")}
              />
            )}
            {assistedVc?.dockerfile && (
              <AnnexCodeCard
                label={t("verified.annex.run2Dockerfile")}
                code={assistedVc.dockerfile}
              />
            )}
            {assistedLogs.length > 0 && open && (
              <RecordedTerminal
                logs={assistedLogs}
                preferredLeg={preferredAssistedLeg}
                preflight={false}
                outputSummary={assistedOutputSummary}
                scrollToEnd={!assisted?.passed}
              />
            )}
          </div>
        )}

        {/* Block 3: Cited repository evidence */}
        {!!report.evidence?.length && (
          <div className="border-t pt-6">
            <h3 className="text-base font-semibold text-foreground">
              {t("verified.trial.evidenceTitle")}
            </h3>
            <EvidenceList evidence={report.evidence} />
          </div>
        )}

        {/* Block 4: Configuration provenance notes */}
        {!installBlocked && !!localizedCaveats?.length && (
          <div className="border-t pt-6 space-y-2">
            <h3 className="text-base font-semibold text-foreground">
              {t("verified.caveats.heading")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("verified.caveats.note")}
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {localizedCaveats.map((item, idx) => (
                <li key={`${idx}-${item.slice(0, 40)}`} className="flex gap-2 leading-relaxed">
                  <span aria-hidden="true">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Block 5: Formal gate findings record */}
        {!!conclusionItems?.length && (
          <div className={cn(hasRun1Block || assisted?.attempted || !!report.evidence?.length || (!installBlocked && !!localizedCaveats?.length) ? "border-t pt-6" : "")}>
            <h3 className="text-base font-semibold text-foreground">
              {t("verified.annex.gateFindingsHeading")}
            </h3>
            <ConclusionBox items={conclusionItems} />
          </div>
        )}
      </div>
    </section>
  );
}
