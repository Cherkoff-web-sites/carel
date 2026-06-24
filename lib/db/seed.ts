import { accessSync, readFileSync } from 'fs'
import { sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { buildCatalogSeed } from '@/lib/catalogSeed'
import type { CatalogFile, CatalogKey } from '@/lib/catalogTypes'
import * as schema from '@/lib/db/schema'
import { CATALOG_DEFAULT_JSON_FILE, CATALOG_JSON_FILE } from '@/lib/db/paths'

type Db = NodePgDatabase<typeof schema>

function fileExists(path: string): boolean {
  try {
    accessSync(path)
    return true
  } catch {
    return false
  }
}

function loadCatalogJson(path: string): CatalogFile {
  const raw = readFileSync(path, 'utf-8')
  return JSON.parse(raw) as CatalogFile
}

export function resolveInitialCatalogSync(): CatalogFile {
  if (fileExists(CATALOG_JSON_FILE)) {
    return loadCatalogJson(CATALOG_JSON_FILE)
  }

  if (fileExists(CATALOG_DEFAULT_JSON_FILE)) {
    return loadCatalogJson(CATALOG_DEFAULT_JSON_FILE)
  }

  return buildCatalogSeed()
}

async function insertCatalog(db: Db, catalog: CatalogFile): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(schema.products)

    const writeSection = async (key: CatalogKey, items: Array<{ id: string }>) => {
      for (const item of items) {
        await tx.insert(schema.products).values({
          catalog: key,
          id: item.id,
          dataJson: JSON.stringify(item),
        })
      }
    }

    await writeSection('humisteam', catalog.humisteam)
    await writeSection('heatersteam', catalog.heatersteam)
    await writeSection('components', catalog.components)
  })
}

export async function getProductCount(db: Db): Promise<number> {
  const row = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.products)

  return row[0]?.count ?? 0
}

export async function ensureSeeded(db: Db): Promise<void> {
  if ((await getProductCount(db)) > 0) {
    return
  }

  await insertCatalog(db, resolveInitialCatalogSync())
}

export async function reseedFromCatalogFile(db: Db, catalog: CatalogFile): Promise<void> {
  await insertCatalog(db, catalog)
}
