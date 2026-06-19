'use client'

import ComponentCatalogCard from '@/components/components-catalog/ComponentCatalogCard'
import {
  getComponentsForSection,
  getSectionLabel,
  type ComponentCatalogItem,
} from '@/lib/componentsCatalogData'

type ComponentsCatalogPanelProps = {
  sectionId: string
  products: ComponentCatalogItem[]
  onOpenProduct: (product: ComponentCatalogItem) => void
}

export default function ComponentsCatalogPanel({
  sectionId,
  products,
  onOpenProduct,
}: ComponentsCatalogPanelProps) {
  const items = getComponentsForSection(products, sectionId)
  const title = getSectionLabel(sectionId)

  return (
    <div className="min-w-0 flex-1">
      <h1 className="mb-6 text-2xl font-bold text-[#232326] sm:mb-8 sm:text-3xl lg:text-4xl">
        {title}
      </h1>

      {items.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
          {items.map((item) => (
            <li key={item.id}>
              <ComponentCatalogCard item={item} onOpen={onOpenProduct} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-base text-[#232326]/60 sm:text-lg">
          В этом разделе пока нет позиций. Выберите другой раздел в каталоге слева.
        </p>
      )}
    </div>
  )
}
