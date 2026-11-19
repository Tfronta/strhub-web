"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CheckCircle2, Clock, Copy } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TEMPLATE_SNIPPET = `## Installation

\`\`\`bash
conda env create -f environment.yml
conda activate mytool
pip install .
\`\`\`

## Example

Reads aligned ONT/Illumina BAM files (hg38) and writes \`out.vcf\`.

\`\`\`bash
mytool --bam sample.bam --fasta hg38.fa --out out.vcf
\`\`\``;

export function VerifiedRequirements() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(TEMPLATE_SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Link
          href="/verified"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("verified.backToList")}
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          {t("verified.requirements.title")}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {t("verified.requirements.lede")}
        </p>

        <div className="mt-5 rounded-lg border-l-4 border-teal-600 bg-muted/50 px-4 py-3 text-base leading-relaxed">
          <strong className="font-semibold text-foreground">
            {t("verified.requirements.denialBold")}
          </strong>
          <span className="text-muted-foreground">
            {t("verified.requirements.denialRest")}
          </span>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">
              {t("verified.requirements.checklistTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-base">
              {(["check1", "check2", "check3", "check4"] as const).map((key) => (
                <li key={key} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400" />
                  <span>{t(`verified.requirements.${key}`)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-6">
          <section className="rounded-lg border bg-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold">
              {t("verified.requirements.block1Title")}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              {t("verified.requirements.block1Body")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("verified.requirements.block1Base")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              {t("verified.requirements.block1Supported")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("verified.requirements.block1Unsupported")}
            </p>
          </section>

          <section className="rounded-lg border bg-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold">
              {t("verified.requirements.block2Title")}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              {t("verified.requirements.block2Body")}
            </p>
          </section>

          <section className="rounded-lg border bg-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold">
              {t("verified.requirements.block3Title")}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              {t("verified.requirements.block3Body")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("verified.requirements.block3Ref")}
            </p>
            <p className="mt-3 text-sm font-medium text-teal-700 dark:text-teal-400">
              {t("verified.requirements.block3Tip")}
            </p>
          </section>

          <section className="rounded-lg border bg-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold">
              {t("verified.requirements.block4Title")}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              {t("verified.requirements.block4Body")}
            </p>
          </section>
        </div>

        <Card className="mt-8">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg">
              {t("verified.requirements.templateTitle")}
            </CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={copyTemplate}>
              {copied ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5 text-teal-600" />
                  {t("verified.requirements.copiedTemplate")}
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  {t("verified.requirements.copyTemplate")}
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs sm:text-sm leading-relaxed">
              <code>{TEMPLATE_SNIPPET}</code>
            </pre>
          </CardContent>
        </Card>

        <Card className="mt-8 border-teal-500/40 bg-teal-50/40 dark:border-teal-800/60 dark:bg-teal-950/20">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg">
                {t("verified.requirements.manualTitle")}
              </CardTitle>
              <Badge variant="outline" className="inline-flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                {t("verified.trial.manualReview.option2Badge")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base leading-relaxed text-muted-foreground">
              {t("verified.requirements.manualBody")}
            </p>
            <Button asChild>
              <Link href="/verified/submit">
                {t("verified.requirements.goVerifyCta")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
