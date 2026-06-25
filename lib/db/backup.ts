import type { Pool } from 'pg'

export const BACKUP_MARKER = '-- CAREL_BACKUP_v1'

function sqlLiteral(value: string): string {
  return `'${String(value).replace(/'/g, "''")}'`
}

function sqlTimestamp(value: Date | string): string {
  const iso = value instanceof Date ? value.toISOString() : String(value)
  return `'${iso.replace(/'/g, "''")}'::timestamptz`
}

export async function exportDatabaseSql(pool: Pool): Promise<string> {
  const lines: string[] = [
    BACKUP_MARKER,
    `-- generated_at: ${new Date().toISOString()}`,
    '',
  ]

  const products = await pool.query(
    `SELECT catalog, id, data_json, updated_at FROM products ORDER BY catalog, id`
  )

  for (const row of products.rows as Array<{
    catalog: string
    id: string
    data_json: string
    updated_at: Date
  }>) {
    lines.push(
      `INSERT INTO products (catalog, id, data_json, updated_at) VALUES (${sqlLiteral(row.catalog)}, ${sqlLiteral(row.id)}, ${sqlLiteral(row.data_json)}, ${sqlTimestamp(row.updated_at)});`
    )
  }

  const settings = await pool.query(
    `SELECT key, value_json, updated_at FROM shared_settings ORDER BY key`
  )

  for (const row of settings.rows as Array<{
    key: string
    value_json: string
    updated_at: Date
  }>) {
    lines.push(
      `INSERT INTO shared_settings (key, value_json, updated_at) VALUES (${sqlLiteral(row.key)}, ${sqlLiteral(row.value_json)}, ${sqlTimestamp(row.updated_at)});`
    )
  }

  lines.push('')

  const migrations = await pool.query(
    `SELECT version, applied_at FROM schema_migrations ORDER BY version`
  )

  for (const row of migrations.rows as Array<{ version: number; applied_at: Date }>) {
    lines.push(
      `INSERT INTO schema_migrations (version, applied_at) VALUES (${row.version}, ${sqlTimestamp(row.applied_at)});`
    )
  }

  lines.push('')
  return lines.join('\n')
}

function splitSqlStatements(sql: string): string[] {
  return sql
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('--'))
}

export async function restoreDatabaseSql(pool: Pool, sql: string): Promise<void> {
  if (!sql.includes(BACKUP_MARKER)) {
    throw new Error('Неверный формат дампа. Ожидается файл, скачанный из этой админки.')
  }

  const lines = splitSqlStatements(sql)
  const insertProducts = lines.filter((line) => line.startsWith('INSERT INTO products'))
  const insertSettings = lines.filter((line) => line.startsWith('INSERT INTO shared_settings'))
  const insertMigrations = lines.filter((line) => line.startsWith('INSERT INTO schema_migrations'))

  if (insertProducts.length === 0) {
    throw new Error('В дампе нет данных каталога')
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('TRUNCATE TABLE products')
    await client.query('TRUNCATE TABLE shared_settings')
    await client.query('TRUNCATE TABLE schema_migrations')

    for (const line of insertProducts) {
      await client.query(line.endsWith(';') ? line : `${line};`)
    }

    for (const line of insertSettings) {
      await client.query(line.endsWith(';') ? line : `${line};`)
    }

    for (const line of insertMigrations) {
      await client.query(line.endsWith(';') ? line : `${line};`)
    }

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export function buildBackupFilename(): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').slice(0, 15)
  return `carel-backup-${stamp}.sql`
}
