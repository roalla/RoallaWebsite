// Shared storage for access requests
// In production, replace this with a database (e.g., PostgreSQL, MongoDB, etc.)

interface AccessRequest {
  email: string
  name: string
  company?: string
  reason?: string
  token: string
  createdAt: Date
  status: 'pending' | 'approved' | 'rejected'
}

// In-memory store (resets on server restart)
// TODO: Replace with database in production
export const accessRequests = new Map<string, AccessRequest>()

export type { AccessRequest }
