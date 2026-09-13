/**
 * Minimal in-memory sliding-window rate limiter for API routes.
 *
 * State lives in the process, so on serverless it holds per instance and resets
 * on cold start. That is enough to stop naive bursts (form spam, password
 * guessing) without adding a datastore; anything stronger belongs in an edge
 * middleware or a KV-backed limiter.
 */
import crypto from "crypto";

type Bucket = number[];
const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

export type RateLimitResult = {
  ok: boolean;
  /** Seconds until the oldest hit leaves the window (only when not ok). */
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const since = now - windowMs;
  const hits = (buckets.get(key) ?? []).filter((t) => t > since);

  if (hits.length >= max) {
    buckets.set(key, hits);
    const oldest = hits[0];
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  hits.push(now);
  buckets.set(key, hits);

  // Keep the map bounded on long-lived processes.
  if (buckets.size > MAX_KEYS) {
    for (const [k, v] of buckets) {
      if (!v.some((t) => t > since)) buckets.delete(k);
      if (buckets.size <= MAX_KEYS / 2) break;
    }
  }

  return { ok: true, retryAfterSeconds: 0 };
}

/** Best-effort client address behind Vercel's proxy. */
export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Salt used to hash client identifiers. Prefer RATE_LIMIT_SALT; otherwise derive
 * a stable value from JWT_SECRET so the hash stays consistent across serverless
 * instances; only fall back to a per-process random value when neither is set.
 */
export function clientHashSalt(): string {
  if (process.env.RATE_LIMIT_SALT) return process.env.RATE_LIMIT_SALT;
  if (process.env.JWT_SECRET) {
    return crypto
      .createHash("sha256")
      .update(`rate-limit-salt:${process.env.JWT_SECRET}`)
      .digest("hex");
  }
  return crypto.randomBytes(32).toString("hex");
}
