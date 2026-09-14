/**
 * Publishing a trial: the recipe that produced a verdict, queued for approval
 * exactly as it ran. The owner never retypes it, and the admin approves a
 * recipe that has already been seen to work.
 */
import { z } from "zod";
import { deriveSlug } from "./submission";

export const recipePayloadSchema = z
  .object({
    kind: z.literal("recipe"),
    trial_id: z.string().regex(/^tr_[a-z0-9]+_[a-z0-9]+$/),
    manifest_yml: z.string().min(20).max(60_000),
    dockerfile: z.string().min(10).max(60_000),
    regions_bed: z.string().max(1_000_000).optional(),
  })
  .strict();

export type RecipePayload = z.infer<typeof recipePayloadSchema>;

/**
 * The catalogue slug a published trial takes. The trial's own slug
 * (trial-<name>-<ref>) is not it: catalogue slugs identify tool + version +
 * input type so two kits of one tool get two links. The manifest the trial ran
 * carries name, version and input type; the slug is derived from those and the
 * manifest's `report.slug` line is rewritten to match.
 */
export function catalogueSlugFor(manifestYml: string): { slug: string; manifestYml: string } {
  const get = (key: string, indent = "  ") => {
    const m = manifestYml.match(new RegExp(`^${indent}${key}:\\s*["']?([^"'\\n]+?)["']?\\s*$`, "m"));
    return m ? m[1].trim() : "";
  };
  const name = get("name") || "tool";
  const version = get("version") || "unversioned";
  const type = get("type") || undefined;
  const variant = get("variant") || undefined;
  const slug = deriveSlug(name, version, type, variant);
  const rewritten = manifestYml.replace(/^(\s*slug:\s*)["']?[\w.-]+["']?\s*$/m, `$1"${slug}"`);
  return { slug, manifestYml: rewritten };
}
