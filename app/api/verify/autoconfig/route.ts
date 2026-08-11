import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { githubRepoUrl, SHA_OR_TAG } from "@/lib/verified/submission";
import { hashClient } from "@/lib/verified/store";
import {
  gatherRepoContext,
  fetchManifestFingerprint,
} from "@/lib/verified/autoconfig-context";
import { runAutoConfig, MODEL, PROMPT_VERSION } from "@/lib/verified/autoconfig";
import { AutoConfigError, statusForCode } from "@/lib/verified/autoconfig-errors";
import type { JsonValue } from "@/lib/json-value";
import {
  checkAutoConfigRate,
  checkAutoConfigClientRate,
  findAutoConfig,
  listAutoConfigs,
  recordAutoConfigClient,
  saveAutoConfig,
  type AutoConfigEntry,
} from "@/lib/verified/autoconfig-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function enabled(): boolean {
  return process.env.VERIFIED_AUTOCONFIG_ENABLED === "1";
}

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

const requestSchema = z
  .object({
    repo: githubRepoUrl,
    ref: z.string().trim().regex(SHA_OR_TAG, "Invalid git ref").min(1).max(100),
    force: z.boolean().optional(),
    dockerfileProvided: z.boolean().optional(),
  })
  .strict();

/** Text of a caveat that suggests the repository tried to address the model. */
const INJECTION_HINT = /ignore (the |these |previous |your )?(rules|instructions)|prompt injection|instructions? (embedded|addressed) to/i;

function logInjectionAttempts(repo: string, ref: string, caveats: string[]): void {
  for (const caveat of caveats) {
    if (INJECTION_HINT.test(caveat)) {
      console.warn(`autoconfig: possible injection attempt ${repo}@${ref}: ${caveat}`);
    }
  }
}

export async function GET(request: NextRequest) {
  if (!enabled()) {
    return NextResponse.json({ ok: false, error: "disabled" }, { status: 404 });
  }
  const repo = request.nextUrl.searchParams.get("repo");
  const parsed = githubRepoUrl.safeParse(repo ?? "");
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid repository URL" }, { status: 400 });
  }
  const ref = request.nextUrl.searchParams.get("ref");

  try {
    const entries = await listAutoConfigs(parsed.data);
    let currentFingerprint: string | null = null;
    if (ref && entries.length) {
      try {
        currentFingerprint = await fetchManifestFingerprint(parsed.data, ref);
      } catch {
        // Staleness is advisory; a failed lookup just means no badge.
      }
    }
    return NextResponse.json({ ok: true, entries, currentFingerprint });
  } catch (e) {
    console.error("autoconfig GET:", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!enabled()) {
    return NextResponse.json({ ok: false, error: "disabled" }, { status: 404 });
  }

  let body: JsonValue;
  try {
    body = (await request.json()) as JsonValue;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { repo, ref, force, dockerfileProvided } = parsed.data;

  // An exact hit costs nothing and must not consume a generation, so it is
  // answered before either rate limit is consulted.
  if (!force) {
    try {
      const hit = await findAutoConfig(repo, ref);
      if (hit) return NextResponse.json({ ok: true, entry: hit, cached: true });
    } catch (e) {
      console.error("autoconfig cache lookup:", e);
    }
  }

  const clientHash = hashClient(clientIp(request));

  // Both limits are checked before any outbound call, so a refused request never
  // costs a model call or a GitHub read.
  const repoRate = await checkAutoConfigRate(repo);
  if (!repoRate.ok) {
    return NextResponse.json({ ok: false, error: repoRate.reason }, { status: 429 });
  }
  const clientRate = await checkAutoConfigClientRate(clientHash);
  if (!clientRate.ok) {
    return NextResponse.json({ ok: false, error: clientRate.reason }, { status: 429 });
  }

  try {
    const ctx = await gatherRepoContext(repo, ref);
    const result = await runAutoConfig(ctx, { dockerfileProvided });

    logInjectionAttempts(repo, ref, result.config.caveats);
    console.info(
      `autoconfig ${repo}@${ref}: in=${result.usage.inputTokens} out=${result.usage.outputTokens} cacheRead=${result.usage.cacheReadTokens}`,
    );

    const entry: AutoConfigEntry = {
      ref,
      createdAt: new Date().toISOString(),
      config: result.config,
      model: MODEL,
      promptVersion: PROMPT_VERSION,
      manifestFingerprint: ctx.manifestFingerprint,
    };
    await saveAutoConfig(repo, entry);
    await recordAutoConfigClient(clientHash);

    return NextResponse.json({ ok: true, entry, cached: false });
  } catch (e) {
    if (e instanceof AutoConfigError) {
      // Without this a 502 reaches the caller as a bare code with nothing
      // server-side saying which field or which upstream call caused it.
      console.error(`autoconfig ${repo}@${ref}: ${e.code} — ${e.message}`);
      return NextResponse.json(
        { ok: false, error: e.code },
        { status: statusForCode(e.code) },
      );
    }
    console.error("autoconfig POST:", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
