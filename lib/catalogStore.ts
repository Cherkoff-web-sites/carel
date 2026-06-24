import { and, eq } from 'drizzle-orm'
import { getDb } from '@/lib/db/client'
import { products } from '@/lib/db/schema'
import type {
  CatalogFile,
  CatalogKey,
  ComponentsPatch,
  HeatersteamPatch,
  HumisteamPatch,
} from '@/lib/catalogTypes'

type CatalogPatch = HumisteamPatch | HeatersteamPatch | ComponentsPatch

function parseProducts<T>(rows: Array<{ dataJson: string }>): T[] {
  return rows.map((row) => JSON.parse(row.dataJson) as T)
}

export async function readCatalog(): Promise<CatalogFile> {
  const db = await getDb()

  const humisteam = parseProducts<CatalogFile['humisteam'][number]>(
    await db.select().from(products).where(eq(products.catalog, 'humisteam'))
  )
  const heatersteam = parseProducts<CatalogFile['heatersteam'][number]>(
    await db.select().from(products).where(eq(products.catalog, 'heatersteam'))
  )
  const components = parseProducts<CatalogFile['components'][number]>(
    await db.select().from(products).where(eq(products.catalog, 'components'))
  )

  return {
    version: 1,
    humisteam,
    heatersteam,
    components,
  }
}

export async function getCatalogProducts<K extends CatalogKey>(
  catalog: K
): Promise<CatalogFile[K]> {
  const db = await getDb()
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.catalog, catalog))
    .orderBy(products.id)

  return parseProducts<CatalogFile[K][number]>(rows) as CatalogFile[K]
}

export async function updateCatalogProduct(
  catalog: CatalogKey,
  id: string,
  patch: CatalogPatch
): Promise<CatalogFile[CatalogKey][number] | null> {
  const db = await getDb()
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.catalog, catalog), eq(products.id, id)))
    .limit(1)

  const row = rows[0]
  if (!row) {
    return null
  }

  const current = JSON.parse(row.dataJson) as CatalogFile[CatalogKey][number] & CatalogPatch
  const updated = { ...current, ...patch }

  await db
    .update(products)
    .set({
      dataJson: JSON.stringify(updated),
      updatedAt: new Date(),
    })
    .where(and(eq(products.catalog, catalog), eq(products.id, id)))

  return updated as CatalogFile[CatalogKey][number]
}
