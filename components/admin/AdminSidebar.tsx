'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { SITE_NAME } from '@/lib/constants'
import { ChevronLeftIcon } from '@/components/ui/ChevronIcon'

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
  {
    title: 'Система',
    items: [{ href: '/admin/settings', label: 'Настройки' }],
  },
] as const

type AdminSidebarProps = {
  open: boolean
  onClose: () => void
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    onClose()
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[205] bg-black/50 lg:hidden"
          aria-label="Закрыть меню"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-[210] flex w-[min(288px,88vw)] shrink-0 flex-col border-r border-[#2a2a2e] bg-[#1e1e22] text-white transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-[260px] lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-start justify-between border-b border-[#2a2a2e] px-4 py-4 sm:px-5 sm:py-5">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Админ-панель</p>
            <p className="mt-1 text-sm font-bold leading-tight sm:text-base">{SITE_NAME}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-white/70 hover:bg-white/10 lg:hidden"
            aria-label="Закрыть меню"
          >
            <CloseIcon />
          </button>
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
                        onClick={onClose}
                        className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
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

        <div className="space-y-2 border-t border-[#2a2a2e] p-4">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ChevronLeftIcon className="h-4 w-4 shrink-0 text-white/70" />
            На сайт
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-white/50 transition-colors hover:text-white"
          >
            Выйти
          </button>
        </div>
      </aside>
    </>
  )
}
