'use client'

import AdminInactiveField, { AdminDisabledButton } from '@/components/admin/AdminInactiveField'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

const STATUS_OPTIONS = ['Все статусы', 'new', 'in_progress', 'done', 'spam']

type LeadsTableProps = {
  type: 'contact' | 'orders'
}

export default function LeadsPlaceholderView({ type }: LeadsTableProps) {
  const isContact = type === 'contact'
  const colSpan = isContact ? 7 : 7

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title={isContact ? 'Обратная связь' : 'Заказы'}
        description={
          isContact
            ? 'Заявки без привязки к товарам: обратная связь и консультации.'
            : 'Заявки с составом корзины или одного товара с карточки.'
        }
        actions={
          <>
            <AdminDisabledButton>Скачать CSV</AdminDisabledButton>
            <AdminDisabledButton>Скачать Excel</AdminDisabledButton>
          </>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6">
        <div className="mb-4 space-y-2">
          <input
            type="search"
            placeholder="Поиск…"
            className="w-full rounded-[5px] border border-gray-300 bg-white px-3 py-2.5 text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <select className="min-w-0 flex-1 rounded-[5px] border border-gray-300 bg-white px-3 py-2.5 text-sm sm:flex-none">
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <AdminInactiveField label="Дата от" />
            <AdminInactiveField label="Дата до" />
            {isContact ? null : <AdminInactiveField label="Режим: сводная" />}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-[#232326]/55">
                <tr>
                  <th className="px-3 py-3 sm:px-4">Дата</th>
                  <th className="px-3 py-3 sm:px-4">Имя</th>
                  <th className="px-3 py-3 sm:px-4">Телефон</th>
                  <th className="px-3 py-3 sm:px-4">Email</th>
                  {isContact ? (
                    <>
                      <th className="px-3 py-3 sm:px-4">Сообщение</th>
                      <th className="px-3 py-3 sm:px-4">Источник</th>
                    </>
                  ) : (
                    <>
                      <th className="px-3 py-3 sm:px-4">Позиций</th>
                      <th className="px-3 py-3 sm:px-4">Состав</th>
                    </>
                  )}
                  <th className="px-3 py-3 sm:px-4">Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={colSpan} className="px-4 py-12 text-center text-[#232326]/50 sm:py-16">
                    Заявок пока нет
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
