import type { Metadata } from 'next'
import HubLoginForm from '@/components/auth/HubLoginForm'
import { roallaAuthClientId, roallaAuthHubUrl, authConfigured } from '@/lib/roalla-auth/config'
import { getHubAdminEmailDisplay } from '@/lib/hub/roles'

export const metadata: Metadata = {
  title: 'Team Sign In | ROALLA',
  robots: { index: false, follow: false },
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ return?: string; verified?: string }>
}

export default async function HubLoginPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  const returnPath = sp.return || `/${locale}/hub`
  const callbackUrl = `/${locale}/auth/callback?return=${encodeURIComponent(returnPath)}`

  if (!authConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="rounded-xl border bg-white p-8 max-w-md text-center">
          <h1 className="text-xl font-semibold mb-2">Hub not configured</h1>
          <p className="text-sm text-slate-600">
            Set AUTH_URL, AUTH_CLIENT_ID, and APP_URL in the environment. Register the app at sso.roalla.com.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 to-white p-4">
      <HubLoginForm
        callbackUrl={callbackUrl}
        returnPath={returnPath}
        authHubUrl={roallaAuthHubUrl()}
        authClientId={roallaAuthClientId()}
        verified={sp.verified === '1'}
        hubAdminEmail={getHubAdminEmailDisplay()}
      />
    </div>
  )
}
