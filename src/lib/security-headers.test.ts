import { buildContentSecurityPolicy } from '@/lib/security-headers'

const NONCE = 'abc123XYZ_-'

function scriptSrc(policy: string): string {
  const directive = policy.split('; ').find((part) => part.startsWith('script-src '))
  if (!directive) throw new Error('missing script-src')
  return directive
}

describe('buildContentSecurityPolicy', () => {
  it('allows scripts with a nonce and strict-dynamic', () => {
    const policy = buildContentSecurityPolicy(NONCE)
    const scripts = scriptSrc(policy)

    expect(scripts).toContain(`'nonce-${NONCE}'`)
    expect(scripts).toContain("'strict-dynamic'")
    expect(scripts).not.toContain("'unsafe-inline'")
    expect(scripts).not.toContain('cloudflareinsights.com')
    expect(policy).toContain("require-trusted-types-for 'script'")
    expect(policy).toContain("trusted-types default nextjs nextjs#bundler 'allow-duplicates'")
    expect(policy).toContain('upgrade-insecure-requests')
    expect(policy).toContain("style-src 'self' 'unsafe-inline'")
  })

  it('keeps unsafe-eval available only for the development server', () => {
    expect(scriptSrc(buildContentSecurityPolicy(NONCE))).not.toContain("'unsafe-eval'")
    expect(scriptSrc(buildContentSecurityPolicy(NONCE, { development: true }))).toContain("'unsafe-eval'")
    expect(buildContentSecurityPolicy(NONCE, { development: true })).not.toContain(
      'upgrade-insecure-requests',
    )
  })

  it('rejects a nonce that could break the header', () => {
    expect(() => buildContentSecurityPolicy("bad nonce")).toThrow('Invalid CSP nonce')
  })
})
