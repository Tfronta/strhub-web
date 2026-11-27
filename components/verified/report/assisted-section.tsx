"use client";

import { useState } from "react";
import { AlertTriangle, Check, CheckCircle2, Copy, Terminal } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type {
  VerifiedAssistedRun,
  VerifiedLevel,
  VerifiedOutputVerification,
} from "@/types/verified";
import { reachedLabel } from "@/lib/verified/badge";
import { cn } from "@/lib/utils";
import { GatesLadder } from "./gates";
import { InlineCodeText } from "./inline-code";
import { OutputContent } from "./output";

function CopyBlock({
  label,
  code,
  hint,
}: {
  label: string;
  code: string;
  hint?: string;
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
    <div className="rounded-lg border bg-card p-4 shadow-2xs space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
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
      <pre className="overflow-x-auto rounded-md border bg-muted p-3 font-mono text-xs sm:text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/**
 * Normalize container mount paths (`/data/in/input.bam`, `/data/ref/hg38.fa`, etc.)
 * and excess alignment spaces so a user can copy-paste into their own terminal.
 */
function toLocalUserCommand(rawCmd: string): string {
  return rawCmd
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\/data\/in\/input\.bam\b/g, "sample.bam")
    .replace(/\/data\/in\/input\.cram\b/g, "sample.cram")
    .replace(/\/data\/in\/input\.fastq\.gz\b/g, "sample.fastq.gz")
    .replace(/\/data\/in\/input\.fastq\b/g, "sample.fastq")
    .replace(/\/data\/ref\/hg38\.fa\b/g, "hg38.fa")
    .replace(/\/data\/in\/regions\.bed\b/g, "regions.bed")
    .replace(/\/data\/in\/regions\.json\b/g, "variant_catalog.json")
    .replace(/\/data\/in\/regions\.tsv\b/g, "regions.tsv");
}

export function AssistedVerificationSection({
  assisted,
  repo,
  sha,
  panelLoci,
  sliceScopeNote,
  recommendations,
}: {
  assisted: VerifiedAssistedRun;
  repo?: string;
  sha?: string;
  panelLoci?: string[];
  sliceScopeNote?: string | null;
  recommendations?: string[];
}) {
  const { t } = useLanguage();
  const [showReadmeBlock, setShowReadmeBlock] = useState(false);

  const vc = assisted.verified_commands;

  // Build clean, numbered step-by-step boxes for running on a local machine from git clone
  const localSteps: { key: string; label: string; code: string; hint?: string }[] = [];
  if (assisted.passed && vc) {
    const prereqLines: string[] = [];
    if (vc.extra_apt && vc.extra_apt.length > 0) {
      prereqLines.push(`sudo apt-get update && sudo apt-get install -y ${vc.extra_apt.join(" ")}`);
    }
    if (vc.git_https_rewrite) {
      prereqLines.push('git config --global url."https://github.com/".insteadOf "git@github.com:"');
    }
    if (prereqLines.length > 0) {
      localSteps.push({
        key: "prereq",
        label: t("verified.assisted.stepPrereq", { n: String(localSteps.length + 1) }),
        code: prereqLines.join("\n"),
      });
    }

    const repoClean = (repo || "https://github.com/owner/tool").replace(/\/+$/, "");
    const repoDir = repoClean.split("/").pop()?.replace(/\.git$/, "") || "tool";
    const cloneFlag = vc.init_submodules ? "--recursive " : "";
    const buildLines: string[] = [
      `git clone ${cloneFlag}${repoClean}`,
      `cd ${repoDir}`,
    ];
    if (sha) {
      buildLines.push(`git checkout ${sha}`);
    }
    if (vc.install && vc.install.length > 0) {
      buildLines.push(...vc.install);
    }
    localSteps.push({
      key: "clone-build",
      label: t("verified.assisted.stepCloneBuild", { n: String(localSteps.length + 1) }),
      code: buildLines.join("\n"),
    });

    if (vc.run) {
      const runLines: string[] = [];
      if (vc.mkdir_dirs && vc.mkdir_dirs.length > 0) {
        for (const d of vc.mkdir_dirs) runLines.push(`mkdir -p ${d}`);
      }
      runLines.push(toLocalUserCommand(vc.run));
      localSteps.push({
        key: "run",
        label: t("verified.assisted.stepRunLocal", { n: String(localSteps.length + 1) }),
        code: runLines.join("\n"),
        hint: t("verified.assisted.stepRunHint"),
      });
    }
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

  function openAnnex() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("strhub:open-annex"));
    }
  }

  const skipKey = assisted.skip_reason_code
    ? `verified.assisted.skip_${assisted.skip_reason_code}`
    : "";
  const localizedSkipReason =
    skipKey && t(skipKey) !== skipKey
      ? t(skipKey)
      : assisted.skip_reason || t("verified.assisted.skip_default");

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
              {!assisted.attempted
                ? t("verified.assisted.notExecutableTitle")
                : assisted.passed
                  ? t("verified.assisted.passedTitle")
                  : t("verified.assisted.stoppedTitle", {
                      level: reachedLabel(assisted.level, t),
                    })}
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              {!assisted.attempted ? (
                <InlineCodeText text={localizedSkipReason} />
              ) : assisted.passed ? (
                t("verified.assisted.passedBody")
              ) : (
                t("verified.assisted.stoppedBody")
              )}
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              {t("verified.assisted.readOnlyGuarantee")}
            </p>
          </div>
        </div>
      </div>

      {assisted.adjustments && assisted.adjustments.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold">
            {t(
              assisted.passed
                ? "verified.assisted.adjustmentsHeading"
                : "verified.assisted.adjustmentsAttemptedHeading",
            )}
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

      {recommendations && recommendations.length > 0 && (
        <div className="rounded-lg border bg-muted/35 p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">
            {t("verified.recommendations.heading")}
          </p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {recommendations.map((rec, idx) => (
              <li key={`${idx}-${rec.slice(0, 40)}`} className="flex gap-2 leading-relaxed">
                <span aria-hidden="true">&bull;</span>
                <span><InlineCodeText text={rec} /></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {assisted.passed && localSteps.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold">
            {t("verified.assisted.stepsHeading")}
          </h3>
          <div className="space-y-3">
            {localSteps.map((step) => (
              <CopyBlock
                key={step.key}
                label={step.label}
                code={step.code}
                hint={step.hint}
              />
            ))}
          </div>
        </div>
      )}

      {assisted.passed && Boolean(assisted.readme_suggestion) && (
        <div className="space-y-3 rounded-lg border bg-muted/25 p-3.5 sm:p-4">
          <button
            type="button"
            onClick={() => setShowReadmeBlock((v) => !v)}
            className="text-xs sm:text-sm font-medium text-primary underline underline-offset-2"
          >
            {showReadmeBlock
              ? t("verified.assisted.hideReadmeBlock")
              : t("verified.assisted.showReadmeBlock")}
          </button>

          {showReadmeBlock && assisted.readme_suggestion && (
            <CopyBlock
              label={t("verified.assisted.readmeSuggestionLabel")}
              code={assisted.readme_suggestion
                .split("\n")
                .map((ln) =>
                  ln.startsWith("#") ||
                  ln.startsWith("```") ||
                  ln.startsWith("sudo ") ||
                  ln.startsWith("git ") ||
                  ln.startsWith("cd ") ||
                  ln.startsWith("mkdir ")
                    ? ln
                    : toLocalUserCommand(ln),
                )
                .join("\n")}
              hint={t("verified.assisted.readmeSuggestionHint")}
            />
          )}
        </div>
      )}

      {assisted.attempted && (
        <div className="space-y-2">
          <GatesLadder gates={assisted.gates as Record<VerifiedLevel, boolean>} hideHowToRead />
          <p className="text-xs sm:text-sm text-muted-foreground">
            <a
              href="#verified-annex-run2"
              onClick={openAnnex}
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <Terminal className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>{t("verified.annex.jumpRun2")}</span>
            </a>
          </p>
        </div>
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
