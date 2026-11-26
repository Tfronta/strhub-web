"use client";

import { useLanguage } from "@/contexts/language-context";
import { hasReportedErrors } from "@/lib/verified/diagnostics";
import { blockedBeforeInstall, blockedGateOf } from "@/lib/verified/gate-state";
import type { VerifiedReport } from "@/types/verified";

export interface HumanConclusionItem {
  title: string;
  body: string;
}

export function buildHumanConclusion(
  report: VerifiedReport,
  isManualRun: boolean,
  t: (key: string, vars?: Record<string, string>) => string,
): { lead: string; items: HumanConclusionItem[] } {
  const gates = report.gates ?? {};
  const v = report.verdict;
  const code = v?.code;
  const strictRuns = code === "runs" || Boolean(gates.runs && gates.io);
  const assistedPassed = Boolean(report.assisted_run?.passed);
  const hasErrors = hasReportedErrors(report.diagnostics);
  const installBlocked = blockedBeforeInstall(report);
  const procUnestablished = blockedGateOf(report) !== null;

  const isOurs =
    report.step1?.code === "ours" ||
    code === "out_of_scope" ||
    v?.basis === "strhub_infra" ||
    v?.basis === "scope" ||
    v?.basis === "strhub" ||
    (!isManualRun &&
      !strictRuns &&
      !assistedPassed &&
      code !== "fails" &&
      (installBlocked || procUnestablished) &&
      report.step1?.code !== "cannot_tell");

  let workBody: string;
  let docsBody: string;

  if (isManualRun) {
    if (strictRuns) {
      workBody = t("verified.humanConclusion.workManualPass");
      docsBody = t("verified.humanConclusion.docsManualPass");
    } else {
      workBody = t("verified.humanConclusion.workManualFail");
      docsBody = t("verified.humanConclusion.docsManualFail");
    }
  } else if (strictRuns) {
    workBody = hasErrors
      ? t("verified.humanConclusion.workRunsWarnings")
      : t("verified.humanConclusion.workRuns");
    docsBody = t("verified.humanConclusion.docsRuns");
  } else if (assistedPassed) {
    workBody = t("verified.humanConclusion.workAdjusted");
    docsBody = t("verified.humanConclusion.docsAdjusted");
  } else if (isOurs) {
    workBody = t("verified.humanConclusion.workOurs");
    docsBody = t("verified.humanConclusion.docsOurs");
  } else if (code === "undetermined") {
    workBody = t("verified.humanConclusion.workCannotTell");
    docsBody = t("verified.humanConclusion.docsCannotTell");
  } else if (gates.installs) {
    workBody = t("verified.humanConclusion.workStoppedRun");
    docsBody = t("verified.humanConclusion.docsStoppedRun");
  } else {
    workBody = t("verified.humanConclusion.workStoppedInstall");
    docsBody = t("verified.humanConclusion.docsStoppedInstall");
  }

  let dataBody: string;
  if (v?.basis === "example" && gates.installs) {
    dataBody = t("verified.humanConclusion.dataExample");
  } else if (strictRuns || assistedPassed || (isManualRun && gates.installs)) {
    dataBody = t("verified.humanConclusion.dataPublic");
  } else if (gates.installs && code === "fails") {
    dataBody = t("verified.humanConclusion.dataAttempted");
  } else {
    dataBody = t("verified.humanConclusion.dataNone");
  }

  return {
    lead: t("verified.humanConclusion.lead"),
    items: [
      { title: t("verified.humanConclusion.qWork"), body: workBody },
      { title: t("verified.humanConclusion.qDocs"), body: docsBody },
      { title: t("verified.humanConclusion.qData"), body: dataBody },
      {
        title: t("verified.humanConclusion.qScope"),
        body: t("verified.humanConclusion.scopeBody"),
      },
    ],
  };
}

export function HumanConclusionCard({
  report,
  isManualRun = false,
}: {
  report: VerifiedReport;
  isManualRun?: boolean;
}) {
  const { t } = useLanguage();
  const { lead, items } = buildHumanConclusion(report, isManualRun, t);

  return (
    <div className="mt-4 rounded-lg border border-teal-600/50 bg-teal-50/60 p-5 text-base leading-relaxed dark:bg-teal-950/20">
      <p className="text-sm text-muted-foreground">{lead}</p>
      <ul className="mt-3.5 space-y-3">
        {items.map((item) => (
          <li key={item.title} className="flex items-start gap-2.5">
            <span
              className="mt-0.5 shrink-0 text-sm text-teal-700 dark:text-teal-400"
              aria-hidden="true"
            >
              &#9670;
            </span>
            <p className="leading-relaxed">
              <strong className="font-semibold text-foreground">{item.title}</strong>{" "}
              <span className="text-foreground/90">{item.body}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
