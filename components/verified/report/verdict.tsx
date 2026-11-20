"use client";

/**
 * Chapter one: the tool as it is in its repository. Its heading, then the
 * one sentence for a reader who does not program — Step 1 (the documented run)
 * and the verdict's meaning and reason, and what the README does not say —
 * before the ladder that shows where the run stopped. A trial slots its own
 * block here (the same Step 1 and verdict, with the two ways out that only a
 * trial has).
 */
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, Copy, FileCode2, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { localizeReadmeGap, localizeVerdictReason } from "@/lib/verified/certificate";
import { buildReadmeTemplate, splitStep1Denial, step1For, type Step1Tone } from "@/lib/verified/step1";
import type { VerifiedReport } from "@/types/verified";
import { useHeaded } from "./certificate";

export { buildReadmeTemplate };

const STEP1_RETRY_RE =
  /^(.*?)(Add it and try the link again on the new commit\.?|Fix the documentation, or the step that broke, and try the link again on the new commit\.?|Agregalo y volvé a probar con el link sobre el commit nuevo\.?|Corregí la documentación, o el paso que se rompió, y volvé a probar con el link sobre el commit nuevo\.?|Adicione e tente o link novamente no commit novo\.?|Corrija a documentação, ou o passo que quebrou, e teste o link novamente no commit novo\.?)(.*)$/;

function renderWithRetryBold(text: string): ReactNode {
  const m = text.match(STEP1_RETRY_RE);
  if (!m) return text;
  return (
    <>
      {m[1]}
      <strong className="font-semibold text-foreground">{m[2]}</strong>
      {m[3]}
    </>
  );
}

export function Step1BodyText({ body }: { body: string }) {
  const split = splitStep1Denial(body);
  if (!split) return <>{renderWithRetryBold(body)}</>;
  return (
    <>
      {split.before}
      <strong className="font-semibold text-foreground">{split.bold}</strong>
      {renderWithRetryBold(split.after)}
    </>
  );
}

export function ReproTipsBox() {
  const { t } = useLanguage();
  return (
    <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4 sm:p-5">
      <h3 className="flex items-center gap-2 text-base font-semibold">
        <LifeBuoy className="h-4 w-4 shrink-0 text-muted-foreground" />
        {t("verified.trial.reproTipsTitle")}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("verified.trial.reproTipsSubtitle")}
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
        <li>{t("verified.trial.reproTips.outputDir")}</li>
        <li>{t("verified.trial.reproTips.deps")}</li>
        <li>{t("verified.trial.reproTips.exampleData")}</li>
        <li>{t("verified.trial.reproTips.nonInteractive")}</li>
      </ul>
    </div>
  );
}

const STEP1_BORDER: Record<Step1Tone, string> = {
  green: "border-l-4 border-l-teal-600",
  red: "border-l-4 border-l-red-600",
  grey: "border-l-4 border-l-slate-400",
};

export function ReadmeTemplateAction({ report }: { report: VerifiedReport }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const snippet = buildReadmeTemplate(report);

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setOpen(true);
    }
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={copySnippet}>
          {copied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5 text-teal-600" />
              {t("verified.trial.step1.templateCopied")}
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              {t("verified.trial.step1.copyTemplate")}
            </>
          )}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen((v) => !v)}>
          <FileCode2 className="mr-1.5 h-3.5 w-3.5" />
          {open ? t("verified.trial.step1.hideTemplate") : t("verified.trial.step1.showTemplate")}
        </Button>
      </div>
      {open && (
        <div className="mt-3 rounded-md border bg-muted/60 p-3 sm:p-4">
          <p className="mb-2 text-sm text-muted-foreground">
            {t("verified.trial.step1.templateHint")}
          </p>
          <pre className="overflow-x-auto rounded bg-background p-3 text-xs sm:text-sm leading-relaxed">
            <code>{snippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

export function AsItIsOpening({ report, children }: { report: VerifiedReport; children?: ReactNode }) {
  const { t } = useLanguage();
  const v = report.verdict;
  const step1 = step1For(report.step1, t);
  const meaning = v
    ? v.code === "undetermined" && step1?.code === "ours"
      ? "undeterminedOurs"
      : v.code
    : null;
  const localizedReason = localizeVerdictReason(v?.reason, t);
  const showSeparateVerdictCard = Boolean(
    v && (!step1 || v.code !== "runs" || (v.readme_gaps && v.readme_gaps.length > 0)),
  );

  return (
    <>
      {!useHeaded() && <h2 className="mt-8 text-xl font-semibold">{t("verified.asIs.heading")}</h2>}
      {children ?? (
        <>
          {step1 && (
            <section
              className={`mt-3 rounded-lg border bg-card p-5 sm:p-6 ${STEP1_BORDER[step1.tone]}`}
              aria-labelledby="verified-step1"
            >
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {t("verified.trial.step1.heading")}
              </p>
              <p id="verified-step1" className="mt-1 text-xl font-semibold">
                {step1.headline}
              </p>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                <Step1BodyText body={step1.body} />
              </p>
              {step1.missing.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-base font-semibold">{step1.missingTitle}</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-base">
                    {step1.missing.map((block) => (
                      <li key={block}>{block}</li>
                    ))}
                  </ul>
                </div>
              )}
              {step1.code !== "runs" && (
                <div className="mt-4 space-y-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={step1.guideHref}>{step1.guideLabel}</Link>
                  </Button>
                  <ReadmeTemplateAction report={report} />
                </div>
              )}
            </section>
          )}
          {v && showSeparateVerdictCard && (
            <section className="mt-4 rounded-lg border bg-card p-5 sm:p-6" aria-labelledby="verified-verdict">
              <p id="verified-verdict" className="text-lg font-semibold">{t(`verified.trial.verdictMeaning.${meaning}`)}</p>
              {localizedReason && <p className="mt-2 text-base leading-relaxed text-muted-foreground">{localizedReason}</p>}
              {v.readme_gaps && v.readme_gaps.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-base font-semibold">{t("verified.trial.gapsTitle")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t("verified.trial.gapsHint")}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-base">
                    {v.readme_gaps.map((g) => <li key={g.item}>{localizeReadmeGap(g, t)}</li>)}
                  </ul>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </>
  );
}
