import SectionSubNav from '@/components/Layout/SectionSubNav'
import { SECTION_SUB_NAV } from '@/lib/sectionSubNav'
import { HEADER_OFFSET_CLASS } from '@/lib/constants'

type CatalogPageShellProps = {
  children: React.ReactNode
}

export default function CatalogPageShell({ children }: CatalogPageShellProps) {
  return (
    <div className={`flex flex-1 flex-col ${HEADER_OFFSET_CLASS}`}>
      <SectionSubNav items={SECTION_SUB_NAV} ariaLabel="Каталог" />
      <div className="container flex flex-1 flex-col pt-0 pb-8 sm:pb-10 lg:pb-12">
        <div className="flex flex-1 flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10 xl:gap-14">
          {children}
        </div>
      </div>
    </div>
  )
}
