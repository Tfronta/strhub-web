import { type NextRequest, NextResponse } from "next/server";
import { signAdminToken } from "@/lib/auth";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Admin credentials not configured" },
      { status: 503 }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (body.username !== ADMIN_USERNAME || body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  // Signing and verification now share one secret with no fallback, so a deploy
  // that never set JWT_SECRET refuses to issue tokens rather than issuing ones
  // anybody could have forged.
  let token: string;
  try {
    token = signAdminToken({ admin: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Admin authentication is not configured" },
      { status: 503 }
    );
  }
  return NextResponse.json({ ok: true, token });
}
