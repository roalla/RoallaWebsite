/**
 * In-memory rate limiter. For multi-instance deployments, use Redis (e.g. @upstash/ratelimit).
 * Entries are pruned when checked to avoid unbounded growth.
 */

const stores = new Map<string, { count: number; resetAt: number }>()
const PRUNE_INTERVAL_MS = 60_000
let lastPrune = Date.now()

function prune() {
  const now = Date.now()
  if (now - lastPrune < PRUNE_INTERVAL_MS) return
  lastPrune = now
  Array.from(stores.entries()).forEach(([key, v]) => {
    if (v.resetAt < now) stores.delete(key)
  })
}

export function rateLimit(options: {
  key: string
  limit: number
  windowMs: number
}): { success: boolean; remaining: number; resetAt: number } {
  prune()
  const now = Date.now()
  const entry = stores.get(options.key)
  const resetAt = entry ? entry.resetAt : now + options.windowMs
  if (!entry) {
    stores.set(options.key, { count: 1, resetAt })
    return { success: true, remaining: options.limit - 1, resetAt }
  }
  if (entry.resetAt < now) {
    entry.count = 1
    entry.resetAt = now + options.windowMs
    return { success: true, remaining: options.limit - 1, resetAt: entry.resetAt }
  }
  if (entry.count >= options.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }
  entry.count += 1
  return { success: true, remaining: options.limit - entry.count, resetAt: entry.resetAt }
}

export function getRateLimitKey(request: Request, kind: 'ip' | 'email', email?: string): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  if (kind === 'email' && email) return `email:${email}`
  return `ip:${ip}`
}
