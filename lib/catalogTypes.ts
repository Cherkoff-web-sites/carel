import type { CatalogProductMetaFields } from '@/lib/catalogProductMeta'
import type {
  CatalogProductExtras,
  ProductDocument,
  ProductTabContent,
  ProductTabsEnabled,
} from '@/lib/catalogProductExtras'
import type { ComponentCatalogItem } from '@/lib/componentsCatalogData'
import type { HeaterSteamProduct } from '@/lib/heatersteamData'
import type { HumiSteamProduct } from '@/lib/humisteamData'

export type CatalogKey = 'humisteam' | 'heatersteam' | 'components'

export type CatalogFile = {
  version: 1
  humisteam: HumiSteamProduct[]
  heatersteam: HeaterSteamProduct[]
  components: ComponentCatalogItem[]
}

export type CatalogProductMap = {
  humisteam: HumiSteamProduct
  heatersteam: HeaterSteamProduct
  components: ComponentCatalogItem
}

export type CatalogProductPatch = {
  sku?: string
  title?: string
  description?: string
  fullDescription?: string
  price?: number
  performanceKgH?: number
  modelId?: string
  variantId?: string
  sectionId?: string
  relatedContexts?: string[]
  specs?: Record<string, string>
  showPriceOnSite?: boolean
  published?: boolean
  metaTitle?: string
  metaDescription?: string
  image?: string
  galleryImages?: string[]
  tabsEnabled?: Partial<ProductTabsEnabled>
  tabContent?: Partial<ProductTabContent>
  documents?: ProductDocument[]
}

export type CatalogProductFull = CatalogProductPatch &
  Required<
    Pick<
      CatalogProductPatch,
      | 'title'
      | 'description'
      | 'fullDescription'
      | 'price'
      | 'showPriceOnSite'
      | 'published'
      | 'metaTitle'
      | 'metaDescription'
    >
  > &
  CatalogProductExtras

export type HumisteamPatch = CatalogProductPatch
export type HeatersteamPatch = CatalogProductPatch
export type ComponentsPatch = CatalogProductPatch
export type CatalogPatch = CatalogProductPatch

export type CatalogProductWithMeta<T> = T & Partial<CatalogProductMetaFields>

export type CreateCatalogProductOptions = {
  templateId?: string
  sectionId?: string
  modelId?: string
  variantId?: string
}
