import { HUMISTEAM_DELIVERY_CONTENT, HUMISTEAM_PAYMENT_CONTENT } from '@/lib/humisteamProductTabs'

export const SHARED_TABS_KEY = 'catalog_shared_tabs'

export type SharedTabsData = {
  deliveryText: string
  paymentText: string
}

function deliveryToText(): string {
  const { moscow, russia } = HUMISTEAM_DELIVERY_CONTENT
  const lines = [
    moscow.title,
    `${moscow.rates[0].bold}${moscow.rates[0].text}`,
    `${moscow.rates[1].text}${moscow.rates[1].boldEnd}`,
    `${moscow.schedule.days} ${moscow.schedule.hours}`,
    moscow.driverNote,
    `${moscow.outsideMkad.text}${moscow.outsideMkad.bold}`,
    moscow.lifting.title,
    ...moscow.lifting.items,
    '',
    russia.title,
    russia.subtitle,
    ...russia.rates,
    russia.closing,
  ]
  return lines.join('\n')
}

function paymentToText(): string {
  const { individuals, legal } = HUMISTEAM_PAYMENT_CONTENT
  return [
    individuals.title,
    individuals.intro,
    ...individuals.methods,
    '',
    legal.title,
    legal.text,
  ].join('\n')
}

export function getDefaultSharedTabs(): SharedTabsData {
  return {
    deliveryText: deliveryToText(),
    paymentText: paymentToText(),
  }
}
