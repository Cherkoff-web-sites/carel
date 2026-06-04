import type { CatalogCategoryId } from '@/lib/catalogData'

export const CATALOG_OVERVIEW_INTRO =
  'Выберите тип оборудования — откроется список серий и моделей. Далее можно перейти к характеристикам и карточке товара.'

export const CATALOG_CATEGORY_INTRO: Record<CatalogCategoryId, string> = {
  isothermal:
    'Паровые увлажнители с различными способами подготовки пара. Выберите серию, чтобы увидеть модели и производительность.',
  adiabatic:
    'Адиабатические системы увлажнения и охлаждения. Каждый пункт — отдельная линейка оборудования CAREL.',
  'evaporative-cooling':
    'Испарительное охлаждение для снижения температуры воздуха с контролем энергопотребления.',
  'water-treatment':
    'Водоподготовка для увлажнительных и климатических систем.',
}

/** Краткое описание серии / позиции в списке категории */
export const CATALOG_SERIES_SUMMARY: Partial<Record<string, string>> = {
  humisteam:
    'Паровые увлажнители с погружными электродами: Basic (UE*Y), X-Plus (UE*X), Wellness (UE*W) — от 1 до 130 кг/ч',
  heatersteam: 'Увлажнители с электронагревателем — process, titanium',
  compactsteam: 'Компактные паровые увлажнители — duct, room',
  'humisonic-compact': 'Ультразвуковое увлажнение, компактное исполнение',
  'humisonic-ventilation': 'Ультразвуковые увлажнители для вентиляции',
  'humisonic-direct': 'Прямое ультразвуковое увлажнение',
  humidisk: 'Дисковые увлажнители',
  humifog: 'Системы увлажнения высокого давления',
  'humifog-direct': 'humiFog direct',
  chillbooster: 'Испарительное охлаждение chillBooster',
  optimist: 'Система optiMist',
  wts: 'Комплекс водоподготовки WTS',
}
