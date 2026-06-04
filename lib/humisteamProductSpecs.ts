import type { HumisteamModelId } from '@/lib/catalogData'
import type { HumiSteamProduct } from '@/lib/humisteamData'

function formatPerformanceKgH(kgH: number): string {
  return kgH.toString().replace('.', ',')
}

function parseDescriptionParts(description: string): string[] {
  return description.split('|').map((part) => part.trim())
}

function getCylinderType(description: string): string {
  if (description.includes('Разборный')) {
    return 'Разборный'
  }
  return 'Неразборный (одноразовый)'
}

function getPowerSupply(description: string): string {
  const parts = parseDescriptionParts(description)
  const powerPart = parts[1]
  if (powerPart) {
    return powerPart
  }
  if (description.includes('400В')) {
    return '400В, трёхфазное'
  }
  return '230В, однофазное'
}

const CONTROL_TYPE_BY_MODEL: Record<HumisteamModelId, string> = {
  'basic-uey': 'встроенное',
  'xplus-uex': 'расширенное',
  'wellness-uew': 'wellness-режим',
}

/** Рекомендуемая площадь по производительности (ориентир для карточки) */
const RECOMMENDED_AREA_BY_PERFORMANCE: Partial<Record<number, string>> = {
  1.5: 'до 45 м²',
  3: 'до 90 м²',
  5: 'до 150 м²',
  8: 'до 240 м²',
  9: 'до 270 м²',
  10: 'до 300 м²',
  15: 'до 450 м²',
  18: 'до 540 м²',
  25: 'до 750 м²',
  35: 'до 1050 м²',
  45: 'до 1350 м²',
  65: 'до 1950 м²',
  90: 'до 2700 м²',
  130: 'до 3900 м²',
}

function getRecommendedArea(performanceKgH: number): string {
  return (
    RECOMMENDED_AREA_BY_PERFORMANCE[performanceKgH] ??
    `до ${Math.round(performanceKgH * 30)} м²`
  )
}

export type HumiSteamProductSpecRow = {
  label: string
  value: string
}

export function getHumiSteamProductDisplayName(sku: string): string {
  return `Увлажнитель Carel ${sku}`
}

export function getHumiSteamProductSpecRows(product: HumiSteamProduct): HumiSteamProductSpecRow[] {
  const performance = `${formatPerformanceKgH(product.performanceKgH)} кг/ч пара`

  return [
    { label: 'Артикул:', value: product.sku },
    { label: 'Производительность:', value: performance },
    { label: 'Питание:', value: getPowerSupply(product.description) },
    { label: 'Тип управления:', value: CONTROL_TYPE_BY_MODEL[product.modelId] },
    { label: 'Тип цилиндра:', value: getCylinderType(product.description) },
    { label: 'Размеры (ВхШхГ):', value: '712×365×275 мм' },
    { label: 'Рекомендуемая площадь:', value: getRecommendedArea(product.performanceKgH) },
  ]
}

export function getHumiSteamProductSubtitle(product: HumiSteamProduct): string {
  const parts = parseDescriptionParts(product.description)
  const detail = parts[2]
  if (detail) {
    if (detail.toLowerCase().includes('цилиндр')) {
      return getCylinderType(product.description)
    }
    return detail
  }
  return getCylinderType(product.description)
}
