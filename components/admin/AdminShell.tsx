'use client'

import type { ReactNode } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

type AdminShellProps = {
  children: ReactNode
}

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="flex h-full min-h-0 w-full bg-[#f0f1f4]">
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  )
}
