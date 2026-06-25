'use client'

import AdminInactiveField from '@/components/admin/AdminInactiveField'

type ViewMode = 'table' | 'grid'

type CatalogToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  totalCount: number
  onCreate?: () => void
  creating?: boolean
  exportHref?: string
}

export default function CatalogToolbar({
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalCount,
  onCreate,
  creating = false,
  exportHref,
}: CatalogToolbarProps) {
  return (
    <div className="shrink-0 space-y-3 border-b border-gray-200 bg-white px-3 py-3 sm:px-4">
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Поиск по SKU или названию…"
        className="w-full rounded-[5px] border border-gray-300 px-3 py-2.5 text-sm"
      />

      <div className="flex flex-wrap items-center gap-2">
        <AdminInactiveField label="Статус: все" />
        <AdminInactiveField label="Черновики" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-[#232326]/60">{totalCount} поз.</span>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-[5px] border border-gray-200 p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`rounded px-3 py-1.5 text-sm font-medium ${
                viewMode === 'table' ? 'bg-[#232326] text-white' : 'text-[#232326]/70'
              }`}
            >
              Таблица
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`rounded px-3 py-1.5 text-sm font-medium ${
                viewMode === 'grid' ? 'bg-[#232326] text-white' : 'text-[#232326]/70'
              }`}
            >
              Карточки
            </button>
          </div>
          {exportHref ? (
            <a
              href={exportHref}
              className="rounded-[5px] border border-gray-300 px-3 py-2 text-sm font-medium text-[#232326] hover:bg-gray-50"
            >
              Excel
            </a>
          ) : null}
          {onCreate ? (
            <button
              type="button"
              onClick={onCreate}
              disabled={creating}
              className="rounded-[5px] bg-[#232326] px-3 py-2 text-sm font-semibold text-white hover:bg-[#232326]/90 disabled:opacity-50"
            >
              {creating ? 'Создание…' : '+ Товар'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export type { ViewMode }
