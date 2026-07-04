import { cookies } from 'next/headers'
import { getServerSession } from '@roalla/auth/next'
import { ensureUserRole, getHubUser, type HubUser } from '@/lib/hub/sync-user'
import { defaultRoleForEmail } from '@/lib/hub/roles'

function cookieRequest() {
  const store = cookies()
  return {
    cookies: {
      get: (name: string) => {
        const c = store.get(name)
        return c ? { value: c.value } : undefined
      },
    },
  } as Parameters<typeof getServerSession>[0]
}

export async function getHubSession(): Promise<{
  signedIn: boolean
  auth: Awaited<ReturnType<typeof getServerSession>>
  user: HubUser | null
}> {
  const auth = await getServerSession(cookieRequest())
  if (!auth?.userId) {
    return { signedIn: false, auth: null, user: null }
  }

  const userId = String(auth.userId)
  const email = String(auth.email || '')
  const name = String(auth.name || '')

  let syncedUser: HubUser | null = null
  try {
    syncedUser = (await ensureUserRole(userId, email, name)) || (await getHubUser(userId))
  } catch (err) {
    console.error('getHubSession user sync failed', err)
  }

  const user = syncedUser || {
    id: userId,
    email,
    name,
    role: defaultRoleForEmail(email),
  }

  return { signedIn: true, auth, user }
}

export async function requireHubSession(): Promise<{
  auth: NonNullable<Awaited<ReturnType<typeof getServerSession>>>
  user: HubUser
}> {
  const session = await getHubSession()
  if (!session.signedIn || !session.auth?.userId || !session.user) {
    throw new Error('UNAUTHORIZED')
  }
  return { auth: session.auth, user: session.user }
}
