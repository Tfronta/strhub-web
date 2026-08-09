/**
 * STRhub Verified — submission domain (shared by the API and the form).
 *
 * This is the single source of truth for what an author may submit. It mirrors
 * the engine's `schema/manifest.schema.json` so the web can validate a request
 * BEFORE committing a manifest and dispatching a run. Fase 3 fields
 * (`inputs.type`, remote BYOR fixture, README-check) are modelled here as
 * optional from the start so the schema does not need to be reworked later.
 *
 * Nothing here stores tool source code: a submission only references the
 * author's PUBLIC repo by URL + immutable ref.
 */
import { z } from "zod";

/** Metadata for a STRhub external reference dataset (open-access, STR loci only). */
export type ExternalDatasetInfo = {
  name: string;
  sourceUrl: string;
  /** Extra detail shown in the form, e.g. assay kits covered in NIST mds2-2157. */
  detail?: string;
};

/** Reference genome provided automatically by the harness for BAM-based datasets. */
export type ReferenceGenomeInfo = {
  assembly: string;
  mountPath: string;
};

export interface InputTypeEntry {
  slug: string;
  label: string;
  description: string;
  hasExternalDataset: boolean;
  externalDataset?: ExternalDatasetInfo;
  referenceGenome?: ReferenceGenomeInfo;
  /** Standard input paths that the harness guarantees inside the container. */
  canonicalPaths?: string[];
  /**
   * Coordinate-based tools (HipSTR, GangSTR, ...) must supply their own regions
   * BED. STRhub's reference BAM is a slice, so the BED must fall within the
   * supported-loci panel below. When set, the form requires an `inputs.regions`.
   */
  requiresRegions?: boolean;
  /**
   * Loci names the slice guarantees (mirrors datasets/<type>/loci.bed in the
   * engine repo). Shown in the form; the author's BED must cover >= minLoci of
   * them. Source of truth is the engine's loci.bed — keep in sync.
   */
  supportedLoci?: string[];
  /** Minimum distinct supported loci the author's BED must cover. */
  minLoci?: number;
}

/**
 * Known assay / input types. Each maps to a slug used in datasets/index.json
 * and a human-readable label + short description shown in the form dropdown.
 * "other" is a fallback for unlisted types (the user types a custom slug).
 *
 * `hasExternalDataset` mirrors slugs present in strhub-verified/datasets/index.json.
 * STRhub reference data covers STR assays only — not SNP panels or capillary FSA/HID.
 */
