'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HEADER_NAV_ITEMS, isHeaderNavItemActive } from './navConfig'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="hidden items-center gap-7 lg:flex">
      {HEADER_NAV_ITEMS.map((item) => {
        const isActive = isHeaderNavItemActive(pathname, item.href)
        const className = `text-sm font-medium transition-colors ${
          isActive ? 'text-[#E62614]' : 'text-white/85 hover:text-white'
        }`

        return (
          <Link key={item.href} href={item.href} className={className}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
