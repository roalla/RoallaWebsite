import type { Metadata } from 'next'
import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { getHubSession } from '@/lib/hub/auth-session'
import { dbQuery } from '@/lib/db'
import { getHubDatabaseState } from '@/lib/hub/database-state'
import { canAccessModule, canWritePlaybooks } from '@/lib/hub/permissions'
import PlaybooksHub from '@/components/hub/PlaybooksHub'
import type { ChecklistItem } from '@/lib/db/schema'

export const metadata: Metadata = {
  title: 'Playbooks | Roalla Internal Hub',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export default async function HubPlaybooksPage({ params }: Props) {
  noStore()
  const { locale } = await params
  const session = await getHubSession()
  if (!session.signedIn || !session.user) redirect(`/${locale}/hub/login`)
  if (!canAccessModule(session.user.role, 'playbooks')) redirect(`/${locale}/hub`)

  let runs: { id: string; template_id: string; title: string; checklist: ChecklistItem[]; updated_at: string }[] = []
  let databaseState = await getHubDatabaseState()

  if (databaseState.available) {
    try {
      const res = await dbQuery(`SELECT * FROM playbook_runs ORDER BY updated_at DESC LIMIT 20`)
      runs = res.rows as typeof runs
    } catch (err) {
      console.error('Hub playbooks database query failed', err)
      databaseState.available = false
      databaseState.reason = 'unreachable'
    }
  }

  return (
    <PlaybooksHub
      initialRuns={runs}
      canWrite={canWritePlaybooks(session.user.role)}
      databaseState={databaseState}
    />
  )
}
