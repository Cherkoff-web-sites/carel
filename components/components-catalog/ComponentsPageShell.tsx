import SectionSubNav from '@/components/Layout/SectionSubNav'
import { COMPONENTS_SECTION_SUB_NAV } from '@/lib/componentsSectionSubNav'

type ComponentsPageShellProps = {
  children: React.ReactNode
}

export default function ComponentsPageShell({ children }: ComponentsPageShellProps) {
  return (
    <div className="flex flex-1 flex-col bg-[#fdfbf6]">
      <div className="flex flex-1 flex-col pt-[114px]">
        <SectionSubNav items={COMPONENTS_SECTION_SUB_NAV} ariaLabel="Комплектующие" />
        <div className="container flex flex-1 flex-col py-8 sm:py-10 lg:py-12">
          <div className="flex flex-1 flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10 xl:gap-14">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
