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

/** Fase 3: BYOR fixture living in the author's PUBLIC repo (repo + ref + path). */
export const remoteFixtureSchema = z
  .object({
    repo: githubRepoUrl,
    ref: z.string().trim().regex(SHA_OR_TAG, "Invalid git ref").min(1).max(100),
    path: z.string().trim().min(1).max(300),
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
            build_cmd: z.string().trim().min(1).max(2000),
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
        // Own fixture: either a path inside the engine repo (legacy) OR a remote
        // BYOR pointer into the author's public repo (Fase 3).
        fixture: z.union([z.string().trim().min(1).max(300), remoteFixtureSchema]),
      })
      .strict(),
    outputs: z.array(outputSchema).min(1).max(5),
    os: z.array(z.string().min(1)).min(1).default(["ubuntu-22.04"]),
  })
  .strict();

export type Submission = z.infer<typeof submissionSchema>;
export type SubmissionInput = z.input<typeof submissionSchema>;

/**
 * Derive a stable, filesystem-safe slug from tool name + version. Used as the
 * directory under `tools/` and the report/badge filename stem.
 */
export function deriveSlug(name: string, version: string): string {
  const raw = `${name}-${version}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return raw || "tool";
}

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && slug.length <= 100;
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

export function isRemoteFixture(
  fixture: Submission["inputs"]["fixture"]
): fixture is z.infer<typeof remoteFixtureSchema> {
  return typeof fixture === "object" && fixture !== null && "repo" in fixture;
}
