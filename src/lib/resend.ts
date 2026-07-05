import type { Resend } from 'resend'

let client: Resend | null = null
let clientKey: string | null = null

/** Lazy Resend client — never throws; safe when RESEND_API_KEY is unset at build time. */
export async function getResend(): Promise<Resend | null> {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key) return null

  if (client && clientKey === key) return client

  try {
    const { Resend: ResendClient } = await import('resend')
    client = new ResendClient(key)
    clientKey = key
    return client
  } catch (err) {
    console.error('Resend client init failed', err)
    return null
  }
}
