export type HubEmailAuthResponse =
  | { kind: 'redirect'; redirect: string }
  | { kind: 'mfa'; mfaToken: string }
  | { kind: 'verify'; message: string }
  | { kind: 'error'; message: string }

export function parseHubEmailAuthPayload(
  _status: number,
  payload: Record<string, unknown>,
): HubEmailAuthResponse {
  if (payload.mfaRequired === true && typeof payload.mfaToken === 'string') {
    return { kind: 'mfa', mfaToken: payload.mfaToken }
  }
  if (payload.verifyRequired === true) {
    return {
      kind: 'verify',
      message: String(
        payload.message || payload.error || 'Check your email to verify your account, then sign in.',
      ),
    }
  }
  if (typeof payload.redirect === 'string' && payload.redirect) {
    return { kind: 'redirect', redirect: payload.redirect }
  }
  return {
    kind: 'error',
    message: String(payload.error || 'Could not complete sign-in.'),
  }
}
