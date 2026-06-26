'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTree from '@/components/admin/AdminTree'
import CatalogToolbar, { type StatusFilter, type ViewMode } from '@/components/admin/catalog/CatalogToolbar'
import ProductEditorPanel from '@/components/admin/catalog/ProductEditorPanel'
import ProductGrid from '@/components/admin/catalog/ProductGrid'
import ProductTable, { type AdminProductRow } from '@/components/admin/catalog/ProductTable'
import { draftToPatch, productToDraft, productToMedia, productToTabs, type ProductEditorDraft, type ProductEditorMedia, type ProductEditorTabs } from '@/lib/adminProductDraft'
import {
  filterComponentProducts,
  getComponentSiteUrl,
} from '@/lib/adminCatalogFilters'
import { getCatalogLeafIds } from '@/lib/catalogData'
import { withCatalogProductDefaults } from '@/lib/catalogProductMeta'
import type { ComponentCatalogItem } from '@/lib/componentsCatalogData'
import {
  COMPONENTS_CATALOG_TREE,
  COMPONENTS_DEFAULT_SECTION_ID,
} from '@/lib/componentsCatalogTree'
import { buildCatalogExportHref } from '@/lib/catalogExportUrl'

function resolveComponentSectionId(treeNodeId: string): string {
  if (treeNodeId === 'all') {
    return COMPONENTS_DEFAULT_SECTION_ID
  }
  const leafIds = getCatalogLeafIds(COMPONENTS_CATALOG_TREE, treeNodeId)
  if (leafIds.length > 0) {
    return leafIds[0]
  }
  return treeNodeId
}

function toRow(item: ComponentCatalogItem): AdminProductRow {
  const meta = withCatalogProductDefaults(item)
  return {
    id: item.id,
    sku: item.sku,
    title: item.title,
    image: item.image,
    price: item.price,
    subtitle: item.sectionId,
    published: meta.published,
    showPriceOnSite: meta.showPriceOnSite,
  }
}

function matchesStatusFilter(item: ComponentCatalogItem, statusFilter: StatusFilter): boolean {
  const meta = withCatalogProductDefaults(item)
  if (statusFilter === 'published') return meta.published
  if (statusFilter === 'hidden') return !meta.published
  if (statusFilter === 'price-visible') return meta.showPriceOnSite
  if (statusFilter === 'price-hidden') return !meta.showPriceOnSite
  return true
}

