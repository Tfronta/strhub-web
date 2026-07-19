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
  INPUT_TYPES,
} from "@/lib/verified/submission";
import {
  parseBed3,
  validateRegions,
  fetchPanel,
} from "@/lib/verified/validate-regions";
import {
  buildManifestYaml,
  generateDockerfile,
  REGIONS_ASSET_PATH,
} from "@/lib/verified/manifest";
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
import { notifyNewPendingSubmission } from "@/lib/email";

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
  const slug = deriveSlug(sub.tool.name, sub.tool.version, sub.inputs.type);
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

  // 1c. Regions BED: required for coordinate-based tools, and it must fit the
  //     slice's supported-loci panel. The form checks this live, but that is UX,
  //     not enforcement — a direct POST must not get past it. Rejecting here also
  //     spares a CI run that the harness pre-flight would only abort anyway.
  const typeInfo = INPUT_TYPES.find((it) => it.slug === sub.inputs.type);
  if (typeInfo?.requiresRegions) {
    if (!sub.inputs.regions_bed) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "This input type needs a regions BED: STRhub's reference BAM is a slice, so your tool must declare which supported loci to target.",
        },
        { status: 400 }
      );
    }
    const panel = sub.inputs.type ? await fetchPanel(sub.inputs.type) : null;
    // No panel for this type → we cannot prove the BED is out of scope, so we do
    // not reject. The harness pre-flight is the backstop.
    if (panel) {
      try {
        const result = validateRegions(
          parseBed3(sub.inputs.regions_bed),
          panel,
          typeInfo.minLoci ?? 5
        );
        if (!result.ok) {
          return NextResponse.json(
            {
              ok: false,
              error: `Your regions BED targets coordinates our reference slice does not cover, so your tool would find no reads there — this is not a failure of your tool. ${result.reasons.join("; ")}.`,
              regions: {
                outOfPanel: result.outOfPanel.map(
                  (r) => `${r.chrom}:${r.start}-${r.end} (line ${r.line})`
                ),
                coveredLoci: result.coveredLoci,
                panelSize: result.panelSize,
              },
            },
            { status: 400 }
          );
        }
      } catch (e) {
        return NextResponse.json(
          {
            ok: false,
            error: `Your regions BED is malformed: ${e instanceof Error ? e.message : "unparseable"}.`,
          },
          { status: 400 }
        );
      }
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
      const pendingRecord = {
        slug,
        repo: sub.source.repo,
        ref: sub.source.ref,
        dispatchId: newDispatchId(),
        createdAt: new Date().toISOString(),
        ip,
        status: "approved-pending" as const,
        toolName: sub.tool.name,
        payload: JSON.stringify(parsed.data),
      };
      await recordSubmission(pendingRecord);
      notifyNewPendingSubmission({
        slug,
        toolName: sub.tool.name,
        toolVersion: sub.tool.version,
        repo: sub.source.repo,
        ip,
      }).catch((err) => console.error("verify/submit email error:", err));
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

    // 4. Commit metadata + dispatch.
    //    For re-submissions (manifest already exists), the manifest and Dockerfile
    //    are left alone — they may have been tuned by hand (flags, fixture, etc).
    //    The uploaded regions BED is the exception: it is re-committed every time,
    //    because it is exactly what the author just uploaded and saw validated on
    //    screen. Running against a stale BED would silently contradict that.
    const dispatchId = newDispatchId();
    const alreadyExists = await pathExists(`tools/${slug}/manifest.yml`);
    const msg = `verified: ${alreadyExists ? "update" : "add"} ${slug} (${sub.source.repo}@${sub.source.ref})`;
    if (!alreadyExists) {
      const manifest = buildManifestYaml(sub, slug);
      const dockerfile = generateDockerfile(sub);
      await putFile(`tools/${slug}/manifest.yml`, manifest, msg);
      await putFile(`tools/${slug}/Dockerfile`, dockerfile, msg);
    }
    if (sub.inputs.regions_bed) {
      await putFile(`tools/${slug}/${REGIONS_ASSET_PATH}`, sub.inputs.regions_bed, msg);
    }
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
