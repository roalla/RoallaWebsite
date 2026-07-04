import { NextRequest } from 'next/server'
import { hubEmailRegister } from '@/lib/roalla-auth/hub-email-auth-server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { status, payload } = await hubEmailRegister(body as Parameters<typeof hubEmailRegister>[0])
  return Response.json(payload, { status })
}
