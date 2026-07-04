export type AppAuthClient = {
  init: () => Promise<boolean>
  isAuthConfigured: () => boolean
  isSignedIn: () => boolean
  startAuthorize: (returnTo?: string) => Promise<void>
  signOut: () => Promise<void>
  mountAppsSwitcher: (el: HTMLElement, options?: { label?: string }) => Promise<unknown[]>
}

declare global {
  interface Window {
    AppAuth?: AppAuthClient
  }
}

export {}
