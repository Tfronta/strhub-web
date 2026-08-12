import crypto from "crypto";
import { ghPublic, GitHubApiError } from "./github";
import { AutoConfigError } from "./autoconfig-errors";

const RAW = "https://raw.githubusercontent.com";

/**
 * Files worth reading, in priority order. The budget is spent top-down, so a
 * repository whose README exhausts it still contributes its manifests only if
 * they fit — hence manifests sit above the long-form docs.
 */
const WANTED = [
  "Dockerfile",
  "docker/Dockerfile",
  "pyproject.toml",
  "setup.py",
  "setup.cfg",
  "requirements.txt",
  "environment.yml",
  "environment.yaml",
  "Cargo.toml",
  "go.mod",
  "package.json",
  "CMakeLists.txt",
  "Makefile",
  "CITATION.cff",
  "README.md",
  "README.rst",
  "readme.md",
  "Readme.md",
  "README",
  "INSTALL.md",
  "docs/usage.md",
] as const;

/** Files whose content decides whether a saved configuration has gone stale. */
export const MANIFEST_FILES = [
  "Dockerfile",
  "docker/Dockerfile",
  "pyproject.toml",
  "setup.py",
  "requirements.txt",
  "environment.yml",
  "Cargo.toml",
  "go.mod",
  "package.json",
  "CMakeLists.txt",
  "Makefile",
] as const;

const MAX_FILE_BYTES = 60_000;
const MAX_TOTAL_BYTES = 220_000;
const MAX_WORKFLOWS = 3;
const MAX_WORKFLOW_BYTES = 20_000;
const MAX_TREE_PATHS = 400;

export interface ContextFile {
  path: string;
  text: string;
  truncated: boolean;
}

export interface RepoContext {
  slug: string;
  ref: string;
  files: ContextFile[];
  tree: string[];
  treeTruncated: boolean;
  workflows: ContextFile[];
  /** Identifies the build inputs, so a saved config can be flagged as stale. */
  manifestFingerprint: string;
}

interface TreeEntry {
  path: string;
  type: string;
  size?: number;
  sha?: string;
}

interface TreeResponse {
  tree: TreeEntry[];
  truncated: boolean;
}

interface Blob {
  size?: number;
  sha?: string;
}

