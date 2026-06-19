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
  filterHumidifierProducts,
  getHumidifierSiteUrl,
  type HumidifierAdminItem,
} from '@/lib/adminCatalogFilters'
import { CATALOG_TREE } from '@/lib/catalogData'
import type { HeaterSteamProduct } from '@/lib/heatersteamData'
import type { HumiSteamProduct } from '@/lib/humisteamData'

function itemKey(item: HumidifierAdminItem): string {
  return `${item.catalogKey}:${item.product.id}`
}

function toDraft(item: HumidifierAdminItem): ProductEditorDraft {
  return {
    title: item.product.title,
    description: item.product.description,
    price: String(item.product.price),
  }
}

function toRow(item: HumidifierAdminItem): AdminProductRow {
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
  }
}

export default function HumidifiersCatalogAdmin() {
  const [humiProducts, setHumiProducts] = useState<HumiSteamProduct[]>([])
  const [heaterProducts, setHeaterProducts] = useState<HeaterSteamProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [treeNodeId, setTreeNodeId] = useState('humisteam')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, ProductEditorDraft>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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
      for (const item of items) {
        nextDrafts[itemKey(item)] = toDraft(item)
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

  const filteredItems = useMemo(
    () => filterHumidifierProducts(humiProducts, heaterProducts, treeNodeId, search),
    [heaterProducts, humiProducts, search, treeNodeId]
  )

  const rows = useMemo(() => filteredItems.map(toRow), [filteredItems])

  const selectedItem = useMemo(() => {
    if (!selectedKey) return null
    return filteredItems.find((item) => itemKey(item) === selectedKey) ?? null
  }, [filteredItems, selectedKey])

  const updateDraft = (key: string, field: keyof ProductEditorDraft, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }

  const saveSelected = async () => {
    if (!selectedItem || !selectedKey) return
    const draft = drafts[selectedKey]
    if (!draft) return

    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/catalog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catalog: selectedItem.catalogKey,
          id: selectedItem.product.id,
          patch: {
            title: draft.title,
            description: draft.description,
            price: Number(draft.price) || 0,
          },
        }),
      })
      if (!response.ok) throw new Error('save failed')
      const result = await response.json()
      const updated = result.product as HumiSteamProduct | HeaterSteamProduct

      if (selectedItem.catalogKey === 'humisteam') {
        setHumiProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? (updated as HumiSteamProduct) : p))
        )
      } else {
        setHeaterProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? (updated as HeaterSteamProduct) : p))
        )
      }
      setMessage({ type: 'success', text: `Сохранено: ${updated.sku}` })
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сохранения' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (key: string) => {
    const item = filteredItems.find((entry) => itemKey(entry) === key)
    if (item) {
      setDrafts((prev) => ({ ...prev, [key]: prev[key] ?? toDraft(item) }))
    }
    setSelectedKey(key)
  }

  return (
    <>
      <AdminPageHeader
        title="Увлажнители"
        description="Управление каталогом humiSteam и heaterSteam."
      />

      {message ? (
        <div
          className={`mx-6 mt-4 rounded-[5px] px-4 py-3 text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="w-full shrink-0 lg:w-[280px]">
          <AdminTree
            tree={CATALOG_TREE}
            activeId={treeNodeId}
            onSelect={setTreeNodeId}
            title="Каталог увлажнителей"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <CatalogToolbar
            search={search}
            onSearchChange={setSearch}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalCount={rows.length}
          />

          {loading ? (
            <p className="p-8 text-sm text-[#232326]/60">Загрузка товаров…</p>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
              <div className={`min-w-0 flex-1 overflow-y-auto ${selectedItem ? 'xl:max-w-[55%]' : ''}`}>
                {viewMode === 'table' ? (
                  <ProductTable rows={rows} selectedId={selectedKey} onEdit={handleEdit} />
                ) : (
                  <ProductGrid rows={rows} selectedId={selectedKey} onEdit={handleEdit} />
                )}
              </div>

              {selectedItem && selectedKey && drafts[selectedKey] ? (
                <div className="w-full shrink-0 border-t border-gray-200 xl:w-[45%] xl:border-l xl:border-t-0">
                  <ProductEditorPanel
                    catalogKey={selectedItem.catalogKey}
                    productId={selectedItem.product.id}
                    sku={selectedItem.product.sku}
                    image={selectedItem.product.image}
                    performanceLabel={`${selectedItem.product.performanceKgH} кг/ч`}
                    siteUrl={getHumidifierSiteUrl(selectedItem)}
                    draft={drafts[selectedKey]}
                    saving={saving}
                    onDraftChange={(field, value) => updateDraft(selectedKey, field, value)}
                    onSave={() => void saveSelected()}
                    onClose={() => setSelectedKey(null)}
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
