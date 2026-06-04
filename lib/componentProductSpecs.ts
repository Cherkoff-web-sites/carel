import type { ComponentCatalogItem } from '@/lib/componentsCatalogData'
import {
  COMPONENT_SERIES_TEXT_DEFAULT,
  COMPONENT_STEAM_CYLINDERS_SERIES_TEXT,
} from '@/lib/componentProductTabs'

export function getComponentProductTitle(item: ComponentCatalogItem): string {
  return `${item.sku} ${item.description}`
}

export function getComponentProductSpecRows(item: ComponentCatalogItem): { label: string; value: string }[] {
  return [
    { label: 'Артикул:', value: item.sku },
    { label: 'Описание:', value: item.fullDescription },
  ]
}

export function getComponentGalleryImages(item: ComponentCatalogItem): readonly string[] {
  return item.galleryImages.length > 0 ? item.galleryImages : [item.image]
}

export function getComponentSeriesTabParagraphs(sectionId: string): readonly string[] {
  if (sectionId === 'steam-cylinders') {
    return COMPONENT_STEAM_CYLINDERS_SERIES_TEXT
  }
  return COMPONENT_SERIES_TEXT_DEFAULT
}
