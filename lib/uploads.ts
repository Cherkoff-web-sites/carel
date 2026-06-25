import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])
const PDF_EXTENSION = '.pdf'

export type UploadKind = 'image' | 'pdf'

function getUploadsRoot(): string {
  return process.env.UPLOADS_DIR ?? path.join(process.cwd(), 'public', 'uploads')
}

function subdirForKind(kind: UploadKind): string {
  return kind === 'image' ? 'images' : 'docs'
}

function extensionFromMime(mime: string, kind: UploadKind): string {
  if (kind === 'pdf') {
    return PDF_EXTENSION
  }
  if (mime === 'image/png') return '.png'
  if (mime === 'image/webp') return '.webp'
  if (mime === 'image/gif') return '.gif'
  return '.jpg'
}

function validateExtension(filename: string, kind: UploadKind): void {
  const ext = path.extname(filename).toLowerCase()
  if (kind === 'pdf') {
    if (ext !== PDF_EXTENSION) {
      throw new Error('Разрешены только PDF-файлы')
    }
    return
  }
  if (!IMAGE_EXTENSIONS.has(ext)) {
    throw new Error('Разрешены только изображения JPG, PNG, WEBP, GIF')
  }
}

export async function saveUploadedFile(
  file: File,
  kind: UploadKind
): Promise<{ url: string; filename: string }> {
  const maxSize = kind === 'pdf' ? 20 * 1024 * 1024 : 8 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error(`Файл слишком большой (макс. ${kind === 'pdf' ? '20' : '8'} МБ)`)
  }

  validateExtension(file.name, kind)

  const ext = path.extname(file.name).toLowerCase() || extensionFromMime(file.type, kind)
  const filename = `${randomUUID()}${ext}`
  const dir = path.join(getUploadsRoot(), subdirForKind(kind))
  await mkdir(dir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(dir, filename), buffer)

  return {
    url: `/uploads/${subdirForKind(kind)}/${filename}`,
    filename,
  }
}
