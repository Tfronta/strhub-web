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
// The queue's own schema, not the submit endpoint's: a payload sitting here may
// predate a field that is now required, and an approval must not be refused over
// a question its author was never asked (see queuedSubmissionSchema).
import { queuedSubmissionSchema, newDispatchId } from "@/lib/verified/submission";
import { recipePayloadSchema } from "@/lib/verified/trial-publish";
import {
  buildManifestYaml,
  buildSubmissionJson,
  generateDockerfile,
  REGIONS_ASSET_PATH,
  SUBMISSION_ASSET_PATH,
} from "@/lib/verified/manifest";
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
        const raw = JSON.parse(pending.payload);
        // A recipe published from a trial: the exact manifest and Dockerfile the
        // engine ran, committed verbatim. Nothing to rebuild from form answers.
        const recipe = recipePayloadSchema.safeParse(raw);
        if (recipe.success) {
          const slug = pending.slug;
          const dispatchId = newDispatchId();
          const msg = `verified: add ${slug} from trial ${recipe.data.trial_id} (${pending.repo}@${pending.ref})`;
          await putFile(`tools/${slug}/manifest.yml`, recipe.data.manifest_yml, msg);
          await putFile(`tools/${slug}/Dockerfile`, recipe.data.dockerfile, msg);
          // Plan B travels with the recipe: the manifest declares it under
          // environment.fallback, and prepare.py warns (and runs without one)
          // if the file it names is not next to the manifest.
          if (recipe.data.dockerfile_fallback) {
            await putFile(`tools/${slug}/Dockerfile.fallback`, recipe.data.dockerfile_fallback, msg);
          }
          if (recipe.data.regions_bed) {
            await putFile(`tools/${slug}/${REGIONS_ASSET_PATH}`, recipe.data.regions_bed, msg);
          }
          await dispatchWorkflow({ tool: slug, dispatch_id: dispatchId });
          await updateSubmissionStatus(slug, "approved-pending", "dispatched", { dispatchId });
          return NextResponse.json({ ok: true, repo: normalizeRepo(repo), dispatched: true, slug, dispatchId });
        }
        const parsed = queuedSubmissionSchema.safeParse(raw);
        if (parsed.success) {
          const sub = parsed.data;
          const slug = pending.slug;
          const dispatchId = newDispatchId();
          const msg = `verified: add ${slug} (${sub.source.repo}@${sub.source.ref})`;
          await putFile(`tools/${slug}/manifest.yml`, buildManifestYaml(sub, slug), msg);
          await putFile(`tools/${slug}/Dockerfile`, generateDockerfile(sub), msg);
          // The manifest names this path, so omitting it aborts the run at the
          // pre-flight with "uploaded regions BED not found". Approval is the
          // FIRST run of every coordinate-based tool, so leaving it out made that
          // first run fail every time and pass only on re-submission, which is
          // exactly the kind of fault that hides for months.
          if (sub.inputs.regions_bed) {
            await putFile(`tools/${slug}/${REGIONS_ASSET_PATH}`, sub.inputs.regions_bed, msg);
          }
          // The answers behind the manifest, so a later submission from the
          // same repository can refill the form. Written here because every
          // submission now passes through approval; never fatal.
          try {
            await putFile(
              `tools/${slug}/${SUBMISSION_ASSET_PATH}`,
              buildSubmissionJson(sub, new Date().toISOString()),
              msg
            );
          } catch (e) {
            console.error("verify/approve: could not store submission.json:", e);
          }
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
