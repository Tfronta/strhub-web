"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShieldCheck, AlertTriangle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageTitle } from "@/components/page-title";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/contexts/language-context";
import {
  submissionSchema,
  OUTPUT_FORMATS,
  BUILD_LANGUAGES,
  type SubmissionInput,
} from "@/lib/verified/submission";

type Phase = "form" | "submitting" | "pending" | "tracking" | "done";
type RunState = "pending" | "queued" | "in_progress" | "completed";

const SELECT_CLASS =
  "flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

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

export function VerifiedSubmitForm() {
  const { t } = useLanguage();

  const [phase, setPhase] = useState<Phase>("form");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [dockerMode, setDockerMode] = useState<"generated" | "provided">("generated");
  const [fixtureMode, setFixtureMode] = useState<"remote" | "local">("remote");
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
    fixturePath: "",
    fixtureRepo: "",
    fixtureRef: "",
    fixtureFilePath: "",
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
        type: f.inputType || undefined,
        fixture:
          fixtureMode === "remote"
            ? { repo: f.fixtureRepo, ref: f.fixtureRef, path: f.fixtureFilePath }
            : f.fixturePath,
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
          <ShieldCheck className="h-4 w-4" />
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
            <ShieldCheck className="h-4 w-4" />
            <AlertDescription>{t("verified.submit.disclaimerSnapshot")}</AlertDescription>
          </Alert>
          <Alert>
            <ShieldCheck className="h-4 w-4" />
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
          <Section title={t("verified.submit.sectionTool")}>
            <Field label={t("verified.submit.name")} required>
              <Input value={f.name} onChange={set("name")} />
              {err("tool.name")}
            </Field>
            <Field label={t("verified.submit.version")} required>
              <Input value={f.version} onChange={set("version")} placeholder="v1.0" />
              {err("tool.version")}
            </Field>
            <Field label={t("verified.submit.maintainer")} optional>
              <Input value={f.maintainer} onChange={set("maintainer")} />
            </Field>
            <Field label={t("verified.submit.contact")} optional>
              <Input value={f.contact} onChange={set("contact")} />
            </Field>
          </Section>

          <Section title={t("verified.submit.sectionSource")}>
            <Field label={t("verified.submit.repo")} required>
              <Input
                value={f.repo}
                onChange={set("repo")}
                placeholder="https://github.com/owner/tool"
              />
              {err("source.repo")}
            </Field>
            <Field label={t("verified.submit.ref")} required>
              <Input value={f.ref} onChange={set("ref")} placeholder="9f2c1ab… or v1.0" />
              {err("source.ref")}
            </Field>
          </Section>

          <Section title={t("verified.submit.sectionEnv")}>
            <Field label={t("verified.submit.dockerMode")}>
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
                  <select className={SELECT_CLASS} value={f.language} onChange={set("language")}>
                    {BUILD_LANGUAGES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("verified.submit.buildCmd")} required>
                  <Input
                    value={f.buildCmd}
                    onChange={set("buildCmd")}
                    placeholder="pip install -r requirements.txt && pip install ."
                  />
                  {err("docker.build_cmd")}
                </Field>
                <Field label={t("verified.submit.checkCmd")} optional>
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

          <Section title={t("verified.submit.sectionRun")}>
            <Field label={t("verified.submit.cmd")} required>
              <Textarea
                value={f.cmd}
                onChange={set("cmd")}
                rows={2}
                className="font-mono text-xs"
                placeholder="mytool --input /data/in/sample.fastq --out /data/out/result.tsv"
              />
              {err("run.cmd")}
            </Field>
            <Field label={t("verified.submit.timeout")}>
              <Input type="number" min={1} max={60} value={f.timeout} onChange={set("timeout")} />
              {err("run.timeout_minutes")}
            </Field>
          </Section>

          <Section title={t("verified.submit.sectionInputs")}>
            <Field label={t("verified.submit.inputType")} optional>
              <Input
                value={f.inputType}
                onChange={set("inputType")}
                placeholder={t("verified.submit.inputTypePlaceholder")}
              />
            </Field>
            <Field label={t("verified.submit.fixtureMode")}>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={fixtureMode === "remote"}
                    onChange={() => setFixtureMode("remote")}
                  />
                  {t("verified.submit.fixtureRemote")}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={fixtureMode === "local"}
                    onChange={() => setFixtureMode("local")}
                  />
                  {t("verified.submit.fixtureLocal")}
                </label>
              </div>
            </Field>
            {fixtureMode === "remote" ? (
              <>
                <Field label={t("verified.submit.fixtureRepo")} required>
                  <Input
                    value={f.fixtureRepo}
                    onChange={set("fixtureRepo")}
                    placeholder="https://github.com/owner/tool"
                  />
                  {err("inputs.fixture.repo")}
                </Field>
                <Field label={t("verified.submit.fixtureRef")} required>
                  <Input value={f.fixtureRef} onChange={set("fixtureRef")} />
                  {err("inputs.fixture.ref")}
                </Field>
                <Field label={t("verified.submit.fixtureFilePath")} required>
                  <Input
                    value={f.fixtureFilePath}
                    onChange={set("fixtureFilePath")}
                    placeholder="examples/sample.fastq"
                  />
                  {err("inputs.fixture.path")}
                </Field>
              </>
            ) : (
              <Field label={t("verified.submit.fixturePath")} required>
                <Input
                  value={f.fixturePath}
                  onChange={set("fixturePath")}
                  placeholder="fixtures/example"
                />
                {err("inputs.fixture")}
              </Field>
            )}
          </Section>

          <Section title={t("verified.submit.sectionOutputs")}>
            <Field label={t("verified.submit.outputPath")} required>
              <Input value={f.outputPath} onChange={set("outputPath")} placeholder="*.tsv" />
              {err("outputs.0.path")}
            </Field>
            <Field label={t("verified.submit.outputFormat")} required>
              <select className={SELECT_CLASS} value={f.outputFormat} onChange={set("outputFormat")}>
                {OUTPUT_FORMATS.map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {fmt}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("verified.submit.minRecords")}>
              <Input type="number" min={0} value={f.minRecords} onChange={set("minRecords")} />
            </Field>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showContent}
                onChange={(e) => setShowContent(e.target.checked)}
              />
              {t("verified.submit.contentToggle")}
            </label>
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

          <Button type="submit" disabled={phase === "submitting"} className="w-full sm:w-auto">
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  required,
  optional,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
        {optional && (
          <span className="ml-1 text-xs text-muted-foreground">
            ({t("verified.submit.optional")})
          </span>
        )}
      </Label>
      {children}
    </div>
  );
}
