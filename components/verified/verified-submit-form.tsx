"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Loader2, CheckCircle2, XCircle, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageTitle } from "@/components/page-title";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/contexts/language-context";
import {
  submissionSchema,
  OUTPUT_FORMATS,
  BUILD_LANGUAGES,
  INPUT_TYPES,
  INPUT_TYPES_OWN_ONLY,
  INPUT_TYPES_WITH_REFERENCE,
  type InputTypeEntry,
  type SubmissionInput,
} from "@/lib/verified/submission";

type Phase = "form" | "submitting" | "pending" | "tracking" | "done";
type RunState = "pending" | "queued" | "in_progress" | "completed";

const INPUT_TYPE_DESC_KEYS: Record<string, string> = {
  "illumina-str-fastq": "verified.submit.inputTypeDescIlluminaStrFastq",
  "ont-bam-hg38": "verified.submit.inputTypeDescOntBamHg38",
  "illumina-bam-hg38": "verified.submit.inputTypeDescIlluminaBamHg38",
  "ont-fastq": "verified.submit.inputTypeDescOntFastq",
  "illumina-snp-fastq": "verified.submit.inputTypeDescIlluminaSnpFastq",
  "capillary-fsa": "verified.submit.inputTypeDescCapillaryFsa",
};

function inputTypeOptionLabel(
  label: string,
  t: (key: string) => string,
  suffixKey: "verified.submit.inputTypeSuffixWithReference" | "verified.submit.inputTypeSuffixOwnOnly",
): string {
  return `${label}${t(suffixKey)}`;
}

const CMD_TEMPLATE_PREFIX = "mytool ";

function buildCmdTemplate(entry: InputTypeEntry | undefined): string {
  if (!entry?.canonicalPaths?.length) return "";
  const paths = entry.canonicalPaths.join(" ");
  return `mytool ${paths} --out /data/out/result.tsv`;
}

function isCmdTemplate(cmd: string): boolean {
  return cmd === "" || cmd.startsWith(CMD_TEMPLATE_PREFIX);
}

