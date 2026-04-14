'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { lockInternalNavOnHome } from '@/lib/siteFlags'

const NAVIGATION_ITEMS = [
  { href: '/catalog?category=humidifiers', label: 'Увлажнители' },
  { href: '/catalog?category=components', label: 'Комплектующие' },
  { href: '/catalog?category=parts', label: 'Запчасти' },
  { href: '/services', label: 'Услуги' },
]

export default function Navigation() {
  const pathname = usePathname()
  const navLocked = lockInternalNavOnHome && pathname === '/'

  return (
    <nav className="hidden lg:flex items-center gap-7">
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = pathname === item.href
        const className = `text-sm font-medium transition-colors ${
          isActive ? 'text-[#E62614]' : 'text-white/85 hover:text-white'
        }`

        if (navLocked) {
          return (
            <span key={item.href} className={`${className} cursor-default opacity-70`}>
              {item.label}
            </span>
          )
        }

        return (
          <Link key={item.href} href={item.href} className={className}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

