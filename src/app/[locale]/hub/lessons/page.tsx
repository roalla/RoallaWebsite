import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getHubSession } from '@/lib/hub/auth-session'
import { canAccessModule } from '@/lib/hub/permissions'
import NotionEmbed from '@/components/hub/NotionEmbed'
import { notionLessonsEmbedUrl } from '@/lib/hub/notion-config'
import { getHubAdminEmailDisplay } from '@/lib/hub/roles'

export const metadata: Metadata = {
  title: 'Lessons Learned | Roalla Internal Hub',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export default async function HubLessonsPage({ params }: Props) {
  const { locale } = await params
  const session = await getHubSession()
  if (!session.signedIn || !session.user) redirect(`/${locale}/hub/login`)
  if (!canAccessModule(session.user.role, 'lessons')) redirect(`/${locale}/hub`)

  const embedUrl = notionLessonsEmbedUrl()

  return (
    <NotionEmbed
      embedUrl={embedUrl}
      titleKey="navLessons"
      subtitleKey="navLessonsSubtitle"
      comingSoonKey="lessonsComingSoon"
      hintKey="lessonsComingSoonHint"
      adminEmail={getHubAdminEmailDisplay()}
    />
  )
}
