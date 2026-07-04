import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getHubSession } from '@/lib/hub/auth-session'
import { canAccessModule } from '@/lib/hub/permissions'
import NotionEmbed from '@/components/hub/NotionEmbed'
import { notionPartnersUrls } from '@/lib/hub/notion-config'
import { getHubAdminEmailDisplay } from '@/lib/hub/roles'

export const metadata: Metadata = {
  title: 'Partners | Roalla Internal Hub',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export default async function HubPartnersPage({ params }: Props) {
  const { locale } = await params
  const session = await getHubSession()
  if (!session.signedIn || !session.user) redirect(`/${locale}/hub/login`)
  if (!canAccessModule(session.user.role, 'partners')) redirect(`/${locale}/hub`)

  const { viewUrl } = notionPartnersUrls()

  return (
    <NotionEmbed
      viewUrl={viewUrl}
      titleKey="navPartners"
      subtitleKey="navPartnersSubtitle"
      comingSoonKey="partnersComingSoon"
      hintKey="partnersComingSoonHint"
      openKey="notionOpenPartners"
      adminEmail={getHubAdminEmailDisplay()}
    />
  )
}
