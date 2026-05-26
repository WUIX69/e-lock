import { writeFile, mkdir, unlink } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"
import fs from "fs"

const UPLOADS_DIR = path.join(process.cwd(), "uploads")

export async function storeFile(
  category: "tasks" | "profiles",
  referenceId: string,
  file: File
): Promise<string> {
  const ext = path.extname(file.name) || ""
  const safeName = `${randomUUID()}${ext}`
  const dir = path.join(UPLOADS_DIR, category, referenceId)
  const absolutePath = path.join(dir, safeName)

  await mkdir(dir, { recursive: true })
  const bytes = await file.arrayBuffer()
  await writeFile(absolutePath, Buffer.from(bytes))

  return `${category}/${referenceId}/${safeName}`
}

export function getUploadsDir(): string {
  return UPLOADS_DIR
}

export async function deleteStoredFile(relativePath: string): Promise<void> {
  const clean = relativePath.replace(/^\/?(uploads\/)?/, "")
  const absolute = path.resolve(UPLOADS_DIR, clean)

  if (!absolute.startsWith(path.resolve(UPLOADS_DIR))) {
    return
  }

  if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) {
    await unlink(absolute)
  }
}
