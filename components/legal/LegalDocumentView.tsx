import Link from 'next/link'
import { HEADER_OFFSET_CLASS } from '@/lib/constants'
import { ChevronLeftIcon } from '@/components/ui/ChevronIcon'
import type { LegalDocument } from '@/lib/legal'

type LegalDocumentViewProps = {
  document: LegalDocument
}

export default function LegalDocumentView({ document }: LegalDocumentViewProps) {
  return (
    <div className={`min-h-screen bg-[#fdfbf6] ${HEADER_OFFSET_CLASS}`}>
      <div className="container max-w-3xl py-10 sm:py-12 lg:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#232326]/55 transition-colors hover:text-[#232326]"
        >
          <ChevronLeftIcon />
          На главную
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-[#232326] sm:text-3xl lg:text-4xl">
          {document.title}
        </h1>
        <p className="mt-3 text-sm text-[#232326]/60 sm:text-base">
          Редакция от {document.updatedAt}
        </p>

        <div className="mt-8 space-y-8 text-base leading-relaxed text-[#232326]/90 sm:mt-10 sm:text-lg">
          {document.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-lg font-bold text-[#232326] sm:text-xl">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3">
                  {paragraph}
                </p>
              ))}
              {section.list ? (
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <nav className="mt-10 border-t border-[#232326]/10 pt-6 text-sm sm:text-base">
          <p className="font-semibold text-[#232326]">Другие документы</p>
          <ul className="mt-3 space-y-2 text-[#E62614]">
            <li>
              <Link href="/legal/personal-data" className="hover:underline">
                Политика обработки персональных данных
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="hover:underline">
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link href="/legal/cookie" className="hover:underline">
                Политика cookie
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
