import { NextRequest, NextResponse } from 'next/server'
import { restoreDatabaseSql } from '@/lib/db/backup'
import { getPool } from '@/lib/db/client'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_BYTES = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Файл не передан' }, { status: 400 })
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Файл слишком большой (макс. 10 МБ)' }, { status: 400 })
    }

    const sql = await file.text()
    const pool = await getPool()
    await restoreDatabaseSql(pool, sql)

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Не удалось восстановить дамп'
    console.error('Backup restore failed:', error)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
