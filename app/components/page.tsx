import { Suspense } from 'react'
import ComponentsPageClient from './ComponentsPageClient'

export const metadata = {
  title: 'Комплектующие | CAREL Professional Service',
  description: 'Каталог комплектующих CAREL: цилиндры, датчики, модули связи и расходные материалы.',
}

export default function ComponentsPage() {
  return (
    <Suspense fallback={null}>
      <ComponentsPageClient />
    </Suspense>
  )
}
