import fs from 'fs'
import path from 'path'
import { Pool } from 'pg'

let pool: Pool | null = null
let schemaReady = false

/** Read env var by name — case-insensitive (Railway users sometimes set database_url). */
export function readEnvVar(name: string): { key: string; value: string } | null {
  const direct = process.env[name]?.trim()
  if (direct) return { key: name, value: direct }

  const lower = name.toLowerCase()
  for (const [key, raw] of Object.entries(process.env)) {
    const value = raw?.trim()
    if (value && key.toLowerCase() === lower) return { key, value }
  }
  return null
}

/** True when a string looks like a complete Postgres connection URL. */
export function isValidDatabaseUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return false
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

const CANONICAL_URL_VARS = [
  'DATABASE_PRIVATE_URL',
  'DATABASE_URL',
  'DATABASE_PUBLIC_URL',
  'POSTGRES_URL',
  'POSTGRESQL_URL',
  'RAILWAY_DATABASE_URL',
] as const

export type EnvVarStatus = 'missing' | 'empty' | 'set' | 'unresolved_reference' | 'invalid_url'

function resolveEnvKey(name: string): string | undefined {
  if (name in process.env) return name
  return Object.keys(process.env).find((k) => k.toLowerCase() === name.toLowerCase())
}

export function envVarStatus(name: string, validateAsDatabaseUrl = false): EnvVarStatus {
  const key = resolveEnvKey(name)
  if (!key) return 'missing'
  const trimmed = process.env[key]?.trim() ?? ''
  if (!trimmed) return 'empty'
  if (/\$\{\{|\$\{/.test(trimmed)) return 'unresolved_reference'
  if (validateAsDatabaseUrl && !isValidDatabaseUrl(trimmed)) return 'invalid_url'
  return 'set'
}

/** Any env key that looks like a Postgres URL (names only — for diagnostics). */
export function discoverDatabaseEnvKeys(): string[] {
  const keys = new Set<string>()
  for (const key of Object.keys(process.env)) {
    const k = key.toLowerCase()
    if (
      k === 'database_url' ||
      k === 'database_private_url' ||
      k === 'database_public_url' ||
      k.endsWith('_database_url') ||
      (k.includes('database') && k.includes('url')) ||
      k === 'postgres_url' ||
      k === 'postgresql_url'
    ) {
      keys.add(key)
    }
  }
  return Array.from(keys).sort()
}

function readPgParts(): {
  host: string
  user: string
  password: string
  database: string
  port: string
} | null {
  const host = readEnvVar('PGHOST')?.value || readEnvVar('POSTGRES_HOST')?.value || ''
  const user = readEnvVar('PGUSER')?.value || readEnvVar('POSTGRES_USER')?.value || ''
  const password = readEnvVar('PGPASSWORD')?.value || readEnvVar('POSTGRES_PASSWORD')?.value || ''
  const database = readEnvVar('PGDATABASE')?.value || readEnvVar('POSTGRES_DB')?.value || ''
  const port = readEnvVar('PGPORT')?.value || readEnvVar('POSTGRES_PORT')?.value || '5432'

  if (!host || !user || !password || !database) return null
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
  return ['PGHOST', 'POSTGRES_HOST', 'PGUSER', 'POSTGRES_USER', 'PGPASSWORD', 'POSTGRES_PASSWORD', 'PGDATABASE', 'POSTGRES_DB', 'PGPORT', 'POSTGRES_PORT'].some(
    (name) => !!readEnvVar(name),
  )
}

function candidateDatabaseUrls(): { source: string; value: string }[] {
  const out: { source: string; value: string }[] = []
  const seen = new Set<string>()

  const add = (source: string, value: string) => {
    if (seen.has(value)) return
    seen.add(value)
    out.push({ source, value })
  }

  for (const name of CANONICAL_URL_VARS) {
    const hit = readEnvVar(name)
    if (hit) add(hit.key, hit.value)
  }

  for (const key of discoverDatabaseEnvKeys()) {
    const value = process.env[key]?.trim()
    if (value) add(key, value)
  }

  const built = buildPgConnectionString()
  if (built) add('PG* env vars', built)

  return out
}

/** Safe env snapshot for admin diagnostics (no secret values). */
export function databaseEnvDiagnostics(): {
  vars: Record<string, EnvVarStatus>
  matchedKeys: string[]
} {
  const vars: Record<string, EnvVarStatus> = {}
  for (const name of CANONICAL_URL_VARS) {
    vars[name] = envVarStatus(name, true)
  }
  vars.PGHOST = envVarStatus('PGHOST')
  vars.PGUSER = envVarStatus('PGUSER')
  vars.PGPASSWORD = envVarStatus('PGPASSWORD')
  vars.PGDATABASE = envVarStatus('PGDATABASE')
  vars.PGPORT = envVarStatus('PGPORT')

  return { vars, matchedKeys: discoverDatabaseEnvKeys() }
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

export type DatabaseConfigReason = 'ok' | 'missing' | 'empty_database_url' | 'invalid' | 'invalid_pg_vars'

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
    const dbEmpty = env.vars.DATABASE_URL === 'empty'
    return {
      configured: false,
      reason: dbEmpty ? 'empty_database_url' : 'missing',
      source: dbEmpty ? 'DATABASE_URL' : null,
      resolvedSource: null,
      invalidSources: [],
      env,
    }
  }

  const onlyPgVars =
    env.vars.DATABASE_URL !== 'set' &&
    env.vars.DATABASE_PRIVATE_URL !== 'set' &&
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
      readEnvVar('PGSSL')?.value === 'false'
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
        readEnvVar('PGSSL')?.value === 'false'
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
