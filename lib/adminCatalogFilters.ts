import {
  catalogIdToHeatersteamVariantId,
  catalogIdToModelId,
  CATALOG_TREE,
  getCatalogLeafIds,
  HEATERSTEAM_CATALOG_IDS,
  HUMISTEAM_CATALOG_IDS,
} from '@/lib/catalogData'
import { COMPONENTS_CATALOG_TREE } from '@/lib/componentsCatalogTree'
import type { ComponentCatalogItem } from '@/lib/componentsCatalogData'
import type { HeaterSteamProduct } from '@/lib/heatersteamData'
import type { HumiSteamProduct } from '@/lib/humisteamData'

export type HumidifierAdminItem =
  | { catalogKey: 'humisteam'; product: HumiSteamProduct }
  | { catalogKey: 'heatersteam'; product: HeaterSteamProduct }

function collectHumidifierItems(
  humisteam: HumiSteamProduct[],
  heatersteam: HeaterSteamProduct[]
): HumidifierAdminItem[] {
  return [
    ...humisteam.map((product) => ({ catalogKey: 'humisteam' as const, product })),
    ...heatersteam.map((product) => ({ catalogKey: 'heatersteam' as const, product })),
  ]
}

function branchHasProducts(treeNodeId: string): boolean {
  const leafIds = getCatalogLeafIds(CATALOG_TREE, treeNodeId)
  const humiLeaves = HUMISTEAM_CATALOG_IDS as readonly string[]
  const heaterLeaves = HEATERSTEAM_CATALOG_IDS as readonly string[]
  return leafIds.some(
    (id) => humiLeaves.includes(id) || heaterLeaves.includes(id) || id === 'humisteam' || id === 'heatersteam'
  )
}

export function filterHumidifierProducts(
  humisteam: HumiSteamProduct[],
  heatersteam: HeaterSteamProduct[],
  treeNodeId: string,
  searchQuery: string
): HumidifierAdminItem[] {
  let items = collectHumidifierItems(humisteam, heatersteam)

  if (treeNodeId !== 'all') {
    const modelId = catalogIdToModelId(treeNodeId)
    const variantId = catalogIdToHeatersteamVariantId(treeNodeId)

    if (treeNodeId === 'humisteam') {
      items = items.filter((item) => item.catalogKey === 'humisteam')
    } else if (modelId) {
      items = items.filter(
        (item) => item.catalogKey === 'humisteam' && item.product.modelId === modelId
      )
    } else if (treeNodeId === 'heatersteam') {
      items = items.filter((item) => item.catalogKey === 'heatersteam')
    } else if (variantId) {
      items = items.filter(
        (item) => item.catalogKey === 'heatersteam' && item.product.variantId === variantId
      )
    } else if (!branchHasProducts(treeNodeId)) {
      return []
    } else {
      const leafIds = getCatalogLeafIds(CATALOG_TREE, treeNodeId)
      items = items.filter((item) => {
        if (item.catalogKey === 'humisteam') {
          return leafIds.includes(item.product.modelId) || leafIds.includes('humisteam')
        }
        return leafIds.includes(item.product.variantId) || leafIds.includes('heatersteam')
      })
    }
  }

  const query = searchQuery.trim().toLowerCase()
  if (query) {
    items = items.filter(
      (item) =>
        item.product.sku.toLowerCase().includes(query) ||
        item.product.title.toLowerCase().includes(query) ||
        item.product.description.toLowerCase().includes(query)
    )
  }

  return items.sort((a, b) => a.product.sku.localeCompare(b.product.sku, 'ru'))
}

export function filterComponentProducts(
  products: ComponentCatalogItem[],
  treeNodeId: string,
  searchQuery: string
): ComponentCatalogItem[] {
  let filtered = products

  if (treeNodeId !== 'all') {
    const leafIds = getCatalogLeafIds(COMPONENTS_CATALOG_TREE, treeNodeId)
    if (leafIds.length === 0) {
      return []
    }
    filtered = products.filter((item) => leafIds.includes(item.sectionId))
  }

  const query = searchQuery.trim().toLowerCase()
  if (query) {
    filtered = filtered.filter(
      (item) =>
        item.sku.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    )
  }

  return [...filtered].sort((a, b) => a.sku.localeCompare(b.sku, 'ru'))
}

export function getHumidifierSiteUrl(item: HumidifierAdminItem): string {
  const id =
    item.catalogKey === 'humisteam' ? item.product.modelId : item.product.variantId
  return `/catalog?id=${id}&sku=${encodeURIComponent(item.product.sku)}`
}

export function getComponentSiteUrl(product: ComponentCatalogItem): string {
  return `/components?id=${product.id}`
}

export function formatAdminPrice(price: number): string {
  return price > 0 ? `${price.toLocaleString('ru-RU')} ₽` : 'По запросу'
}
