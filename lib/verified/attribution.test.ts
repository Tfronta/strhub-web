import { describe, expect, it } from "vitest";
import {
  submissionSchema,
  queuedSubmissionSchema,
  deriveSlug,
  versionFromRef,
  type SubmissionInput,
} from "./submission";
const VALID: SubmissionInput = {
  tool: { name: "STRsearch", version: "c70179b", maintainer: "AnJingwd" },
  submitter: { role: "third_party" },
  source: {
    repo: "https://github.com/AnJingwd/STRsearch",
    ref: "c70179b3b175adc82a7314409af06900b3861d61",
  },
  docker: { mode: "generated", language: "python", build_cmd: "pip install ." },
  run: { cmd: "strsearch --bam /data/in/input.bam", timeout_minutes: 15 },
  inputs: { type: "illumina-bam-hg38" },
  outputs: [{ path: "out.tsv", format: "tsv", min_records: 1 }],
  os: ["ubuntu-22.04"],
};

describe("historical submitter attribution", () => {
  it("requires a role in the final submission schema", () => {
    const { submitter, ...withoutRole } = VALID;
    expect(submitter).toBeDefined();
    expect(submissionSchema.safeParse(withoutRole).success).toBe(false);
  });

  it("rejects a role that is neither of the two", () => {
    const parsed = submissionSchema.safeParse({
      ...VALID,
      submitter: { role: "unknown" },
    });
    expect(parsed.success).toBe(false);
  });

  it("reads a queued payload from before the question existed without assigning a role", () => {
    const { submitter: _omitted, ...legacy } = VALID;
    expect(queuedSubmissionSchema.parse(legacy).submitter).toBeUndefined();
  });
});

/**
 * One tool, several kits.
 *
 * STRait Razor reads the same input type at the same commit for ForenSeq and
 * for PowerSeq, and the two are different claims. They derived one slug, so a
 * second submission overwrote the first attestation — silently, because a
 * repository re-submitting its own slug is the ordinary way to re-verify.
 */
describe("kit variants", () => {
  const REF = "b618e9345ab4b0d1f8e0a4bd7d5f0e4f4c0b6a11";

  it("gives each kit its own permanent link", () => {
    const forenseq = deriveSlug("STRait Razor", versionFromRef(REF), "illumina-str-fastq", "ForenSeq v1.27");
    const powerseq = deriveSlug("STRait Razor", versionFromRef(REF), "illumina-str-fastq", "PowerSeq v2.31");
    expect(forenseq).not.toBe(powerseq);
    expect(forenseq).toBe("strait-razor-b618e93-forenseq-v1-27");
  });

  it("changes nothing for a tool that has only one", () => {
    // The six tools being re-submitted must land on the slug they already have,
    // so each replaces its card instead of adding one.
    expect(deriveSlug("STRsearch", versionFromRef("c70179b3b175adc82a7314409af06900b3861d61"), "illumina-bam-hg38"))
      .toBe("strsearch-c70179b");
    expect(deriveSlug("Strspy", "v2.0", "ont-bam-hg38")).toBe("strspy-v2-0-ont");
    expect(deriveSlug("hipstr", "v0.7", "illumina-bam-hg38-y")).toBe("hipstr-v0-7-y");
  });

  it("treats a blank variant as no variant, not as an empty one", () => {
    // A stray hyphen would land in a permanent URL.
    expect(deriveSlug("STRsearch", "c70179b", "illumina-bam-hg38", "   "))
      .toBe(deriveSlug("STRsearch", "c70179b", "illumina-bam-hg38"));
  });
});
