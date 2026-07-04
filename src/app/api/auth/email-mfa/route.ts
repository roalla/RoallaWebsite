import { NextRequest } from 'next/server'
import { hubEmailMfaChallenge } from '@/lib/roalla-auth/hub-email-auth-server'

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { mfa_token?: string; code?: string }
  if (!body.mfa_token || !body.code) {
    return Response.json({ error: 'MFA token and code required.' }, { status: 400 })
  }
  const { status, payload } = await hubEmailMfaChallenge(body.mfa_token, body.code)
  return Response.json(payload, { status })
}
