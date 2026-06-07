'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

type HeaderCartButtonProps = {
  onNavigate?: () => void
  className?: string
  showLabel?: boolean
}

function formatCartCount(count: number): string {
  if (count > 99) {
    return '99+'
  }
  return String(count)
}

export default function HeaderCartButton({
  onNavigate,
  className = '',
  showLabel = false,
}: HeaderCartButtonProps) {
  const pathname = usePathname()
  const { getTotalItems } = useCart()
  const count = getTotalItems()
  const isActive = pathname === '/cart'

  const ariaLabel =
    count > 0
      ? `Корзина, ${count} ${count === 1 ? 'товар' : count < 5 ? 'товара' : 'товаров'}`
      : 'Корзина'

  return (
    <Link
      href="/cart"
      onClick={onNavigate}
      className={`relative inline-flex items-center gap-2 text-white transition-colors hover:text-white/90 ${
        isActive ? 'text-[#E62614]' : ''
      } ${className}`}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="relative inline-flex h-10 w-10 items-center justify-center lg:h-6 lg:w-6">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          aria-hidden
        >
          <path
            d="M4 5H6.2L7.5 14.5H18.5L20 7.5H8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="18" r="1.25" fill="currentColor" />
          <circle cx="17" cy="18" r="1.25" fill="currentColor" />
        </svg>
        {count > 0 ? (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E62614] px-1 text-[10px] font-bold leading-none text-white"
            aria-hidden
          >
            {formatCartCount(count)}
          </span>
        ) : null}
      </span>
      {showLabel ? <span className="text-base font-medium">Корзина</span> : null}
    </Link>
  )
}
