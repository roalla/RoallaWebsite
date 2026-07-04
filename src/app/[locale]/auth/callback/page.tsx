import type { Metadata } from 'next'
import AuthCallbackClient from '@/components/auth/AuthCallbackClient'

export const metadata: Metadata = {
  title: 'Signing in… | ROALLA',
  robots: { index: false, follow: false },
}

type Props = {
  searchParams: Promise<{ return?: string }>
}

export default async function AuthCallbackPage({ searchParams }: Props) {
  const sp = await searchParams
  const returnPath = sp.return || '/en/hub'

  return <AuthCallbackClient returnPath={returnPath} />
}
