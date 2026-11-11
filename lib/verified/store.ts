/** Historical Verified submissions and dispatch-to-run correlation. */
import fs from "fs/promises";
import path from "path";
import os from "os";
import { putFile, getFileContent, listDirectory, deleteFile, GitHubConfigError, GitHubApiError } from "./github";

export interface SubmissionRecord {
  slug: string;
  repo: string;
  ref: string;
  dispatchId: string;
  createdAt: string;
  /** Historical salted digest of the submitter's IP. */
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

/** Durable location of the historical submission records. */
const STATE_PATH = "state/verified-store.json";

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

const PENDING_DIR = "pending";

function pendingPath(slug: string): string {
  return `${PENDING_DIR}/${slug}.json`;
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

export async function rejectSubmission(slug: string): Promise<boolean> {
  try {
    await deleteFile(pendingPath(slug), `verified: rejected ${slug}`);
  } catch (e) {
    if (!(e instanceof GitHubConfigError) && !(e instanceof GitHubApiError)) throw e;
  }
  const store = await load();
  const rec = store.submissions.find(
    (s) => s.slug === slug && s.status === "approved-pending"
  );
  if (rec) {
    rec.status = "rejected";
    await save(store);
  }
  return true;
}
