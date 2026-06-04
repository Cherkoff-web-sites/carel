import ServicesSubNav from './ServicesSubNav'
import ServicesSidebar from './ServicesSidebar'

type ServicesPageShellProps = {
  activeSlug: string
  children: React.ReactNode
}

export default function ServicesPageShell({
  activeSlug,
  children,
}: ServicesPageShellProps) {
  return (
    <div className="flex flex-1 flex-col bg-[#fdfbf6]">
      <div className="flex flex-1 flex-col pt-[82px]">
        <ServicesSubNav />
        <div className="container flex flex-1 flex-col py-8 sm:py-10 lg:py-12">
          <div className="flex flex-1 flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10 xl:gap-14">
            <ServicesSidebar activeSlug={activeSlug} />
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
