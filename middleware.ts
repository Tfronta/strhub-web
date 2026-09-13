import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = new Set(["en", "es", "pt"]);

// Redirect legacy /basics/:slug (one segment) to /basics/en/:slug
// so that [locale]/[slug] is the only article route and matches /basics/pt/slug correctly
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const match = pathname.match(/^\/basics\/([^/]+)\/?$/);
  if (match) {
    const segment = match[1];
    const url = request.nextUrl.clone();
    // /basics/en, /basics/es, /basics/pt (no slug) is the article index, not an article.
    url.pathname = LOCALES.has(segment) ? "/basics" : `/basics/en/${segment}`;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/basics/:path*",
};
