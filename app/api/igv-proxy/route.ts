import { NextRequest, NextResponse } from "next/server";

// ── Allowed URL prefixes (security allow-list) ──────────────────────
const ALLOWED_PREFIXES = [
  "https://github.com/Tfronta/strhub-demo-data/releases/download/0.1/",
];

/** Headers we forward from the upstream response. */
const PASSTHROUGH_HEADERS = [
  "content-type",
  "content-length",
  "content-range",
  "accept-ranges",
  "etag",
  "last-modified",
] as const;

/** Shared CORS headers added to every response. */
const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Range",
  "Access-Control-Expose-Headers": "Content-Range, Content-Length, Accept-Ranges",
};

// ── OPTIONS preflight ───────────────────────────────────────────────
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// ── GET handler — stream-proxy with Range support ───────────────────
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing required query parameter: url" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  // Security: only proxy allowed origins
  const allowed = ALLOWED_PREFIXES.some((prefix) => url.startsWith(prefix));
  if (!allowed) {
    return NextResponse.json(
      { error: "URL not allowed" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  // Build upstream request headers — forward Range if present
  const upstreamHeaders: HeadersInit = {};
  const rangeHeader = req.headers.get("range");
  if (rangeHeader) {
    upstreamHeaders["Range"] = rangeHeader;
  }

  try {
    const upstream = await fetch(url, { headers: upstreamHeaders });

    if (!upstream.ok && upstream.status !== 206) {
      return new NextResponse(`Upstream error: ${upstream.status}`, {
        status: upstream.status,
        headers: CORS_HEADERS,
      });
    }

    // Collect passthrough headers from upstream
    const responseHeaders: Record<string, string> = { ...CORS_HEADERS };
    for (const name of PASSTHROUGH_HEADERS) {
      const value = upstream.headers.get(name);
      if (value) {
        responseHeaders[name] = value;
      }
    }

    // Stream the upstream body directly to the client
    return new NextResponse(upstream.body as ReadableStream, {
      status: upstream.status, // 200 or 206
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown proxy error";
    return NextResponse.json(
      { error: message },
      { status: 502, headers: CORS_HEADERS },
    );
  }
}
