import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AutoConfig } from "./autoconfig";

const files = new Map<string, string>();

vi.mock("./github", () => ({
  getFileContent: async (path: string) => files.get(path) ?? null,
  putFile: async (path: string, content: string) => {
    files.set(path, content);
  },
  GitHubConfigError: class GitHubConfigError extends Error {},
  GitHubApiError: class GitHubApiError extends Error {},
}));

vi.mock("fs/promises", () => ({
  default: {
    readFile: async () => {
      throw new Error("no local copy in tests");
    },
    writeFile: async () => undefined,
    mkdir: async () => undefined,
  },
}));

import {
  checkAutoConfigClientRate,
  checkAutoConfigRate,
  findAutoConfig,
  listAutoConfigs,
  recordAutoConfigClient,
  saveAutoConfig,
} from "./autoconfig-store";

const REPO = "https://github.com/tfronta/hipstr";

const config = { caveats: [] } as unknown as AutoConfig;

function entry(ref: string, createdAt = new Date().toISOString()) {
  return {
    ref,
    createdAt,
    config,
    model: "claude-opus-5",
    promptVersion: 1,
    manifestFingerprint: "fp",
  };
}

describe("autoconfig store", () => {
  beforeEach(() => files.clear());

  it("round-trips an entry for a repository", async () => {
    await saveAutoConfig(REPO, entry("v1.0"));
    expect(await findAutoConfig(REPO, "v1.0")).not.toBeNull();
    expect(await findAutoConfig(REPO, "v2.0")).toBeNull();
  });

  it("treats .git and case differences as the same repository", async () => {
    await saveAutoConfig(REPO, entry("v1.0"));
    expect(await findAutoConfig("https://github.com/Tfronta/HipSTR.git", "v1.0")).not.toBeNull();
  });

  it("keeps one entry per ref, newest first", async () => {
    await saveAutoConfig(REPO, entry("v1.0", "2026-01-01T00:00:00.000Z"));
    await saveAutoConfig(REPO, entry("v2.0", "2026-01-02T00:00:00.000Z"));
    await saveAutoConfig(REPO, entry("v1.0", "2026-01-03T00:00:00.000Z"));
    const entries = await listAutoConfigs(REPO);
    expect(entries.map((e) => e.ref)).toEqual(["v1.0", "v2.0"]);
  });

  it("caps stored entries at ten", async () => {
    for (let i = 0; i < 14; i++) await saveAutoConfig(REPO, entry(`v${i}`));
    expect((await listAutoConfigs(REPO)).length).toBe(10);
  });

  it("allows five generations per repository in the window", async () => {
    for (let i = 0; i < 4; i++) await saveAutoConfig(REPO, entry(`v${i}`));
    expect((await checkAutoConfigRate(REPO)).ok).toBe(true);
    await saveAutoConfig(REPO, entry("v4"));
    expect((await checkAutoConfigRate(REPO)).ok).toBe(false);
  });

  it("does not count generations older than the window", async () => {
    const old = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
    for (let i = 0; i < 5; i++) await saveAutoConfig(REPO, entry(`v${i}`, old));
    expect((await checkAutoConfigRate(REPO)).ok).toBe(true);
  });

  it("limits a single client across repositories", async () => {
    for (let i = 0; i < 19; i++) await recordAutoConfigClient("client-a");
    expect((await checkAutoConfigClientRate("client-a")).ok).toBe(true);
    await recordAutoConfigClient("client-a");
    expect((await checkAutoConfigClientRate("client-a")).ok).toBe(false);
    expect((await checkAutoConfigClientRate("client-b")).ok).toBe(true);
  });
});
