import type { CatalogKey } from '@/lib/catalogTypes'

export type CatalogExportItem = { catalog: CatalogKey; id: string }

const VALID_CATALOGS = new Set<CatalogKey>(['humisteam', 'heatersteam', 'components'])

export function buildCatalogExportHref(items: CatalogExportItem[]): string {
  if (items.length === 0) {
    return '/api/admin/catalog/export'
  }
  const payload = items
    .map((item) => `${item.catalog}:${encodeURIComponent(item.id)}`)
    .join(',')
  return `/api/admin/catalog/export?items=${encodeURIComponent(payload)}`
}

export function parseCatalogExportItems(raw: string | null): CatalogExportItem[] | undefined {
  if (!raw?.trim()) {
    return undefined
  }
  const items: CatalogExportItem[] = []
  for (const part of raw.split(',')) {
    const colon = part.indexOf(':')
    if (colon <= 0) continue
    const catalog = part.slice(0, colon) as CatalogKey
    if (!VALID_CATALOGS.has(catalog)) continue
    const id = decodeURIComponent(part.slice(colon + 1))
    if (!id) continue
    items.push({ catalog, id })
  }
  return items.length ? items : undefined
}
