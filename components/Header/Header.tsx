'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { lockInternalNavOnHome } from '@/lib/siteFlags'
import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'
import HeaderCartButton from '@/components/Header/HeaderCartButton'
import Navigation from './Navigation'
import MobileMenu from './MobileMenu'

const HEADER_HEIGHT_PX = 114

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)
  const pathname = usePathname()
  const navLocked = lockInternalNavOnHome && pathname === '/'

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const onScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY <= 0) {
        setIsHidden(false)
      } else if (currentScrollY < lastScrollY.current) {
        setIsHidden(false)
      } else if (
        currentScrollY > lastScrollY.current &&
        currentScrollY > HEADER_HEIGHT_PX
      ) {
        setIsHidden(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-[#232326] border-b border-white/10 will-change-transform ${
          isHidden
            ? '-translate-y-full transition-transform duration-300 ease-in-out'
            : 'translate-y-0 transition-transform duration-150 ease-out'
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between py-4">
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
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
              <HeaderCartButton className="shrink-0" />

              <div className="hidden lg:flex items-center gap-6 text-xs text-white/95">
                {navLocked ? (
                  <span className="inline-flex cursor-default items-center gap-2.5 text-white/85">
                    <Image
                      src="/images/header/icon-thermometer.svg"
                      alt=""
                      width={26}
                      height={26}
                      className="h-auto w-[26px]"
                    />
                    <Image
                      src="/images/header/icon-drop.svg"
                      alt=""
                      width={26}
                      height={26}
                      className="h-auto w-[26px]"
                    />
                    <span>Контакты</span>
                  </span>
                ) : (
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2.5 hover:text-white"
                  >
                    <Image
                      src="/images/header/icon-thermometer.svg"
                      alt=""
                      width={26}
                      height={26}
                      className="h-auto w-[26px]"
                    />
                    <Image
                      src="/images/header/icon-drop.svg"
                      alt=""
                      width={26}
                      height={26}
                      className="h-auto w-[26px]"
                    />
                    <span>Контакты</span>
                  </Link>
                )}

                <div className="flex flex-col items-end gap-2">
                  <a
                    href="tel:+79295385634"
                    className="inline-flex items-center gap-2 hover:text-white"
                  >
                    <Image
                      src="/images/header/icon-phone.svg"
                      alt=""
                      width={26}
                      height={26}
                      className="h-auto w-[26px]"
                    />
                    <span>8 (929) 538-56-34</span>
                  </a>
                  <ContactModalTrigger className="inline-flex items-center rounded-[5px] bg-white px-7 py-2.5 text-[13px] font-semibold text-[#E62614] transition-colors hover:bg-white/90">
                    Перезвоните мне
                  </ContactModalTrigger>
                </div>
              </div>

              {/* Бургер меню (только на мобильных) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex h-[45px] w-[45px] items-center justify-center text-white transition-colors hover:text-white/80"
                aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={isMobileMenuOpen}
              >
                <svg
                  width={45}
                  height={45}
                  viewBox="0 0 45 45"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M7.03125 14.0625H37.9687M7.03125 22.5H37.9687M7.03125 30.9375H37.9687"
                    stroke="#F8F8F8"
                    strokeWidth={2}
                    strokeMiterlimit={10}
                    strokeLinecap="round"
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

