export const COMPONENT_PRODUCT_TAB_IDS = ['series', 'documents', 'delivery', 'payment'] as const

export type ComponentProductTabId = (typeof COMPONENT_PRODUCT_TAB_IDS)[number]

export const COMPONENT_PRODUCT_TABS: { id: ComponentProductTabId; label: string }[] = [
  { id: 'series', label: 'Описание серии' },
  { id: 'documents', label: 'Документы' },
  { id: 'delivery', label: 'Доставка' },
  { id: 'payment', label: 'Оплата' },
]

/** Текст вкладки «Описание серии» для цилиндров паровых */
export const COMPONENT_STEAM_CYLINDERS_SERIES_TEXT = [
  'Все увлажнители CAREL с погружными электродами имеют функциональное программное управление, которое автоматически подстраивает параметры работы в зависимости от характеристик воды. Тем не менее, добиться оптимального баланса срока службы цилиндра, регулировки паропроизводительности и скорости реагирования в зависимости от типа воды и электропитания можно только за счёт изменения формы и положения электродов.',
  'Для современных увлажнителей CAREL с погружными электродами выпускается широкий спектр цилиндров с разными электродами, для воды электропроводностью от 75 до 1250 мкС/см и производительностью от 1 до 65 кг/ч. Все цилиндры увлажнителей humiSteam комплектуются оцинкованными электродами и имеют фильтры, предотвращающие появление накипи на дне цилиндра, которая может ухудшить дренаж.',
] as const

export const COMPONENT_SERIES_TEXT_DEFAULT = [
  'Комплектующие CAREL подбираются под конкретную модель увлажнителя и условия эксплуатации. Уточните артикул оборудования — инженеры помогут с совместимостью и комплектацией.',
] as const

export {
  HUMISTEAM_DELIVERY_CONTENT as COMPONENT_DELIVERY_CONTENT,
  HUMISTEAM_DOCUMENTS_TEXT as COMPONENT_DOCUMENTS_TEXT,
  HUMISTEAM_PAYMENT_CONTENT as COMPONENT_PAYMENT_CONTENT,
} from '@/lib/humisteamProductTabs'
