import type { CartItem } from '@/contexts/CartContext'
import {
  findCatalogNodeById,
  getCatalogLeafIds,
} from '@/lib/catalogData'
import { COMPONENTS_CATALOG_TREE } from '@/lib/componentsCatalogTree'
import {
  PARTS_AND_COMPONENTS_GALLERY,
  PARTS_AND_COMPONENTS_IMAGE,
} from '@/lib/partsImage'

/** Карточка каталога комплектующих */
export type ComponentCatalogItem = {
  id: string
  sku: string
  title: string
  description: string
  /** Полное описание для карточки товара */
  fullDescription: string
  image: string
  galleryImages: readonly string[]
  price: number
  /** id раздела в COMPONENTS_CATALOG_TREE (лист или группа) */
  sectionId: string
  /** id линейки каталога увлажнителей для блока «С этим товаром покупают» */
  relatedContexts: string[]
}

function cylinderFullDescription(sku: string, short: string): string {
  return `${sku} ${short}, 3x400В, тип С, для средней электропроводности воды (350–750 мкС/см).`
}

function componentMedia() {
  return {
    image: PARTS_AND_COMPONENTS_IMAGE,
    galleryImages: PARTS_AND_COMPONENTS_GALLERY,
  }
}

export const COMPONENTS_CATALOG: ComponentCatalogItem[] = [
  {
    id: 'cyl-blot2c00h2',
    sku: 'BLOT2C00H2',
    title: 'BLOT2C00H2',
    description: 'Неразборный цилиндр CAREL 5–8 кг/ч, тип С',
    fullDescription: cylinderFullDescription(
      'BLOT2C00H2',
      'Неразборный цилиндр CAREL 5–8 кг/ч, тип С'
    ),
    ...componentMedia(),
    price: 0,
    sectionId: 'steam-cylinders',
    relatedContexts: ['basic-uey', 'xplus-uex'],
  },
  {
    id: 'cyl-blot4c00h2',
    sku: 'BLOT4C00H2',
    title: 'BLOT4C00H2',
    description: 'Неразборный цилиндр CAREL 9–15 кг/ч, тип С',
    fullDescription: cylinderFullDescription(
      'BLOT4C00H2',
      'Неразборный цилиндр CAREL 9–15 кг/ч, тип С'
    ),
    ...componentMedia(),
    price: 0,
    sectionId: 'steam-cylinders',
    relatedContexts: ['basic-uey', 'xplus-uex'],
  },
  {
    id: 'cyl-blot8c00h2',
    sku: 'BLOT8C00H2',
    title: 'BLOT8C00H2',
    description: 'Неразборный цилиндр CAREL 18–25 кг/ч, тип С',
    fullDescription: cylinderFullDescription(
      'BLOT8C00H2',
      'Неразборный цилиндр CAREL 18–25 кг/ч, тип С'
    ),
    ...componentMedia(),
    price: 0,
    sectionId: 'steam-cylinders',
    relatedContexts: ['xplus-uex', 'wellness-uew'],
  },
  {
    id: 'cyl-blot16c00h2',
    sku: 'BLOT16C00H2',
    title: 'BLOT16C00H2',
    description: 'Неразборный цилиндр CAREL 35–45 кг/ч, тип С',
    fullDescription: cylinderFullDescription(
      'BLOT16C00H2',
      'Неразборный цилиндр CAREL 35–45 кг/ч, тип С'
    ),
    ...componentMedia(),
    price: 0,
    sectionId: 'steam-cylinders',
    relatedContexts: ['xplus-uex'],
  },
  {
    id: 'cyl-blot32c00h2',
    sku: 'BLOT32C00H2',
    title: 'BLOT32C00H2',
    description: 'Неразборный цилиндр CAREL 65–90 кг/ч, тип С',
    fullDescription: cylinderFullDescription(
      'BLOT32C00H2',
      'Неразборный цилиндр CAREL 65–90 кг/ч, тип С'
    ),
    ...componentMedia(),
    price: 0,
    sectionId: 'steam-cylinders',
    relatedContexts: ['xplus-uex'],
  },
  {
    id: 'cyl-blot64c00h2',
    sku: 'BLOT64C00H2',
    title: 'BLOT64C00H2',
    description: 'Неразборный цилиндр CAREL 90–130 кг/ч, тип С',
    fullDescription: cylinderFullDescription(
      'BLOT64C00H2',
      'Неразборный цилиндр CAREL 90–130 кг/ч, тип С'
    ),
    ...componentMedia(),
    price: 0,
    sectionId: 'steam-cylinders',
    relatedContexts: ['xplus-uex'],
  },
  {
    id: 'distribution-kit',
    sku: 'DIST-KIT-01',
    title: 'Комплект парораспределителей',
    description: 'Комплект парораспределителей для равномерной подачи пара',
    fullDescription:
      'DIST-KIT-01 Комплект парораспределителей для равномерной подачи пара в воздуховод.',
    ...componentMedia(),
    price: 0,
    sectionId: 'steam-distributors',
    relatedContexts: ['xplus-uex', 'wellness-uew', 'heatersteam-process'],
  },
  {
    id: 'feed-water-tube',
    sku: 'FW-TUBE-12',
    title: 'Трубка для подачи питающей воды Carel',
    description: 'Трубка для подачи питающей воды, комплект поставки Carel',
    fullDescription:
      'FW-TUBE-12 Трубка для подачи питающей воды Carel, комплект поставки для подключения увлажнителя.',
    ...componentMedia(),
    price: 0,
    sectionId: 'air-water-lines',
    relatedContexts: ['heatersteam-process', 'heatersteam-titanium', 'basic-uey', 'xplus-uex'],
  },
  {
    id: 'modbus-module',
    sku: 'MODBUS-PCO',
    title: 'Модуль связи Modbus',
    description: 'Модуль связи Modbus для интеграции в систему автоматики',
    fullDescription:
      'MODBUS-PCO Модуль связи Modbus для интеграции увлажнителя в систему диспетчеризации.',
    ...componentMedia(),
    price: 0,
    sectionId: 'controllers',
    relatedContexts: ['xplus-uex', 'heatersteam-titanium'],
  },
  {
    id: 'sensor-th',
    sku: 'SENSOR-TH-01',
    title: 'Датчик температуры и влажности Carel',
    description: 'Датчик температуры и влажности для контроля микроклимата',
    fullDescription:
      'SENSOR-TH-01 Датчик температуры и влажности Carel для контроля микроклимата в помещении.',
    ...componentMedia(),
    price: 0,
    sectionId: 'th-sensors',
    relatedContexts: ['basic-uey', 'xplus-uex', 'wellness-uew'],
  },
  {
    id: 'water-filter',
    sku: 'FILTER-WTS',
    title: 'Фильтр подготовки воды',
    description: 'Фильтр подготовки воды для увлажнительных систем',
    fullDescription:
      'FILTER-WTS Фильтр подготовки воды для увлажнительных и климатических систем CAREL.',
    ...componentMedia(),
    price: 0,
    sectionId: 'filters',
    relatedContexts: [
      'heatersteam-process',
      'heatersteam-titanium',
      'basic-uey',
      'xplus-uex',
      'wellness-uew',
    ],
  },
  {
    id: 'steam-hose',
    sku: 'HOSE-STEAM-1',
    title: 'Паропровод гибкий для humiSteam',
    description: 'Гибкий паропровод для подключения humiSteam',
    fullDescription:
      'HOSE-STEAM-1 Паропровод гибкий для подключения увлажнителей серии humiSteam.',
    ...componentMedia(),
    price: 0,
    sectionId: 'tubes',
    relatedContexts: ['basic-uey', 'xplus-uex'],
  },
  {
    id: 'cylinder-basic',
    sku: 'CYL-BASIC-UEY',
    title: 'Сменный цилиндр (Basic)',
    description: 'Сменный цилиндр для линейки humiSteam Basic (UE*Y)',
    fullDescription:
      'CYL-BASIC-UEY Сменный цилиндр для линейки humiSteam Basic (UE*Y), подбор по производительности.',
    ...componentMedia(),
    price: 0,
    sectionId: 'steam-cylinders',
    relatedContexts: ['basic-uey'],
  },
]

