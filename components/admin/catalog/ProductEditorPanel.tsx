'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import AdminInactiveField, { AdminDisabledButton } from '@/components/admin/AdminInactiveField'
import ProductImagePreview from '@/components/admin/catalog/ProductImagePreview'
import type { CatalogKey } from '@/lib/catalogTypes'

export type ProductEditorDraft = {
  title: string
  description: string
  fullDescription?: string
  price: string
}

type ProductEditorPanelProps = {
  catalogKey: CatalogKey
  productId: string
  sku: string
  image: string
  galleryCount?: number
  performanceLabel?: string
  siteUrl: string
  draft: ProductEditorDraft
  saving: boolean
  onDraftChange: (field: keyof ProductEditorDraft, value: string) => void
  onSave: () => void
  onClose: () => void
}

export default function ProductEditorPanel({
  catalogKey,
  sku,
  image,
  galleryCount,
  performanceLabel,
  siteUrl,
  draft,
  saving,
  onDraftChange,
  onSave,
  onClose,
}: ProductEditorPanelProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#232326]/50">Редактор товара</p>
          <h2 className="mt-0.5 text-lg font-bold text-[#232326]">{sku}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-3 py-1.5 text-sm text-[#232326]/70 hover:bg-gray-100"
        >
          Закрыть
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <ProductImagePreview src={image} alt={draft.title} galleryCount={galleryCount} />

          <div className="space-y-5">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-[#232326]">Витрина</h3>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#232326]/70">Название</span>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => onDraftChange('title', e.target.value)}
                  className="w-full rounded-[5px] border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#232326]/70">Краткое описание</span>
                <textarea
                  value={draft.description}
                  onChange={(e) => onDraftChange('description', e.target.value)}
                  rows={3}
                  className="w-full rounded-[5px] border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              {catalogKey === 'components' ? (
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-[#232326]/70">
                    Полное описание
                  </span>
                  <textarea
                    value={draft.fullDescription ?? ''}
                    onChange={(e) => onDraftChange('fullDescription', e.target.value)}
                    rows={4}
                    className="w-full rounded-[5px] border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>
              ) : null}
              {performanceLabel ? (
                <div>
                  <span className="mb-1 block text-xs font-medium text-[#232326]/70">Производительность</span>
                  <p className="text-sm text-[#232326]">{performanceLabel}</p>
                </div>
              ) : null}
              <label className="block max-w-xs">
                <span className="mb-1 block text-xs font-medium text-[#232326]/70">
                  Цена (0 = по запросу)
                </span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={draft.price}
                  onChange={(e) => onDraftChange('price', e.target.value)}
                  className="w-full rounded-[5px] border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-[#232326]/70">
                <input type="checkbox" checked readOnly disabled className="rounded" />
                Опубликован
              </label>
            </section>

            <section className="space-y-3 rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-[#232326]">Характеристики и вкладки</h3>
              <div className="flex flex-wrap gap-2">
                <AdminInactiveField label="Монтаж" />
                <AdminInactiveField label="Доставка" />
                <AdminInactiveField label="Оплата" />
                <AdminInactiveField label="Описание серии" />
              </div>
            </section>

            <section className="space-y-3 rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-[#232326]">SEO</h3>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#232326]/70">metaTitle</span>
                <input
                  type="text"
                  disabled
                  className="w-full cursor-not-allowed rounded-[5px] border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-[#232326]/50"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#232326]/70">metaDescription</span>
                <textarea
                  disabled
                  rows={2}
                  className="w-full cursor-not-allowed rounded-[5px] border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-[#232326]/50"
                />
              </label>
            </section>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4">
        <Button onClick={onSave} disabled={saving} className="bg-[#E62614] text-white hover:bg-[#E62614]/90">
          {saving ? 'Сохранение…' : 'Сохранить'}
        </Button>
        <Link
          href={siteUrl}
          target="_blank"
          className="text-sm font-medium text-[#E62614] hover:underline"
        >
          Открыть на сайте
        </Link>
        <AdminDisabledButton>Дублировать</AdminDisabledButton>
        <AdminDisabledButton>Скрыть</AdminDisabledButton>
        <AdminDisabledButton>Удалить</AdminDisabledButton>
      </div>
    </div>
  )
}
