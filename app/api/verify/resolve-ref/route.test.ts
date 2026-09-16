import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

/**
 * The form shows the commit a run would pin before the run starts, and what it
 * shows must be what the run pins. These pin the contract: the same resolver
 * the trial uses, a SHA every time, and a refusal — never a guess — when the
 * repository or ref cannot be found.
 */
const resolveRef = vi.fn();

vi.mock("@/lib/verified/trial", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/verified/trial")>();
  return { ...actual, resolveRef: (...args: unknown[]) => resolveRef(...args) };
});

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: () => ({ ok: true }),
  clientIp: () => "test",
}));

import { GET } from "./route";

function get(query: Record<string, string>) {
  const url = new URL("http://localhost/api/verify/resolve-ref");
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
  return GET(new NextRequest(url));
}

describe("resolve-ref", () => {
  beforeEach(() => resolveRef.mockReset());

  it("returns the SHA the trial would pin, and how it was chosen", async () => {
    resolveRef.mockResolvedValue({ sha: "b2033bfbb5cf55496b776463bdf2993fa763a4be", label: "v0.7", how: "release" });
    const res = await get({ repo: "https://github.com/tfwillems/HipSTR" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      sha: "b2033bfbb5cf55496b776463bdf2993fa763a4be",
      label: "v0.7",
      how: "release",
    });
    // Resolved through the same function startTrial uses, on the owner/name slug.
    expect(resolveRef).toHaveBeenCalledWith("tfwillems/HipSTR", undefined);
  });

  it("passes a ref the person typed through, so the form confirms that one", async () => {
    resolveRef.mockResolvedValue({ sha: "abc1234abc1234abc1234abc1234abc1234abc12", label: "v0.6", how: "given" });
    const res = await get({ repo: "https://github.com/tfwillems/HipSTR", ref: "v0.6" });
    expect((await res.json()).how).toBe("given");
    expect(resolveRef).toHaveBeenCalledWith("tfwillems/HipSTR", "v0.6");
  });

  it("refuses anything that is not a public GitHub repository URL", async () => {
    const res = await get({ repo: "https://gitlab.com/a/b" });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("not_a_github_repo");
    expect(resolveRef).not.toHaveBeenCalled();
  });

  it("refuses a ref that could not be a git ref", async () => {
    const res = await get({ repo: "https://github.com/a/b", ref: "not a ref!" });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_ref");
  });

  it("says when nothing could be found, naming which", async () => {
    resolveRef.mockResolvedValue(null);
    const missingRepo = await get({ repo: "https://github.com/a/gone" });
    expect(missingRepo.status).toBe(404);
    expect((await missingRepo.json()).error).toBe("repo_not_found");
    const missingRef = await get({ repo: "https://github.com/a/b", ref: "v9.9" });
    expect((await missingRef.json()).error).toBe("ref_not_found");
  });
});
