/**
 * POST /api/verify/approve — admin-only allow-list for new repos.
 *
 * Body: { repo: string, slug?: string }
 *
 * If `slug` is provided and there is a matching "approved-pending" submission,
 * the approval also commits the manifest/Dockerfile and dispatches the workflow —
 * so the tool author does not need to re-submit.
 */
import { type NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { approveRepo, normalizeRepo, getPendingBySlug, updateSubmissionStatus } from "@/lib/verified/store";
import { submissionSchema, newDispatchId } from "@/lib/verified/submission";
import { buildManifestYaml, generateDockerfile } from "@/lib/verified/manifest";
import { putFile, dispatchWorkflow, GitHubConfigError, GitHubApiError } from "@/lib/verified/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { repo?: string; slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const repo = body.repo?.trim();
  if (!repo || !/^https:\/\/github\.com\/[^/]+\/[^/]+/.test(repo)) {
    return NextResponse.json(
      { ok: false, error: "A valid GitHub repo URL is required" },
      { status: 400 }
    );
  }

  await approveRepo(repo);

  // Auto-dispatch if the caller provided a slug and there's a pending submission.
  if (body.slug) {
    const pending = await getPendingBySlug(body.slug);
    if (pending?.payload) {
      try {
        const parsed = submissionSchema.safeParse(JSON.parse(pending.payload));
        if (parsed.success) {
          const sub = parsed.data;
          const slug = pending.slug;
          const dispatchId = newDispatchId();
          const msg = `verified: add ${slug} (${sub.source.repo}@${sub.source.ref})`;
          await putFile(`tools/${slug}/manifest.yml`, buildManifestYaml(sub, slug), msg);
          await putFile(`tools/${slug}/Dockerfile`, generateDockerfile(sub), msg);
          await dispatchWorkflow({ tool: slug, dispatch_id: dispatchId });
          await updateSubmissionStatus(slug, "approved-pending", "dispatched", { dispatchId });
          return NextResponse.json({
            ok: true,
            repo: normalizeRepo(repo),
            dispatched: true,
            slug,
            dispatchId,
          });
        }
      } catch (e) {
        if (e instanceof GitHubConfigError) {
          return NextResponse.json({ ok: false, error: "Server not configured for dispatch." }, { status: 503 });
        }
        if (e instanceof GitHubApiError) {
          return NextResponse.json({ ok: false, error: "GitHub API error during dispatch.", status: e.status }, { status: 502 });
        }
        console.error("verify/approve dispatch error:", e);
        // Repo is already approved — don't fail the approval itself.
      }
    }
  }

  return NextResponse.json({ ok: true, repo: normalizeRepo(repo), dispatched: false });
}
