'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

export type CustomerChoiceProduct = {
  id: string
  title: string
  subtitle: string
  image: string
  href: string
}

function CustomerChoiceCard({ product }: { product: CustomerChoiceProduct }) {
  return (
    <Link
      href={product.href}
      className="group flex h-full w-full flex-col overflow-hidden rounded-none transition-[filter] hover:[filter:drop-shadow(1px_1px_21.6px_rgba(255,255,255,0.27))] active:[filter:drop-shadow(1px_1px_21.6px_rgba(255,255,255,0.27))]"
    >
      <div className="relative aspect-square bg-white">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-6 sm:p-8"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
      </div>
      <div className="home-catalog-card__caption flex min-h-[125px] flex-1 flex-col items-center justify-start bg-[#e8e6e1] px-5 py-[15px] text-center transition-colors duration-300 group-hover:bg-[#E62614] group-active:bg-[#E62614] sm:px-6">
        <h3 className="home-catalog-card__title shrink-0 text-[25px] font-normal leading-tight text-[#232326] transition-colors duration-300 group-hover:text-white group-active:text-white lg:text-[30px]">
          {product.title}
        </h3>
        <p className="home-catalog-card__subtitle mt-2 max-w-[18rem] shrink-0 text-sm font-normal leading-snug text-[#232326]/85 transition-colors duration-300 group-hover:text-white/95 group-active:text-white/95 sm:text-base">
          {product.subtitle}
        </p>
      </div>
    </Link>
  )
}

type HomeCatalogSliderProps = {
  products: readonly CustomerChoiceProduct[]
}

export default function HomeCatalogSlider({ products }: HomeCatalogSliderProps) {
  return (
    <>
      <div className="lg:hidden">
        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          spaceBetween={0}
          pagination={{ clickable: true }}
          className="home-catalog-slider"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="!h-auto">
              <CustomerChoiceCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <ul className="hidden lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-6">
        {products.map((product) => (
          <li key={product.id} className="flex h-full">
            <CustomerChoiceCard product={product} />
          </li>
        ))}
      </ul>
    </>
  )
}
