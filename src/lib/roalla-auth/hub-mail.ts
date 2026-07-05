import { roallaAuthClientId, roallaAuthHubUrl } from '@/lib/roalla-auth/config'

export type HubMailPayload = {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  replyTo?: string
}

export function hubMailConfigured(): boolean {
  return !!(roallaAuthHubUrl() && roallaAuthClientId() && process.env.AUTH_MAIL_SECRET?.trim())
}

/** Send product email via Auth Hub (Brevo on hub — no Resend key in this app). */
export async function sendHubMail(payload: HubMailPayload): Promise<{ ok: boolean; error?: string }> {
  const hubUrl = roallaAuthHubUrl()
  const clientId = roallaAuthClientId()
  const secret = process.env.AUTH_MAIL_SECRET?.trim()

  if (!hubUrl || !clientId || !secret) {
    return { ok: false, error: 'Hub mail not configured (AUTH_URL, AUTH_CLIENT_ID, AUTH_MAIL_SECRET).' }
  }

  const body: Record<string, unknown> = {
    client_id: clientId,
    to: payload.to,
    subject: payload.subject,
  }
  if (payload.html) body.html = payload.html
  if (payload.text) body.text = payload.text
  if (payload.replyTo) body.reply_to = payload.replyTo

  try {
    const res = await fetch(`${hubUrl}/api/mail/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return { ok: false, error: String(data.error || `Mail send failed (${res.status})`) }
    }
    return { ok: true }
  } catch (err) {
    console.error('Auth hub mail request failed', err)
    return { ok: false, error: 'Could not reach auth hub.' }
  }
}
