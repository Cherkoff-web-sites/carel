'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CatalogListProduct } from '@/lib/catalogListProduct'

type CatalogAllModelsSelectProps<T extends CatalogListProduct> = {
  products: T[]
  currentProductId: string
  onSelect: (product: T) => void
  triggerLabel?: string
}

export default function CatalogAllModelsSelect<T extends CatalogListProduct>({
  products,
  currentProductId,
  onSelect,
  triggerLabel = 'Все модели',
}: CatalogAllModelsSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const sorted = [...products].sort((a, b) => a.title.localeCompare(b.title, 'ru'))

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  return (
    <div ref={rootRef} className="relative inline-block w-auto">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex w-auto min-w-[200px] items-center justify-between gap-3 rounded-[5px] border border-[#232326]/20 bg-white px-4 py-3.5 text-left text-base text-[#232326] transition-colors hover:border-[#232326]/35"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
      >
        <span className="font-normal">{triggerLabel}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-[#232326]/50 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 top-[calc(100%+4px)] z-20 max-h-64 min-w-full overflow-y-auto rounded-[5px] border border-[#232326]/15 bg-white py-1 shadow-lg"
        >
          {sorted.map((product) => {
            const isCurrent = product.id === currentProductId
            return (
              <li key={product.id} role="option" aria-selected={isCurrent}>
                <button
                  type="button"
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#e8e6e1]/60 sm:text-base ${
                    isCurrent ? 'font-medium text-[#E62614]' : 'text-[#232326]'
                  }`}
                  onClick={() => {
                    onSelect(product)
                    setOpen(false)
                  }}
                >
                  {product.title}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
