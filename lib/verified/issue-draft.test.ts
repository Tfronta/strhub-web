import { describe, expect, it } from "vitest";
import { buildIssueDraft, draftReasons, repoSlug } from "./issue-draft";
import type { VerifiedReport } from "@/types/verified";

/**
 * The draft is written for somebody who did not ask for it, about software that
 * is theirs, by a system they have never heard of. The properties worth pinning
 * are therefore less about formatting than about restraint: no draft when there
 * is nothing to say, no unverified claim unless it was asked for, and every
 * statement anchored to evidence they can check without trusting us.
 */
function report(overrides: Partial<VerifiedReport> = {}): VerifiedReport {
  return {
    schema: "strhub-verified/1",
    tool: { name: "STRsearch", version: "c70179b" },
    source: {
      repo: "https://github.com/AnJingwd/STRsearch",
      ref_resolved: "c70179b3b175adc82a7314409af06900b3861d61",
    },
    environment: { os: ["ubuntu-22.04"], dockerfile: "Dockerfile" },
    generated: "2026-08-14T12:22:21+00:00",
    ci_run: "https://github.com/Tfronta/strhub-verified/actions/runs/1",
    gates: { none: false, available: true, installs: true, runs: true, io: true, content: true },
    level: "content",
    ...overrides,
  } as VerifiedReport;
}

describe("issue drafts", () => {
  it("offers no draft for a clean run", () => {
    // Nothing happened that its maintainer does not already know. A button that
    // always produces a draft is a button that manufactures issues.
    expect(draftReasons(report())).toEqual([]);
    expect(buildIssueDraft(report(), "strsearch-c70179b")).toBeNull();
  });

  it("writes one when the run stopped short", () => {
    const draft = buildIssueDraft(
      report({
        gates: { none: false, available: true, installs: false, runs: false, io: false, content: false },
        level: "available",
      }),
      "strsearch-c70179b",
    );
    expect(draft?.title).toContain("did not build from source");
    expect(draft?.body).toContain("not a finding that the software is faulty");
  });

  it("writes one when the tool reported errors, without judging the results", () => {
    const draft = buildIssueDraft(
      report({
        diagnostics: {
          own: [
            {
              id: "cannot_open",
              severity: "error",
              title: "A file could not be opened",
              count: 3,
              examples: ["/data/out/vWA_input.bam", "/data/out/TH01_input.bam"],
            },
          ],
        },
      }),
      "strsearch-c70179b",
    );
    expect(draft?.reasons.join(" ")).toContain("reported errors on 3 item(s)");
    expect(draft?.body).toContain("says nothing about whether the results it did produce are correct");
    expect(draft?.body).toContain("A file could not be opened");
  });

  it("keeps unverified repository notes out unless they are asked for", () => {
    const withNotes = report({
      gates: { none: false, available: true, installs: false, runs: false, io: false, content: false },
      caveats: { source: "autoconfig", items: ["The pinned dependency versions no longer resolve."] },
    });
    expect(buildIssueDraft(withNotes, "s")?.body).not.toContain("no longer resolve");
    expect(
      buildIssueDraft(withNotes, "s", { includeRepoNotes: true })?.body,
    ).toContain("no longer resolve");
  });

  it("anchors every claim to something the maintainer can check", () => {
    const draft = buildIssueDraft(
      report({
        gates: { none: false, available: true, installs: false, runs: false, io: false, content: false },
      }),
      "strsearch-c70179b",
    );
    expect(draft?.body).toContain("https://strhub.app/verified/strsearch-c70179b");
    expect(draft?.body).toContain("tools/strsearch-c70179b/manifest.yml");
    expect(draft?.body).toContain("actions/runs/1");
    // And an invitation to contradict it.
    expect(draft?.body).toContain("tell us and we will correct the published result");
    expect(draft?.body).toContain("we will stop");
  });

  it("prefills GitHub's own new-issue form rather than posting anywhere", () => {
    const draft = buildIssueDraft(
      report({
        gates: { none: false, available: true, installs: false, runs: false, io: false, content: false },
      }),
      "strsearch-c70179b",
    );
    expect(draft?.url.startsWith("https://github.com/AnJingwd/STRsearch/issues/new?")).toBe(true);
    expect(draft?.url).toContain(encodeURIComponent("STRhub Verified: STRsearch c70179b"));
  });

  it("does not name the same version twice in the title", () => {
    const stopped = {
      gates: { none: false, available: true, installs: false, runs: false, io: false, content: false },
    };
    // Version derived from the pinned commit.
    expect(buildIssueDraft(report(stopped), "s")?.title).toContain("STRsearch c70179b —");
    // And the tag spelled with and without its v.
    const tagged = buildIssueDraft(
      report({
        ...stopped,
        tool: { name: "GangSTR", version: "2.5" },
        source: { repo: "https://github.com/gymreklab/gangstr", ref_resolved: "v2.5" },
      }),
      "gangstr-2-5",
    );
    expect(tagged?.title).toContain("GangSTR 2.5 —");
    // A ref that is genuinely other information still earns its place.
    const moved = buildIssueDraft(
      report({ ...stopped, tool: { name: "GangSTR", version: "2.5" },
        source: { repo: "https://github.com/gymreklab/gangstr", ref_resolved: "abc1234" } }),
      "gangstr-2-5",
    );
    expect(moved?.title).toContain("GangSTR 2.5 at abc1234");
  });

  it("reads owner/name off a repo URL, and declines anything else", () => {
    expect(repoSlug("https://github.com/AnJingwd/STRsearch")).toBe("AnJingwd/STRsearch");
    expect(repoSlug("https://github.com/AnJingwd/STRsearch.git")).toBe("AnJingwd/STRsearch");
    expect(repoSlug("https://gitlab.com/a/b")).toBeNull();
    expect(repoSlug(undefined)).toBeNull();
  });
});
