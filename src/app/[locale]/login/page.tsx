import { setRequestLocale } from 'next-intl/server'
import { Suspense } from 'react'
import LoginForm from '@/components/LoginForm'

type Props = { params: Promise<{ locale: string }> }

export default async function LocaleLoginPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
