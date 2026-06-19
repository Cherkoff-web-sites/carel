'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTree from '@/components/admin/AdminTree'
import CatalogToolbar, { type ViewMode } from '@/components/admin/catalog/CatalogToolbar'
import ProductEditorPanel, {
  type ProductEditorDraft,
} from '@/components/admin/catalog/ProductEditorPanel'
import ProductGrid from '@/components/admin/catalog/ProductGrid'
import ProductTable, { type AdminProductRow } from '@/components/admin/catalog/ProductTable'
import {
  filterComponentProducts,
  getComponentSiteUrl,
} from '@/lib/adminCatalogFilters'
import type { ComponentCatalogItem } from '@/lib/componentsCatalogData'
import { COMPONENTS_CATALOG_TREE, COMPONENTS_DEFAULT_SECTION_ID } from '@/lib/componentsCatalogTree'

function toDraft(item: ComponentCatalogItem): ProductEditorDraft {
  return {
    title: item.title,
    description: item.description,
    fullDescription: item.fullDescription,
    price: String(item.price),
  }
}

function toRow(item: ComponentCatalogItem): AdminProductRow {
  return {
    id: item.id,
    sku: item.sku,
    title: item.title,
    image: item.image,
    price: item.price,
    subtitle: item.sectionId,
  }
}

export default function ComponentsCatalogAdmin() {
  const [products, setProducts] = useState<ComponentCatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [treeNodeId, setTreeNodeId] = useState(COMPONENTS_DEFAULT_SECTION_ID)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, ProductEditorDraft>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadCatalog = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/catalog?catalog=components', { cache: 'no-store' })
      const data = (await response.json()) as ComponentCatalogItem[]
      setProducts(data)
      const nextDrafts: Record<string, ProductEditorDraft> = {}
      for (const item of data) {
        nextDrafts[item.id] = toDraft(item)
      }
      setDrafts(nextDrafts)
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
    () => filterComponentProducts(products, treeNodeId, search),
    [products, search, treeNodeId]
  )

  const rows = useMemo(() => filtered.map(toRow), [filtered])

  const selectedProduct = useMemo(
    () => filtered.find((item) => item.id === selectedId) ?? null,
    [filtered, selectedId]
  )

  const updateDraft = (id: string, field: keyof ProductEditorDraft, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  const saveSelected = async () => {
    if (!selectedProduct || !selectedId) return
    const draft = drafts[selectedId]
    if (!draft) return

    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/catalog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalog: 'components',
          id: selectedProduct.id,
          patch: {
            title: draft.title,
            description: draft.description,
            fullDescription: draft.fullDescription,
            price: Number(draft.price) || 0,
          },
        }),
      })
      if (!response.ok) throw new Error('save failed')
      const result = await response.json()
      const updated = result.product as ComponentCatalogItem
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setMessage({ type: 'success', text: `Сохранено: ${updated.sku}` })
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сохранения' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (id: string) => {
    const item = filtered.find((entry) => entry.id === id)
    if (item) {
      setDrafts((prev) => ({ ...prev, [id]: prev[id] ?? toDraft(item) }))
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
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalCount={rows.length}
          />

          {loading ? (
            <p className="p-6 text-sm text-[#232326]/60 sm:p-8">Загрузка товаров…</p>
          ) : (
            <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row lg:overflow-hidden">
              <div
                className={`min-w-0 flex-1 overflow-y-auto ${selectedProduct ? 'lg:max-w-[55%]' : ''}`}
              >
                {viewMode === 'table' ? (
                  <ProductTable rows={rows} selectedId={selectedId} onEdit={handleEdit} />
                ) : (
                  <ProductGrid rows={rows} selectedId={selectedId} onEdit={handleEdit} />
                )}
              </div>

              {selectedProduct && selectedId && drafts[selectedId] ? (
                <div className="fixed inset-0 z-[220] flex flex-col bg-white lg:static lg:z-auto lg:w-[45%] lg:shrink-0 lg:border-l lg:border-gray-200">
                  <ProductEditorPanel
                    catalogKey="components"
                    productId={selectedProduct.id}
                    sku={selectedProduct.sku}
                    image={selectedProduct.image}
                    galleryCount={selectedProduct.galleryImages.length}
                    siteUrl={getComponentSiteUrl(selectedProduct)}
                    draft={drafts[selectedId]}
                    saving={saving}
                    onDraftChange={(field, value) => updateDraft(selectedId, field, value)}
                    onSave={() => void saveSelected()}
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
