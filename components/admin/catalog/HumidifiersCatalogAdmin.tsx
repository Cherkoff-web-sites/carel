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
  filterHumidifierProducts,
  getHumidifierSiteUrl,
  type HumidifierAdminItem,
} from '@/lib/adminCatalogFilters'
import {
  catalogIdToHeatersteamVariantId,
  catalogIdToModelId,
  CATALOG_TREE,
} from '@/lib/catalogData'
import { withCatalogProductDefaults } from '@/lib/catalogProductMeta'
import type { CatalogKey } from '@/lib/catalogTypes'
import { buildCatalogExportHref } from '@/lib/catalogExportUrl'
import type { HeaterSteamProduct } from '@/lib/heatersteamData'
import type { HumiSteamProduct } from '@/lib/humisteamData'

function itemKey(item: HumidifierAdminItem): string {
  return `${item.catalogKey}:${item.product.id}`
}

function parseItemKey(key: string): { catalogKey: CatalogKey; id: string } | null {
  const separator = key.indexOf(':')
  if (separator <= 0) return null
  const catalogKey = key.slice(0, separator) as CatalogKey
  const id = key.slice(separator + 1)
  if (!id) return null
  return { catalogKey, id }
}

function resolveCreateContext(treeNodeId: string): {
  catalog: 'humisteam' | 'heatersteam'
  modelId?: string
  variantId?: string
} {
  const modelId = catalogIdToModelId(treeNodeId)
  if (modelId) {
    return { catalog: 'humisteam', modelId }
  }
  const variantId = catalogIdToHeatersteamVariantId(treeNodeId)
  if (variantId) {
    return { catalog: 'heatersteam', variantId }
  }
  if (treeNodeId === 'heatersteam') {
    return { catalog: 'heatersteam', variantId: 'heatersteam-process' }
  }
  return { catalog: 'humisteam', modelId: 'basic-uey' }
}

function toRow(item: HumidifierAdminItem): AdminProductRow {
  const meta = withCatalogProductDefaults(item.product)
  const subtitle =
    item.catalogKey === 'humisteam'
      ? `${item.product.performanceKgH} кг/ч`
      : `${item.product.performanceKgH} кг/ч · ${item.product.variantId.includes('titanium') ? 'titanium' : 'process'}`
  return {
    id: itemKey(item),
    sku: item.product.sku,
    title: item.product.title,
    image: item.product.image,
    price: item.product.price,
    subtitle,
    published: meta.published,
    showPriceOnSite: meta.showPriceOnSite,
  }
}

function matchesStatusFilter(item: HumidifierAdminItem, statusFilter: StatusFilter): boolean {
  const meta = withCatalogProductDefaults(item.product)
  if (statusFilter === 'published') return meta.published
  if (statusFilter === 'hidden') return !meta.published
  if (statusFilter === 'price-visible') return meta.showPriceOnSite
  if (statusFilter === 'price-hidden') return !meta.showPriceOnSite
  return true
}

