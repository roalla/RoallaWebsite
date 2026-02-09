import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/** Shareable client portal link: /p/acme -> /resources/portal?org=acme */
export default async function ShareablePortalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!slug?.trim()) redirect('/resources/portal')

  const org = await prisma.organization.findUnique({
    where: { slug: slug.trim() },
    select: { slug: true },
  })
  if (!org) redirect('/resources/portal')

  redirect(`/resources/portal?org=${encodeURIComponent(org.slug!)}`)
}
