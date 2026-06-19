import Image from 'next/image'
import { AdminDisabledButton } from '@/components/admin/AdminInactiveField'
import { formatAdminPrice } from '@/lib/adminCatalogFilters'

export type AdminProductRow = {
  id: string
  sku: string
  title: string
  image: string
  price: number
  subtitle?: string
}

type ProductTableProps = {
  rows: AdminProductRow[]
  selectedId: string | null
  onEdit: (id: string) => void
}

function MobileProductList({
  rows,
  selectedId,
  onEdit,
}: ProductTableProps) {
  return (
    <ul className="divide-y divide-gray-100 md:hidden">
      {rows.map((row) => {
        const selected = selectedId === row.id
        return (
          <li key={row.id}>
            <button
              type="button"
              onClick={() => onEdit(row.id)}
              className={`flex w-full gap-3 p-4 text-left transition-colors ${
                selected ? 'bg-[#E62614]/5' : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded border border-gray-200 bg-white">
                <Image src={row.image} alt="" fill className="object-contain p-1" sizes="56px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-semibold text-[#232326]/70">{row.sku}</p>
                <p className="mt-0.5 line-clamp-2 text-sm font-medium text-[#232326]">{row.title}</p>
                {row.subtitle ? (
                  <p className="mt-1 text-xs text-[#232326]/60">{row.subtitle}</p>
                ) : null}
                <p className="mt-1 text-sm font-semibold text-[#232326]">{formatAdminPrice(row.price)}</p>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default function ProductTable({ rows, selectedId, onEdit }: ProductTableProps) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-[#232326]/55 sm:p-12">
        В выбранном разделе нет товаров.
      </div>
    )
  }

  return (
    <>
      <MobileProductList rows={rows} selectedId={selectedId} onEdit={onEdit} />

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-[#232326]/55">
            <tr>
              <th className="px-4 py-3">Фото</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Параметры</th>
              <th className="px-4 py-3">Цена</th>
              <th className="px-4 py-3">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => {
              const selected = selectedId === row.id
              return (
                <tr
                  key={row.id}
                  className={selected ? 'bg-[#E62614]/5' : 'hover:bg-gray-50/80'}
                >
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded border border-gray-200 bg-white">
                      <Image src={row.image} alt="" fill className="object-contain p-1" sizes="48px" />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-[#232326]">{row.sku}</td>
                  <td className="max-w-xs px-4 py-3">
                    <p className="line-clamp-2 font-medium text-[#232326]">{row.title}</p>
                  </td>
                  <td className="px-4 py-3 text-[#232326]/65">{row.subtitle ?? '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatAdminPrice(row.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(row.id)}
                        className="rounded-[5px] bg-[#E62614] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#E62614]/90"
                      >
                        Редактировать
                      </button>
                      <AdminDisabledButton>Дублировать</AdminDisabledButton>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
