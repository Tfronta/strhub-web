import { describe, expect, it } from "vitest";
import { catalogueSlugFor, recipePayloadSchema } from "./trial-publish";

const base = {
  kind: "recipe" as const,
  trial_id: "tr_abc123_xyz789",
  manifest_yml: "tool:\n  name: gangstr\n  version: e368b9f\nreport:\n  slug: trial-gangstr\ninputs:\n  type: illumina-bam-hg38\n",
  dockerfile: "FROM ubuntu:22.04\nRUN make\n",
};

describe("recipe payload", () => {
  it("carries the plan-B Dockerfile when the trial had one, and none otherwise", () => {
    expect(recipePayloadSchema.safeParse(base).success).toBe(true);
    const withFallback = recipePayloadSchema.safeParse({ ...base, dockerfile_fallback: "FROM gymreklab/str-toolkit\n" });
    expect(withFallback.success).toBe(true);
    expect(withFallback.success && withFallback.data.dockerfile_fallback).toContain("str-toolkit");
  });

  it("stays strict: an unknown key is refused", () => {
    expect(recipePayloadSchema.safeParse({ ...base, dockerfile_plan_c: "x" }).success).toBe(false);
  });

  it("files the recipe under the catalogue slug", () => {
    expect(catalogueSlugFor(base.manifest_yml).slug).toBe("gangstr-e368b9f");
  });
});
