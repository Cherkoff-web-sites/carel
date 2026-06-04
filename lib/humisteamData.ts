import type { HumisteamModelId } from '@/lib/catalogData'

export type HumiSteamProduct = {
  id: string
  modelId: HumisteamModelId
  sku: string
  title: string
  performanceKgH: number
  description: string
  image: string
  price: number
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
  'humiSteam — паровые увлажнители с погружными электродами. В серии три линейки: Basic (UE*Y) для стандартных объектов, X-Plus (UE*X) с расширенным управлением и связью, Wellness (UE*W) для саун, бань и wellness-зон. Производительность — от 1 до 130 кг/ч.',
  'Сложно определить нужную модель или мощность? Заполните заявку — специалисты помогут с выбором по объекту.',
] as const

/** Полная сетка производительности по макету (кг/ч) */
export const HUMISTEAM_PERFORMANCE_GRID = [
  1.5, 3, 5, 8, 9, 10, 15, 18, 25, 35, 45, 65, 90, 130,
] as const

/** Временно одно фото на все карточки */
export const HUMISTEAM_PRODUCT_IMAGE = '/images/catalog/humisteam/products/ue001yd001.png'

const MODEL_LINE_NAMES: Record<HumisteamModelId, string> = {
  'basic-uey': 'Basic',
  'xplus-uex': 'X-Plus',
  'wellness-uew': 'Wellness',
}

const MODEL_SKU_LETTER: Record<HumisteamModelId, string> = {
  'basic-uey': 'Y',
  'xplus-uex': 'X',
  'wellness-uew': 'W',
}

type ProductOverride = {
  sku: string
  title?: string
  description?: string
}

/** Детальные карточки поверх автогенерации */
const PRODUCT_OVERRIDES: Partial<
  Record<HumisteamModelId, Partial<Record<number, ProductOverride>>>
> = {
  'basic-uey': {
    1.5: {
      sku: 'UE001YD001',
      description: 'Паровой увлажнитель CAREL | 230В, однофазное | Неразборный цилиндр',
    },
    5: {
      sku: 'UE003YE001',
      title: 'UE003YE001 — humiSteam Basic 5 кг/ч (разборный)',
      description: 'Паровой увлажнитель CAREL | 230В, однофазное | Разборный цилиндр',
    },
    8: {
      sku: 'UE005YD001',
      description: 'Паровой увлажнитель CAREL | 230В, однофазное | Неразборный цилиндр',
    },
    15: {
      sku: 'UE010YD001',
      description: 'Паровой увлажнитель CAREL | 400В, трёхфазное | Неразборный цилиндр',
    },
    25: {
      sku: 'UE015YD001',
      description: 'Паровой увлажнитель CAREL | 400В, трёхфазное | Неразборный цилиндр',
    },
  },
  'xplus-uex': {
    3: { sku: 'UE003XD001', description: 'Паровой увлажнитель CAREL | 230В, однофазное | Расширенный контроль' },
    5: { sku: 'UE005XD001', description: 'Паровой увлажнитель CAREL | 230В, однофазное | Расширенный контроль' },
    10: { sku: 'UE010XD001', description: 'Паровой увлажнитель CAREL | 400В, трёхфазное | Расширенный контроль' },
    18: { sku: 'UE018XD001', description: 'Паровой увлажнитель CAREL | 400В, трёхфазное | Расширенный контроль' },
    35: { sku: 'UE035XD001', description: 'Паровой увлажнитель CAREL | 400В, трёхфазное | Расширенный контроль' },
  },
  'wellness-uew': {
    1.5: { sku: 'UE001WD001', description: 'Паровой увлажнитель CAREL | 230В, однофазное | Для wellness-зон' },
    5: { sku: 'UE005WD001', description: 'Паровой увлажнитель CAREL | 230В, однофазное | Для wellness-зон' },
    9: { sku: 'UE009WD001', description: 'Паровой увлажнитель CAREL | 230В, однофазное | Для wellness-зон' },
    15: { sku: 'UE015WD001', description: 'Паровой увлажнитель CAREL | 400В, трёхфазное | Для wellness-зон' },
    45: { sku: 'UE045WD001', description: 'Паровой увлажнитель CAREL | 400В, трёхфазное | Для wellness-зон' },
  },
}

function formatPerformanceLabel(kgH: number): string {
  return kgH.toString().replace('.', ',')
}

function performanceToCode(kgH: number): string {
  if (kgH === 1.5) return '001'
  if (Number.isInteger(kgH)) return String(kgH).padStart(3, '0')
  return String(Math.round(kgH * 10)).padStart(3, '0')
}

function buildSku(modelId: HumisteamModelId, performanceKgH: number): string {
  const letter = MODEL_SKU_LETTER[modelId]
  const code = performanceToCode(performanceKgH)
  return `UE${code}${letter}D001`
}

function buildProduct(modelId: HumisteamModelId, performanceKgH: number): HumiSteamProduct {
  const override = PRODUCT_OVERRIDES[modelId]?.[performanceKgH]
  const sku = override?.sku ?? buildSku(modelId, performanceKgH)
  const lineName = MODEL_LINE_NAMES[modelId]
  const perfLabel = formatPerformanceLabel(performanceKgH)
  const title =
    override?.title ?? `${sku} — humiSteam ${lineName} ${perfLabel} кг/ч`
  const description =
    override?.description ?? `Паровой увлажнитель CAREL | ${perfLabel} кг/ч`

  return {
    id: sku.toLowerCase(),
    modelId,
    sku,
    title,
    performanceKgH,
    description,
    image: HUMISTEAM_PRODUCT_IMAGE,
    price: 1,
  }
}

function buildAllProducts(): HumiSteamProduct[] {
  const modelIds = HUMISTEAM_MODELS.map((m) => m.id)
  return modelIds.flatMap((modelId) =>
    HUMISTEAM_PERFORMANCE_GRID.map((performanceKgH) => buildProduct(modelId, performanceKgH))
  )
}

export const HUMISTEAM_PRODUCTS: HumiSteamProduct[] = buildAllProducts()

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
