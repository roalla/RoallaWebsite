import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import DigitalEventsPlaybook from '@/components/private/DigitalEventsPlaybook'
import { getHubSession } from '@/lib/hub/auth-session'
import { canAccessModule } from '@/lib/hub/permissions'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = {
  title: 'Digital Events Playbook | Roalla Internal Hub',
  robots: { index: false, follow: false },
}

type Props = { params: Promise<{ locale: string }> }

export default async function DigitalEventsPlaybookHubPage({ params }: Props) {
  const { locale } = await params
  const session = await getHubSession()
  if (!session.signedIn) redirect(`/${locale}/hub/login`)
  if (!session.user || !canAccessModule(session.user.role, 'playbooks')) {
    redirect(`/${locale}/hub`)
  }

  return (
    <div>
      <Link href="/hub/playbooks" className="text-sm text-amber-700 hover:underline mb-4 inline-block">
        ← Back to playbooks
      </Link>
      <DigitalEventsPlaybook />
    </div>
  )
}
