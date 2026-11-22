import { describe, expect, it } from "vitest";
import type { VerifiedIndex } from "@/types/verified";
import { findExistingCommitMatch } from "./existing-match";

const INDEX: VerifiedIndex = {
  schema: "strhub-verified/index/3",
  generated: "2026-11-22T00:00:00Z",
  count: 1,
  tools: [
    {
      slug: "strspy",
      name: "STRspy",
      level: "available",
      label: "Could not be determined",
      generated: "2026-11-20T12:00:00Z",
      version: "v1.1.1",
      sha: "abcdef1234567890abcdef1234567890abcdef12",
      verdict: "undetermined",
      instrument: "documented",
      source_repo: "https://github.com/unique379r/strspy",
      source_ref: "v1.1.1",
      ci_run: null,
      distinct_str_loci: null,
      distinct_snp_markers: null,
      total_reads: null,
      report: "strspy.json",
      page: "strspy.html",
      versions: [
        {
          sha: "abcdef1234567890abcdef1234567890abcdef12",
          instrument: "documented",
          version: "v1.1.1",
          committed: "2024-01-10T00:00:00Z",
          generated: "2026-11-20T12:00:00Z",
          level: "available",
          verdict: "undetermined",
          report: "strspy.json",
          page: "strspy.html",
        },
        {
          sha: "abcdef1234567890abcdef1234567890abcdef12",
          instrument: "curated",
          version: "v1.1.1",
          committed: "2024-01-10T00:00:00Z",
          generated: "2026-11-21T10:00:00Z",
          level: "content",
          verdict: "runs",
          report: "strspy/abcdef1-curated/strspy.json",
          page: "strspy/abcdef1-curated/strspy.html",
        },
        {
          sha: "9999999999999999999999999999999999999999",
          instrument: "documented",
          version: "v1.0.0",
          committed: "2023-01-10T00:00:00Z",
          generated: "2026-10-01T10:00:00Z",
          level: "content",
          verdict: "runs",
          report: "strspy/9999999/strspy.json",
          page: "strspy/9999999/strspy.html",
          retired: { retired: "2026-10-02", reason: "superseded" },
        },
      ],
    },
  ],
};

describe("findExistingCommitMatch", () => {
  it("returns both automatic and manual snapshots when a commit has both", () => {
    const match = findExistingCommitMatch(
      INDEX,
      "unique379r/strspy",
      "abcdef1234567890abcdef1234567890abcdef12",
    );
    expect(match).not.toBeNull();
    expect(match?.slug).toBe("strspy");
    expect(match?.href).toBe("/verified/strspy");
    expect(match?.auto?.verdict).toBe("undetermined");
    expect(match?.manual?.level).toBe("content");
    expect(match?.manual?.href).toBe("/verified/strspy?at=abcdef1&recipe=curated");
  });

  it("matches case-insensitively on owner/repo slug", () => {
    const match = findExistingCommitMatch(
      INDEX,
      "UNIQUE379R/STRspy",
      "abcdef1234567890abcdef1234567890abcdef12",
    );
    expect(match?.slug).toBe("strspy");
  });

  it("ignores retired commits and returns null for unevaluated SHAs", () => {
    expect(
      findExistingCommitMatch(
        INDEX,
        "unique379r/strspy",
        "9999999999999999999999999999999999999999",
      ),
    ).toBeNull();
    expect(
      findExistingCommitMatch(
        INDEX,
        "unique379r/strspy",
        "1111111111111111111111111111111111111111",
      ),
    ).toBeNull();
  });
});
