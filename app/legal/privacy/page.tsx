import type { Metadata } from 'next'
import LegalDocumentView from '@/components/legal/LegalDocumentView'
import { privacyPolicy } from '@/lib/legalDocuments'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности | CAREL Professional Service',
  description: privacyPolicy.description,
}

export default function PrivacyPolicyPage() {
  return <LegalDocumentView document={privacyPolicy} />
}
