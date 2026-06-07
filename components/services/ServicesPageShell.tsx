import ServicesSubNav from './ServicesSubNav'
import ServicesSidebar from './ServicesSidebar'
import { HEADER_OFFSET_CLASS } from '@/lib/constants'

type ServicesPageShellProps = {
  activeSlug: string
  children: React.ReactNode
}

export default function ServicesPageShell({
  activeSlug,
  children,
}: ServicesPageShellProps) {
  return (
    <div className={`flex flex-1 flex-col ${HEADER_OFFSET_CLASS}`}>
      <ServicesSubNav />
      <div className="container flex flex-1 flex-col pt-0 pb-8 sm:pb-10 lg:pb-12">
        <div className="flex flex-1 flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10 xl:gap-14">
          <ServicesSidebar activeSlug={activeSlug} />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}
