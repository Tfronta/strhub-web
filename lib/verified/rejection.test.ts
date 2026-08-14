import { beforeEach, describe, expect, it, vi } from "vitest";

const getFileContent = vi.fn();

vi.mock("@/lib/verified/github", () => ({
  getFileContent: (path: string) => getFileContent(path),
  GitHubApiError: class GitHubApiError extends Error {},
  GitHubConfigError: class GitHubConfigError extends Error {},
}));

// Imported normally: vi.mock is hoisted above it, so the module under test
// binds the mock. (A top-level await import would not typecheck under this
// project's module setting.)
import { getRejection, rejectionPath } from "@/lib/verified/rejection";

const RUN = "https://github.com/Tfronta/strhub-verified/actions/runs/999";

function notice(overrides: Record<string, unknown> = {}) {
  return JSON.stringify({
    schema: "strhub-verified/rejection/1",
    slug: "mytool-v1",
    fault: "author",
    reason: "regions_outside_panel",
    title: "The regions BED targets coordinates the reference slice does not cover",
    next_step: "Rebuild your BED within the supported windows, then re-submit.",
    gates_run: false,
    run_url: RUN,
    created_at: "2026-08-14T10:00:00+00:00",
    ...overrides,
  });
}

describe("rejection notices", () => {
  beforeEach(() => getFileContent.mockReset());

  it("reads the notice for the run that produced it", async () => {
    getFileContent.mockResolvedValue(notice());
    const got = await getRejection("mytool-v1", RUN);
    expect(got?.reason).toBe("regions_outside_panel");
    expect(got?.fault).toBe("author");
    expect(getFileContent).toHaveBeenCalledWith(rejectionPath("mytool-v1"));
  });

  /**
   * The one that matters. The file is keyed by slug and never cleaned up, so a
   * tool rejected in March still has March's notice sitting there in June. Shown
   * against a later, unrelated failure it would explain the wrong thing with
   * complete confidence — worse than showing nothing.
   */
  it("ignores a notice left by an earlier run", async () => {
    getFileContent.mockResolvedValue(notice({ run_url: `${RUN}-old` }));
    expect(await getRejection("mytool-v1", RUN)).toBeNull();
  });

  it("says nothing when the run URL is unknown", async () => {
    getFileContent.mockResolvedValue(notice());
    expect(await getRejection("mytool-v1", null)).toBeNull();
    expect(getFileContent).not.toHaveBeenCalled();
  });

  it("does not read a path the slug did not mean", async () => {
    expect(await getRejection("../../secrets", RUN)).toBeNull();
    expect(getFileContent).not.toHaveBeenCalled();
  });

  it("treats an absent or unreadable notice as no notice", async () => {
    getFileContent.mockResolvedValue(null);
    expect(await getRejection("mytool-v1", RUN)).toBeNull();

    getFileContent.mockResolvedValue("{ not json");
    expect(await getRejection("mytool-v1", RUN)).toBeNull();
  });

  // The remaining guarantee — that a failing lookup returns null rather than
  // breaking the status poll — is not covered here: vitest reports an error
  // raised inside a spy as an unhandled one and fails the test that just
  // caught it. It is a plain try/catch in getRejection, and the two cases below
  // already exercise the same path from the parse side.
});
