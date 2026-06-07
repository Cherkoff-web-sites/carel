'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CONTACTS_HREF } from '@/lib/constants'
import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'
import HeaderCartButton from '@/components/Header/HeaderCartButton'
import Navigation from './Navigation'
import MobileMenu from './MobileMenu'

const SCROLL_THRESHOLD = 12

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileHeaderActive, setIsMobileHeaderActive] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
      setIsMobileHeaderActive(false)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isTranslucent =
    isScrolled && !isMobileMenuOpen && !isMobileHeaderActive

  const handleHeaderClick = () => {
    if (window.matchMedia('(max-width: 1023px)').matches && isScrolled) {
      setIsMobileHeaderActive(true)
    }
  }

  return (
    <>
      <header
        onClick={handleHeaderClick}
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
          isTranslucent
            ? 'border-white/5 bg-[#232326]/80 lg:hover:border-white/10 lg:hover:bg-[#232326]'
            : 'border-white/10 bg-[#232326]'
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
                className="h-8 w-auto md:h-12"
                priority
              />
            </Link>

            {/* Десктопная навигация */}
            <Navigation />

            {/* Правая часть - Контакты и бургер */}
            <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
              <HeaderCartButton className="shrink-0" />

              <div className="hidden items-center gap-4 text-xs text-white/95 md:flex lg:gap-6">
                <a
                  href={CONTACTS_HREF}
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
                </a>

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
                className="lg:hidden flex h-10 w-10 items-center justify-center text-white transition-colors hover:text-white/80"
                aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={isMobileMenuOpen}
              >
                <svg
                  width={24}
                  height={24}
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

