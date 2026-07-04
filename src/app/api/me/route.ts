import { NextRequest } from 'next/server'
import { getServerSession, verifyAccessToken } from '@roalla/auth/next'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  let auth = await getServerSession(request)

  if (!auth?.userId) {
    const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim()
    if (bearer) {
      auth = await verifyAccessToken(bearer)
    }
  }

  if (!auth?.userId) {
    return Response.json({ error: 'Authentication required.' }, { status: 401 })
  }

  return Response.json({
    userId: auth.userId,
    email: auth.email,
    name: auth.name,
    emailVerified: auth.emailVerified,
  })
}
