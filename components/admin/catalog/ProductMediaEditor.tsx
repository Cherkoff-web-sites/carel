'use client'

import Image from 'next/image'
import { useId, useState } from 'react'
import { useUploadFile } from '@/hooks/useUploadFile'

type ProductMediaEditorProps = {
  image: string
  galleryImages: string[]
  onChange: (next: { image: string; galleryImages: string[] }) => void
}

export default function ProductMediaEditor({
  image,
  galleryImages,
  onChange,
}: ProductMediaEditorProps) {
  const mainInputId = useId()
  const galleryInputId = useId()
  const [error, setError] = useState<string | null>(null)
  const { upload, uploading } = useUploadFile()

  const handleMainUpload = async (file: File) => {
    setError(null)
    try {
      const saved = await upload(file, 'image')
      const gallery = galleryImages.length > 0 ? galleryImages : [image]
      const nextGallery = gallery[0] === image ? [saved.url, ...gallery.slice(1)] : [saved.url, ...gallery]
      onChange({ image: saved.url, galleryImages: nextGallery.filter(Boolean) })
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Не удалось загрузить фото')
    }
  }

  const handleGalleryUpload = async (files: FileList) => {
    setError(null)
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        const saved = await upload(file, 'image')
        urls.push(saved.url)
      }
      const nextGallery = [...galleryImages, ...urls]
      onChange({
        image: image || nextGallery[0] || '',
        galleryImages: nextGallery,
      })
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Не удалось загрузить фото')
    }
  }

  const removeAt = (index: number) => {
    const next = galleryImages.filter((_, i) => i !== index)
    const nextImage = next[0] ?? ''
    onChange({ image: nextImage, galleryImages: next })
  }

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= galleryImages.length) return
    const next = [...galleryImages]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    onChange({ image: next[0] ?? image, galleryImages: next })
  }

  const setMain = (url: string) => {
    onChange({ image: url, galleryImages: galleryImages.length ? galleryImages : [url] })
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-lg border border-gray-200 bg-[#fafafa]">
        {image ? (
          <Image src={image} alt="" fill className="object-contain p-3" sizes="280px" unoptimized={image.startsWith('/uploads/')} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#232326]/45">Нет фото</div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <label
          htmlFor={mainInputId}
          className={`rounded-[5px] bg-[#E62614] px-3 py-2 text-sm font-semibold text-white hover:bg-[#E62614]/90 ${
            uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'
          }`}
        >
          {uploading ? 'Загрузка…' : 'Заменить главное'}
        </label>
        <label
          htmlFor={galleryInputId}
          className={`rounded-[5px] border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-[#232326] hover:bg-gray-50 ${
            uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'
          }`}
        >
          Добавить в галерею
        </label>
      </div>

      {error ? <p className="text-xs font-medium text-red-700">{error}</p> : null}

      <input
        id={mainInputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleMainUpload(file)
          e.target.value = ''
        }}
      />
      <input
        id={galleryInputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void handleGalleryUpload(e.target.files)
          e.target.value = ''
        }}
      />

      {galleryImages.length > 0 ? (
        <ul className="space-y-2">
          {galleryImages.map((src, index) => (
            <li
              key={`${src}-${index}`}
              className="flex items-center gap-2 rounded border border-gray-200 bg-white p-2"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-gray-100">
                <Image src={src} alt="" fill className="object-contain" sizes="48px" unoptimized={src.startsWith('/uploads/')} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-[#232326]/70">{src}</p>
                {image === src ? (
                  <span className="text-[10px] font-semibold text-[#E62614]">Главное</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMain(src)}
                    className="text-[10px] text-[#232326]/55 hover:text-[#E62614]"
                  >
                    Сделать главным
                  </button>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button type="button" onClick={() => move(index, -1)} className="rounded border px-1.5 py-0.5 text-xs">↑</button>
                <button type="button" onClick={() => move(index, 1)} className="rounded border px-1.5 py-0.5 text-xs">↓</button>
                <button type="button" onClick={() => removeAt(index)} className="rounded border border-red-200 px-1.5 py-0.5 text-xs text-red-700">×</button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
