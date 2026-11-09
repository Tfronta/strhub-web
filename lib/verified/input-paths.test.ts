import { describe, expect, it } from "vitest";
import { remoteInputUrl, remotePointerSchema, repoRelativePathSchema, submissionSchema } from "./submission";
import cases from "./input-path-cases.json";

// Same cases as strhub-verified/harness/testdata/input_path_cases.json. The
// engine remains authoritative for symlinks and filesystem confinement.
describe("repository input paths", () => {
  it.each(cases)("validates $path consistently (valid=$valid)", ({ path, valid }) => {
    expect(repoRelativePathSchema.safeParse(path).success).toBe(valid);
    expect(remotePointerSchema.safeParse({ repo: "https://github.com/example/tool", ref: "a".repeat(40), path }).success).toBe(valid);
    const inputs = submissionSchema.shape.inputs;
    expect(inputs.safeParse({ fixture: path }).success).toBe(valid);
  });
  it("quotes remote file names and refs without changing their meaning", () => {
    expect(remoteInputUrl({ repo: "https://github.com/example/tool.git", ref: "release/v1", path: "./examples/a b?x#y.bam" }))
      .toBe("https://raw.githubusercontent.com/example/tool/release%2Fv1/examples/a%20b%3Fx%23y.bam");
  });
  it.each(["../main", "/main", "main/../../other", ".git/config"])("rejects remote ref traversal %s", (ref) => {
    expect(remotePointerSchema.safeParse({ repo: "https://github.com/example/tool", ref, path: "example.bam" }).success).toBe(false);
  });
});
