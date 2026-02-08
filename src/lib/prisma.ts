import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/** Build a valid connection URL from PG* env vars (encodes user/password to fix P1013 when they contain : @ / etc.) */
function buildDatabaseUrlFromPgVars(): string | undefined {
  const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env
  if (!PGUSER || !PGPASSWORD || !PGHOST || !PGDATABASE) return undefined
  const port = String(PGPORT || '5432').trim().replace(/\D/g, '') || '5432'
  const u = encodeURIComponent(PGUSER)
  const p = encodeURIComponent(PGPASSWORD)
  return `postgresql://${u}:${p}@${PGHOST}:${port}/${PGDATABASE}`
}

// Prefer PG* vars when all set (avoids broken DATABASE_URL). Otherwise use DATABASE_URL.
const fromPgVars = buildDatabaseUrlFromPgVars()
const databaseUrl = fromPgVars ?? (
  (process.env.DATABASE_URL?.startsWith('postgresql://') || process.env.DATABASE_URL?.startsWith('postgres://'))
    ? process.env.DATABASE_URL
    : undefined
)

if (!databaseUrl) {
  const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env
  console.error('❌ No valid database URL. PG* vars:', {
    PGUSER: PGUSER ? 'set' : 'missing',
    PGPASSWORD: PGPASSWORD ? 'set' : 'missing',
    PGHOST: PGHOST ? 'set' : 'missing',
    PGPORT: PGPORT ? `set(${String(PGPORT).length} chars)` : 'missing',
    PGDATABASE: PGDATABASE ? 'set' : 'missing',
    DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'missing',
  })
} else if (fromPgVars) {
  console.log('✅ Using database URL built from PG* variables')
} else {
  console.log('✅ Using DATABASE_URL from environment')
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
