/**
 * POST /api/verify/trial/publish  { id }  → 202 pending approval
 *
 * The owner's "Publish" after a trial. Takes the recipe the trial ran (from its
 * artifact), files it as a submission awaiting admin approval under the
 * catalogue slug its manifest implies, and records who asked. Approval commits
 * that recipe verbatim and runs the real verification (mode=publish).
 */
import { type NextRequest, NextResponse } from "next/server";
import { getTrial, TRIAL_ID_RE } from "@/lib/verified/trial";
import { catalogueSlugFor } from "@/lib/verified/trial-publish";
import { hashClient, recordSubmission, normalizeRepo } from "@/lib/verified/store";
import { getFileContent, GitHubApiError, GitHubConfigError } from "@/lib/verified/github";
import { notifyNewPendingSubmission } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }
  const id = body.id ?? "";
  if (!TRIAL_ID_RE.test(id)) {
    return NextResponse.json({ ok: false, error: "Missing or invalid trial id" }, { status: 400 });
  }
  const ip = clientIp(request);
  const limit = rateLimit(`trial-publish:${ip}`, 10, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
  try {
    const trial = await getTrial(id);
    if (trial.state !== "completed" || !trial.recipe || !trial.report) {
      return NextResponse.json({ ok: false, error: "trial_not_finished" }, { status: 409 });
    }
    // Only a trial that produced output is worth a catalogue entry. A failing
    // one is still a finding, but publishing it is the maintainer's call made
    // through the full submission path, not a one-click from a rehearsal.
    if (trial.report.verdict?.code !== "runs") {
      return NextResponse.json({ ok: false, error: "verdict_not_runs" }, { status: 409 });
    }
    const { slug, manifestYml } = catalogueSlugFor(trial.recipe.manifest_yml);
    const existing = await getFileContent(`tools/${slug}/manifest.yml`);
    const existingRepo = existing?.match(/^\s{2}repo:\s*["']?(\S+?)["']?\s*$/m)?.[1];
    if (existingRepo && normalizeRepo(existingRepo) !== normalizeRepo(trial.report.source.repo)) {
      return NextResponse.json({ ok: false, error: "slug_taken" }, { status: 409 });
    }
    const repo = trial.report.source.repo;
    const ref = trial.report.source.ref_resolved ?? trial.report.source.ref ?? "";
    await recordSubmission({
      slug,
      repo,
      ref,
      dispatchId: id,
      createdAt: new Date().toISOString(),
      clientHash: hashClient(ip),
      status: "approved-pending",
      toolName: trial.report.tool.name,
      payload: JSON.stringify({
        kind: "recipe",
        trial_id: id,
        manifest_yml: manifestYml,
        dockerfile: trial.recipe.dockerfile,
        ...(trial.recipe.dockerfile_fallback ? { dockerfile_fallback: trial.recipe.dockerfile_fallback } : {}),
        ...(trial.recipe.regions_bed ? { regions_bed: trial.recipe.regions_bed } : {}),
      }),
    });
    notifyNewPendingSubmission({
      slug,
      toolName: trial.report.tool.name,
      toolVersion: trial.report.tool.version ?? "",
      repo,
      ip,
    }).catch((err) => console.error("trial/publish email error:", err));
    return NextResponse.json({ ok: true, status: "pending-approval", slug }, { status: 202 });
  } catch (e) {
    if (e instanceof GitHubConfigError) {
      return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
    }
    if (e instanceof GitHubApiError) {
      return NextResponse.json({ ok: false, error: "github", status: e.status }, { status: 502 });
    }
    console.error("trial/publish error:", e);
    return NextResponse.json({ ok: false, error: "internal" }, { status: 500 });
  }
}
