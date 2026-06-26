import { withCatalogProductDefaults } from '@/lib/catalogProductMeta'
import {
  withCatalogProductExtras,
  type ProductDocument,
  type ProductTabContent,
  type ProductTabsEnabled,
} from '@/lib/catalogProductExtras'
import type { CatalogKey } from '@/lib/catalogTypes'

export type ProductEditorDraft = {
  sku: string
  title: string
  description: string
  fullDescription: string
  price: string
  performanceKgH: string
  modelId: string
  variantId: string
  sectionId: string
  relatedContexts: string
  specs: ProductSpecsDraft
  showPriceOnSite: boolean
  published: boolean
  metaTitle: string
  metaDescription: string
}

export type ProductSpecsDraft = {
  powerSupply: string
  control: string
  cylinderType: string
  dimensions: string
  recommendedArea: string
  powerKw: string
  steamConnection: string
  cylinderCount: string
  weight: string
  netWeight: string
  grossWeight: string
  packagingDimensions: string
  protectionClass: string
  features: string
}

const EMPTY_SPECS_DRAFT: ProductSpecsDraft = {
  powerSupply: '',
  control: '',
  cylinderType: '',
  dimensions: '',
  recommendedArea: '',
  powerKw: '',
  steamConnection: '',
  cylinderCount: '',
  weight: '',
  netWeight: '',
  grossWeight: '',
  packagingDimensions: '',
  protectionClass: '',
  features: '',
}

export type ProductEditorMedia = {
  image: string
  galleryImages: string[]
}

export type ProductEditorTabs = {
  tabsEnabled: ProductTabsEnabled
  tabContent: ProductTabContent
  documents: ProductDocument[]
}

type DraftSource = {
  sku: string
  title: string
  description: string
  price: number
  performanceKgH?: number
  modelId?: string
  variantId?: string
  sectionId?: string
  relatedContexts?: readonly string[]
  specs?: Partial<ProductSpecsDraft>
  image?: string
  galleryImages?: readonly string[]
  fullDescription?: string
  showPriceOnSite?: boolean
  published?: boolean
  metaTitle?: string
  metaDescription?: string
  tabsEnabled?: Partial<ProductTabsEnabled>
  tabContent?: Partial<ProductTabContent>
  documents?: ProductDocument[]
}

export function productToMedia(product: DraftSource): ProductEditorMedia {
  const normalized = withCatalogProductExtras(withCatalogProductDefaults(product))
  return {
    image: normalized.image ?? normalized.galleryImages[0] ?? '',
    galleryImages: [...normalized.galleryImages],
  }
}

export function productToTabs(product: DraftSource): ProductEditorTabs {
  const normalized = withCatalogProductExtras(withCatalogProductDefaults(product))
  return {
    tabsEnabled: { ...normalized.tabsEnabled },
    tabContent: { ...normalized.tabContent },
    documents: [...normalized.documents],
  }
}

type DraftSourceLegacy = {
  sku: string
  title: string
  description: string
  price: number
  performanceKgH?: number
  modelId?: string
  variantId?: string
  sectionId?: string
  relatedContexts?: readonly string[]
  specs?: Partial<ProductSpecsDraft>
  fullDescription?: string
  showPriceOnSite?: boolean
  published?: boolean
  metaTitle?: string
  metaDescription?: string
}

export function productToDraft(product: DraftSourceLegacy): ProductEditorDraft {
  const normalized = withCatalogProductDefaults(product)
  return {
    sku: product.sku,
    title: normalized.title,
    description: normalized.description,
    fullDescription: normalized.fullDescription,
    price: String(normalized.price),
    performanceKgH:
      product.performanceKgH === undefined ? '' : String(product.performanceKgH),
    modelId: product.modelId ?? '',
    variantId: product.variantId ?? '',
    sectionId: product.sectionId ?? '',
    relatedContexts: product.relatedContexts?.join(', ') ?? '',
    specs: { ...EMPTY_SPECS_DRAFT, ...product.specs },
    showPriceOnSite: normalized.showPriceOnSite,
    published: normalized.published,
    metaTitle: normalized.metaTitle,
    metaDescription: normalized.metaDescription,
  }
}

export function draftToPatch(
  draft: ProductEditorDraft,
  media?: ProductEditorMedia,
  tabs?: ProductEditorTabs,
  catalogKey?: CatalogKey
) {
  const specs = Object.fromEntries(
    Object.entries(draft.specs)
      .map(([key, value]) => [key, value.trim()])
      .filter(([, value]) => value)
  )

  const patch = {
    sku: draft.sku.trim(),
    title: draft.title,
    description: draft.description,
    fullDescription: draft.fullDescription,
    price: Number(draft.price) || 0,
    ...(catalogKey !== 'components' && draft.performanceKgH.trim()
      ? { performanceKgH: Number(draft.performanceKgH) || 0 }
      : {}),
    ...(catalogKey === 'humisteam' && draft.modelId.trim()
      ? { modelId: draft.modelId.trim() }
      : {}),
    ...(catalogKey === 'heatersteam' && draft.variantId.trim()
      ? { variantId: draft.variantId.trim() }
      : {}),
    ...(catalogKey === 'components' && draft.sectionId.trim()
      ? { sectionId: draft.sectionId.trim() }
      : {}),
    ...(catalogKey === 'components'
      ? {
          relatedContexts: draft.relatedContexts
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
        }
      : {}),
    ...(catalogKey === 'humisteam' && Object.keys(specs).length ? { specs } : {}),
    showPriceOnSite: draft.showPriceOnSite,
    published: draft.published,
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    ...(media
      ? { image: media.image, galleryImages: media.galleryImages }
      : {}),
    ...(tabs
      ? {
          tabsEnabled: tabs.tabsEnabled,
          tabContent: tabs.tabContent,
          documents: tabs.documents,
        }
      : {}),
  }

  return patch
}
