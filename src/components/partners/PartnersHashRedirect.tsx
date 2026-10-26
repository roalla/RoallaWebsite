'use client'

import { useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { partnersHashRedirects } from '@/lib/partners-sections'

export default function PartnersHashRedirect() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash) return
    const target = partnersHashRedirects[hash]
    if (!target) return
    router.replace(target)
  }, [router])

  return null
}
