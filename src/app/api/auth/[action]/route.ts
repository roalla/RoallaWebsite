import { NextRequest } from 'next/server'
import { createAuthHandlers, getServerSession } from '@roalla/auth/next'
import { db } from '@/lib/db'
import { ensureUserRole } from '@/lib/hub/sync-user'

const mail = {}
const handlers = createAuthHandlers({ db, mail })

type RouteContext = { params: Promise<{ action: string }> }

async function syncRoleAfterAuth(request: NextRequest) {
  const auth = await getServerSession(request)
  if (auth?.userId) {
    await ensureUserRole(
      String(auth.userId),
      String(auth.email || ''),
      String(auth.name || ''),
    )
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { action } = await context.params
  if (action === 'session') return handlers.session(request)
  if (action === 'sibling-apps') return handlers.siblingApps(request)
  return Response.json({ error: 'Not found.' }, { status: 404 })
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { action } = await context.params
  if (action === 'token') {
    const res = await handlers.token(request)
    await syncRoleAfterAuth(request)
    return res
  }
  if (action === 'refresh') {
    const res = await handlers.refresh(request)
    await syncRoleAfterAuth(request)
    return res
  }
  if (action === 'logout') return handlers.logout(request)
  if (action === 'sync') {
    const res = await handlers.sync(request)
    await syncRoleAfterAuth(request)
    return res
  }
  return Response.json({ error: 'Not found.' }, { status: 404 })
}
