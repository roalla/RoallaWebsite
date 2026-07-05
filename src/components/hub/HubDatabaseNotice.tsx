'use client'

import { useTranslations } from 'next-intl'

type DatabaseNoticeReason = 'missing' | 'invalid' | 'invalid_pg_vars' | 'unreachable' | 'ok'

type EnvStatus = 'missing' | 'set' | 'unresolved_reference'

type Props = {
  className?: string
  reason?: DatabaseNoticeReason
  invalidSources?: string[]
  env?: Record<string, EnvStatus>
}

export default function HubDatabaseNotice({
  className = '',
  reason = 'missing',
  invalidSources = [],
  env,
}: Props) {
  const t = useTranslations('hub')

  const envStatusLabel = (status: EnvStatus) => {
    if (status === 'set') return t('databaseEnv_set')
    if (status === 'unresolved_reference') return t('databaseEnv_unresolved_reference')
    return t('databaseEnv_missing')
  }
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
      {env && (
        <ul className="mt-2 space-y-0.5 text-xs font-mono text-amber-900/80">
          {Object.entries(env).map(([key, status]) => (
            <li key={key}>
              {key}: {envStatusLabel(status)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
