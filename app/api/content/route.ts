export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import path from "path";

interface ContentEntry {
  id: string;
  title: string;
  content: string;
  category: "Blog" | "Projects" | "Educational";
  date: string;
  published: boolean;
}

// Helpers con imports dinámicos para evitar fallos en edge/build
async function readContentFile(): Promise<ContentEntry[]> {
  try {
    const fs = await import("fs/promises");
    const os = await import("os");
    const candidates = [
      path.join(process.cwd(), "data", "content.json"),
      path.join(os.default.tmpdir(), "strhub-data", "content.json"),
    ];
    for (const file of candidates) {
      try {
        const data = await fs.readFile(file, "utf-8");
        return JSON.parse(data);
      } catch {}
    }
    return [];
  } catch (e) {
    // Si incluso importar fs/os falla, devolvemos vacío
    return [];
  }
}

async function writeContentFile(entries: ContentEntry[]) {
  const payload = JSON.stringify(entries, null, 2);
  try {
    const fs = await import("fs/promises");
    const dataDir = path.join(process.cwd(), "data");
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(path.join(dataDir, "content.json"), payload, "utf-8");
    return;
  } catch {
    // fallback a /tmp (suele ser escribible en serverless/preview)
    const fs = await import("fs/promises");
    const os = await import("os");
    const tmpDir = path.join(os.default.tmpdir(), "strhub-data");
    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(path.join(tmpDir, "content.json"), payload, "utf-8");
    return;
  }
}

// ---------- GET: lista ----------
export async function GET() {
  try {
    const entries = await readContentFile();
    return NextResponse.json({ ok: true, entries });
  } catch (e: any) {
    console.error("GET /api/admin/content ERROR:", e?.message || e);
    return NextResponse.json({ ok: false, error: e?.message || "Internal error" }, { status: 500 });
  }
}

// ---------- POST: crea ----------
export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  } catch (e: any) {
    console.error("AUTH ERROR /api/admin/content:", e?.message || e);
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
      category: (category as ContentEntry["category"]) ?? "Educational",
      date: new Date().toISOString(),
      published: published ?? true,
    };

    const entries = await readContentFile();
    entries.unshift(newEntry);
    await writeContentFile(entries);

    return NextResponse.json({ ok: true, entry: newEntry }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/admin/content ERROR:", e?.message || e);
    return NextResponse.json({ ok: false, error: e?.message || "Internal error" }, { status: 500 });
  }
}
