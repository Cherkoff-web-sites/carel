import { CATALOG_GALLERY_IMAGES } from '@/lib/catalogSharedAssets'
import { PARTS_AND_COMPONENTS_GALLERY } from '@/lib/partsImage'
import type { CatalogKey } from '@/lib/catalogTypes'

export function getCatalogDefaultGallery(catalog: CatalogKey, image?: string): string[] {
  if (catalog === 'components') {
    return [...PARTS_AND_COMPONENTS_GALLERY]
  }

  const gallery: string[] = [...CATALOG_GALLERY_IMAGES]
  if (!image || gallery.includes(image)) {
    return gallery
  }
  return [image, ...gallery]
}
