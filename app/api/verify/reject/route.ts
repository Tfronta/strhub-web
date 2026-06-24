/**
 * POST /api/verify/reject — admin-only rejection of a pending submission.
 * Body: { slug: string }
 */
import { type NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { rejectSubmission } from "@/lib/verified/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const slug = body.slug?.trim();
  if (!slug) {
    return NextResponse.json({ ok: false, error: "slug is required" }, { status: 400 });
  }

  const updated = await rejectSubmission(slug);
  if (!updated) {
    return NextResponse.json(
      { ok: false, error: "No pending submission found for that slug" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, slug });
}
