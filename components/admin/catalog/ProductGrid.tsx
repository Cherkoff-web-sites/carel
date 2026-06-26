import Image from 'next/image'
import { formatAdminPrice } from '@/lib/adminCatalogFilters'
import type { AdminProductRow } from '@/components/admin/catalog/ProductTable'

type ProductGridProps = {
  rows: AdminProductRow[]
  selectedId: string | null
  onEdit: (id: string) => void
  onDuplicate?: (id: string) => void
}

export default function ProductGrid({ rows, selectedId, onEdit, onDuplicate }: ProductGridProps) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-center text-sm text-[#232326]/55">
        В выбранном разделе нет товаров.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4 xl:grid-cols-3">
      {rows.map((row) => {
        const selected = selectedId === row.id
        return (
          <article
            key={row.id}
            className={`overflow-hidden rounded-lg border bg-white shadow-sm ${
              selected ? 'border-[#E62614] ring-1 ring-[#E62614]/30' : 'border-gray-200'
            }`}
          >
            <div className="relative aspect-[4/3] bg-[#fafafa]">
              <Image src={row.image} alt={row.title} fill className="object-contain p-4" sizes="320px" />
            </div>
            <div className="space-y-2 p-4">
              <p className="font-mono text-xs font-semibold text-[#232326]/55">{row.sku}</p>
              <h3 className="line-clamp-2 text-sm font-semibold text-[#232326]">{row.title}</h3>
              {row.subtitle ? (
                <p className="text-xs text-[#232326]/60">{row.subtitle}</p>
              ) : null}
              <div className="flex flex-wrap gap-1 text-[11px] font-medium">
                {row.published === false ? (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600">скрыт</span>
                ) : (
                  <span className="rounded bg-green-50 px-1.5 py-0.5 text-green-700">опубликован</span>
                )}
                {row.showPriceOnSite ? (
                  <span className="rounded bg-blue-50 px-1.5 py-0.5 text-blue-700">цена на сайте</span>
                ) : (
                  <span className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-800">цена скрыта</span>
                )}
              </div>
              <p className="text-sm font-medium">{formatAdminPrice(row.price)}</p>
              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(row.id)}
                  className="w-full rounded-[5px] bg-[#E62614] py-2 text-sm font-semibold text-white hover:bg-[#E62614]/90"
                >
                  Редактировать
                </button>
                {onDuplicate ? (
                  <button
                    type="button"
                    onClick={() => onDuplicate(row.id)}
                    className="w-full rounded-[5px] border border-gray-300 bg-white py-2 text-sm font-medium text-[#232326] hover:bg-gray-50"
                  >
                    Дублировать
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
