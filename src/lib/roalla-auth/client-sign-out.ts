/** Clear Platform Auth tokens in session/local storage (all registered clients). */
function clearStoredAuthTokens() {
  try {
    for (const store of [sessionStorage, localStorage]) {
      const keys: string[] = []
      for (let i = 0; i < store.length; i++) {
        const key = store.key(i)
        if (key?.startsWith('pa-')) keys.push(key)
      }
      keys.forEach((key) => store.removeItem(key))
    }
  } catch {
    /* storage may be unavailable */
  }
}

/** Sign out via AppAuth when loaded, otherwise BFF logout + local token cleanup. */
export async function clientSignOut(): Promise<void> {
  try {
    if (typeof window !== 'undefined' && window.AppAuth) {
      await window.AppAuth.signOut()
      return
    }
  } catch {
    /* fall through to manual cleanup */
  }

  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
  } catch {
    /* still clear local state */
  }

  clearStoredAuthTokens()
}
