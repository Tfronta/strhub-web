/**
 * GitHub App client for the STRhub Verified engine.
 *
 * The web acts as a central App that owns the commits + dispatches with its own
 * credentials (the clean model from §10: no fork-token gymnastics). It can:
 *   - commit manifest.yml + Dockerfile to tools/<slug>/ in the engine repo
 *   - dispatch the verify workflow
 *   - list runs and correlate them back to a dispatch via a unique id
 *
 * Configuration (server-side env only — never exposed to the client):
 *   GITHUB_APP_ID                 numeric App id
 *   GITHUB_APP_PRIVATE_KEY        PEM private key (raw, or base64-encoded)
 *   GITHUB_APP_INSTALLATION_ID    installation id on the engine repo
 *   VERIFIED_ENGINE_REPO          "owner/name" (default "Tfronta/strhub-verified")
 *   VERIFIED_ENGINE_BRANCH        default branch for commits (default "main")
 *   VERIFIED_WORKFLOW_FILE        workflow filename (default "verify.yml")
 */
import jwt from "jsonwebtoken";

const API = "https://api.github.com";

export const ENGINE_REPO =
  process.env.VERIFIED_ENGINE_REPO || "Tfronta/strhub-verified";
export const ENGINE_BRANCH = process.env.VERIFIED_ENGINE_BRANCH || "main";
export const WORKFLOW_FILE =
  process.env.VERIFIED_WORKFLOW_FILE || "verify.yml";

export class GitHubConfigError extends Error {}
export class GitHubApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function privateKey(): string {
  const raw = process.env.GITHUB_APP_PRIVATE_KEY;
  if (!raw) throw new GitHubConfigError("GITHUB_APP_PRIVATE_KEY is not set");
  // Accept either a raw PEM or a base64-encoded PEM (handy for env vars).
  if (raw.includes("BEGIN")) return raw.replace(/\\n/g, "\n");
  try {
    return Buffer.from(raw, "base64").toString("utf-8");
  } catch {
    return raw;
  }
}

/** Short-lived (10 min) App JWT, signed with the App private key (RS256). */
function appJwt(): string {
  const appId = process.env.GITHUB_APP_ID;
  if (!appId) throw new GitHubConfigError("GITHUB_APP_ID is not set");
  const now = Math.floor(Date.now() / 1000);
  return jwt.sign(
    { iat: now - 30, exp: now + 9 * 60, iss: appId },
    privateKey(),
    { algorithm: "RS256" }
  );
}

let cachedToken: { token: string; expiresAt: number } | null = null;

/** Exchange the App JWT for an installation access token (cached ~50 min). */
export async function getInstallationToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt - Date.now() > 5 * 60 * 1000) {
    return cachedToken.token;
  }
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID;
  if (!installationId)
    throw new GitHubConfigError("GITHUB_APP_INSTALLATION_ID is not set");

  const res = await fetch(
    `${API}/app/installations/${installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${appJwt()}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  if (!res.ok) {
    throw new GitHubApiError(
      `Failed to mint installation token: ${res.status} ${await res.text()}`,
      res.status
    );
  }
  const data = (await res.json()) as { token: string; expires_at: string };
  cachedToken = {
    token: data.token,
    expiresAt: new Date(data.expires_at).getTime(),
  };
  return data.token;
}

async function gh<T>(
  path: string,
  init: RequestInit & { token?: string } = {}
): Promise<T> {
  const token = init.token ?? (await getInstallationToken());
  const res = await fetch(path.startsWith("http") ? path : `${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new GitHubApiError(
      `${init.method ?? "GET"} ${path} → ${res.status}: ${await res.text()}`,
      res.status
    );
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Whether a path already exists in the engine repo (e.g. slug already taken). */
export async function pathExists(path: string): Promise<boolean> {
  try {
    await gh(
      `/repos/${ENGINE_REPO}/contents/${encodeURIComponent(path).replace(
        /%2F/g,
        "/"
      )}?ref=${ENGINE_BRANCH}`
    );
    return true;
  } catch (e) {
    if (e instanceof GitHubApiError && e.status === 404) return false;
    throw e;
  }
}

async function fileSha(path: string): Promise<string | undefined> {
  try {
    const data = await gh<{ sha: string }>(
      `/repos/${ENGINE_REPO}/contents/${encodeURIComponent(path).replace(
        /%2F/g,
        "/"
      )}?ref=${ENGINE_BRANCH}`
    );
    return data.sha;
  } catch (e) {
    if (e instanceof GitHubApiError && e.status === 404) return undefined;
    throw e;
  }
}

/** Create or update a single file in the engine repo. */
export async function putFile(
  path: string,
  content: string,
  message: string
): Promise<void> {
  const sha = await fileSha(path);
  await gh(
    `/repos/${ENGINE_REPO}/contents/${encodeURIComponent(path).replace(
      /%2F/g,
      "/"
    )}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message,
        content: Buffer.from(content, "utf-8").toString("base64"),
        branch: ENGINE_BRANCH,
        ...(sha ? { sha } : {}),
      }),
    }
  );
}

/** Dispatch the verify workflow with the given inputs. */
export async function dispatchWorkflow(
  inputs: Record<string, string>
): Promise<void> {
  await gh(
    `/repos/${ENGINE_REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
    {
      method: "POST",
      body: JSON.stringify({ ref: ENGINE_BRANCH, inputs }),
    }
  );
}

export interface WorkflowRun {
  id: number;
  name: string;
  status: string; // queued | in_progress | completed
  conclusion: string | null; // success | failure | cancelled | null
  html_url: string;
  created_at: string;
  run_started_at?: string;
}

/**
 * Find the run for a dispatch by matching the unique dispatch id, which the
 * workflow surfaces via `run-name` (a dispatch does not return a run id, §10).
 */
export async function findRunByDispatchId(
  dispatchId: string
): Promise<WorkflowRun | null> {
  const data = await gh<{ workflow_runs: WorkflowRun[] }>(
    `/repos/${ENGINE_REPO}/actions/workflows/${WORKFLOW_FILE}/runs?event=workflow_dispatch&per_page=40`
  );
  const match = data.workflow_runs.find((r) => r.name?.includes(dispatchId));
  return match ?? null;
}
