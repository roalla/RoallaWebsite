'use client'

import { ToastProvider } from '@/components/Toast'

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}
