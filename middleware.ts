import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionCookieName, verifySessionToken } from '@/lib/auth/session'

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const secret = process.env.SESSION_SECRET?.trim()
  const token = request.cookies.get(getSessionCookieName())?.value

  if (!secret || !token) {
    return false
  }

  const session = await verifySessionToken(token, secret)
  return session !== null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') {
    if (await hasValidSession(request)) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    if (!(await hasValidSession(request))) {
      const loginUrl = new URL('/admin/login', request.url)
      if (pathname !== '/admin') {
        loginUrl.searchParams.set('next', pathname)
      }
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/admin')) {
    if (pathname.startsWith('/api/admin/auth/')) {
      return NextResponse.next()
    }

    if (!(await hasValidSession(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
