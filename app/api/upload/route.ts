import { type NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import fs from "fs/promises"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

async function ensureUploadDirectory() {
  try {
    await fs.access(UPLOAD_DIR)
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  }
}

function generateFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = path.extname(originalName)
  const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9]/g, "-")
  return `${timestamp}-${randomString}-${baseName}${extension}`
}

function isValidImageType(file: File): boolean {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
  return validTypes.includes(file.type)
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!isValidImageType(file)) {
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 })
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    await ensureUploadDirectory()

    const fileName = generateFileName(file.name)
    const filePath = path.join(UPLOAD_DIR, fileName)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await fs.writeFile(filePath, buffer)

    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({
      url: fileUrl,
      filename: fileName,
      originalName: file.name,
      size: file.size,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
