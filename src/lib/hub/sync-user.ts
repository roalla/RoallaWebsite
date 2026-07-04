import { dbQuery, dbConfigured } from '@/lib/db'
import { defaultRoleForEmail, type HubRole } from '@/lib/hub/roles'

export type HubUser = {
  id: string
  email: string
  name: string
  role: HubRole
}

export async function ensureUserRole(userId: string, email: string, name = ''): Promise<HubUser | null> {
  if (!dbConfigured() || !userId) return null

  const role = defaultRoleForEmail(email)
  const existing = await dbQuery(`SELECT id, email, name, role FROM users WHERE id = $1`, [userId])

  if (existing.rowCount === 0) {
    await dbQuery(
      `INSERT INTO users (id, email, name, role) VALUES ($1, $2, $3, $4)`,
      [userId, email, name, role],
    )
    return { id: userId, email, name, role }
  }

  const row = existing.rows[0] as { id: string; email: string; name: string; role: string }
  let resolvedRole = row.role as HubRole

  // Always sync role from email rules (admin email, @roalla.com employee)
  const expectedRole = defaultRoleForEmail(email || row.email)
  if (expectedRole === 'admin' || (expectedRole === 'employee' && resolvedRole === 'contractor')) {
    if (resolvedRole !== expectedRole) {
      await dbQuery(`UPDATE users SET role = $2, updated_at = NOW() WHERE id = $1`, [userId, expectedRole])
      resolvedRole = expectedRole
    }
  }

  if (email && email !== row.email) {
    await dbQuery(`UPDATE users SET email = $2, updated_at = NOW() WHERE id = $1`, [userId, email])
  }
  if (name && name !== row.name) {
    await dbQuery(`UPDATE users SET name = $2, updated_at = NOW() WHERE id = $1`, [userId, name])
  }

  return {
    id: userId,
    email: email || row.email,
    name: name || row.name,
    role: resolvedRole,
  }
}

export async function getHubUser(userId: string): Promise<HubUser | null> {
  if (!dbConfigured() || !userId) return null
  const res = await dbQuery(`SELECT id, email, name, role FROM users WHERE id = $1`, [userId])
  if (!res.rowCount) return null
  const row = res.rows[0] as { id: string; email: string; name: string; role: string }
  return { id: row.id, email: row.email, name: row.name, role: row.role as HubRole }
}
