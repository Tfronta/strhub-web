"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Loader2, CheckCircle2, XCircle, Info, Download, Upload, ChevronDown, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
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
  versionFromRef,
  deriveSlug,
  OUTPUT_FORMATS,
  BUILD_LANGUAGES,
  INPUT_TYPES,
  INPUT_TYPES_OWN_ONLY,
  INPUT_TYPES_WITH_REFERENCE,
  SUBMITTER_ROLES,
  type InputTypeEntry,
  type SubmissionInput,
  type SubmitterRole,
} from "@/lib/verified/submission";
import type { StoredSubmission } from "@/lib/verified/manifest";
import { detectOutput, type OutputDetection } from "@/lib/verified/detect-output";
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
import {
  fieldsFromAutoConfig,
  type AutoConfigFields,
  type AutoConfigGroup,
} from "@/lib/verified/autoconfig-apply";
import type { AutoConfigEntry } from "@/lib/verified/autoconfig-store";
import type { VerifiedRejection } from "@/lib/verified/rejection";
import { PROMPT_VERSION } from "@/lib/verified/autoconfig-version";
import { AutoConfigDialog } from "@/components/verified/auto-config-dialog";

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
  needsBuild: boolean;
  fixtureSource: FixtureSource;
  showContent: boolean;
  /** "" until answered — see SubmitterRoleState below. */
  submitterRole: SubmitterRole | "";
}

/** One previous verification run of the repository being submitted. */
interface PreviousRun {
  slug: string;
  name: string;
  ref: string | null;
  level: string;
  label: string;
  generated: string | null;
  succeeded: boolean;
  /** Assay types the run covered — what tells two legs of one tool apart. */
  datasetTypes?: string[] | null;
}

/** What /api/verify/repo-context knows about the pasted repository. */
interface RepoContext {
  repo: {
    slug: string;
    name: string;
    description: string | null;
    url: string;
    defaultBranch: string;
    issuesUrl: string | null;
    maintainer: string;
  };
  latest: { sha: string | null; committedAt: string | null; tag: string | null };
  previous: PreviousRun[];
  previousTool: { slug: string; name?: string; maintainer?: string; contact?: string } | null;
}

/** The four groups of answers a previous run can refill. */
const REUSE_GROUPS = ["env", "inputs", "run", "outputs"] as const;
type ReuseGroup = (typeof REUSE_GROUPS)[number];
/**
 * Where the author's own test data lives — or that there isn't any.
 *
 * "none" is an answer, not an absence. It used to be expressed by leaving the
 * path blank, which made "I have no test file" and "I have not filled this in
 * yet" the same state: the form could not tell them apart, so it could not
 * insist on a path for the author who did have one.
 */
type FixtureSource = "same" | "other" | "none";

/** How many previous runs are listed at a time. */
const REUSE_PAGE_SIZE = 3;

const AUTOCONFIG_LABEL_KEYS: Record<keyof AutoConfigFields, string> = {
  name: "verified.submit.name",
  maintainer: "verified.submit.maintainer",
  contact: "verified.submit.contact",
  language: "verified.submit.language",
  buildCmd: "verified.submit.buildCmd",
  checkCmd: "verified.submit.checkCmd",
  cmd: "verified.submit.cmd",
  timeout: "verified.submit.timeout",
  inputType: "verified.submit.inputType",
  inputTypeCustom: "verified.submit.inputType",
  fixtureFilePath: "verified.submit.fixturePathInRepo",
  outputPath: "verified.submit.outputPath",
  outputFormat: "verified.submit.outputFormat",
};

/**
 * How much of a sample output file is read for detection. Column layout is
 * settled in the first rows; the rest of the budget goes to the locus list,
 * which needs breadth. Far above any forensic result table, and a hard stop on
 * someone picking a whole-genome VCF.
 */
const SAMPLE_READ_BYTES = 8 * 1024 * 1024;

const ALL_REUSE_GROUPS: Record<ReuseGroup, boolean> = {
  env: true,
  inputs: true,
  run: true,
  outputs: true,
};

const INITIAL_F = {
  name: "",
  variant: "",
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
    const stored = JSON.parse(raw) as StoredFormState;
    // Keep only fields the form still has. A session saved before the version
    // field was folded into the ref would otherwise carry a dead key forward.
    return { ...stored, f: pickFormFields(stored.f) };
  } catch {
    return null;
  }
}

