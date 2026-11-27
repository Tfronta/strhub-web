"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { hasReportedErrors } from "@/lib/verified/diagnostics";
import { blockedBeforeInstall, blockedGateOf } from "@/lib/verified/gate-state";
import type { VerifiedDiagnostic, VerifiedReport } from "@/types/verified";
import { InlineCodeText } from "./inline-code";

export interface InterpretationItem {
  title: string;
  body: string;
}

function cleanDetectedPath(rawPath: string): string {
  const trimmed = rawPath.trim().replace(/^['"`(]+|['"`),.;:]+$/g, "");
  return trimmed
    .replace(/^\/opt\/tool\//, "")
    .replace(/^\/app\//, "")
    .replace(/^\/home\/runner\/[^\s/]+\//, "");
}

function extractTerminalSignals(text: string): {
  exitCode: number | null;
  missingFile: string | null;
  configHint: string | null;
  missingCmd: string | null;
  runtimeException: string | null;
} {
  if (!text) {
    return {
      exitCode: null,
      missingFile: null,
      configHint: null,
      missingCmd: null,
      runtimeException: null,
    };
  }

  const exitMatches = [...text.matchAll(/\[exit\s+(\d+)\]/g)];
  const exitCode =
    exitMatches.length > 0
      ? Number(exitMatches[exitMatches.length - 1][1])
      : null;

  const mCouldNotFind = text.match(
    /([^\s:'"`]+\.(?:fasta|fa|fna|bed|bam|cram|vcf|tsv|csv|json|txt|gz|groovy|py|jar|sh|config|yaml|yml))\s+could not be found/i,
  );
  const mNoSuchFile = text.match(
    /(?:No such file or directory|cannot open(?:\s+file)?|FileNotFoundError)[^:\n]*:\s*['"`]?([^\s'"`\n]+)/i,
  );
  const rawMissing = mCouldNotFind?.[1] ?? mNoSuchFile?.[1] ?? null;
  const missingFile =
    rawMissing && !rawMissing.startsWith("/etc/ssl/")
      ? cleanDetectedPath(rawMissing)
      : null;

  const mConfig = text.match(
    /Please check\s+([^\s'"`\n]+\.(?:groovy|config|json|ya?ml|ini|cfg|toml|py))/i,
  );
  const configHint = mConfig?.[1] ? cleanDetectedPath(mConfig[1]) : null;

  const mCmd = text.match(
    /(?:bash:\s*(?:line \d+:\s*)?|\/bin\/sh:\s*\d*:\s*)([A-Za-z0-9_.-]+):\s*(?:command )?not found/i,
  );
  const missingCmd = mCmd?.[1] ?? null;

  const mExc = text.match(
    /\b([A-Z][A-Za-z0-9_]*(?:Error|Exception)):\s*([^\n]{3,95})/,
  );
  const runtimeException = mExc
    ? `${mExc[1]}: ${mExc[2].trim()}`
    : null;

  return {
    exitCode,
    missingFile,
    configHint,
    missingCmd,
    runtimeException,
  };
}

function collectDiagnostics(report: VerifiedReport): VerifiedDiagnostic[] {
  const out: VerifiedDiagnostic[] = [];
  if (report.assisted_run?.attempted && report.assisted_run.diagnostics) {
    for (const list of Object.values(report.assisted_run.diagnostics)) {
      if (Array.isArray(list)) out.push(...list);
    }
  }
  if (report.install_detail?.diagnostics) {
    out.push(...report.install_detail.diagnostics);
  }
  if (report.diagnostics) {
    for (const list of Object.values(report.diagnostics)) {
      if (Array.isArray(list)) out.push(...list);
    }
  }
  return out;
}

export function buildResultInterpretation(
  report: VerifiedReport,
  terminalText: string,
  t: (key: string, vars?: Record<string, string>) => string,
): InterpretationItem[] {
  const gates = report.gates ?? {};
  const v = report.verdict;
  const code = v?.code;
  const strictRuns = code === "runs" || Boolean(gates.runs && gates.io);
  const assisted = report.assisted_run;
  const assistedPassed = Boolean(assisted?.passed);
  const assistedAttempted = Boolean(assisted?.attempted);
  const effectiveGates = assistedAttempted ? (assisted?.gates ?? {}) : gates;
  const effectiveInstalls = Boolean(effectiveGates.installs);
  const effectiveRuns = Boolean(effectiveGates.runs);
  const effectiveIo = Boolean(effectiveGates.io);

  const installBlocked = blockedBeforeInstall(report);
  const procUnestablished = blockedGateOf(report) !== null;
  const isOurs =
    report.step1?.code === "ours" ||
    code === "out_of_scope" ||
    v?.basis === "strhub_infra" ||
    v?.basis === "scope" ||
    v?.basis === "strhub" ||
    (!strictRuns &&
      !assistedPassed &&
      !assistedAttempted &&
      code !== "fails" &&
      (installBlocked || procUnestablished) &&
      report.step1?.code !== "cannot_tell");

  const signals = extractTerminalSignals(terminalText);
  const allDiags = collectDiagnostics(report);
  const diagIds = new Set(allDiags.map((d) => d.id));

  // 1. Run succeeded end-to-end (either literally in Step 1 or with adjustments in Step 2)
  if (strictRuns || assistedPassed) {
    const hasWarnings = hasReportedErrors(report.diagnostics);
    return [
      {
        title: t("verified.interp.finishedTitle"),
        body: t("verified.interp.finishedBody"),
      },
      {
        title: t("verified.interp.whatHappenedTitle"),
        body: strictRuns
          ? hasWarnings
            ? t("verified.interp.ranLiteralWarningsBody")
            : t("verified.interp.ranLiteralBody")
          : t("verified.interp.ranAdjustedBody"),
      },
      {
        title: t("verified.interp.reviewerTitle"),
        body: strictRuns
          ? t("verified.interp.reviewerPassLiteralBody")
          : t("verified.interp.reviewerPassAdjustedBody"),
      },
    ];
  }

  // 2. Out-of-memory ceiling (exit 137 or oom diagnostic)
  if (signals.exitCode === 137 || diagIds.has("oom")) {
    return [
      {
        title: t("verified.interp.exitCodeTitle", { code: "137" }),
        body: t("verified.interp.exitOomBody"),
      },
      {
        title: t("verified.interp.reviewerTitle"),
        body: t("verified.interp.reviewerCeilingBody"),
      },
    ];
  }

  // 3. Time limit ceiling (exit 124 or run_timeout diagnostic)
  if (signals.exitCode === 124 || diagIds.has("run_timeout")) {
    return [
      {
        title: t("verified.interp.exitCodeTitle", { code: "124" }),
        body: t("verified.interp.exitTimeoutBody"),
      },
      {
        title: t("verified.interp.reviewerTitle"),
        body: t("verified.interp.reviewerCeilingBody"),
      },
    ];
  }

  // 4. Crash / segmentation fault (exit 139 or segfault diagnostic)
  if (signals.exitCode === 139 || diagIds.has("segfault")) {
    return [
      {
        title: t("verified.interp.exitCodeTitle", { code: "139" }),
        body: t("verified.interp.exitSegfaultBody"),
      },
      {
        title: t("verified.interp.reviewerTitle"),
        body: t("verified.interp.reviewerStoppedBody"),
      },
    ];
  }

  // 5. Missing command at runtime (exit 127)
  if (signals.exitCode === 127) {
    const cmdName =
      signals.missingCmd ||
      allDiags.find((d) => d.id === "cmd_not_found")?.examples?.[0] ||
      "";
    return [
      {
        title: t("verified.interp.exitCodeTitle", { code: "127" }),
        body: cmdName
          ? t("verified.interp.exitCmdMissingNamedBody", { cmd: cmdName })
          : t("verified.interp.exitCmdMissingBody"),
      },
      {
        title: t("verified.interp.reviewerTitle"),
        body: t("verified.interp.reviewerStoppedBody"),
      },
    ];
  }

  // 6. A container build or run was executed and stopped before valid output
  if (assistedAttempted || code === "fails") {
    const shownExit =
      signals.exitCode !== null && signals.exitCode !== 0
        ? String(signals.exitCode)
        : "1";

    let causeBody: string;
    if (signals.missingFile && signals.configHint) {
      causeBody = t("verified.interp.causeMissingFileAndConfig", {
        file: signals.missingFile,
        config: signals.configHint,
      });
    } else if (signals.missingFile) {
      causeBody = t("verified.interp.causeMissingFile", {
        file: signals.missingFile,
      });
    } else if (signals.runtimeException) {
      causeBody = t("verified.interp.causeRuntimeException", {
        err: signals.runtimeException,
      });
    } else if (diagIds.has("bad_option")) {
      causeBody = t("verified.interp.causeBadOption");
    } else if (!effectiveInstalls) {
      causeBody = t("verified.interp.causeBuildFailed");
    } else if (effectiveRuns && !effectiveIo) {
      causeBody = t("verified.interp.causeNoValidOutput");
    } else {
      causeBody = t("verified.interp.causeGenericRuntime");
    }

    const firstItem: InterpretationItem =
      effectiveRuns && !effectiveIo
        ? {
            title: t("verified.interp.noOutputExitTitle"),
            body: t("verified.interp.noOutputExitBody"),
          }
        : {
            title: t("verified.interp.exitCodeTitle", { code: shownExit }),
            body: t("verified.interp.exitNonZeroBody", { code: shownExit }),
          };

    return [
      firstItem,
      {
        title: t("verified.interp.causeTitle"),
        body: causeBody,
      },
      {
        title: t("verified.interp.reviewerTitle"),
        body: t("verified.interp.reviewerStoppedBody"),
      },
    ];
  }

  // 7. No container executed: technical boundary of our test runner vs missing public setup steps
  if (isOurs) {
    return [
      {
        title: t("verified.interp.notExecutedTitle"),
        body: t("verified.interp.notExecutedOursBody"),
      },
      {
        title: t("verified.interp.reviewerTitle"),
        body: t("verified.interp.reviewerCeilingBody"),
      },
    ];
  }

  return [
    {
      title: t("verified.interp.notExecutedTitle"),
      body: t("verified.interp.notExecutedDocsBody"),
    },
    {
      title: t("verified.interp.reviewerTitle"),
      body: t("verified.interp.reviewerDocsGapBody"),
    },
  ];
}

export function ResultInterpretationCard({
  report,
  activeLogHref,
}: {
  report: VerifiedReport;
  activeLogHref?: string;
}) {
  const { t } = useLanguage();
  const [terminalText, setTerminalText] = useState("");

  useEffect(() => {
    if (!activeLogHref) {
      setTerminalText("");
      return;
    }
    const controller = new AbortController();
    fetch(activeLogHref, { signal: controller.signal, redirect: "error" })
      .then((res) => (res.ok ? res.text() : ""))
      .then((txt) => {
        if (!controller.signal.aborted) {
          setTerminalText(txt.slice(-32_000));
        }
      })
      .catch(() => {
        // fallback cleanly to structured report fields when transcript fetch is unavailable
      });
    return () => controller.abort();
  }, [activeLogHref]);

  const items = buildResultInterpretation(report, terminalText, t);

  return (
    <div className="mt-4 rounded-lg border bg-card p-5 space-y-3.5 text-base leading-relaxed">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
        <Info className="h-4 w-4 shrink-0" aria-hidden />
        <span>{t("verified.interp.eyebrow")}</span>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.title} className="space-y-1">
            <p className="font-semibold text-foreground">{item.title}</p>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              <InlineCodeText text={item.body} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
