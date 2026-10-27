import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import ToolkitReleaseConsole from '@/components/implementation-toolkits/ToolkitReleaseConsole'
import { getHubSession } from '@/lib/hub/auth-session'
import { canManageCustomers } from '@/lib/hub/permissions'
import { SITE_URL, SSO_HOME_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Client Toolkit Release | ROALLA',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function ToolkitReleasePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getHubSession()
  if (!session.signedIn || !session.user) {
    const returnUrl = `${SITE_URL}/${locale}/delivery/toolkit-release`
    redirect(`${SSO_HOME_URL.replace('/home.html', '')}/api/session/app-sso?client_id=roalla-hub&return_url=${encodeURIComponent(returnUrl)}`)
  }
  if (!canManageCustomers(session.user.role)) redirect(SSO_HOME_URL)

  return <ToolkitReleaseConsole locale={locale} operatorName={session.user.name || session.user.email} />
}
