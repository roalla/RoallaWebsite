import fs from 'fs'
import path from 'path'
import { Pool } from 'pg'

let pool: Pool | null = null
let schemaReady = false

/** True when a string looks like a complete Postgres connection URL. */
export function isValidDatabaseUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return false
  // Reject unresolved Railway / template placeholders (e.g. "${{Postgres.DATABASE_URL}}").
  if (/\$\{\{|\$\{/.test(trimmed)) return false

  try {
    const normalized = trimmed.replace(/^postgresql:/i, 'postgres:')
    const parsed = new URL(normalized)
    if (parsed.protocol !== 'postgres:') return false
    if (!parsed.hostname) return false
    const db = parsed.pathname.replace(/^\//, '')
    if (!db) return false
    return true
  } catch {
    return false
  }
}

const ENV_URL_SOURCES = [
  // Prefer private network URL on Railway when both are set (avoids stale public overrides).
  'DATABASE_PRIVATE_URL',
  'DATABASE_URL',
  'POSTGRES_URL',
  'POSTGRESQL_URL',
  'RAILWAY_DATABASE_URL',
] as const

function candidateDatabaseUrls(): { source: string; value: string }[] {
  const out: { source: string; value: string }[] = []
  for (const name of ENV_URL_SOURCES) {
    const value = process.env[name]?.trim()
    if (value) out.push({ source: name, value })
  }

  const host = process.env.PGHOST
  const user = process.env.PGUSER
  const password = process.env.PGPASSWORD
  const database = process.env.PGDATABASE || process.env.POSTGRES_DB
  const port = process.env.PGPORT || '5432'

  if (host && user && password && database) {
    out.push({
      source: 'PG* env vars',
      value: `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}`,
    })
  }

  return out
}

/** Resolve Postgres URL from common Railway / platform env var names. */
export function resolveDatabaseUrl(): string | undefined {
  for (const { value } of candidateDatabaseUrls()) {
    if (isValidDatabaseUrl(value)) return value
  }
  return undefined
}

export function dbConfigured(): boolean {
  return !!resolveDatabaseUrl()
}

export type DatabaseConfigReason = 'ok' | 'missing' | 'invalid'

/** For ops/debug — why the hub database may be unavailable (no secrets logged). */
export function databaseConfigStatus(): {
  configured: boolean
  reason: DatabaseConfigReason
  source: string | null
  resolvedSource: string | null
  invalidSources: string[]
} {
  const candidates = candidateDatabaseUrls()
  const invalidSources = candidates
    .filter(({ value }) => !isValidDatabaseUrl(value))
    .map(({ source }) => source)

  const resolved = candidates.find(({ value }) => isValidDatabaseUrl(value))

  if (resolved) {
    return {
      configured: true,
      reason: 'ok',
      source: resolved.source,
      resolvedSource: resolved.source,
      invalidSources,
    }
  }

  if (candidates.length === 0) {
    return {
      configured: false,
      reason: 'missing',
      source: null,
      resolvedSource: null,
      invalidSources: [],
    }
  }

  return {
    configured: false,
    reason: 'invalid',
    source: candidates[0]?.source ?? null,
    resolvedSource: null,
    invalidSources,
  }
}

/** Lightweight connectivity check (does not run schema migrations). */
export async function dbReachable(): Promise<boolean> {
  const connectionString = resolveDatabaseUrl()
  if (!connectionString) return false
  const client = new Pool({
    connectionString,
    ssl:
      process.env.PGSSL === 'false'
        ? false
        : process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : undefined,
    max: 1,
    connectionTimeoutMillis: 5000,
  })
  try {
    await client.query('SELECT 1')
    return true
  } catch {
    return false
  } finally {
    await client.end().catch(() => undefined)
  }
}

function getPool(): Pool {
  const connectionString = resolveDatabaseUrl()
  if (!connectionString) throw new Error('DATABASE_URL not set.')
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl:
        process.env.PGSSL === 'false'
          ? false
          : process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : undefined,
    })
  }
  return pool
}

export async function ensureSchema(): Promise<boolean> {
  if (!dbConfigured()) return false
  if (schemaReady) return true
  const sql = fs.readFileSync(path.join(process.cwd(), 'schema.sql'), 'utf8')
  await getPool().query(sql)
  schemaReady = true
  return true
}

export async function dbQuery(text: string, params?: unknown[]) {
  await ensureSchema()
  return getPool().query(text, params)
}

/** Interface expected by @roalla/auth sync */
export const db = {
  configured: dbConfigured,
  getPool,
  ensureSchema,
  query: dbQuery,
}
