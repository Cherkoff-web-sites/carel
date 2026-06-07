'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type SectionSubNavMatchRule =
  | { type: 'exact' }
  | { type: 'prefix'; prefix: string }
  | { type: 'never' }

export type SectionSubNavItem = {
  href: string
  label: string
  matchRule: SectionSubNavMatchRule
}

function isItemActive(pathname: string, item: SectionSubNavItem): boolean {
  switch (item.matchRule.type) {
    case 'exact':
      return pathname === item.href.split('#')[0]
    case 'prefix':
      return pathname.startsWith(item.matchRule.prefix)
    case 'never':
      return false
  }
}

type SectionSubNavProps = {
  items: readonly SectionSubNavItem[]
  ariaLabel?: string
}

export default function SectionSubNav({
  items,
  ariaLabel = 'Разделы сайта',
}: SectionSubNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className="bg-transparent pt-[50px] pb-[40px] lg:pt-[80px]"
      aria-label={ariaLabel}
    >
      <div className="container">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm sm:gap-x-10 sm:text-base">
          {items.map((item) => {
            const isActive = isItemActive(pathname, item)
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={
                    isActive
                      ? 'font-medium text-[#E62614]'
                      : 'text-[#232326]/70 transition-colors hover:text-[#232326]'
                  }
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
