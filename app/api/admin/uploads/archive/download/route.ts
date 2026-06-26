import { NextResponse } from 'next/server'
import { buildUploadsArchive, buildUploadsArchiveFilename } from '@/lib/uploadsArchive'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const buffer = await buildUploadsArchive()
    const filename = buildUploadsArchiveFilename()

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Uploads archive export failed:', error)
    return NextResponse.json({ error: 'Не удалось создать архив uploads' }, { status: 500 })
  }
}
