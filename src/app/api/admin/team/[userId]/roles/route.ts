import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const VALID_ROLES = ['admin', 'partner', 'business', 'member'] as const

function isRole(s: string): s is (typeof VALID_ROLES)[number] {
  return VALID_ROLES.includes(s as (typeof VALID_ROLES)[number])
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions)
  const currentUser = session?.user as { roles?: string[] } | undefined
  if (!session || !currentUser?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await params
  const body = await request.json()
  const add = Array.isArray(body.add) ? body.add.filter(isRole) : []
  const remove = Array.isArray(body.remove) ? body.remove.filter(isRole) : []

  if (add.length === 0 && remove.length === 0) {
    return NextResponse.json({ error: 'Provide add and/or remove arrays of roles' }, { status: 400 })
  }

  const target = await prisma.user.findUnique({ where: { id: userId } })
  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (remove.includes('admin') && target.id === (session.user as { id?: string }).id) {
    return NextResponse.json({ error: 'Cannot remove your own admin role' }, { status: 400 })
  }

  await prisma.$transaction(async (tx) => {
    if (remove.length) {
      await tx.userRole.deleteMany({
        where: { userId, role: { in: remove } },
      })
    }
    for (const role of add) {
      await tx.userRole.upsert({
        where: { userId_role: { userId, role } },
        create: { userId, role },
        update: {},
      })
    }
  })

  const updated = await prisma.user.findUnique({
    where: { id: userId },
    select: { roles: { select: { role: true } } },
  })
  const roles = updated?.roles.map((r) => r.role) ?? []

  return NextResponse.json({ roles })
}
