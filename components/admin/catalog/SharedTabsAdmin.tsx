'use client'

import { useCallback, useEffect, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import Button from '@/components/ui/Button'
import type { SharedTabsData } from '@/lib/sharedTabsDefaults'

export default function SharedTabsAdmin() {
  const [draft, setDraft] = useState<SharedTabsData>({ deliveryText: '', paymentText: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/shared-tabs', { cache: 'no-store' })
      const data = (await response.json()) as SharedTabsData
      setDraft(data)
    } catch {
      setMessage({ type: 'error', text: 'Не удалось загрузить общие вкладки' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const save = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/shared-tabs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      if (!response.ok) throw new Error('save failed')
      setMessage({ type: 'success', text: 'Общие вкладки сохранены' })
    } catch {
      setMessage({ type: 'error', text: 'Ошибка сохранения' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Общие вкладки"
        description="Тексты «Доставка» и «Оплата» для всех карточек товаров. У каждого товара вкладку можно отключить отдельно."
      />

      {message ? (
        <div
          className={`mx-4 mt-3 rounded-[5px] px-4 py-3 text-sm sm:mx-6 sm:mt-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {loading ? (
          <p className="text-sm text-[#232326]/60">Загрузка…</p>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#232326]">Доставка</span>
              <textarea
                value={draft.deliveryText}
                onChange={(e) => setDraft((prev) => ({ ...prev, deliveryText: e.target.value }))}
                rows={14}
                className="w-full rounded-[5px] border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[#232326]">Оплата</span>
              <textarea
                value={draft.paymentText}
                onChange={(e) => setDraft((prev) => ({ ...prev, paymentText: e.target.value }))}
                rows={12}
                className="w-full rounded-[5px] border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <Button
              onClick={() => void save()}
              disabled={saving}
              className="bg-[#E62614] text-white hover:bg-[#E62614]/90"
            >
              {saving ? 'Сохранение…' : 'Сохранить'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
