import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { SSO_HOME_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Tools | Website CMS (legacy)',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

/** Tools launcher moved to SSO Home — keep route for old bookmarks. */
export default function HubToolsPage() {
  redirect(SSO_HOME_URL)
}