export function isComponentProductId(id: string): boolean {
  return COMPONENTS_CATALOG.some((item) => item.id === id)
}

export function getComponentsForSection(sectionId: string): ComponentCatalogItem[] {
  const leafIds = getCatalogLeafIds(COMPONENTS_CATALOG_TREE, sectionId)
  if (leafIds.length === 0) {
    return []
  }
  return COMPONENTS_CATALOG.filter((item) => leafIds.includes(item.sectionId))
}

export function getSectionLabel(sectionId: string): string {
  return findCatalogNodeById(COMPONENTS_CATALOG_TREE, sectionId)?.label ?? 'Комплектующие'
}

export function getComponentsForCatalogContext(contextId: string): ComponentCatalogItem[] {
  return COMPONENTS_CATALOG.filter((item) => item.relatedContexts.includes(contextId))
}

export function getComponentsForCatalogContexts(contextIds: string[]): ComponentCatalogItem[] {
  const seen = new Set<string>()
  const result: ComponentCatalogItem[] = []
  for (const item of COMPONENTS_CATALOG) {
    if (
      item.relatedContexts.some((ctx) => contextIds.includes(ctx)) &&
      !seen.has(item.id)
    ) {
      seen.add(item.id)
      result.push(item)
    }
  }
  return result
}

/** @deprecated используйте getComponentsForCatalogContext */
export function getComponentsForSeries(modelId: string): ComponentCatalogItem[] {
  return getComponentsForCatalogContext(modelId)
}

export function getComponentById(id: string): ComponentCatalogItem | undefined {
  return COMPONENTS_CATALOG.find((item) => item.id === id)
}

export function componentToCartItem(item: ComponentCatalogItem): Omit<CartItem, 'quantity'> {
  return {
    id: `component-${item.id}`,
    name: item.title,
    model: item.sku,
    sku: item.sku,
    price: item.price > 0 ? item.price : 1,
    image: PARTS_AND_COMPONENTS_IMAGE,
    href: `/components?id=${item.id}`,
  }
}

export function isOnRequestPrice(price: number): boolean {
  return price <= 0
}
