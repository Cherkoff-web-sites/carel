import { withCatalogProductDefaults } from '@/lib/catalogProductMeta'
import {
  withCatalogProductExtras,
  type ProductDocument,
  type ProductTabContent,
  type ProductTabsEnabled,
} from '@/lib/catalogProductExtras'

export type ProductEditorDraft = {
  title: string
  description: string
  fullDescription: string
  price: string
  showPriceOnSite: boolean
  published: boolean
  metaTitle: string
  metaDescription: string
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
  title: string
  description: string
  price: number
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
  title: string
  description: string
  price: number
  fullDescription?: string
  showPriceOnSite?: boolean
  published?: boolean
  metaTitle?: string
  metaDescription?: string
}

export function productToDraft(product: DraftSourceLegacy): ProductEditorDraft {
  const normalized = withCatalogProductDefaults(product)
  return {
    title: normalized.title,
    description: normalized.description,
    fullDescription: normalized.fullDescription,
    price: String(normalized.price),
    showPriceOnSite: normalized.showPriceOnSite,
    published: normalized.published,
    metaTitle: normalized.metaTitle,
    metaDescription: normalized.metaDescription,
  }
}

export function draftToPatch(
  draft: ProductEditorDraft,
  media?: ProductEditorMedia,
  tabs?: ProductEditorTabs
) {
  return {
    title: draft.title,
    description: draft.description,
    fullDescription: draft.fullDescription,
    price: Number(draft.price) || 0,
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
}
