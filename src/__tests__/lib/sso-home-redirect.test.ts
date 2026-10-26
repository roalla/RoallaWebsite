import { SSO_HOME_URL } from '@/lib/site'

/** Mirrors middleware isSsoHomeRedirectPath */
function isSsoHomeRedirectPath(pathname: string): boolean {
  return /^\/((en|fr)\/)?hub(\/(tools|login))?\/?$/.test(pathname)
}

describe('SSO Home hub entry redirects', () => {
  it('exposes the SSO Home URL', () => {
    expect(SSO_HOME_URL).toBe('https://sso.roalla.com/home.html')
  })

  it.each([
    '/hub',
    '/hub/',
    '/hub/tools',
    '/hub/login',
    '/en/hub',
    '/en/hub/tools',
    '/en/hub/login',
    '/fr/hub',
    '/fr/hub/tools',
    '/fr/hub/login',
  ])('redirects entry path %s', (pathname) => {
    expect(isSsoHomeRedirectPath(pathname)).toBe(true)
  })

  it.each([
    '/en/hub/customers',
    '/en/hub/playbooks',
    '/en/hub/lessons',
    '/fr/hub/partners',
    '/en/hub/insights',
    '/en/hub/recommendations',
    '/en/about',
  ])('keeps CMS path %s', (pathname) => {
    expect(isSsoHomeRedirectPath(pathname)).toBe(false)
  })
})