export const INPUT_TYPES = [
  {
    slug: "illumina-str-fastq",
    label: "Illumina STR FASTQ",
    description:
      "Illumina MiSeq/MiniSeq STR FASTQ: Verogen ForenSeq or Promega PowerSeq 46GY (the only two kits in our NIST reference dataset for now)",
    hasExternalDataset: true,
    externalDataset: {
      name: "NIST mds2-2157",
      sourceUrl: "https://data.nist.gov/od/id/mds2-2157",
      detail: "Verogen ForenSeq & Promega PowerSeq 46GY (donor NTD01)",
    },
    canonicalPaths: ["/data/in/sample.fastq"],
  },
  {
    slug: "ont-bam-hg38",
    label: "ONT BAM (hg38)",
    description: "Oxford Nanopore aligned BAM against hg38 (CODIS regions)",
    hasExternalDataset: true,
    externalDataset: {
      name: "1000 Genomes ONT, hg38 CODIS slice",
      sourceUrl:
        "https://s3.amazonaws.com/1000g-ont/index.html?prefix=PROCESSED_DATA/ALIGNED_TO_HG38/MINIMAP2_ALIGNED_BAMS/",
    },
    referenceGenome: {
      assembly: "GRCh38 / hg38",
      mountPath: "/data/ref/hg38.fa",
    },
    canonicalPaths: ["/data/in/input.bam", "/data/ref/hg38.fa"],
    // requiresRegions intentionally unset: the ONT supported-loci panel
    // (datasets/ont-bam-hg38/loci.bed) is not yet built — 4 loci lack STR
    // coordinates (DXS8378, DXS7132, AMEL, AMEL_Y). Enable once loci.bed exists.
  },
  {
    slug: "illumina-bam-hg38",
    label: "Illumina BAM (hg38), autosomal",
    description: "Illumina WGS BAM aligned to hg38 (autosomal forensic STR loci)",
    hasExternalDataset: true,
    externalDataset: {
      name: "GIAB NA12878 300x, hg38 autosomal forensic slice",
      sourceUrl:
        "https://ftp-trace.ncbi.nlm.nih.gov/ReferenceSamples/giab/data/NA12878/NIST_NA12878_HG001_HiSeq_300x/",
    },
    referenceGenome: {
      assembly: "GRCh38 / hg38",
      mountPath: "/data/ref/hg38.fa",
    },
    canonicalPaths: ["/data/in/input.bam", "/data/ref/hg38.fa"],
    requiresRegions: true,
    minLoci: 5,
    // Mirrors datasets/illumina-bam-hg38/loci.bed (24 loci, floor 55x). Source of
    // truth is that BED; keep in sync (harness/build_panel.py regenerates it).
    supportedLoci: [
      "D1S1656", "TPOX", "D2S441", "D2S1338", "D3S1358", "FGA", "D5S818", "CSF1PO",
      "SE33", "D6S1043", "D7S820", "D8S1179", "D10S1248", "TH01", "vWA", "D12S391",
      "D13S317", "PentaE", "D16S539", "D18S51", "D19S433", "D21S11", "PentaD", "D22S1045",
    ],
  },
  {
    slug: "illumina-bam-hg38-y",
    label: "Illumina BAM (hg38), Y-STR",
    description: "Illumina WGS BAM aligned to hg38 (Y-chromosome STR loci)",
    hasExternalDataset: true,
    externalDataset: {
      name: "GIAB HG002 300x, hg38 Y-STR slice",
      sourceUrl:
        "https://ftp-trace.ncbi.nlm.nih.gov/ReferenceSamples/giab/data/AshkenazimTrio/HG002_NA24385_son/NIST_HiSeq_HG002_Homogeneity-10953946/",
    },
    referenceGenome: {
      assembly: "GRCh38 / hg38",
      mountPath: "/data/ref/hg38.fa",
    },
    canonicalPaths: ["/data/in/input.bam", "/data/ref/hg38.fa"],
    requiresRegions: true,
    minLoci: 5,
    // Mirrors datasets/illumina-bam-hg38-y/loci.bed (14 loci, floor 10x). DYS385a
    // is excluded: DYS385a/b are collapsed in the GIAB alignment, starving the 'a'
    // copy to ~2-10x. Source of truth is that BED; keep in sync.
    supportedLoci: [
      "DYS393", "DYS456", "DYS458", "DYS19/DYS394", "DYS391", "DYS635",
      "DYS389I/DYS389II", "DYS438", "DYS390", "Y-GATA-A10", "Y-GATA-H4",
      "DYS385_2", "DYS392", "DYS448",
    ],
  },
  {
    slug: "ont-fastq",
    label: "ONT FASTQ",
    description: "Oxford Nanopore raw FASTQ reads",
    hasExternalDataset: false,
  },
  {
    slug: "illumina-snp-fastq",
    label: "Illumina SNP FASTQ",
    description: "Illumina FASTQ targeting identity/ancestry SNPs",
    hasExternalDataset: false,
  },
  {
    slug: "capillary-fsa",
    label: "Capillary electrophoresis (FSA/HID)",
    description: "ABI .fsa or .hid fragment analysis files",
    hasExternalDataset: false,
  },
] satisfies InputTypeEntry[];
export type InputTypeSlug = (typeof INPUT_TYPES)[number]["slug"];

export const INPUT_TYPES_WITH_REFERENCE = INPUT_TYPES.filter((t) => t.hasExternalDataset);
export const INPUT_TYPES_OWN_ONLY = INPUT_TYPES.filter((t) => !t.hasExternalDataset);

/** Output formats the engine's IO gate understands. */
export const OUTPUT_FORMATS = ["vcf", "csv", "tsv", "json", "text"] as const;
export type OutputFormat = (typeof OUTPUT_FORMATS)[number];

/** Build paths for the Dockerfile (see §14 of the plan). */
export const DOCKER_MODES = ["provided", "generated"] as const;
export type DockerMode = (typeof DOCKER_MODES)[number];

/** Base images offered for the generated (camino B) Dockerfile template. */
export const BUILD_LANGUAGES = [
  "python",
  "conda",
  "c-cpp",
  "rust",
  "go",
  "java",
  "node",
] as const;
export type BuildLanguage = (typeof BUILD_LANGUAGES)[number];

