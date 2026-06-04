import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Каталог | CAREL Professional Service',
  description:
    'Каталог увлажнителей и оборудования CAREL: изотермические, адиабатические системы, испарительное охлаждение, водоподготовка.',
}

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
