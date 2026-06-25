export type AdminAuthConfig = {
  email: string
  pin: string
  sessionSecret: string
}

export function getAdminAuthConfig(): AdminAuthConfig | null {
  const email = process.env.ADMIN_2FA_EMAIL?.trim().toLowerCase()
  const pin = process.env.ADMIN_ACCESS_PIN?.trim()
  const sessionSecret = process.env.SESSION_SECRET?.trim()

  if (!email || !pin || !sessionSecret) {
    return null
  }

  return { email, pin, sessionSecret }
}

export function isAdminAuthConfigured(): boolean {
  return getAdminAuthConfig() !== null
}

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase()
}
