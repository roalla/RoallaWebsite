import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import TeamManager from './TeamManager'

export const dynamic = 'force-dynamic'

export default async function AdminTeamPage() {
  const session = await getServerSession(authOptions)
  const currentUserId = (session?.user as { id?: string } | undefined)?.id ?? null

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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Team & roles</h1>
      <p className="text-gray-600 mb-6">
        Manage platform access: assign admin, partner, business, or member roles. Users can have multiple roles.
      </p>
      <TeamManager initialUsers={list} currentUserId={currentUserId} />
    </div>
  )
}
