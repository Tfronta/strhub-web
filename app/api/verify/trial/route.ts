/**
 * Trials — a rehearsal from nothing but a repository URL.
 *
 *   POST /api/verify/trial   { repo, ref?, role }   → 202 { id, slug, ref, url }
 *   GET  /api/verify/trial?id=tr_…                  → status, and once complete
 *                                                     the report, verdict, recipe
 *
 * No approval gate: a trial publishes nothing under anybody's name, and the
 * engine runs the container with no network and hard resource ceilings. What
 * is throttled is the CI it spends: per client and per repository.
 */
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { githubRepoUrl, SHA_OR_TAG } from "@/lib/verified/submission";
import { getTrial, startTrial, TRIAL_ID_RE, TRIAL_ROLES } from "@/lib/verified/trial";
import { GitHubApiError, GitHubConfigError } from "@/lib/verified/github";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { normalizeRepo } from "@/lib/verified/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const startSchema = z
  .object({
    repo: githubRepoUrl,
    ref: z.string().trim().regex(SHA_OR_TAG, "Invalid git ref").max(100).optional().or(z.literal("")),
    role: z.enum(TRIAL_ROLES),
  })
  .strict();

// A trial costs a CI job of up to twenty minutes. Six an hour per client covers
// an owner iterating; three an hour per repository stops one URL being used to
// keep the runner busy.
const PER_CLIENT = 6;
const PER_REPO = 3;
const WINDOW_MS = 60 * 60 * 1000;
const POLL_MAX = 40;
const POLL_WINDOW_MS = 60 * 1000;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = startSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { repo, ref, role } = parsed.data;
  const ip = clientIp(request);
  for (const [key, max] of [
    [`trial:client:${ip}`, PER_CLIENT],
    [`trial:repo:${normalizeRepo(repo)}`, PER_REPO],
  ] as const) {
    const limit = rateLimit(key, max, WINDOW_MS);
    if (!limit.ok) {
      return NextResponse.json(
        { ok: false, error: "rate_limited", retryAfterSeconds: limit.retryAfterSeconds },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }
  }
  try {
    const started = await startTrial(repo, ref || undefined);
    if ("error" in started) {
      return NextResponse.json({ ok: false, error: started.error }, { status: 404 });
    }
    return NextResponse.json(
      { ok: true, role, ...started, url: `/verified/trial/${started.id}?as=${role}` },
      { status: 202 }
    );
  } catch (e) {
    if (e instanceof GitHubConfigError) {
      return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
    }
    if (e instanceof GitHubApiError) {
      console.error("verify/trial dispatch error:", e.message);
      return NextResponse.json({ ok: false, error: "github", status: e.status }, { status: 502 });
    }
    console.error("verify/trial error:", e);
    return NextResponse.json({ ok: false, error: "internal" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  if (!TRIAL_ID_RE.test(id)) {
    return NextResponse.json({ ok: false, error: "Missing or invalid trial id" }, { status: 400 });
  }
  const limit = rateLimit(`trial-status:${clientIp(request)}`, POLL_MAX, POLL_WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }
  try {
    const status = await getTrial(id);
    return NextResponse.json({ ok: true, ...status });
  } catch (e) {
    if (e instanceof GitHubConfigError) {
      return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
    }
    if (e instanceof GitHubApiError) {
      return NextResponse.json({ ok: false, error: "github", status: e.status }, { status: 502 });
    }
    console.error("verify/trial status error:", e);
    return NextResponse.json({ ok: false, error: "internal" }, { status: 500 });
  }
}
