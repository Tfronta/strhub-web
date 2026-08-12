import fs from "fs/promises";
import path from "path";
import os from "os";
import {
  putFile,
  getFileContent,
  GitHubConfigError,
  GitHubApiError,
} from "./github";
import { humanWait, msUntilSlotFrees, normalizeRepo } from "./store";
import { autoConfigSchema, type AutoConfig } from "./autoconfig";

export interface AutoConfigEntry {
  ref: string;
  createdAt: string;
  config: AutoConfig;
  model: string;
  promptVersion: number;
  manifestFingerprint: string;
}

export interface AutoConfigFile {
  repo: string;
  entries: AutoConfigEntry[];
  generations: string[];
}

const MAX_ENTRIES = 10;
const RATE_WINDOW_MS = 24 * 60 * 60 * 1000;
const RATE_MAX_PER_REPO = 5;
const RATE_MAX_PER_CLIENT = 20;

const DIR = "autoconfig";
const CLIENTS_PATH = `${DIR}/_clients.json`;

export interface AutoConfigRateResult {
  ok: boolean;
  reason?: string;
  /** Seconds until the next slot frees. Present whenever `ok` is false. */
  retryAfterSeconds?: number;
}

function repoKey(repo: string): string {
  return normalizeRepo(repo)
    .replace(/^https:\/\/github\.com\//, "")
    .replace(/[^a-z0-9._-]+/g, "--");
}

function autoConfigPath(repo: string): string {
  return `${DIR}/${repoKey(repo)}.json`;
}

function localCandidates(storePath: string): string[] {
  return [
    path.join(process.cwd(), "data", storePath),
    path.join(os.tmpdir(), "strhub-data", storePath),
  ];
}

async function readJson<T>(storePath: string): Promise<T | null> {
  try {
    const raw = await getFileContent(storePath);
    if (raw) return JSON.parse(raw) as T;
  } catch (e) {
    if (!(e instanceof GitHubConfigError) && !(e instanceof GitHubApiError)) throw e;
  }
  for (const file of localCandidates(storePath)) {
    try {
      return JSON.parse(await fs.readFile(file, "utf-8")) as T;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

async function writeJson(storePath: string, value: object, message: string): Promise<void> {
  const payload = JSON.stringify(value, null, 2);
  try {
    await putFile(storePath, payload, message);
  } catch (e) {
    if (!(e instanceof GitHubConfigError) && !(e instanceof GitHubApiError)) throw e;
    console.error("autoconfig-store: could not persist to the engine repo:", e.message);
  }
  for (const file of localCandidates(storePath)) {
    try {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, payload, "utf-8");
      return;
    } catch {
      // try the next candidate
    }
  }
}

function withinWindow(timestamps: string[]): string[] {
  const since = Date.now() - RATE_WINDOW_MS;
  return timestamps.filter((t) => {
    const at = new Date(t).getTime();
    return Number.isFinite(at) && at >= since;
  });
}

/** Same shape of answer as the submission limiter: say when, not just "later". */
function refusal(recent: string[], max: number, subject: string): AutoConfigRateResult {
  const ms = msUntilSlotFrees(
    recent.map((t) => new Date(t).getTime()),
    max,
    Date.now(),
    RATE_WINDOW_MS,
  );
  return {
    ok: false,
    reason: `${subject} Try again ${humanWait(ms)}.`,
    retryAfterSeconds: Math.ceil(ms / 1000),
  };
}

/**
 * Re-validate a stored configuration against the CURRENT schema.
 *
 * An entry is only as new as the schema that wrote it, and the schema gains
 * fields. Returning one unchecked once sent the review dialog a config with no
 * `outputs` section, which it read straight into a crash. Parsing here means a
 * stored entry is always the shape the rest of the code is written against;
 * sections added since it was written arrive empty.
 */
function migrate(entry: AutoConfigEntry): AutoConfigEntry | null {
  const parsed = autoConfigSchema.safeParse(entry.config);
  if (!parsed.success) return null;
  return { ...entry, config: parsed.data };
}

export async function loadAutoConfigFile(repo: string): Promise<AutoConfigFile> {
  const stored = await readJson<Partial<AutoConfigFile>>(autoConfigPath(repo));
  const entries: AutoConfigEntry[] = [];
  for (const entry of stored?.entries ?? []) {
    const migrated = migrate(entry);
    if (migrated) entries.push(migrated);
    else console.warn(`autoconfig: dropped unreadable entry ${entry.ref} for ${repo}`);
  }
  return {
    repo: normalizeRepo(repo),
    entries,
    generations: stored?.generations ?? [],
  };
}

export async function listAutoConfigs(repo: string): Promise<AutoConfigEntry[]> {
  const file = await loadAutoConfigFile(repo);
  return file.entries;
}

export async function findAutoConfig(
  repo: string,
  ref: string,
): Promise<AutoConfigEntry | null> {
  const file = await loadAutoConfigFile(repo);
  return file.entries.find((e) => e.ref === ref) ?? null;
}

export async function checkAutoConfigRate(repo: string): Promise<AutoConfigRateResult> {
  const file = await loadAutoConfigFile(repo);
  const recent = withinWindow(file.generations);
  if (recent.length >= RATE_MAX_PER_REPO) {
    return refusal(
      recent,
      RATE_MAX_PER_REPO,
      `This repository has been configured ${RATE_MAX_PER_REPO} times in the last 24 hours. Use a saved configuration below, or wait.`,
    );
  }
  return { ok: true };
}

/**
 * Second axis on the rate limit. The per-repo count alone lets one client spend
 * five generations on each of any number of repositories.
 */
export async function checkAutoConfigClientRate(
  clientHash: string,
): Promise<AutoConfigRateResult> {
  const stored = await readJson<Record<string, string[]>>(CLIENTS_PATH);
  const recent = withinWindow(stored?.[clientHash] ?? []);
  if (recent.length >= RATE_MAX_PER_CLIENT) {
    return refusal(
      recent,
      RATE_MAX_PER_CLIENT,
      "Too many automatic configurations from this client.",
    );
  }
  return { ok: true };
}

export async function recordAutoConfigClient(clientHash: string): Promise<void> {
  const stored = (await readJson<Record<string, string[]>>(CLIENTS_PATH)) ?? {};
  const pruned: Record<string, string[]> = {};
  for (const [key, times] of Object.entries(stored)) {
    const recent = withinWindow(times);
    if (recent.length) pruned[key] = recent;
  }
  pruned[clientHash] = [...(pruned[clientHash] ?? []), new Date().toISOString()];
  await writeJson(CLIENTS_PATH, pruned, "verified: autoconfig client counters");
}

export async function saveAutoConfig(
  repo: string,
  entry: AutoConfigEntry,
): Promise<AutoConfigEntry> {
  const file = await loadAutoConfigFile(repo);
  file.entries = [entry, ...file.entries.filter((e) => e.ref !== entry.ref)].slice(
    0,
    MAX_ENTRIES,
  );
  file.generations = [...withinWindow(file.generations), entry.createdAt];
  await writeJson(
    autoConfigPath(repo),
    file,
    `verified: autoconfig ${repoKey(repo)} @ ${entry.ref}`,
  );
  return entry;
}
