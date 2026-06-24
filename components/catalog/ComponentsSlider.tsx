'use client'

import type { MouseEvent } from 'react'
import Image from 'next/image'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useCart } from '@/contexts/CartContext'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/ChevronIcon'
import {
  componentToCartItem,
  type ComponentCatalogItem,
} from '@/lib/componentsCatalogData'

import 'swiper/css'
import 'swiper/css/navigation'

type ComponentsSliderProps = {
  items: ComponentCatalogItem[]
  onOpenItem?: (item: ComponentCatalogItem) => void
}

function CartIconRed() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 22 24"
      fill="none"
      className="h-[18px] w-[18px] shrink-0"
      aria-hidden
    >
      <path
        d="M17 18C17.5304 18 18.0391 18.2107 18.4142 18.5858C18.7893 18.9609 19 19.4696 19 20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22C16.4696 22 15.9609 21.7893 15.5858 21.4142C15.2107 21.0391 15 20.5304 15 20C15 18.89 15.89 18 17 18ZM1 2H4.27L5.21 4H20C20.2652 4 20.5196 4.10536 20.7071 4.29289C20.8946 4.48043 21 4.73478 21 5C21 5.17 20.95 5.34 20.88 5.5L17.3 11.97C16.96 12.58 16.3 13 15.55 13H8.1L7.2 14.63L7.17 14.75C7.17 14.8163 7.19634 14.8799 7.24322 14.9268C7.29011 14.9737 7.3537 15 7.42 15H19V17H7C6.46957 17 5.96086 16.7893 5.58579 16.4142C5.21071 16.0391 5 15.5304 5 15C5 14.65 5.09 14.32 5.24 14.04L6.6 11.59L3 4H1V2ZM7 18C7.53043 18 8.03914 18.2107 8.41421 18.5858C8.78929 18.9609 9 19.4696 9 20C9 20.5304 8.78929 21.0391 8.41421 21.4142C8.03914 21.7893 7.53043 22 7 22C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20C5 18.89 5.89 18 7 18ZM16 11L18.78 6H6.14L8.5 11H16Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ComponentCard({
  item,
  onOpenItem,
}: {
  item: ComponentCatalogItem
  onOpenItem?: (item: ComponentCatalogItem) => void
}) {
  const { addItem } = useCart()

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    addItem(componentToCartItem(item))
  }

  const handleOpen = () => {
    onOpenItem?.(item)
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[5px] border border-[#232326]/12 bg-white">
      <button
        type="button"
        onClick={handleOpen}
        className="flex flex-1 flex-col text-left transition-opacity hover:opacity-90"
      >
        <div className="relative aspect-square w-full bg-white">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-contain p-4 sm:p-5"
            sizes="(max-width: 640px) 70vw, 25vw"
          />
        </div>
        <div className="flex flex-1 flex-col px-3 pb-3 pt-2 sm:px-4">
          <p className="text-sm font-bold text-[#232326] sm:text-base">{item.sku}</p>
          <p className="mt-1 text-sm leading-snug text-[#232326]/80 sm:text-base">
            {item.description}
          </p>
        </div>
      </button>

      <div className="flex justify-center px-3 pb-4 sm:px-4 sm:pb-5">
        <button
          type="button"
          onClick={handleAddToCart}
          className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-[#E62614] bg-white px-4 py-2 text-sm font-medium text-[#E62614] transition-colors hover:bg-[#E62614]/5 sm:text-base"
        >
          <CartIconRed />
          В корзину
        </button>
      </div>
    </article>
  )
}

export default function ComponentsSlider({ items, onOpenItem }: ComponentsSliderProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="components-slider mt-10 border-t border-[#232326]/10 pt-8 sm:mt-12 sm:pt-10">
      <h2 className="text-lg font-bold text-[#232326] sm:text-xl">С этим товаром покупают</h2>

      <div className="components-slider__wrap relative mt-5 flex items-center gap-2 sm:mt-6 sm:gap-3">
        <button
          type="button"
          className="components-slider__nav components-slider__nav--prev swiper-button-prev hidden shrink-0 sm:inline-flex"
          aria-label="Предыдущие комплектующие"
        >
          <ChevronLeftIcon className="h-4 w-4 shrink-0" />
        </button>

        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1.15}
          navigation={{
            prevEl: '.components-slider__nav--prev',
            nextEl: '.components-slider__nav--next',
          }}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="components-slider__swiper min-w-0 flex-1"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id} className="!h-auto">
              <ComponentCard item={item} onOpenItem={onOpenItem} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className="components-slider__nav components-slider__nav--next swiper-button-next hidden shrink-0 sm:inline-flex"
          aria-label="Следующие комплектующие"
        >
          <ChevronRightIcon className="h-4 w-4 shrink-0" />
        </button>
      </div>
    </section>
  )
}