export function repoSlug(repoUrl: string): string {
  const m = repoUrl.trim().match(/^https:\/\/github\.com\/([^/]+)\/([^/?#]+)/);
  if (!m) throw new AutoConfigError("not_a_github_repo");
  return `${m[1]}/${m[2].replace(/\.git$/, "")}`;
}

/**
 * The submission ref pattern permits dots and slashes, so a ref of "../.." would
 * survive per-segment encoding and resolve, after URL normalisation, to a path
 * outside the repository being configured.
 */
function assertSafeRef(ref: string): void {
  if (ref.split("/").includes("..") || ref.startsWith("/")) {
    throw new AutoConfigError("ref_not_found");
  }
}

async function fetchTree(slug: string, ref: string): Promise<TreeResponse> {
  assertSafeRef(ref);
  let res: TreeResponse | null;
  try {
    res = await ghPublic<TreeResponse>(
      `/repos/${slug}/git/trees/${encodeURIComponent(ref)}?recursive=1`,
    );
  } catch (e) {
    if (e instanceof GitHubApiError) throw new AutoConfigError("upstream", e.message);
    throw e;
  }
  // The tree endpoint answers 404 both for an unknown repository and for a ref
  // that does not resolve; a second lookup separates them so the author is told
  // which of the two they got wrong.
  if (!res) {
    const repo = await ghPublic<{ id: number }>(`/repos/${slug}`);
    throw new AutoConfigError(repo ? "ref_not_found" : "repo_not_found");
  }
  return res;
}

async function rawFile(
  slug: string,
  ref: string,
  path: string,
  maxBytes: number,
  knownSize?: number,
): Promise<ContextFile | null> {
  const url = `${RAW}/${slug}/${encodeURIComponent(ref)}/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
  const oversized = knownSize !== undefined && knownSize > maxBytes;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: oversized ? { Range: `bytes=0-${maxBytes - 1}` } : {},
    });
    if (!res.ok && res.status !== 206) return null;
    let text = await res.text();
    let truncated = oversized;
    if (text.length > maxBytes) {
      text = text.slice(0, maxBytes);
      truncated = true;
    }
    // A byte range can cut a multi-byte character in half; the decoder leaves a
    // replacement character behind, which is noise in the prompt.
    if (truncated) text = text.replace(/�+$/, "");
    return { path, text, truncated };
  } catch {
    return null;
  }
}

function indexBlobs(tree: TreeResponse): Map<string, Blob> {
  const blobs = new Map<string, Blob>();
  for (const entry of tree.tree) {
    if (entry.type === "blob") {
      blobs.set(entry.path, { size: entry.size, sha: entry.sha });
    }
  }
  return blobs;
}

/**
 * Git blob SHAs of the files that decide how the tool is built. Comparing this
 * between two refs says whether a saved configuration still describes the build,
 * and costs one tree request rather than a re-read of every file.
 */
export function manifestFingerprint(blobs: Map<string, Blob>): string {
  const parts = MANIFEST_FILES.filter((p) => blobs.has(p)).map(
    (p) => `${p}:${blobs.get(p)?.sha ?? ""}`,
  );
  return crypto.createHash("sha256").update(parts.join("\n")).digest("hex").slice(0, 32);
}

export async function fetchManifestFingerprint(
  repoUrl: string,
  ref: string,
): Promise<string> {
  const slug = repoSlug(repoUrl);
  return manifestFingerprint(indexBlobs(await fetchTree(slug, ref)));
}

export async function gatherRepoContext(
  repoUrl: string,
  ref: string,
): Promise<RepoContext> {
  const slug = repoSlug(repoUrl);
  const tree = await fetchTree(slug, ref);
  const blobs = indexBlobs(tree);
  if (blobs.size === 0) throw new AutoConfigError("empty_repo");

  let budget = MAX_TOTAL_BYTES;
  const files: ContextFile[] = [];
  for (const path of WANTED) {
    if (budget <= 0) break;
    if (!blobs.has(path)) continue;
    const file = await rawFile(
      slug,
      ref,
      path,
      Math.min(MAX_FILE_BYTES, budget),
      blobs.get(path)?.size,
    );
    if (!file) continue;
    budget -= file.text.length;
    files.push(file);
  }

  const workflowPaths = [...blobs.keys()]
    .filter((p) => p.startsWith(".github/workflows/") && /\.ya?ml$/.test(p))
    .slice(0, MAX_WORKFLOWS);
  const workflowResults = await Promise.all(
    workflowPaths.map((p) =>
      rawFile(slug, ref, p, MAX_WORKFLOW_BYTES, blobs.get(p)?.size),
    ),
  );

  return {
    slug,
    ref,
    files,
    tree: [...blobs.keys()].slice(0, MAX_TREE_PATHS),
    treeTruncated: tree.truncated || blobs.size > MAX_TREE_PATHS,
    workflows: workflowResults.filter((f): f is ContextFile => f !== null),
    manifestFingerprint: manifestFingerprint(blobs),
  };
}

/**
 * A path is attacker-chosen — git permits quotes and angle brackets in
 * filenames — so it cannot go into an attribute raw without letting a crafted
 * repository close the tag and write its own markup.
 */
function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/**
 * File contents are attacker-chosen too. A file containing the closing tag would
 * otherwise end its own fence, and everything after it would read as our text
 * rather than as the repository's.
 */
function neutralizeFences(text: string): string {
  return text.replace(
    /<\/(file|repository_files|ci_workflows|file_tree)>/gi,
    "&lt;/$1&gt;",
  );
}

function renderFile(file: ContextFile): string {
  const flag = file.truncated ? ' truncated="true"' : "";
  return `<file path="${escapeAttribute(file.path)}"${flag}>\n${neutralizeFences(
    file.text,
  )}\n</file>`;
}

/**
 * Everything here is third-party content. It is fenced per file and labelled as
 * data so that instructions embedded in a README cannot be read as instructions
 * to the model.
 */
export function renderContext(ctx: RepoContext): string {
  const parts = [
    `Repository: https://github.com/${ctx.slug}`,
    `Pinned ref: ${ctx.ref}`,
    "",
    "<repository_files>",
    ...ctx.files.map(renderFile),
    "</repository_files>",
  ];

  if (ctx.workflows.length) {
    parts.push(
      "",
      "<ci_workflows>",
      ...ctx.workflows.map(renderFile),
      "</ci_workflows>",
    );
  }

  parts.push(
    "",
    `<file_tree${ctx.treeTruncated ? ' truncated="true"' : ""}>`,
    neutralizeFences(ctx.tree.join("\n")),
    "</file_tree>",
  );

  return parts.join("\n");
}
