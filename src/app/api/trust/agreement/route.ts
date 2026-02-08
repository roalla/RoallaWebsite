import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const agreement = await prisma.ndaAgreement.findFirst({
    orderBy: { effectiveAt: 'desc' },
  })
  if (!agreement) {
    return NextResponse.json({ agreement: null })
  }
  return NextResponse.json({
    agreement: {
      id: agreement.id,
      title: agreement.title,
      body: agreement.body,
      version: agreement.version,
      effectiveAt: agreement.effectiveAt,
    },
  })
}
