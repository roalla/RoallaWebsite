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
  'DATABASE_PRIVATE_URL',
  'DATABASE_URL',
  'DATABASE_PUBLIC_URL',
  'POSTGRES_URL',
  'POSTGRESQL_URL',
  'RAILWAY_DATABASE_URL',
] as const

function envPresence(value: string | undefined): 'missing' | 'set' | 'unresolved_reference' {
  const trimmed = value?.trim()
  if (!trimmed) return 'missing'
  if (/\$\{\{|\$\{/.test(trimmed)) return 'unresolved_reference'
  return 'set'
}

function readPgParts(): {
  host: string
  user: string
  password: string
  database: string
  port: string
} | null {
  const host = (process.env.PGHOST || process.env.POSTGRES_HOST || '').trim()
  const user = (process.env.PGUSER || process.env.POSTGRES_USER || '').trim()
  const password = (process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || '').trim()
  const database = (process.env.PGDATABASE || process.env.POSTGRES_DB || '').trim()
  const port = (process.env.PGPORT || process.env.POSTGRES_PORT || '5432').trim()

  if (!host || !user || !password || !database) return null

  // Common misconfiguration: pasting a full URL into PGHOST or other PG* fields.
  if (host.includes('://') || user.includes('://') || database.includes('://')) return null
  for (const part of [host, user, password, database, port]) {
    if (/\$\{\{|\$\{/.test(part)) return null
  }

  return { host, user, password, database, port }
}

function buildPgConnectionString(): string | null {
  const parts = readPgParts()
  if (!parts) return null
  return `postgresql://${encodeURIComponent(parts.user)}:${encodeURIComponent(parts.password)}@${parts.host}:${parts.port}/${encodeURIComponent(parts.database)}`
}

function pgVarsPresent(): boolean {
  const keys = [
    'PGHOST',
    'POSTGRES_HOST',
    'PGUSER',
    'POSTGRES_USER',
    'PGPASSWORD',
    'POSTGRES_PASSWORD',
    'PGDATABASE',
    'POSTGRES_DB',
    'PGPORT',
    'POSTGRES_PORT',
  ] as const
  return keys.some((k) => !!process.env[k]?.trim())
}

function candidateDatabaseUrls(): { source: string; value: string }[] {
  const out: { source: string; value: string }[] = []
  for (const name of ENV_URL_SOURCES) {
    const value = process.env[name]?.trim()
    if (value) out.push({ source: name, value })
  }

  const built = buildPgConnectionString()
  if (built) out.push({ source: 'PG* env vars', value: built })

  return out
}

/** Safe env snapshot for admin diagnostics (no secret values). */
export function databaseEnvDiagnostics(): Record<string, 'missing' | 'set' | 'unresolved_reference'> {
  return {
    DATABASE_PRIVATE_URL: envPresence(process.env.DATABASE_PRIVATE_URL),
    DATABASE_URL: envPresence(process.env.DATABASE_URL),
    DATABASE_PUBLIC_URL: envPresence(process.env.DATABASE_PUBLIC_URL),
    PGHOST: envPresence(process.env.PGHOST || process.env.POSTGRES_HOST),
    PGUSER: envPresence(process.env.PGUSER || process.env.POSTGRES_USER),
    PGPASSWORD: envPresence(process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD),
    PGDATABASE: envPresence(process.env.PGDATABASE || process.env.POSTGRES_DB),
    PGPORT: envPresence(process.env.PGPORT || process.env.POSTGRES_PORT),
  }
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

export type DatabaseConfigReason = 'ok' | 'missing' | 'invalid' | 'invalid_pg_vars'

/** For ops/debug — why the hub database may be unavailable (no secrets logged). */
export function databaseConfigStatus(): {
  configured: boolean
  reason: DatabaseConfigReason
  source: string | null
  resolvedSource: string | null
  invalidSources: string[]
  env: ReturnType<typeof databaseEnvDiagnostics>
} {
  const env = databaseEnvDiagnostics()
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
      env,
    }
  }

  if (candidates.length === 0) {
    return {
      configured: false,
      reason: 'missing',
      source: null,
      resolvedSource: null,
      invalidSources: [],
      env,
    }
  }

  const onlyPgVars =
    env.DATABASE_URL === 'missing' &&
    env.DATABASE_PRIVATE_URL === 'missing' &&
    pgVarsPresent() &&
    (invalidSources.includes('PG* env vars') || !buildPgConnectionString())

  return {
    configured: false,
    reason: onlyPgVars ? 'invalid_pg_vars' : 'invalid',
    source: candidates[0]?.source ?? null,
    resolvedSource: null,
    invalidSources,
    env,
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
