export const HEADER_NAV_ITEMS = [
  { href: '/catalog', label: 'Увлажнители' },
  { href: '/components', label: 'Комплектующие' },
  { href: '/services', label: 'Услуги' },
] as const

export function isHeaderNavItemActive(pathname: string, href: string): boolean {
  if (href === '/services') {
    return pathname.startsWith('/services')
  }
  if (href === '/catalog') {
    return pathname.startsWith('/catalog')
  }
  if (href === '/components') {
    return pathname.startsWith('/components')
  }
  return pathname === href || pathname.startsWith(`${href}&`)
}
