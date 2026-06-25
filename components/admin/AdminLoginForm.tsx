'use client'

import { FormEvent, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { SITE_NAME } from '@/lib/constants'

export default function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') || '/admin'

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(data.error ?? 'Не удалось войти')
        return
      }

      router.replace(nextPath.startsWith('/admin') ? nextPath : '/admin')
      router.refresh()
    } catch {
      setError('Ошибка сети. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1e1e22] px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#232326] p-6 shadow-xl sm:p-8">
        <div className="mb-8 text-center">
          <Image
            src="/images/header/logo-carel-works.svg"
            alt="CAREL Works"
            width={146}
            height={52}
            className="mx-auto h-10 w-auto"
          />
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/50">
            Вход в админ-панель
          </p>
          <h1 className="mt-1 text-lg font-bold text-white">{SITE_NAME}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-white/80">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-white/15 bg-[#1e1e22] px-3 py-2.5 text-sm text-white outline-none ring-[#E62614] placeholder:text-white/35 focus:border-[#E62614] focus:ring-1"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="admin-code" className="mb-1.5 block text-sm font-medium text-white/80">
              Код из письма
            </label>
            <input
              id="admin-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength={4}
              pattern="\d{4}"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full rounded-md border border-white/15 bg-[#1e1e22] px-3 py-2.5 text-sm tracking-[0.3em] text-white outline-none ring-[#E62614] placeholder:tracking-normal placeholder:text-white/35 focus:border-[#E62614] focus:ring-1"
              placeholder="0000"
            />
            <p className="mt-2 text-xs leading-relaxed text-white/45">
              Пока почта не подключена, введите 4-значный код из переменной{' '}
              <code className="text-white/60">ADMIN_ACCESS_PIN</code> на сервере. После настройки SMTP
              сюда будет приходить код на email из <code className="text-white/60">ADMIN_2FA_EMAIL</code>.
            </p>
          </div>

          {error ? (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#E62614] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c41f10] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Вход…' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
