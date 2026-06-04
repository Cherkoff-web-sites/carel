'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { lockInternalNavOnHome } from '@/lib/siteFlags'
import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'
import HeaderCartButton from '@/components/Header/HeaderCartButton'
import Navigation from './Navigation'
import MobileMenu from './MobileMenu'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const navLocked = lockInternalNavOnHome && pathname === '/'

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 bg-[#232326] border-b border-white/10">
        <div className="container">
          <div className="flex items-center justify-between h-[82px]">
            {/* Логотип */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/images/header/logo-carel-works.svg"
                alt="CAREL Works"
                width={146}
                height={52}
                className="h-10 w-auto md:h-12"
                priority
              />
            </Link>

            {/* Десктопная навигация */}
            <Navigation />

            {/* Правая часть - Контакты и бургер */}
            <div className="flex items-center gap-2 sm:gap-3">
              <HeaderCartButton className="shrink-0" />

              <div className="hidden lg:flex flex-col items-end gap-2 text-xs text-white/95">
                <a href="tel:+79295385634" className="inline-flex items-center gap-2 hover:text-white">
                  <Image src="/images/header/icon-phone.svg" alt="" width={16} height={16} />
                  <span>8 (929) 538-56-34</span>
                </a>
                <div className="flex items-center gap-6">
                  {navLocked ? (
                    <span className="inline-flex cursor-default items-center gap-2.5 text-white/85">
                      <Image src="/images/header/icon-thermometer.svg" alt="" width={16} height={16} />
                      <Image src="/images/header/icon-drop.svg" alt="" width={16} height={16} />
                      <span>Контакты</span>
                    </span>
                  ) : (
                    <Link href="/contact" className="inline-flex items-center gap-2.5 hover:text-white">
                      <Image src="/images/header/icon-thermometer.svg" alt="" width={16} height={16} />
                      <Image src="/images/header/icon-drop.svg" alt="" width={16} height={16} />
                      <span>Контакты</span>
                    </Link>
                  )}
                  <ContactModalTrigger className="inline-flex items-center rounded-[5px] bg-white px-7 py-2.5 text-[13px] font-semibold text-[#E62614] transition-colors hover:bg-white/90">
                    Перезвоните мне
                  </ContactModalTrigger>
                </div>
              </div>

              {/* Бургер меню (только на мобильных) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 text-white hover:text-white/80 transition-colors"
                aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={isMobileMenuOpen}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <path
                    d="M12 16L36 16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 24L36 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 32L36 32"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Мобильное меню */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}

