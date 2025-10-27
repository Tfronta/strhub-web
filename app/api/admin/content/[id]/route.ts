export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";

type Category = "Blog" | "Projects" | "Educational";
interface ContentEntry {
  id: string;
  title: string;
  content: string;
  category: Category;
  date: string;
  published: boolean;
}

function getStore(): ContentEntry[] {
  // @ts-ignore
  if (!globalThis.__STRHUB_ENTRIES) {
    // @ts-ignore
    globalThis.__STRHUB_ENTRIES = [] as ContentEntry[];
  }
  // @ts-ignore
  return globalThis.__STRHUB_ENTRIES as ContentEntry[];
}

function isAuthOk(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  return /^Bearer\s+\S+/.test(auth);
}

// PUT: actualizar
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isAuthOk(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  } catch (e: any) {
    console.error("[SERVER] AUTH ERROR /api/admin/content/[id]:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Auth check failed" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, category, published } = body || {};

    const entries = getStore();
    const idx = entries.findIndex((e) => e.id === params.id);
    if (idx === -1) return NextResponse.json({ ok: false, error: "Entry not found" }, { status: 404 });

    const updated: ContentEntry = {
      ...entries[idx],
      title: title != null ? String(title) : entries[idx].title,
      content: content != null ? String(content) : entries[idx].content,
      category: (category as Category) ?? entries[idx].category,
      published: published ?? true,
    };
    entries[idx] = updated;

    return NextResponse.json({ ok: true, entry: updated }, { status: 200 });
  } catch (e: any) {
    console.error("PUT /api/admin/content/[id] ERROR:", e?.message || e);
    return NextResponse.json({ ok: false, error: e?.message || "Failed to update entry" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isAuthOk(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  } catch (e: any) {
    console.error("[SERVER] AUTH ERROR /api/admin/content/[id]:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Auth check failed" }, { status: 401 });
  }

  try {
    const entries = getStore();
    const before = entries.length;
    const filtered = entries.filter((e) => e.id !== params.id);
    // @ts-ignore
    globalThis.__STRHUB_ENTRIES = filtered;

    if (filtered.length === before) {
      return NextResponse.json({ ok: false, error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, success: true }, { status: 200 });
  } catch (e: any) {
    console.error("DELETE /api/admin/content/[id] ERROR:", e?.message || e);
    return NextResponse.json({ ok: false, error: e?.message || "Failed to delete entry" }, { status: 500 });
  }
}
