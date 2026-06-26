'use client'

import { useId, useState } from 'react'
import { useUploadFile } from '@/hooks/useUploadFile'
import type { ProductDocument, ProductTabContent, ProductTabId, ProductTabsEnabled } from '@/lib/catalogProductExtras'
import { HUMISTEAM_PRODUCT_TABS } from '@/lib/humisteamProductTabs'
import { COMPONENT_PRODUCT_TABS } from '@/lib/componentProductTabs'
import type { CatalogKey } from '@/lib/catalogTypes'

type ProductTabsEditorProps = {
  catalogKey: CatalogKey
  tabsEnabled: ProductTabsEnabled
  tabContent: ProductTabContent
  documents: ProductDocument[]
  onTabsEnabledChange: (tabsEnabled: ProductTabsEnabled) => void
  onTabContentChange: (tabContent: ProductTabContent) => void
  onDocumentsChange: (documents: ProductDocument[]) => void
}

const TAB_LABELS: Record<ProductTabId, string> = {
  installation: 'Монтаж',
  series: 'Описание серии',
  documents: 'Документы',
  delivery: 'Доставка',
  payment: 'Оплата',
}

export default function ProductTabsEditor({
  catalogKey,
  tabsEnabled,
  tabContent,
  documents,
  onTabsEnabledChange,
  onTabContentChange,
  onDocumentsChange,
}: ProductTabsEditorProps) {
  const pdfInputId = useId()
  const [uploadError, setUploadError] = useState<string | null>(null)
  const { upload, uploading } = useUploadFile()

  const tabDefs =
    catalogKey === 'components'
      ? COMPONENT_PRODUCT_TABS.map((t) => ({ id: t.id as ProductTabId, label: t.label }))
      : HUMISTEAM_PRODUCT_TABS

  const toggleTab = (id: ProductTabId, checked: boolean) => {
    onTabsEnabledChange({ ...tabsEnabled, [id]: checked })
  }

  const addPdf = async (file: File) => {
    setUploadError(null)
    try {
      const saved = await upload(file, 'pdf')
      const title = file.name.replace(/\.pdf$/i, '')
      onDocumentsChange([
        ...documents,
        { id: `doc-${Date.now()}`, title, url: saved.url },
      ])
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Не удалось загрузить PDF')
    }
  }

  return (
    <section className="space-y-4 rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-[#232326]">Вкладки карточки</h3>

      <div className="flex flex-wrap gap-3">
        {tabDefs.map((tab) => (
          <label key={tab.id} className="flex items-center gap-2 text-sm text-[#232326]/80">
            <input
              type="checkbox"
              checked={tabsEnabled[tab.id] !== false}
              onChange={(e) => toggleTab(tab.id, e.target.checked)}
              className="rounded"
            />
            {TAB_LABELS[tab.id] ?? tab.label}
          </label>
        ))}
      </div>

      {catalogKey !== 'components' ? (
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-[#232326]/70">Текст вкладки «Монтаж»</span>
          <textarea
            value={tabContent.installationText}
            onChange={(e) =>
              onTabContentChange({ ...tabContent, installationText: e.target.value })
            }
            rows={4}
            placeholder="Пусто — стандартный текст серии"
            className="w-full rounded-[5px] border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
      ) : null}

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-[#232326]/70">
          Текст вкладки «Описание серии»
        </span>
        <textarea
          value={tabContent.seriesText}
          onChange={(e) => onTabContentChange({ ...tabContent, seriesText: e.target.value })}
          rows={4}
          placeholder="Пусто — стандартный текст серии"
          className="w-full rounded-[5px] border border-gray-300 px-3 py-2 text-sm"
        />
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-[#232326]/70">PDF-документы</span>
          <label
            htmlFor={pdfInputId}
            className={`rounded-[5px] border border-gray-300 px-2.5 py-1 text-xs font-medium hover:bg-gray-50 ${
              uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'
            }`}
          >
            {uploading ? 'Загрузка…' : '+ PDF'}
          </label>
        </div>
        <input
          id={pdfInputId}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void addPdf(file)
            e.target.value = ''
          }}
        />
        {uploadError ? <p className="mb-2 text-xs font-medium text-red-700">{uploadError}</p> : null}
        {documents.length === 0 ? (
          <p className="text-xs text-[#232326]/50">Нет прикреплённых PDF</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc, index) => (
              <li key={doc.id} className="flex items-center gap-2 rounded border border-gray-200 p-2">
                <input
                  type="text"
                  value={doc.title}
                  onChange={(e) => {
                    const next = [...documents]
                    next[index] = { ...doc, title: e.target.value }
                    onDocumentsChange(next)
                  }}
                  className="min-w-0 flex-1 rounded border border-gray-200 px-2 py-1 text-sm"
                />
                <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-[#E62614] hover:underline">
                  Открыть
                </a>
                <button
                  type="button"
                  onClick={() => onDocumentsChange(documents.filter((d) => d.id !== doc.id))}
                  className="text-xs text-red-700"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
