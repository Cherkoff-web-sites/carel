import { COMPONENTS_CATALOG } from '@/lib/componentsCatalogData'
import { HEATERSTEAM_PRODUCTS } from '@/lib/heatersteamData'
import { HUMISTEAM_PRODUCTS } from '@/lib/humisteamData'
import type { CatalogFile } from '@/lib/catalogTypes'

export function buildCatalogSeed(): CatalogFile {
  return {
    version: 1,
    humisteam: HUMISTEAM_PRODUCTS.map((product) => ({ ...product, specs: { ...product.specs } })),
    heatersteam: HEATERSTEAM_PRODUCTS.map((product) => ({ ...product })),
    components: COMPONENTS_CATALOG.map((item) => ({
      ...item,
      galleryImages: [...item.galleryImages],
      relatedContexts: [...item.relatedContexts],
    })),
  }
}
