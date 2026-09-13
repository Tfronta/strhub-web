import { type NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { signAdminToken } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// 10 login attempts per 15 minutes per client.
const LOGIN_MAX = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Admin credentials not configured" },
      { status: 503 }
    );
  }

  const limit = rateLimit(`admin-login:${clientIp(request)}`, LOGIN_MAX, LOGIN_WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many login attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const userOk = safeEqual(String(body.username ?? ""), ADMIN_USERNAME);
  const passOk = safeEqual(String(body.password ?? ""), ADMIN_PASSWORD);
  if (!userOk || !passOk) {
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
