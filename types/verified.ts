/**
 * Types for the STRhub Verified attestations consumed by the read-only dashboard.
 *
 * Source of truth is the strhub-verified engine, which publishes static JSON to
 * its `gh-pages` branch:
 *   - index.json        → VerifiedIndex (compact catalogue, one entry per tool)
 *   - <slug>.json        → VerifiedReport (full attestation)
 *
 * The dashboard only READS these files; it never stores tool source code.
 */

export type VerifiedLevel =
  | "none"
  | "available"
  | "installs"
  | "runs"
  | "io"
  | "content";

/** Compact state of a verification matrix leg in index.json. */
export type LegState = "pass" | "fail" | "na" | null;

/**
 * Which instrument produced a run (the engine's docs/PLAN-Documented-Is-The-
 * Badge.md). `documented`: the repository's own instructions, read off the
 * README and the tree at the pinned commit; `maintainer`: a recipe the tool's
 * maintainer submitted, which is documentation in another format; `curated`:
 * a recipe a third party (STRhub, for the tools it filled the catalogue with)
 * wrote by hand. Only the first two may stand behind the badge — it claims
 * "installs and runs from its public source" — and a curated run is a note
 * under the documented result, never in its place.
 */
export type VerifiedInstrument = "documented" | "maintainer" | "curated";

/**
 * One thing a curated recipe does that the repository's instructions do not:
 * a departure from the README a first-time user would have to discover, and
 * so a recommendation to the author.
 */
export interface VerifiedWorkaround {
  what: string;
  instead_of: string;
  why?: string;
}

/** The one sentence for a reader who does not program (harness/verdict.py). */
export type VerifiedVerdictCode = "runs" | "fails" | "undetermined" | "out_of_scope";

export type VerifiedSelfFix = "upload_regions" | "edit_command" | "choose_install" | "edit_install" | "edit_output";

/** What stopped a run, as two actions (see harness/verdict.py BLOCKERS). */
export interface VerifiedBlocker {
  code: string;
  what: string;
  self_fix: VerifiedSelfFix | null;
  self_fix_text: string;
  ask_owner: { title: string; body: string };
}

export interface VerifiedVerdict {
  code: VerifiedVerdictCode;
  title: string;
  reason: string;
  basis?: string;
  readme_gaps?: { item: string; text: string }[];
  blockers?: VerifiedBlocker[];
}

/**
 * One commit a tool was verified at, as index.json lists it (schema /3).
 *
 * The unit published is the tool AT A COMMIT: every run lands in
 * `<slug>/<sha>/` on gh-pages and the flat entry is an alias of the newest
 * commit. `committed` is when the commit was made — the clock a tool's
 * history runs on — and `generated` is when STRhub verified it; a version
 * verified today can still be the oldest. See the engine's
 * docs/PLAN-Version-History.md.
 */
export interface VerifiedVersionEntry {
  sha: string | null;
  /** Absent on an index from before the engine told instruments apart. */
  instrument?: VerifiedInstrument | null;
  version?: string | null;
  variant?: string | null;
  committed?: string | null;
  generated?: string | null;
  level: VerifiedLevel;
  label?: string;
  verdict?: string | null;
  errors_reported?: boolean;
  ci_run?: string | null;
  /** Paths relative to the gh-pages root. */
  report: string;
  page: string;
  pdf?: string;
}

