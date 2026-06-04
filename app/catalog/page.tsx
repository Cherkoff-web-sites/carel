import { Suspense } from 'react'
import CatalogPageClient from './CatalogPageClient'

export default function CatalogPage() {
  return (
    <Suspense fallback={null}>
      <CatalogPageClient />
    </Suspense>
  )
}
