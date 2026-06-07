// Константы проекта

export const SITE_NAME = 'CAREL Professional Service'
export const SITE_DESCRIPTION = 'Профессиональный сервис увлажнителей и комплектующих CAREL'

/** Высота fixed-шапки: mobile 72px, tablet 102px, desktop 103px */
export const HEADER_HEIGHT = {
  mobile: 72,
  tablet: 102,
  desktop: 103,
} as const

/** Верхний отступ страницы под fixed-шапку */
export const HEADER_OFFSET_CLASS =
  'pt-[72px] md:pt-[102px] lg:pt-[103px]' as const

/** scroll-margin для якорных ссылок под fixed-шапку */
export const HEADER_SCROLL_MARGIN_CLASS =
  'scroll-mt-[72px] md:scroll-mt-[102px] lg:scroll-mt-[103px]' as const

export const CONTACTS_ANCHOR_ID = 'contacts'
export const CONTACTS_HREF = `#${CONTACTS_ANCHOR_ID}`

export const NAVIGATION_ITEMS = [
  { href: '/', label: 'Главная' },
  { href: '/about', label: 'О компании' },
  { href: CONTACTS_HREF, label: 'Контакты' },
  { href: '/catalog', label: 'Каталог' },
] as const

