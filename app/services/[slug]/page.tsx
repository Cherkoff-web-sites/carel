import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ServiceArticle from '@/components/services/ServiceArticle'
import ServicesPageShell from '@/components/services/ServicesPageShell'
import {
  getServiceBySlug,
  getServiceSlugs,
} from '@/lib/servicesData'

type PageProps = {
  params: { slug: string }
}

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const service = getServiceBySlug(params.slug)
  if (!service) {
    return { title: 'Услуги | CAREL Professional Service' }
  }
  return {
    title: service.metaTitle,
    description: service.metaDescription,
  }
}

export default function ServiceDetailPage({ params }: PageProps) {
  const service = getServiceBySlug(params.slug)
  if (!service) {
    notFound()
  }

  return (
    <ServicesPageShell activeSlug={params.slug}>
      <ServiceArticle service={service} />
    </ServicesPageShell>
  )
}
