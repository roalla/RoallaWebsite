import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canDeletePortalContent, canDeleteUser, canManageTeam, isAdmin } from '@/lib/access'

export const dynamic = 'force-dynamic'

const PARTNER_ADD_USER_CAP = Math.max(0, Number(process.env.PARTNER_ADD_USER_CAP) || 50)

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const payload: {
    canDeletePortal: boolean
    canDeleteUser: boolean
    canAssignAdmin: boolean
    isAdmin: boolean
    partnerAddUserCap?: number
    partnerAddUserCapRemaining?: number
  } = {
    canDeletePortal: canDeletePortalContent(session.user),
    canDeleteUser: canDeleteUser(session.user),
    canAssignAdmin: isAdmin(session.user),
    isAdmin: isAdmin(session.user),
  }
  if (canManageTeam(session.user) && !isAdmin(session.user)) {
    const currentUserId = (session.user as { id?: string }).id
    const added = currentUserId
      ? await prisma.user.count({ where: { addedByUserId: currentUserId } })
      : 0
    payload.partnerAddUserCap = PARTNER_ADD_USER_CAP
    payload.partnerAddUserCapRemaining = Math.max(0, PARTNER_ADD_USER_CAP - added)
  }
  return NextResponse.json(payload)
}
