import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Redirect legacy /basics/:slug (one segment) to /basics/en/:slug
// so that [locale]/[slug] is the only article route and matches /basics/pt/slug correctly
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const match = pathname.match(/^\/basics\/([^/]+)$/);
  if (match) {
    const slug = match[1];
    const url = request.nextUrl.clone();
    url.pathname = `/basics/en/${slug}`;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/basics/:path*",
};
