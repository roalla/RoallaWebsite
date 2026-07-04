import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getHubSession } from '@/lib/hub/auth-session'
import { canAccessModule } from '@/lib/hub/permissions'
import HubToolsLauncher from '@/components/hub/HubToolsLauncher'

export const metadata: Metadata = {
  title: 'Tools | Roalla Internal Hub',
  robots: { index: false, follow: false },
}

type Props = { params: Promise<{ locale: string }> }

export default async function HubToolsPage({ params }: Props) {
  const { locale } = await params
  const session = await getHubSession()
  if (!session.signedIn || !session.user) redirect(`/${locale}/hub/login`)
  if (!canAccessModule(session.user.role, 'tools')) redirect(`/${locale}/hub`)

  return <HubToolsLauncher />
}
