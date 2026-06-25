/** Общие поля карточки товара в JSON (хранятся в data_json) */
export type CatalogProductMetaFields = {
  published: boolean
  showPriceOnSite: boolean
  fullDescription: string
  metaTitle: string
  metaDescription: string
}

type ProductWithDescription = {
  description: string
  price: number
} & Partial<CatalogProductMetaFields & { fullDescription: string }>

export function withCatalogProductDefaults<T extends ProductWithDescription>(
  product: T
): T & CatalogProductMetaFields {
  return {
    ...product,
    published: product.published ?? true,
    showPriceOnSite: product.showPriceOnSite ?? false,
    fullDescription: product.fullDescription ?? product.description,
    metaTitle: product.metaTitle ?? '',
    metaDescription: product.metaDescription ?? '',
  }
}

export function formatSitePrice(price: number, showPriceOnSite: boolean): string {
  if (!showPriceOnSite || price <= 0) {
    return 'по запросу'
  }
  return `${price.toLocaleString('ru-RU')} ₽`
}

export type PublicPriceFields = {
  price?: number
  priceOnRequest?: boolean
}

/** Публичный ответ API: без внутренних флагов, цена — только если разрешена к показу */
export function toPublicCatalogProduct<T extends ProductWithDescription>(
  product: T
): Omit<T, keyof CatalogProductMetaFields | 'price'> & PublicPriceFields {
  const normalized = withCatalogProductDefaults(product)
  const { published: _p, showPriceOnSite, metaTitle: _t, metaDescription: _d, price, ...rest } =
    normalized

  const priceOnRequest = !showPriceOnSite || price <= 0

  if (priceOnRequest) {
    return { ...rest, priceOnRequest: true } as Omit<T, keyof CatalogProductMetaFields | 'price'> &
      PublicPriceFields
  }

  return { ...rest, price, priceOnRequest: false } as Omit<
    T,
    keyof CatalogProductMetaFields | 'price'
  > &
    PublicPriceFields
}

export function formatPublicSitePrice(product: PublicPriceFields): string {
  if (product.priceOnRequest !== false) {
    return 'по запросу'
  }
  if (product.price === undefined || product.price <= 0) {
    return 'по запросу'
  }
  return `${product.price.toLocaleString('ru-RU')} ₽`
}

export function getEffectiveCartPrice(product: PublicPriceFields): number {
  if (product.priceOnRequest !== false) {
    return 0
  }
  if (product.price === undefined || product.price <= 0) {
    return 0
  }
  return product.price
}
