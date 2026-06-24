/**
 * Lightweight persistence for the Verified submission flow: rate-limiting,
 * admin approval of new repos, and dispatch→run correlation records.
 *
 * Uses a JSON file with a /tmp fallback (same pattern as the admin content API),
 * so it works on read-only deploys. This is intentionally simple; a real
 * deployment would back it with a database.
 */
import fs from "fs/promises";
import path from "path";
import os from "os";

export interface SubmissionRecord {
  slug: string;
  repo: string;
  ref: string;
  dispatchId: string;
  createdAt: string;
  ip: string;
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

async function load(): Promise<Store> {
  for (const file of candidates()) {
    try {
      const data = await fs.readFile(file, "utf-8");
      const parsed = JSON.parse(data) as Partial<Store>;
      return {
        approvedRepos: parsed.approvedRepos ?? [],
        submissions: parsed.submissions ?? [],
      };
    } catch {
      // try next candidate
    }
  }
  return { ...EMPTY };
}

async function save(store: Store): Promise<void> {
  const payload = JSON.stringify(store, null, 2);
  try {
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, FILE), payload, "utf-8");
    return;
  } catch {
    // fall back to /tmp
  }
  const tmp = path.join(os.tmpdir(), "strhub-data");
  await fs.mkdir(tmp, { recursive: true });
  await fs.writeFile(path.join(tmp, FILE), payload, "utf-8");
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
  ip: string,
  repo: string
): Promise<RateResult> {
  const store = await load();
  const since = Date.now() - RATE_WINDOW_MS;
  const recent = store.submissions.filter(
    (s) => new Date(s.createdAt).getTime() >= since
  );
  const byIp = recent.filter((s) => s.ip === ip).length;
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

export async function recordSubmission(rec: SubmissionRecord): Promise<void> {
  const store = await load();
  store.submissions.unshift(rec);
  // Keep the store bounded.
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
  const store = await load();
  return store.submissions.filter((s) => s.status === "approved-pending");
}

export async function getRecentSubmissions(n = 20): Promise<SubmissionRecord[]> {
  const store = await load();
  return store.submissions.slice(0, n);
}

export async function getPendingBySlug(
  slug: string
): Promise<SubmissionRecord | undefined> {
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
  const store = await load();
  const rec = store.submissions.find(
    (s) => s.slug === slug && s.status === fromStatus
  );
  if (!rec) return false;
  rec.status = toStatus;
  if (extra) Object.assign(rec, extra);
  await save(store);
  return true;
}

export async function rejectSubmission(slug: string): Promise<boolean> {
  return updateSubmissionStatus(slug, "approved-pending", "rejected");
}