function num(v: string): number | undefined {
  if (v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function list(v: string): string[] | undefined {
  const items = v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length ? items : undefined;
}

function numList(v: string): number[] | undefined {
  const items = v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number);
  return items.length && items.every((n) => Number.isFinite(n)) ? items : undefined;
}

async function downloadPdfForSlug(reportSlug: string) {
  const base =
    process.env.NEXT_PUBLIC_VERIFIED_BASE ??
    "https://raw.githubusercontent.com/Tfronta/strhub-verified/gh-pages";
  const res = await fetch(`${base}/${reportSlug}.json`);
  if (!res.ok) throw new Error("Report not available yet");
  const report = await res.json();

  const [{ pdf }, { VerifiedPDF }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./verified-pdf"),
  ]);

  let logoSrc: string | undefined;
  try {
    const logoRes = await fetch("/strhub-logo-pdf.png");
    const logoBlob = await logoRes.blob();
    logoSrc = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(logoBlob);
    });
  } catch { /* logo is optional */ }

  const blob = await pdf(
    <VerifiedPDF report={report} slug={reportSlug} logoSrc={logoSrc} />
  ).toBlob();
  const date = report.generated?.slice(0, 10) ?? "undated";
  const filename = `STRhub-Verified_${reportSlug}_${date}.pdf`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function VerifiedSubmitForm() {
  const { t } = useLanguage();

  const [phase, setPhase] = useState<Phase>("form");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pdfState, setPdfState] = useState<"idle" | "generating" | "done" | "error">("idle");

  const [dockerMode, setDockerMode] = useState<"generated" | "provided">("generated");
  const [fixtureSource, setFixtureSource] = useState<"same" | "other">("same");
  const [showContent, setShowContent] = useState(false);

  // Result state.
  const [slug, setSlug] = useState<string | null>(null);
  const [dispatchId, setDispatchId] = useState<string | null>(null);
  const [runState, setRunState] = useState<RunState>("pending");
  const [conclusion, setConclusion] = useState<string | null>(null);
  const [runUrl, setRunUrl] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  // Form fields (controlled).
  const [f, setF] = useState({
    name: "",
    version: "",
    maintainer: "",
    contact: "",
    repo: "",
    ref: "",
    dockerfile: "",
    language: "python",
    buildCmd: "",
    checkCmd: "",
    cmd: "",
    timeout: "15",
    inputType: "",
    inputTypeCustom: "",
    fixtureFilePath: "",
    fixtureRepo: "",
    fixtureRef: "",
    outputPath: "",
    outputFormat: "tsv",
    minRecords: "1",
    // content (advanced)
    columns: "",
    dnaColumn: "",
    countColumns: "",
    locusColumn: "",
    minDistinctLoci: "",
    expectLoci: "",
    minTotalReads: "",
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  const resolvedInputType =
    f.inputType === "__other__" ? f.inputTypeCustom : f.inputType;

  const selectedTypeInfo = INPUT_TYPES.find((t) => t.slug === f.inputType);
  const selectedRefGenome = selectedTypeInfo?.referenceGenome ?? null;
  const selectedCanonicalPaths = selectedTypeInfo?.canonicalPaths ?? null;
  const fixtureIsOptional = selectedTypeInfo?.hasExternalDataset === true;
  const cmdLooksLikeTemplate = f.cmd === "" || f.cmd.startsWith(CMD_TEMPLATE_PREFIX);

  function onInputTypeChange(value: string) {
    const entry = INPUT_TYPES.find((t) => t.slug === value);
    const template = buildCmdTemplate(entry);
    setF((prev) => ({
      ...prev,
      inputType: value,
      ...(isCmdTemplate(prev.cmd) && template ? { cmd: template } : {}),
    }));
  }

  const canSubmit =
    phase === "form" &&
    f.name.trim() !== "" &&
    f.version.trim() !== "" &&
    f.repo.trim() !== "" &&
    f.ref.trim() !== "" &&
    (dockerMode === "generated" ? f.buildCmd.trim() !== "" : f.dockerfile.trim().length >= 10) &&
    f.cmd.trim() !== "" &&
    !cmdLooksLikeTemplate &&
    f.inputType !== "" &&
    (fixtureIsOptional || f.fixtureFilePath.trim() !== "") &&
    f.outputPath.trim() !== "";

  function externalNoteMessage(): string | null {
    if (!resolvedInputType) return null;
    if (resolvedInputType === "illumina-str-fastq") return t("verified.submit.externalNoteIllumina");
    if (resolvedInputType === "ont-bam-hg38") return t("verified.submit.externalNoteOnt");
    if (resolvedInputType === "illumina-bam-hg38") return t("verified.submit.externalNoteIlluminaBam");
    return t("verified.submit.externalNoteOwnOnly");
  }

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  function buildPayload(): SubmissionInput {
    const content = showContent
      ? {
          columns: num(f.columns),
          dna_column: num(f.dnaColumn),
          count_columns: numList(f.countColumns),
          locus_column: num(f.locusColumn),
          min_distinct_loci: num(f.minDistinctLoci),
          expect_loci: list(f.expectLoci),
          min_total_reads: num(f.minTotalReads),
        }
      : undefined;

    const fixtureRepo = fixtureSource === "same" ? f.repo : f.fixtureRepo;
    const fixtureRef = fixtureSource === "same" ? f.ref : f.fixtureRef;

    const hasFixture = f.fixtureFilePath.trim() !== "";
    const fixture = hasFixture
      ? { repo: fixtureRepo, ref: fixtureRef, path: f.fixtureFilePath }
      : undefined;

    return {
      tool: {
        name: f.name,
        version: f.version,
        maintainer: f.maintainer || undefined,
        contact: f.contact || undefined,
      },
      source: { repo: f.repo, ref: f.ref },
      docker:
        dockerMode === "generated"
          ? {
              mode: "generated",
              language: f.language as (typeof BUILD_LANGUAGES)[number],
              build_cmd: f.buildCmd,
              check_cmd: f.checkCmd || undefined,
            }
          : { mode: "provided", dockerfile: f.dockerfile },
      run: { cmd: f.cmd, timeout_minutes: num(f.timeout) ?? 15 },
      inputs: {
        type: resolvedInputType || undefined,
        fixture,
      },
      outputs: [
        {
          path: f.outputPath,
          format: f.outputFormat as (typeof OUTPUT_FORMATS)[number],
          min_records: num(f.minRecords) ?? 1,
          content,
        },
      ],
      os: ["ubuntu-22.04"],
    };
  }

  async function pollStatus(id: string) {
    try {
      const res = await fetch(`/api/verify/status?dispatchId=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!data.ok) return;
      setRunState((data.state as RunState) ?? "pending");
      if (data.runUrl) setRunUrl(data.runUrl);
      if (data.slug) setSlug(data.slug);
      if (data.state === "completed") {
        setConclusion(data.conclusion ?? null);
        setPhase("done");
        if (pollRef.current) clearInterval(pollRef.current);
      }
    } catch {
      // transient; keep polling
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setErrors({});

    const payload = buildPayload();

    if (!payload.inputs.fixture && !fixtureIsOptional) {
      setErrors({ "inputs.fixture.path": t("verified.submit.fixtureRequiredError") });
      setFormError(t("verified.submit.errorValidation"));
      return;
    }

    const parsed = submissionSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
      setErrors(fieldErrors);
      setFormError(t("verified.submit.errorValidation"));
      return;
    }

    setPhase("submitting");
    try {
      const res = await fetch("/api/verify/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();

      if (res.status === 202 || data.status === "pending-approval") {
        setSlug(data.slug ?? null);
        setPendingMessage(data.message ?? t("verified.submit.statePendingApproval"));
        setPhase("pending");
        return;
      }
      if (!res.ok || !data.ok) {
        setFormError(data.error || t("verified.submit.errorGeneric"));
        setPhase("form");
        return;
      }

      setSlug(data.slug ?? null);
      setDispatchId(data.dispatchId ?? null);
      setPhase("tracking");
      if (data.dispatchId) {
        pollStatus(data.dispatchId);
        pollRef.current = setInterval(() => pollStatus(data.dispatchId), 6000);
      }
    } catch {
      setFormError(t("verified.submit.errorGeneric"));
      setPhase("form");
    }
  }

  const err = (key: string) =>
    errors[key] ? <p className="mt-1 text-xs text-destructive">{errors[key]}</p> : null;

  // ---- Result views -------------------------------------------------------
  if (phase === "pending") {
    return (
      <ResultShell>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>{t("verified.submit.title")}</AlertTitle>
          <AlertDescription>{pendingMessage}</AlertDescription>
        </Alert>
      </ResultShell>
    );
  }

  if (phase === "tracking" || phase === "done") {
    const success = phase === "done" && conclusion === "success";
    const failure = phase === "done" && conclusion !== "success";
    return (
      <ResultShell>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {phase !== "done" && <Loader2 className="h-5 w-5 animate-spin" />}
              {success && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              {failure && <XCircle className="h-5 w-5 text-amber-600" />}
              {phase === "done"
                ? success
                  ? t("verified.submit.stateCompletedSuccess")
                  : t("verified.submit.stateCompletedFailure")
                : runState === "queued"
                ? t("verified.submit.stateQueued")
                : runState === "in_progress"
                ? t("verified.submit.stateInProgress")
                : runState === "completed"
                ? t("verified.submit.stateCompletedSuccess")
                : t("verified.submit.statePolling")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {dispatchId && (
              <p className="font-mono text-xs text-muted-foreground break-all">
                {dispatchId}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {runUrl && (
                <a
                  href={runUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {t("verified.submit.viewRun")}
                </a>
              )}
              {phase === "done" && success && slug && (
                <Link href={`/verified/${slug}`} className="text-primary hover:underline">
                  {t("verified.submit.viewReport")}
                </Link>
              )}
            </div>
            {phase === "done" && success && slug && (
              <div className="pt-2 border-t">
                <button
                  type="button"
                  disabled={pdfState === "generating"}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-50"
                  onClick={async () => {
                    setPdfState("generating");
                    try {
                      await downloadPdfForSlug(slug);
                      setPdfState("done");
                    } catch {
                      setPdfState("error");
                    }
                  }}
                >
                  <Download className="h-4 w-4" />
                  {pdfState === "generating"
                    ? t("verified.submit.pdfGenerating")
                    : pdfState === "done"
                    ? t("verified.submit.pdfDone")
                    : pdfState === "error"
                    ? t("verified.submit.pdfError")
                    : t("verified.submit.pdfDownload")}
                </button>
                {pdfState === "error" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("verified.submit.pdfErrorHint")}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </ResultShell>
    );
  }

  // ---- Form ---------------------------------------------------------------
  return (
    <div className="flex flex-col min-h-[60vh]">
      <div className="container mx-auto max-w-2xl px-4 py-8 flex-1">
        <PageTitle
          title={t("verified.submit.title")}
          description={t("verified.submit.subtitle")}
        />

        <div className="mt-6 space-y-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>{t("verified.submit.disclaimerSnapshot")}</AlertDescription>
          </Alert>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>{t("verified.submit.disclaimerNoSource")}</AlertDescription>
          </Alert>
        </div>

        {formError && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-8">
          {/* ── 1. Tool ─────────────────────────────────────────────── */}
          <Section title={t("verified.submit.sectionTool")}>
            <Field label={t("verified.submit.name")} required>
              <Input value={f.name} onChange={set("name")} placeholder="STRait Razor" />
              {err("tool.name")}
            </Field>
            <Field label={t("verified.submit.version")} required>
              <Input value={f.version} onChange={set("version")} placeholder="v3.0" />
              {err("tool.version")}
            </Field>
            <Field label={t("verified.submit.maintainer")} optional>
              <Input value={f.maintainer} onChange={set("maintainer")} />
            </Field>
            <Field label={t("verified.submit.contact")} optional>
              <Input value={f.contact} onChange={set("contact")} placeholder="https://github.com/owner/tool/issues" />
            </Field>
          </Section>

          {/* ── 2. Source ────────────────────────────────────────────── */}
          <Section title={t("verified.submit.sectionSource")} hint={t("verified.submit.sectionSourceHint")}>
            <Field label={t("verified.submit.repo")} required>
              <Input
                value={f.repo}
                onChange={set("repo")}
                placeholder="https://github.com/owner/tool"
              />
              {err("source.repo")}
            </Field>
            <Field
              label={t("verified.submit.ref")}
              required
              infoTooltip={t("verified.submit.refTooltip")}
              infoTooltipAria={t("verified.submit.refTooltipAria")}
            >
              <Input value={f.ref} onChange={set("ref")} placeholder="b618e93… or v3.0" />
              <p className="text-xs text-muted-foreground mt-1">{t("verified.submit.refHint")}</p>
              {err("source.ref")}
            </Field>
          </Section>

          {/* ── 3. Environment ───────────────────────────────────────── */}
          <Section title={t("verified.submit.sectionEnv")}>
            <Field
              label={t("verified.submit.dockerMode")}
              infoTooltip={t("verified.submit.dockerModeTooltip")}
              infoTooltipAria={t("verified.submit.dockerModeTooltipAria")}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={dockerMode === "generated"}
                    onChange={() => setDockerMode("generated")}
                  />
                  {t("verified.submit.dockerGenerated")}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={dockerMode === "provided"}
                    onChange={() => setDockerMode("provided")}
                  />
                  {t("verified.submit.dockerProvided")}
                </label>
              </div>
            </Field>

            {dockerMode === "generated" ? (
              <>
                <p className="text-xs text-muted-foreground">
                  {t("verified.submit.dockerGeneratedHint")}
                </p>
                <Field label={t("verified.submit.language")} required>
                  <Select value={f.language} onValueChange={(v) => setF((prev) => ({ ...prev, language: v }))}>
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUILD_LANGUAGES.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field
                  label={t("verified.submit.buildCmd")}
                  required
                  infoTooltip={t("verified.submit.buildCmdTooltip")}
                  infoTooltipAria={t("verified.submit.buildCmdTooltipAria")}
                >
                  <Input
                    value={f.buildCmd}
                    onChange={set("buildCmd")}
                    placeholder="pip install -r requirements.txt && pip install ."
                  />
                  {err("docker.build_cmd")}
                </Field>
                <Field
                  label={t("verified.submit.checkCmd")}
                  optional
                  infoTooltip={t("verified.submit.checkCmdTooltip")}
                  infoTooltipAria={t("verified.submit.checkCmdTooltipAria")}
                >
                  <Input value={f.checkCmd} onChange={set("checkCmd")} placeholder="mytool --help" />
                </Field>
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  {t("verified.submit.dockerProvidedHint")}
                </p>
                <Field label={t("verified.submit.dockerfile")} required>
                  <Textarea
                    value={f.dockerfile}
                    onChange={set("dockerfile")}
                    rows={10}
                    className="font-mono text-xs"
                    placeholder={"FROM python:3.11-slim\n…"}
                  />
                  {err("docker.dockerfile")}
                </Field>
              </>
            )}
          </Section>

          {/* ── 4. Input data (before Execution so user sees canonical paths first) */}
          <Section title={t("verified.submit.sectionInputs")} hint={t("verified.submit.sectionInputsHint")}>
            {/* STRhub reference datasets callout */}
            <div className="flex items-start gap-2 rounded-md border border-border bg-muted/50 px-3 py-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="space-y-2">
                <p className="font-medium text-foreground">{t("verified.submit.referenceDatasetsTitle")}</p>
                <p>{t("verified.submit.referenceDatasetsIntro3")}</p>
                <ul className="list-disc space-y-1 pl-4">
                  <li>
                    <strong>Illumina STR FASTQ</strong>: {t("verified.submit.referenceDatasetIllumina")}{" "}
                    <a
                      href="https://data.nist.gov/od/id/mds2-2157"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      NIST mds2-2157
                    </a>
                  </li>
                  <li>
                    <strong>ONT BAM (hg38)</strong>: {t("verified.submit.referenceDatasetOnt")}{" "}
                    <a
                      href="https://s3.amazonaws.com/1000g-ont/index.html?prefix=PROCESSED_DATA/ALIGNED_TO_HG38/MINIMAP2_ALIGNED_BAMS/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      1000 Genomes ONT
                    </a>
                  </li>
                  <li>
                    <strong>Illumina BAM (hg38)</strong>: {t("verified.submit.referenceDatasetIlluminaBamDesc")}{" "}
                    <a
                      href="https://www.internationalgenome.org/data-portal/data-collection/30x-grch38"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      1000 Genomes Illumina 30x
                    </a>
                  </li>
                </ul>
                <p>{t("verified.submit.referenceDatasetsScope")}</p>
              </div>
            </div>

            {/* Input type dropdown */}
            <Field label={t("verified.submit.inputType")}>
              <Select
                value={f.inputType || undefined}
                onValueChange={onInputTypeChange}
              >
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder={t("verified.submit.inputTypeSelect")} />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectGroup>
                    <SelectLabel>{t("verified.submit.inputTypeGroupWithReference")}</SelectLabel>
                    {INPUT_TYPES_WITH_REFERENCE.map((it) => (
                      <SelectItem key={it.slug} value={it.slug}>
                        {inputTypeOptionLabel(
                          it.label,
                          t,
                          "verified.submit.inputTypeSuffixWithReference",
                        )}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>{t("verified.submit.inputTypeGroupOwnOnly")}</SelectLabel>
                    {INPUT_TYPES_OWN_ONLY.map((it) => (
                      <SelectItem key={it.slug} value={it.slug}>
                        {inputTypeOptionLabel(
                          it.label,
                          t,
                          "verified.submit.inputTypeSuffixOwnOnly",
                        )}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>{t("verified.submit.inputTypeGroupAdvanced")}</SelectLabel>
                    <SelectItem value="__other__">{t("verified.submit.inputTypeOther")}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {selectedTypeInfo && INPUT_TYPE_DESC_KEYS[f.inputType] && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t(INPUT_TYPE_DESC_KEYS[f.inputType])}
                </p>
              )}
            </Field>

            {f.inputType === "__other__" && (
              <Field label={t("verified.submit.inputTypeCustom")} required>
                <Input
                  value={f.inputTypeCustom}
                  onChange={set("inputTypeCustom")}
                  placeholder="my-custom-type"
                />
                <p className="text-xs text-muted-foreground mt-1">{t("verified.submit.inputTypeCustomHint")}</p>
              </Field>
            )}

            {resolvedInputType && externalNoteMessage() && (
              <div className="flex items-start gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>{externalNoteMessage()}</span>
              </div>
            )}

            {selectedCanonicalPaths && selectedCanonicalPaths.length > 0 && (
              <div className="flex items-start gap-2 rounded-md border border-[#0099a3]/30 bg-[#0099a3]/5 px-3 py-3 text-xs">
                <Info className="h-4 w-4 mt-0.5 shrink-0 text-[#0099a3]" />
                <div className="space-y-2">
                  <p className="font-medium text-foreground">
                    {t("verified.submit.canonicalPathsTitle")}
                  </p>
                  <p className="text-muted-foreground">
                    {t("verified.submit.canonicalPathsDescription")}
                  </p>
                  <div className="flex flex-col gap-1">
                    {selectedCanonicalPaths.map((p) => (
                      <code key={p} className="font-mono text-[11px] text-muted-foreground bg-muted/70 rounded px-2 py-1">
                        {p}
                      </code>
                    ))}
                    <code className="font-mono text-[11px] text-muted-foreground bg-muted/70 rounded px-2 py-1">
                      /data/out/
                    </code>
                  </div>
                  {selectedRefGenome && (
                    <p className="text-muted-foreground text-[11px]">
                      {t("verified.submit.refGenomeNote", { assembly: selectedRefGenome.assembly })}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Fixture — test data (optional when STRhub has a reference dataset) */}
            <div className="pt-2 border-t border-border">
              <Field
                label={fixtureIsOptional
                  ? t("verified.submit.fixtureLabelRecommended")
                  : t("verified.submit.fixtureLabel")}
              >
                <p className="text-xs text-muted-foreground mb-2">
                  {fixtureIsOptional
                    ? t("verified.submit.fixtureExplainerOptional")
                    : t("verified.submit.fixtureExplainer")}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={fixtureSource === "same"}
                      onChange={() => setFixtureSource("same")}
                    />
                    {t("verified.submit.fixtureSameRepo")}
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={fixtureSource === "other"}
                      onChange={() => setFixtureSource("other")}
                    />
                    {t("verified.submit.fixtureOtherRepo")}
                  </label>
                </div>
              </Field>

              {fixtureSource === "same" ? (
                <>
                  {f.repo && (
                    <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                      <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>{t("verified.submit.fixtureSameRepoNote", { repo: f.repo, ref: f.ref || "…" })}</span>
                    </div>
                  )}
                  <Field
                    label={t("verified.submit.fixturePathInRepo")}
                    required={!fixtureIsOptional}
                    optional={fixtureIsOptional}
                    infoTooltip={t("verified.submit.fixturePathInRepoTooltip")}
                    infoTooltipAria={t("verified.submit.fixturePathInRepoTooltipAria")}
                  >
                    <Input
                      value={f.fixtureFilePath}
                      onChange={set("fixtureFilePath")}
                      placeholder="test/data/sample.fastq"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{t("verified.submit.fixturePathHint")}</p>
                    {err("inputs.fixture.path")}
                  </Field>
                </>
              ) : (
                <>
                  <Field label={t("verified.submit.fixtureRepo")} required={!fixtureIsOptional} optional={fixtureIsOptional}>
                    <Input
                      value={f.fixtureRepo}
                      onChange={set("fixtureRepo")}
                      placeholder="https://github.com/owner/test-data"
                    />
                    {err("inputs.fixture.repo")}
                  </Field>
                  <Field label={t("verified.submit.fixtureRef")} required={!fixtureIsOptional} optional={fixtureIsOptional}>
                    <Input value={f.fixtureRef} onChange={set("fixtureRef")} placeholder="main" />
                    {err("inputs.fixture.ref")}
                  </Field>
                  <Field
                    label={t("verified.submit.fixturePathInRepo")}
                    required={!fixtureIsOptional}
                    optional={fixtureIsOptional}
                    infoTooltip={t("verified.submit.fixturePathInRepoTooltip")}
                    infoTooltipAria={t("verified.submit.fixturePathInRepoTooltipAria")}
                  >
                    <Input
                      value={f.fixtureFilePath}
                      onChange={set("fixtureFilePath")}
                      placeholder="data/sample.fastq"
                    />
                    {err("inputs.fixture.path")}
                  </Field>
                </>
              )}
            </div>
          </Section>

          {/* ── 5. Execution ─────────────────────────────────────────── */}
          <Section title={t("verified.submit.sectionRun")}>
            <Field
              label={t("verified.submit.cmd")}
              required
              infoTooltip={t("verified.submit.cmdTooltip")}
              infoTooltipAria={t("verified.submit.cmdTooltipAria")}
            >
              <Textarea
                value={f.cmd}
                onChange={set("cmd")}
                rows={2}
                className="font-mono text-xs"
                placeholder={
                  selectedCanonicalPaths
                    ? `mytool ${selectedCanonicalPaths.join(" ")} --out /data/out/result.tsv`
                    : "mytool /data/in/sample.fastq --out /data/out/result.tsv"
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                {selectedRefGenome
                  ? t("verified.submit.cmdHintWithRef", { mountPath: selectedRefGenome.mountPath })
                  : t("verified.submit.cmdHint")}
              </p>
              {f.cmd.trim() !== "" && cmdLooksLikeTemplate && (
                <div className="mt-2 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{t("verified.submit.cmdReplaceMytool")}</span>
                </div>
              )}
              {err("run.cmd")}
            </Field>
            <Field label={t("verified.submit.timeout")}>
              <Input type="number" min={1} max={60} value={f.timeout} onChange={set("timeout")} />
              {err("run.timeout_minutes")}
            </Field>
          </Section>

          {/* ── 6. Outputs ───────────────────────────────────────────── */}
          <Section title={t("verified.submit.sectionOutputs")} hint={t("verified.submit.sectionOutputsHint")}>
            <Field
              label={t("verified.submit.outputPath")}
              required
              infoTooltip={t("verified.submit.outputPathTooltip")}
              infoTooltipAria={t("verified.submit.outputPathTooltipAria")}
            >
              <Input value={f.outputPath} onChange={set("outputPath")} placeholder="*.allsequences.txt" />
              <p className="text-xs text-muted-foreground mt-1">{t("verified.submit.outputPathHint")}</p>
              {err("outputs.0.path")}
            </Field>
            <Field
              label={t("verified.submit.outputFormat")}
              required
              infoTooltip={t("verified.submit.outputFormatTooltip")}
              infoTooltipAria={t("verified.submit.outputFormatTooltipAria")}
            >
              <Select
                value={f.outputFormat}
                onValueChange={(v) => setF((prev) => ({ ...prev, outputFormat: v }))}
              >
                <SelectTrigger className="h-11 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OUTPUT_FORMATS.map((fmt) => (
                    <SelectItem key={fmt} value={fmt}>
                      {t(`verified.submit.outputFormatOptions.${fmt}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">{t("verified.submit.outputFormatHint")}</p>
            </Field>
            <Field label={t("verified.submit.minRecords")}>
              <Input type="number" min={0} value={f.minRecords} onChange={set("minRecords")} />
            </Field>

            <div className="flex items-center gap-1.5 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showContent}
                  onChange={(e) => setShowContent(e.target.checked)}
                />
                {t("verified.submit.contentToggle")}
              </label>
              <InfoTooltipIcon
                tooltip={t("verified.submit.contentToggleTooltip")}
                ariaLabel={t("verified.submit.contentToggleTooltipAria")}
              />
            </div>
            {showContent && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="columns">
                  <Input type="number" value={f.columns} onChange={set("columns")} />
                </Field>
                <Field label="dna_column">
                  <Input type="number" value={f.dnaColumn} onChange={set("dnaColumn")} />
                </Field>
                <Field label="count_columns">
                  <Input value={f.countColumns} onChange={set("countColumns")} placeholder="3, 4" />
                </Field>
                <Field label="locus_column">
                  <Input type="number" value={f.locusColumn} onChange={set("locusColumn")} />
                </Field>
                <Field label="min_distinct_loci">
                  <Input type="number" value={f.minDistinctLoci} onChange={set("minDistinctLoci")} />
                </Field>
                <Field label="min_total_reads">
                  <Input type="number" value={f.minTotalReads} onChange={set("minTotalReads")} />
                </Field>
                <div className="col-span-2">
                  <Field label="expect_loci">
                    <Input
                      value={f.expectLoci}
                      onChange={set("expectLoci")}
                      placeholder="CSF1PO, TH01, TPOX, vWA, FGA"
                    />
                  </Field>
                </div>
              </div>
            )}
          </Section>

          <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto">
            {phase === "submitting" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("verified.submit.submitting")}
              </>
            ) : (
              t("verified.submit.submit")
            )}
          </Button>
        </form>
      </div>
      <SiteFooter />
    </div>
  );
}

function ResultShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-[60vh]">
      <div className="container mx-auto max-w-2xl px-4 py-12 flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold">{title}</legend>
      {hint && <p className="text-sm text-muted-foreground -mt-2">{hint}</p>}
      {children}
    </fieldset>
  );
}

function InfoTooltipIcon({ tooltip, ariaLabel }: { tooltip: string; ariaLabel?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex rounded-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={ariaLabel ?? tooltip}
        >
          <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-sm text-left leading-relaxed">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function Field({
  label,
  required,
  optional,
  infoTooltip,
  infoTooltipAria,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  infoTooltip?: string;
  infoTooltipAria?: string;
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-1.5">
      <Label className="text-sm inline-flex items-center gap-1.5">
        <span>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
          {optional && (
            <span className="ml-1 text-xs text-muted-foreground">
              ({t("verified.submit.optional")})
            </span>
          )}
        </span>
        {infoTooltip && (
          <InfoTooltipIcon tooltip={infoTooltip} ariaLabel={infoTooltipAria} />
        )}
      </Label>
      {children}
    </div>
  );
}
