'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function buildComponentsRedirect(searchParams: URLSearchParams): string {
  const params = new URLSearchParams()
  const id = searchParams.get('id')
  if (id) {
    params.set('id', id)
  }
  const query = params.toString()
  return query ? `/components?${query}` : '/components'
}
import CatalogMainPanel from '@/components/catalog/CatalogMainPanel'
import CatalogPageShell from '@/components/catalog/CatalogPageShell'
import CatalogSidebar from '@/components/catalog/CatalogSidebar'
import { useCatalogProducts } from '@/hooks/useCatalogProducts'
import { findCatalogNodeById, CATALOG_TREE } from '@/lib/catalogData'
import { getHeaterSteamProductBySku } from '@/lib/heatersteamData'
import { getHumiSteamProductBySku } from '@/lib/humisteamData'

export default function CatalogPageClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { products: humiProducts } = useCatalogProducts('humisteam')
  const { products: heaterProducts } = useCatalogProducts('heatersteam')
  const [activeCatalogId, setActiveCatalogId] = useState<string | null>(null)

  /** Клик в сайдбаре: раздел каталога без карточки товара */
  const handleSidebarSelect = useCallback(
    (id: string) => {
      setActiveCatalogId(id)
      const params = new URLSearchParams()
      params.set('id', id)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router]
  )

  useEffect(() => {
    if (searchParams.get('category') === 'components') {
      router.replace(buildComponentsRedirect(searchParams))
      return
    }

    const id = searchParams.get('id') ?? searchParams.get('series')
    if (id) {
      const node = findCatalogNodeById(CATALOG_TREE, id)
      if (node) {
        setActiveCatalogId(id)
        return
      }
    }

    const sku = searchParams.get('sku')
    if (!sku) return

    const humiProduct = getHumiSteamProductBySku(humiProducts, sku)
    if (humiProduct) {
      setActiveCatalogId(humiProduct.modelId)
      return
    }

    const heaterProduct = getHeaterSteamProductBySku(heaterProducts, sku)
    if (heaterProduct) {
      setActiveCatalogId(heaterProduct.variantId)
    }
  }, [heaterProducts, humiProducts, router, searchParams])

  return (
    <CatalogPageShell>
      <CatalogSidebar
        tree={CATALOG_TREE}
        activeId={activeCatalogId}
        onSelect={handleSidebarSelect}
      />
      <div className="min-w-0 flex-1">
        <CatalogMainPanel
          activeId={activeCatalogId}
          onCatalogSelect={setActiveCatalogId}
          onNavigate={handleSidebarSelect}
        />
      </div>
    </CatalogPageShell>
  )
}
