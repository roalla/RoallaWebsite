/**
 * Cloudflare Email Address Obfuscation rewrites mailto links and visible
 * addresses after Next.js renders. React then hydrates against markup it did
 * not produce (errors 418 and 423), and the injected email-decode script is
 * blocked by the nonce + strict-dynamic Content Security Policy.
 *
 * Markers: https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/
 */

export const EMAIL_OFF_OPEN = '<!--email_off-->'
export const EMAIL_OFF_CLOSE = '<!--/email_off-->'

const EMAIL_ADDRESS = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i

const MAIL_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-primary" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>'

export function containsEmailAddress(value: string): boolean {
  return EMAIL_ADDRESS.test(value)
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function wrapEmailOff(html: string): string {
  return `${EMAIL_OFF_OPEN}${html}${EMAIL_OFF_CLOSE}`
}

/** Plain text that may contain an address, safe to place in innerHTML. */
export function emailSafeHtml(text: string): string {
  return wrapEmailOff(escapeHtml(text))
}

/** Footer-style contact link. The whole anchor must sit inside the markers, including the href. */
export function protectedMailtoLink(email: string, className: string): string {
  return protectedMailtoAnchor(
    email,
    className,
    `<span class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-colors">${MAIL_ICON_SVG}</span>${escapeHtml(email)}`,
    { labelIsHtml: true },
  )
}

/** Simple mailto anchor. Label defaults to the address and is escaped. */
export function protectedMailtoAnchor(
  email: string,
  className: string,
  label: string = email,
  options: { labelIsHtml?: boolean } = {},
): string {
  const safeEmail = escapeHtml(email)
  const safeClass = escapeHtml(className)
  const safeLabel = options.labelIsHtml ? label : escapeHtml(label)
  return wrapEmailOff(`<a href="mailto:${safeEmail}" class="${safeClass}">${safeLabel}</a>`)
}
