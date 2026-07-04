import type { Metadata } from 'next'
import { unstable_noStore as noStore } from 'next/cache'
import { getHubSession } from '@/lib/hub/auth-session'
import HubShell from '@/components/hub/HubShell'
import type { HubRole } from '@/lib/hub/roles'

/** Read auth env at request time — do not statically bake at build (Railway runtime vars). */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Internal Hub | ROALLA',
  robots: { index: false, follow: false },
}

export default async function HubLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  noStore()
  const { locale } = await params
  const session = await getHubSession()

  // Login page renders without shell — detected via parallel route... 
  // We pass through; child pages handle auth. Shell only when signed in.
  if (!session.signedIn || !session.user) {
    return <>{children}</>
  }

  return (
    <HubShell
      userName={session.user.name}
      userEmail={session.user.email}
      role={session.user.role as HubRole}
      locale={locale}
    >
      {children}
    </HubShell>
  )
}
