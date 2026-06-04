/** Базовая папка: public/images/catalog/miniatures/ */
export const CATALOG_SIDEBAR_THUMB_DIR = '/images/catalog/miniatures'

export function catalogSidebarThumbSrc(nodeId: string): string {
  return `${CATALOG_SIDEBAR_THUMB_DIR}/${nodeId}.png`
}

/**
 * Узлы с миниатюрой в сайдбаре (имя файла = {id}.png).
 * humiSteam / heaterSteam / compactSteam — одна картинка на линейку;
 * адиабатические и остальные — на каждый пункт без подменю.
 */
export const CATALOG_SIDEBAR_THUMB_IDS = [
  'humisteam',
  'heatersteam',
  'compactsteam',
  'humisonic-compact',
  'humisonic-ventilation',
  'humisonic-direct',
  'humidisk',
  'humifog',
  'humifog-direct',
  'chillbooster',
  'optimist',
  'wts',
] as const

export type CatalogSidebarThumbId = (typeof CATALOG_SIDEBAR_THUMB_IDS)[number]

const THUMB_ID_SET = new Set<string>(CATALOG_SIDEBAR_THUMB_IDS)

export function hasCatalogSidebarThumb(nodeId: string): boolean {
  return THUMB_ID_SET.has(nodeId)
}

/** Ожидаемые файлы в miniatures/ (дополняйте по мере загрузки) */
export const CATALOG_SIDEBAR_THUMB_FILES: { id: string; file: string; label: string }[] = [
  { id: 'humisteam', file: 'humisteam.png', label: 'humiSteam' },
  { id: 'heatersteam', file: 'heatersteam.png', label: 'heaterSteam' },
  { id: 'compactsteam', file: 'compactsteam.png', label: 'compactSteam' },
  { id: 'humisonic-compact', file: 'humisonic-compact.png', label: 'humiSonic compact' },
  { id: 'humisonic-ventilation', file: 'humisonic-ventilation.png', label: 'humiSonic ventilation' },
  { id: 'humisonic-direct', file: 'humisonic-direct.png', label: 'humiSonic direct' },
  { id: 'humidisk', file: 'humidisk.png', label: 'humiDisk' },
  { id: 'humifog', file: 'humifog.png', label: 'humiFog' },
  { id: 'humifog-direct', file: 'humifog-direct.png', label: 'humiFog direct' },
  { id: 'chillbooster', file: 'chillbooster.png', label: 'chillBooster' },
  { id: 'optimist', file: 'optimist.png', label: 'optiMist' },
  { id: 'wts', file: 'wts.png', label: 'WTS' },
]
