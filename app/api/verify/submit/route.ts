/**
 * POST /api/verify/submit — self-service tool certification entry point.
 *
 * Flow (see plan §5, §10):
 *   1. Validate the submission against the manifest-mirroring zod schema.
 *   2. Rate-limit per client + per repo.
 *   3. Reject if the slug is already taken in the engine repo.
 *   4. New repos require admin approval before their first run → recorded as
 *      "approved-pending" and NOT dispatched until an admin approves the repo.
 *   5. Approved repos: commit manifest.yml + Dockerfile to tools/<slug>/ and
 *      dispatch the verify workflow with a unique dispatch_id for correlation.
 *
 * STRhub never stores tool source code — only the verification metadata.
 */
import { type NextRequest, NextResponse } from "next/server";
import {
  submissionSchema,
  deriveSlug,
  newDispatchId,
  isRemoteFixture,
} from "@/lib/verified/submission";
import { buildManifestYaml, generateDockerfile } from "@/lib/verified/manifest";
import {
  ENGINE_REPO,
  GitHubConfigError,
  GitHubApiError,
  pathExists,
  putFile,
  dispatchWorkflow,
} from "@/lib/verified/github";
import {
  checkRateLimit,
  isRepoApproved,
  recordSubmission,
} from "@/lib/verified/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * The BYOR fixture must be PUBLIC at run time (§10). Verify the raw URL is
 * reachable before dispatching so the author gets a clear message instead of a
 * silently N/A "own" leg later.
 */
async function remoteFixtureReachable(
  repo: string,
  ref: string,
  path: string
): Promise<boolean> {
  const slug = repo.replace(/\.git$/, "").replace(/^https:\/\/github\.com\//, "");
  const url = `https://raw.githubusercontent.com/${slug}/${ref}/${path.replace(/^\//, "")}`;
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const sub = parsed.data;
  const slug = deriveSlug(sub.tool.name, sub.tool.version);
  const ip = clientIp(request);

  // 1b. BYOR fixture must be publicly reachable at submit time.
  if (isRemoteFixture(sub.inputs.fixture)) {
    const fx = sub.inputs.fixture;
    if (!(await remoteFixtureReachable(fx.repo, fx.ref, fx.path))) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Your BYOR fixture is not publicly reachable at the pinned ref. Make the repo/file public and check the path.",
        },
        { status: 400 }
      );
    }
  }

  // 2. Rate limit.
  const rate = await checkRateLimit(ip, sub.source.repo);
  if (!rate.ok) {
    return NextResponse.json({ ok: false, error: rate.reason }, { status: 429 });
  }

  try {
    // 3. New-repo gate: hold for admin approval.
    //    Skip for re-submissions — if the tool already has a manifest in the
    //    engine repo, the repo was implicitly approved on its first run.
    const isResubmission = await pathExists(`tools/${slug}/manifest.yml`);
    if (!isResubmission && !(await isRepoApproved(sub.source.repo))) {
      await recordSubmission({
        slug,
        repo: sub.source.repo,
        ref: sub.source.ref,
        dispatchId: newDispatchId(),
        createdAt: new Date().toISOString(),
        ip,
        status: "approved-pending",
      });
      return NextResponse.json(
        {
          ok: true,
          status: "pending-approval",
          slug,
          message:
            "This repository is new to STRhub Verified and must be approved by an admin before its first run. You'll be able to resubmit once approved.",
        },
        { status: 202 }
      );
    }

    // 4. Commit metadata + dispatch (overwrites manifest on re-submission).
    const dispatchId = newDispatchId();
    const manifest = buildManifestYaml(sub, slug);
    const dockerfile = generateDockerfile(sub);
    const msg = `verified: add ${slug} (${sub.source.repo}@${sub.source.ref})`;

    await putFile(`tools/${slug}/manifest.yml`, manifest, msg);
    await putFile(`tools/${slug}/Dockerfile`, dockerfile, msg);
    await dispatchWorkflow({ tool: slug, dispatch_id: dispatchId });

    await recordSubmission({
      slug,
      repo: sub.source.repo,
      ref: sub.source.ref,
      dispatchId,
      createdAt: new Date().toISOString(),
      ip,
      status: "dispatched",
    });

    return NextResponse.json(
      { ok: true, status: "dispatched", slug, dispatchId, engineRepo: ENGINE_REPO },
      { status: 201 }
    );
  } catch (e) {
    if (e instanceof GitHubConfigError) {
      console.error("verify/submit config error:", e.message);
      return NextResponse.json(
        { ok: false, error: "Server is not configured for submissions yet." },
        { status: 503 }
      );
    }
    if (e instanceof GitHubApiError) {
      console.error("verify/submit GitHub error:", e.message);
      return NextResponse.json(
        { ok: false, error: "GitHub API error while submitting.", status: e.status },
        { status: 502 }
      );
    }
    console.error("verify/submit error:", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
