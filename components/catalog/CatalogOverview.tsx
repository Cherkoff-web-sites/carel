'use client'

import { CATALOG_TREE } from '@/lib/catalogData'
import { CATALOG_OVERVIEW_INTRO } from '@/lib/catalogCategoryContent'
import CatalogSeriesCard from '@/components/catalog/CatalogSeriesCard'

type CatalogOverviewProps = {
  onSelect: (id: string) => void
}

export default function CatalogOverview({ onSelect }: CatalogOverviewProps) {
  return (
    <article className="min-w-0">
      <h1 className="mb-4 text-3xl font-normal text-[#232326] sm:mb-6 sm:text-4xl lg:text-5xl">
        Каталог
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-[#232326]/80 sm:text-lg">
        {CATALOG_OVERVIEW_INTRO}
      </p>

      <ul className="mt-8 divide-y divide-[#232326]/10 rounded-[5px] border border-[#232326]/10 bg-white/60 sm:mt-10">
        {CATALOG_TREE.map((category) => (
          <CatalogSeriesCard
            key={category.id}
            node={category}
            onSelect={onSelect}
            showSubItems
          />
        ))}
      </ul>
    </article>
  )
}
