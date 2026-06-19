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

export type HumisteamPatch = Pick<HumiSteamProduct, 'title' | 'description' | 'price'>
export type HeatersteamPatch = Pick<HeaterSteamProduct, 'title' | 'description' | 'price'>
export type ComponentsPatch = Pick<
  ComponentCatalogItem,
  'title' | 'description' | 'fullDescription' | 'price'
>
