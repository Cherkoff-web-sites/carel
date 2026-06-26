'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { useUploadFile } from '@/hooks/useUploadFile'
import type { CatalogKey } from '@/lib/catalogTypes'
import type { ProductTabId } from '@/lib/catalogProductExtras'

type BulkRow = {
  key: string
  catalog: CatalogKey
  id: string
  sku: string
  title: string
  price: number
  published: boolean
  showPriceOnSite: boolean
  image: string
}

type CatalogFilter = 'all' | CatalogKey

const TAB_OPTIONS: { id: ProductTabId; label: string }[] = [
  { id: 'installation', label: 'Монтаж' },
  { id: 'series', label: 'Серия' },
  { id: 'documents', label: 'Документы' },
  { id: 'delivery', label: 'Доставка' },
  { id: 'payment', label: 'Оплата' },
]

export default function BulkCatalogAdmin() {
  const [rows, setRows] = useState<BulkRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<CatalogFilter>('all')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [bulkPrice, setBulkPrice] = useState('')
  const [bulkTab, setBulkTab] = useState<ProductTabId>('delivery')
  const [bulkTabEnabled, setBulkTabEnabled] = useState(true)
  const [bulkSeriesText, setBulkSeriesText] = useState('')
  const { upload, uploading } = useUploadFile()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [humi, heater, components] = await Promise.all([
        fetch('/api/admin/catalog?catalog=humisteam', { cache: 'no-store' }),
        fetch('/api/admin/catalog?catalog=heatersteam', { cache: 'no-store' }),
        fetch('/api/admin/catalog?catalog=components', { cache: 'no-store' }),
      ])
      const humiData = (await humi.json()) as Array<Record<string, unknown>>
      const heaterData = (await heater.json()) as Array<Record<string, unknown>>
      const compData = (await components.json()) as Array<Record<string, unknown>>

      const next: BulkRow[] = [
        ...humiData.map((p) => ({
          key: `humisteam:${String(p.id)}`,
          catalog: 'humisteam' as const,
          id: String(p.id),
          sku: String(p.sku),
          title: String(p.title),
          price: Number(p.price) || 0,
          published: p.published !== false,
          showPriceOnSite: Boolean(p.showPriceOnSite),
          image: String(p.image ?? ''),
        })),
        ...heaterData.map((p) => ({
          key: `heatersteam:${String(p.id)}`,
          catalog: 'heatersteam' as const,
          id: String(p.id),
          sku: String(p.sku),
          title: String(p.title),
          price: Number(p.price) || 0,
          published: p.published !== false,
          showPriceOnSite: Boolean(p.showPriceOnSite),
          image: String(p.image ?? ''),
        })),
        ...compData.map((p) => ({
          key: `components:${String(p.id)}`,
          catalog: 'components' as const,
          id: String(p.id),
          sku: String(p.sku),
          title: String(p.title),
          price: Number(p.price) || 0,
          published: p.published !== false,
          showPriceOnSite: Boolean(p.showPriceOnSite),
          image: String(p.image ?? ''),
        })),
      ]
      setRows(next.sort((a, b) => a.sku.localeCompare(b.sku, 'ru')))
    } catch {
      setMessage({ type: 'error', text: 'Не удалось загрузить каталог' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    if (filter === 'all') return rows
    return rows.filter((row) => row.catalog === filter)
  }, [filter, rows])

  const selectedItems = useMemo(
    () =>
      filtered
        .filter((row) => selected.has(row.key))
        .map((row) => ({ catalog: row.catalog, id: row.id })),
    [filtered, selected]
  )

  const toggleAll = () => {
    if (selectedItems.length === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((row) => row.key)))
    }
  }

  const toggleRow = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const applyBulk = async (patch: Record<string, unknown>) => {
    if (selectedItems.length === 0) {
      setMessage({ type: 'error', text: 'Выберите хотя бы один товар' })
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/catalog/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: selectedItems, patch }),
      })
      if (!response.ok) throw new Error('bulk failed')
      const result = await response.json()
      setMessage({ type: 'success', text: `Обновлено товаров: ${result.updated}` })
      setSelected(new Set())
      await load()
    } catch {
      setMessage({ type: 'error', text: 'Ошибка массового обновления' })
    } finally {
      setSaving(false)
    }
  }

  const handleBulkImage = async (file: File) => {
    const saved = await upload(file, 'image')
    await applyBulk({ image: saved.url, galleryImages: [saved.url] })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Массовое табличное редактирование"
        description="Выделите товары в таблице и примените цену, публикацию, фото или вкладки ко всем выбранным позициям."
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

      <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as CatalogFilter)}
            className="rounded-[5px] border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="all">Все каталоги</option>
            <option value="humisteam">humiSteam</option>
            <option value="heatersteam">heaterSteam</option>
            <option value="components">Запчасти</option>
          </select>
          <a
            href={`/api/admin/catalog/export${filter !== 'all' ? `?catalog=${filter}` : ''}`}
            className="rounded-[5px] border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Выгрузить Excel
          </a>
          <span className="text-sm text-[#232326]/55">{filtered.length} поз. · выбрано {selectedItems.length}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-end gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <label className="text-sm">
            <span className="mb-1 block text-xs text-[#232326]/60">Цена</span>
            <input
              type="number"
              min={0}
              value={bulkPrice}
              onChange={(e) => setBulkPrice(e.target.value)}
              className="w-28 rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
          </label>
          <button
            type="button"
            disabled={saving}
            onClick={() => void applyBulk({ price: Number(bulkPrice) || 0 })}
            className="rounded-[5px] bg-[#232326] px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Применить цену
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void applyBulk({ published: true })}
            className="rounded-[5px] border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            Опубликовать
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void applyBulk({ published: false })}
            className="rounded-[5px] border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            Скрыть
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void applyBulk({ showPriceOnSite: true })}
            className="rounded-[5px] border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            Цена на сайте: вкл
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void applyBulk({ showPriceOnSite: false })}
            className="rounded-[5px] border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            Цена на сайте: выкл
          </button>
          <label className="text-sm">
            <span className="mb-1 block text-xs text-[#232326]/60">Фото</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading || saving}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleBulkImage(file)
                e.target.value = ''
              }}
              className="max-w-[180px] text-xs"
            />
          </label>
          <select
            value={bulkTab}
            onChange={(e) => setBulkTab(e.target.value as ProductTabId)}
            className="rounded border border-gray-300 px-2 py-1.5 text-sm"
          >
            {TAB_OPTIONS.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={saving}
            onClick={() =>
              void applyBulk({
                tabsEnabled: { [bulkTab]: bulkTabEnabled },
              })
            }
            className="rounded-[5px] border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            Вкладка {bulkTabEnabled ? 'вкл' : 'выкл'}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              setBulkTabEnabled((v) => !v)
            }}
            className="rounded-[5px] border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            Режим: {bulkTabEnabled ? 'включить' : 'выключить'}
          </button>
          <input
            type="text"
            value={bulkSeriesText}
            onChange={(e) => setBulkSeriesText(e.target.value)}
            placeholder="Текст вкладки «Серия»"
            className="min-w-[200px] flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
          <button
            type="button"
            disabled={saving || !bulkSeriesText.trim()}
            onClick={() => void applyBulk({ tabContent: { seriesText: bulkSeriesText } })}
            className="rounded-[5px] border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            Текст серии
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {loading ? (
          <p className="p-6 text-sm text-[#232326]/60">Загрузка…</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-[#232326]/55">
              <tr>
                <th className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedItems.length === filtered.length}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-3 py-2">Каталог</th>
                <th className="px-3 py-2">Фото</th>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Название</th>
                <th className="px-3 py-2">Цена</th>
                <th className="px-3 py-2">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row) => (
                <tr key={row.key} className={selected.has(row.key) ? 'bg-[#E62614]/5' : ''}>
                  <td className="px-3 py-2">
                    <input type="checkbox" checked={selected.has(row.key)} onChange={() => toggleRow(row.key)} />
                  </td>
                  <td className="px-3 py-2 text-xs">{row.catalog}</td>
                  <td className="px-3 py-2">
                    {row.image ? (
                      <div className="relative h-10 w-10 overflow-hidden rounded border">
                        <Image src={row.image} alt="" fill className="object-contain" sizes="40px" unoptimized={row.image.startsWith('/uploads/')} />
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{row.sku}</td>
                  <td className="max-w-xs px-3 py-2">{row.title}</td>
                  <td className="px-3 py-2">{row.price > 0 ? row.price : '—'}</td>
                  <td className="px-3 py-2 text-xs">
                    {row.published ? 'опубл.' : 'скрыт'}
                    {row.showPriceOnSite ? ' · цена на сайте' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
