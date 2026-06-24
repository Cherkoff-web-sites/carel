import type { Metadata } from 'next'
import LegalDocumentView from '@/components/legal/LegalDocumentView'
import { cookiePolicy } from '@/lib/legalDocuments'

export const metadata: Metadata = {
  title: 'Политика cookie | CAREL Professional Service',
  description: cookiePolicy.description,
}

export default function CookiePolicyPage() {
  return <LegalDocumentView document={cookiePolicy} />
}
