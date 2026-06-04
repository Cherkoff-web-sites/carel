'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { CatalogTreeNode } from '@/lib/catalogData'
import {
  catalogSidebarThumbSrc,
  hasCatalogSidebarThumb,
} from '@/lib/catalogSidebarThumbs'
import { CATALOG_SERIES_SUMMARY } from '@/lib/catalogCategoryContent'

type CatalogSeriesCardProps = {
  node: CatalogTreeNode
  onSelect: (id: string) => void
  showSubItems?: boolean
}

function CardThumb({ nodeId }: { nodeId: string }) {
  const [visible, setVisible] = useState(true)

  if (!hasCatalogSidebarThumb(nodeId) || !visible) {
    return <span className="h-20 w-20 shrink-0 sm:h-24 sm:w-24" aria-hidden />
  }

  return (
    <span className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
      <Image
        src={catalogSidebarThumbSrc(nodeId)}
        alt=""
        fill
        className="object-contain"
        sizes="96px"
        onError={() => setVisible(false)}
      />
    </span>
  )
}

export default function CatalogSeriesCard({
  node,
  onSelect,
  showSubItems = false,
}: CatalogSeriesCardProps) {
  const summary = CATALOG_SERIES_SUMMARY[node.id]
  const subLabels = showSubItems && node.children?.length
    ? node.children.map((c) => c.label).join(' · ')
    : null

  return (
    <li className="border-b border-[#232326]/10 last:border-b-0">
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-[#e8e6e1]/40 sm:gap-6 sm:py-5"
      >
        <CardThumb nodeId={node.id} />
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-bold text-[#232326] sm:text-xl">{node.label}</span>
          {summary ? (
            <span className="mt-1 block text-sm leading-relaxed text-[#232326]/70 sm:text-base">
              {summary}
            </span>
          ) : null}
          {subLabels ? (
            <span className="mt-2 block text-sm text-[#232326]/55">{subLabels}</span>
          ) : null}
        </span>
        <svg
          className="h-5 w-5 shrink-0 text-[#232326]/40"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </li>
  )
}
