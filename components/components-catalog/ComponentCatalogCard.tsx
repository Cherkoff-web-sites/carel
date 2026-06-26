'use client'

import type { MouseEvent } from 'react'
import Image from 'next/image'
import { useState } from 'react'
import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'
import { useCart } from '@/contexts/CartContext'
import {
  componentToCartItem,
  type ComponentCatalogItem,
} from '@/lib/componentsCatalogData'
import { getComponentProductTitle } from '@/lib/componentProductSpecs'
import { formatPublicSitePrice, type PublicPriceFields } from '@/lib/catalogProductMeta'

function CartIcon() {
  return (
    <svg
      width="22"
      height="24"
      viewBox="0 0 22 24"
      fill="none"
      className="h-5 w-[22px] shrink-0"
      aria-hidden
    >
      <path
        d="M17 18C17.5304 18 18.0391 18.2107 18.4142 18.5858C18.7893 18.9609 19 19.4696 19 20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22C16.4696 22 15.9609 21.7893 15.5858 21.4142C15.2107 21.0391 15 20.5304 15 20C15 18.89 15.89 18 17 18ZM1 2H4.27L5.21 4H20C20.2652 4 20.5196 4.10536 20.7071 4.29289C20.8946 4.48043 21 4.73478 21 5C21 5.17 20.95 5.34 20.88 5.5L17.3 11.97C16.96 12.58 16.3 13 15.55 13H8.1L7.2 14.63L7.17 14.75C7.17 14.8163 7.19634 14.8799 7.24322 14.9268C7.29011 14.9737 7.3537 15 7.42 15H19V17H7C6.46957 17 5.96086 16.7893 5.58579 16.4142C5.21071 16.0391 5 15.5304 5 15C5 14.65 5.09 14.32 5.24 14.04L6.6 11.59L3 4H1V2ZM7 18C7.53043 18 8.03914 18.2107 8.41421 18.5858C8.78929 18.9609 9 19.4696 9 20C9 20.5304 8.78929 21.0391 8.41421 21.4142C8.03914 21.7893 7.53043 22 7 22C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20C5 18.89 5.89 18 7 18ZM16 11L18.78 6H6.14L8.5 11H16Z"
        fill="currentColor"
      />
    </svg>
  )
}

type ComponentCatalogCardProps = {
  item: ComponentCatalogItem & PublicPriceFields
  onOpen?: (item: ComponentCatalogItem & PublicPriceFields) => void
}

export default function ComponentCatalogCard({ item, onOpen }: ComponentCatalogCardProps) {
  const { addItem } = useCart()
  const [imageError, setImageError] = useState(false)
  const title = getComponentProductTitle(item)

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    addItem(componentToCartItem(item))
  }

  const openDetail = () => onOpen?.(item)

  return (
    <article className="flex h-full flex-col border border-[#232326]/12 bg-white">
      <button
        type="button"
        onClick={openDetail}
        className="flex flex-1 flex-col text-left transition-opacity hover:opacity-90"
      >
      <div className="relative aspect-[4/3] w-full bg-white">
        {!imageError ? (
          <Image
            src={item.image}
            alt={title}
            fill
            className="object-contain p-4 sm:p-5"
            sizes="(max-width: 640px) 100vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-sm text-[#232326]/40">
            Нет изображения
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pt-2 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#232326]/45">{item.sku}</p>
        <p className="mt-1 text-base font-bold text-[#232326] sm:text-lg">{title}</p>
        <p className="mt-1.5 flex-1 text-sm leading-snug text-[#232326]/80 sm:text-base">
          {item.description}
        </p>
      </div>
      </button>

        <div className="mt-4 flex items-stretch gap-2 px-4 pb-4 sm:px-5 sm:pb-5">
          <ContactModalTrigger className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-[5px] border border-[#232326]/20 bg-white px-3 text-sm font-medium text-[#232326]/85 transition-colors hover:border-[#232326]/35 hover:text-[#232326] sm:text-base">
            {formatPublicSitePrice(item)}
          </ContactModalTrigger>
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex h-[44px] w-[52px] shrink-0 items-center justify-center rounded-[5px] border border-[#232326]/20 bg-white text-[#232326]/75 transition-colors hover:border-[#E62614]/40 hover:text-[#E62614]"
            aria-label={`Добавить ${item.sku} в корзину`}
          >
            <CartIcon />
          </button>
        </div>
    </article>
  )
}
