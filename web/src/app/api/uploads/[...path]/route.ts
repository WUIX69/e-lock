import { NextRequest, NextResponse } from "next/server"
import { getSessionAction } from "@/features/auth/server/actions/auth"
import { readFile } from "fs/promises"
import path from "path"
import fs from "fs"
import { getUploadsDir } from "@/lib/file-storage"

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await getSessionAction()
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { path: pathSegments } = await params
  if (!pathSegments || pathSegments.length === 0) {
    return new NextResponse("Not Found", { status: 404 })
  }

  const resolvedPath = path.resolve(getUploadsDir(), ...pathSegments)
  const uploadsDir = path.resolve(getUploadsDir())

  if (!resolvedPath.startsWith(uploadsDir)) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
    return new NextResponse("Not Found", { status: 404 })
  }

  const file = await readFile(resolvedPath)
  const ext = path.extname(resolvedPath).toLowerCase()

  return new NextResponse(file, {
    headers: {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
    },
  })
}
