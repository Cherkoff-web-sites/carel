'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'

type CatalogImageSliderProps = {
  images: readonly string[]
  alt: string
}

function SliderChevron({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className="h-2.5 w-2.5 shrink-0"
      aria-hidden
    >
      <path
        d={
          direction === 'prev'
            ? 'M6.5 1.5L2.5 5l4 3.5'
            : 'M3.5 1.5L7.5 5l-4 3.5'
        }
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function CatalogImageSlider({ images, alt }: CatalogImageSliderProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperInstance | null>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const safeImages =
    images.length > 0 ? images : (['/images/catalog/humisteam/gallery-1.png'] as const)

  return (
    <div className="catalog-image-slider min-w-0">
      <Swiper
        modules={[Thumbs]}
        spaceBetween={8}
        slidesPerView={1}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        className="catalog-image-slider__main overflow-hidden rounded-[5px] bg-[#232326]/5"
      >
        {safeImages.map((src, index) => (
          <SwiperSlide key={`${src}-${index}`}>
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={src}
                alt={index === 0 ? alt : `${alt}, фото ${index + 1}`}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="catalog-image-slider__thumbs-wrap relative mt-4 flex items-center gap-1 sm:gap-2">
        <button
          ref={prevRef}
          type="button"
          className="catalog-image-slider__nav catalog-image-slider__nav--prev"
          aria-label="Предыдущее фото"
        >
          <SliderChevron direction="prev" />
        </button>
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[FreeMode, Navigation, Thumbs]}
          watchSlidesProgress
          slideToClickedSlide
          slidesPerView={4}
          spaceBetween={8}
          freeMode
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            const nav = swiper.params.navigation
            if (nav && typeof nav !== 'boolean') {
              nav.prevEl = prevRef.current
              nav.nextEl = nextRef.current
            }
          }}
          breakpoints={{
            0: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
          }}
          className="catalog-image-slider__thumbs min-w-0 flex-1"
        >
          {safeImages.map((src, index) => (
            <SwiperSlide key={`thumb-${src}-${index}`} className="!h-auto">
              <div className="catalog-image-slider__thumb relative h-16 w-full cursor-pointer overflow-hidden rounded-[5px] border-2 border-transparent bg-[#232326]/5 sm:h-[72px]">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-contain p-1"
                  sizes="96px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          ref={nextRef}
          type="button"
          className="catalog-image-slider__nav catalog-image-slider__nav--next"
          aria-label="Следующее фото"
        >
          <SliderChevron direction="next" />
        </button>
      </div>
    </div>
  )
}
