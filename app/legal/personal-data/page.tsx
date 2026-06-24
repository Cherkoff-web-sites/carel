import type { Metadata } from 'next'
import LegalDocumentView from '@/components/legal/LegalDocumentView'
import { personalDataPolicy } from '@/lib/legalDocuments'

export const metadata: Metadata = {
  title: 'Политика обработки персональных данных | CAREL Professional Service',
  description: personalDataPolicy.description,
}

export default function PersonalDataPolicyPage() {
  return <LegalDocumentView document={personalDataPolicy} />
}
