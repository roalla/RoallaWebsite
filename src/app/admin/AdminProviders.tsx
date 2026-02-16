'use client'

import { ToastProvider } from '@/components/Toast'
import { AdminViewAsProvider } from './AdminViewAsContext'

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <AdminViewAsProvider>
      <ToastProvider>{children}</ToastProvider>
    </AdminViewAsProvider>
  )
}
