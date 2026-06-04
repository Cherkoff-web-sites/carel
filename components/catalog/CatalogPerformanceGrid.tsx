'use client'

import { useEffect, useId, useRef, useState } from 'react'

type CatalogPerformanceGridProps = {
  label: string
  placeholder: string
  values: readonly number[]
  availableValues: readonly number[]
  value: number | null
  onChange: (value: number | null) => void
}

function formatPerformance(kgH: number): string {
  return kgH.toString().replace('.', ',')
}

export default function CatalogPerformanceGrid({
  label,
  placeholder,
  values,
  availableValues,
  value,
  onChange,
}: CatalogPerformanceGridProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  const displayLabel = value !== null ? formatPerformance(value) : placeholder

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
        aria-haspopup="dialog"
        aria-controls={panelId}
      >
        <span>
          <span className="block text-xs text-[#232326]/55 sm:text-sm">{label}</span>
          <span className={value !== null ? 'font-medium' : 'text-[#232326]/70'}>{displayLabel}</span>
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
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className="absolute left-0 top-full z-20 mt-1 w-full min-w-[280px] rounded-[5px] border border-[#232326]/10 bg-[#e8e6e1] p-3 shadow-lg sm:left-auto sm:right-0 sm:w-[320px]"
        >
          <div className="grid grid-cols-5 gap-2">
            {values.map((kgH) => {
              const isAvailable = availableValues.includes(kgH)
              const isSelected = value === kgH
              return (
                <button
                  key={kgH}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => {
                    onChange(isSelected ? null : kgH)
                    setOpen(false)
                  }}
                  className={`flex aspect-square min-h-[44px] items-center justify-center rounded-[3px] border text-sm font-medium transition-colors sm:min-h-[48px] sm:text-base ${
                    isSelected
                      ? 'border-[#E62614] bg-white text-[#E62614]'
                      : isAvailable
                        ? 'border-transparent bg-white text-[#232326] hover:border-[#232326]/20'
                        : 'cursor-not-allowed border-transparent bg-white/50 text-[#232326]/35'
                  }`}
                >
                  {formatPerformance(kgH)}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
