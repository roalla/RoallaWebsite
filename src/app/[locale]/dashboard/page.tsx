import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { canAccessAdmin } from '@/lib/access'
import { setRequestLocale } from 'next-intl/server'
import DashboardContent from './DashboardContent'

type Props = { params: Promise<{ locale: string }> }

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect(`/login?callbackUrl=/${locale}/dashboard`)
  }

  const isAdminOrPartner = canAccessAdmin(session.user)

  if (isAdminOrPartner) {
    redirect('/admin')
  }

  return (
    <DashboardContent
      locale={locale}
      userName={session.user.name ?? session.user.email ?? 'User'}
    />
  )
}
