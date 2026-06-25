const SESSION_COOKIE_NAME = 'carel_admin_session'
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7

const textEncoder = new TextEncoder()

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(payload))
  return Buffer.from(signature).toString('base64url')
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let mismatch = 0
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

export async function createSessionToken(email: string, secret: string): Promise<string> {
  const exp = Date.now() + SESSION_MAX_AGE_SEC * 1000
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString('base64url')
  const signature = await signPayload(payload, secret)
  return `${payload}.${signature}`
}

export async function verifySessionToken(
  token: string,
  secret: string
): Promise<{ email: string } | null> {
  const [payload, signature] = token.split('.')
  if (!payload || !signature) {
    return null
  }

  const expected = await signPayload(payload, secret)
  if (!safeEqual(signature, expected)) {
    return null
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as {
      email?: string
      exp?: number
    }

    if (!data.email || typeof data.exp !== 'number' || data.exp < Date.now()) {
      return null
    }

    return { email: data.email }
  } catch {
    return null
  }
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME
}

export function getSessionMaxAgeSec(): number {
  return SESSION_MAX_AGE_SEC
}
