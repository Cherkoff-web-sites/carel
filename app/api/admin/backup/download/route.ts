import { NextResponse } from 'next/server'
import { buildBackupFilename, exportDatabaseSql } from '@/lib/db/backup'
import { getPool } from '@/lib/db/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const pool = await getPool()
    const sql = await exportDatabaseSql(pool)
    const filename = buildBackupFilename()

    return new NextResponse(sql, {
      status: 200,
      headers: {
        'Content-Type': 'application/sql; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Backup export failed:', error)
    return NextResponse.json({ error: 'Не удалось создать дамп' }, { status: 500 })
  }
}
