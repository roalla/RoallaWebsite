import fs from 'fs'
import path from 'path'
import { Pool } from 'pg'
import { parse as parsePgConnectionString } from 'pg-connection-string'
import { listRuntimeEnvKeys, listPostgresRelatedEnvKeys, lookupRuntimeEnv, type RuntimeEnvSource } from '@/lib/db/runtime-env'

let pool: Pool | null = null
let schemaReady = false

/** Strip wrapping quotes Railway users sometimes paste into variable values. */
export function normalizeEnvValue(raw: string): string {
  let v = raw.trim()
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim()
  }
  return v
}

/** Read env var by name — case-insensitive; uses runtime env (Railway-safe). */
export function readEnvVar(name: string): { key: string; value: string } | null {
  const hit = lookupRuntimeEnv(name)
  if (!hit) return null
  const value = normalizeEnvValue(hit.value)
  if (!value) return null
  return { key: hit.key, value }
}

function resolveEnvKey(name: string): string | undefined {
  return lookupRuntimeEnv(name)?.key
}


export type DatabaseUrlShape = {
  length: number
  hostLength: number
  hasProtocol: boolean
  hasCredentials: boolean
  hasDatabasePath: boolean
  likelyTooShort: boolean
}

function hostLengthInUrl(trimmed: string): number {
  if (!/^postgres(ql)?:\/\//i.test(trimmed)) return 0
  const authHost = trimmed.replace(/^postgres(ql)?:\/\//i, '')
  const atIdx = authHost.lastIndexOf('@')
  if (atIdx < 0) {
    const hostPart = authHost.split('/')[0] ?? ''
    return hostPart.split(':')[0]?.length ?? 0
  }
  const hostPart = authHost.slice(atIdx + 1).split('/')[0] ?? ''
  return hostPart.split(':')[0]?.length ?? 0
}

/** Safe URL shape checks for ops UI (no secrets). */
export function describeDatabaseUrlShape(raw: string): DatabaseUrlShape {
  const trimmed = normalizeEnvValue(raw)
  const hasProtocol = /^postgres(ql)?:\/\//i.test(trimmed)
  const afterProtocol = hasProtocol ? trimmed.replace(/^postgres(ql)?:\/\//i, '') : trimmed
  const hasCredentials = hasProtocol && afterProtocol.includes('@')
  const hasDatabasePath =
    hasProtocol &&
    (/\:\d+\/\S+/.test(trimmed) || (afterProtocol.includes('@') && /@[^/]+\/\S+/.test(trimmed)))
  return {
    length: trimmed.length,
    hostLength: hostLengthInUrl(trimmed),
    hasProtocol,
    hasCredentials,
    hasDatabasePath,
    likelyTooShort: trimmed.length > 0 && trimmed.length < 70,
  }
}

export type DatabaseUrlIssue =
  | 'ok'
  | 'empty'
  | 'unresolved_reference'
  | 'missing_protocol'
  | 'missing_host'
  | 'missing_database'
  | 'too_short'
  | 'invalid'

function hasEmptyHostInUrl(trimmed: string): boolean {
  if (!/^postgres(ql)?:\/\//i.test(trimmed)) return false
  const authHost = trimmed.replace(/^postgres(ql)?:\/\//i, '')
  const atIdx = authHost.lastIndexOf('@')
  if (atIdx < 0) return false
  const hostPart = authHost.slice(atIdx + 1).split('/')[0] ?? ''
  return !hostPart.split(':')[0]
}

/** Safe parse diagnosis for ops UI (no secrets). */
export function diagnoseDatabaseUrl(raw: string): DatabaseUrlShape & { issue: DatabaseUrlIssue } {
  const trimmed = normalizeEnvValue(raw)
  const shape = describeDatabaseUrlShape(trimmed)
  if (!trimmed) return { ...shape, issue: 'empty' }
  if (/\$\{\{|\$\{/.test(trimmed)) return { ...shape, issue: 'unresolved_reference' }
  if (!/^postgres(ql)?:\/\//i.test(trimmed) && !trimmed.startsWith('/')) {
    return { ...shape, issue: 'missing_protocol' }
  }
  if (hasEmptyHostInUrl(trimmed)) return { ...shape, issue: 'missing_host' }

  try {
    const config = parsePgConnectionString(trimmed)
    if (!config.host) return { ...shape, issue: 'missing_host' }
    if (!config.database) return { ...shape, issue: 'missing_database' }
    if (shape.hostLength > 0 && shape.hostLength < 12 && shape.likelyTooShort) {
      return { ...shape, issue: 'too_short' }
    }
    if (shape.likelyTooShort) return { ...shape, issue: 'too_short' }
    return { ...shape, issue: 'ok' }
  } catch {
    if (hasEmptyHostInUrl(trimmed)) return { ...shape, issue: 'missing_host' }
    return { ...shape, issue: shape.likelyTooShort ? 'too_short' : 'invalid' }
  }
}

/** True when pg can parse the connection string (same rules as the pg driver). */
export function isValidDatabaseUrl(url: string): boolean {
  return diagnoseDatabaseUrl(url).issue === 'ok'
}

/** Vars the app reads for Postgres (Railway: link Postgres → DATABASE_URL on the web service). */
const RESOLVE_URL_VARS = ['DATABASE_PRIVATE_URL', 'DATABASE_URL'] as const

/** Extra fallbacks if a platform sets them; not shown in hub UI. */
const FALLBACK_URL_VARS = [
  'DATABASE_PUBLIC_URL',
  'POSTGRES_URL',
  'POSTGRESQL_URL',
  'RAILWAY_DATABASE_URL',
] as const

/** Only DATABASE_URL is required on Railway; shown in hub diagnostics. */
const DISPLAY_DIAG_VARS = ['DATABASE_URL'] as const

export type EnvVarStatus = 'missing' | 'empty' | 'set' | 'unresolved_reference' | 'invalid_url'

export function envVarStatus(name: string, validateAsDatabaseUrl = false): EnvVarStatus {
  const hit = lookupRuntimeEnv(name)
  if (!hit) return 'missing'
  const trimmed = normalizeEnvValue(hit.value)
  if (!trimmed) return 'empty'
  if (/\$\{\{|\$\{/.test(trimmed)) return 'unresolved_reference'
  if (validateAsDatabaseUrl && !isValidDatabaseUrl(trimmed)) return 'invalid_url'
  return 'set'
}

/** Any env key that looks like a Postgres URL (names only — for diagnostics). */
export function discoverDatabaseEnvKeys(): string[] {
  const keys = new Set<string>()
  for (const key of listRuntimeEnvKeys()) {
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

  for (const name of [...RESOLVE_URL_VARS, ...FALLBACK_URL_VARS]) {
    const hit = readEnvVar(name)
    if (hit) add(hit.key, hit.value)
  }

  for (const key of discoverDatabaseEnvKeys()) {
    const value = normalizeEnvValue(lookupRuntimeEnv(key)?.value ?? '')
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
  valueLengths: Record<string, number>
  valueSources: Record<string, RuntimeEnvSource>
  urlShape: Record<string, DatabaseUrlShape>
  urlIssue: Record<string, DatabaseUrlIssue>
  postgresEnvKeys: { key: string; length: number; source: RuntimeEnvSource }[]
  totalEnvVarCount: number
} {
  const vars: Record<string, EnvVarStatus> = {}
  for (const name of DISPLAY_DIAG_VARS) {
    vars[name] = envVarStatus(name, true)
  }

  const matchedKeys = discoverDatabaseEnvKeys().filter(
    (k) => k.toLowerCase() !== 'hub_database_url',
  )
  const valueLengths: Record<string, number> = {}
  const valueSources: Record<string, RuntimeEnvSource> = {}
  for (const name of DISPLAY_DIAG_VARS) {
    const hit = lookupRuntimeEnv(name)
    if (hit) {
      valueLengths[hit.key] = hit.value.length
      valueSources[hit.key] = hit.source
    }
  }
  // Flag legacy/extra vars that should be removed (not required on Railway).
  const extraKeys = discoverDatabaseEnvKeys().filter((k) => {
    const lower = k.toLowerCase()
    return (
      lower === 'hub_database_url' ||
      (!DISPLAY_DIAG_VARS.some((d) => d.toLowerCase() === lower) &&
        !FALLBACK_URL_VARS.some((d) => d.toLowerCase() === lower))
    )
  })
  for (const key of extraKeys) {
    const hit = lookupRuntimeEnv(key)
    valueLengths[key] = hit?.value.length ?? 0
    if (hit) valueSources[key] = hit.source
    vars[key] = envVarStatus(key, true)
  }

  const urlShape: Record<string, DatabaseUrlShape> = {}
  const urlIssue: Record<string, DatabaseUrlIssue> = {}
  for (const key of Object.keys(valueLengths)) {
    const hit = lookupRuntimeEnv(key)
    const raw = hit?.value ?? ''
    if (raw.length > 0) {
      const diagnosis = diagnoseDatabaseUrl(raw)
      urlShape[key] = diagnosis
      if (diagnosis.issue !== 'ok') urlIssue[key] = diagnosis.issue
    }
  }

  return {
    vars,
    matchedKeys,
    valueLengths,
    valueSources,
    urlShape,
    urlIssue,
    postgresEnvKeys: listPostgresRelatedEnvKeys(),
    totalEnvVarCount: listRuntimeEnvKeys().length,
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
