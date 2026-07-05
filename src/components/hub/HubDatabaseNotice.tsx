'use client'

import { useTranslations } from 'next-intl'

type Props = {
  className?: string
}

export default function HubDatabaseNotice({ className = '' }: Props) {
  const t = useTranslations('hub')

  return (
    <div
      className={`rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 ${className}`}
      role="status"
    >
      <p className="font-medium">{t('databaseNotConfiguredTitle')}</p>
      <p className="mt-1 text-amber-900/90">{t('databaseNotConfiguredHint')}</p>
    </div>
  )
}
