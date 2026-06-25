import { timingSafeEqual } from 'crypto'
import { getAdminAuthConfig, normalizeAdminEmail } from '@/lib/auth/config'

function safeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)

  if (bufA.length !== bufB.length) {
    return false
  }

  return timingSafeEqual(bufA, bufB)
}

export function verifyAdminLogin(email: string, code: string): { ok: true } | { ok: false; error: string } {
  const config = getAdminAuthConfig()

  if (!config) {
    return {
      ok: false,
      error: 'Авторизация не настроена на сервере (env ADMIN_2FA_EMAIL, ADMIN_ACCESS_PIN, SESSION_SECRET)',
    }
  }

  const normalizedEmail = normalizeAdminEmail(email)
  if (normalizedEmail !== config.email) {
    return { ok: false, error: 'Неверный email или код' }
  }

  if (!/^\d{4}$/.test(code.trim())) {
    return { ok: false, error: 'Код должен содержать 4 цифры' }
  }

  if (!safeEqualString(code.trim(), config.pin)) {
    return { ok: false, error: 'Неверный email или код' }
  }

  return { ok: true }
}
