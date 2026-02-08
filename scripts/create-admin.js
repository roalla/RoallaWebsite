/**
 * Create the first admin user. Run once after deploying auth.
 *
 * Usage options:
 *
 * 1) .env.local (easiest on Windows)
 *    Add to .env.local: ADMIN_EMAIL=your@email.com, ADMIN_PASSWORD=yourPassword
 *    (and DATABASE_URL or PG* vars if the script runs locally against Railway DB)
 *    Then run: node scripts/create-admin.js
 *
 * 2) Windows CMD (replace with your real email and password):
 *    set ADMIN_EMAIL=your@email.com && set ADMIN_PASSWORD=YourPassword && node scripts/create-admin.js
 *
 * 3) Windows PowerShell:
 *    $env:ADMIN_EMAIL="your@email.com"; $env:ADMIN_PASSWORD="YourPassword"; node scripts/create-admin.js
 *
 * 4) Mac/Linux:
 *    ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourPassword node scripts/create-admin.js
 */

const path = require('path')
const fs = require('fs')

// Load .env.local so Windows users can just run: node scripts/create-admin.js
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8')
  content.split('\n').forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (m) {
      const key = m[1]
      let val = m[2].trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        val = val.slice(1, -1)
      if (!process.env[key]) process.env[key] = val
    }
  })
}

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

// Build DATABASE_URL from PG* vars (same as app) so .env.local can use public Railway TCP proxy
function buildDatabaseUrl() {
  const u = process.env.PGUSER
  const p = process.env.PGPASSWORD
  const host = process.env.PGHOST
  const db = process.env.PGDATABASE
  if (!u || !p || !host || !db) return process.env.DATABASE_URL
  const port = (process.env.PGPORT || '5432').trim().replace(/\D/g, '') || '5432'
  return `postgresql://${encodeURIComponent(u)}:${encodeURIComponent(p)}@${host}:${port}/${db}`
}

const databaseUrl = buildDatabaseUrl()
if (!databaseUrl || (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://'))) {
  console.error('No database connection. Add to .env.local either:')
  console.error('  DATABASE_URL=postgresql://... (use Railway’s *public* URL – see CREATE_ADMIN_RAILWAY.md)')
  console.error('  or PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE (public TCP proxy host/port from Railway)')
  process.exit(1)
}

const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } })

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (env vars) then run: node scripts/create-admin.js')
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('Password must be at least 8 characters.')
    process.exit(1)
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    if (existing.role === 'admin') {
      console.log('Admin user already exists for', email)
      process.exit(0)
    }
    await prisma.user.update({
      where: { email },
      data: { role: 'admin', passwordHash: await bcrypt.hash(password, 12) },
    })
    console.log('Updated user to admin:', email)
    process.exit(0)
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: {
      email,
      name: 'Admin',
      role: 'admin',
      passwordHash,
    },
  })
  console.log('Admin user created:', email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
