/**
 * Bot validation for unauthenticated request forms.
 * Used by /api/resources/request-access
 */

/** Common disposable/temporary email domains (bots often use these) */
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com', '10minutemail.net', 'guerrillamail.com', 'guerrillamail.org',
  'mailinator.com', 'tempmail.com', 'temp-mail.org', 'throwaway.email',
  'yopmail.com', 'fakeinbox.com', 'trashmail.com', 'getnada.com',
  'mailnesia.com', 'sharklasers.com', 'grr.la', 'guerrillamail.biz',
  'discard.email', 'dispostable.com', 'maildrop.cc', 'tmpeml.com',
  'emailondeck.com', 'inboxkitten.com', 'minuteinbox.com', 'mohmal.com',
  'emailfake.com', 'tempr.email', 'outlook.com.fake', 'gmail.com.fake',
])

export function isDisposableEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1]?.trim()
  return !!domain && DISPOSABLE_DOMAINS.has(domain)
}

export function validateRequestForBots(params: {
  honeypot?: string
  formLoadedAt?: number
  turnstileToken?: string
  email?: string
}): { valid: true } | { valid: false; error: string } {
  const { honeypot, formLoadedAt, turnstileToken, email } = params

  // 1. Honeypot: hidden field that bots fill, humans leave empty
  if (honeypot && String(honeypot).trim().length > 0) {
    return { valid: false, error: 'Invalid request. Please try again.' }
  }

  // 2. Time check: form should be visible for at least 5 seconds before submit
  const MIN_FORM_TIME_MS = 5000
  if (typeof formLoadedAt === 'number') {
    const elapsed = Date.now() - formLoadedAt
    if (elapsed < MIN_FORM_TIME_MS) {
      return { valid: false, error: 'Please take a moment to complete the form, then try again.' }
    }
  } else {
    // If formLoadedAt is missing, reject (client may be scripted)
    return { valid: false, error: 'Invalid request. Please refresh and try again.' }
  }

  // 3. Turnstile: if secret is set, token is required
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
  if (turnstileSecret) {
    if (!turnstileToken || typeof turnstileToken !== 'string' || !turnstileToken.trim()) {
      return { valid: false, error: 'Please complete the verification challenge.' }
    }
  }

  // 4. Disposable email block
  if (email && isDisposableEmail(email)) {
    return { valid: false, error: 'Please use a valid business or personal email address.' }
  }

  return { valid: true }
}

/** Verify Turnstile token with Cloudflare (call when TURNSTILE_SECRET_KEY is set) */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    })
    const data = await res.json()
    return !!data?.success
  } catch {
    return false
  }
}
