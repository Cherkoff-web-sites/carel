type AdminInactiveFieldProps = {
  label: string
}

/** Неактивный элемент UI без подсказок (демо-режим). */
export default function AdminInactiveField({ label }: AdminInactiveFieldProps) {
  return (
    <span className="inline-flex cursor-not-allowed select-none items-center rounded-[5px] border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-[#232326]/55">
      {label}
    </span>
  )
}

export function AdminDisabledButton({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      disabled
      className={`cursor-not-allowed rounded-[5px] border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-[#232326]/55 ${className}`}
    >
      {children}
    </button>
  )
}
