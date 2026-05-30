'use client'

import Header from './Header'
import Footer from './Footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
    </>
  )
}
