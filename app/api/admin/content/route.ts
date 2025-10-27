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

// ── Almacen en memoria para preview ────────────────────────────────────────────
function getStore(): ContentEntry[] {
  // @ts-ignore
  if (!globalThis.__STRHUB_ENTRIES) {
    // @ts-ignore
    globalThis.__STRHUB_ENTRIES = [] as ContentEntry[];
  }
  // @ts-ignore
  return globalThis.__STRHUB_ENTRIES as ContentEntry[];
}

// Auth mínima basada en header (evita romper en V0)
function isAuthOk(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  // acepta cualquier Bearer no vacío (sirve para preview)
  return /^Bearer\s+\S+/.test(auth);
}

// GET: lista (sin auth)
export async function GET() {
  try {
    const entries = getStore();
    return NextResponse.json({ ok: true, entries }, { status: 200 });
  } catch (e: any) {
    console.error("GET /api/admin/content ERROR:", e?.message || e);
    return NextResponse.json({ ok: false, error: e?.message || "Internal error" }, { status: 500 });
  }
}

// POST: crea (auth ligera)
export async function POST(request: NextRequest) {
  try {
    if (!isAuthOk(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  } catch (e: any) {
    console.error("[SERVER] AUTH ERROR /api/admin/content:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Auth check failed" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, category, published } = body || {};
    if (!title || !content) {
      return NextResponse.json({ ok: false, error: "title and content are required" }, { status: 400 });
    }

    const newEntry: ContentEntry = {
      id: crypto.randomUUID(),
      title: String(title),
      content: String(content),
      category: (category as Category) ?? "Educational",
      date: new Date().toISOString(),
      published: published ?? true,
    };

    const entries = getStore();
    entries.unshift(newEntry);

    return NextResponse.json({ ok: true, entry: newEntry }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/admin/content ERROR:", e?.message || e);
    return NextResponse.json({ ok: false, error: e?.message || "Internal error" }, { status: 500 });
  }
}
