'use client'

import type { MouseEvent } from 'react'
import Image from 'next/image'
import CatalogBuyButton from '@/components/catalog/CatalogBuyButton'
import { useCart } from '@/contexts/CartContext'
import type { CartItem } from '@/contexts/CartContext'
import type { CatalogListProduct } from '@/lib/catalogListProduct'

type CatalogProductRowProps<T extends CatalogListProduct> = {
  product: T
  onOpen: (product: T) => void
  toCartItem: (product: T) => Omit<CartItem, 'quantity'>
}

export default function CatalogProductRow<T extends CatalogListProduct>({
  product,
  onOpen,
  toCartItem,
}: CatalogProductRowProps<T>) {
  const { addItem } = useCart()

  const handleBuy = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    addItem(toCartItem(product))
  }

  return (
    <article className="flex flex-col gap-4 rounded-[5px] bg-[#e8e6e1]/60 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="flex min-w-0 flex-1 cursor-pointer flex-col gap-4 text-left transition-opacity hover:opacity-90 sm:flex-row sm:items-center sm:gap-6"
      >
        <div className="relative mx-auto h-28 w-28 shrink-0 sm:mx-0 sm:h-32 sm:w-32">
          <Image
            src={product.image}
            alt=""
            fill
            className="object-contain"
            sizes="128px"
          />
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-[#232326] sm:text-lg">{product.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-[#232326]/75 sm:text-base">
            {product.description}
          </p>
        </div>
      </button>

      <CatalogBuyButton onClick={handleBuy} className="self-center sm:self-auto" />
    </article>
  )
}
