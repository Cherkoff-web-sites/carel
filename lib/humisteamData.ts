import type { HumisteamModelId } from '@/lib/catalogData'
import {
  HUMISTEAM_CATALOG_ENTRIES,
  type HumiSteamProductSpecs,
} from '@/lib/humisteamProductsCatalog'

export type { HumiSteamProductSpecs }

export type HumiSteamProduct = {
  id: string
  modelId: HumisteamModelId
  sku: string
  title: string
  performanceKgH: number
  description: string
  image: string
  price: number
  specs: HumiSteamProductSpecs
}

export const HUMISTEAM_MODELS: { id: HumisteamModelId; label: string }[] = [
  { id: 'basic-uey', label: 'Basic (UE*Y)' },
  { id: 'xplus-uex', label: 'X-Plus (UE*X)' },
  { id: 'wellness-uew', label: 'Wellness (UE*W)' },
]

export const HUMISTEAM_GALLERY_IMAGES = [
  '/images/catalog/humisteam/gallery-1.png',
  '/images/catalog/humisteam/gallery-2.png',
  '/images/catalog/humisteam/gallery-3.png',
  '/images/catalog/humisteam/gallery-4.png',
] as const

export const HUMISTEAM_DESCRIPTION = [
  'humiSteam — комплексная линейка паровых увлажнителей, разработанная для обслуживания объектов любого масштаба и назначения: от жилых помещений и офисных зданий до крупных производственных комплексов и специализированных банных зон. Благодаря широкому диапазону производительности (1,5–130 кг/ч), система обеспечивает оптимальное решение как для малых, так и для крупных площадей.',
  'Сложно определить нужную модель или мощность? Заполните заявку — специалисты помогут с выбором по объекту.',
] as const

export const HUMISTEAM_PRODUCT_IMAGE = '/images/catalog/humisteam/products/ue001yd001.png'

function formatPerformanceLabel(kgH: number): string {
  return kgH.toString().replace('.', ',')
}

function catalogEntryToProduct(
  entry: (typeof HUMISTEAM_CATALOG_ENTRIES)[number]
): HumiSteamProduct {
  const perfLabel = formatPerformanceLabel(entry.performanceKgH)
  return {
    id: entry.sku.toLowerCase(),
    modelId: entry.modelId,
    sku: entry.sku,
    title: `${entry.sku} — humiSteam ${entry.lineName} ${perfLabel} кг/ч`,
    performanceKgH: entry.performanceKgH,
    description: entry.subtitle,
    image: HUMISTEAM_PRODUCT_IMAGE,
    price: 1,
    specs: entry.specs,
  }
}

export const HUMISTEAM_PRODUCTS: HumiSteamProduct[] =
  HUMISTEAM_CATALOG_ENTRIES.map(catalogEntryToProduct)

export const HUMISTEAM_PERFORMANCE_GRID = Array.from(
  new Set(HUMISTEAM_PRODUCTS.map((product) => product.performanceKgH))
).sort((a, b) => a - b)

export function getModelLabel(modelId: HumisteamModelId): string {
  return HUMISTEAM_MODELS.find((m) => m.id === modelId)?.label ?? modelId
}

export function getProductsForModel(modelId: HumisteamModelId): HumiSteamProduct[] {
  return HUMISTEAM_PRODUCTS.filter((p) => p.modelId === modelId)
}

export function getPerformanceOptions(modelId: HumisteamModelId | null): number[] {
  const source = modelId
    ? HUMISTEAM_PRODUCTS.filter((p) => p.modelId === modelId)
    : HUMISTEAM_PRODUCTS
  const values = Array.from(new Set(source.map((p) => p.performanceKgH)))
  return values.sort((a, b) => a - b)
}

export function filterProducts(
  modelId: HumisteamModelId | null,
  performanceKgH: number | null
): HumiSteamProduct[] {
  return HUMISTEAM_PRODUCTS.filter((p) => {
    if (modelId && p.modelId !== modelId) return false
    if (performanceKgH !== null && p.performanceKgH !== performanceKgH) return false
    return true
  })
}

export function getModelsToDisplay(modelId: HumisteamModelId | null): HumisteamModelId[] {
  if (modelId) return [modelId]
  return HUMISTEAM_MODELS.map((m) => m.id)
}

export function getHumiSteamProductById(id: string): HumiSteamProduct | undefined {
  return HUMISTEAM_PRODUCTS.find((p) => p.id === id)
}

export function getHumiSteamProductBySku(sku: string): HumiSteamProduct | undefined {
  const normalized = sku.trim().toUpperCase()
  return HUMISTEAM_PRODUCTS.find((p) => p.sku.toUpperCase() === normalized)
}
