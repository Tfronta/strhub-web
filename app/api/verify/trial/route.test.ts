import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as approve } from "../approve/route";
import { GET as savedConfigurations, POST as autoConfig } from "../autoconfig/route";
import { GET as repoContext } from "../repo-context/route";
import { POST as submitRecipe } from "../submit/route";
import { POST as publishTrial } from "./publish/route";
import { POST as startTrial } from "./route";

vi.mock("jsonwebtoken", () => ({ default: { sign: () => "test-app-jwt" } }));

const fetchMock = vi.fn<typeof fetch>();
const repo = "https://github.com/example/tool";
const sha = "0123456789abcdef0123456789abcdef01234567";

function request(path: string, method: "GET" | "POST", body?: unknown) {
  return new NextRequest(`http://localhost/api/verify/${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe("Verified recipe retirement", () => {
  beforeEach(() => {
    vi.stubEnv("VERIFIED_AUTOCONFIG_ENABLED", "1");
    vi.stubEnv("VERIFIED_TRIAL_FIXTURE_DIR", "");
    vi.stubEnv("GITHUB_APP_ID", "test");
    vi.stubEnv("GITHUB_APP_INSTALLATION_ID", "test");
    vi.stubEnv("GITHUB_APP_PRIVATE_KEY", "BEGIN TEST");
    fetchMock.mockReset();
    fetchMock.mockRejectedValue(new Error("Unexpected network request"));
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("rejects the old recipe entry points before any network request", async () => {
    const replies = await Promise.all([
      savedConfigurations(),
      autoConfig(),
      repoContext(),
      submitRecipe(),
      approve(),
      publishTrial(),
    ]);
    for (const reply of replies) {
      expect(reply.status).toBe(410);
      expect(await reply.json()).toEqual({
        ok: false,
        error: "recipe_workflow_retired",
        url: "/verified/submit",
      });
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    { cmd: "tool --different-flags" },
    { dockerfile: "FROM other-image" },
    { manifest_yml: "run: replaced" },
    { mode: "publish", publish: "true" },
  ])("rejects execution overrides from the trial form: %j", async (overrides) => {
    const reply = await startTrial(request("trial", "POST", {
      repo, ref: "v1.0", role: "owner", ...overrides,
    }));
    expect(reply.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("dispatches only a private trial of the resolved commit", async () => {
    fetchMock
      .mockResolvedValueOnce(Response.json({ token: "test-token", expires_at: "2099-01-01T00:00:00Z" }))
      .mockResolvedValueOnce(Response.json({ default_branch: "main" }))
      .mockResolvedValueOnce(Response.json({ sha }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));

    const reply = await startTrial(request("trial", "POST", { repo, ref: "v1.0", role: "owner" }));
    expect(reply.status).toBe(202);
    const { id, slug, ref, url } = await reply.json();
    expect(ref).toBe(sha);
    expect(url).toBe(`/verified/trial/${id}?as=owner`);
    expect(fetchMock).toHaveBeenCalledTimes(4);
    const [destination, init] = fetchMock.mock.calls[3];
    expect(destination).toMatch(/\/actions\/workflows\/[^/]+\/dispatches$/);
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body)).inputs).toEqual({
      tool: slug,
      repo,
      ref: sha,
      ref_label: "v1.0",
      dispatch_id: id,
      mode: "trial",
      publish: "false",
    });
  });
});
