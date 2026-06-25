import type { Pool } from 'pg'

const SCHEMA_VERSION = 2

const MIGRATIONS: Record<number, string[]> = {
  1: [
    `CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      catalog TEXT NOT NULL CHECK (catalog IN ('humisteam', 'heatersteam', 'components')),
      id TEXT NOT NULL,
      data_json TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (catalog, id)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_products_catalog ON products (catalog)`,
  ],
  2: [
    `CREATE TABLE IF NOT EXISTS shared_settings (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
  ],
}

async function getCurrentVersion(pool: Pool): Promise<number> {
  const tableCheck = await pool.query(
    `SELECT to_regclass('public.schema_migrations') AS name`
  )
  if (!tableCheck.rows[0]?.name) {
    return 0
  }

  const versionRow = await pool.query(`SELECT MAX(version) AS version FROM schema_migrations`)
  const version = versionRow.rows[0]?.version
  return typeof version === 'number' ? version : Number(version) || 0
}

export async function migrate(pool: Pool): Promise<void> {
  const current = await getCurrentVersion(pool)
  const versions = Object.keys(MIGRATIONS)
    .map(Number)
    .sort((a, b) => a - b)

  for (const version of versions) {
    if (version <= current) {
      continue
    }

    const statements = MIGRATIONS[version]
    if (!statements) {
      continue
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      for (const sql of statements) {
        await client.query(sql)
      }
      await client.query(`INSERT INTO schema_migrations (version) VALUES ($1)`, [version])
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  if ((await getCurrentVersion(pool)) === 0 && SCHEMA_VERSION >= 1) {
    throw new Error('Failed to apply PostgreSQL migrations')
  }
}
