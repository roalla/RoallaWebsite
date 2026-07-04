'use client'

import { usePathname } from '@/i18n/navigation'
import Header from './Header'
import Footer from './Footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHub = pathname?.startsWith('/hub')
  const isAuthCallback = pathname?.startsWith('/auth/callback')

  if (isHub || isAuthCallback) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="bg-white">{children}</main>
      <Footer />
    </>
  )
}
