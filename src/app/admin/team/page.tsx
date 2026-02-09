import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { canDeleteUser, canManageTeam, isAdmin } from '@/lib/access'
import TeamManager from './TeamManager'

export const dynamic = 'force-dynamic'

export default async function AdminTeamPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const currentUserId = (user as { id?: string } | undefined)?.id ?? null
  const canDelete = !!session && canDeleteUser(user)
  const canAssignAdmin = !!session && isAdmin(user)

  const where: { organizationId?: string | null } = {}
  if (session && canManageTeam(user) && !isAdmin(user)) {
    const currentUserDb = currentUserId
      ? await prisma.user.findUnique({ where: { id: currentUserId }, select: { organizationId: true } })
      : null
    if (currentUserDb?.organizationId) where.organizationId = currentUserDb.organizationId
    else {
      return (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Team & roles</h1>
          <p className="text-gray-600 mb-6">
            You don’t have an organization assigned. Contact an admin to get access to your team list.
          </p>
        </div>
      )
    }
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { email: 'asc' },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      organizationId: true,
      organization: { select: { id: true, name: true } },
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
    lastLoginAt: u.lastLoginAt,
    organizationId: u.organizationId,
    organizationName: u.organization?.name ?? null,
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Team & roles</h1>
      <p className="text-gray-600 mb-6">
        Manage platform access: assign admin, partner, business, or member roles. Users can have multiple roles.
      </p>
      <TeamManager initialUsers={list} currentUserId={currentUserId} canDeleteUser={canDelete} canAssignAdmin={canAssignAdmin} />
    </div>
  )
}
