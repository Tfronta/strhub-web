import { type NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import fs from "fs/promises"
import path from "path"
import os from "os"

interface ContentEntry {
  id: string
  title: string
  content: string
  category: "Blog" | "Projects" | "Educational"
  date: string
  published: boolean
}

// ---------- Helpers con fallback a /tmp ----------
async function readContentFile(): Promise<ContentEntry[]> {
  const candidates = [
    path.join(process.cwd(), "data", "content.json"),
    path.join(os.tmpdir(), "strhub-data", "content.json"),
  ]
  for (const file of candidates) {
    try {
      const data = await fs.readFile(file, "utf-8")
      return JSON.parse(data)
    } catch {}
  }
  return []
}

async function writeContentFile(entries: ContentEntry[]) {
  // Intento 1: ./data
  try {
    const dataDir = path.join(process.cwd(), "data")
    await fs.mkdir(dataDir, { recursive: true })
    await fs.writeFile(path.join(dataDir, "content.json"), JSON.stringify(entries, null, 2), "utf-8")
    return
  } catch {}
  // Intento 2: /tmp
  const tmpDir = path.join(os.tmpdir(), "strhub-data")
  await fs.mkdir(tmpDir, { recursive: true })
  await fs.writeFile(path.join(tmpDir, "content.json"), JSON.stringify(entries, null, 2), "utf-8")
}

// ---------- GET: lista ----------
export async function GET() {
  try {
    const entries = await readContentFile()
    return NextResponse.json({ ok: true, entries })
  } catch (e: any) {
    console.error("GET /api/admin/content ERROR:", e?.message || e)
    return NextResponse.json({ ok: false, error: e?.message || "Internal error" }, { status: 500 })
  }
}

// ---------- POST: crea ----------
export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
    }
  } catch (e: any) {
    console.error("AUTH ERROR /api/admin/content:", e?.message || e)
    return NextResponse.json({ ok: false, error: "Auth check failed" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, content, category, published } = body || {}

    if (!title || !content) {
      return NextResponse.json({ ok: false, error: "title and content are required" }, { status: 400 })
    }

    const newEntry: ContentEntry = {
      id: crypto.randomUUID(),
      title: String(title),
      content: String(content),
      category: (category as ContentEntry["category"]) ?? "Educational",
      date: new Date().toISOString(),
      published: published ?? true,
    }

    const entries = await readContentFile()
    entries.unshift(newEntry)
    await writeContentFile(entries)

    return NextResponse.json({ ok: true, entry: newEntry }, { status: 201 })
  } catch (e: any) {
    console.error("POST /api/admin/content ERROR:", e?.message || e)
    return NextResponse.json({ ok: false, error: e?.message || "Internal error" }, { status: 500 })
  }
}
