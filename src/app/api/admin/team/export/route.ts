import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canManageTeam, isAdmin } from '@/lib/access'

export const dynamic = 'force-dynamic'

function escapeCsvCell(value: string | null | undefined): string {
  if (value == null) return ''
  const s = String(value)
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !canManageTeam(session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const currentUserId = (session.user as { id?: string }).id
  const currentUserDb = currentUserId
    ? await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { organizationId: true },
      })
    : null

  const where: { organizationId?: string | null } = {}
  if (!isAdmin(session.user)) {
    if (!currentUserDb?.organizationId) {
      return new NextResponse('', {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="team.csv"',
        },
      })
    }
    where.organizationId = currentUserDb.organizationId
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { email: 'asc' },
    select: {
      email: true,
      name: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      organization: { select: { name: true } },
      roles: { select: { role: true } },
    },
  })

  const headers = ['Email', 'Name', 'Roles', 'Joined', 'Last active', 'Organization']
  const rows = users.map((u) => [
    escapeCsvCell(u.email),
    escapeCsvCell(u.name),
    escapeCsvCell(u.roles.map((r) => r.role).join('; ')),
    u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : '',
    u.lastLoginAt ? new Date(u.lastLoginAt).toISOString().slice(0, 19) + 'Z' : '',
    escapeCsvCell(u.organization?.name ?? ''),
  ])
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="team.csv"',
    },
  })
}
