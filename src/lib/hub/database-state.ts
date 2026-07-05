import { databaseConfigStatus, dbConfigured, dbQuery } from '@/lib/db'

export type HubDatabaseState = {
  available: boolean
  reason: 'ok' | 'missing' | 'invalid' | 'invalid_pg_vars' | 'unreachable'
  invalidSources: string[]
  env?: Record<string, 'missing' | 'set' | 'unresolved_reference'>
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
