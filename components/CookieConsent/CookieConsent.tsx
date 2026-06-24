'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_VERSION,
} from '@/lib/legal'

export default function CookieConsent() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      setVisible(false)
      return
    }

    const accepted = localStorage.getItem(COOKIE_CONSENT_KEY)
    setVisible(accepted !== COOKIE_CONSENT_VERSION)
  }, [pathname])

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, COOKIE_CONSENT_VERSION)
    setVisible(false)
  }

  if (!visible) {
    return null
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-[#232326]/10 bg-white p-4 shadow-[0_-4px_24px_rgba(35,35,38,0.12)] sm:p-5"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <p id="cookie-consent-title" className="text-sm font-semibold text-[#232326] sm:text-base">
            Мы используем cookie
          </p>
          <p
            id="cookie-consent-description"
            className="mt-1 text-sm leading-relaxed text-[#232326]/75"
          >
            Сайт использует файлы cookie и локальное хранилище для работы корзины и запоминания
            вашего выбора. Продолжая пользоваться сайтом, вы соглашаетесь с{' '}
            <Link href="/legal/cookie" className="text-[#E62614] hover:underline">
              политикой cookie
            </Link>{' '}
            и{' '}
            <Link href="/legal/personal-data" className="text-[#E62614] hover:underline">
              обработкой персональных данных
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-[5px] bg-[#E62614] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#E62614]/90 sm:text-base"
        >
          Принять
        </button>
      </div>
    </div>
  )
}
