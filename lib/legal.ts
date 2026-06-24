export const SITE_URL = 'https://carel-prof-service.ru'

export const LEGAL_OPERATOR_NAME = 'CAREL Professional Service'
export const LEGAL_EMAIL = 'servicecarel@yandex.ru'
export const LEGAL_PHONE = '8 (929) 538-56-34'
export const LEGAL_ADDRESS =
  '115404, г. Москва, ул. Касимовская, вл. 26, пом. 406'

export const COOKIE_CONSENT_KEY = 'carel_cookie_consent'
export const COOKIE_CONSENT_VERSION = '1'

export type LegalSection = {
  id: string
  title: string
  paragraphs: string[]
  list?: string[]
}

export type LegalDocument = {
  title: string
  description: string
  updatedAt: string
  sections: LegalSection[]
}
