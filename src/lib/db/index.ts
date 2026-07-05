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

/** Resolve Postgres URL from common Railway / platform env var names. */
export function resolveDatabaseUrl(): string | undefined {
  const direct =
    process.env.DATABASE_URL ||
    process.env.DATABASE_PRIVATE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRESQL_URL ||
    process.env.RAILWAY_DATABASE_URL

  if (direct?.trim()) {
    const value = direct.trim()
    return isValidDatabaseUrl(value) ? value : undefined
  }

  const host = process.env.PGHOST
  const user = process.env.PGUSER
  const password = process.env.PGPASSWORD
  const database = process.env.PGDATABASE || process.env.POSTGRES_DB
  const port = process.env.PGPORT || '5432'

  if (host && user && password && database) {
    const built = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}`
    return isValidDatabaseUrl(built) ? built : undefined
  }

  return undefined
}

export function dbConfigured(): boolean {
  return !!resolveDatabaseUrl()
}

/** For ops/debug — why the hub database may be unavailable (no secrets logged). */
export function databaseConfigStatus(): {
  configured: boolean
  source: string | null
  invalidUrl: boolean
} {
  const sources = [
    ['DATABASE_URL', process.env.DATABASE_URL],
    ['DATABASE_PRIVATE_URL', process.env.DATABASE_PRIVATE_URL],
    ['POSTGRES_URL', process.env.POSTGRES_URL],
    ['POSTGRESQL_URL', process.env.POSTGRESQL_URL],
    ['RAILWAY_DATABASE_URL', process.env.RAILWAY_DATABASE_URL],
  ] as const

  for (const [name, value] of sources) {
    const trimmed = value?.trim()
    if (!trimmed) continue
    if (!isValidDatabaseUrl(trimmed)) {
      return { configured: false, source: name, invalidUrl: true }
    }
    return { configured: true, source: name, invalidUrl: false }
  }

  if (
    process.env.PGHOST &&
    process.env.PGUSER &&
    process.env.PGPASSWORD &&
    (process.env.PGDATABASE || process.env.POSTGRES_DB)
  ) {
    return { configured: dbConfigured(), source: 'PG* env vars', invalidUrl: !dbConfigured() }
  }

  return { configured: false, source: null, invalidUrl: false }
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
