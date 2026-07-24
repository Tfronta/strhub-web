"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Loader2, CheckCircle2, XCircle, Info, Download, Upload, ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
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
import {
  parseBed3,
  validateRegions,
  looksLikeUnconvertedPanel,
  fetchPanel,
  panelUrl,
  type BedInterval,
  type RegionsValidation,
} from "@/lib/verified/validate-regions";
import {
  COMPATIBILITY_FLAGS,
  declaredIncompatibilities,
  type CompatibilityAnswers,
} from "@/lib/verified/manual";

type Phase = "form" | "submitting" | "pending" | "tracking" | "done";
type RunState = "pending" | "queued" | "in_progress" | "completed";

const INPUT_TYPE_DESC_KEYS: Record<string, string> = {
  "illumina-str-fastq": "verified.submit.inputTypeDescIlluminaStrFastq",
  "ont-bam-hg38": "verified.submit.inputTypeDescOntBamHg38",
  "illumina-bam-hg38": "verified.submit.inputTypeDescIlluminaBamHg38",
  "illumina-bam-hg38-y": "verified.submit.inputTypeDescIlluminaBamHg38Y",
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

const FORM_STORAGE_KEY = "strhub-verified-submit-form";

interface StoredFormState {
  f: typeof INITIAL_F;
  dockerMode: "generated" | "provided";
  fixtureSource: "same" | "other";
  showContent: boolean;
}

const INITIAL_F = {
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
  columns: "",
  dnaColumn: "",
  countColumns: "",
  locusColumn: "",
  minDistinctLoci: "",
  expectLoci: "",
  minTotalReads: "",
};

function saveFormState(state: StoredFormState) {
  try {
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota exceeded or SSR */ }
}

function loadFormState(): StoredFormState | null {
  try {
    const raw = sessionStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredFormState;
  } catch {
    return null;
  }
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

/** Fetch the README from a GitHub repo and extract CLI command candidates. */
async function fetchCmdFromReadme(
  repoUrl: string,
  ref: string,
  toolName: string,
  canonicalPaths: string[] | undefined,
): Promise<string[]> {
  const m = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/);
  if (!m) return [];
  const slug = m[1].replace(/\.git$/, "");

  let readme = "";
  for (const name of ["README.md", "readme.md", "README.rst"]) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${slug}/${ref}/${name}`,
      );
      if (res.ok) {
        readme = await res.text();
        break;
      }
    } catch {
      continue;
    }
  }
  if (!readme) return [];

  const rawLines: string[] = [];
  const blockRe = /```[^\n]*\n([\s\S]*?)```/g;
  let bm;
  while ((bm = blockRe.exec(readme)) !== null) {
    for (const l of bm[1].split("\n")) rawLines.push(l.replace(/^\$\s*/, ""));
  }
  for (const l of readme.split("\n")) {
    if (/^( {4}|\t)\S/.test(l)) rawLines.push(l);
  }
  const lines: string[] = [];
  for (const raw of rawLines) {
    if (!raw.trim()) continue;
    if (/^\s/.test(raw) && lines.length > 0) {
      lines[lines.length - 1] += " " + raw.trim();
    } else {
      lines.push(raw.trim());
    }
  }

  const tl = toolName.toLowerCase();
  const seen = new Set<string>();
  const candidates: string[] = [];
  for (const raw of lines) {
    if (!raw || raw.startsWith("#")) continue;
    const lower = raw.toLowerCase();
    if (!(lower.includes(tl) || lower.startsWith("./"))) continue;
    if (!raw.includes("--")) continue;
    if (seen.has(raw)) continue;
    seen.add(raw);
    candidates.push(raw);
  }
  if (!candidates.length) return [];

  const bamPath = canonicalPaths?.find((p) => p.endsWith(".bam")) ?? "/data/in/input.bam";
  const fqPath = canonicalPaths?.find((p) => p.endsWith(".fastq")) ?? "/data/in/sample.fastq";
  const refPath = canonicalPaths?.find((p) => p.startsWith("/data/ref/")) ?? "";

  const results: string[] = [];
  const seenResult = new Set<string>();
  for (const cmd of candidates) {
    let a = cmd.replace(/^\.\//, "").replace(/\s{2,}/g, " ");
    a = a.replace(/(--bams?\s+)\S+/gi, `$1${bamPath}`);
    a = a.replace(/(--input\s+)\S+/gi, `$1${bamPath || fqPath}`);
    if (refPath) {
      a = a.replace(/(--fasta\s+)\S+/gi, `$1${refPath}`);
      a = a.replace(/(--ref(?:erence)?\s+)\S+\.fa\S*/gi, `$1${refPath}`);
    }
    a = a.replace(/(--regions\s+)\S+/gi, "$1/data/in/regions.bed");
    a = a.replace(/(--str-vcf\s+)\S+/gi, "$1/data/out/result.vcf.gz");
    a = a.replace(/(--vcf\s+)\S+/gi, "$1/data/out/result.vcf");
    a = a.replace(/(--out(?:put)?\s+)\S+/gi, "$1/data/out/result.tsv");
    a = a.replace(/(-o\s+)\S+\.\w+/gi, "$1/data/out/result.tsv");
    if (!seenResult.has(a)) { seenResult.add(a); results.push(a); }
    if (results.length >= 3) break;
  }
  return results;
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

type ContentFields = Pick<
  typeof INITIAL_F,
  "columns" | "dnaColumn" | "countColumns" | "locusColumn" | "minDistinctLoci" | "expectLoci" | "minTotalReads"
>;

const EMPTY_CONTENT: ContentFields = {
  columns: "",
  dnaColumn: "",
  countColumns: "",
  locusColumn: "",
  minDistinctLoci: "",
  expectLoci: "",
  minTotalReads: "",
};

const CONTENT_FIELD_KEYS = Object.keys(EMPTY_CONTENT) as (keyof ContentFields)[];

function assayFamily(inputType: string): "autosomal" | "y-str" | "snp" | "other" {
  if (inputType === "illumina-bam-hg38-y") return "y-str";
  if (["illumina-str-fastq", "illumina-bam-hg38", "ont-bam-hg38", "ont-fastq"].includes(inputType))
    return "autosomal";
  if (inputType === "illumina-snp-fastq") return "snp";
  return "other";
}

/**
 * Recommended content-plausibility defaults for a given output format + assay.
 * Deliberately conservative: it sets only checks that reliably pass on real STR
 * output — the locus column (position depends on format), a modest distinct-loci
 * floor (by assay family), and the universally-present core loci for known
 * families. It never guesses tool-specific column layout
 * (columns/dna_column/count_columns): a wrong guess there fails the gate
 * spuriously. Authors can tighten any field; a blank field is skipped.
 */
function recommendedContent(format: string, inputType: string): ContentFields {
  // JSON is not line/column parseable by the content harness → no defaults.
  if (format === "json") return { ...EMPTY_CONTENT };
  const family = assayFamily(inputType);
  const isTable = format === "tsv" || format === "csv" || format === "text";
  const locusColumn = format === "vcf" ? "2" : "0";
  const minDistinctLoci =
    family === "y-str" ? "5" : family === "snp" ? "1" : family === "autosomal" ? "8" : "5";
  // expect_loci requires ALL listed to be present, so only prefill it for
  // table formats (where the locus column carries the marker name) and known
  // families, using the smallest universally-present core set.
  const expectLoci =
    !isTable
      ? ""
      : family === "autosomal"
        ? "CSF1PO, TH01, TPOX, vWA, FGA"
        : family === "y-str"
          ? "DYS391, DYS390, DYS392, DYS393"
          : "";
  return { ...EMPTY_CONTENT, locusColumn, minDistinctLoci, expectLoci };
}

async function downloadPdfForSlug(reportSlug: string) {
  const base =
    process.env.NEXT_PUBLIC_VERIFIED_BASE ??
    "https://raw.githubusercontent.com/Tfronta/strhub-verified/gh-pages";

  const [jsonRes, pdfRes] = await Promise.all([
    fetch(`${base}/${reportSlug}.json`),
    fetch(`${base}/${reportSlug}.pdf`),
  ]);
  if (!jsonRes.ok) throw new Error("Report not available yet");
  if (!pdfRes.ok) throw new Error("PDF not available yet");

  const report = await jsonRes.json();
  const blob = await pdfRes.blob();
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

  // Pre-flight answers (level-2 trigger A). Defaults to all-unticked: the common
  // case is a tool that runs fine, and nobody should have to opt out of a paid tier.
  const [compat, setCompat] = useState<CompatibilityAnswers>({});

  const [dockerMode, setDockerMode] = useState<"generated" | "provided">("generated");
  const [fixtureSource, setFixtureSource] = useState<"same" | "other">("same");
  // Supported-loci panel for the selected BAM dataset, plus the live check of the
  // author's uploaded BED against it. Checking here — before dispatch — is what
  // keeps a slice-incompatible BED from burning a CI run just to be told no.
  //
  // The BED lives outside `f` (and out of sessionStorage): it can be large, and a
  // File's contents don't survive a reload anyway, so persisting the name would
  // only mislead.
  const [panel, setPanel] = useState<BedInterval[] | null>(null);
  const [panelState, setPanelState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [regionsBed, setRegionsBed] = useState<string>("");
  const [regionsFileName, setRegionsFileName] = useState<string>("");
  const [regionsCheck, setRegionsCheck] = useState<RegionsValidation | null>(null);
  // Non-blocking: true when the upload looks like our panel handed back unconverted.
  const [regionsUnconverted, setRegionsUnconverted] = useState(false);
  // Two owners on purpose: `regionsFileError` is the read stage (gzip/binary), set
  // by onRegionsFile; `regionsError` is the parse/panel stage, owned by the effect
  // below. Merging them let the effect wipe a gzip error when regionsBed reset to "".
  const [regionsFileError, setRegionsFileError] = useState<string | null>(null);
  const [regionsError, setRegionsError] = useState<string | null>(null);

  // Content plausibility checks are on by default with recommended defaults so
  // authors earn the "Plausible output" badge without knowing STRhub internals.
  const [showContent, setShowContent] = useState(true);
  // Becomes true once the author edits a content field, so we stop
  // auto-managing the recommended defaults and preserve their edits.
  const [contentDirty, setContentDirty] = useState(false);
  // Gate the defaults effect until sessionStorage restore has run.
  const [hydrated, setHydrated] = useState(false);
  const [showParams, setShowParams] = useState(false);

  // Result state.
  const [slug, setSlug] = useState<string | null>(null);
  const [dispatchId, setDispatchId] = useState<string | null>(null);
  const [runState, setRunState] = useState<RunState>("pending");
  const [conclusion, setConclusion] = useState<string | null>(null);
  const [runUrl, setRunUrl] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  // Form fields (controlled).
  const [f, setF] = useState(INITIAL_F);

  // Restore form state from sessionStorage on mount.
  const didRestore = useRef(false);
  useEffect(() => {
    if (didRestore.current) return;
    didRestore.current = true;
    const stored = loadFormState();
    if (stored) {
      setF(stored.f);
      setDockerMode(stored.dockerMode);
      setFixtureSource(stored.fixtureSource);
      setShowContent(stored.showContent);
      // Treat restored non-empty content as author-owned so the defaults effect
      // does not overwrite it.
      if (CONTENT_FIELD_KEYS.some((k) => (stored.f[k] ?? "").trim() !== "")) {
        setContentDirty(true);
      }
    }
    setHydrated(true);
  }, []);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  // Editing any content field switches off auto-managed defaults.
  const setContent = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentDirty(true);
    setF((prev) => ({ ...prev, [k]: e.target.value }));
  };

  const resolvedInputType =
    f.inputType === "__other__" ? f.inputTypeCustom : f.inputType;

  // Keep content fields in sync with recommended defaults for the chosen output
  // format + assay, until the author takes over (contentDirty) or turns the
  // section off. Full overwrite so switching format/assay updates cleanly.
  useEffect(() => {
    if (!hydrated || !showContent || contentDirty) return;
    setF((prev) => ({ ...prev, ...recommendedContent(prev.outputFormat, resolvedInputType) }));
  }, [hydrated, showContent, contentDirty, f.outputFormat, resolvedInputType]);

  const resetContentDefaults = () => {
    setContentDirty(false);
    setF((prev) => ({ ...prev, ...recommendedContent(prev.outputFormat, resolvedInputType) }));
  };

  const selectedTypeInfo = INPUT_TYPES.find((t) => t.slug === f.inputType);
  const selectedRefGenome = selectedTypeInfo?.referenceGenome ?? null;
  const selectedCanonicalPaths = selectedTypeInfo?.canonicalPaths ?? null;
  const fixtureIsOptional = selectedTypeInfo?.hasExternalDataset === true;
  const cmdLooksLikeTemplate = f.cmd === "" || f.cmd.startsWith(CMD_TEMPLATE_PREFIX);

  // Coordinate-based tools (BAM in, HipSTR/GangSTR-style) must supply their own
  // regions BED: only the author knows their tool's column layout. STRhub supplies
  // the coordinates (the downloadable panel); the author supplies the format.
  const needsRegions = selectedTypeInfo?.requiresRegions === true;

  const [cmdSuggestions, setCmdSuggestions] = useState<string[]>([]);
  const [fetchingReadme, setFetchingReadme] = useState(false);

  useEffect(() => {
    if (!f.repo || !f.ref || !f.inputType || !f.name) {
      setCmdSuggestions([]);
      return;
    }
    let cancelled = false;
    setFetchingReadme(true);
    fetchCmdFromReadme(f.repo, f.ref, f.name, selectedCanonicalPaths ?? undefined)
      .then((s) => { if (!cancelled) setCmdSuggestions(s); })
      .catch(() => { if (!cancelled) setCmdSuggestions([]); })
      .finally(() => { if (!cancelled) setFetchingReadme(false); });
    return () => { cancelled = true; };
  }, [f.repo, f.ref, f.inputType, f.name, selectedCanonicalPaths]);

  // Load the supported-loci panel for the selected dataset. It drives the loci
  // list, the download, and the live check below.
  useEffect(() => {
    if (!needsRegions || !f.inputType) {
      setPanel(null);
      setPanelState("idle");
      return;
    }
    let cancelled = false;
    setPanelState("loading");
    fetchPanel(f.inputType)
      .then((p) => {
        if (cancelled) return;
        setPanel(p);
        setPanelState(p ? "ready" : "error");
      })
      .catch(() => {
        if (cancelled) return;
        setPanel(null);
        setPanelState("error");
      });
    return () => { cancelled = true; };
  }, [needsRegions, f.inputType]);

  // Check the uploaded BED against the panel. Local and synchronous now that the
  // file's text is in hand — no fetch, no debounce.
  useEffect(() => {
    setRegionsCheck(null);
    setRegionsError(null);
    setRegionsUnconverted(false);
    if (!needsRegions || !panel || !regionsBed) return;
    try {
      const rows = parseBed3(regionsBed);
      setRegionsCheck(validateRegions(rows, panel, selectedTypeInfo?.minLoci ?? 5));
      setRegionsUnconverted(looksLikeUnconvertedPanel(rows, panel));
    } catch (e) {
      setRegionsError(
        e instanceof Error && e.message.startsWith("line ")
          ? `${t("verified.submit.regionsMalformed")} ${e.message}`
          : t("verified.submit.regionsMalformedGeneric"),
      );
    }
  }, [needsRegions, panel, regionsBed, selectedTypeInfo, t]);

  /** Read a chosen BED file into state. Rejects binary/gzip early with a clear note. */
  async function onRegionsFile(file: File | undefined) {
    if (!file) return;
    setRegionsFileName(file.name);
    setRegionsFileError(null);
    // gzip magic bytes 1f 8b — the single most common upload mistake (HipSTR ships
    // its reference gzipped). Catch it before it reads as mojibake.
    const head = new Uint8Array(await file.slice(0, 2).arrayBuffer());
    if (head[0] === 0x1f && head[1] === 0x8b) {
      setRegionsBed("");
      setRegionsFileError(t("verified.submit.regionsGzip"));
      return;
    }
    setRegionsBed(await file.text());
  }

  function onInputTypeChange(value: string) {
    const entry = INPUT_TYPES.find((t) => t.slug === value);
    const template = buildCmdTemplate(entry);
    setF((prev) => ({
      ...prev,
      inputType: value,
      ...(isCmdTemplate(prev.cmd) && template ? { cmd: template } : {}),
    }));
  }

  // Pre-flight (level-2 trigger A). Each answer is a property of the TOOL that
  // the free runner cannot provide, so a "yes" means the automated path is
  // structurally impossible — not that the author needs help. Blocking submit
  // here is the same courtesy as the regions check above: it spares them a CI
  // run whose only possible outcome is the failure they just described.
  const declaredIncompat = declaredIncompatibilities(compat);
  const preflightBlocks = declaredIncompat.length > 0;

  const canSubmit =
    phase === "form" &&
    !preflightBlocks &&
    f.name.trim() !== "" &&
    f.version.trim() !== "" &&
    f.repo.trim() !== "" &&
    f.ref.trim() !== "" &&
    (dockerMode === "generated" ? f.buildCmd.trim() !== "" : f.dockerfile.trim().length >= 10) &&
    f.cmd.trim() !== "" &&
    !cmdLooksLikeTemplate &&
    f.inputType !== "" &&
    (fixtureIsOptional || f.fixtureFilePath.trim() !== "") &&
    f.outputPath.trim() !== "" &&
    // A coordinate-based tool needs an uploaded regions BED that clears the panel
    // check. Blocking here spares the author a CI run that would only reject it.
    (!needsRegions || (regionsBed !== "" && regionsCheck?.ok === true));

  function externalNoteMessage(): string | null {
    if (!resolvedInputType) return null;
    if (resolvedInputType === "illumina-str-fastq") return t("verified.submit.externalNoteIllumina");
    if (resolvedInputType === "ont-bam-hg38") return t("verified.submit.externalNoteOnt");
    if (resolvedInputType === "illumina-bam-hg38") return t("verified.submit.externalNoteIlluminaBam");
    if (resolvedInputType === "illumina-bam-hg38-y") return t("verified.submit.externalNoteIlluminaBamY");
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

    const regions_bed = needsRegions && regionsBed !== "" ? regionsBed : undefined;

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
        regions_bed,
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
      // Only the ticked flags travel; an all-false block would be noise in every
      // manifest. Carried through so the engine can stamp level-2 eligibility
      // from the author's own declaration rather than the web deciding it.
      compatibility: preflightBlocks
        ? Object.fromEntries(declaredIncompat.map((flag) => [flag, true]))
        : undefined,
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

    if (needsRegions && !payload.inputs.regions_bed) {
      setFormError(t("verified.submit.regionsRequiredError"));
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

    saveFormState({ f, dockerMode, fixtureSource, showContent });
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

  function handleResubmit() {
    if (pollRef.current) clearInterval(pollRef.current);
    setPhase("form");
    setFormError(null);
    setErrors({});
    setRunState("pending");
    setConclusion(null);
    setRunUrl(null);
    setDispatchId(null);
    setPendingMessage(null);
    setPdfState("idle");
    setShowParams(false);
  }

  const submissionParamsProps = {
    f,
    dockerMode,
    fixtureSource,
    regionsFileName,
    showParams,
    onToggle: () => setShowParams((v) => !v),
    onResubmit: handleResubmit,
    t,
  };

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
        <SubmissionParams {...submissionParamsProps} />
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
        <SubmissionParams {...submissionParamsProps} />
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

          {/* ── PRE-FLIGHT (level-2 trigger A) ──
              Second, right after naming the tool. It sat at the end at first, so
              that a rarely-needed paid tier would not read as a normal route, but
              that traded a presentation worry for a real cost: an author whose
              tool needs a GPU filled in twenty fields before being told none of
              it could run. Asking here costs them the tool name and nothing else.

              Every question is about the TOOL, never about how the author is
              getting on with this form. Form trouble is our bug to fix, and is
              helped for free. */}
          <Section
            title={t("verified.submit.preflightTitle")}
            hint={t("verified.submit.preflightHint")}
          >
            <div className="space-y-2">
              {COMPATIBILITY_FLAGS.map((flag) => (
                <label
                  key={flag}
                  className="flex cursor-pointer items-start gap-3 rounded-md p-2 text-sm hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                    checked={Boolean(compat[flag])}
                    onChange={(e) =>
                      setCompat((prev) => ({ ...prev, [flag]: e.target.checked }))
                    }
                  />
                  <span>{t(`verified.submit.preflight.${flag}`)}</span>
                </label>
              ))}
            </div>

            {preflightBlocks && (
              <Alert>
                <AlertTitle>{t("verified.submit.preflightBlockedTitle")}</AlertTitle>
                <AlertDescription className="space-y-3">
                  <p>{t("verified.submit.preflightBlockedBody")}</p>
                  <Link
                    href={`/verified/manual?declared=${encodeURIComponent(
                      declaredIncompat[0],
                    )}`}
                    className="inline-flex font-medium text-primary hover:underline"
                  >
                    {t("verified.manual.cta")}
                  </Link>
                </AlertDescription>
              </Alert>
            )}
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
                <p>{t("verified.submit.referenceDatasetsIntro4")}</p>
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
                    <strong>Illumina BAM (hg38), autosomal</strong>: {t("verified.submit.referenceDatasetIlluminaBamDesc")}{" "}
                    <a
                      href="https://ftp-trace.ncbi.nlm.nih.gov/ReferenceSamples/giab/data/NA12878/NIST_NA12878_HG001_HiSeq_300x/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      GIAB NA12878 300x
                    </a>
                  </li>
                  <li>
                    <strong>Illumina BAM (hg38), Y-STR</strong>: {t("verified.submit.referenceDatasetIlluminaBamYDesc")}{" "}
                    <a
                      href="https://ftp-trace.ncbi.nlm.nih.gov/ReferenceSamples/giab/data/AshkenazimTrio/HG002_NA24385_son/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      GIAB HG002 300x
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

            {/* Regions BED — required for coordinate-based tools. STRhub owns the
                coordinates (its BAM is a slice); the author owns the BED format. */}
            {needsRegions && (
              <div className="pt-2 border-t border-border space-y-4">
                <Field label={t("verified.submit.regionsLabel")} required>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("verified.submit.regionsExplainer")}
                  </p>
                </Field>

                {/* The panel: what the slice actually covers, downloadable. */}
                <div className="rounded-md border border-[#0099a3]/30 bg-[#0099a3]/5 px-3 py-3 text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 shrink-0 text-[#0099a3]" />
                    <div className="space-y-2 min-w-0 flex-1">
                      <p className="font-medium text-foreground">
                        {t("verified.submit.supportedLociTitle", {
                          count: String(selectedTypeInfo?.supportedLoci?.length ?? 0),
                        })}
                      </p>
                      <p className="text-muted-foreground">
                        {t("verified.submit.supportedLociExplainer")}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {(selectedTypeInfo?.supportedLoci ?? []).map((l) => (
                          <code
                            key={l}
                            className="font-mono text-[10px] bg-muted/70 rounded px-1.5 py-0.5 text-muted-foreground"
                          >
                            {l}
                          </code>
                        ))}
                      </div>
                      <a
                        href={panelUrl(f.inputType)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {t("verified.submit.supportedLociDownload")}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Upload the converted BED. */}
                <Field label={t("verified.submit.regionsUploadLabel")} required>
                  <label className="flex items-center gap-3 cursor-pointer rounded-md border border-dashed border-border px-4 py-3 text-sm hover:bg-muted/40 transition-colors">
                    <Upload className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {regionsFileName || t("verified.submit.regionsUploadPlaceholder")}
                    </span>
                    <input
                      type="file"
                      accept=".bed,.txt,text/plain"
                      className="sr-only"
                      onChange={(e) => onRegionsFile(e.target.files?.[0])}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("verified.submit.regionsUploadHint")}
                  </p>
                </Field>

                {/* Nudge, not a requirement: keeping the BED in the tool's own repo
                    helps the tool's future users. STRhub doesn't fetch or validate
                    that copy — verification uses the upload above. */}
                <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                  <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{t("verified.submit.regionsRepoTip")}</span>
                </div>

                {/* Live verdict against the panel. */}
                {panelState === "loading" && (
                  <p className="text-xs text-muted-foreground animate-pulse">
                    {t("verified.submit.panelLoading")}
                  </p>
                )}
                {panelState === "error" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {t("verified.submit.panelError")}
                    </AlertDescription>
                  </Alert>
                )}
                {(regionsFileError || regionsError) && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {regionsFileError || regionsError}
                    </AlertDescription>
                  </Alert>
                )}
                {/* Non-blocking: the coordinates are ours, so the check passes, but
                    the columns are still ours too — the author hasn't converted to
                    their tool's format. The real tool would reject it. Warn, don't
                    block: a genuine BED4 tool could carry locus names legitimately. */}
                {regionsUnconverted && !regionsFileError && !regionsError && (
                  <div className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{t("verified.submit.regionsUnconverted")}</span>
                  </div>
                )}
                {regionsCheck && !regionsFileError && !regionsError && (
                  regionsCheck.ok ? (
                    <div className="flex items-start gap-2 rounded-md border border-emerald-600/40 bg-emerald-600/10 px-3 py-2 text-xs text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>
                        {t("verified.submit.regionsOk", {
                          covered: String(regionsCheck.coveredLoci.length),
                          total: String(regionsCheck.panelSize),
                        })}
                      </span>
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="text-sm">
                        {t("verified.submit.regionsRejectedTitle")}
                      </AlertTitle>
                      <AlertDescription className="text-xs space-y-2">
                        <p>{t("verified.submit.regionsRejectedExplainer")}</p>
                        {regionsCheck.outOfPanel.length > 0 && (
                          <div className="space-y-0.5">
                            {/* Coordinates only, no col-4 label: in a tool's own BED
                                that column is not a name (HipSTR puts the period
                                there), and echoing it back reads as nonsense. */}
                            {regionsCheck.outOfPanel.slice(0, 6).map((r) => (
                              <code key={r.line} className="block font-mono text-[11px]">
                                {t("verified.submit.regionsLinePrefix", { line: String(r.line) })}{" "}
                                {r.chrom}:{r.start}-{r.end}
                              </code>
                            ))}
                            {regionsCheck.outOfPanel.length > 6 && (
                              <p className="text-[11px]">
                                {t("verified.submit.regionsAndMore", {
                                  n: String(regionsCheck.outOfPanel.length - 6),
                                })}
                              </p>
                            )}
                          </div>
                        )}
                        {regionsCheck.coveredLoci.length < regionsCheck.minLoci && (
                          <p>
                            {t("verified.submit.regionsTooFewLoci", {
                              covered: String(regionsCheck.coveredLoci.length),
                              min: String(regionsCheck.minLoci),
                            })}
                          </p>
                        )}
                      </AlertDescription>
                    </Alert>
                  )
                )}
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
              {fetchingReadme && (
                <p className="mt-2 text-xs text-muted-foreground animate-pulse">
                  {t("verified.submit.cmdFetchingReadme")}
                </p>
              )}
              {cmdSuggestions.length > 0 && cmdLooksLikeTemplate && (
                <div className="mt-2 space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t("verified.submit.cmdSuggestFromReadme")}
                  </p>
                  {cmdSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      className="block w-full text-left rounded-md border border-teal-600/30 bg-teal-600/5 px-3 py-2 font-mono text-xs hover:bg-teal-600/15 transition-colors cursor-pointer dark:border-teal-400/30 dark:bg-teal-400/5 dark:hover:bg-teal-400/15"
                      onClick={() => setF((prev) => ({ ...prev, cmd: suggestion }))}
                    >
                      {suggestion}
                    </button>
                  ))}
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
              <>
                {/* The reset link only appears once the author edits a field. An
                    "auto-set" status note used to sit here too, but it restated the
                    hint beside it and, being muted text of the same size, ran into
                    it as one unreadable line. */}
                <div className="flex items-start justify-between gap-3 -mt-1">
                  <p className="text-xs text-muted-foreground">
                    {t("verified.submit.contentDefaultsHint")}
                  </p>
                  {contentDirty && (
                    <button
                      type="button"
                      onClick={resetContentDefaults}
                      className="shrink-0 text-xs text-primary underline underline-offset-2 hover:no-underline"
                    >
                      {t("verified.submit.contentDefaultsReset")}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="columns">
                    <Input type="number" value={f.columns} onChange={setContent("columns")} placeholder="5" />
                  </Field>
                  <Field label="dna_column">
                    <Input type="number" value={f.dnaColumn} onChange={setContent("dnaColumn")} placeholder="2" />
                  </Field>
                  <Field label="count_columns">
                    <Input value={f.countColumns} onChange={setContent("countColumns")} placeholder="3, 4" />
                  </Field>
                  <Field label="locus_column">
                    <Input type="number" value={f.locusColumn} onChange={setContent("locusColumn")} />
                  </Field>
                  <Field label="min_distinct_loci">
                    <Input type="number" value={f.minDistinctLoci} onChange={setContent("minDistinctLoci")} />
                  </Field>
                  <Field label="min_total_reads">
                    <Input type="number" value={f.minTotalReads} onChange={setContent("minTotalReads")} placeholder="100" />
                  </Field>
                  <div className="col-span-2">
                    <Field label="expect_loci">
                      <Input
                        value={f.expectLoci}
                        onChange={setContent("expectLoci")}
                        placeholder="CSF1PO, TH01, TPOX, vWA, FGA"
                      />
                    </Field>
                  </div>
                </div>
              </>
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

function SubmissionParams({
  f,
  dockerMode,
  fixtureSource,
  regionsFileName,
  showParams,
  onToggle,
  onResubmit,
  t,
}: {
  f: typeof INITIAL_F;
  dockerMode: "generated" | "provided";
  fixtureSource: "same" | "other";
  regionsFileName: string;
  showParams: boolean;
  onToggle: () => void;
  onResubmit: () => void;
  t: (key: string) => string;
}) {
  const resolvedInputType =
    f.inputType === "__other__" ? f.inputTypeCustom : f.inputType;
  const inputTypeLabel =
    INPUT_TYPES.find((it) => it.slug === f.inputType)?.label ?? resolvedInputType;

  const fixtureDisplay = f.fixtureFilePath
    ? fixtureSource === "other" && f.fixtureRepo
      ? `${f.fixtureRepo}@${f.fixtureRef}:${f.fixtureFilePath}`
      : f.fixtureFilePath
    : "—";

  const regionsDisplay = regionsFileName || "—";

  const buildDisplay =
    dockerMode === "generated"
      ? `${f.language} — ${f.buildCmd}`
      : t("verified.submit.dockerProvided");

  return (
    <div className="space-y-3 mt-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {showParams ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        {t("verified.submit.paramsToggle")}
      </button>

      {showParams && (
        <Card>
          <CardContent className="pt-4">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <dt className="text-muted-foreground">{t("verified.submit.paramsToolName")}</dt>
              <dd className="font-medium">{f.name}</dd>

              <dt className="text-muted-foreground">{t("verified.submit.paramsVersion")}</dt>
              <dd>{f.version}</dd>

              <dt className="text-muted-foreground">{t("verified.submit.paramsRepo")}</dt>
              <dd className="break-all text-xs font-mono">{f.repo}</dd>

              <dt className="text-muted-foreground">{t("verified.submit.paramsRef")}</dt>
              <dd className="font-mono text-xs">{f.ref}</dd>

              <dt className="text-muted-foreground">{t("verified.submit.paramsBuild")}</dt>
              <dd className="font-mono text-xs break-all">{buildDisplay}</dd>

              <dt className="text-muted-foreground">{t("verified.submit.paramsCmd")}</dt>
              <dd className="font-mono text-xs break-all">{f.cmd}</dd>

              <dt className="text-muted-foreground">{t("verified.submit.paramsTimeout")}</dt>
              <dd>{f.timeout} min</dd>

              {inputTypeLabel && (
                <>
                  <dt className="text-muted-foreground">{t("verified.submit.paramsInputType")}</dt>
                  <dd>{inputTypeLabel}</dd>
                </>
              )}

              <dt className="text-muted-foreground">{t("verified.submit.paramsFixture")}</dt>
              <dd className="font-mono text-xs break-all">{fixtureDisplay}</dd>

              {regionsFileName && (
                <>
                  <dt className="text-muted-foreground">{t("verified.submit.regionsLabel")}</dt>
                  <dd className="font-mono text-xs break-all">{regionsDisplay}</dd>
                </>
              )}

              <dt className="text-muted-foreground">{t("verified.submit.paramsOutput")}</dt>
              <dd className="font-mono text-xs">
                {f.outputPath} ({f.outputFormat})
              </dd>
            </dl>
          </CardContent>
        </Card>
      )}

      <button
        type="button"
        onClick={onResubmit}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
      >
        <RotateCcw className="h-4 w-4" />
        {t("verified.submit.resubmit")}
      </button>
      <p className="text-xs text-muted-foreground">
        {t("verified.submit.resubmitHint")}
      </p>
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
