import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trust Centre | Roalla Business Enablement Group',
  description: 'Access secure documents, NDA-gated content, and trust centre resources. Request access or sign in with your link.',
}

export default function TrustLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
