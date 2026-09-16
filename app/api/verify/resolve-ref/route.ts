/**
 * GET /api/verify/resolve-ref — the commit a verification would pin, before it
 * is started.
 *
 *   ?repo=<url>             → the latest release, else the newest tag, else the
 *                             head of the default branch — always a SHA
 *   ?repo=<url>&ref=<ref>   → that ref's SHA
 *
 * A verification is a fact about one commit, so the form has to show which
 * one before the person presses the button — "Version, tag or commit
 * (optional)" left them unsure whether anything was fixed at all. This is the
 * same resolution `startTrial` performs, exposed so the form can show its
 * answer first; whatever it displays is exactly what the run pins.
 *
 * Reads only, two to four GitHub calls on the shared token. Debounced by the
 * form, and capped per client so a URL pasted in a loop cannot drain the
 * allowance.
 */
import { type NextRequest, NextResponse } from "next/server";
import { resolveRef } from "@/lib/verified/trial";
import { repoSlugOf } from "@/lib/verified/repo-url";
import { SHA_OR_TAG } from "@/lib/verified/submission";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const RESOLVE_MAX = 30;
const RESOLVE_WINDOW_MS = 60 * 1000;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const limit = rateLimit(`verify-resolve-ref:${clientIp(request)}`, RESOLVE_MAX, RESOLVE_WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const repo = request.nextUrl.searchParams.get("repo") ?? "";
  const ref = (request.nextUrl.searchParams.get("ref") ?? "").trim();
  const repoSlug = repoSlugOf(repo);
  if (!repoSlug) return NextResponse.json({ ok: false, error: "not_a_github_repo" }, { status: 400 });
  if (ref && (ref.length > 100 || !SHA_OR_TAG.test(ref))) {
    return NextResponse.json({ ok: false, error: "invalid_ref" }, { status: 400 });
  }

  const resolved = await resolveRef(repoSlug, ref || undefined);
  if (!resolved) {
    return NextResponse.json({ ok: false, error: ref ? "ref_not_found" : "repo_not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, ...resolved });
}
