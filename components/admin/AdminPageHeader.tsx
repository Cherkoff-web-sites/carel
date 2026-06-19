type AdminPageHeaderProps = {
  title: string
  description?: string
  actions?: React.ReactNode
}

export default function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#232326] sm:text-2xl">{title}</h1>
          {description ? (
            <p className="mt-1 max-w-3xl text-sm text-[#232326]/65">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
