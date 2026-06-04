import type { HeatersteamVariantId } from '@/lib/catalogData'
import { CATALOG_GALLERY_IMAGES, CATALOG_PRODUCT_IMAGE } from '@/lib/catalogSharedAssets'

export type HeaterSteamProduct = {
  id: string
  variantId: HeatersteamVariantId
  sku: string
  title: string
  performanceKgH: number
  description: string
  image: string
  price: number
}

export const HEATERSTEAM_VARIANTS: { id: HeatersteamVariantId; label: string }[] = [
  { id: 'heatersteam-process', label: 'process' },
  { id: 'heatersteam-titanium', label: 'titanium' },
]

export const HEATERSTEAM_GALLERY_IMAGES = CATALOG_GALLERY_IMAGES

export const HEATERSTEAM_DESCRIPTION = [
  'heaterSteam — увлажнители с электронагревателем для точного поддержания влажности в помещениях и технологических процессах.',
  'Выберите исполнение process или titanium и производительность — список моделей обновится ниже. Нужна помощь с подбором? Оставьте заявку, инженер подберёт решение под ваш объект.',
] as const

export const HEATERSTEAM_PERFORMANCE_GRID = [1.5, 3, 5, 8, 15, 25, 45] as const

const PRODUCT_OVERRIDES: Partial<
  Record<HeatersteamVariantId, Partial<Record<number, { sku: string; description?: string; title?: string }>>>
> = {
  'heatersteam-process': {
    1.5: {
      sku: 'UE001YD001',
      description: 'Увлажнитель с электронагревателем CAREL | 230В, однофазное | Неразборный цилиндр',
    },
    5: {
      sku: 'UE005YD001',
      description: 'Увлажнитель с электронагревателем CAREL | 230В, однофазное | Неразборный цилиндр',
    },
    15: {
      sku: 'UE010YD001',
      description: 'Увлажнитель с электронагревателем CAREL | 400В, трёхфазное | Неразборный цилиндр',
    },
  },
  'heatersteam-titanium': {
    3: {
      sku: 'UE003TD001',
      description: 'Увлажнитель heaterSteam titanium | 230В, однофазное | Повышенная коррозионная стойкость',
    },
    8: {
      sku: 'UE008TD001',
      description: 'Увлажнитель heaterSteam titanium | 400В, трёхфазное | Повышенная коррозионная стойкость',
    },
  },
}

function formatPerformanceLabel(kgH: number): string {
  return kgH.toString().replace('.', ',')
}

function buildSku(variantId: HeatersteamVariantId, performanceKgH: number): string {
  const letter = variantId === 'heatersteam-titanium' ? 'T' : 'D'
  const code = performanceKgH === 1.5 ? '001' : String(Math.round(performanceKgH)).padStart(3, '0')
  return `UE${code}${letter}001`
}

function buildProduct(variantId: HeatersteamVariantId, performanceKgH: number): HeaterSteamProduct {
  const override = PRODUCT_OVERRIDES[variantId]?.[performanceKgH]
  const sku = override?.sku ?? buildSku(variantId, performanceKgH)
  const variantLabel = variantId === 'heatersteam-process' ? 'process' : 'titanium'
  const perfLabel = formatPerformanceLabel(performanceKgH)
  const title =
    override?.title ?? `${sku} — heaterSteam ${variantLabel} ${perfLabel} кг/ч`
  const description =
    override?.description ?? `Увлажнитель с электронагревателем CAREL | ${perfLabel} кг/ч`

  return {
    id: sku.toLowerCase(),
    variantId,
    sku,
    title,
    performanceKgH,
    description,
    image: CATALOG_PRODUCT_IMAGE,
    price: 1,
  }
}

export const HEATERSTEAM_PRODUCTS: HeaterSteamProduct[] = HEATERSTEAM_VARIANTS.flatMap((v) =>
  HEATERSTEAM_PERFORMANCE_GRID.map((p) => buildProduct(v.id, p))
)

export function getVariantLabel(variantId: HeatersteamVariantId): string {
  return HEATERSTEAM_VARIANTS.find((v) => v.id === variantId)?.label ?? variantId
}

export function getPerformanceOptions(variantId: HeatersteamVariantId | null): number[] {
  const source = variantId
    ? HEATERSTEAM_PRODUCTS.filter((p) => p.variantId === variantId)
    : HEATERSTEAM_PRODUCTS
  return Array.from(new Set(source.map((p) => p.performanceKgH))).sort((a, b) => a - b)
}

export function filterProducts(
  variantId: HeatersteamVariantId | null,
  performanceKgH: number | null
): HeaterSteamProduct[] {
  return HEATERSTEAM_PRODUCTS.filter((p) => {
    if (variantId && p.variantId !== variantId) return false
    if (performanceKgH !== null && p.performanceKgH !== performanceKgH) return false
    return true
  })
}

export function getVariantsToDisplay(variantId: HeatersteamVariantId | null): HeatersteamVariantId[] {
  if (variantId) return [variantId]
  return HEATERSTEAM_VARIANTS.map((v) => v.id)
}

export function getProductsForVariant(variantId: HeatersteamVariantId): HeaterSteamProduct[] {
  return HEATERSTEAM_PRODUCTS.filter((p) => p.variantId === variantId)
}

export function getHeaterSteamProductById(id: string): HeaterSteamProduct | undefined {
  return HEATERSTEAM_PRODUCTS.find((p) => p.id === id)
}

export function getHeaterSteamProductBySku(sku: string): HeaterSteamProduct | undefined {
  const normalized = sku.trim().toUpperCase()
  return HEATERSTEAM_PRODUCTS.find((p) => p.sku.toUpperCase() === normalized)
}
