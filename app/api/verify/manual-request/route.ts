import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { notifyManualVerificationRequest } from "@/lib/email";
import { TRIAL_ID_RE, TRIAL_ROLES } from "@/lib/verified/trial";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PER_CLIENT = 5;
const GLOBAL_MAX = 30;
const WINDOW_MS = 60 * 60 * 1000;

const requestSchema = z.object({
  trialId: z.string().regex(TRIAL_ID_RE, "Invalid trial ID"),
  toolName: z.string().trim().min(1).max(160),
  repo: z.string().trim().url().max(300),
  ref: z.string().trim().min(1).max(120),
  role: z.enum(TRIAL_ROLES).default("user"),
  email: z.string().trim().email().max(200),
  reason: z.string().trim().min(1).max(1000),
  notes: z.string().trim().max(1000).optional().default(""),
  ciRun: z.string().trim().url().max(400).optional(),
  website: z.string().optional(),
});

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Honeypot: accept silently if filled by a bot.
  if (parsed.data.website && parsed.data.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const ip = clientIp(request);
  const perClient = rateLimit(`manual-req:${ip}`, PER_CLIENT, WINDOW_MS);
  const globalLimit = perClient.ok
    ? rateLimit("manual-req:global", GLOBAL_MAX, WINDOW_MS)
    : perClient;
  if (!perClient.ok || !globalLimit.ok) {
    const retry = perClient.ok ? globalLimit.retryAfterSeconds : perClient.retryAfterSeconds;
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryAfterSeconds: retry },
      { status: 429, headers: { "Retry-After": String(retry) } },
    );
  }

  try {
    await notifyManualVerificationRequest({
      trialId: parsed.data.trialId,
      toolName: parsed.data.toolName,
      repo: parsed.data.repo,
      ref: parsed.data.ref,
      role: parsed.data.role,
      requesterEmail: parsed.data.email,
      reason: parsed.data.reason,
      notes: parsed.data.notes || undefined,
      ciRun: parsed.data.ciRun,
      ip,
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("verify/manual-request error:", err);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}
