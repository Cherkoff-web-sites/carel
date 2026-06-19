'use client'

import AdminInactiveField, { AdminDisabledButton } from '@/components/admin/AdminInactiveField'

type ViewMode = 'table' | 'grid'

type CatalogToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  totalCount: number
}

export default function CatalogToolbar({
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalCount,
}: CatalogToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по SKU или названию…"
          className="w-full min-w-[200px] max-w-md rounded-[5px] border border-gray-300 px-3 py-2 text-sm sm:w-auto"
        />
        <AdminInactiveField label="Статус: все" />
        <AdminInactiveField label="Черновики" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-[#232326]/60">{totalCount} поз.</span>
        <div className="flex rounded-[5px] border border-gray-200 p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`rounded px-3 py-1 text-sm font-medium ${
              viewMode === 'table' ? 'bg-[#232326] text-white' : 'text-[#232326]/70'
            }`}
          >
            Таблица
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`rounded px-3 py-1 text-sm font-medium ${
              viewMode === 'grid' ? 'bg-[#232326] text-white' : 'text-[#232326]/70'
            }`}
          >
            Карточки
          </button>
        </div>
        <AdminDisabledButton>+ Товар</AdminDisabledButton>
      </div>
    </div>
  )
}

export type { ViewMode }
