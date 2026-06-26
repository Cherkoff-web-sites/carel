import { and, eq } from 'drizzle-orm'
import { getDb } from '@/lib/db/client'
import { products } from '@/lib/db/schema'
import { withCatalogProductDefaults, toPublicCatalogProduct } from '@/lib/catalogProductMeta'
import { withCatalogProductExtras } from '@/lib/catalogProductExtras'
import { getCatalogDefaultGallery } from '@/lib/catalogDefaultGallery'
import { PARTS_AND_COMPONENTS_IMAGE } from '@/lib/partsImage'
import type {
  CatalogFile,
  CatalogKey,
  CatalogPatch,
  CreateCatalogProductOptions,
} from '@/lib/catalogTypes'

type GetCatalogOptions = {
  publishedOnly?: boolean
  forPublic?: boolean
}

function parseProducts<T>(rows: Array<{ dataJson: string }>): T[] {
  return rows.map((row) => JSON.parse(row.dataJson) as T)
}

function normalizeProduct<T extends { description: string; price: number; image?: string; galleryImages?: readonly string[] }>(
  product: T,
  catalog: CatalogKey
) {
  const normalized = withCatalogProductExtras(withCatalogProductDefaults(product))
  if (!product.galleryImages?.length) {
    return {
      ...normalized,
      galleryImages: getCatalogDefaultGallery(catalog, normalized.image),
    }
  }
  return normalized
}

export async function readCatalog(): Promise<CatalogFile> {
  const db = await getDb()

  const humisteam = parseProducts<CatalogFile['humisteam'][number]>(
    await db.select().from(products).where(eq(products.catalog, 'humisteam'))
  ).map((product) => normalizeProduct(product, 'humisteam'))
  const heatersteam = parseProducts<CatalogFile['heatersteam'][number]>(
    await db.select().from(products).where(eq(products.catalog, 'heatersteam'))
  ).map((product) => normalizeProduct(product, 'heatersteam'))
  const components = parseProducts<CatalogFile['components'][number]>(
    await db.select().from(products).where(eq(products.catalog, 'components'))
  ).map((product) => normalizeProduct(product, 'components'))

  return {
    version: 1,
    humisteam,
    heatersteam,
    components,
  }
}

export async function getCatalogProducts<K extends CatalogKey>(
  catalog: K,
  options: GetCatalogOptions = {}
): Promise<CatalogFile[K]> {
  const db = await getDb()
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.catalog, catalog))
    .orderBy(products.id)

  let items = parseProducts<CatalogFile[K][number]>(rows).map((product) =>
    normalizeProduct(product, catalog)
  )

  if (options.publishedOnly) {
    items = items.filter((item) => item.published) as typeof items
  }

  if (options.forPublic) {
    return items.map((item) => toPublicCatalogProduct(item)) as unknown as CatalogFile[K]
  }

  return items as unknown as CatalogFile[K]
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

  const current = normalizeProduct(
    JSON.parse(row.dataJson) as CatalogFile[CatalogKey][number] & CatalogPatch,
    catalog
  )
  const mergedTabsEnabled = patch.tabsEnabled
    ? { ...current.tabsEnabled, ...patch.tabsEnabled }
    : current.tabsEnabled
  const mergedTabContent = patch.tabContent
    ? { ...current.tabContent, ...patch.tabContent }
    : current.tabContent
  const updated = normalizeProduct(
    {
      ...current,
      ...patch,
      tabsEnabled: mergedTabsEnabled,
      tabContent: mergedTabContent,
    },
    catalog
  )

  await db
    .update(products)
    .set({
      dataJson: JSON.stringify(updated),
      updatedAt: new Date(),
    })
    .where(and(eq(products.catalog, catalog), eq(products.id, id)))

  return updated as CatalogFile[CatalogKey][number]
}

function buildCopyId(sourceId: string): string {
  return `${sourceId}-copy-${Date.now()}`
}

function buildCopySku(sourceSku: string): string {
  const suffix = '-COPY'
  const base = sourceSku.endsWith(suffix) ? sourceSku : `${sourceSku}${suffix}`
  return base.slice(0, 48)
}

export async function duplicateCatalogProduct(
  catalog: CatalogKey,
  id: string
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

  const source = normalizeProduct(JSON.parse(row.dataJson) as CatalogFile[CatalogKey][number], catalog)
  const newId = buildCopyId(id)
  const copy = normalizeProduct(
    {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      sku: buildCopySku(source.sku),
      title: `${source.title} (копия)`,
      published: false,
    },
    catalog
  )

  await db.insert(products).values({
    catalog,
    id: newId,
    dataJson: JSON.stringify(copy),
    updatedAt: new Date(),
  })

  return copy as CatalogFile[CatalogKey][number]
}

