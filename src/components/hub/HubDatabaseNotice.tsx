'use client'

import { useTranslations } from 'next-intl'

type DatabaseNoticeReason = 'missing' | 'invalid' | 'invalid_pg_vars' | 'unreachable' | 'ok'

type Props = {
  className?: string
  reason?: DatabaseNoticeReason
  invalidSources?: string[]
}

export default function HubDatabaseNotice({
  className = '',
  reason = 'missing',
  invalidSources = [],
}: Props) {
  const t = useTranslations('hub')

  const hintKey =
    reason === 'invalid_pg_vars'
      ? 'databaseInvalidPgVarsHint'
      : reason === 'invalid'
        ? 'databaseInvalidUrlHint'
        : reason === 'unreachable'
          ? 'databaseUnreachableHint'
          : 'databaseNotConfiguredHint'

  return (
    <div
      className={`rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 ${className}`}
      role="status"
    >
      <p className="font-medium">{t('databaseNotConfiguredTitle')}</p>
      <p className="mt-1 text-amber-900/90">{t(hintKey)}</p>
      {invalidSources.length > 0 && (
        <p className="mt-2 text-xs text-amber-900/80">
          {t('databaseInvalidSources', { sources: invalidSources.join(', ') })}
        </p>
      )}
    </div>
  )
}
