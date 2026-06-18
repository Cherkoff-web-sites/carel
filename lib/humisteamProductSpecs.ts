import type { HumiSteamProduct } from '@/lib/humisteamData'

function formatPerformanceKgH(kgH: number): string {
  return kgH.toString().replace('.', ',')
}

function parseDescriptionParts(description: string): string[] {
  return description.split('|').map((part) => part.trim())
}

export type HumiSteamProductSpecRow = {
  label: string
  value: string
}

export function getHumiSteamProductDisplayName(sku: string): string {
  return `Увлажнитель Carel ${sku}`
}

export function getHumiSteamProductSubtitle(product: HumiSteamProduct): string {
  const parts = parseDescriptionParts(product.description)
  const detail = parts[2]
  if (detail) {
    if (detail.toLowerCase().includes('цилиндр')) {
      return product.specs.cylinderType
    }
    return detail
  }
  return product.specs.cylinderType
}

export function getHumiSteamProductSpecRows(product: HumiSteamProduct): HumiSteamProductSpecRow[] {
  const { specs } = product
  const performance = `${formatPerformanceKgH(product.performanceKgH)} кг/ч пара`

  const rows: HumiSteamProductSpecRow[] = [
    { label: 'Артикул:', value: product.sku },
    { label: 'Производительность:', value: performance },
  ]

  if (specs.powerKw) {
    rows.push({ label: 'Мощность:', value: specs.powerKw })
  }

  rows.push({ label: 'Электропитание:', value: specs.powerSupply })
  rows.push({ label: 'Управление:', value: specs.control })
  rows.push({ label: 'Тип цилиндра:', value: specs.cylinderType })

  if (specs.steamConnection) {
    rows.push({ label: 'Присоединение линии пара:', value: specs.steamConnection })
  }

  if (specs.cylinderCount) {
    rows.push({ label: 'Количество цилиндров:', value: specs.cylinderCount })
  }

  if (specs.dimensions) {
    rows.push({ label: 'Размеры (ВхШхГ):', value: specs.dimensions })
  }

  if (specs.packagingDimensions) {
    rows.push({ label: 'Размеры упаковки (ВхШхГ):', value: specs.packagingDimensions })
  }

  const weight = specs.weight ?? specs.netWeight
  if (weight) {
    rows.push({ label: 'Вес:', value: weight })
  } else if (specs.netWeight) {
    rows.push({ label: 'Вес нетто:', value: specs.netWeight })
  }

  if (specs.grossWeight) {
    rows.push({ label: 'Вес брутто:', value: specs.grossWeight })
  }

  if (specs.protectionClass) {
    rows.push({ label: 'Класс защиты:', value: specs.protectionClass })
  }

  if (specs.recommendedArea) {
    rows.push({ label: 'Рекомендуемая площадь:', value: specs.recommendedArea })
  }

  if (specs.features) {
    rows.push({ label: 'Особенности:', value: specs.features })
  }

  return rows
}
