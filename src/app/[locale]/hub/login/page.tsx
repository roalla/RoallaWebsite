import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { SSO_HOME_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Team Sign In | ROALLA',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

/** Employee sign-in lives on SSO Home — keep route for old bookmarks. */
export default function HubLoginPage() {
  redirect(SSO_HOME_URL)
}
