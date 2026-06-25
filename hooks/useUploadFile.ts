'use client'

import { useState } from 'react'

export function useUploadFile() {
  const [uploading, setUploading] = useState(false)

  const upload = async (file: File, kind: 'image' | 'pdf'): Promise<{ url: string; filename: string }> => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.set('file', file)
      formData.set('kind', kind)
      const response = await fetch('/api/admin/uploads', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error ?? 'Ошибка загрузки')
      }
      return data as { url: string; filename: string }
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading }
}
