import type { CatalogTreeNode } from '@/lib/catalogData'

/**
 * Дерево навигации каталога комплектующих (без миниатюр в сайдбаре).
 * Иерархия согласно утверждённому списку разделов.
 */
export const COMPONENTS_CATALOG_TREE: CatalogTreeNode[] = [
  {
    id: 'hydraulic',
    label: 'Гидравлические компоненты',
    children: [
      { id: 'steam-cylinders', label: 'Цилиндры паровые' },
      { id: 'drain-valves', label: 'Клапаны сливные и дренажные помпы' },
      { id: 'feed-valves', label: 'Клапаны питающие' },
      { id: 'pressure-regulators', label: 'Регуляторы давления' },
      { id: 'water-treatment-hyd', label: 'Водоподготовка' },
      { id: 'pumps', label: 'Насосы' },
      { id: 'manometers', label: 'Манометры' },
      { id: 'drain-cooling-kit', label: 'Комплект для охлаждения дренажа' },
      { id: 'air-water-lines', label: 'Линии воздушные и водяные' },
      { id: 'refill-tanks', label: 'Бачки заправки, коллекторы, переходники' },
    ],
  },
  {
    id: 'electronic',
    label: 'Электронные компоненты',
    children: [
      { id: 'heaters', label: 'Нагревательные элементы' },
      { id: 'displays', label: 'Дисплеи графические' },
      { id: 'controllers', label: 'Контроллеры, блоки управления' },
      { id: 'boards', label: 'Платы' },
      { id: 'coolers', label: 'Кулеры, вентиляторы' },
      { id: 'fuses', label: 'Предохранители' },
      { id: 'switching', label: 'Устройства коммутации' },
      { id: 'motors', label: 'Электродвигатели' },
      { id: 'relays', label: 'Реле, выключатели' },
      { id: 'transformers', label: 'Трансформаторы' },
    ],
  },
  {
    id: 'accessories',
    label: 'Комплектующие',
    children: [
      { id: 'tubes', label: 'Трубки' },
      { id: 'fittings', label: 'Фитинги' },
      { id: 'steam-distributors', label: 'Распределители пара' },
      { id: 'nozzles', label: 'Форсунки, распределители' },
      { id: 'cylinder-accessories', label: 'Аксессуары для цилиндров' },
      { id: 'seals', label: 'Уплотнительные элементы' },
      { id: 'body-parts', label: 'Элементы корпуса, крепеж' },
      { id: 'filters', label: 'Фильтры' },
      { id: 'special', label: 'Специальное исполнение' },
      { id: 'mist-eliminators', label: 'Каплеуловители' },
    ],
  },
  {
    id: 'sensors',
    label: 'Датчики',
    children: [
      { id: 'th-sensors', label: 'Датчики температуры и влажности' },
      { id: 'level-conductivity-sensors', label: 'Датчики уровня и электропроводности' },
      { id: 'other-sensors', label: 'Прочие датчики' },
    ],
  },
]

export const COMPONENTS_DEFAULT_SECTION_ID = 'steam-cylinders'