const SHA_OR_TAG = /^[0-9a-zA-Z._\-/]+$/;
const SLUG_RE = /^[a-z0-9][a-z0-9._-]*$/;

const httpsUrl = z
  .string()
  .trim()
  .url()
  .refine((u) => u.startsWith("https://"), "Must be an https:// URL");

const githubRepoUrl = httpsUrl.refine(
  (u) => /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(u.replace(/\.git$/, "")),
  "Must be a public GitHub repo URL (https://github.com/owner/name)"
);

/** Optional structural plausibility checks (the Content gate). */
export const contentSchema = z
  .object({
    columns: z.number().int().min(1).optional(),
    dna_column: z.number().int().min(0).optional(),
    count_columns: z.array(z.number().int().min(0)).optional(),
    locus_column: z.number().int().min(0).optional(),
    locus_sep: z.string().min(1).max(4).optional(),
    min_distinct_loci: z.number().int().min(1).optional(),
    expect_loci: z.array(z.string().min(1)).optional(),
    min_total_reads: z.number().int().min(0).optional(),
  })
  .strict();

export const outputSchema = z
  .object({
    path: z.string().trim().min(1).max(200),
    format: z.enum(OUTPUT_FORMATS),
    min_records: z.number().int().min(0).default(1),
    must_contain: z.array(z.string().min(1)).optional(),
    content: contentSchema.optional(),
  })
  .strict();

/** A file living in the author's PUBLIC repo (repo + ref + path). Used for both
 *  the BYOR fixture and the regions BED so STRhub stores no author data. */
export const remotePointerSchema = z
  .object({
    repo: githubRepoUrl,
    ref: z.string().trim().regex(SHA_OR_TAG, "Invalid git ref").min(1).max(100),
    path: z.string().trim().min(1).max(300),
  })
  .strict();

/** @deprecated alias — use remotePointerSchema. Kept for existing imports. */
export const remoteFixtureSchema = remotePointerSchema;

/**
 * Author-declared environment ceilings. Mirrors `compatibility` in the engine's
 * schema/manifest.schema.json and COMPATIBILITY_FLAGS in ./manual.ts — all three
 * must list the same keys.
 */
export const compatibilitySchema = z
  .object({
    requires_gui: z.boolean().optional(),
    requires_gpu: z.boolean().optional(),
    requires_runtime_network: z.boolean().optional(),
    requires_licensed_reference: z.boolean().optional(),
    requires_unsupported_os: z.boolean().optional(),
    opaque_output_format: z.boolean().optional(),
  })
  .strict();

export const submissionSchema = z
  .object({
    tool: z
      .object({
        name: z.string().trim().min(1).max(120),
        version: z.string().trim().min(1).max(60),
        maintainer: z.string().trim().max(200).optional(),
        contact: z.string().trim().max(300).optional(),
      })
      .strict(),
    source: z
      .object({
        repo: githubRepoUrl,
        ref: z
          .string()
          .trim()
          .regex(SHA_OR_TAG, "Invalid git ref")
          .min(1)
          .max(100),
      })
      .strict(),
    docker: z
      .discriminatedUnion("mode", [
        z
          .object({
            mode: z.literal("provided"),
            // Camino A: author pastes the full Dockerfile (committed verbatim).
            dockerfile: z.string().min(10).max(20000),
          })
          .strict(),
        z
          .object({
            mode: z.literal("generated"),
            // Camino B: engine builds the Dockerfile from a template.
            language: z.enum(BUILD_LANGUAGES),
            // Optional: a tool can be a script or a prebuilt binary that runs
            // straight from the clone, with nothing to install. Requiring a
            // command there forced authors to invent a no-op.
            build_cmd: z.string().trim().max(2000).optional(),
            // Optional sanity-check command run during build (e.g. `tool --help`).
            check_cmd: z.string().trim().max(500).optional(),
          })
          .strict(),
      ]),
    run: z
      .object({
        cmd: z.string().trim().min(1).max(4000),
        timeout_minutes: z.number().int().min(1).max(60).default(15),
      })
      .strict(),
    inputs: z
      .object({
        // Fase 3: assay type used to match a compatible external dataset.
        type: z.string().trim().max(80).optional(),
        // Own fixture: optional when the input type has a STRhub reference dataset.
        fixture: z.union([z.string().trim().min(1).max(300), remoteFixtureSchema]).optional(),
        // The author's regions BED, uploaded through the form as raw text.
        //
        // An earlier design took a pointer into the author's repo, but that meant
        // chasing every tool's publishing habits: HipSTR's reference is a 78 MB
        // gzipped genome-wide BED behind a /raw/ URL, and each tool differs again.
        // The author already has the file locally; having them upload it ends the
        // chase. STRhub commits it under the tool's assets/ and records that THEY
        // chose the loci (see manifest inputs.regions.provided_by).
        //
        // 1 MB is far above any forensic panel (tens of rows) and far below a
        // genome-wide reference, which cannot work against a slice anyway.
        regions_bed: z.string().min(1).max(1_000_000).optional(),
      })
      .strict(),
    outputs: z.array(outputSchema).min(1).max(5),
    os: z.array(z.string().min(1)).min(1).default(["ubuntu-22.04"]),
    // Pre-flight (level-2 trigger A). Each flag is a factual property of the
    // tool that the free runner structurally cannot provide — headless, CPU-only,
    // capped memory/disk, and a pinned snapshot that cannot fetch at run time.
    // Ticking one routes the submission to manual verification instead of
    // spending a CI run to discover the same thing. Difficulty with THIS FORM is
    // deliberately not among them: that is ours to fix, and is handled for free.
    compatibility: compatibilitySchema.optional(),
  })
  .strict();

