'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import ProductMediaEditor from '@/components/admin/catalog/ProductMediaEditor'
import ProductTabsEditor from '@/components/admin/catalog/ProductTabsEditor'
import type {
  ProductEditorDraft,
  ProductEditorMedia,
  ProductEditorTabs,
} from '@/lib/adminProductDraft'
import type { CatalogKey } from '@/lib/catalogTypes'

type ProductEditorPanelProps = {
  catalogKey: CatalogKey
  productId: string
  sku: string
  siteUrl: string
  performanceLabel?: string
  draft: ProductEditorDraft
  media: ProductEditorMedia
  tabs: ProductEditorTabs
  saving: boolean
  onDraftChange: (field: keyof ProductEditorDraft, value: string | boolean) => void
  onMediaChange: (media: ProductEditorMedia) => void
  onTabsChange: (tabs: ProductEditorTabs) => void
  onSave: () => void
  onDuplicate: () => void
  onHide: () => void
  onDelete: () => void
  onClose: () => void
}

export default function ProductEditorPanel({
  catalogKey,
  sku,
  performanceLabel,
  siteUrl,
  draft,
  media,
  tabs,
  saving,
  onDraftChange,
  onMediaChange,
  onTabsChange,
  onSave,
  onDuplicate,
  onHide,
  onDelete,
  onClose,
}: ProductEditorPanelProps) {
  const sitePreviewBlocked = !draft.published

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#232326]/50">Редактор товара</p>
          <h2 className="mt-0.5 text-lg font-bold text-[#232326]">{sku}</h2>
          {!draft.published ? (
            <p className="mt-1 text-xs font-medium text-amber-700">Скрыт с сайта</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            onClick={onSave}
            disabled={saving}
            className="bg-[#E62614] px-3 py-2 text-sm text-white hover:bg-[#E62614]/90"
          >
            {saving ? 'Сохранение…' : 'Сохранить'}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm text-[#232326]/70 hover:bg-gray-100"
          >
            Закрыть
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
          <ProductMediaEditor
            image={media.image}
            galleryImages={media.galleryImages}
            onChange={onMediaChange}
          />

          <div className="space-y-5">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-[#232326]">Витрина</h3>
              <p className="rounded-[5px] bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                После изменения названия, цены, публикации или вкладок нажмите «Сохранить».
                Изменения сразу попадут на сайт.
              </p>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#232326]/70">Название на сайте</span>
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
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#232326]/70">Полное описание</span>
                <textarea
                  value={draft.fullDescription}
                  onChange={(e) => onDraftChange('fullDescription', e.target.value)}
                  rows={4}
                  className="w-full rounded-[5px] border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              {performanceLabel ? (
                <div>
                  <span className="mb-1 block text-xs font-medium text-[#232326]/70">Производительность</span>
                  <p className="text-sm text-[#232326]">{performanceLabel}</p>
                </div>
              ) : null}
              <label className="block max-w-xs">
                <span className="mb-1 block text-xs font-medium text-[#232326]/70">Цена (₽)</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={draft.price}
                  onChange={(e) => onDraftChange('price', e.target.value)}
                  className="w-full rounded-[5px] border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-[#232326]/80">
                <input
                  type="checkbox"
                  checked={draft.showPriceOnSite}
                  onChange={(e) => onDraftChange('showPriceOnSite', e.target.checked)}
                  className="rounded"
                />
                Показывать цену на сайте
              </label>
              <label className="flex items-center gap-2 text-sm text-[#232326]/80">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) => onDraftChange('published', e.target.checked)}
                  className="rounded"
                />
                Опубликован
              </label>
            </section>

            <ProductTabsEditor
              catalogKey={catalogKey}
              tabsEnabled={tabs.tabsEnabled}
              tabContent={tabs.tabContent}
              documents={tabs.documents}
              onTabsEnabledChange={(tabsEnabled) => onTabsChange({ ...tabs, tabsEnabled })}
              onTabContentChange={(tabContent) => onTabsChange({ ...tabs, tabContent })}
              onDocumentsChange={(documents) => onTabsChange({ ...tabs, documents })}
            />

            <section className="space-y-3 rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-[#232326]">SEO</h3>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#232326]/70">metaTitle</span>
                <input
                  type="text"
                  value={draft.metaTitle}
                  onChange={(e) => onDraftChange('metaTitle', e.target.value)}
                  className="w-full rounded-[5px] border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#232326]/70">metaDescription</span>
                <textarea
                  value={draft.metaDescription}
                  onChange={(e) => onDraftChange('metaDescription', e.target.value)}
                  rows={2}
                  className="w-full rounded-[5px] border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
            </section>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:px-5">
        <Button
          onClick={onSave}
          disabled={saving}
          className="w-full bg-[#E62614] text-white hover:bg-[#E62614]/90 sm:w-auto"
        >
          {saving ? 'Сохранение…' : 'Сохранить'}
        </Button>
        {sitePreviewBlocked ? (
          <span className="text-xs text-[#232326]/55">Ссылка на сайт недоступна — товар скрыт</span>
        ) : (
          <Link
            href={siteUrl}
            target="_blank"
            className="inline-flex w-full items-center justify-center py-2 text-sm font-medium text-[#E62614] hover:underline sm:w-auto sm:justify-start sm:py-0"
          >
            Открыть на сайте
          </Link>
        )}
        <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={onDuplicate}
            disabled={saving}
            className="rounded-[5px] border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-[#232326] hover:bg-gray-50 disabled:opacity-50"
          >
            Дублировать
          </button>
          <button
            type="button"
            onClick={onHide}
            disabled={saving || !draft.published}
            className="rounded-[5px] border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-[#232326] hover:bg-gray-50 disabled:opacity-50"
          >
            Скрыть
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={saving}
            className="rounded-[5px] border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  )
}

export type { ProductEditorDraft }
