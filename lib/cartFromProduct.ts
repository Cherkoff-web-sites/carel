import type { CartItem } from '@/contexts/CartContext'
import { getEffectiveCartPrice, type PublicPriceFields } from '@/lib/catalogProductMeta'
import type { HeaterSteamProduct } from '@/lib/heatersteamData'
import type { HumiSteamProduct } from '@/lib/humisteamData'

function formatPerformanceKgH(kgH: number): string {
  return kgH.toString().replace('.', ',')
}

export function humisteamToCartItem(
  product: HumiSteamProduct & PublicPriceFields
): Omit<CartItem, 'quantity'> {
  const cylinderType = product.description.includes('Разборный')
    ? 'Разборный'
    : 'Неразборный (одноразовый)'

  return {
    id: product.id,
    name: `Увлажнитель Carel ${product.sku}`,
    sku: product.sku,
    cylinderType,
    dimensions: '712×365×275 мм',
    performance: `${formatPerformanceKgH(product.performanceKgH)} кг/ч пара`,
    price: getEffectiveCartPrice(product),
    image: product.image,
    href: `/catalog?id=humisteam&sku=${product.sku}`,
  }
}

export function heatersteamToCartItem(
  product: HeaterSteamProduct & PublicPriceFields
): Omit<CartItem, 'quantity'> {
  const cylinderType = product.description.includes('Разборный')
    ? 'Разборный'
    : 'Неразборный (одноразовый)'

  return {
    id: product.id,
    name: `Увлажнитель Carel ${product.sku}`,
    sku: product.sku,
    cylinderType,
    dimensions: '712×365×275 мм',
    performance: `${formatPerformanceKgH(product.performanceKgH)} кг/ч пара`,
    price: getEffectiveCartPrice(product),
    image: product.image,
    href: `/catalog?id=heatersteam&sku=${product.sku}`,
  }
}
