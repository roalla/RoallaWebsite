export function pkceStorageKey(clientId: string, suffix: string): string {
  return `pa-${clientId || 'default'}-${suffix}`
}

export function storePkceVerifier(clientId: string, verifier: string): void {
  try {
    sessionStorage.setItem(pkceStorageKey(clientId, 'code-verifier'), verifier)
  } catch {
    /* ignore */
  }
}

function base64Url(bytes: Uint8Array): string {
  let str = ''
  bytes.forEach((b) => {
    str += String.fromCharCode(b)
  })
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function randomPkceVerifier(): string {
  return base64Url(crypto.getRandomValues(new Uint8Array(32)))
}

export async function pkceChallengeFromVerifier(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return base64Url(new Uint8Array(hash))
}
