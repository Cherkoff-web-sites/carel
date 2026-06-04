import { redirect } from 'next/navigation'
import { DEFAULT_SERVICE_SLUG } from '@/lib/servicesData'

export default function ServicesPage() {
  redirect(`/services/${DEFAULT_SERVICE_SLUG}`)
}