/** One row in index.json — enough to render a card without fetching the report. */
export interface VerifiedIndexEntry {
  slug: string;
  name: string;
  level: VerifiedLevel;
  label: string;
  /** The run reported error-severity diagnostics (absent on older reports). */
  errors_reported?: boolean;
  generated: string | null;
  // index/2: what this entry was verified at.
  version?: string | null;
  variant?: string | null;
  sha?: string | null;
  verdict?: string | null;
  // index/3: the commit's own date, and every commit verified, newest first.
  committed?: string | null;
  versions?: VerifiedVersionEntry[];
  /**
   * The instrument of the alias — what the card's badge rests on. `curated`
   * means the tool has no run of its own instructions yet, and the card must
   * say "not verified as documented" rather than show that result as the
   * tool's own.
   */
  instrument?: VerifiedInstrument | null;
  source_repo: string | null;
  source_ref: string | null;
  ci_run: string | null;
  distinct_str_loci: number | null;
  distinct_snp_markers: number | null;
  total_reads: number | null;
  // Fase 3: matrix + advisory README summary (absent on older reports).
  own_state?: LegState;
  external_state?: LegState;
  readme_score?: number | null;
  readme_max?: number | null;
  // Input dataset types across all legs (e.g. ["illumina-bam-hg38-y"]).
  dataset_types?: string[] | null;
  report: string;
  page: string;
}

export interface VerifiedIndex {
  schema: string;
  generated: string;
  count: number;
  tools: VerifiedIndexEntry[];
}

export interface VerifiedContentStats {
  rows?: number;
  malformed_rows?: number;
  distinct_loci?: number;
  distinct_str_loci?: number;
  distinct_snp_markers?: number;
  /** Every locus named in the output, STR and SNP alike. */
  loci?: string[];
  str_loci?: string[];
  snp_markers?: string[];
  total_reads?: number;
  max_sequence_depth?: number;
  /** Deepest first, as `most_common()` left it. */
  top_loci_by_depth?: [string, number][];
  called_genotypes?: number;
  /** How many loci the regions file asked for, and how many the output names. */
  regions_given?: number;
  regions_hit?: number;
}

/**
 * What the Expected IO gate established about one declared output: the file
 * it resolved to, and each check it ran. The gate row says "pass"; this is
 * what passing consisted of, and it is what a reader who wants to see the
 * output rather than take the row's word for it needs first.
 */
export interface VerifiedIoOutput {
  path?: string;
  format?: string;
  resolved?: string;
  records?: number;
  checks?: Record<string, boolean>;
  passed?: boolean;
}

/** A leg of the verification matrix (own data / external dataset). */
export interface VerifiedMatrixLeg {
  leg: "own" | "external" | string;
  label: string;
  available: boolean;
  io?: boolean;
  content?: boolean;
  passed?: boolean;
  type?: string | null;
  dataset?: string | null;
  fixture_source?: "tool" | "strhub" | null;
}

/** The advisory README "minimum-to-run" check. Never gates the badge. */
export interface VerifiedReadmeCheck {
  gate: "readme";
  advisory: true;
  score: number;
  max: number;
  empty?: boolean;
  checks: Record<string, { present: boolean; matched?: string | null }>;
}

/** How a run became eligible for manual (level 2) verification. */
export type ManualBasis = "declared" | "detected";

/**
 * The engine's verdict on whether this run may be offered manual verification.
 *
 * Level 2 is paid and human-run, so eligibility is never a judgement the web
 * makes: `harness/diagnose_log.py` decides it mechanically from the run's own
 * evidence and stamps a reason code here. The UI only reads it. A report with
 * this field absent predates the check; `eligible: false` means it was checked
 * and did not qualify.
 */
export interface VerifiedManualVerification {
  eligible: boolean;
  basis: ManualBasis | null;
  /** e.g. "declared_incompat:requires_gpu" or "detected_incompat:oom". */
  reason_code: string | null;
  reason: string | null;
}

/** Whether the tool's own maintainer submitted it, or somebody else did. */
export type SubmittedBy = "maintainer" | "third_party";

