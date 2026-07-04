import { publicAppOriginUrl, roallaAuthClientId, roallaAuthHubUrl } from '@/lib/roalla-auth/config'

export function buildAuthCallbackReturnUrl(returnPath: string): string {
  const trimmed = returnPath.trim() || '/en/hub'
  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const callback = `/auth/callback?return=${encodeURIComponent(normalized)}`
  return new URL(callback, publicAppOriginUrl()).toString()
}

type HubProxyResult = { status: number; payload: Record<string, unknown> }

export async function proxyHubAuthApi(
  hubPath: string,
  body: Record<string, unknown>,
): Promise<HubProxyResult> {
  const hubUrl = roallaAuthHubUrl()
  const clientId = roallaAuthClientId()
  if (!hubUrl || !clientId) {
    return { status: 503, payload: { error: 'Auth hub is not configured.' } }
  }

  try {
    const res = await fetch(`${hubUrl}${hubPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, ...body }),
    })
    const payload = (await res.json().catch(() => ({}))) as Record<string, unknown>
    return { status: res.status, payload }
  } catch {
    return { status: 502, payload: { error: 'Could not reach the auth hub.' } }
  }
}

export type EmailAuthHubBody = {
  email: string
  password: string
  name?: string
  return_path?: string
  code_challenge: string
  code_challenge_method?: string
}

export async function hubEmailLogin(body: EmailAuthHubBody): Promise<HubProxyResult> {
  return proxyHubAuthApi('/api/login', {
    email: body.email,
    password: body.password,
    return_url: buildAuthCallbackReturnUrl(body.return_path ?? '/en/hub'),
    code_challenge: body.code_challenge,
    code_challenge_method: body.code_challenge_method ?? 'S256',
  })
}

export async function hubEmailRegister(body: EmailAuthHubBody): Promise<HubProxyResult> {
  return proxyHubAuthApi('/api/register', {
    email: body.email,
    password: body.password,
    name: body.name ?? '',
    return_url: buildAuthCallbackReturnUrl(body.return_path ?? '/en/hub'),
    code_challenge: body.code_challenge,
    code_challenge_method: body.code_challenge_method ?? 'S256',
  })
}

export async function hubEmailMfaChallenge(mfaToken: string, code: string): Promise<HubProxyResult> {
  return proxyHubAuthApi('/api/mfa/challenge', { mfa_token: mfaToken, code })
}

export async function hubResendVerification(email: string): Promise<HubProxyResult> {
  return proxyHubAuthApi('/api/resend-verification', { email })
}
