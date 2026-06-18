import ContactModalTrigger from '@/components/ContactModal/ContactModalTrigger'
import type { ServiceIconSection, ServicePageData } from '@/lib/servicesData'

const SERVICE_PHONE_DISPLAY = '8 (929) 538-56-34'

type ServiceArticleProps = {
  service: ServicePageData
}

function ServiceList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="shrink-0 text-[#E62614]" aria-hidden>
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function IconSectionBlock({
  block,
}: {
  block: ServiceIconSection
}) {
  return (
    <div className="mt-10 space-y-4 text-base leading-relaxed text-[#232326] sm:mt-12 sm:text-lg">
      <div className="flex items-start gap-3 sm:gap-4">
        <IconSectionGlyph icon={block.icon} />
        <h2 className="pt-1 text-xl font-bold text-[#232326] sm:text-2xl">
          {block.heading}
        </h2>
      </div>
      <div className="space-y-4">
        {block.paragraphs.map((paragraph, index) => (
          <div key={paragraph} className="space-y-4">
            {block.phone && paragraph.includes('{phone}') ? (
              <p>
                {paragraph.split('{phone}')[0]}
                <a
                  href={`tel:${block.phone}`}
                  className="font-semibold text-[#232326] underline-offset-2 hover:text-[#E62614] hover:underline"
                >
                  {SERVICE_PHONE_DISPLAY}
                </a>
                {paragraph.split('{phone}')[1]}
              </p>
            ) : (
              <p>{paragraph}</p>
            )}
            {index === 0 && block.contactLine ? (
              <p>
                {block.contactLine.before}
                <a
                  href={`tel:${block.contactLine.phone}`}
                  className="font-bold text-[#232326] underline-offset-2 hover:text-[#E62614] hover:underline"
                >
                  {block.contactLine.phoneDisplay}
                </a>
                {block.contactLine.middle}
                <a
                  href={block.contactLine.linkHref}
                  className="font-bold text-[#232326] underline-offset-2 hover:text-[#E62614] hover:underline"
                >
                  {block.contactLine.linkText}
                </a>
              </p>
            ) : null}
          </div>
        ))}
        {block.list ? <ServiceList items={block.list} /> : null}
        {block.linkParagraph ? (
          <p>
            {block.linkParagraph.before}
            <a
              href={block.linkParagraph.linkHref}
              className="font-bold text-[#232326] underline-offset-2 hover:text-[#E62614] hover:underline"
            >
              {block.linkParagraph.linkText}
            </a>
            {block.linkParagraph.after}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function IconSectionGlyph({ icon }: { icon: 'question' | 'exclamation' }) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center text-3xl font-bold leading-none text-[#E62614] sm:h-12 sm:w-12 sm:text-4xl"
      aria-hidden
    >
      {icon === 'question' ? '?' : '!'}
    </span>
  )
}

export default function ServiceArticle({ service }: ServiceArticleProps) {
  return (
    <article className="min-w-0">
      <h1 className="mb-6 text-2xl leading-tight text-[#232326] sm:mb-8 sm:text-3xl lg:text-4xl">
        {service.pageTitle}
        {service.pageTitleAccent ? (
          <span className="text-[#E62614]">{service.pageTitleAccent}</span>
        ) : null}
      </h1>

      <div className="space-y-4 text-base leading-relaxed text-[#232326] sm:text-lg">
        {service.introRich ? (
          <p>
            {service.introRich.beforeAccent}
            <span className="text-[#E62614]">{service.introRich.accent}</span>
            {service.introRich.afterAccent}
          </p>
        ) : (
          service.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
        )}
      </div>

      <div className="my-8 flex justify-center sm:my-10">
        <ContactModalTrigger
          modalView="call"
          className="inline-flex w-fit items-center justify-center rounded-[5px] bg-[#E62614] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#E62614]/90"
        >
          {service.ctaLabel}
        </ContactModalTrigger>
      </div>

      {service.quote ? (
        <p className="mb-8 border-l-4 border-[#232326]/25 px-[22px] py-2 text-left text-lg leading-relaxed text-[#232326] sm:mb-10 sm:text-xl lg:text-[25px]">
          {service.quote}
        </p>
      ) : null}

      <div className="space-y-8 text-base leading-relaxed text-[#232326] sm:text-lg">
        {service.sections.map((section, index) => (
          <div key={section.heading ?? `section-${index}`}>
            {section.heading ? (
              <h2 className="mb-4 text-xl font-bold text-[#232326] sm:text-2xl">
                {section.heading}
              </h2>
            ) : null}
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
            {section.list ? <ServiceList items={section.list} /> : null}
            {section.footerQuote ? (
              <p className="mt-8 border-l-4 border-[#232326]/25 px-[22px] py-2 text-center text-lg leading-relaxed text-[#232326] sm:mt-10 sm:text-xl lg:text-[25px]">
                {section.footerQuote}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {service.emphasisLine ? (
        <div className="mt-8 flex items-start gap-3 text-base leading-relaxed text-[#232326] sm:mt-10 sm:gap-4 sm:text-lg">
          <IconSectionGlyph icon="exclamation" />
          <p className="pt-1 text-xl font-bold text-[#232326] sm:text-2xl">
            {service.emphasisLine}
          </p>
        </div>
      ) : null}

      {service.closingParagraphs ? (
        <div className="mt-6 space-y-4 text-base leading-relaxed text-[#232326] sm:mt-8 sm:text-lg">
          {service.closingParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      {service.closingBold ? (
        <p className="mt-6 text-base font-bold leading-relaxed text-[#232326] sm:mt-8 sm:text-lg">
          {service.closingBold}
        </p>
      ) : null}

      {service.iconSectionsAfterQuote ? (
        <>
          {service.iconSections?.map((block) => (
            <IconSectionBlock key={block.heading} block={block} />
          ))}
          {service.footerQuote ? (
            <p className="mt-10 border-l-4 border-[#232326]/25 px-[22px] py-2 text-center text-lg leading-relaxed text-[#232326] sm:mt-12 sm:text-xl lg:text-[25px]">
              {service.footerQuote}
            </p>
          ) : null}
          {service.iconSectionsAfterQuote.map((block) => (
            <IconSectionBlock key={block.heading} block={block} />
          ))}
        </>
      ) : (
        <>
          {service.footerQuote ? (
            <p className="mt-10 border-l-4 border-[#232326]/25 px-[22px] py-2 text-center text-lg leading-relaxed text-[#232326] sm:mt-12 sm:text-xl lg:text-[25px]">
              {service.footerQuote}
            </p>
          ) : null}

          {service.benefits ? (
            <div className="mt-10 space-y-4 text-base leading-relaxed text-[#232326] sm:mt-12 sm:text-lg">
              <h2 className="text-xl font-bold text-[#232326] sm:text-2xl">
                {service.benefits.heading}
              </h2>
              <ServiceList items={service.benefits.items} />
            </div>
          ) : null}

          {service.iconSections?.map((block) => (
            <IconSectionBlock key={block.heading} block={block} />
          ))}
        </>
      )}

      {service.bottomSlogan ? (
        <div className="mt-12 bg-[#232326] px-6 py-5 text-center text-sm leading-relaxed text-white sm:mt-14 sm:text-base">
          {service.bottomSlogan}
        </div>
      ) : null}
    </article>
  )
}
