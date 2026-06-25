import { drizzle } from 'drizzle-orm/node-postgres'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { migrate } from '@/lib/db/migrate'
import * as schema from '@/lib/db/schema'
import { ensureSeeded } from '@/lib/db/seed'

type Db = NodePgDatabase<typeof schema>

type GlobalDb = typeof globalThis & {
  __carelPgPool?: Pool
  __carelPgDb?: Db
  __carelPgReady?: Promise<void>
}

const globalForDb = globalThis as GlobalDb

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return url
}

function createPool(): Pool {
  return new Pool({
    connectionString: getDatabaseUrl(),
    max: 10,
  })
}

async function prepareDatabase(pool: Pool, db: Db): Promise<void> {
  await migrate(pool)
  await ensureSeeded(db)
}

export async function getPool(): Promise<Pool> {
  await getDb()
  if (!globalForDb.__carelPgPool) {
    throw new Error('Database pool is not initialized')
  }
  return globalForDb.__carelPgPool
}

export async function getDb(): Promise<Db> {
  if (!globalForDb.__carelPgPool) {
    globalForDb.__carelPgPool = createPool()
    globalForDb.__carelPgDb = drizzle(globalForDb.__carelPgPool, { schema })
  }

  if (!globalForDb.__carelPgReady) {
    globalForDb.__carelPgReady = prepareDatabase(globalForDb.__carelPgPool, globalForDb.__carelPgDb!)
  }

  await globalForDb.__carelPgReady

  return globalForDb.__carelPgDb!
}

export async function closeDb(): Promise<void> {
  if (globalForDb.__carelPgPool) {
    await globalForDb.__carelPgPool.end()
    globalForDb.__carelPgPool = undefined
    globalForDb.__carelPgDb = undefined
    globalForDb.__carelPgReady = undefined
  }
}
