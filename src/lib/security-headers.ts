/**
 * Document security policy.
 *
 * script-src is a per-request nonce plus 'strict-dynamic'. That lets Next.js
 * mark its own scripts and treat scripts they load as trusted, without
 * 'unsafe-inline' or a script host allowlist.
 * style-src still allows inline styles because the framework emits them.
 */

export const STRICT_TRANSPORT_SECURITY = 'max-age=31536000; includeSubDomains'

export const CROSS_ORIGIN_OPENER_POLICY = 'same-origin'

const SCRIPT_URL_HOSTS = [
  'www.googletagmanager.com',
  'www.google-analytics.com',
  'ssl.google-analytics.com',
  'www.google.com',
  'static.cloudflareinsights.com',
  'cloudflareinsights.com',
]

/** Runs before other scripts and installs the Trusted Types default policy. */
export const trustedTypesBootstrap = `(function(){var tt=window.trustedTypes;if(!tt||!tt.createPolicy)return;try{if(tt.getPolicyNames&&tt.getPolicyNames().indexOf("default")!==-1)return}catch(e){}tt.createPolicy("default",{createHTML:function(input){return String(input)},createScript:function(input){return String(input)},createScriptURL:function(input){var value=String(input);try{var url=new URL(value,window.location.origin);if(url.origin===window.location.origin)return url.href;var host=url.hostname;var allowed=${JSON.stringify(SCRIPT_URL_HOSTS)}.indexOf(host)!==-1||host.endsWith(".google-analytics.com")||host.endsWith(".googletagmanager.com")||host.endsWith(".analytics.google.com");if(allowed&&url.protocol==="https:")return url.href}catch(e){}throw new TypeError("Blocked script URL")}})})();`

type CspOptions = {
  development?: boolean
}

export function createNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function buildContentSecurityPolicy(nonce: string, options: CspOptions = {}): string {
  if (!/^[A-Za-z0-9_-]+$/.test(nonce)) {
    throw new Error('Invalid CSP nonce')
  }

  const scriptSrc = [
    'script-src',
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "'self'",
    options.development ? "'unsafe-eval'" : '',
  ]
    .filter(Boolean)
    .join(' ')

  const connectSrc = [
    'connect-src',
    "'self'",
    options.development ? 'ws:' : '',
    options.development ? 'wss:' : '',
    'https://sso.roalla.com',
    'https://cloudflareinsights.com',
    'https://static.cloudflareinsights.com',
    'https://www.google-analytics.com',
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://www.googletagmanager.com',
    'https://stats.g.doubleclick.net',
  ]
    .filter(Boolean)
    .join(' ')

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.notion.so https://notion.so https://*.notion.site https://v2.notion.so https://v2.notion.site',
    connectSrc,
    "require-trusted-types-for 'script'",
    "trusted-types default nextjs nextjs#bundler 'allow-duplicates'",
    options.development ? '' : 'upgrade-insecure-requests',
  ]
    .filter(Boolean)
    .join('; ')
}
