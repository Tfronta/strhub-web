/**
 * POST /api/verify/approve — admin-only allow-list for new repos.
 *
 * Running third-party Docker on Actions minutes is the main abuse surface
 * (§10). A repo's FIRST run must be approved by an admin; afterwards the author
 * can resubmit (e.g. new versions) without re-approval. Reuses the same JWT
 * bearer auth as the rest of the admin API (`isAuthenticated`).
 */
import { type NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { approveRepo, normalizeRepo } from "@/lib/verified/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { repo?: string };
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
  return NextResponse.json({ ok: true, repo: normalizeRepo(repo) });
}
