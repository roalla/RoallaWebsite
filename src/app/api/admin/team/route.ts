import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { roles?: string[] } | undefined
  if (!session || !user?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    orderBy: { email: 'asc' },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      createdAt: true,
      roles: { select: { role: true } },
    },
  })

  const list = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    image: u.image,
    primaryRole: u.role,
    roles: u.roles.map((r) => r.role),
    createdAt: u.createdAt,
  }))

  return NextResponse.json(list)
}
