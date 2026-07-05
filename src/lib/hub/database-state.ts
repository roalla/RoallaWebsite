import { databaseConfigStatus, dbConfigured, dbQuery, dbReachable } from '@/lib/db'

export type HubDatabaseState = {
  available: boolean
  reason: 'ok' | 'missing' | 'invalid' | 'unreachable'
  invalidSources: string[]
}

/** Resolve whether hub pages can use Postgres (config + optional live query). */
export async function getHubDatabaseState(options?: {
  verifyQuery?: boolean
}): Promise<HubDatabaseState> {
  const config = databaseConfigStatus()
  if (!config.configured) {
    return {
      available: false,
      reason: config.reason,
      invalidSources: config.invalidSources,
    }
  }

  if (options?.verifyQuery) {
    try {
      await dbQuery('SELECT 1')
      return { available: true, reason: 'ok', invalidSources: config.invalidSources }
    } catch {
      return {
        available: false,
        reason: 'unreachable',
        invalidSources: config.invalidSources,
      }
    }
  }

  const reachable = await dbReachable()
  if (!reachable) {
    return {
      available: false,
      reason: 'unreachable',
      invalidSources: config.invalidSources,
    }
  }

  return { available: true, reason: 'ok', invalidSources: config.invalidSources }
}

export function hubDatabaseConfigured(): boolean {
  return dbConfigured()
}
