import fs from 'fs'
import path from 'path'
import { Pool } from 'pg'

let pool: Pool | null = null
let schemaReady = false

export function dbConfigured(): boolean {
  return !!process.env.DATABASE_URL
}

function getPool(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set.')
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
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
