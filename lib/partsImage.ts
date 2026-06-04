/** Единое изображение для комплектующих и запчастей (public/images/parts.png) */
export const PARTS_AND_COMPONENTS_IMAGE = '/images/parts.png'

export const PARTS_AND_COMPONENTS_GALLERY = [PARTS_AND_COMPONENTS_IMAGE] as const

export function isComponentCartItemId(cartItemId: string): boolean {
  return cartItemId.startsWith('component-')
}
