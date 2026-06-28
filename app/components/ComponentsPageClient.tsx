'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import CatalogSidebar from '@/components/catalog/CatalogSidebar'
import ComponentProductDetail from '@/components/components-catalog/ComponentProductDetail'
import ComponentsCatalogPanel from '@/components/components-catalog/ComponentsCatalogPanel'
import ComponentsPageShell from '@/components/components-catalog/ComponentsPageShell'
import { useCatalogProducts } from '@/hooks/useCatalogProducts'
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
import { HEADER_SCROLL_MARGIN_CLASS } from '@/lib/constants'
import { scrollToElement } from '@/lib/scrollToPageTop'
import type { PublicPriceFields } from '@/lib/catalogProductMeta'

type ComponentCatalogProduct = ComponentCatalogItem & PublicPriceFields

export default function ComponentsPageClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { products, loading } = useCatalogProducts('components')

  const [activeSectionId, setActiveSectionId] = useState(COMPONENTS_DEFAULT_SECTION_ID)
  const [selectedProduct, setSelectedProduct] = useState<ComponentCatalogProduct | null>(null)
  const productDetailRef = useRef<HTMLElement>(null)

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
    (product: ComponentCatalogProduct) => {
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
    if (products.length === 0) {
      return
    }

    const id = searchParams.get('id')
    if (!id) {
      return
    }

    if (isComponentProductId(products, id)) {
      const product = getComponentById(products, id)
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
  }, [products, searchParams])

  useEffect(() => {
    if (!selectedProduct) {
      return
    }
    scrollToElement(productDetailRef.current)
  }, [selectedProduct?.id])

  const sectionProducts = getComponentsForSection(
    products,
    selectedProduct?.sectionId ?? activeSectionId
  )

  if (loading && products.length === 0) {
    return (
      <ComponentsPageShell>
        <p className="p-8 text-[#232326]/60">Загрузка каталога…</p>
      </ComponentsPageShell>
    )
  }

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
          <article ref={productDetailRef} className={`min-w-0 ${HEADER_SCROLL_MARGIN_CLASS}`}>
            <ComponentProductDetail
              product={selectedProduct}
              sectionProducts={sectionProducts}
              onBack={closeProduct}
              onSelectProduct={openProduct}
            />
          </article>
        ) : (
          <ComponentsCatalogPanel
            sectionId={activeSectionId}
            products={products}
            onOpenProduct={openProduct}
          />
        )}
      </div>
    </ComponentsPageShell>
  )
}
