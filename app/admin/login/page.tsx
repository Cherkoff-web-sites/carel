import { Suspense } from 'react'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1e1e22]" />}>
      <AdminLoginForm />
    </Suspense>
  )
}
