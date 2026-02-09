import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canDeleteUser, isAdmin } from '@/lib/access'
import { logTeamAction } from '@/lib/team-audit'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !canDeleteUser(session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { userId } = await params
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      organizationId: true,
      organization: { select: { id: true, name: true } },
      roles: { select: { role: true } },
    },
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json({
    ...user,
    organizationName: user.organization?.name ?? null,
    roles: user.roles.map((r) => r.role),
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !isAdmin(session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { userId } = await params
  const body = await request.json().catch(() => ({}))
  const organizationId = typeof body.organizationId === 'string' ? body.organizationId.trim() || null : null
  await prisma.user.update({
    where: { id: userId },
    data: { organizationId },
  })
  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions)
  const currentUser = session?.user as { id?: string } | undefined
  if (!session || !canDeleteUser(session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await params

  if (userId === currentUser.id) {
    return NextResponse.json({ error: 'You cannot remove your own user account' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  await logTeamAction({
    action: 'user_deleted',
    actorUserId: currentUser.id,
    targetUserId: userId,
    metadata: { email: user.email },
  })

  await prisma.user.delete({ where: { id: userId } })

  return NextResponse.json({ success: true })
}
