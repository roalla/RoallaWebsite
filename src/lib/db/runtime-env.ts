import fs from 'fs'

export type RuntimeEnvSource = 'process' | 'proc' | 'none'

export type RuntimeEnvEntry = {
  key: string
  value: string
  source: RuntimeEnvSource
}

let procEnvCache: Record<string, string> | null | undefined

/** Linux container env (Railway) — bypasses Next.js build-time process.env inlining. */
function loadProcEnviron(): Record<string, string> | null {
  if (procEnvCache !== undefined) return procEnvCache
  procEnvCache = null
  if (process.platform === 'win32') return null
  try {
    const raw = fs.readFileSync('/proc/self/environ', 'utf8')
    const map: Record<string, string> = {}
    for (const entry of raw.split('\0')) {
      if (!entry) continue
      const eq = entry.indexOf('=')
      if (eq <= 0) continue
      map[entry.slice(0, eq)] = entry.slice(eq + 1)
    }
    procEnvCache = map
    return map
  } catch {
    return null
  }
}

function readFromProcessEnv(name: string): RuntimeEnvEntry | null {
  const target = name.toLowerCase()
  const env = process.env
  for (const key of Object.keys(env)) {
    if (key.toLowerCase() !== target) continue
    return { key, value: env[key] ?? '', source: 'process' }
  }
  return null
}

function readFromProcEnviron(name: string): RuntimeEnvEntry | null {
  const proc = loadProcEnviron()
  if (!proc) return null
  const target = name.toLowerCase()
  for (const key of Object.keys(proc)) {
    if (key.toLowerCase() !== target) continue
    return { key, value: proc[key] ?? '', source: 'proc' }
  }
  return null
}

/** Read env at request/runtime — prefers non-empty values from process.env or /proc/self/environ. */
export function lookupRuntimeEnv(name: string): RuntimeEnvEntry | null {
  const fromProcess = readFromProcessEnv(name)
  const fromProc = readFromProcEnviron(name)

  if (fromProcess?.value && fromProc?.value) {
    return fromProcess.value.length >= fromProc.value.length ? fromProcess : fromProc
  }
  if (fromProcess?.value) return fromProcess
  if (fromProc?.value) return fromProc
  return fromProcess ?? fromProc
}

export function listRuntimeEnvKeys(): string[] {
  const keys = new Set<string>()
  for (const key of Object.keys(process.env)) keys.add(key)
  const proc = loadProcEnviron()
  if (proc) for (const key of Object.keys(proc)) keys.add(key)
  return Array.from(keys)
}

export function listPostgresRelatedEnvKeys(): { key: string; length: number; source: RuntimeEnvSource }[] {
  const out: { key: string; length: number; source: RuntimeEnvSource }[] = []
  const seen = new Set<string>()
  for (const key of listRuntimeEnvKeys()) {
    const k = key.toLowerCase()
    if (
      k === 'database_url' ||
      k === 'database_private_url' ||
      k === 'database_public_url' ||
      k.startsWith('pg') ||
      k.startsWith('postgres')
    ) {
      if (seen.has(key)) continue
      seen.add(key)
      const hit = lookupRuntimeEnv(key)
      out.push({
        key,
        length: hit?.value.length ?? 0,
        source: hit?.source ?? 'none',
      })
    }
  }
  return out.sort((a, b) => a.key.localeCompare(b.key))
}
