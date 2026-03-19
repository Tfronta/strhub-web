// app/api/back-to-basics/route.ts
import { NextResponse } from "next/server"
import { getContentfulClient, buildIncludesMaps, resolveAuthor, CONTENTFUL_ACCESS_TOKEN } from "@/lib/contentful"

export const dynamic = "auto" // deja que el proxy de Vercel maneje el cache
// o usa 'auto' y solo confía en los headers de cache abajo

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get("locale") || undefined
    const preview = searchParams.get("preview") === "1"
    const tags = searchParams
      .getAll("tags")
      .flatMap((value) => value.split(","))
      .map((t) => t.trim())
      .filter(Boolean)

    const client = getContentfulClient({ preview })

    const query: any = {
      content_type: "backToBasicsPost",
      order: "-sys.createdAt",
      include: 2,
      locale: locale === "en" ? undefined : locale,
      select:
        "sys.id,fields.title,fields.summary,fields.postReadMinutes,fields.keywords,fields.bodyMd,fields.authors,fields.slug",
      access_token: CONTENTFUL_ACCESS_TOKEN,
    }

    // Contentful supports filtering by metadata tags as well, but this project
    // surfaces "tag-like" values from `fields.keywords`. Use the optional `tags`
    // query param to filter down to posts that include those keywords.
    if (tags.length > 0) {
      query["metadata.tags.sys.id[in]"] = tags.join(",")
    }

    const response = await client.getEntries(query)

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
