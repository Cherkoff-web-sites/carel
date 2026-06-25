import type { HeatersteamVariantId } from '@/lib/catalogData'
import type { HeaterSteamProduct } from '@/lib/heatersteamData'

function formatPerformanceKgH(kgH: number): string {
  return kgH.toString().replace('.', ',')
}

function parseDescriptionParts(description: string): string[] {
  return description.split('|').map((part) => part.trim())
}

function getCylinderType(description: string): string {
  if (description.includes('Разборный')) return 'Разборный'
  return 'Неразборный (одноразовый)'
}

function getPowerSupply(description: string): string {
  const parts = parseDescriptionParts(description)
  if (parts[1]) return parts[1]
  if (description.includes('400В')) return '400В, трёхфазное'
  return '230В, однофазное'
}

const CONTROL_TYPE: Record<HeatersteamVariantId, string> = {
  'heatersteam-process': 'встроенное',
  'heatersteam-titanium': 'расширенное',
}

const AREA_BY_PERFORMANCE: Partial<Record<number, string>> = {
  1.5: 'до 45 м²',
  3: 'до 90 м²',
  5: 'до 150 м²',
  8: 'до 240 м²',
  15: 'до 450 м²',
  25: 'до 750 м²',
  45: 'до 1350 м²',
}

export type HeaterSteamProductSpecRow = { label: string; value: string }

export function getHeaterSteamProductDisplayName(sku: string): string {
  return `Увлажнитель Carel ${sku}`
}

export function getHeaterSteamProductSubtitle(product: HeaterSteamProduct): string {
  const parts = parseDescriptionParts(product.description)
  const detail = parts[2]
  if (detail?.toLowerCase().includes('цилиндр')) {
    return getCylinderType(product.description)
  }
  if (detail) return detail
  return getCylinderType(product.description)
}

export function getHeaterSteamProductSpecRows(product: HeaterSteamProduct): HeaterSteamProductSpecRow[] {
  const performance = `${formatPerformanceKgH(product.performanceKgH)} кг/ч пара`
  const area =
    AREA_BY_PERFORMANCE[product.performanceKgH] ??
    `до ${Math.round(product.performanceKgH * 30)} м²`

  const fullDescription = (product as { fullDescription?: string }).fullDescription?.trim()

  return [
    { label: 'Артикул:', value: product.sku },
    { label: 'Производительность:', value: performance },
    { label: 'Питание:', value: getPowerSupply(product.description) },
    { label: 'Тип управления:', value: CONTROL_TYPE[product.variantId] },
    { label: 'Тип цилиндра:', value: getCylinderType(product.description) },
    { label: 'Размеры (ВхШхГ):', value: '712×365×275 мм' },
    { label: 'Рекомендуемая площадь:', value: area },
    ...(fullDescription && fullDescription !== product.description.trim()
      ? [{ label: 'Полное описание:', value: fullDescription }]
      : []),
  ]
}
