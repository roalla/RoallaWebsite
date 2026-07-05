import { databaseConfigStatus, dbConfigured, dbQuery, type databaseEnvDiagnostics } from '@/lib/db'

export type HubDatabaseEnvDiagnostics = ReturnType<typeof databaseEnvDiagnostics>

export type HubDatabaseState = {
  available: boolean
  reason: 'ok' | 'missing' | 'empty_database_url' | 'invalid' | 'invalid_pg_vars' | 'unreachable'
  invalidSources: string[]
  env?: HubDatabaseEnvDiagnostics
}

/** Resolve whether hub pages can use Postgres (config check; query errors → unreachable). */
export async function getHubDatabaseState(options?: {
  verifyQuery?: boolean
}): Promise<HubDatabaseState> {
  const config = databaseConfigStatus()
  if (!config.configured) {
    return {
      available: false,
      reason: config.reason,
      invalidSources: config.invalidSources,
      env: config.env,
    }
  }

  if (options?.verifyQuery) {
    try {
      await dbQuery('SELECT 1')
      return {
        available: true,
        reason: 'ok',
        invalidSources: config.invalidSources,
        env: config.env,
      }
    } catch {
      return {
        available: false,
        reason: 'unreachable',
        invalidSources: config.invalidSources,
        env: config.env,
      }
    }
  }

  return {
    available: true,
    reason: 'ok',
    invalidSources: config.invalidSources,
    env: config.env,
  }
}

export function hubDatabaseConfigured(): boolean {
  return dbConfigured()
}
