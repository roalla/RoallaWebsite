'use client'

import { useTranslations } from 'next-intl'
import type { HubDatabaseEnvDiagnostics } from '@/lib/hub/database-state'
import type { EnvVarStatus } from '@/lib/db'

type DatabaseNoticeReason =
  | 'missing'
  | 'empty_database_url'
  | 'invalid'
  | 'invalid_pg_vars'
  | 'unreachable'
  | 'ok'

type Props = {
  className?: string
  reason?: DatabaseNoticeReason
  invalidSources?: string[]
  env?: HubDatabaseEnvDiagnostics
  /** Full Railway diagnostics — admins only. */
  showDiagnostics?: boolean
}

export default function HubDatabaseNotice({
  className = '',
  reason = 'missing',
  invalidSources = [],
  env,
  showDiagnostics = true,
}: Props) {
  const t = useTranslations('hub')

  const envStatusLabel = (status: EnvVarStatus) => {
    if (status === 'set') return t('databaseEnv_set')
    if (status === 'empty') return t('databaseEnv_empty')
    if (status === 'unresolved_reference') return t('databaseEnv_unresolved_reference')
    if (status === 'invalid_url') return t('databaseEnv_invalid_url')
    return t('databaseEnv_missing')
  }

  const hintKey = showDiagnostics
    ? reason === 'empty_database_url'
      ? 'databaseEmptyUrlHint'
      : reason === 'invalid_pg_vars'
        ? 'databaseInvalidPgVarsHint'
        : reason === 'invalid'
          ? 'databaseInvalidUrlHint'
          : reason === 'unreachable'
            ? 'databaseUnreachableHint'
            : 'databaseNotConfiguredHint'
    : 'databaseUnavailableHint'

  const extraVars =
    env?.vars &&
    Object.entries(env.vars).filter(
      ([key]) => !['DATABASE_URL', 'DATABASE_PRIVATE_URL'].includes(key),
    )

  return (
    <div
      className={`rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 ${className}`}
      role="status"
    >
      <p className="font-medium">{t('databaseNotConfiguredTitle')}</p>
      <p className="mt-1 text-amber-900/90">{t(hintKey)}</p>
      {showDiagnostics && invalidSources.length > 0 && (
        <p className="mt-2 text-xs text-amber-900/80">
          {t('databaseInvalidSources', { sources: invalidSources.join(', ') })}
        </p>
      )}
      {showDiagnostics && extraVars && extraVars.length > 0 && (
        <p className="mt-2 text-xs text-amber-900/80">
          {t('databaseExtraVarsHint', { keys: extraVars.map(([k]) => k).join(', ') })}
        </p>
      )}
      {showDiagnostics && env && (
        <div className="mt-2 text-xs text-amber-900/80">
          <ul className="space-y-0.5 font-mono">
            {Object.entries(env.vars)
              .filter(([key]) => ['DATABASE_URL', 'DATABASE_PRIVATE_URL'].includes(key))
              .map(([key, status]) => (
                <li key={key}>
                  {key}: {envStatusLabel(status)}
                </li>
              ))}
          </ul>
          {env.matchedKeys.length > 0 && (
            <p className="mt-2">{t('databaseMatchedKeys', { keys: env.matchedKeys.join(', ') })}</p>
          )}
          {env.valueLengths && Object.keys(env.valueLengths).length > 0 && (
            <ul className="mt-1 space-y-0.5 font-mono">
              {Object.entries(env.valueLengths)
                .filter(([key]) => ['DATABASE_URL', 'DATABASE_PRIVATE_URL'].includes(key))
                .map(([key, length]) => (
                  <li key={key}>
                    {t('databaseEnvValueLength', { key, length })}
                    {env.valueSources?.[key] && length > 0
                      ? ` (${env.valueSources[key]})`
                      : env.valueSources?.[key]
                        ? ` (source: ${env.valueSources[key]}, empty)`
                        : ''}
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
