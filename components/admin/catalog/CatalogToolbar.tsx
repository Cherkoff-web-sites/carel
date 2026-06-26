'use client'

type ViewMode = 'table' | 'grid'
type StatusFilter = 'all' | 'published' | 'hidden' | 'price-visible' | 'price-hidden'

type CatalogToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: StatusFilter
  onStatusFilterChange: (value: StatusFilter) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  totalCount: number
  onCreate?: () => void
  creating?: boolean
  exportHref?: string
  bulkHref?: string
}

export default function CatalogToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  totalCount,
  onCreate,
  creating = false,
  exportHref,
  bulkHref = '/admin/catalog/bulk',
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
        <label className="text-xs font-medium text-[#232326]/60">
          Статус
          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)}
            className="ml-2 rounded-[5px] border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-[#232326]"
          >
            <option value="all">Все товары</option>
            <option value="published">Опубликованные</option>
            <option value="hidden">Скрытые</option>
            <option value="price-visible">Цена видна на сайте</option>
            <option value="price-hidden">Цена скрыта на сайте</option>
          </select>
        </label>
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
          {bulkHref ? (
            <a
              href={bulkHref}
              className="rounded-[5px] border border-[#E62614]/30 bg-[#E62614]/5 px-3 py-2 text-sm font-medium text-[#E62614] hover:bg-[#E62614]/10"
            >
              Массовое редактирование
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

export type { StatusFilter, ViewMode }
