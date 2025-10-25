// app/api/back-to-basics/route.ts
import { NextResponse } from "next/server"
import { getContentfulClient, buildIncludesMaps, resolveAuthor, CONTENTFUL_ACCESS_TOKEN } from "@/lib/contentful"

export const dynamic = "force-dynamic" // deja que el proxy de Vercel maneje el cache
// o usa 'auto' y solo confía en los headers de cache abajo

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get("locale") || undefined
    const preview = searchParams.get("preview") === "1"

    const client = getContentfulClient({ preview })
    const response = await client.getEntries({
      content_type: "backToBasicsPost",
      order: "-sys.createdAt",
      include: 2,
      locale,
      select:
        "sys.id,fields.title,fields.summary,fields.postReadMinutes,fields.keywords,fields.bodyMd,fields.authors,fields.slug",
      access_token: CONTENTFUL_ACCESS_TOKEN,
    })

    const maps = buildIncludesMaps(response.includes)
    const items = (response.items || []).map((it: any) => {
      const authorsLinks = (it.fields?.authors as any[] | undefined) || []
      const authors = authorsLinks.map((l) => resolveAuthor(l, maps)).filter(Boolean)

      return {
        sys: { id: it.sys.id },
        fields: {
          title: it.fields?.title,
          summary: it.fields?.summary,
          postReadMinutes: it.fields?.postReadMinutes ?? 0,
          keywords: it.fields?.keywords ?? [],
          bodyMd: it.fields?.bodyMd ?? "",
          slug: it.fields?.slug,
          authors,
        },
      }
    })

    // Cache para 60s en el edge y permitir stale-while-revalidate
    const res = NextResponse.json(
      { items },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    )
    return res
  } catch (err: any) {
    console.error("API /back-to-basics error:", err?.message || err)
    return NextResponse.json({ error: "Failed to fetch Contentful entries" }, { status: 500 })
  }
}
