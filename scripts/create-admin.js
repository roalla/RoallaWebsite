/**
 * Create the first admin user. Run once after deploying auth.
 *
 * Usage (set env vars then run):
 *   ADMIN_EMAIL=admin@roalla.com ADMIN_PASSWORD=yourSecurePassword node scripts/create-admin.js
 *
 * Or with .env.local loaded (create .env.local with ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL):
 *   node -r dotenv/config scripts/create-admin.js
 *   (requires: npm install dotenv)
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

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
