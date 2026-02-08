import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/** Build a valid connection URL from PG* env vars (encodes user/password to fix P1013 when they contain : @ / etc.) */
function buildDatabaseUrlFromPgVars(): string | undefined {
  const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env
  if (!PGUSER || !PGPASSWORD || !PGHOST || !PGDATABASE) return undefined
  const port = String(PGPORT || '5432').trim()
  const u = encodeURIComponent(PGUSER)
  const p = encodeURIComponent(PGPASSWORD)
  return `postgresql://${u}:${p}@${PGHOST}:${port}/${PGDATABASE}`
}

const databaseUrl =
  process.env.DATABASE_URL?.startsWith('postgresql://') || process.env.DATABASE_URL?.startsWith('postgres://')
    ? process.env.DATABASE_URL
    : buildDatabaseUrlFromPgVars()

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set and PGUSER/PGPASSWORD/PGHOST/PGPORT/PGDATABASE are not all set.')
} else if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
  console.error('❌ DATABASE_URL is invalid. It must start with postgresql:// or postgres://')
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
