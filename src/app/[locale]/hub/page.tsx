import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { SSO_HOME_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Dashboard | Website CMS (legacy)',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

/** Operator dashboard is SSO Home — keep route for old bookmarks. */
export default function HubDashboardPage() {
  redirect(SSO_HOME_URL)
}
