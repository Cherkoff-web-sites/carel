import { NextRequest, NextResponse } from 'next/server'
import { getAdminAuthConfig, normalizeAdminEmail } from '@/lib/auth/config'
import { verifyAdminLogin } from '@/lib/auth/credentials'
import {
  createSessionToken,
  getSessionCookieName,
  getSessionMaxAgeSec,
} from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; code?: string }
    const email = body.email ?? ''
    const code = body.code ?? ''

    const result = verifyAdminLogin(email, code)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    const config = getAdminAuthConfig()
    if (!config) {
      return NextResponse.json({ error: 'Auth is not configured' }, { status: 503 })
    }

    const token = await createSessionToken(normalizeAdminEmail(email), config.sessionSecret)
    const response = NextResponse.json({ success: true })

    response.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: getSessionMaxAgeSec(),
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
