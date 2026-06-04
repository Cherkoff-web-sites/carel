'use client'

import { useEffect, useId, useRef, useState } from 'react'

export type CatalogFilterOption<T extends string | number> = {
  value: T
  label: string
}

type CatalogFilterSelectProps<T extends string | number> = {
  label: string
  placeholder: string
  options: CatalogFilterOption<T>[]
  value: T | null
  onChange: (value: T | null) => void
  allowClear?: boolean
}

export default function CatalogFilterSelect<T extends string | number>({
  label,
  placeholder,
  options,
  value,
  onChange,
  allowClear = true,
}: CatalogFilterSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const selected = options.find((o) => o.value === value)
  const displayLabel = selected?.label ?? placeholder

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
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 rounded-[5px] border border-[#232326]/20 bg-white px-4 py-3 text-left text-sm text-[#232326] transition-colors hover:border-[#232326]/35 sm:text-base"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
      >
        <span>
          <span className="block text-xs text-[#232326]/55 sm:text-sm">{label}</span>
          <span className={selected ? 'font-medium' : 'text-[#232326]/70'}>{displayLabel}</span>
        </span>
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
          className="absolute left-0 right-0 top-full z-20 mt-1 rounded-[5px] border border-[#232326]/10 bg-[#e8e6e1] py-1 shadow-lg"
        >
          {allowClear ? (
            <li>
              <button
                type="button"
                role="option"
                aria-selected={value === null}
                onClick={() => {
                  onChange(null)
                  setOpen(false)
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-[#232326]/70 transition-colors hover:bg-white/60 sm:text-base"
              >
                {placeholder}
              </button>
            </li>
          ) : null}
          {options.map((option) => (
            <li key={String(option.value)}>
              <button
                type="button"
                role="option"
                aria-selected={value === option.value}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/60 sm:text-base ${
                  value === option.value
                    ? 'bg-white font-medium text-[#E62614]'
                    : 'text-[#232326]'
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
