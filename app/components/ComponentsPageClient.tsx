'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import CatalogSidebar from '@/components/catalog/CatalogSidebar'
import ComponentProductDetail from '@/components/components-catalog/ComponentProductDetail'
import ComponentsCatalogPanel from '@/components/components-catalog/ComponentsCatalogPanel'
import ComponentsPageShell from '@/components/components-catalog/ComponentsPageShell'
import { findCatalogNodeById } from '@/lib/catalogData'
import {
  getComponentById,
  getComponentsForSection,
  isComponentProductId,
  type ComponentCatalogItem,
} from '@/lib/componentsCatalogData'
import {
  COMPONENTS_CATALOG_TREE,
  COMPONENTS_DEFAULT_SECTION_ID,
} from '@/lib/componentsCatalogTree'
import { scrollToPageTop } from '@/lib/scrollToPageTop'

export default function ComponentsPageClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [activeSectionId, setActiveSectionId] = useState(COMPONENTS_DEFAULT_SECTION_ID)
  const [selectedProduct, setSelectedProduct] = useState<ComponentCatalogItem | null>(null)

  const syncUrl = useCallback(
    (sectionId: string, productId: string | null) => {
      const params = new URLSearchParams()
      params.set('id', productId ?? sectionId)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router]
  )

  const handleSidebarSelect = useCallback(
    (id: string) => {
      setActiveSectionId(id)
      setSelectedProduct(null)
      syncUrl(id, null)
    },
    [syncUrl]
  )

  const openProduct = useCallback(
    (product: ComponentCatalogItem) => {
      setActiveSectionId(product.sectionId)
      setSelectedProduct(product)
      syncUrl(product.sectionId, product.id)
    },
    [syncUrl]
  )

  const closeProduct = useCallback(() => {
    const sectionId = selectedProduct?.sectionId ?? activeSectionId
    setSelectedProduct(null)
    syncUrl(sectionId, null)
  }, [activeSectionId, selectedProduct?.sectionId, syncUrl])

  useEffect(() => {
    const id = searchParams.get('id')
    if (!id) {
      return
    }

    if (isComponentProductId(id)) {
      const product = getComponentById(id)
      if (product) {
        setSelectedProduct(product)
        setActiveSectionId(product.sectionId)
      }
      return
    }

    if (findCatalogNodeById(COMPONENTS_CATALOG_TREE, id)) {
      setActiveSectionId(id)
      setSelectedProduct(null)
    }
  }, [searchParams])

  useEffect(() => {
    if (!selectedProduct) {
      return
    }
    scrollToPageTop()
  }, [selectedProduct?.id])

  const sectionProducts = getComponentsForSection(
    selectedProduct?.sectionId ?? activeSectionId
  )

  return (
    <ComponentsPageShell>
      <CatalogSidebar
        tree={COMPONENTS_CATALOG_TREE}
        activeId={selectedProduct?.sectionId ?? activeSectionId}
        onSelect={handleSidebarSelect}
        showThumbnails={false}
        title="Каталог"
      />
      <div className="min-w-0 flex-1">
        {selectedProduct ? (
          <ComponentProductDetail
            product={selectedProduct}
            sectionProducts={sectionProducts}
            onBack={closeProduct}
            onSelectProduct={openProduct}
          />
        ) : (
          <ComponentsCatalogPanel sectionId={activeSectionId} onOpenProduct={openProduct} />
        )}
      </div>
    </ComponentsPageShell>
  )
}
