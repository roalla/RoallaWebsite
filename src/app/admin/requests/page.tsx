import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

/** Redirect old Library access URL to Portal access (integrated under Portal content). */
export default async function AdminRequestsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const query = tab ? `?tab=${encodeURIComponent(tab)}` : ''
  redirect(`/admin/portal-access${query}`)
}
