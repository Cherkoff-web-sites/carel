import Link from 'next/link'
import {
  HOME_SERVICES,
  SERVICES_RECOMMENDATIONS,
} from '@/lib/servicesData'

type ServicesSidebarProps = {
  activeSlug: string
}

export default function ServicesSidebar({ activeSlug }: ServicesSidebarProps) {
  return (
    <aside className="services-sidebar relative isolate w-full shrink-0 lg:w-[375px] lg:self-stretch">
      <div className="relative z-10 px-5 py-6 sm:px-6 sm:py-8 lg:min-h-full">
        <h2 className="mb-5 text-lg font-medium text-[#E62614] sm:text-xl">
          Наши услуги
        </h2>
        <ul className="space-y-3 text-sm leading-snug text-[#232326] sm:text-base">
          {HOME_SERVICES.map((service) => {
            const isActive = service.slug === activeSlug
            return (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className={
                    isActive
                      ? 'font-bold text-[#232326]'
                      : 'font-normal text-[#232326]/90 transition-colors hover:text-[#E62614]'
                  }
                  aria-current={isActive ? 'page' : undefined}
                >
                  {service.title}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="relative mt-8 hidden bg-[#f3e8d8] px-4 py-5 pr-12 sm:px-5 sm:py-6 sm:pr-14 lg:block">
          <svg
            className="pointer-events-none absolute right-0 top-0 h-[72px] w-[30px] sm:h-[90px] sm:w-[38px]"
            width="51"
            height="121"
            viewBox="0 0 51 121"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M0 0H51V97.6682L27.6549 121L0 97.6682V0Z"
              fill="#E62614"
            />
          </svg>
          <p className="text-xs font-medium leading-snug text-[#232326] sm:text-sm">
            {SERVICES_RECOMMENDATIONS.title}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-[#232326]/90 sm:text-sm">
            {SERVICES_RECOMMENDATIONS.intro}
          </p>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#232326]/90 sm:text-sm">
            {SERVICES_RECOMMENDATIONS.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#232326]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-[#232326]/90 sm:text-sm">
            {SERVICES_RECOMMENDATIONS.footer}
          </p>
        </div>
      </div>
    </aside>
  )
}
