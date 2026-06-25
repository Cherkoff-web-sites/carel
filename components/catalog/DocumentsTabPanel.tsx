'use client'

import type { ProductDocument } from '@/lib/catalogProductExtras'

type DocumentsTabPanelProps = {
  documents: ProductDocument[]
  fallbackText: string
}

export default function DocumentsTabPanel({ documents, fallbackText }: DocumentsTabPanelProps) {
  if (documents.length === 0) {
    return <p className="leading-relaxed text-[#232326]/90">{fallbackText}</p>
  }

  return (
    <ul className="space-y-3">
      {documents.map((doc) => (
        <li key={doc.id}>
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#E62614] hover:underline"
          >
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-50 text-xs font-bold text-red-700"
              aria-hidden
            >
              PDF
            </span>
            <span className="font-medium">{doc.title}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
