import { readFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import { getUploadsRoot } from '@/lib/uploads'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteParams = { params: { path: string[] } }

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
}

function isAllowedUploadPath(parts: string[]): boolean {
  if (parts.length < 2) return false
  if (parts.some((part) => part === '..' || part.includes('\\'))) return false
  return parts[0] === 'images' || parts[0] === 'docs'
}

export async function GET(_request: Request, { params }: RouteParams) {
  if (!isAllowedUploadPath(params.path)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const root = path.resolve(getUploadsRoot())
  const filePath = path.resolve(root, ...params.path)
  if (!filePath.startsWith(root + path.sep)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const file = await readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': CONTENT_TYPES[ext] ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
