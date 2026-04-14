'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { lockInternalNavOnHome } from '@/lib/siteFlags'

const NAVIGATION_ITEMS = [
  { href: '/catalog?category=humidifiers', label: 'Увлажнители' },
  { href: '/catalog?category=components', label: 'Комплектующие' },
  { href: '/catalog?category=parts', label: 'Запчасти' },
  { href: '/services', label: 'Услуги' },
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const navLocked = lockInternalNavOnHome && pathname === '/'

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Мобильное меню */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#2A2529] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Заголовок с кнопкой закрытия */}
          <div className="flex items-center justify-between p-4 border-b border-[#3B363C]">
            <span className="text-white font-semibold">Меню</span>
            <button
              onClick={onClose}
              className="text-white hover:text-[#E62614] transition-colors"
              aria-label="Закрыть меню"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Навигация */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = pathname === item.href
                const className = `block px-4 py-3 rounded-lg text-white transition-colors ${
                  isActive
                    ? 'bg-[#E62614] text-white font-semibold'
                    : 'hover:bg-[#3B363C] hover:text-[#E62614]'
                }`

                if (navLocked) {
                  return (
                    <li key={item.href}>
                      <span className={`${className} cursor-default opacity-80`}>{item.label}</span>
                    </li>
                  )
                }

                return (
                  <li key={item.href}>
                    <Link href={item.href} onClick={onClose} className={className}>
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
