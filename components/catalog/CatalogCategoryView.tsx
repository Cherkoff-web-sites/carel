'use client'

import {
  getCatalogCategoryById,
  type CatalogCategoryId,
} from '@/lib/catalogData'
import { CATALOG_CATEGORY_INTRO } from '@/lib/catalogCategoryContent'
import CatalogSeriesCard from '@/components/catalog/CatalogSeriesCard'

type CatalogCategoryViewProps = {
  categoryId: CatalogCategoryId
  onSelect: (id: string) => void
}

export default function CatalogCategoryView({ categoryId, onSelect }: CatalogCategoryViewProps) {
  const category = getCatalogCategoryById(categoryId)

  if (!category?.children?.length) {
    return null
  }

  return (
    <article className="min-w-0">
      <h1 className="mb-4 text-3xl font-normal text-[#232326] sm:mb-6 sm:text-4xl lg:text-5xl">
        {category.label}
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-[#232326]/80 sm:text-lg">
        {CATALOG_CATEGORY_INTRO[categoryId]}
      </p>

      <ul className="mt-8 divide-y divide-[#232326]/10 rounded-[5px] border border-[#232326]/10 bg-white/60 sm:mt-10">
        {category.children.map((child) => (
          <CatalogSeriesCard
            key={child.id}
            node={child}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </article>
  )
}
