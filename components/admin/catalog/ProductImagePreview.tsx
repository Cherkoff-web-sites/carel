import Image from 'next/image'
import { AdminDisabledButton } from '@/components/admin/AdminInactiveField'

type ProductImagePreviewProps = {
  src: string
  alt: string
  galleryCount?: number
}

export default function ProductImagePreview({ src, alt, galleryCount = 0 }: ProductImagePreviewProps) {
  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-lg border border-gray-200 bg-[#fafafa]">
        <Image src={src} alt={alt} fill className="object-contain p-3" sizes="280px" />
      </div>
      <AdminDisabledButton>Заменить фото</AdminDisabledButton>
      {galleryCount > 1 ? (
        <p className="text-xs text-[#232326]/55">Галерея: {galleryCount} изображений</p>
      ) : null}
    </div>
  )
}
