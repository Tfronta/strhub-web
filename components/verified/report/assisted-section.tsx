"use client";

import { useState } from "react";
import { AlertTriangle, Check, CheckCircle2, Copy } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { VerifiedAssistedRun, VerifiedLevel, VerifiedOutputVerification } from "@/types/verified";
import { reachedLabel } from "@/lib/verified/badge";
import { terminalOutputSummary } from "@/lib/verified/output-evidence";
import { cn } from "@/lib/utils";
import { GatesLadder } from "./gates";
import { InlineCodeText } from "./inline-code";
import { OutputContent } from "./output";
import { RecordedTerminal, type ReportLog } from "./terminal";

function CopyBlock({
  label,
  code,
}: {
  label: string;
  code: string;
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
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" aria-hidden />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden />
          )}
          <span>
            {copied
              ? t("verified.strhubDid.copiedCommand")
              : t("verified.strhubDid.copyCommand")}
          </span>
        </button>
      </div>
      <pre className="overflow-x-auto rounded-md border bg-muted p-3.5 font-mono text-xs sm:text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function AssistedVerificationSection({
  assisted,
  logs,
  panelLoci,
  sliceScopeNote,
}: {
  assisted: VerifiedAssistedRun;
  logs: ReportLog[];
  panelLoci?: string[];
  sliceScopeNote?: string | null;
}) {
  const { t } = useLanguage();
  const [showDockerfile, setShowDockerfile] = useState(false);

  const vc = assisted.verified_commands;
  const cmdLines: string[] = [];
  if (vc?.extra_apt && vc.extra_apt.length > 0) {
    cmdLines.push(`sudo apt-get update && sudo apt-get install -y ${vc.extra_apt.join(" ")}`);
  }
  if (vc?.init_submodules) {
    cmdLines.push("git submodule update --init --recursive");
  }
  if (vc?.install && vc.install.length > 0) {
    cmdLines.push(...vc.install);
  }
  if (vc?.mkdir_dirs && vc.mkdir_dirs.length > 0) {
    for (const d of vc.mkdir_dirs) cmdLines.push(`mkdir -p ${d}`);
  }
  if (vc?.run) {
    cmdLines.push(vc.run);
  }

  const assistedStats = assisted.content_detail?.outputs?.[0]?.stats;
  const assistedIo = assisted.io_detail?.outputs?.[0];
  const hasAssistedOutput = Boolean(
    assistedStats || assistedIo || assisted.output_preview,
  );
  const outputVerif: VerifiedOutputVerification | undefined = assisted.passed
    ? {
        io_passed: Boolean(assisted.gates?.io),
        content_verified: Boolean(assisted.content_verified),
        status: assisted.content_verified
          ? "content_verified"
          : "output_only_content_unverified",
      }
    : undefined;
  const termSummary = terminalOutputSummary(assistedIo, assistedStats);
  const preferredAssistedLeg =
    assisted.gates?.installs === false ? "assisted-build" : "assisted-external";

  return (
    <div className="space-y-5">
      <div
        className={cn(
          "rounded-lg border p-4 sm:p-5",
          assisted.passed
            ? "border-amber-500/45 bg-amber-50/55 dark:border-amber-600/50 dark:bg-amber-950/25"
            : "border-slate-300/70 bg-muted/35 dark:border-slate-700/60",
        )}
      >
        <div className="flex items-start gap-3">
          {assisted.passed ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
          ) : (
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          )}
          <div className="space-y-1.5">
            <p className="text-base font-semibold text-foreground">
              {assisted.passed
                ? t("verified.assisted.passedTitle")
                : t("verified.assisted.stoppedTitle", {
                    level: reachedLabel(assisted.level, t),
                  })}
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              {assisted.passed
                ? t("verified.assisted.passedBody")
                : t("verified.assisted.stoppedBody")}
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              {t("verified.assisted.readOnlyGuarantee")}
            </p>
          </div>
        </div>
      </div>

      <GatesLadder gates={assisted.gates as Record<VerifiedLevel, boolean>} hideHowToRead />

      {assisted.adjustments && assisted.adjustments.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold">
            {t("verified.assisted.adjustmentsHeading")}
          </h3>
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3.5 py-2.5">{t("verified.assisted.colWhatFailed")}</th>
                  <th className="px-3.5 py-2.5">{t("verified.assisted.colAdjustment")}</th>
                  <th className="px-3.5 py-2.5">{t("verified.assisted.colAuthorFix")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {assisted.adjustments.map((adj, idx) => (
                  <tr key={`${adj.rule_id}-${idx}`} className="align-top">
                    <td className="px-3.5 py-3 leading-relaxed text-muted-foreground">
                      <InlineCodeText text={adj.what_failed_strict} />
                    </td>
                    <td className="px-3.5 py-3 leading-relaxed font-medium text-foreground">
                      <InlineCodeText text={adj.adjustment_applied} />
                    </td>
                    <td className="px-3.5 py-3 leading-relaxed text-foreground/90">
                      <InlineCodeText text={adj.author_fix} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {cmdLines.length > 0 && (
        <div className="rounded-lg border bg-card p-4 sm:p-5 space-y-4">
          <CopyBlock
            label={t("verified.assisted.verifiedCommandsLabel")}
            code={cmdLines.join("\n")}
          />
          {vc?.dockerfile && (
            <div>
              <button
                type="button"
                onClick={() => setShowDockerfile((v) => !v)}
                className="text-xs font-medium text-primary underline underline-offset-2"
              >
                {showDockerfile
                  ? t("verified.assisted.hideDockerfile")
                  : t("verified.assisted.showDockerfile")}
              </button>
              {showDockerfile && (
                <pre className="mt-2 overflow-x-auto rounded-md border bg-muted p-3 font-mono text-xs leading-relaxed">
                  <code>{vc.dockerfile}</code>
                </pre>
              )}
            </div>
          )}
        </div>
      )}

      {assisted.readme_suggestion && (
        <div className="rounded-lg border border-teal-600/30 bg-teal-50/30 p-4 sm:p-5 dark:border-teal-800/50 dark:bg-teal-950/20">
          <CopyBlock
            label={t("verified.assisted.readmeSuggestionLabel")}
            code={assisted.readme_suggestion}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t("verified.assisted.readmeSuggestionHint")}
          </p>
        </div>
      )}

      {logs.length > 0 && (
        <RecordedTerminal
          logs={logs}
          preferredLeg={preferredAssistedLeg}
          preflight={false}
          outputSummary={termSummary}
        />
      )}

      {hasAssistedOutput && (
        <div className="pt-1">
          <h3 className="mb-2 text-base font-semibold">
            {t("verified.assisted.outputHeading")}
          </h3>
          <OutputContent
            stats={assistedStats}
            io={assistedIo}
            panelLoci={panelLoci}
            outputVerification={outputVerif}
            gates={assisted.gates as Record<VerifiedLevel, boolean>}
            outputPreview={assisted.output_preview}
            sliceScopeNote={sliceScopeNote}
          />
        </div>
      )}
    </div>
  );
}
