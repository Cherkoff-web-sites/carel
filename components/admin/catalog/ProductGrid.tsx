import Image from 'next/image'
import { formatAdminPrice } from '@/lib/adminCatalogFilters'
import type { AdminProductRow } from '@/components/admin/catalog/ProductTable'

type ProductGridProps = {
  rows: AdminProductRow[]
  selectedId: string | null
  onEdit: (id: string) => void
}

export default function ProductGrid({ rows, selectedId, onEdit }: ProductGridProps) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-center text-sm text-[#232326]/55">
        В выбранном разделе нет товаров.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
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
              <p className="text-sm font-medium">{formatAdminPrice(row.price)}</p>
              <button
                type="button"
                onClick={() => onEdit(row.id)}
                className="w-full rounded-[5px] bg-[#E62614] py-2 text-sm font-semibold text-white hover:bg-[#E62614]/90"
              >
                Редактировать
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
