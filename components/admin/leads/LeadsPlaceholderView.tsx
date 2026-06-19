'use client'

import AdminInactiveField, { AdminDisabledButton } from '@/components/admin/AdminInactiveField'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

const STATUS_OPTIONS = ['Все статусы', 'new', 'in_progress', 'done', 'spam']

type LeadsTableProps = {
  type: 'contact' | 'orders'
}

export default function LeadsPlaceholderView({ type }: LeadsTableProps) {
  const isContact = type === 'contact'

  return (
    <>
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

      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            type="search"
            placeholder="Поиск…"
            className="rounded-[5px] border border-gray-300 bg-white px-3 py-2 text-sm"
          />
          <select className="rounded-[5px] border border-gray-300 bg-white px-3 py-2 text-sm">
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <AdminInactiveField label="Дата от" />
          <AdminInactiveField label="Дата до" />
          {isContact ? null : <AdminInactiveField label="Режим: сводная" />}
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-[#232326]/55">
              <tr>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Телефон</th>
                <th className="px-4 py-3">Email</th>
                {isContact ? (
                  <>
                    <th className="px-4 py-3">Сообщение</th>
                    <th className="px-4 py-3">Источник</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3">Позиций</th>
                    <th className="px-4 py-3">Состав</th>
                  </>
                )}
                <th className="px-4 py-3">Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={isContact ? 7 : 7} className="px-4 py-16 text-center text-[#232326]/50">
                  Заявок пока нет
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