export type Submission = z.infer<typeof submissionSchema>;
export type SubmissionInput = z.input<typeof submissionSchema>;

/**
 * Short slug suffix appended to name-version when the input type is a variant
 * of the default. Types listed here with "" are considered the canonical variant
 * (no suffix). Unlisted types fall back to their last hyphen-segment.
 */
const TYPE_SLUG_SUFFIX: Record<string, string> = {
  "illumina-bam-hg38":   "",       // canonical BAM — no suffix
  "illumina-str-fastq":  "",       // canonical FASTQ — no suffix
  "illumina-bam-hg38-y": "y",     // Y-STR variant
  "ont-bam-hg38":        "ont",
  "ont-fastq":           "ont",
  "illumina-snp-fastq":  "snp",
  "capillary-fsa":       "fsa",
};

/**
 * Derive a stable, filesystem-safe slug from tool name + version + input type.
 * Input type adds a short suffix for non-canonical variants (e.g. "-y" for Y-STR)
 * so the same tool submitted for different assay types gets distinct directories.
 */
export function deriveSlug(name: string, version: string, inputType?: string): string {
  const base = `${name}-${version}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let suffix = "";
  if (inputType) {
    const mapped = TYPE_SLUG_SUFFIX[inputType];
    suffix = mapped !== undefined ? mapped : (inputType.split("-").pop() ?? "");
  }

  return (suffix ? `${base}-${suffix}` : base) || "tool";
}

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && slug.length <= 100;
}

/** True when a ref looks like a commit SHA rather than a tag or branch. */
export function isCommitSha(ref: string): boolean {
  return /^[0-9a-f]{7,40}$/i.test(ref.trim());
}

/**
 * The tool version, derived from the pinned ref.
 *
 * The form no longer asks for a version separately: the ref IS the identity of
 * what was verified, and asking for both invited them to disagree (v3.0 pinned
 * at a commit from v2.9). The engine's manifest schema still requires
 * `tool.version`, and it is what readers see on the attestation, so it is
 * derived here instead: a tag travels verbatim, a SHA is shortened to 7 —
 * enough to identify the commit, short enough for the slug that becomes the
 * report's permanent URL.
 */
export function versionFromRef(ref: string): string {
  const r = ref.trim();
  return isCommitSha(r) ? r.slice(0, 7).toLowerCase() : r;
}

/**
 * A unique correlation id passed as a workflow input. The engine echoes it so a
 * dispatch (which does not return a run id) can be matched to its run by
 * filtering `GET /actions/runs` (see §10). Format: `sv_<base36 time>_<rand>`.
 */
export function newDispatchId(): string {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `sv_${time}_${rand}`;
}

/** True when a fixture/regions pointer is remote ({repo,ref,path}) vs a repo path. */
export function isRemotePointer(
  ref: string | z.infer<typeof remotePointerSchema> | undefined
): ref is z.infer<typeof remotePointerSchema> {
  return typeof ref === "object" && ref !== null && "repo" in ref;
}

/** @deprecated use isRemotePointer. */
export const isRemoteFixture = isRemotePointer;
