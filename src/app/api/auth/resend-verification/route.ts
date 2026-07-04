import { NextRequest } from 'next/server'
import { hubResendVerification } from '@/lib/roalla-auth/hub-email-auth-server'

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { email?: string }
  if (!body.email?.trim()) {
    return Response.json({ error: 'Email required.' }, { status: 400 })
  }
  const { status, payload } = await hubResendVerification(body.email.trim())
  return Response.json(payload, { status })
}
