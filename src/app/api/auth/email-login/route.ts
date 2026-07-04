import { NextRequest } from 'next/server'
import { hubEmailLogin } from '@/lib/roalla-auth/hub-email-auth-server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { status, payload } = await hubEmailLogin(body as Parameters<typeof hubEmailLogin>[0])
  return Response.json(payload, { status })
}
