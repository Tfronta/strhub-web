/**
 * GET /api/verify/test-email — admin-only diagnostic for Resend configuration.
 * Sends a test email and returns the result so you can confirm the setup works.
 */
import { type NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { notifyNewPendingSubmission } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!key) {
    return NextResponse.json({
      ok: false,
      error: "RESEND_API_KEY is not set in this environment",
      env: { RESEND_API_KEY: "MISSING", RESEND_FROM_EMAIL: from ?? "MISSING", NEXT_PUBLIC_SITE_URL: siteUrl ?? "MISSING" },
    });
  }

  try {
    await notifyNewPendingSubmission({
      slug: "test-tool-v1-0",
      toolName: "Test Tool",
      toolVersion: "1.0",
      repo: "https://github.com/example/test-tool",
      ip: "127.0.0.1",
    });
    return NextResponse.json({
      ok: true,
      message: "Test email sent — check your inbox.",
      env: { RESEND_API_KEY: "SET (" + key.slice(0, 8) + "…)", RESEND_FROM_EMAIL: from ?? "MISSING" },
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err?.message ?? String(err),
      env: { RESEND_API_KEY: "SET (" + key.slice(0, 8) + "…)", RESEND_FROM_EMAIL: from ?? "MISSING" },
    });
  }
}
