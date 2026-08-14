import { describe, expect, it } from "vitest";
import {
  submissionSchema,
  queuedSubmissionSchema,
  type SubmissionInput,
} from "./submission";
import { buildManifestObject } from "./manifest";

/**
 * Who submitted a tool, from the form to the manifest.
 *
 * The engine's report attributes the command, the environment and the regions
 * BED to whoever the manifest says submitted them. Before this field existed
 * there was nothing to say, and the report fell back to the repository's owner —
 * crediting AnJingwd with a regions file STRhub had written. So the rules worth
 * pinning are: a new submission cannot leave the question unanswered, an old one
 * cannot be answered on its author's behalf, and neither may guess.
 */
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

type ManifestShape = {
  submission?: { by?: string };
  tool: { maintainer?: string };
};

function manifest(sub: SubmissionInput): ManifestShape {
  const parsed = submissionSchema.parse(sub);
  return buildManifestObject(parsed, "strsearch-c70179b") as ManifestShape;
}

describe("submitter attribution", () => {
  it("requires an answer from a new submission", () => {
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

  it("carries the answer into the manifest, apart from the maintainer", () => {
    const third = manifest(VALID);
    expect(third.submission).toEqual({ by: "third_party" });
    // The maintainer is still named: a reader needs to know whose software this
    // is. What changes is that the manifest no longer implies they asked for it.
    expect(third.tool.maintainer).toBe("AnJingwd");

    const own = manifest({ ...VALID, submitter: { role: "maintainer" } });
    expect(own.submission).toEqual({ by: "maintainer" });
  });

  it("approves a queued payload from before the question existed", () => {
    const { submitter: _omitted, ...legacy } = VALID;
    const parsed = queuedSubmissionSchema.safeParse(legacy);
    expect(parsed.success).toBe(true);
    // And says nothing rather than guessing: an omitted line leaves the report
    // to name nobody, where a default would restate the original mistake.
    const built = buildManifestObject(
      queuedSubmissionSchema.parse(legacy),
      "strsearch-c70179b",
    ) as ManifestShape;
    expect(built.submission).toBeUndefined();
  });
});
