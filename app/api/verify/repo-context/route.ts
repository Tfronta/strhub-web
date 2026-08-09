/**
 * GET /api/verify/repo-context — everything the submit form can know about a
 * repository before the author types anything else.
 *
 * One endpoint rather than three, because the form asks all of this at the same
 * moment (the instant a valid repo URL is entered) and two of the three answers
 * depend on the same lookups:
 *
 *   ?repo=<url>            → repo metadata, the head commit, the latest release
 *                            tag, and every previous verification run of that
 *                            repo (from the published catalogue).
 *   ?repo=<url>&slug=<s>   → the above plus the full stored submission for that
 *                            run, including its regions BED, so the form can
 *                            refill Environment / Input / Execution / Output.
 *
 * Reads only. The repo lookups go through the App installation token when it is
 * configured (rate limits, see ghPublic); the catalogue is public static JSON.
 */
import { type NextRequest, NextResponse } from "next/server";
import { ghPublic, getFileContent, GitHubApiError } from "@/lib/verified/github";
import { normalizeRepo } from "@/lib/verified/store";
import { REGIONS_ASSET_PATH, SUBMISSION_ASSET_PATH } from "@/lib/verified/manifest";
import { getVerifiedIndex, getVerifiedReport } from "@/lib/verified";
import { isValidSlug } from "@/lib/verified/submission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Levels that mean the tool actually ran end to end. */
const SUCCESS_LEVELS = new Set(["runs", "io", "content"]);

interface GhRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  default_branch: string;
  has_issues: boolean;
  homepage: string | null;
  owner: { login: string; type: string };
}

interface GhCommit {
  sha: string;
  commit: { committer?: { date?: string } | null };
}

interface GhRelease {
  tag_name: string;
  published_at: string | null;
}

interface GhTag {
  name: string;
}

interface GhOwner {
  name: string | null;
  login: string;
  email: string | null;
}

/** owner/name from a GitHub repo URL, or null if it is not one. */
function repoSlugOf(url: string): string | null {
  const m = url
    .trim()
    .replace(/\.git$/, "")
    .replace(/\/+$/, "")
    .match(/^https:\/\/github\.com\/([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)$/);
  return m ? `${m[1]}/${m[2]}` : null;
}

export async function GET(request: NextRequest) {
  const repoParam = request.nextUrl.searchParams.get("repo") ?? "";
  const slugParam = request.nextUrl.searchParams.get("slug");

  const repoSlug = repoSlugOf(repoParam);
  if (!repoSlug) {
    return NextResponse.json(
      { ok: false, error: "Not a public GitHub repository URL." },
      { status: 400 }
    );
  }

  try {
    const [repo, index] = await Promise.all([
      ghPublic<GhRepo>(`/repos/${repoSlug}`),
      getVerifiedIndex(),
    ]);

    if (!repo) {
      return NextResponse.json(
        { ok: false, error: "That repository does not exist, or it is not public." },
        { status: 404 }
      );
    }

    // The head commit and a release tag are offered as two ways to pin the same
    // repo. Tags are asked for first-class because they make a far better
    // permanent report URL than a hex string.
    const [head, release, tags, owner] = await Promise.all([
      ghPublic<GhCommit>(`/repos/${repoSlug}/commits/${encodeURIComponent(repo.default_branch)}`),
      ghPublic<GhRelease>(`/repos/${repoSlug}/releases/latest`),
      ghPublic<GhTag[]>(`/repos/${repoSlug}/tags?per_page=1`),
      ghPublic<GhOwner>(`/users/${repo.owner.login}`),
    ]).catch(() => [null, null, null, null] as const);

    // A repo can carry tags without ever cutting a release, so fall back to the
    // most recent tag before giving up on offering one.
    const latestTag = release?.tag_name ?? tags?.[0]?.name ?? null;

    const previous = index.tools
      .filter((entry) => entry.source_repo && normalizeRepo(entry.source_repo) === normalizeRepo(repoParam))
      .sort((a, b) => (b.generated ?? "").localeCompare(a.generated ?? ""))
      .map((entry) => ({
        slug: entry.slug,
        name: entry.name,
        ref: entry.source_ref,
        level: entry.level,
        label: entry.label,
        generated: entry.generated,
        succeeded: SUCCESS_LEVELS.has(entry.level),
        datasetTypes: entry.dataset_types ?? null,
      }));

    // How this repo last identified itself. It outranks the GitHub metadata for
    // prefilling: the author already chose a display name, a maintainer and a
    // contact for the attestation, and the repository's own name is only a
    // guess at those. Read from the stored submission, falling back to the
    // published report for runs that predate it.
    const lastGood = previous.find((p) => p.succeeded) ?? previous[0];
    let previousTool: {
      slug: string;
      name?: string;
      maintainer?: string;
      contact?: string;
    } | null = null;
    if (lastGood) {
      const storedRaw = await getFileContent(
        `tools/${lastGood.slug}/${SUBMISSION_ASSET_PATH}`
      );
      let tool: { name?: string; maintainer?: string; contact?: string } | null = null;
      if (storedRaw) {
        try {
          tool = (JSON.parse(storedRaw) as { tool?: typeof tool }).tool ?? null;
        } catch {
          tool = null;
        }
      }
      if (!tool) {
        const report = await getVerifiedReport(lastGood.slug);
        tool = report?.tool ?? null;
      }
      if (tool) {
        previousTool = {
          slug: lastGood.slug,
          name: tool.name,
          maintainer: tool.maintainer,
          contact: tool.contact,
        };
      }
    }

    const context = {
      ok: true as const,
      previousTool,
      repo: {
        slug: repo.full_name,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        defaultBranch: repo.default_branch,
        // The issue tracker is the contact an attestation should carry: it is
        // where a failure report belongs, and unlike an email it stays valid
        // when maintainers change.
        issuesUrl: repo.has_issues ? `${repo.html_url}/issues` : null,
        maintainer: owner?.name || repo.owner.login,
      },
      latest: {
        sha: head?.sha ?? null,
        committedAt: head?.commit?.committer?.date ?? null,
        tag: latestTag,
      },
      previous,
    };

    if (!slugParam) return NextResponse.json(context);

    // Reuse mode. The slug must be one of THIS repo's own runs: the parameter
    // otherwise turns this route into a reader for arbitrary paths in the
    // engine repo, which is not what it is for.
    if (!isValidSlug(slugParam) || !previous.some((p) => p.slug === slugParam)) {
      return NextResponse.json(
        { ok: false, error: "That verification run does not belong to this repository." },
        { status: 404 }
      );
    }

    const raw = await getFileContent(`tools/${slugParam}/${SUBMISSION_ASSET_PATH}`);
    if (!raw) {
      // Runs published before submissions were stored. The catalogue entry is
      // real, there is just nothing to refill from.
      return NextResponse.json({ ...context, reuse: null });
    }

    let stored: Record<string, unknown>;
    try {
      stored = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ ...context, reuse: null });
    }

    const regionsBed =
      stored.regions_asset === true
        ? await getFileContent(`tools/${slugParam}/${REGIONS_ASSET_PATH}`)
        : null;

    return NextResponse.json({
      ...context,
      reuse: { slug: slugParam, submission: stored, regionsBed },
    });
  } catch (e) {
    if (e instanceof GitHubApiError) {
      console.error("verify/repo-context GitHub error:", e.message);
      return NextResponse.json(
        { ok: false, error: "GitHub is not answering right now." },
        { status: 502 }
      );
    }
    console.error("verify/repo-context error:", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