export interface VerifiedReport {
  schema: string;
  tool: {
    name: string;
    version?: string;
    /** Which kit or configuration this attestation is about, when a tool has several. */
    variant?: string;
    maintainer?: string;
    contact?: string;
  };
  /**
   * Who submitted the tool for verification.
   *
   * Distinct from `tool.maintainer`, which names whoever answers for the
   * software: the two are the same person only when a tool's own maintainer
   * submits it. Absent on reports generated before the form asked, and in that
   * case the view must claim nothing — not fall back to the maintainer, which is
   * the assumption this field exists to retire.
   */
  submission?: { by?: SubmittedBy } | null;
  source: {
    repo: string;
    ref?: string;
    ref_resolved?: string;
    /** When the pinned commit was made (committer date). Absent on older reports. */
    committed?: string;
  };
  environment: {
    dockerfile?: string;
    os?: string[];
    /**
     * Plan B: a second Dockerfile the engine builds only if the first fails —
     * the published image or package the README points at, which holds
     * whatever its publisher last pushed rather than the pinned commit.
     * `fallback_used` says the gates ran on it; a view must then not present
     * the result as "the pinned commit, built and run".
     */
    fallback?: { dockerfile: string; reason?: string };
    fallback_used?: boolean;
  };
  generated: string;
  ci_run?: string;
  gates: Record<VerifiedLevel, boolean>;
  level: VerifiedLevel;
  /**
   * Which instrument this run is, and — for a recipe somebody wrote — what it
   * does that the repository's instructions do not. Both absent on reports
   * from before the engine recorded them; `instrumentOfReport` in
   * lib/verified/instrument.ts derives it then, the way the engine does.
   */
  instrument?: VerifiedInstrument | null;
  recipe?: {
    origin?: "proposed" | VerifiedInstrument | null;
    workarounds?: VerifiedWorkaround[];
  } | null;
  /**
   * The verdict: runs, fails, could not be determined, out of scope. A
   * published page leads with it, as the engine's HTML copy does; an
   * `undetermined` one is a finding about the documentation, and the page
   * must not present the rung it happened to reach as the tool's result.
   */
  verdict?: VerifiedVerdict | null;
  /**
   * Where the pinned commit sits in its repository now.
   *
   * The attestation stays true about the commit it names — later work does not
   * make it false — but a reviewer holding a manuscript wants to know whether
   * what was verified is what they are looking at. `ref_exists: false` is the
   * one that is a finding rather than context: a force-push or a deleted branch
   * strands an attestation against source nobody can fetch, and being fetchable
   * is the first thing the badge claims. Absent when the check could not be
   * made, and then the view says nothing rather than guessing.
   */
  upstream?: {
    checked?: string;
    repo_exists?: boolean;
    ref_exists?: boolean;
    default_branch?: string;
    status?: string;
    behind_by?: number;
  } | null;
  io_detail?: { passed?: boolean; outputs?: VerifiedIoOutput[] } | null;
  /**
   * The command the gates ran, as the tool saw it: the manifest's `run.cmd`
   * with the harness's capture wrapper stripped. The PDF prints it under
   * "Exact Run Command"; the page had nothing, so a reader of a published
   * attestation could not see what was executed without opening the log.
   * Absent on reports written before the engine recorded it.
   */
  run?: { cmd?: string; cwd?: string } | null;
  /**
   * Why the environment did not build, when it did not.
   *
   * Kept apart from `diagnostics`, which is keyed by verification leg and means
   * "errors the tool reported while running": a build failure happens before any
   * run, and the build log used to be discarded entirely — so a tool that failed
   * to build was published as "Installs — did not pass" with no cause and no
   * side. `faults` says whose: 'author' is correctable and free to re-verify,
   * 'strhub' is ours (we choose the base image of a generated container) and must
   * never read as a finding about the software, 'harness' is a ceiling of the
   * free environment. Empty means the log named nothing we could classify.
   */
  /**
   * Sections where the author documents a known bug or limitation, quoted from
   * their README at the verified commit.
   *
   * The author's own words about their own software: the safest thing a report
   * can carry, and what a reader most needs when a run stops. STRspy documents
   * that its wrapper can exit without doing any work; the report on a run that
   * died in that wrapper said nothing about it, because the section never left
   * the README.
   */
  author_known_issues?: { heading: string; line: number; text: string; truncated?: boolean; url?: string }[];
  /**
   * What the run's configuration rests on, each item openable at the pinned
   * ref: the README line a command was read on, the file that says how to
   * install, the paths that count as example data. A claim a reader cannot
   * open in one click is a claim nobody can challenge.
   */
  evidence?: {
    claim: "install_method" | "published_image" | "bioconda_package" | "fallback_environment"
      | "run_command" | "example_data" | "known_issue" | string;
    kind: "tree" | "readme";
    path: string;
    line?: number;
    text?: string;
    url: string;
  }[];
  install_detail?: {
    passed?: boolean;
    /** The gate passed on plan B; `diagnostics` explain why the pinned commit did not build. */
    fallback_used?: boolean;
    diagnostics?: VerifiedDiagnostic[];
    faults?: ("author" | "strhub" | "harness")[];
  } | null;
  content_detail?: { outputs?: { stats?: VerifiedContentStats }[] };
  logs?: Record<string, string>;
  diagnostics?: Record<string, VerifiedDiagnostic[]>;
  // Fase 3 additions (optional for backward compatibility with older reports).
  datasets?: VerifiedMatrixLeg[];
  readme_check?: VerifiedReadmeCheck | null;
  /** Level-2 eligibility. Absent on reports generated before the check existed. */
  manual_verification?: VerifiedManualVerification | null;
  /**
   * Notes taken while reading the repository to work out the configuration.
   *
   * Deliberately separate from `gates` and `diagnostics`, which record what
   * running the tool established. Nothing here was run, so the provenance travels
   * with it and the view has to label it as unverified.
   */
  caveats?: {
    source: string;
    model?: string;
    prompt_version?: number;
    items: string[];
  } | null;
  /**
   * What the run needed that the repository does not provide.
   *
   * A ladder reads as a property of the software and silently absorbs whatever it
   * took to get there — a configuration file built by hand, an environment
   * written for the run. Stating the requirements keeps the badge meaning what it
   * measured, and answers the question an adopter actually has.
   */
  needed_beyond_repo?: string[] | null;
  scope: string;
}

