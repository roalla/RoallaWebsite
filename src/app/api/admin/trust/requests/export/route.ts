import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { roles?: string[] } | undefined
  if (!session || !user?.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const status = request.nextUrl.searchParams.get('status') as 'pending' | 'approved' | 'rejected' | null
  const search = request.nextUrl.searchParams.get('search')?.trim()?.toLowerCase() || ''

  type SearchWhere =
    | { email: { contains: string; mode: 'insensitive' } }
    | { name: { contains: string; mode: 'insensitive' } }
  const where: {
    status?: string
    OR?: SearchWhere[]
  } = {}
  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    where.status = status
  }
  if (search) {
    const term = { contains: search, mode: 'insensitive' as const }
    where.OR = [
      { email: term },
      { name: term },
    ]
  }

  const requests = await prisma.gatedAccessRequest.findMany({
    where: Object.keys(where).length ? where : undefined,
    orderBy: { createdAt: 'desc' },
    include: { ndaSignature: true },
  })

  const header = 'Email,Name,Company,Status,Created At,Reviewed At\n'
  const rows = requests.map((r) => {
    const escape = (s: string | null | undefined) => {
      if (s == null) return ''
      const t = String(s)
      return t.includes(',') || t.includes('"') || t.includes('\n') ? `"${t.replace(/"/g, '""')}"` : t
    }
    return [r.email, r.name, r.company ?? '', r.status, r.createdAt.toISOString(), r.reviewedAt?.toISOString() ?? ''].map(escape).join(',')
  })
  const csv = header + rows.join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="trust-gated-requests.csv"',
    },
  })
}
