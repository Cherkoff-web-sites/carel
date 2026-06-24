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
      className={`relative transition-colors hover:text-white ${
        showLabel
          ? 'flex w-full items-center gap-3 text-white/95 hover:text-white'
          : 'inline-flex items-center gap-2 text-white hover:text-white/90'
      } ${isActive ? 'text-[#E62614]' : ''} ${className}`}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
    >
      <span
        className={`relative inline-flex shrink-0 items-center justify-center ${
          showLabel ? 'h-5 w-5' : 'h-10 w-10 lg:h-6 lg:w-6'
        }`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={showLabel ? 'h-5 w-5' : 'h-6 w-6'}
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
            className={`absolute flex items-center justify-center rounded-full bg-[#E62614] font-bold leading-none text-white ${
              showLabel
                ? '-right-1.5 -top-1.5 h-4 min-w-4 px-0.5 text-[9px]'
                : '-right-0.5 -top-0.5 h-[18px] min-w-[18px] px-1 text-[10px] lg:-right-2 lg:-top-2 lg:h-4 lg:min-w-4 lg:px-0.5 lg:text-[9px]'
            }`}
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
