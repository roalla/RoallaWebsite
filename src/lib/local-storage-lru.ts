/** Cap localStorage key families so tools cannot grow unbounded. */

export function setLruJsonItem(
  storageKey: string,
  value: unknown,
  options: { maxEntries?: number } = {},
) {
  if (typeof window === 'undefined') return
  const maxEntries = options.maxEntries ?? 10
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value))
    prunePrefixedKeys(storageKey.includes(':') ? storageKey.slice(0, storageKey.lastIndexOf(':') + 1) : null, maxEntries)
  } catch {
    /* quota — try prune then retry once */
    try {
      if (storageKey.includes(':')) {
        prunePrefixedKeys(storageKey.slice(0, storageKey.lastIndexOf(':') + 1), Math.max(3, Math.floor(maxEntries / 2)))
        window.localStorage.setItem(storageKey, JSON.stringify(value))
      }
    } catch {
      /* ignore */
    }
  }
}

export function prunePrefixedKeys(prefix: string | null, maxEntries: number) {
  if (typeof window === 'undefined' || !prefix) return
  const matches: { key: string; ts: number }[] = []
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (!key || !key.startsWith(prefix)) continue
    let ts = 0
    try {
      const raw = window.localStorage.getItem(key)
      const parsed = raw ? JSON.parse(raw) : null
      const stamp = parsed?.savedAt || parsed?.updatedAt || parsed?.timestamp
      ts = stamp ? Date.parse(stamp) || 0 : 0
    } catch {
      ts = 0
    }
    matches.push({ key, ts })
  }
  if (matches.length <= maxEntries) return
  matches
    .sort((a, b) => a.ts - b.ts)
    .slice(0, matches.length - maxEntries)
    .forEach(({ key }) => window.localStorage.removeItem(key))
}

export function capArrayStorage(storageKey: string, items: unknown[], maxEntries: number) {
  if (typeof window === 'undefined') return items
  const capped = items.slice(-maxEntries)
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(capped))
  } catch {
    /* ignore */
  }
  return capped
}