export default function ComponentsCatalogAdmin() {
  const [products, setProducts] = useState<ComponentCatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [treeNodeId, setTreeNodeId] = useState(COMPONENTS_DEFAULT_SECTION_ID)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, ProductEditorDraft>>({})
  const [mediaState, setMediaState] = useState<Record<string, ProductEditorMedia>>({})
  const [tabsState, setTabsState] = useState<Record<string, ProductEditorTabs>>({})
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadCatalog = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/catalog?catalog=components', { cache: 'no-store' })
      const data = (await response.json()) as ComponentCatalogItem[]
      setProducts(data)
      const nextDrafts: Record<string, ProductEditorDraft> = {}
      const nextMedia: Record<string, ProductEditorMedia> = {}
      const nextTabs: Record<string, ProductEditorTabs> = {}
      for (const item of data) {
        nextDrafts[item.id] = productToDraft(item)
        nextMedia[item.id] = productToMedia(item, 'components')
        nextTabs[item.id] = productToTabs(item)
      }
      setDrafts(nextDrafts)
      setMediaState(nextMedia)
      setTabsState(nextTabs)
    } catch {
      setMessage({ type: 'error', text: 'Не удалось загрузить каталог' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCatalog()
  }, [loadCatalog])

  const filtered = useMemo(
    () =>
      filterComponentProducts(products, treeNodeId, search).filter((item) =>
        matchesStatusFilter(item, statusFilter)
      ),
    [products, search, statusFilter, treeNodeId]
  )

  const rows = useMemo(() => filtered.map(toRow), [filtered])

  const exportHref = useMemo(
    () =>
      buildCatalogExportHref(
        filtered.map((item) => ({
          catalog: 'components' as const,
          id: item.id,
        }))
      ),
    [filtered]
  )

  const selectedProduct = useMemo(
    () => filtered.find((item) => item.id === selectedId) ?? products.find((item) => item.id === selectedId) ?? null,
    [filtered, products, selectedId]
  )

  const updateDraft = <K extends keyof ProductEditorDraft>(
    id: string,
    field: K,
    value: ProductEditorDraft[K]
  ) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  const applyUpdatedProduct = (updated: ComponentCatalogItem) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === updated.id)
      if (exists) {
        return prev.map((p) => (p.id === updated.id ? updated : p))
      }
      return [...prev, updated]
    })
    setDrafts((prev) => ({ ...prev, [updated.id]: productToDraft(updated) }))
    setMediaState((prev) => ({ ...prev, [updated.id]: productToMedia(updated, 'components') }))
    setTabsState((prev) => ({ ...prev, [updated.id]: productToTabs(updated) }))
    setSelectedId(updated.id)
  }

  const saveSelected = async () => {
    if (!selectedProduct || !selectedId) return
    const draft = drafts[selectedId]
    const media = mediaState[selectedId]
    const tabs = tabsState[selectedId]
    if (!draft || !media || !tabs) return

    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/catalog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalog: 'components',
          id: selectedProduct.id,
          patch: draftToPatch(draft, media, tabs, 'components'),
        }),
      })
      if (!response.ok) throw new Error('save failed')
      const result = await response.json()
      applyUpdatedProduct(result.product as ComponentCatalogItem)
      setMessage({ type: 'success', text: `Сохранено: ${selectedProduct.sku}` })
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сохранения' })
    } finally {
      setSaving(false)
    }
  }

  const duplicateProduct = async (id: string) => {
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalog: 'components', action: 'duplicate', id }),
      })
      if (!response.ok) throw new Error('duplicate failed')
      const result = await response.json()
      applyUpdatedProduct(result.product as ComponentCatalogItem)
      setMessage({ type: 'success', text: 'Создана копия товара' })
    } catch {
      setMessage({ type: 'error', text: 'Ошибка дублирования' })
    } finally {
      setSaving(false)
    }
  }

  const createProduct = async () => {
    setCreating(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalog: 'components',
          action: 'create',
          sectionId: resolveComponentSectionId(treeNodeId),
        }),
      })
      if (!response.ok) throw new Error('create failed')
      const result = await response.json()
      applyUpdatedProduct(result.product as ComponentCatalogItem)
      setMessage({ type: 'success', text: 'Создан новый товар' })
    } catch {
      setMessage({ type: 'error', text: 'Ошибка создания товара' })
    } finally {
      setCreating(false)
    }
  }

  const hideSelected = async () => {
    if (!selectedProduct || !selectedId) return
    const draft = drafts[selectedId]
    const media = mediaState[selectedId]
    const tabs = tabsState[selectedId]
    if (!draft || !media || !tabs) return

    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/catalog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalog: 'components',
          id: selectedProduct.id,
          patch: { ...draftToPatch(draft, media, tabs, 'components'), published: false },
        }),
      })
      if (!response.ok) throw new Error('hide failed')
      const result = await response.json()
      applyUpdatedProduct(result.product as ComponentCatalogItem)
      setMessage({ type: 'success', text: 'Товар скрыт с сайта' })
    } catch {
      setMessage({ type: 'error', text: 'Ошибка скрытия товара' })
    } finally {
      setSaving(false)
    }
  }

  const deleteSelected = async () => {
    if (!selectedProduct) return
    if (!window.confirm(`Удалить товар ${selectedProduct.sku}? Это действие нельзя отменить.`)) {
      return
    }

    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch(
        `/api/admin/catalog?catalog=components&id=${encodeURIComponent(selectedProduct.id)}`,
        { method: 'DELETE' }
      )
      if (!response.ok) throw new Error('delete failed')
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id))
      setDrafts((prev) => {
        const next = { ...prev }
        delete next[selectedProduct.id]
        return next
      })
      setSelectedId(null)
      setMessage({ type: 'success', text: 'Товар удалён' })
    } catch {
      setMessage({ type: 'error', text: 'Ошибка удаления' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (id: string) => {
    const item = products.find((entry) => entry.id === id)
    if (item) {
      setDrafts((prev) => ({ ...prev, [id]: prev[id] ?? productToDraft(item) }))
      setMediaState((prev) => ({ ...prev, [id]: prev[id] ?? productToMedia(item, 'components') }))
      setTabsState((prev) => ({ ...prev, [id]: prev[id] ?? productToTabs(item) }))
    }
    setSelectedId(id)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Запчасти"
        description="Управление каталогом комплектующих и запчастей."
      />

      {message ? (
        <div
          className={`mx-4 mt-3 rounded-[5px] px-4 py-3 text-sm sm:mx-6 sm:mt-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        <div className="w-full shrink-0 lg:w-[280px] lg:overflow-hidden">
          <AdminTree
            tree={COMPONENTS_CATALOG_TREE}
            activeId={treeNodeId}
            onSelect={setTreeNodeId}
            title="Каталог запчастей"
          />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:overflow-hidden">
          <CatalogToolbar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalCount={rows.length}
            onCreate={() => void createProduct()}
            creating={creating}
            exportHref={exportHref}
          />

          {loading ? (
            <p className="p-6 text-sm text-[#232326]/60 sm:p-8">Загрузка товаров…</p>
          ) : (
            <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row lg:overflow-hidden">
              <div
                className={`min-w-0 flex-1 overflow-y-auto ${selectedProduct ? 'lg:max-w-[55%]' : ''}`}
              >
                {viewMode === 'table' ? (
                  <ProductTable
                    rows={rows}
                    selectedId={selectedId}
                    onEdit={handleEdit}
                    onDuplicate={(id) => void duplicateProduct(id)}
                  />
                ) : (
                  <ProductGrid
                    rows={rows}
                    selectedId={selectedId}
                    onEdit={handleEdit}
                    onDuplicate={(id) => void duplicateProduct(id)}
                  />
                )}
              </div>

              {selectedProduct && selectedId && drafts[selectedId] && mediaState[selectedId] && tabsState[selectedId] ? (
                <div className="fixed inset-0 z-[220] flex flex-col bg-white lg:static lg:z-auto lg:w-[45%] lg:shrink-0 lg:border-l lg:border-gray-200">
                  <ProductEditorPanel
                    catalogKey="components"
                    productId={selectedProduct.id}
                    sku={selectedProduct.sku}
                    siteUrl={getComponentSiteUrl(selectedProduct)}
                    draft={drafts[selectedId]}
                    media={mediaState[selectedId]}
                    tabs={tabsState[selectedId]}
                    saving={saving}
                    onDraftChange={(field, value) => updateDraft(selectedId, field, value)}
                    onMediaChange={(media) => setMediaState((prev) => ({ ...prev, [selectedId]: media }))}
                    onTabsChange={(tabs) => setTabsState((prev) => ({ ...prev, [selectedId]: tabs }))}
                    onSave={() => void saveSelected()}
                    onDuplicate={() => void duplicateProduct(selectedProduct.id)}
                    onHide={() => void hideSelected()}
                    onDelete={() => void deleteSelected()}
                    onClose={() => setSelectedId(null)}
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
