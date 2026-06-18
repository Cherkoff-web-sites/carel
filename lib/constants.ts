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

export const SITE_PHONE = '+79295385634'
export const SITE_PHONE_DISPLAY = '8 (929) 538-56-34'

export const ENGINEER_CALL_CTA_LABEL = 'Позвонить инженеру'

export type ContactModalView = 'form' | 'call'

