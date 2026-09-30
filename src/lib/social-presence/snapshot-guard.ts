import type { SocialPresenceSnapshot } from "@/lib/social-presence/analyzer";

const CACHE_TTL_MS = 30 * 60 * 1000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_CLIENT = 8;
const MAX_UNCACHED_REQUESTS_PER_HOST = 4;

type RateEntry = { count: number; resetAt: number };
type CacheEntry = { value: SocialPresenceSnapshot; expiresAt: number };

const clientRates = new Map<string, RateEntry>();
const hostRates = new Map<string, RateEntry>();
const cache = new Map<string, CacheEntry>();

function check(store: Map<string, RateEntry>, key: string, limit: number) {
  const now = Date.now();
  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (current.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
  }
  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function clientId(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim() || "unknown";
}

export function checkSocialClientRate(id: string) {
  return check(clientRates, id, MAX_REQUESTS_PER_CLIENT);
}

export function checkSocialHostRate(hostname: string) {
  return check(hostRates, hostname, MAX_UNCACHED_REQUESTS_PER_HOST);
}

export function getCachedSocialSnapshot(target: URL) {
  const entry = cache.get(target.toString());
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(target.toString());
    return undefined;
  }
  return entry.value;
}

export function setCachedSocialSnapshot(target: URL, value: SocialPresenceSnapshot) {
  cache.set(target.toString(), { value, expiresAt: Date.now() + CACHE_TTL_MS });
}
