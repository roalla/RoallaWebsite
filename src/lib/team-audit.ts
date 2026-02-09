import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export async function logTeamAction(params: {
  action: 'user_added' | 'roles_updated' | 'user_deleted'
  actorUserId?: string
  targetUserId?: string
  metadata?: Record<string, unknown>
}) {
  try {
    await prisma.teamAuditLog.create({
      data: {
        action: params.action,
        actorUserId: params.actorUserId ?? null,
        targetUserId: params.targetUserId ?? null,
        metadata: (params.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    })
  } catch (e) {
    console.error('Team audit log failed:', e)
  }
}
