/**
 * GET /api/verify/submissions — admin-only list of all submission records.
 * Query params:
 *   status=pending    → only approved-pending
 *   status=recent     → last 20 (all statuses, default)
 */
import { type NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getPendingSubmissions, getRecentSubmissions } from "@/lib/verified/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("status");

  const submissions =
    filter === "pending"
      ? await getPendingSubmissions()
      : await getRecentSubmissions(30);

  return NextResponse.json({
    ok: true,
    submissions: submissions.map((s) => ({
      slug: s.slug,
      repo: s.repo,
      ref: s.ref,
      createdAt: s.createdAt,
      status: s.status,
      toolName: s.toolName ?? s.slug,
      dispatchId: s.dispatchId,
    })),
  });
}
