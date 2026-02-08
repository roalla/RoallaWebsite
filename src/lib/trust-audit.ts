import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export async function logTrustAction(params: {
  action: 'approved' | 'rejected' | 'resend_link'
  requestId?: string
  userId?: string
  metadata?: Record<string, unknown>
}) {
  try {
    await prisma.trustCenterAuditLog.create({
      data: {
        action: params.action,
        requestId: params.requestId ?? null,
        userId: params.userId ?? null,
        metadata: (params.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    })
  } catch (e) {
    console.error('Trust audit log failed:', e)
  }
}