export async function createCatalogProduct(
  catalog: CatalogKey,
  options: CreateCatalogProductOptions = {}
): Promise<CatalogFile[CatalogKey][number]> {
  if (options.templateId) {
    const duplicated = await duplicateCatalogProduct(catalog, options.templateId)
    if (!duplicated) {
      throw new Error('Template product not found')
    }
    return duplicated
  }

  const db = await getDb()
  const newId = `new-${Date.now()}`

  if (catalog === 'components') {
    const sectionId = options.sectionId ?? 'steam-cylinders'
    const product = normalizeProduct(
      {
        id: newId,
        sku: 'NEW-SKU',
        title: 'Новый товар',
        description: '',
        fullDescription: '',
        image: PARTS_AND_COMPONENTS_IMAGE,
        galleryImages: [],
        price: 0,
        sectionId,
        relatedContexts: [],
        published: false,
        showPriceOnSite: false,
        metaTitle: '',
        metaDescription: '',
      },
      'components'
    )
    await db.insert(products).values({
      catalog,
      id: newId,
      dataJson: JSON.stringify(product),
      updatedAt: new Date(),
    })
    return product as CatalogFile['components'][number]
  }

  if (catalog === 'humisteam') {
    const existing = await getCatalogProducts('humisteam')
    const modelId = options.modelId ?? existing[0]?.modelId ?? 'basic-uey'
    const template =
      existing.find((item) => item.modelId === modelId) ??
      existing[0]
    if (!template) {
      throw new Error('No humisteam products to use as template')
    }
    const product = normalizeProduct(
      {
        ...JSON.parse(JSON.stringify(template)),
        id: newId,
        sku: 'NEW-SKU',
        title: 'Новый товар',
        description: '',
        fullDescription: '',
        published: false,
        showPriceOnSite: false,
        price: 0,
        modelId,
        metaTitle: '',
        metaDescription: '',
      },
      'humisteam'
    )
    await db.insert(products).values({
      catalog,
      id: newId,
      dataJson: JSON.stringify(product),
      updatedAt: new Date(),
    })
    return product as CatalogFile['humisteam'][number]
  }

  const existing = await getCatalogProducts('heatersteam')
  const variantId = options.variantId ?? existing[0]?.variantId ?? 'heatersteam-process'
  const template =
    existing.find((item) => item.variantId === variantId) ??
    existing[0]
  if (!template) {
    throw new Error('No heatersteam products to use as template')
  }
  const product = normalizeProduct(
    {
      ...JSON.parse(JSON.stringify(template)),
      id: newId,
      sku: 'NEW-SKU',
      title: 'Новый товар',
      description: '',
      fullDescription: '',
      published: false,
      showPriceOnSite: false,
      price: 0,
      variantId,
      metaTitle: '',
      metaDescription: '',
    },
    'heatersteam'
  )
  await db.insert(products).values({
    catalog: 'heatersteam',
    id: newId,
    dataJson: JSON.stringify(product),
    updatedAt: new Date(),
  })
  return product as CatalogFile['heatersteam'][number]
}

export async function deleteCatalogProduct(catalog: CatalogKey, id: string): Promise<boolean> {
  const db = await getDb()
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.catalog, catalog), eq(products.id, id)))
    .limit(1)

  if (!rows[0]) {
    return false
  }

  await db.delete(products).where(and(eq(products.catalog, catalog), eq(products.id, id)))
  return true
}

export type CatalogBulkItem = { catalog: CatalogKey; id: string }

export type CatalogBulkRow = CatalogBulkItem & {
  sku: string
  title: string
  price: number
  published: boolean
  showPriceOnSite: boolean
  image: string
  galleryImages: string[]
}

export async function bulkUpdateCatalogProducts(
  items: CatalogBulkItem[],
  patch: CatalogPatch
): Promise<number> {
  let updated = 0
  for (const item of items) {
    const result = await updateCatalogProduct(item.catalog, item.id, patch)
    if (result) {
      updated += 1
    }
  }
  return updated
}

export async function getAllCatalogProductsNormalized(): Promise<CatalogBulkRow[]> {
  const catalog = await readCatalog()
  const rows: CatalogBulkRow[] = []

  for (const product of catalog.humisteam) {
    const p = normalizeProduct(product, 'humisteam')
    rows.push({
      catalog: 'humisteam',
      id: p.id,
      sku: p.sku,
      title: p.title,
      price: p.price,
      published: p.published,
      showPriceOnSite: p.showPriceOnSite,
      image: p.image,
      galleryImages: p.galleryImages,
    })
  }
  for (const product of catalog.heatersteam) {
    const p = normalizeProduct(product, 'heatersteam')
    rows.push({
      catalog: 'heatersteam',
      id: p.id,
      sku: p.sku,
      title: p.title,
      price: p.price,
      published: p.published,
      showPriceOnSite: p.showPriceOnSite,
      image: p.image,
      galleryImages: p.galleryImages,
    })
  }
  for (const product of catalog.components) {
    const p = normalizeProduct(product, 'components')
    rows.push({
      catalog: 'components',
      id: p.id,
      sku: p.sku,
      title: p.title,
      price: p.price,
      published: p.published,
      showPriceOnSite: p.showPriceOnSite,
      image: p.image,
      galleryImages: p.galleryImages,
    })
  }

  return rows.sort((a, b) => a.sku.localeCompare(b.sku, 'ru'))
}
