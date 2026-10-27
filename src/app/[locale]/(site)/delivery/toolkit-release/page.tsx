import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import ToolkitReleaseConsole from '@/components/implementation-toolkits/ToolkitReleaseConsole'
import { getHubSession } from '@/lib/hub/auth-session'
import { canManageCustomers } from '@/lib/hub/permissions'
import { roallaAuthClientId } from '@/lib/roalla-auth/config'
import { SITE_URL, SSO_HOME_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Client Toolkit Release | ROALLA',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function ToolkitReleasePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ sso_error?: string }>
}) {
  const { locale } = await params
  const query = await searchParams
  const session = await getHubSession()
  if (!session.signedIn || !session.user) {
    if (query.sso_error) {
      return (
        <main className="section" style={{ maxWidth: 640, margin: '4rem auto', padding: '0 1.25rem' }}>
          <h1>Sign-in handoff failed</h1>
          <p>The site could not finish signing you in. Open the toolkit again from SSO Home.</p>
        </main>
      )
    }
    const returnUrl = `${SITE_URL}/${locale}/delivery/toolkit-release`
    const clientId = roallaAuthClientId() || 'roalla'
    redirect(
      `${SSO_HOME_URL.replace('/home.html', '')}/api/session/app-sso?client_id=${encodeURIComponent(clientId)}&return_url=${encodeURIComponent(returnUrl)}`,
    )
  }
  if (!canManageCustomers(session.user.role)) redirect(SSO_HOME_URL)

  return <ToolkitReleaseConsole locale={locale} operatorName={session.user.name || session.user.email} />
}
