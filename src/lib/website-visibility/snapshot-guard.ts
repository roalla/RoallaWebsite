import type {
  PageSpeedStrategy,
  WebsiteVisibilitySnapshot,
} from "@/lib/website-visibility/pagespeed";

const CACHE_TTL_MS = 15 * 60 * 1000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_CLIENT = 8;
const MAX_UNCACHED_REQUESTS_PER_HOST = 4;

type CacheEntry = { expiresAt: number; value: WebsiteVisibilitySnapshot };
type RateEntry = { resetAt: number; count: number };

const cache = new Map<string, CacheEntry>();
const clientRates = new Map<string, RateEntry>();
const hostRates = new Map<string, RateEntry>();

function rateCheck(
  store: Map<string, RateEntry>,
  key: string,
  limit: number,
  now = Date.now(),
) {
  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }
  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function checkClientRate(clientId: string) {
  return rateCheck(clientRates, clientId, MAX_REQUESTS_PER_CLIENT);
}

export function checkHostRate(hostname: string) {
  return rateCheck(hostRates, hostname, MAX_UNCACHED_REQUESTS_PER_HOST);
}

export function getClientId(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function cacheKey(target: URL, strategy: PageSpeedStrategy) {
  return `${strategy}:${target.toString()}`;
}

export function getCachedSnapshot(target: URL, strategy: PageSpeedStrategy) {
  const key = cacheKey(target, strategy);
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
}

export function setCachedSnapshot(
  target: URL,
  strategy: PageSpeedStrategy,
  value: WebsiteVisibilitySnapshot,
) {
  cache.set(cacheKey(target, strategy), {
    expiresAt: Date.now() + CACHE_TTL_MS,
    value,
  });
}
