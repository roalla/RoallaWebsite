import { NextResponse } from 'next/server'
import { databaseConfigStatus, dbReachable } from '@/lib/db'
import { requireHubSession } from '@/lib/hub/auth-session'

/** Admin-only diagnostics — no secrets returned. */
export async function GET() {
  try {
    const { user } = await requireHubSession()
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }

    const config = databaseConfigStatus()
    const reachable = config.configured ? await dbReachable() : false

    return NextResponse.json({
      ...config,
      reachable,
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
}