export default function HumidifiersCatalogAdmin() {
  const [humiProducts, setHumiProducts] = useState<HumiSteamProduct[]>([])
  const [heaterProducts, setHeaterProducts] = useState<HeaterSteamProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [treeNodeId, setTreeNodeId] = useState('humisteam')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, ProductEditorDraft>>({})
  const [mediaState, setMediaState] = useState<Record<string, ProductEditorMedia>>({})
  const [tabsState, setTabsState] = useState<Record<string, ProductEditorTabs>>({})
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const allItems = useMemo(
    () => filterHumidifierProducts(humiProducts, heaterProducts, 'all', ''),
    [heaterProducts, humiProducts]
  )

  const loadCatalog = useCallback(async () => {
    setLoading(true)
    try {
      const [humiRes, heaterRes] = await Promise.all([
        fetch('/api/admin/catalog?catalog=humisteam', { cache: 'no-store' }),
        fetch('/api/admin/catalog?catalog=heatersteam', { cache: 'no-store' }),
      ])
      const humi = (await humiRes.json()) as HumiSteamProduct[]
      const heater = (await heaterRes.json()) as HeaterSteamProduct[]
      setHumiProducts(humi)
      setHeaterProducts(heater)

      const items = filterHumidifierProducts(humi, heater, 'all', '')
      const nextDrafts: Record<string, ProductEditorDraft> = {}
      const nextMedia: Record<string, ProductEditorMedia> = {}
      const nextTabs: Record<string, ProductEditorTabs> = {}
      for (const item of items) {
        const key = itemKey(item)
        nextDrafts[key] = productToDraft(item.product)
        nextMedia[key] = productToMedia(item.product)
        nextTabs[key] = productToTabs(item.product)
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

  const filteredItems = useMemo(
    () =>
      filterHumidifierProducts(humiProducts, heaterProducts, treeNodeId, search).filter((item) =>
        matchesStatusFilter(item, statusFilter)
      ),
    [heaterProducts, humiProducts, search, statusFilter, treeNodeId]
  )

  const rows = useMemo(() => filteredItems.map(toRow), [filteredItems])

  const exportHref = useMemo(
    () =>
      buildCatalogExportHref(
        filteredItems.map((item) => ({
          catalog: item.catalogKey,
          id: item.product.id,
        }))
      ),
    [filteredItems]
  )

  const selectedItem = useMemo(() => {
    if (!selectedKey) return null
    return allItems.find((item) => itemKey(item) === selectedKey) ?? null
  }, [allItems, selectedKey])

  const updateDraft = (key: string, field: keyof ProductEditorDraft, value: string | boolean) => {
    setDrafts((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }

  const applyUpdatedProduct = (catalogKey: CatalogKey, updated: HumiSteamProduct | HeaterSteamProduct) => {
    if (catalogKey === 'humisteam') {
      setHumiProducts((prev) => {
        const exists = prev.some((p) => p.id === updated.id)
        if (exists) {
          return prev.map((p) => (p.id === updated.id ? (updated as HumiSteamProduct) : p))
        }
        return [...prev, updated as HumiSteamProduct]
      })
    } else {
      setHeaterProducts((prev) => {
        const exists = prev.some((p) => p.id === updated.id)
        if (exists) {
          return prev.map((p) => (p.id === updated.id ? (updated as HeaterSteamProduct) : p))
        }
        return [...prev, updated as HeaterSteamProduct]
      })
    }
    const key = `${catalogKey}:${updated.id}`
    setDrafts((prev) => ({ ...prev, [key]: productToDraft(updated) }))
    setMediaState((prev) => ({ ...prev, [key]: productToMedia(updated) }))
    setTabsState((prev) => ({ ...prev, [key]: productToTabs(updated) }))
    setSelectedKey(key)
  }

  const saveSelected = async () => {
    if (!selectedItem || !selectedKey) return
    const draft = drafts[selectedKey]
    const media = mediaState[selectedKey]
    const tabs = tabsState[selectedKey]
    if (!draft || !media || !tabs) return

    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/catalog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalog: selectedItem.catalogKey,
          id: selectedItem.product.id,
          patch: draftToPatch(draft, media, tabs),
        }),
      })
      if (!response.ok) throw new Error('save failed')
      const result = await response.json()
      applyUpdatedProduct(
        selectedItem.catalogKey,
        result.product as HumiSteamProduct | HeaterSteamProduct
      )
      setMessage({ type: 'success', text: `Сохранено: ${selectedItem.product.sku}` })
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сохранения' })
    } finally {
      setSaving(false)
    }
  }

  const duplicateProduct = async (rowKey: string) => {
    const parsed = parseItemKey(rowKey)
    if (!parsed) return

    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalog: parsed.catalogKey,
          action: 'duplicate',
          id: parsed.id,
        }),
      })
      if (!response.ok) throw new Error('duplicate failed')
      const result = await response.json()
      applyUpdatedProduct(
        parsed.catalogKey,
        result.product as HumiSteamProduct | HeaterSteamProduct
      )
      setMessage({ type: 'success', text: 'Создана копия товара' })
    } catch {
      setMessage({ type: 'error', text: 'Ошибка дублирования' })
    } finally {
      setSaving(false)
    }
  }

  const createProduct = async () => {
    const context = resolveCreateContext(treeNodeId)
    setCreating(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalog: context.catalog,
          action: 'create',
          modelId: context.modelId,
          variantId: context.variantId,
        }),
      })
      if (!response.ok) throw new Error('create failed')
      const result = await response.json()
      applyUpdatedProduct(
        context.catalog,
        result.product as HumiSteamProduct | HeaterSteamProduct
      )
      setMessage({ type: 'success', text: 'Создан новый товар' })
    } catch {
      setMessage({ type: 'error', text: 'Ошибка создания товара' })
    } finally {
      setCreating(false)
    }
  }

  const hideSelected = async () => {
    if (!selectedItem || !selectedKey) return
    const draft = drafts[selectedKey]
    const media = mediaState[selectedKey]
    const tabs = tabsState[selectedKey]
    if (!draft || !media || !tabs) return

    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/catalog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalog: selectedItem.catalogKey,
          id: selectedItem.product.id,
          patch: { ...draftToPatch(draft, media, tabs), published: false },
        }),
      })
      if (!response.ok) throw new Error('hide failed')
      const result = await response.json()
      applyUpdatedProduct(
        selectedItem.catalogKey,
        result.product as HumiSteamProduct | HeaterSteamProduct
      )
      setMessage({ type: 'success', text: 'Товар скрыт с сайта' })
    } catch {
      setMessage({ type: 'error', text: 'Ошибка скрытия товара' })
    } finally {
      setSaving(false)
    }
  }

  const deleteSelected = async () => {
    if (!selectedItem) return
    if (
      !window.confirm(
        `Удалить товар ${selectedItem.product.sku}? Это действие нельзя отменить.`
      )
    ) {
      return
    }

    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch(
        `/api/admin/catalog?catalog=${selectedItem.catalogKey}&id=${encodeURIComponent(selectedItem.product.id)}`,
        { method: 'DELETE' }
      )
      if (!response.ok) throw new Error('delete failed')

      if (selectedItem.catalogKey === 'humisteam') {
        setHumiProducts((prev) => prev.filter((p) => p.id !== selectedItem.product.id))
      } else {
        setHeaterProducts((prev) => prev.filter((p) => p.id !== selectedItem.product.id))
      }
      setDrafts((prev) => {
        const next = { ...prev }
        delete next[selectedKey!]
        return next
      })
      setSelectedKey(null)
      setMessage({ type: 'success', text: 'Товар удалён' })
    } catch {
      setMessage({ type: 'error', text: 'Ошибка удаления' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (key: string) => {
    const item = allItems.find((entry) => itemKey(entry) === key)
    if (item) {
      setDrafts((prev) => ({
        ...prev,
        [key]: prev[key] ?? productToDraft(item.product),
      }))
      setMediaState((prev) => ({
        ...prev,
        [key]: prev[key] ?? productToMedia(item.product),
      }))
      setTabsState((prev) => ({
        ...prev,
        [key]: prev[key] ?? productToTabs(item.product),
      }))
    }
    setSelectedKey(key)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Увлажнители"
        description="Управление каталогом humiSteam и heaterSteam."
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
            tree={CATALOG_TREE}
            activeId={treeNodeId}
            onSelect={setTreeNodeId}
            title="Каталог увлажнителей"
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
                className={`min-w-0 flex-1 overflow-y-auto ${selectedItem ? 'lg:max-w-[55%]' : ''}`}
              >
                {viewMode === 'table' ? (
                  <ProductTable
                    rows={rows}
                    selectedId={selectedKey}
                    onEdit={handleEdit}
                    onDuplicate={(id) => void duplicateProduct(id)}
                  />
                ) : (
                  <ProductGrid
                    rows={rows}
                    selectedId={selectedKey}
                    onEdit={handleEdit}
                    onDuplicate={(id) => void duplicateProduct(id)}
                  />
                )}
              </div>

              {selectedItem && selectedKey && drafts[selectedKey] && mediaState[selectedKey] && tabsState[selectedKey] ? (
                <div className="fixed inset-0 z-[220] flex flex-col bg-white lg:static lg:z-auto lg:w-[45%] lg:shrink-0 lg:border-l lg:border-gray-200">
                  <ProductEditorPanel
                    catalogKey={selectedItem.catalogKey}
                    productId={selectedItem.product.id}
                    sku={selectedItem.product.sku}
                    performanceLabel={`${selectedItem.product.performanceKgH} кг/ч`}
                    siteUrl={getHumidifierSiteUrl(selectedItem)}
                    draft={drafts[selectedKey]}
                    media={mediaState[selectedKey]}
                    tabs={tabsState[selectedKey]}
                    saving={saving}
                    onDraftChange={(field, value) => updateDraft(selectedKey, field, value)}
                    onMediaChange={(media) => setMediaState((prev) => ({ ...prev, [selectedKey]: media }))}
                    onTabsChange={(tabs) => setTabsState((prev) => ({ ...prev, [selectedKey]: tabs }))}
                    onSave={() => void saveSelected()}
                    onDuplicate={() => void duplicateProduct(selectedKey)}
                    onHide={() => void hideSelected()}
                    onDelete={() => void deleteSelected()}
                    onClose={() => setSelectedKey(null)}
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
