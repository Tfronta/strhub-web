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
  // Tell the root layout which language this article is in, so <html lang>
  // matches the URL instead of the visitor's cookie.
  const article = pathname.match(/^\/basics\/(en|es|pt)\/[^/]+/);
  if (article) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-strhub-locale", article[1]);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/basics/:path*",
};
