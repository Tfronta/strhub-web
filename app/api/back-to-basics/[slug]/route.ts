// app/api/back-to-basics/[slug]/route.ts
import { NextResponse } from "next/server";
import { fetchBasicsArticle } from "@/lib/back-to-basics-server";

export const dynamic = "force-dynamic";

type RouteContext = { params: { slug: string } };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const { slug } = context.params;

    const item = await fetchBasicsArticle(slug, locale);

    return NextResponse.json(
      { item },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("API /back-to-basics/[slug] error:", message);
    return NextResponse.json(
      { error: "Failed to fetch Contentful entry" },
      { status: 500 }
    );
  }
}