/** Narrow an arbitrary object to the current form's fields, as strings. */
function pickFormFields(source: Partial<Record<keyof typeof INITIAL_F, unknown>> | undefined) {
  const out = { ...INITIAL_F };
  if (!source) return out;
  for (const key of Object.keys(INITIAL_F) as (keyof typeof INITIAL_F)[]) {
    const value = source[key];
    if (typeof value === "string") out[key] = value;
  }
  return out;
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
 * The smallest set of loci every kit in an assay family reports, used as the
 * `expect_loci` starting point. Kept apart from recommendedContent because
 * detection can use it for formats that guessing cannot: once a sample file has
 * been read, we know its marker names are really there.
 */
function coreLoci(inputType: string): string[] {
  const family = assayFamily(inputType);
  if (family === "autosomal") return ["CSF1PO", "TH01", "TPOX", "vWA", "FGA"];
  if (family === "y-str") return ["DYS391", "DYS390", "DYS392", "DYS393"];
  return [];
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
  const expectLoci = isTable ? coreLoci(inputType).join(", ") : "";
  return { ...EMPTY_CONTENT, locusColumn, minDistinctLoci, expectLoci };
}

/** Whether a URL points at the same GitHub repository, ignoring .git and case. */
function sameRepo(a: string, b: string): boolean {
  const norm = (u: string) => u.trim().toLowerCase().replace(/\.git$/, "").replace(/\/+$/, "");
  return norm(a) === norm(b);
}

const GITHUB_REPO_RE = /^https:\/\/github\.com\/[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/;

function isRepoUrl(value: string): boolean {
  return GITHUB_REPO_RE.test(value.trim().replace(/\.git$/, "").replace(/\/+$/, ""));
}

/** A number the form holds as text; blank when the stored value is absent. */
function numText(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : "";
}

function listText(value: unknown): string {
  return Array.isArray(value) ? value.join(", ") : "";
}

/**
 * Translate a stored submission back into form fields, one group at a time.
 *
 * Only the requested groups are returned, so the reuse checkboxes decide what is
 * touched: an author reusing Execution but not Environment keeps the build
 * commands they were in the middle of writing.
 */
function fieldsFromStored(
  stored: StoredSubmission,
  groups: Record<ReuseGroup, boolean>,
  currentRepo: string,
): {
  fields: Partial<typeof INITIAL_F>;
  dockerMode?: "generated" | "provided";
  needsBuild?: boolean;
  fixtureSource?: FixtureSource;
  showContent?: boolean;
  contentDirty?: boolean;
} {
  const fields: Partial<typeof INITIAL_F> = {};
  let dockerMode: "generated" | "provided" | undefined;
  let needsBuild: boolean | undefined;
  let fixtureSource: FixtureSource | undefined;
  let showContent: boolean | undefined;
  let contentDirty: boolean | undefined;

  if (groups.env && stored.docker) {
    if (stored.docker.mode === "provided") {
      dockerMode = "provided";
      fields.dockerfile = stored.docker.dockerfile ?? "";
    } else if (stored.docker.mode === "generated") {
      dockerMode = "generated";
      fields.language = stored.docker.language ?? "python";
      fields.buildCmd = stored.docker.build_cmd ?? "";
      fields.checkCmd = stored.docker.check_cmd ?? "";
      // A stored run that carried a build command was, by definition, one that
      // needed building — otherwise the box would leave the fields hidden while
      // still holding their values.
      needsBuild = Boolean(stored.docker.build_cmd?.trim());
    }
  }

  if (groups.inputs && stored.inputs) {
    const type = stored.inputs.type ?? "";
    if (type && !INPUT_TYPES.some((it) => it.slug === type)) {
      fields.inputType = "__other__";
      fields.inputTypeCustom = type;
    } else {
      fields.inputType = type;
      fields.inputTypeCustom = "";
    }
    const fixture = stored.inputs.fixture;
    if (typeof fixture === "string") {
      // Legacy shape: a bare path, always inside the tool's own repo.
      fixtureSource = "same";
      fields.fixtureFilePath = fixture;
    } else if (fixture) {
      const isSame = fixture.repo ? sameRepo(fixture.repo, currentRepo) : true;
      fixtureSource = isSame ? "same" : "other";
      fields.fixtureFilePath = fixture.path ?? "";
      if (!isSame) {
        fields.fixtureRepo = fixture.repo ?? "";
        fields.fixtureRef = fixture.ref ?? "";
      }
    } else {
      // The stored run carried no fixture, which is a decision the author made.
      fixtureSource = "none";
      fields.fixtureFilePath = "";
    }
  }

  if (groups.run && stored.run) {
    fields.cmd = stored.run.cmd ?? "";
    fields.timeout = numText(stored.run.timeout_minutes) || "15";
  }

  if (groups.outputs && stored.outputs?.length) {
    const out = stored.outputs[0];
    fields.outputPath = out.path ?? "";
    fields.outputFormat = out.format ?? "tsv";
    fields.minRecords = numText(out.min_records) || "1";
    const content = out.content;
    showContent = Boolean(content && Object.keys(content).length);
    if (content) {
      fields.columns = numText(content.columns);
      fields.dnaColumn = numText(content.dna_column);
      fields.countColumns = listText(content.count_columns);
      fields.locusColumn = numText(content.locus_column);
      fields.minDistinctLoci = numText(content.min_distinct_loci);
      fields.expectLoci = listText(content.expect_loci);
      fields.minTotalReads = numText(content.min_total_reads);
      // Reused values are the author's own, so the recommended-defaults effect
      // must not overwrite them when the format or assay is reapplied.
      contentDirty = true;
    }
  }

  return { fields, dockerMode, needsBuild, fixtureSource, showContent, contentDirty };
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

  /**
   * The submitter's relationship to the tool.
   *
   * Starts unanswered and blocks submit until it is answered, rather than
   * defaulting either way. A default here is a guess about a person, and it was
   * the guess — that whoever submits a tool speaks for it — that put a
   * repository owner's name on a configuration STRhub wrote. Two clicks is a
   * cheap price for the one fact nothing else in this form can establish.
   */
  const [submitterRole, setSubmitterRole] = useState<SubmitterRole | "">("");

  const [dockerMode, setDockerMode] = useState<"generated" | "provided">("generated");
  /**
   * Whether the tool has to be compiled or installed before it can run.
   *
   * Off by default, and the two build fields only exist while it is on. Making
   * "nothing to install" the unticked default rather than an empty text box
   * means a blank build command is always a stated answer: either the author
   * says the tool needs building and then says how, or they say it does not.
   */
  const [needsBuild, setNeedsBuild] = useState(false);
  const [fixtureSource, setFixtureSource] = useState<FixtureSource>("same");
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

  // What GitHub and our own catalogue know about the repository the author
  // pasted. Everything downstream — the SHA button, the Tool prefill, the reuse
  // offer — reads from this one lookup.
  const [repoContext, setRepoContext] = useState<RepoContext | null>(null);
  const [repoState, setRepoState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [repoError, setRepoError] = useState<string | null>(null);
  // Prefill values that disagree with something the author already typed. Never
  // applied silently: overwriting a field someone filled in by hand is the one
  // way an autofill can lose work.
  const [prefillConflicts, setPrefillConflicts] = useState<
    { key: keyof typeof INITIAL_F; labelKey: string; current: string; next: string }[]
  >([]);
  const prefilledFor = useRef<string | null>(null);

  // Pre-flight is collapsible, and folds itself away once the repo has a run
  // that already proved nothing here applies.
  const [preflightOpen, setPreflightOpen] = useState(true);
  const preflightAutoCollapsed = useRef(false);

  // Reuse of a previous run's answers.
  const [reuseGroups, setReuseGroups] = useState<Record<ReuseGroup, boolean>>(ALL_REUSE_GROUPS);
  const [reuseBusy, setReuseBusy] = useState<string | null>(null);
  const [reuseApplied, setReuseApplied] = useState<string | null>(null);
  const [reuseError, setReuseError] = useState<string | null>(null);
  // A prolific repo can have a dozen runs; the recent ones are the ones worth
  // starting from, so the rest are a click away rather than a wall.
  const [visibleRuns, setVisibleRuns] = useState(REUSE_PAGE_SIZE);

  // Automatic configuration: generated from the repository, applied only after
  // the author has reviewed it.
  const [autoConfigEntry, setAutoConfigEntry] = useState<AutoConfigEntry | null>(null);
  const [autoConfigOpen, setAutoConfigOpen] = useState(false);
  const [autoConfigBusy, setAutoConfigBusy] = useState(false);
  const [autoConfigError, setAutoConfigError] = useState<string | null>(null);
  const [autoConfigApplied, setAutoConfigApplied] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState<AutoConfigEntry[]>([]);
  const [savedListOpen, setSavedListOpen] = useState(false);
  const [currentFingerprint, setCurrentFingerprint] = useState<string | null>(null);
  const [autoConfigSectionOpen, setAutoConfigSectionOpen] = useState(true);

  // Output detection from a sample file the author already has.
  const [detection, setDetection] = useState<OutputDetection | null>(null);
  const [detectFileName, setDetectFileName] = useState("");
  const [detectState, setDetectState] = useState<"idle" | "reading" | "done" | "error">("idle");
  const [detectError, setDetectError] = useState<string | null>(null);

  // Result state.
  const [slug, setSlug] = useState<string | null>(null);
  const [dispatchId, setDispatchId] = useState<string | null>(null);
  const [runState, setRunState] = useState<RunState>("pending");
  const [conclusion, setConclusion] = useState<string | null>(null);
  /**
   * Why a run stopped before any gate was judged, when that is what happened.
   *
   * The engine has always written this — with the fault named, so an author is
   * never told to fix a file of ours — committed it, and uploaded it as an
   * artifact. It was never shown to the one person it was written for.
   */
  const [rejection, setRejection] = useState<VerifiedRejection | null>(null);
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
      // Sessions saved before the checkbox existed have no flag; a build command
      // in the restored fields is the same statement by other means.
      setNeedsBuild(stored.needsBuild ?? stored.f.buildCmd.trim() !== "");
      setFixtureSource(stored.fixtureSource);
      setShowContent(stored.showContent);
      // Sessions saved before the question existed have no answer, and there is
      // none to infer: they stay unanswered and the box asks.
      if (stored.submitterRole === "maintainer" || stored.submitterRole === "third_party") {
        setSubmitterRole(stored.submitterRole);
      }
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

  // Latest fields, readable from effects that must not re-run on every
  // keystroke (the repo prefill below).
  const fRef = useRef(f);
  fRef.current = f;

  const repoValid = isRepoUrl(f.repo);
  /**
   * Everything after the Source section stays inert until the repository and
   * the ref are known. Most of the help this form offers is derived from those
   * two answers — the commit lookup, the tool prefill, the reuse offer, the
   * command suggestions read out of the README — so filling anything else first
   * is work done in the dark, and often work done twice.
   */
  const sourceReady = repoValid && f.ref.trim() !== "";

  // Look up the repository once the URL settles. Debounced: this runs while the
  // author is still typing the URL.
  useEffect(() => {
    if (!repoValid) {
      setRepoContext(null);
      setRepoState("idle");
      setRepoError(null);
      return;
    }
    let cancelled = false;
    setRepoState("loading");
    setRepoError(null);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/verify/repo-context?repo=${encodeURIComponent(f.repo.trim())}`,
        );
        const data = await res.json();
        if (cancelled) return;
        if (!data?.ok) {
          setRepoContext(null);
          setRepoState("error");
          setRepoError(typeof data?.error === "string" ? data.error : null);
          return;
        }
        setRepoContext(data as RepoContext);
        setRepoState("ready");
      } catch {
        if (cancelled) return;
        setRepoContext(null);
        setRepoState("error");
        setRepoError(null);
      }
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [f.repo, repoValid]);

  // Prefill the Tool section from what we just learned. A previous run wins
  // over the repository's own metadata: the author already chose how this tool
  // is named and who answers for it, and the repo name is only a guess at that.
  useEffect(() => {
    if (repoState !== "ready" || !repoContext) return;
    const key = repoContext.repo.slug.toLowerCase();
    if (prefilledFor.current === key) return;
    prefilledFor.current = key;

    // A repo with a run that reached "Runs" has already demonstrated that none
    // of the pre-flight limits apply to it, so the section folds away.
    if (!preflightAutoCollapsed.current && repoContext.previous.some((p) => p.succeeded)) {
      preflightAutoCollapsed.current = true;
      setPreflightOpen(false);
    }
    // A different repository means a different run list, from the top.
    setVisibleRuns(REUSE_PAGE_SIZE);

    const prev = repoContext.previousTool;
    const candidates = ([
      {
        key: "name",
        labelKey: "verified.submit.name",
        next: (prev?.name || repoContext.repo.name || "").trim(),
      },
      {
        key: "maintainer",
        labelKey: "verified.submit.maintainer",
        next: (prev?.maintainer || repoContext.repo.maintainer || "").trim(),
      },
      {
        key: "contact",
        labelKey: "verified.submit.contact",
        next: (prev?.contact || repoContext.repo.issuesUrl || "").trim(),
      },
    ] as { key: keyof typeof INITIAL_F; labelKey: string; next: string }[]).filter(
      (c) => c.next !== "",
    );

    const current = fRef.current;
    const fill: Partial<typeof INITIAL_F> = {};
    const conflicts: typeof prefillConflicts = [];
    for (const c of candidates) {
      const held = (current[c.key] ?? "").trim();
      if (held === "") fill[c.key] = c.next;
      else if (held !== c.next) conflicts.push({ ...c, current: held });
    }
    if (Object.keys(fill).length) setF((p) => ({ ...p, ...fill }));
    setPrefillConflicts(conflicts);
  }, [repoState, repoContext]);

  const acceptPrefill = () => {
    const fill: Partial<typeof INITIAL_F> = {};
    for (const c of prefillConflicts) fill[c.key] = c.next;
    setF((p) => ({ ...p, ...fill }));
    setPrefillConflicts([]);
  };

  /** Refill a group of answers from a previous run of this same repository. */
  async function applyReuse(runSlug: string) {
    setReuseBusy(runSlug);
    setReuseError(null);
    try {
      const res = await fetch(
        `/api/verify/repo-context?repo=${encodeURIComponent(f.repo.trim())}&slug=${encodeURIComponent(runSlug)}`,
      );
      const data = await res.json();
      if (!data?.ok || !data.reuse) {
        setReuseError(t("verified.submit.reuseUnavailable"));
        return;
      }
      const applied = fieldsFromStored(
        data.reuse.submission as StoredSubmission,
        reuseGroups,
        f.repo,
      );
      setF((p) => ({ ...p, ...applied.fields }));
      if (applied.dockerMode) setDockerMode(applied.dockerMode);
      if (applied.needsBuild !== undefined) setNeedsBuild(applied.needsBuild);
      if (applied.fixtureSource) setFixtureSource(applied.fixtureSource);
      if (applied.showContent !== undefined) setShowContent(applied.showContent);
      if (applied.contentDirty) setContentDirty(true);
      // The BED was already checked against the panel when it was submitted, so
      // reusing it spares the author the one step of this form that needs a file
      // from their machine.
      if (reuseGroups.inputs && typeof data.reuse.regionsBed === "string" && data.reuse.regionsBed) {
        setRegionsBed(data.reuse.regionsBed);
        setRegionsFileName(t("verified.submit.reuseRegionsFile"));
        setRegionsFileError(null);
      }
      setReuseApplied(runSlug);
    } catch {
      setReuseError(t("verified.submit.reuseUnavailable"));
    } finally {
      setReuseBusy(null);
    }
  }

  // List what has already been generated for this repository. Free, and it is
  // what lets an author on a new tag skip the model call entirely.
  useEffect(() => {
    if (!sourceReady) {
      setSavedConfigs([]);
      setCurrentFingerprint(null);
      return;
    }
    let cancelled = false;
    // Debounced: sourceReady turns true on the first character of the ref, and
    // the staleness check behind this costs a GitHub request.
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ repo: f.repo.trim(), ref: f.ref.trim() });
      fetch(`/api/verify/autoconfig?${params.toString()}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (cancelled || !data?.ok) return;
          setSavedConfigs(data.entries as AutoConfigEntry[]);
          setCurrentFingerprint(
            typeof data.currentFingerprint === "string" ? data.currentFingerprint : null,
          );
        })
        .catch(() => {
          // The feature is optional; a failed listing just hides the button.
        });
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sourceReady, f.repo, f.ref]);

  function autoConfigErrorMessage(code: string): string {
    const known: Record<string, string> = {
      repo_not_found: "verified.submit.autoConfigRepoNotFound",
      ref_not_found: "verified.submit.autoConfigRefNotFound",
      empty_repo: "verified.submit.autoConfigEmptyRepo",
      declined: "verified.submit.autoConfigDeclined",
      disabled: "verified.submit.autoConfigDisabled",
    };
    return known[code] ? t(known[code]) : code;
  }

  async function generateAutoConfig() {
    setAutoConfigBusy(true);
    setAutoConfigError(null);
    setAutoConfigApplied(false);
    try {
      const res = await fetch("/api/verify/autoconfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo: f.repo.trim(),
          ref: f.ref.trim(),
          dockerfileProvided: dockerMode === "provided",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        // 429 carries a human-readable reason; the rest are codes.
        setAutoConfigError(
          res.status === 429 && typeof data?.error === "string"
            ? data.error
            : autoConfigErrorMessage(String(data?.error ?? "upstream")),
        );
        return;
      }
      const entry = data.entry as AutoConfigEntry;
      setAutoConfigEntry(entry);
      setSavedConfigs((prev) => [entry, ...prev.filter((e) => e.ref !== entry.ref)]);
      setAutoConfigOpen(true);
    } catch {
      setAutoConfigError(t("verified.submit.autoConfigFailed"));
    } finally {
      setAutoConfigBusy(false);
    }
  }

  /**
   * Push a reviewed configuration into the form. Anything the author already
   * typed goes through the same conflict prompt the repository prefill uses,
   * rather than being overwritten.
   */
  function applyAutoConfig(groups: Record<AutoConfigGroup, boolean>) {
    if (!autoConfigEntry) return;
    const applied = fieldsFromAutoConfig(autoConfigEntry.config, groups);

    // A sample results file was read from the author's own output, so it beats a
    // format inferred from the filename's extension.
    if (detection) delete applied.fields.outputFormat;

    const conflicts: typeof prefillConflicts = [];
    const safe: Partial<typeof INITIAL_F> = {};
    for (const [key, next] of Object.entries(applied.fields) as [
      keyof AutoConfigFields,
      string,
    ][]) {
      const current = fRef.current[key];
      if (current.trim() !== "" && current !== next) {
        conflicts.push({
          key,
          labelKey: AUTOCONFIG_LABEL_KEYS[key],
          current,
          next,
        });
      } else {
        safe[key] = next;
      }
    }

    setF((prev) => ({ ...prev, ...safe }));
    if (applied.needsBuild !== undefined) setNeedsBuild(applied.needsBuild);
    if (applied.compat) setCompat(applied.compat);
    setPrefillConflicts(conflicts);
    setAutoConfigApplied(true);
    setAutoConfigOpen(false);
    setSavedListOpen(false);
  }

  const selectedTypeInfo = INPUT_TYPES.find((t) => t.slug === f.inputType);
  const selectedRefGenome = selectedTypeInfo?.referenceGenome ?? null;
  const selectedCanonicalPaths = selectedTypeInfo?.canonicalPaths ?? null;
  // Read off the un-narrowed union: only some input types carry a panel, and
  // narrowing on hasExternalDataset first collapses the property to `never`.
  const selectedSupportedLoci: readonly string[] = selectedTypeInfo?.supportedLoci ?? [];
  const fixtureIsOptional = selectedTypeInfo?.hasExternalDataset === true;
  const cmdLooksLikeTemplate = f.cmd === "" || f.cmd.startsWith(CMD_TEMPLATE_PREFIX);

  // Switching to an input type STRhub has no reference dataset for retracts the
  // "I don't have a test file" answer: there would then be nothing to run on.
  useEffect(() => {
    if (fixtureSource === "none" && f.inputType !== "" && !fixtureIsOptional) {
      setFixtureSource("same");
    }
  }, [fixtureSource, f.inputType, fixtureIsOptional]);

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

  /**
   * Work out the output format and column layout from a file the tool has
   * already produced, and fill the fields below in with it.
   *
   * The file is read here in the browser and never sent anywhere: it is the
   * author's own result data, and nothing about detecting its shape requires us
   * to hold it.
   */
  async function onSampleOutputFile(file: File | undefined) {
    if (!file) return;
    setDetectFileName(file.name);
    setDetectError(null);
    setDetection(null);
    setDetectState("reading");
    try {
      const head = file.slice(0, SAMPLE_READ_BYTES);
      const magic = new Uint8Array(await file.slice(0, 2).arrayBuffer());
      if (magic[0] === 0x1f && magic[1] === 0x8b) {
        setDetectError(t("verified.submit.detectGzip"));
        setDetectState("error");
        return;
      }
      const result = detectOutput(await head.text());
      detectionAssay.current = resolvedInputType;
      setDetection(result);
      setDetectState("done");
      applyDetection(result);
    } catch {
      setDetectError(t("verified.submit.detectError"));
      setDetectState("error");
    }
  }

  /**
   * The marker thresholds a detection implies depend on the assay, and the
   * output section sits below the input one, so an author who detects first and
   * picks their assay after would otherwise keep thresholds derived from no
   * assay at all. Re-deriving is safe: these two are the only detected values
   * the assay bears on, and both are floors rather than measurements.
   */
  const detectionAssay = useRef<string | null>(null);
  useEffect(() => {
    if (!detection) return;
    if (detectionAssay.current === resolvedInputType) return;
    detectionAssay.current = resolvedInputType;
    applyDetection(detection);
    // applyDetection is stable for a given detection + assay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detection, resolvedInputType]);

  /** Push a detection into the form's fields. */
  function applyDetection(result: OutputDetection) {
    const rec = recommendedContent(result.format, resolvedInputType);
    const { columns, dnaColumn, countColumns, locusColumn } = result.columns;

    // The gate splits every row on TAB regardless of declared format, so for a
    // format it cannot column-split, a leftover column index is not merely
    // useless — it would be checked against nonsense. Clear rather than keep.
    const structural =
      result.format === "tsv" || result.format === "vcf"
        ? {
            columns: columns !== undefined ? String(columns) : "",
            dnaColumn: dnaColumn !== undefined ? String(dnaColumn) : "",
            countColumns: countColumns?.length ? countColumns.join(", ") : "",
            locusColumn: locusColumn !== undefined ? String(locusColumn) : "",
          }
        : { columns: "", dnaColumn: "", countColumns: "", locusColumn: "" };

    // Two values the sample can only bound, never fix. The author's file is a
    // full run; verification runs against a slice around a handful of loci, so
    // anything counted here is an upper bound on what the run can produce.
    const recommendedMin = Number(rec.minDistinctLoci);
    const detectedLoci = result.loci.length;
    const minDistinctLoci = detectedLoci
      ? String(Math.max(1, Math.min(detectedLoci, recommendedMin || detectedLoci)))
      : rec.minDistinctLoci;

    // expect_loci demands EVERY name listed, so it is narrowed to the markers
    // this very file proves the tool reports. The core set is read straight from
    // the assay rather than from `rec`, which withholds it for non-table formats
    // on the grounds that the locus names might not be there — a doubt a file we
    // have just read the names out of has already settled.
    const expectLoci = detectedLoci
      ? coreLoci(resolvedInputType)
          .filter((l) => result.loci.includes(l))
          .join(", ")
      : rec.expectLoci;

    setF((prev) => ({
      ...prev,
      outputFormat: result.format,
      ...structural,
      minDistinctLoci,
      expectLoci,
    }));
    setContentDirty(true);
  }

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
    submitterRole !== "" &&
    sourceReady &&
    (dockerMode === "generated"
      ? // Declaring a build and then not naming it is not an answer either way.
        !needsBuild || f.buildCmd.trim() !== ""
      : f.dockerfile.trim().length >= 10) &&
    f.cmd.trim() !== "" &&
    !cmdLooksLikeTemplate &&
    f.inputType !== "" &&
    // "none" is only an answer where STRhub has a reference dataset to fall back
    // on; otherwise a path is the whole input. Saying the file is in a repo and
    // then not naming it is not an answer either way.
    (fixtureSource === "none" ? fixtureIsOptional : f.fixtureFilePath.trim() !== "") &&
    f.outputPath.trim() !== "" &&
    // A coordinate-based tool needs an uploaded regions BED that clears the panel
    // check. Blocking here spares the author a CI run that would only reject it.
    (!needsRegions || (regionsBed !== "" && regionsCheck?.ok === true));

  /**
   * What will actually be run, given both answers.
   *
   * This used to promise "two tests" unconditionally, which was wrong for
   * exactly the author who had just said there is no test file in the
   * repository: for them one verification runs, on our data. The number of runs
   * comes from the fixture answer; the dataset named comes from the assay. Both
   * were already on screen — the sentence just did not read them.
   */
  function externalNoteMessage(): string | null {
    if (!resolvedInputType) return null;
    const DETAIL_KEYS: Record<string, string> = {
      "illumina-str-fastq": "verified.submit.externalDetailIllumina",
      "ont-bam-hg38": "verified.submit.externalDetailOnt",
      "illumina-bam-hg38": "verified.submit.externalDetailIlluminaBam",
      "illumina-bam-hg38-y": "verified.submit.externalDetailIlluminaBamY",
    };
    const detailKey = DETAIL_KEYS[resolvedInputType] ?? "";
    // No STRhub dataset for this assay: their file is the only thing to run on.
    if (!detailKey) return t("verified.submit.externalNoteOwnOnly");
    const runs =
      fixtureSource === "none"
        ? t("verified.submit.externalRunsOurs")
        : t("verified.submit.externalRunsBoth");
    return `${runs} ${t(detailKey)}`;
  }

  /**
   * A refused submission has to reach the person who pressed the button.
   *
   * The banner lives at the top of the form and the button at the bottom, so a
   * rejection — a rate limit, a field the schema refuses — set a message two
   * thousand pixels above the eyes that were on the button. From there the
   * button simply flickered and nothing happened, which is the worst thing a
   * form can do: it reads as broken, and the explanation was already written.
   */
  const formErrorRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!formError) return;
    formErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [formError]);

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

    const hasFixture = fixtureSource !== "none" && f.fixtureFilePath.trim() !== "";
    const fixture = hasFixture
      ? { repo: fixtureRepo, ref: fixtureRef, path: f.fixtureFilePath }
      : undefined;

    const regions_bed = needsRegions && regionsBed !== "" ? regionsBed : undefined;

    return {
      tool: {
        name: f.name,
        // Only when given. An empty variant would put a stray hyphen in the
        // slug, which is a permanent link.
        variant: f.variant.trim() || undefined,
        // Derived from the pinned ref rather than asked for separately, so the
        // two can never disagree (see versionFromRef).
        version: versionFromRef(f.ref),
        maintainer: f.maintainer || undefined,
        contact: f.contact || undefined,
      },
      // Sent even though the schema would reject a blank: `canSubmit` already
      // holds the button, and an empty string reaching the API is a bug worth
      // failing loudly on rather than one worth papering over with a default.
      submitter: { role: submitterRole as SubmitterRole },
      source: { repo: f.repo, ref: f.ref },
      docker:
        dockerMode === "generated"
          ? {
              mode: "generated",
              language: f.language as (typeof BUILD_LANGUAGES)[number],
              // Gated on the checkbox, not just on the text: unticking hides the
              // fields but keeps what was typed, so that a change of mind is
              // reversible. Sending it anyway would submit a value the author
              // can no longer see.
              build_cmd: needsBuild ? f.buildCmd.trim() || undefined : undefined,
              check_cmd: needsBuild ? f.checkCmd.trim() || undefined : undefined,
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
      // What reading the repository turned up, carried into the manifest so the
      // report can show it. These used to end at this dialog: for STRsearch the
      // model noted that the pinned dependency versions might not resolve, which
      // is exactly what later happened, and nobody downstream ever saw it. Sent
      // with the model and prompt version because they are read off the
      // repository, not established by running anything.
      caveats:
        autoConfigEntry && autoConfigEntry.config.caveats.length
          ? {
              source: "autoconfig" as const,
              model: autoConfigEntry.model,
              prompt_version: autoConfigEntry.promptVersion,
              items: autoConfigEntry.config.caveats,
            }
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
        setRejection((data.rejection as VerifiedRejection | null) ?? null);
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

    saveFormState({ f, dockerMode, needsBuild, fixtureSource, showContent, submitterRole });
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
    needsBuild,
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
                  : // "did not pass all gates" is the wrong sentence for a run
                    // that was stopped before a single gate was judged: it says
                    // the tool was measured and fell short, when it never ran.
                    rejection
                    ? rejection.fault === "strhub"
                      ? t("verified.submit.rejectOursTitle")
                      : t("verified.submit.rejectStoppedTitle")
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

            {/* Why the run stopped, in the words the engine wrote when it did.
                The heading and labels are translated; the notice's own title,
                detail and next step are shown verbatim, because they are written
                per reason by the engine and paraphrasing them here would be a
                second place for the same explanation to drift.

                Nothing in this block is styled as a fault of the tool. It was
                not judged — that is the first thing it says. */}
            {failure && rejection && (
              <div
                className={`space-y-2 rounded-md border-l-4 p-3 ${
                  rejection.fault === "strhub"
                    ? "border-l-primary bg-muted/50"
                    : "border-l-amber-500 bg-amber-50/60 dark:bg-amber-950/20"
                }`}
              >
                <p className="text-sm font-medium">{rejection.title}</p>
                {rejection.detail && (
                  <p className="font-mono text-xs break-all text-muted-foreground">
                    {rejection.detail}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {t("verified.submit.rejectNotJudged")}
                </p>
                {rejection.next_step && (
                  <p className="text-sm">{rejection.next_step}</p>
                )}

                {/* What the check actually measured, for the one reason that
                    measures anything. A submitter rebuilding a BED needs the
                    numbers, not just the verdict. */}
                {rejection.validation && (
                  <ul className="space-y-1 border-t pt-2 text-xs text-muted-foreground">
                    {typeof rejection.validation.covered_count === "number" &&
                      typeof rejection.validation.panel_size === "number" && (
                        <li>
                          {t("verified.submit.rejectCoverage", {
                            covered: String(rejection.validation.covered_count),
                            total: String(rejection.validation.panel_size),
                            min: String(rejection.validation.min_loci ?? ""),
                          })}
                        </li>
                      )}
                    {rejection.validation.out_of_panel?.length ? (
                      <li>
                        {t("verified.submit.rejectOutOfPanel", {
                          n: String(rejection.validation.out_of_panel.length),
                        })}{" "}
                        <span className="font-mono break-all">
                          {rejection.validation.out_of_panel.slice(0, 5).join(", ")}
                          {rejection.validation.out_of_panel.length > 5 ? " …" : ""}
                        </span>
                      </li>
                    ) : null}
                  </ul>
                )}
              </div>
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
          <div ref={formErrorRef}>
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-8">
          {/* ── 1. Public source ─────────────────────────────────────
              First, and alone until it is answered. Everything below is derived
              from these two fields: which commit gets pinned, what the tool is
              called and who answers for it, and which previous run of this same
              repository the author can start from instead of retyping it. */}
          <Section
            title={t("verified.submit.sectionSource")}
            hint={t("verified.submit.sectionSourceHint")}
          >
            <Field label={t("verified.submit.repo")} required>
              <Input
                value={f.repo}
                onChange={set("repo")}
                placeholder="https://github.com/owner/tool"
              />
              {repoState === "loading" && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {t("verified.submit.repoLookupLoading")}
                </p>
              )}
              {repoState === "error" && (
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                  {repoError ?? t("verified.submit.repoLookupError")}
                </p>
              )}
              {repoState === "ready" && repoContext && (
                <p className="mt-1 text-xs text-muted-foreground break-words">
                  <span className="font-mono">{repoContext.repo.slug}</span>
                  {repoContext.repo.description ? ` — ${repoContext.repo.description}` : ""}
                </p>
              )}
              {err("source.repo")}
            </Field>
            <Field
              label={t("verified.submit.ref")}
              required
              infoTooltip={t("verified.submit.refTooltip")}
              infoTooltipAria={t("verified.submit.refTooltipAria")}
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  className="sm:flex-1"
                  value={f.ref}
                  onChange={set("ref")}
                  placeholder="b618e93… or v3.0"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  disabled={repoState !== "ready" || !repoContext?.latest.sha}
                  onClick={() => {
                    const sha = repoContext?.latest.sha;
                    if (sha) setF((prev) => ({ ...prev, ref: sha }));
                  }}
                >
                  {repoState === "loading" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("verified.submit.fetchLastSha")}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t("verified.submit.refHint")}</p>
              {/* A tag is offered alongside the SHA because the ref is now the
                  tool's version too, and "v3.0" reads better on an attestation
                  than seven hex digits. */}
              {repoContext?.latest.tag && f.ref.trim() !== repoContext.latest.tag && (
                <button
                  type="button"
                  className="mt-1 text-xs text-primary underline underline-offset-2 hover:no-underline"
                  onClick={() =>
                    setF((prev) => ({ ...prev, ref: repoContext.latest.tag as string }))
                  }
                >
                  {t("verified.submit.useLatestTag", { tag: repoContext.latest.tag })}
                </button>
              )}
              {f.ref.trim() !== "" && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("verified.submit.versionDerived", { version: versionFromRef(f.ref) })}
                </p>
              )}
              {err("source.ref")}
            </Field>
          </Section>

          {/* An autofill that overwrites a field somebody filled in by hand is
              the one way this can cost work rather than save it, so a
              disagreement is shown and asked about instead of resolved. */}
          {prefillConflicts.length > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>{t("verified.submit.prefillConflictTitle")}</AlertTitle>
              <AlertDescription className="space-y-3">
                <p>{t("verified.submit.prefillConflictBody")}</p>
                <dl className="space-y-2 text-xs">
                  {prefillConflicts.map((c) => (
                    <div key={c.key} className="grid grid-cols-[7rem_1fr] gap-x-3">
                      <dt className="font-medium">{t(c.labelKey)}</dt>
                      <dd className="min-w-0 space-y-0.5">
                        <p className="break-all text-muted-foreground line-through">{c.current}</p>
                        <p className="break-all font-medium">{c.next}</p>
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" size="sm" onClick={acceptPrefill}>
                    {t("verified.submit.prefillAccept")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setPrefillConflicts([])}
                  >
                    {t("verified.submit.prefillKeep")}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* ── AUTOMATIC CONFIGURATION ──
              Optional, and placed here because the repository and the ref are
              its only inputs — the same two answers everything else is derived
              from. Nothing it produces is applied without review. */}
          <Section
            title={t("verified.submit.autoConfigTitle")}
            hint={t("verified.submit.autoConfigHint")}
            disabled={!sourceReady}
            collapsible
            open={autoConfigSectionOpen}
            onToggle={() => setAutoConfigSectionOpen((v) => !v)}
            summary={
              autoConfigApplied
                ? t("verified.submit.autoConfigSummaryApplied")
                : t("verified.submit.autoConfigSummaryIdle")
            }
          >
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                checked={dockerMode === "provided"}
                onChange={(e) =>
                  setDockerMode(e.target.checked ? "provided" : "generated")
                }
              />
              <span>{t("verified.submit.autoConfigOwnDockerfile")}</span>
            </label>

            {dockerMode === "provided" && (
              <Field label={t("verified.submit.dockerfile")} required>
                <Textarea
                  value={f.dockerfile}
                  onChange={set("dockerfile")}
                  rows={10}
                  className="font-mono text-xs"
                  placeholder={"FROM python:3.11-slim\n..."}
                />
                <p className="text-xs text-muted-foreground">
                  {t("verified.submit.autoConfigDockerfileHint")}
                </p>
                {err("docker.dockerfile")}
              </Field>
            )}

            <Field label={t("verified.submit.autoConfigSampleLabel")} optional>
              <input
                type="file"
                className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-border file:bg-muted file:px-3 file:py-1.5 file:text-sm"
                onChange={(e) => onSampleOutputFile(e.target.files?.[0])}
              />
              <p className="text-xs text-muted-foreground">
                {t("verified.submit.autoConfigLocalOnly")}
              </p>
              {detectFileName && detectState === "done" && (
                <p className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {t("verified.submit.autoConfigSampleApplied", { file: detectFileName })}
                </p>
              )}
              {detectError && <p className="text-xs text-destructive">{detectError}</p>}
            </Field>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={!sourceReady || autoConfigBusy}
                onClick={generateAutoConfig}
              >
                {autoConfigBusy ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {t("verified.submit.autoConfigGenerate")}
              </Button>

              {savedConfigs.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSavedListOpen((v) => !v)}
                >
                  {t("verified.submit.autoConfigUseSaved", {
                    n: String(savedConfigs.length),
                  })}
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              {t("verified.submit.autoConfigWhatIsSent")}
            </p>

            {autoConfigBusy && (
              <p className="text-xs text-muted-foreground" role="status">
                {t("verified.submit.autoConfigWorking")}
              </p>
            )}
            {autoConfigError && (
              <p className="text-xs text-destructive">{autoConfigError}</p>
            )}
            {autoConfigApplied && !autoConfigError && (
              <p className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {t("verified.submit.autoConfigAppliedNote")}
              </p>
            )}

            {savedListOpen && savedConfigs.length > 0 && (
              <div className="space-y-2">
                {savedConfigs.map((entry) => {
                  const exact = entry.ref === f.ref.trim();
                  const stale =
                    currentFingerprint !== null &&
                    currentFingerprint !== entry.manifestFingerprint;
                  const outdated = entry.promptVersion < PROMPT_VERSION;
                  const notes = [
                    entry.createdAt.slice(0, 10),
                    stale ? t("verified.submit.autoConfigMayBeStale") : "",
                    outdated ? t("verified.submit.autoConfigOldVersion") : "",
                  ].filter(Boolean);
                  return (
                    <div
                      key={entry.ref}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {exact
                            ? t("verified.submit.autoConfigExactRef")
                            : t("verified.submit.autoConfigFromRef", { ref: entry.ref })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notes.join(" · ")}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setAutoConfigEntry(entry);
                          setAutoConfigOpen(true);
                        }}
                      >
                        {t("verified.submit.autoConfigReview")}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          <AutoConfigDialog
            entry={autoConfigEntry}
            open={autoConfigOpen}
            currentRef={f.ref.trim()}
            currentFingerprint={currentFingerprint}
            onOpenChange={setAutoConfigOpen}
            onApply={applyAutoConfig}
          />

          {/* ── 2. Tool ─────────────────────────────────────────────── */}
          <Section
            title={t("verified.submit.sectionTool")}
            hint={sourceReady ? undefined : t("verified.submit.lockedUntilSource")}
            disabled={!sourceReady}
          >
            <Field label={t("verified.submit.name")} required>
              <Input value={f.name} onChange={set("name")} placeholder="STRait Razor" />
              {err("tool.name")}
            </Field>

            {/* Who is submitting. Asked here, right after the tool is named,
                because every answer below it — the command, the environment, the
                regions BED — is a choice made by whoever this says, and the
                report has to attribute those choices to the right person. */}
            <Field
              label={t("verified.submit.submitterRole")}
              required
              infoTooltip={t("verified.submit.submitterRoleTooltip")}
            >
              <div className="space-y-2">
                {SUBMITTER_ROLES.map((role) => (
                  <label
                    key={role}
                    className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-2.5 text-sm hover:bg-muted/50"
                  >
                    <input
                      type="radio"
                      name="submitter-role"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                      checked={submitterRole === role}
                      onChange={() => setSubmitterRole(role)}
                    />
                    <span>
                      <span className="font-medium">
                        {t(`verified.submit.submitterRoleOption.${role}`)}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {t(`verified.submit.submitterRoleDesc.${role}`)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {err("submitter.role")}
            </Field>

            {/* One tool, several kits. STRait Razor reads the same input type
                at the same commit for ForenSeq and for PowerSeq, and the two are
                different claims — but they derive one slug, so without this the
                second submission overwrites the first. */}
            <Field
              label={t("verified.submit.variant")}
              optional
              infoTooltip={t("verified.submit.variantTooltip")}
            >
              <Input
                value={f.variant}
                onChange={set("variant")}
                placeholder="ForenSeq v1.27"
              />
              {f.name.trim() && f.ref.trim() && (
                <p className="text-xs text-muted-foreground">
                  {t("verified.submit.slugPreview")}{" "}
                  <code className="font-mono">
                    /verified/
                    {deriveSlug(
                      f.name,
                      versionFromRef(f.ref),
                      resolvedInputType || undefined,
                      f.variant,
                    )}
                  </code>
                </p>
              )}
            </Field>

            <Field
              label={
                submitterRole === "third_party"
                  ? t("verified.submit.maintainerThirdParty")
                  : t("verified.submit.maintainer")
              }
              optional
            >
              <Input value={f.maintainer} onChange={set("maintainer")} />
              {submitterRole === "third_party" && (
                <p className="text-xs text-muted-foreground">
                  {t("verified.submit.maintainerThirdPartyNote")}
                </p>
              )}
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
            disabled={!sourceReady}
            collapsible
            // Forced open while a ticked box is blocking submit: the reason the
            // button is dead must never be folded out of sight.
            open={preflightOpen || preflightBlocks}
            onToggle={() => setPreflightOpen((v) => !v)}
            summary={
              declaredIncompat.length === 0
                ? t("verified.submit.preflightSummaryNone")
                : t("verified.submit.preflightSummarySelected", {
                    n: String(declaredIncompat.length),
                  })
            }
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

          {/* ── 3. Reuse a previous run ──────────────────────────────
              Everything below this point is the same twenty answers the author
              already gave the last time they verified this repository. The only
              thing that usually changes between runs is the commit. */}
          {repoContext && repoContext.previous.length > 0 && (
            <Section
              title={t("verified.submit.reuseTitle")}
              hint={t("verified.submit.reuseHint")}
              disabled={!sourceReady}
            >
              <div className="grid gap-2 sm:grid-cols-2">
                {REUSE_GROUPS.map((g) => (
                  <label key={g} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 shrink-0 accent-primary"
                      checked={reuseGroups[g]}
                      onChange={(e) =>
                        setReuseGroups((prev) => ({ ...prev, [g]: e.target.checked }))
                      }
                    />
                    {t(`verified.submit.reuseGroup.${g}`)}
                  </label>
                ))}
              </div>

              <div className="space-y-2">
                {repoContext.previous.slice(0, visibleRuns).map((run) => (
                  <div
                    key={run.slug}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-medium">
                        {run.succeeded && (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        )}
                        <span className="truncate">{run.name}</span>
                        {run.ref && (
                          <code className="font-mono text-[11px] text-muted-foreground">
                            {run.ref.slice(0, 12)}
                          </code>
                        )}
                      </p>
                      {/* Two runs of one tool at one commit — an autosomal and a
                          Y-STR leg, say — were identical rows: same name, same
                          ref, same level, and no way to tell which button you
                          were about to press. The assay says what they are; the
                          slug is the identity of last resort, and it is also the
                          permanent link the run was published at. */}
                      <p className="text-xs text-muted-foreground">
                        {run.label}
                        {run.generated ? ` · ${run.generated.slice(0, 10)}` : ""}
                        {run.datasetTypes?.length
                          ? ` · ${run.datasetTypes
                              .map(
                                (dt) =>
                                  INPUT_TYPES.find((it) => it.slug === dt)?.label ?? dt,
                              )
                              .join(", ")}`
                          : ""}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground truncate">
                        {run.slug}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={
                        reuseBusy !== null || !REUSE_GROUPS.some((g) => reuseGroups[g])
                      }
                      onClick={() => applyReuse(run.slug)}
                    >
                      {reuseBusy === run.slug ? (
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="mr-2 h-3.5 w-3.5" />
                      )}
                      {t("verified.submit.reuseApply")}
                    </Button>
                  </div>
                ))}
              </div>

              {visibleRuns < repoContext.previous.length && (
                <button
                  type="button"
                  onClick={() => setVisibleRuns((n) => n + REUSE_PAGE_SIZE)}
                  className="flex items-center gap-1.5 text-sm text-primary underline underline-offset-2 hover:no-underline"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                  {t("verified.submit.reuseShowMore", {
                    n: String(
                      Math.min(
                        REUSE_PAGE_SIZE,
                        repoContext.previous.length - visibleRuns,
                      ),
                    ),
                  })}
                </button>
              )}

              {reuseApplied && !reuseError && (
                <p className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {t("verified.submit.reuseApplied")}
                </p>
              )}
              {reuseError && <p className="text-xs text-destructive">{reuseError}</p>}
            </Section>
          )}

          {/* ── 4. Environment ───────────────────────────────────────── */}
          <Section title={t("verified.submit.sectionEnv")} disabled={!sourceReady}>
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
                    <SelectTrigger className="h-11">
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
                <div className="space-y-1.5">
                  <label className="flex cursor-pointer items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                      checked={needsBuild}
                      onChange={(e) => setNeedsBuild(e.target.checked)}
                    />
                    {t("verified.submit.needsBuild")}
                  </label>
                  <p className="pl-6 text-xs text-muted-foreground">
                    {t("verified.submit.needsBuildHint")}
                  </p>
                </div>

                {needsBuild && (
                  <>
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
                )}
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

          {/* ── 5. Input data (before Execution so user sees canonical paths first) */}
          <Section
            title={t("verified.submit.sectionInputs")}
            hint={t("verified.submit.sectionInputsHint")}
            disabled={!sourceReady}
          >
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
                <SelectTrigger className="h-11">
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

            {/* Every reference dataset here is a SLICE. That used to be said only
                inside the regions block below, which appears for the two types
                that require a BED — so an author picking ONT or FASTQ was never
                told, and had no way to know their tool was being pointed at an
                extract rather than a genome. Shown for every type that runs
                against our reference data; the richer regions block supersedes
                it where a BED is actually required. */}
            {selectedTypeInfo?.hasExternalDataset && !needsRegions && (
              <div className="flex items-start gap-2 rounded-md border border-[#0099a3]/30 bg-[#0099a3]/5 px-3 py-3 text-xs">
                <Info className="h-4 w-4 mt-0.5 shrink-0 text-[#0099a3]" />
                <div className="space-y-2 min-w-0 flex-1">
                  <p className="font-medium text-foreground">
                    {t("verified.submit.sliceNoticeTitle")}
                  </p>
                  <p className="text-muted-foreground">
                    {t("verified.submit.sliceNoticeBody")}
                  </p>
                  {/* Only when a panel exists: panelUrl() builds a raw URL for any
                      type, but datasets without a loci.bed would 404 on it. */}
                  {selectedSupportedLoci.length > 0 && (
                    <a
                      href={panelUrl(f.inputType)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {t("verified.submit.sliceNoticeDownload")}
                    </a>
                  )}
                </div>
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
                  {/* Offered only where STRhub has a reference dataset to run
                      instead. For the other types it would be a route with no
                      destination: no fixture means nothing to run at all. */}
                  {fixtureIsOptional && (
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        checked={fixtureSource === "none"}
                        onChange={() => setFixtureSource("none")}
                      />
                      {t("verified.submit.fixtureNone")}
                    </label>
                  )}
                </div>
              </Field>

              {fixtureSource === "none" ? (
                <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                  <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{t("verified.submit.fixtureNoneNote")}</span>
                </div>
              ) : fixtureSource === "same" ? (
                <>
                  {f.repo && (
                    <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                      <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>{t("verified.submit.fixtureSameRepoNote", { repo: f.repo, ref: f.ref || "…" })}</span>
                    </div>
                  )}
                  <Field
                    label={t("verified.submit.fixturePathInRepo")}
                    required
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
                  <Field label={t("verified.submit.fixtureRepo")} required>
                    <Input
                      value={f.fixtureRepo}
                      onChange={set("fixtureRepo")}
                      placeholder="https://github.com/owner/test-data"
                    />
                    {err("inputs.fixture.repo")}
                  </Field>
                  <Field label={t("verified.submit.fixtureRef")} required>
                    <Input value={f.fixtureRef} onChange={set("fixtureRef")} placeholder="main" />
                    {err("inputs.fixture.ref")}
                  </Field>
                  <Field
                    label={t("verified.submit.fixturePathInRepo")}
                    required
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

          {/* ── 6. Execution ─────────────────────────────────────────── */}
          <Section title={t("verified.submit.sectionRun")} disabled={!sourceReady}>
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

          {/* ── 7. Outputs ───────────────────────────────────────────── */}
          <Section
            title={t("verified.submit.sectionOutputs")}
            hint={t("verified.submit.sectionOutputsHint")}
            disabled={!sourceReady}
          >
            {/* Detection from a real file. Everything this section asks for is a
                fact about a file the author already has; hand-counting column
                positions off a screen is the part they get wrong. */}
            <div className="rounded-md border border-[#0099a3]/30 bg-[#0099a3]/5 px-3 py-3 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 shrink-0 text-[#0099a3]" />
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {t("verified.submit.detectTitle")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("verified.submit.detectHint")}
                  </p>
                  <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted/40">
                    <Upload className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 truncate text-muted-foreground">
                      {detectFileName || t("verified.submit.detectChoose")}
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={(e) => onSampleOutputFile(e.target.files?.[0])}
                    />
                  </label>

                  {detectState === "reading" && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      {t("verified.submit.detectReading")}
                    </p>
                  )}
                  {detectState === "error" && (
                    <p className="text-xs text-destructive">
                      {detectError ?? t("verified.submit.detectError")}
                    </p>
                  )}
                  {detectState === "done" && detection && (
                    <div className="space-y-1.5 text-xs">
                      <p className="flex items-start gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {t("verified.submit.detectResult", {
                          format: t(`verified.submit.outputFormatOptions.${detection.format}`),
                          rows: detection.rows.toLocaleString(),
                        })}
                      </p>
                      {detection.loci.length > 0 && (
                        <p className="text-muted-foreground">
                          {t("verified.submit.detectLoci", {
                            n: String(detection.loci.length),
                            sample: detection.loci.slice(0, 6).join(", "),
                          })}
                        </p>
                      )}
                      {detection.notes.map((note) => (
                        <p key={note} className="text-muted-foreground">
                          · {t(`verified.submit.detectNote.${note}`)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

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
                <SelectTrigger className="h-11">
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
                <p className="text-xs text-muted-foreground">
                  {t("verified.submit.contentZeroBased")}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label={t("verified.submit.contentField.columns")}
                    code="columns"
                    infoTooltip={t("verified.submit.contentField.columnsTip")}
                  >
                    <Input type="number" value={f.columns} onChange={setContent("columns")} placeholder="5" />
                  </Field>
                  <Field
                    label={t("verified.submit.contentField.dnaColumn")}
                    code="dna_column"
                    infoTooltip={t("verified.submit.contentField.dnaColumnTip")}
                  >
                    <Input type="number" value={f.dnaColumn} onChange={setContent("dnaColumn")} placeholder="2" />
                  </Field>
                  <Field
                    label={t("verified.submit.contentField.countColumns")}
                    code="count_columns"
                    infoTooltip={t("verified.submit.contentField.countColumnsTip")}
                  >
                    <Input value={f.countColumns} onChange={setContent("countColumns")} placeholder="3, 4" />
                  </Field>
                  <Field
                    label={t("verified.submit.contentField.locusColumn")}
                    code="locus_column"
                    infoTooltip={t("verified.submit.contentField.locusColumnTip")}
                  >
                    <Input type="number" value={f.locusColumn} onChange={setContent("locusColumn")} placeholder="0" />
                  </Field>
                  <Field
                    label={t("verified.submit.contentField.minDistinctLoci")}
                    code="min_distinct_loci"
                    infoTooltip={t("verified.submit.contentField.minDistinctLociTip")}
                  >
                    <Input type="number" value={f.minDistinctLoci} onChange={setContent("minDistinctLoci")} placeholder="8" />
                  </Field>
                  <Field
                    label={t("verified.submit.contentField.minTotalReads")}
                    code="min_total_reads"
                    infoTooltip={t("verified.submit.contentField.minTotalReadsTip")}
                  >
                    <Input type="number" value={f.minTotalReads} onChange={setContent("minTotalReads")} placeholder="100" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field
                      label={t("verified.submit.contentField.expectLoci")}
                      code="expect_loci"
                      infoTooltip={t("verified.submit.contentField.expectLociTip")}
                    >
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

          {formError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

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
  needsBuild,
  fixtureSource,
  regionsFileName,
  showParams,
  onToggle,
  onResubmit,
  t,
}: {
  f: typeof INITIAL_F;
  dockerMode: "generated" | "provided";
  needsBuild: boolean;
  fixtureSource: FixtureSource;
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

  const fixtureDisplay =
    fixtureSource === "none"
      ? t("verified.submit.fixtureNone")
      : f.fixtureFilePath
        ? fixtureSource === "other" && f.fixtureRepo
          ? `${f.fixtureRepo}@${f.fixtureRef}:${f.fixtureFilePath}`
          : f.fixtureFilePath
        : "—";

  const regionsDisplay = regionsFileName || "—";

  const buildDisplay =
    dockerMode === "generated"
      ? needsBuild && f.buildCmd.trim()
        ? `${f.language} — ${f.buildCmd}`
        : `${f.language} — ${t("verified.submit.buildCmdNone")}`
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

/**
 * A form section.
 *
 * `disabled` uses the native fieldset behaviour, so every control inside is
 * genuinely inert rather than merely dimmed — including the Radix triggers,
 * which render as buttons. The legend is exempt by spec, which is what lets a
 * collapsible section still be unfolded while its contents are gated.
 */
function Section({
  title,
  hint,
  disabled,
  collapsible,
  open,
  onToggle,
  summary,
  children,
}: {
  title: string;
  hint?: string;
  disabled?: boolean;
  collapsible?: boolean;
  open?: boolean;
  onToggle?: () => void;
  /** One line shown in place of the body while collapsed. */
  summary?: string;
  children: React.ReactNode;
}) {
  const expanded = !collapsible || open !== false;
  return (
    <fieldset
      disabled={disabled}
      className={`space-y-4 ${disabled ? "opacity-50" : ""}`}
    >
      <legend className="text-lg font-semibold">
        {collapsible ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="flex items-center gap-1.5 text-left transition-colors hover:text-primary"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
            {title}
          </button>
        ) : (
          title
        )}
      </legend>
      {expanded ? (
        <>
          {hint && <p className="text-sm text-muted-foreground -mt-2">{hint}</p>}
          {children}
        </>
      ) : (
        summary && <p className="text-sm text-muted-foreground -mt-2">{summary}</p>
      )}
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
  code,
  required,
  optional,
  infoTooltip,
  infoTooltipAria,
  children,
}: {
  label: string;
  /**
   * The manifest key this field writes, shown beside the label. The content
   * fields used to be labelled with the key alone — `dna_column`, `count_columns` —
   * which named the destination but never said what to put there, or that the
   * positions are counted from zero.
   */
  code?: string;
  required?: boolean;
  optional?: boolean;
  infoTooltip?: string;
  infoTooltipAria?: string;
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-1.5">
      <Label className="text-sm inline-flex flex-wrap items-center gap-1.5">
        <span>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
          {optional && (
            <span className="ml-1 text-xs text-muted-foreground">
              ({t("verified.submit.optional")})
            </span>
          )}
        </span>
        {code && (
          <code className="font-mono text-[11px] font-normal text-muted-foreground">
            {code}
          </code>
        )}
        {infoTooltip && (
          <InfoTooltipIcon tooltip={infoTooltip} ariaLabel={infoTooltipAria} />
        )}
      </Label>
      {children}
    </div>
  );
}
