'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { HUMISTEAM_PRODUCT_IMAGE } from '@/lib/humisteamData'
import { isComponentCartItemId, PARTS_AND_COMPONENTS_IMAGE } from '@/lib/partsImage'

function resolveCartLineImage(image: string, cartItemId: string): string {
  if (image) {
    return image
  }
  if (isComponentCartItemId(cartItemId)) {
    return PARTS_AND_COMPONENTS_IMAGE
  }
  return HUMISTEAM_PRODUCT_IMAGE
}

function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
}: {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-[#232326]/15 bg-[#e8e6e1]/80 px-1 py-0.5">
      <button
        type="button"
        onClick={onIncrease}
        className="flex h-8 w-8 items-center justify-center text-lg text-[#232326]/70 transition-colors hover:text-[#232326]"
        aria-label="Увеличить количество"
      >
        +
      </button>
      <span className="min-w-[1.5rem] text-center text-base font-medium text-[#232326]">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onDecrease}
        className="flex h-8 w-8 items-center justify-center text-lg text-[#232326]/70 transition-colors hover:text-[#232326]"
        aria-label="Уменьшить количество"
      >
        −
      </button>
    </div>
  )
}

function CartLineItem({
  cartItemId,
  image,
  name,
  cylinderType,
  dimensions,
  performance,
  quantity,
  onIncrease,
  onDecrease,
}: {
  cartItemId: string
  image: string
  name: string
  cylinderType?: string
  dimensions?: string
  performance?: string
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
}) {
  return (
    <article className="relative rounded-[5px] border border-[#232326]/12 bg-white p-5 sm:p-6">
      <div className="absolute right-5 top-5 sm:right-6 sm:top-6">
        <QuantityControl
          quantity={quantity}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
      </div>

      <div className="flex gap-5 pr-28 sm:gap-6 sm:pr-32">
        <div className="relative h-[140px] w-[100px] shrink-0 sm:h-[160px] sm:w-[110px]">
          <Image
            src={resolveCartLineImage(image, cartItemId)}
            alt=""
            fill
            className="object-contain object-left"
            sizes="110px"
          />
        </div>

        <div className="min-w-0 flex-1 pt-1">
          <h2 className="text-lg font-bold leading-snug text-[#232326] sm:text-xl">{name}</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-[#232326]/65 sm:text-base">
            {cylinderType ? (
              <li>
                <span className="text-[#232326]/50">Тип цилиндра:</span> {cylinderType}
              </li>
            ) : null}
            {dimensions ? (
              <li>
                <span className="text-[#232326]/50">Размеры (ВхШхГ):</span> {dimensions}
              </li>
            ) : null}
            {performance ? (
              <li>
                <span className="text-[#232326]/50">Производительность:</span> {performance}
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </article>
  )
}

function CartSummary({ disabled }: { disabled: boolean }) {
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!phone.trim()) return
    setSubmitted(true)
  }

  return (
    <aside className="rounded-[5px] border border-[#232326]/12 bg-white p-6 lg:sticky lg:top-[106px]">
      <p className="text-lg font-bold text-[#232326] sm:text-xl">Цена: по запросу</p>

      {submitted ? (
        <p className="mt-6 text-sm leading-relaxed text-[#232326]/75 sm:text-base">
          Спасибо! Мы свяжемся с вами в ближайшее время.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Телефон"
            disabled={disabled}
            required
            className="w-full rounded-[5px] border-0 bg-[#e8e6e1] px-4 py-3.5 text-base text-[#232326] placeholder:text-[#232326]/45 focus:outline-none focus:ring-2 focus:ring-[#E62614]/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled}
            className="w-full rounded-[5px] bg-[#E62614] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#E62614]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Отправить запрос
          </button>
        </form>
      )}
    </aside>
  )
}

export default function CartPage() {
  const { items, updateQuantity } = useCart()
  const hasItems = items.length > 0

  return (
    <div className="min-h-screen bg-[#fdfbf6] pt-[82px]">
      <div className="container py-8 sm:py-10 lg:py-12">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1 text-sm text-[#232326]/55 transition-colors hover:text-[#232326] sm:text-base"
        >
          <span aria-hidden>‹</span> Вернуться к покупкам
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-[#232326] sm:mt-5 sm:text-4xl lg:text-[42px]">
          Корзина
        </h1>

        {!hasItems ? (
          <p className="mt-10 text-base text-[#232326]/60 sm:text-lg">
            Корзина пуста.{' '}
            <Link href="/catalog" className="text-[#E62614] hover:underline">
              Перейти в каталог
            </Link>
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:gap-10 xl:gap-14">
            <div className="space-y-4 sm:space-y-5">
              {items.map((item) => (
                <CartLineItem
                  key={item.id}
                  cartItemId={item.id}
                  image={item.image}
                  name={item.name}
                  cylinderType={item.cylinderType}
                  dimensions={item.dimensions}
                  performance={item.performance}
                  quantity={item.quantity}
                  onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                  onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                />
              ))}
            </div>

            <CartSummary disabled={!hasItems} />
          </div>
        )}
      </div>
    </div>
  )
}
