export type ProductTabId = 'installation' | 'series' | 'documents' | 'delivery' | 'payment'

export type ProductTabsEnabled = Record<ProductTabId, boolean>

export type ProductTabContent = {
  installationText: string
  seriesText: string
}

export type ProductDocument = {
  id: string
  title: string
  url: string
}

export type CatalogProductExtras = {
  galleryImages: string[]
  tabsEnabled: ProductTabsEnabled
  tabContent: ProductTabContent
  documents: ProductDocument[]
}

export const DEFAULT_TABS_ENABLED: ProductTabsEnabled = {
  installation: true,
  series: true,
  documents: true,
  delivery: true,
  payment: true,
}

export const EMPTY_TAB_CONTENT: ProductTabContent = {
  installationText: '',
  seriesText: '',
}

export type CatalogProductExtrasFields = {
  galleryImages?: readonly string[]
  tabsEnabled?: Partial<ProductTabsEnabled>
  tabContent?: Partial<ProductTabContent>
  documents?: ProductDocument[]
}

type ProductWithMedia = CatalogProductExtrasFields & {
  image?: string
}

export function withCatalogProductExtras<T extends ProductWithMedia>(
  product: T
): T & CatalogProductExtras {
  const gallery = product.galleryImages?.length
    ? [...product.galleryImages]
    : product.image
      ? [product.image]
      : []

  return {
    ...product,
    galleryImages: gallery,
    tabsEnabled: { ...DEFAULT_TABS_ENABLED, ...product.tabsEnabled },
    tabContent: {
      installationText: product.tabContent?.installationText ?? '',
      seriesText: product.tabContent?.seriesText ?? '',
    },
    documents: product.documents ? [...product.documents] : [],
  }
}

export function getProductGalleryImages(product: {
  image?: string
  galleryImages?: readonly string[]
}): string[] {
  const gallery = product.galleryImages?.filter(Boolean) ?? []
  if (gallery.length > 0) {
    return [...gallery]
  }
  return product.image ? [product.image] : []
}

export function getVisibleProductTabs(
  allTabs: readonly { id: ProductTabId; label: string }[],
  tabsEnabled: ProductTabsEnabled
) {
  return allTabs.filter((tab) => tabsEnabled[tab.id] !== false)
}
