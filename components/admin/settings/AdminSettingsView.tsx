'use client'

import { useRef, useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

export default function AdminSettingsView() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadsInputRef = useRef<HTMLInputElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [downloadingUploads, setDownloadingUploads] = useState(false)
  const [restoringUploads, setRestoringUploads] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDownload() {
    setDownloading(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch('/api/admin/backup/download', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Не удалось скачать дамп')
      }

      const blob = await response.blob()
      const disposition = response.headers.get('Content-Disposition') ?? ''
      const match = disposition.match(/filename="([^"]+)"/)
      const filename = match?.[1] ?? 'carel-backup.sql'

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)

      setMessage('Дамп скачан')
    } catch {
      setError('Не удалось скачать дамп')
    } finally {
      setDownloading(false)
    }
  }

  async function handleRestore(file: File) {
    const confirmed = window.confirm(
      'Восстановление заменит текущий каталог в базе данными из файла. Продолжить?'
    )
    if (!confirmed) {
      return
    }

    setRestoring(true)
    setMessage(null)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/backup/restore', {
        method: 'POST',
        body: formData,
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error ?? 'Не удалось восстановить дамп')
      }

      setMessage('База восстановлена из дампа')
    } catch (restoreError) {
      setError(restoreError instanceof Error ? restoreError.message : 'Ошибка восстановления')
    } finally {
      setRestoring(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  async function handleUploadsDownload() {
    setDownloadingUploads(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch('/api/admin/uploads/archive/download', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Не удалось скачать архив uploads')
      }

      const blob = await response.blob()
      const disposition = response.headers.get('Content-Disposition') ?? ''
      const match = disposition.match(/filename="([^"]+)"/)
      const filename = match?.[1] ?? 'carel-uploads.zip'

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)

      setMessage('Архив uploads скачан')
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Не удалось скачать uploads')
    } finally {
      setDownloadingUploads(false)
    }
  }

  async function handleUploadsRestore(file: File) {
    const confirmed = window.confirm(
      'Восстановление uploads добавит/перезапишет фото и PDF из архива. Продолжить?'
    )
    if (!confirmed) {
      return
    }

    setRestoringUploads(true)
    setMessage(null)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/uploads/archive/restore', {
        method: 'POST',
        body: formData,
      })
      const data = (await response.json()) as { error?: string; restored?: number }

      if (!response.ok) {
        throw new Error(data.error ?? 'Не удалось восстановить uploads')
      }

      setMessage(`Uploads восстановлены. Файлов: ${data.restored ?? 0}`)
    } catch (restoreError) {
      setError(restoreError instanceof Error ? restoreError.message : 'Ошибка восстановления uploads')
    } finally {
      setRestoringUploads(false)
      if (uploadsInputRef.current) {
        uploadsInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Настройки"
        description="Резервное копирование каталога в PostgreSQL и файлов uploads"
      />

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#232326]">Скачать SQL-дамп</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#232326]/70">
              Сохранит каталог (таблица <code className="text-xs">products</code>) в файл{' '}
              <code className="text-xs">.sql</code> на ваш компьютер.
            </p>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="mt-4 rounded-[5px] bg-[#E62614] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c41f10] disabled:opacity-60"
            >
              {downloading ? 'Подготовка…' : 'Скачать дамп БД'}
            </button>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#232326]">Восстановить из дампа</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#232326]/70">
              Загрузите файл, скачанный ранее из этой админки. Текущий каталог в базе будет заменён.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".sql,text/sql,application/sql"
              className="mt-4 block w-full text-sm text-[#232326]/80 file:mr-3 file:rounded-[5px] file:border-0 file:bg-[#232326] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#232326]/90"
              disabled={restoring}
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  void handleRestore(file)
                }
              }}
            />
            {restoring ? <p className="mt-2 text-sm text-[#232326]/60">Восстановление…</p> : null}
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#232326]">Скачать фото и PDF</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#232326]/70">
              Скачивает папки <code className="text-xs">uploads/images</code> и{' '}
              <code className="text-xs">uploads/docs</code> в ZIP-архив. Используйте это перед редеплоем,
              если пока нет постоянного volume/S3.
            </p>
            <button
              type="button"
              onClick={handleUploadsDownload}
              disabled={downloadingUploads}
              className="mt-4 rounded-[5px] bg-[#232326] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#232326]/90 disabled:opacity-60"
            >
              {downloadingUploads ? 'Подготовка…' : 'Скачать uploads.zip'}
            </button>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#232326]">Восстановить фото и PDF</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#232326]/70">
              Загрузите ZIP-архив, скачанный из этой админки. Имена файлов сохраняются, поэтому ссылки из
              PostgreSQL снова начнут открываться.
            </p>
            <input
              ref={uploadsInputRef}
              type="file"
              accept=".zip,application/zip"
              className="mt-4 block w-full text-sm text-[#232326]/80 file:mr-3 file:rounded-[5px] file:border-0 file:bg-[#232326] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#232326]/90"
              disabled={restoringUploads}
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  void handleUploadsRestore(file)
                }
              }}
            />
            {restoringUploads ? (
              <p className="mt-2 text-sm text-[#232326]/60">Восстановление uploads…</p>
            ) : null}
          </section>

          <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#232326]">Автобэкап Timeweb</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#232326]/75">
              В панели Timeweb → <strong>Базы данных</strong> → ваш PostgreSQL → включите автобэкап /
              снапшоты. Это дополнение к ручному скачиванию дампа из админки.
            </p>
          </section>

          {message ? (
            <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {message}
            </p>
          ) : null}

          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
