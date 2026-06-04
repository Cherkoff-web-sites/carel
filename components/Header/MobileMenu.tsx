'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { lockInternalNavOnHome } from '@/lib/siteFlags'
import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'
import HeaderCartButton from '@/components/Header/HeaderCartButton'
import { HEADER_NAV_ITEMS, isHeaderNavItemActive } from './navConfig'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const navLocked = lockInternalNavOnHome && pathname === '/'

  useEffect(() => {
    if (!isOpen) {
      return
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[55] bg-black/60 lg:hidden"
        onClick={onClose}
        aria-label="Закрыть меню"
      />

      <div className="fixed inset-0 z-[60] flex flex-col bg-[#232326] lg:hidden">
        <div className="container flex h-[82px] shrink-0 items-center justify-between border-b border-white/10">
          <Link href="/" onClick={onClose} className="flex shrink-0 items-center">
            <Image
              src="/images/header/logo-carel-works.svg"
              alt="CAREL Works"
              width={146}
              height={52}
              className="h-10 w-auto"
            />
          </Link>
          <div className="flex items-center gap-1">
            <HeaderCartButton onNavigate={onClose} />
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:text-white/80"
              aria-label="Закрыть меню"
            >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            </button>
          </div>
        </div>

        <nav className="container flex flex-1 flex-col overflow-y-auto py-6">
          <ul className="space-y-1">
            {HEADER_NAV_ITEMS.map((item) => {
              const isActive = isHeaderNavItemActive(pathname, item.href)
              const className = `block rounded-[5px] px-4 py-3.5 text-base font-medium transition-colors ${
                isActive
                  ? 'bg-[#E62614] text-white'
                  : 'text-white/90 hover:bg-white/5 hover:text-white'
              }`

              if (navLocked) {
                return (
                  <li key={item.href}>
                    <span className={`${className} cursor-default opacity-70`}>
                      {item.label}
                    </span>
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

          <div className="mt-auto space-y-4 border-t border-white/10 pt-6">
            <HeaderCartButton
              onNavigate={onClose}
              showLabel
              className="w-full rounded-[5px] px-4 py-3 hover:bg-white/5"
            />

            <a
              href="tel:+79295385634"
              className="flex items-center gap-3 rounded-[5px] px-4 py-3 text-white/95 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Image src="/images/header/icon-phone.svg" alt="" width={20} height={20} />
              <span className="text-base font-medium">8 (929) 538-56-34</span>
            </a>

            {navLocked ? (
              <span className="flex cursor-default items-center gap-3 rounded-[5px] px-4 py-3 text-white/70">
                <span className="flex items-center gap-2.5">
                  <Image
                    src="/images/header/icon-thermometer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  <Image src="/images/header/icon-drop.svg" alt="" width={20} height={20} />
                </span>
                <span className="text-base font-medium">Контакты</span>
              </span>
            ) : (
              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center gap-3 rounded-[5px] px-4 py-3 text-white/95 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span className="flex items-center gap-2.5">
                  <Image
                    src="/images/header/icon-thermometer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  <Image src="/images/header/icon-drop.svg" alt="" width={20} height={20} />
                </span>
                <span className="text-base font-medium">Контакты</span>
              </Link>
            )}

            <ContactModalTrigger
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-[5px] bg-white px-7 py-3.5 text-base font-semibold text-[#E62614] transition-colors hover:bg-white/90"
            >
              Перезвоните мне
            </ContactModalTrigger>
          </div>
        </nav>
      </div>
    </>
  )
}