export interface VerifiedDiagnostic {
  id: string;
  severity: "error" | "warning" | "info";
  title: string;
  suggestion?: string;
  /** How many log lines matched this rule (the scale of the failure). */
  count?: number;
  /** Distinct captured values, e.g. the per-locus files that failed to open. */
  examples?: string[];
}

/** Per-level presentation: human label + a Tailwind-friendly tone. */
export const VERIFIED_LEVELS: Record<
  VerifiedLevel,
  { label: string; tone: "green" | "amber" | "red" }
> = {
  content: { label: "Runs + Plausible output", tone: "green" },
  io: { label: "Runs + Expected IO", tone: "green" },
  runs: { label: "Runs", tone: "green" },
  installs: { label: "Installs", tone: "amber" },
  available: { label: "Available", tone: "amber" },
  none: { label: "Not run", tone: "red" },
};

/**
 * A gate is one check; a level is how far the run got. They are different things
 * and now read as different things.
 *
 * The gate rows used to borrow the LEVEL labels, so the last check appeared as
 * "Runs + Plausible output" on the site while the PDF called the same check
 * "Output Structure Validation". A reviewer can have both open at once, and two
 * names for one thing is two things. Short names here; the cumulative label stays
 * on the badge, where the accumulation is the point. Keep in step with
 * GATE_DISPLAY in harness/generate_pdf.py.
 */
export const VERIFIED_GATES: {
  key: VerifiedLevel;
  label: string;
  meaningKey: string;
}[] = [
  { key: "available", label: "Available", meaningKey: "verified.gate.available" },
  { key: "installs", label: "Installs", meaningKey: "verified.gate.installs" },
  { key: "runs", label: "Runs", meaningKey: "verified.gate.runs" },
  { key: "io", label: "Expected IO", meaningKey: "verified.gate.io" },
  { key: "content", label: "Plausible Output", meaningKey: "verified.gate.content" },
];
