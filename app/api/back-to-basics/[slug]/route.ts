// app/api/back-to-basics/[slug]/route.ts
import { NextResponse } from 'next/server';
import { getContentfulClient, buildIncludesMaps, resolveAuthor, CONTENTFUL_ACCESS_TOKEN } from '@/lib/contentful';

export const dynamic = 'force-dynamic';

type RouteContext = { params: { slug: string } };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || undefined;
    const preview = searchParams.get('preview') === '1';
    const { slug } = context.params;

    const client = getContentfulClient({ preview });
    const response = await client.getEntries({
      content_type: 'backToBasicsPost',
      'fields.slug': slug,
      limit: 1,
      include: 2,
      locale,
      access_token: CONTENTFUL_ACCESS_TOKEN
    });

    if (!response.items?.length) {
      return NextResponse.json({ item: null }, { status: 200 });
    }

    const it: any = response.items[0];

    const maps = buildIncludesMaps(response.includes);
    const authorsLinks = (it.fields?.authors as any[] | undefined) || [];
    const authors = authorsLinks
      .map((l) => resolveAuthor(l, maps))
      .filter(Boolean);

    const item = {
      sys: { id: it.sys.id },
      fields: {
        title: it.fields?.title,
        summary: it.fields?.summary,
        postReadMinutes: it.fields?.postReadMinutes ?? 0,
        keywords: it.fields?.keywords ?? [],
        bodyMd: it.fields?.bodyMd,
        slug: it.fields?.slug,
        authors,
      },
    };
    
    return NextResponse.json(
      { item },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err: any) {
    console.error('API /back-to-basics/[slug] error:', err?.message || err);
    return NextResponse.json(
      { error: 'Failed to fetch Contentful entry' },
      { status: 500 }
    );
  }
}
