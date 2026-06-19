'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE_NAME } from '@/lib/constants'

const NAV = [
  {
    title: 'Заявки',
    items: [
      { href: '/admin/leads/contact', label: 'Обратная связь' },
      { href: '/admin/leads/orders', label: 'Заказы' },
    ],
  },
  {
    title: 'Каталог',
    items: [
      { href: '/admin/catalog/humidifiers', label: 'Увлажнители' },
      { href: '/admin/catalog/components', label: 'Запчасти' },
    ],
  },
] as const

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-[#2a2a2e] bg-[#1e1e22] text-white">
      <div className="border-b border-[#2a2a2e] px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Админ-панель</p>
        <p className="mt-1 text-base font-bold leading-tight">{SITE_NAME}</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-[#E62614] text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[#2a2a2e] p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
        >
          <span aria-hidden>←</span>
          На сайт
        </Link>
      </div>
    </aside>
  )
}
