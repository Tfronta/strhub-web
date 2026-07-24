/**
 * Lightweight persistence for the Verified submission flow: rate-limiting,
 * admin approval of new repos, and dispatch→run correlation records.
 *
 * Uses a JSON file with a /tmp fallback (same pattern as the admin content API),
 * so it works on read-only deploys. This is intentionally simple; a real
 * deployment would back it with a database.
 */
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { putFile, getFileContent, listDirectory, deleteFile, GitHubConfigError, GitHubApiError } from "./github";

/**
 * Per-deployment salt for client identifiers. IPs are low-entropy (a bare SHA-256
 * of one is trivially reversed by enumeration), so the hash is only meaningful
 * with a secret salt. Falls back to a per-process random value: rate limiting then
 * only holds within one instance, which is no worse than the file store already
 * behaves on serverless, and it never degrades into a reversible digest.
 */
const CLIENT_SALT = process.env.RATE_LIMIT_SALT || crypto.randomBytes(32).toString("hex");

/**
 * Identify a client for rate limiting WITHOUT retaining their IP address.
 *
 * Records reach two public GitHub repositories: `data/verified-store.json` here,
 * and `pending/<slug>.json` in the engine repo. An IP is personal data, and rate
 * limiting only ever compares one client to another, so a salted digest does the
 * whole job while leaving nothing to leak. The raw address stays in memory for
 * the request and is passed only to the admin notification email.
 */
export function hashClient(ip: string): string {
  return crypto.createHash("sha256").update(`${CLIENT_SALT}:${ip}`).digest("hex").slice(0, 32);
}

export interface SubmissionRecord {
  slug: string;
  repo: string;
  ref: string;
  dispatchId: string;
  createdAt: string;
  /** Salted digest of the submitter's IP (see hashClient). Never the address. */
  clientHash: string;
  status: "dispatched" | "approved-pending" | "rejected";
  toolName?: string;
  payload?: string;
}

interface Store {
  approvedRepos: string[];
  submissions: SubmissionRecord[];
}

const EMPTY: Store = { approvedRepos: [], submissions: [] };
const FILE = "verified-store.json";

function candidates(): string[] {
  return [
    path.join(process.cwd(), "data", FILE),
    path.join(os.tmpdir(), "strhub-data", FILE),
  ];
}

/**
 * Canonical location of the store: a file in the ENGINE repo.
 *
 * The filesystem alone cannot hold this. On a serverless deploy `process.cwd()`
 * is read-only, so every write fell through to `os.tmpdir()`, which is per
 * instance and wiped on cold start. That silently broke the two things the store
 * exists for: rate-limit counters reset to zero whenever a new instance served
 * the request, and an approved repository could revert to "pending", trapping a
 * legitimate author in a loop with no way to make progress.
 *
 * The engine repo is already the durable side of this system — pending
 * submissions live there for exactly this reason — and the submit path already
 * commits manifest.yml, Dockerfile and regions.bed per submission, so one more
 * small file adds no meaningful traffic.
 */
const STATE_PATH = "state/verified-store.json";

/**
 * Very short-lived in-process cache. A single request calls load() three times
 * (rate limit, approval check, record); without this each would be a separate
 * API round-trip. Two seconds is far below any human retry interval, so it never
 * masks a write from another instance for a user-visible length of time.
 */
let cache: { at: number; store: Store } | null = null;
const CACHE_MS = 2000;

async function loadLocal(): Promise<Store | null> {
  for (const file of candidates()) {
    try {
      const parsed = JSON.parse(await fs.readFile(file, "utf-8")) as Partial<Store>;
      return {
        approvedRepos: parsed.approvedRepos ?? [],
        submissions: parsed.submissions ?? [],
      };
    } catch {
      // try next candidate
    }
  }
  return null;
}

async function load(): Promise<Store> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.store;

  let store: Store | null = null;
  try {
    const raw = await getFileContent(STATE_PATH);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Store>;
      store = {
        approvedRepos: parsed.approvedRepos ?? [],
        submissions: parsed.submissions ?? [],
      };
    }
  } catch (e) {
    if (!(e instanceof GitHubConfigError) && !(e instanceof GitHubApiError)) throw e;
    // GitHub unreachable or unconfigured: fall through to the local copy so the
    // route degrades instead of failing.
  }

  // No state file yet (first run after this change) — seed from the local copy,
  // which still carries the approvals granted before the move. The next save()
  // migrates them, so no manual step is needed.
  store ??= (await loadLocal()) ?? { ...EMPTY };

  cache = { at: Date.now(), store };
  return store;
}

async function save(store: Store): Promise<void> {
  const payload = JSON.stringify(store, null, 2);
  cache = { at: Date.now(), store };

  let durable = false;
  try {
    await putFile(STATE_PATH, payload, "verified: update submission state");
    durable = true;
  } catch (e) {
    if (!(e instanceof GitHubConfigError) && !(e instanceof GitHubApiError)) throw e;
    console.error("store: could not persist state to the engine repo:", e.message);
  }

  // Local copy: a warm-instance cache and the fallback when GitHub is down. Best
  // effort — on a read-only deploy both writes fail, which is why `durable` above
  // is what actually matters.
  try {
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, FILE), payload, "utf-8");
    return;
  } catch {
    // fall back to /tmp
  }
  try {
    const tmp = path.join(os.tmpdir(), "strhub-data");
    await fs.mkdir(tmp, { recursive: true });
    await fs.writeFile(path.join(tmp, FILE), payload, "utf-8");
  } catch {
    if (!durable) console.error("store: state was not persisted anywhere");
  }
}

