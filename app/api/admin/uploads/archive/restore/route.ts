import { NextRequest, NextResponse } from 'next/server'
import { restoreUploadsArchive } from '@/lib/uploadsArchive'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_BYTES = 200 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Файл не передан' }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith('.zip')) {
      return NextResponse.json({ error: 'Загрузите ZIP-архив uploads' }, { status: 400 })
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Архив слишком большой (макс. 200 МБ)' }, { status: 400 })
    }

    const restored = await restoreUploadsArchive(Buffer.from(await file.arrayBuffer()))
    return NextResponse.json({ success: true, restored })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Не удалось восстановить uploads'
    console.error('Uploads archive restore failed:', error)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
