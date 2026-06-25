import AdminShell from '@/components/admin/AdminShell'

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[200] flex overflow-hidden bg-[#f0f1f4]">
      <AdminShell>{children}</AdminShell>
    </div>
  )
}