/** Normalise a repo URL so "https://github.com/a/b" and ".git" compare equal. */
export function normalizeRepo(repo: string): string {
  return repo
    .trim()
    .toLowerCase()
    .replace(/\.git$/, "")
    .replace(/\/$/, "");
}

export async function isRepoApproved(repo: string): Promise<boolean> {
  const store = await load();
  return store.approvedRepos.includes(normalizeRepo(repo));
}

export async function approveRepo(repo: string): Promise<void> {
  const store = await load();
  const key = normalizeRepo(repo);
  if (!store.approvedRepos.includes(key)) {
    store.approvedRepos.push(key);
    await save(store);
  }
}

/** True when this repo has been verified at least once before. */
export async function hasPriorSubmission(repo: string): Promise<boolean> {
  const store = await load();
  const key = normalizeRepo(repo);
  return store.submissions.some(
    (s) => normalizeRepo(s.repo) === key && s.status === "dispatched"
  );
}

const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX_PER_IP = 5;
const RATE_MAX_PER_REPO = 3;

export interface RateResult {
  ok: boolean;
  reason?: string;
}

export async function checkRateLimit(
  clientHash: string,
  repo: string
): Promise<RateResult> {
  const store = await load();
  const since = Date.now() - RATE_WINDOW_MS;
  const recent = store.submissions.filter(
    (s) => new Date(s.createdAt).getTime() >= since
  );
  const byIp = recent.filter((s) => s.clientHash === clientHash).length;
  if (byIp >= RATE_MAX_PER_IP) {
    return { ok: false, reason: "Too many submissions from this client. Try later." };
  }
  const repoKey = normalizeRepo(repo);
  const byRepo = recent.filter((s) => normalizeRepo(s.repo) === repoKey).length;
  if (byRepo >= RATE_MAX_PER_REPO) {
    return { ok: false, reason: "Too many submissions for this repository. Try later." };
  }
  return { ok: true };
}

const PENDING_DIR = "pending";

function pendingPath(slug: string): string {
  return `${PENDING_DIR}/${slug}.json`;
}

export async function recordSubmission(rec: SubmissionRecord): Promise<void> {
  // Pending submissions are stored in the engine repo so they survive serverless restarts.
  if (rec.status === "approved-pending") {
    try {
      await putFile(
        pendingPath(rec.slug),
        JSON.stringify(rec, null, 2),
        `verified: pending submission ${rec.slug}`
      );
    } catch (e) {
      if (e instanceof GitHubConfigError || e instanceof GitHubApiError) {
        console.error("store: failed to write pending to GitHub:", e.message);
      } else {
        throw e;
      }
    }
  }
  const store = await load();
  store.submissions.unshift(rec);
  store.submissions = store.submissions.slice(0, 500);
  await save(store);
}

export async function getByDispatchId(
  dispatchId: string
): Promise<SubmissionRecord | undefined> {
  const store = await load();
  return store.submissions.find((s) => s.dispatchId === dispatchId);
}

export async function getPendingSubmissions(): Promise<SubmissionRecord[]> {
  try {
    const files = await listDirectory(PENDING_DIR);
    const records = await Promise.all(
      files.map(async (f) => {
        const content = await getFileContent(`${PENDING_DIR}/${f.name}`);
        if (!content) return null;
        try {
          return JSON.parse(content) as SubmissionRecord;
        } catch {
          return null;
        }
      })
    );
    return records.filter((r): r is SubmissionRecord => r !== null && !!r.slug);
  } catch (e) {
    if (e instanceof GitHubConfigError || e instanceof GitHubApiError) {
      // Fall back to local store if GitHub is unavailable.
      const store = await load();
      return store.submissions.filter((s) => s.status === "approved-pending");
    }
    throw e;
  }
}

export async function getRecentSubmissions(n = 20): Promise<SubmissionRecord[]> {
  const store = await load();
  return store.submissions.slice(0, n);
}

export async function getPendingBySlug(
  slug: string
): Promise<SubmissionRecord | undefined> {
  try {
    const content = await getFileContent(pendingPath(slug));
    if (content) return JSON.parse(content) as SubmissionRecord;
  } catch (e) {
    if (!(e instanceof GitHubConfigError) && !(e instanceof GitHubApiError)) throw e;
  }
  const store = await load();
  return store.submissions.find(
    (s) => s.slug === slug && s.status === "approved-pending"
  );
}

export async function updateSubmissionStatus(
  slug: string,
  fromStatus: SubmissionRecord["status"],
  toStatus: SubmissionRecord["status"],
  extra?: Partial<SubmissionRecord>
): Promise<boolean> {
  // Remove from GitHub pending dir when leaving approved-pending.
  if (fromStatus === "approved-pending") {
    try {
      await deleteFile(
        pendingPath(slug),
        `verified: ${toStatus === "dispatched" ? "approved" : "rejected"} ${slug}`
      );
    } catch (e) {
      if (!(e instanceof GitHubConfigError) && !(e instanceof GitHubApiError)) throw e;
    }
  }
  const store = await load();
  const rec = store.submissions.find(
    (s) => s.slug === slug && s.status === fromStatus
  );
  if (rec) {
    rec.status = toStatus;
    if (extra) Object.assign(rec, extra);
    await save(store);
  }
  return true;
}

export async function rejectSubmission(slug: string): Promise<boolean> {
  return updateSubmissionStatus(slug, "approved-pending", "rejected");
}
