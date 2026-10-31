import type { DomainCheckStatus, DomainHealthSnapshot } from '@/lib/domain-health/evaluate'

export type EmailReachSituation =
  | 'junk-folder'
  | 'never-arrives'
  | 'looks-like-spam'
  | 'unsure'

export type EmailReachAudience = 'customers' | 'prospects' | 'both'

export type EmailReachUrgency = 'exploring' | 'this-quarter' | 'urgent'

export type EmailReachMailCheckId = 'mx' | 'spf' | 'dkim' | 'dmarc'

export type EmailReachBriefInput = {
  situation: EmailReachSituation
  usesOwnDomain: boolean
  audience: EmailReachAudience
  urgency: EmailReachUrgency
  /** Live public-record mail checks for the sending domain, when available. */
  mailHealth?: DomainHealthSnapshot | null
}

export type EmailReachPath = 'setup-basics' | 'trust-and-lists' | 'full-reach-review'

const FREE_MAIL_HOSTS = new Set([
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'yahoo.com',
  'ymail.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'gmx.com',
  'gmx.net',
  'mail.com',
])

export type EmailReachTarget =
  | { ok: true; domain: string; kind: 'domain' | 'email'; isFreeMail: boolean }
  | { ok: false; error: 'empty' | 'invalid' | 'free-mail' }

/** Parse a website address or business email into a mail domain for public checks. */
export function parseEmailReachTarget(raw: string): EmailReachTarget {
  const trimmed = raw.trim().toLowerCase()
  if (!trimmed) return { ok: false, error: 'empty' }

  let domain = ''
  let kind: 'domain' | 'email' = 'domain'

  if (trimmed.includes('@')) {
    const parts = trimmed.split('@')
    if (parts.length !== 2 || !parts[0] || !parts[1]) return { ok: false, error: 'invalid' }
    domain = parts[1].replace(/^\[|\]$/g, '').replace(/\.$/, '')
    kind = 'email'
  } else {
    domain = trimmed
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .split('?')[0]
      .split('#')[0]
      .replace(/\.$/, '')
  }

  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(domain)) {
    return { ok: false, error: 'invalid' }
  }

  if (FREE_MAIL_HOSTS.has(domain)) {
    return { ok: false, error: 'free-mail' }
  }

  return { ok: true, domain, kind, isFreeMail: false }
}

function mailChecks(snapshot: DomainHealthSnapshot | null | undefined) {
  const ids: EmailReachMailCheckId[] = ['mx', 'spf', 'dkim', 'dmarc']
  return ids.map((id) => {
    const check = snapshot?.checks.find((item) => item.id === id)
    return { id, status: (check?.status ?? 'gap') as DomainCheckStatus, evidence: check?.evidence ?? [] }
  })
}

export function mailAuthHasGaps(snapshot: DomainHealthSnapshot | null | undefined): boolean {
  return mailChecks(snapshot).some((check) => check.status === 'gap')
}

export function recommendEmailReachPath(input: EmailReachBriefInput): EmailReachPath {
  if (!input.usesOwnDomain) return 'setup-basics'
  if (mailAuthHasGaps(input.mailHealth)) return 'setup-basics'
  if (input.situation === 'looks-like-spam' || input.situation === 'junk-folder') {
    return 'trust-and-lists'
  }
  return 'full-reach-review'
}

function livePriorities(snapshot: DomainHealthSnapshot | null | undefined): string[] {
  if (!snapshot) return []
  const byId = Object.fromEntries(mailChecks(snapshot).map((check) => [check.id, check.status])) as Record<
    EmailReachMailCheckId,
    DomainCheckStatus
  >
  const lines: string[] = []
  if (byId.mx === 'gap') {
    lines.push('Give this domain a mail destination so replies can arrive and sending looks less suspicious.')
  }
  if (byId.spf === 'gap' || byId.spf === 'review') {
    lines.push('Publish a clear sender list (SPF) that names who may send for this domain and rejects everyone else.')
  }
  if (byId.dkim === 'gap') {
    lines.push('Turn on signed mail (DKIM) for each service that sends for this domain.')
  }
  if (byId.dmarc === 'gap' || byId.dmarc === 'review') {
    lines.push('Add or strengthen the forged-mail policy (DMARC) so providers know what to do with failing messages.')
  }
  return lines.slice(0, 3)
}

export function buildEmailReachBrief(input: EmailReachBriefInput) {
  const path = recommendEmailReachPath(input)
  const live = livePriorities(input.mailHealth)
  const priorities: Record<EmailReachPath, string[]> = {
    'setup-basics': [
      'Confirm you send from your own business domain—not a free personal mailbox.',
      'Make sure the “from” name matches how customers know your business.',
      'Check whether messages land in inbox, promotions, or junk for a few real recipients.',
    ],
    'trust-and-lists': [
      'Confirm people asked to hear from you, and remove addresses that bounce.',
      'Keep the same sending name and domain so customers recognize you.',
      'Review recent campaigns for links or wording that trigger junk filters.',
    ],
    'full-reach-review': [
      'Baseline where messages land today for real customer addresses.',
      'Separate sending setup issues from list quality and campaign habits.',
      'Sequence fixes so inbox reach and trust improve before the next send.',
    ],
  }
  const plans: Record<EmailReachPath, [string, string, string]> = {
    'setup-basics': [
      'Confirm domain and sending identity.',
      'Test delivery with a small trusted list.',
      'Decide whether a fuller reach review is needed before the next campaign.',
    ],
    'trust-and-lists': [
      'Clean bounced and inactive addresses.',
      'Align sender name, domain, and message content with customer expectations.',
      'Re-test delivery and watch replies, not only open rates.',
    ],
    'full-reach-review': [
      'Capture current delivery evidence and customer complaints.',
      'Prioritize the smallest set of fixes that restore inbox reach.',
      'Set a simple check before each campaign so problems do not return quietly.',
    ],
  }
  const headlines: Record<EmailReachPath, string> = {
    'setup-basics': 'Start with the basics of how you send',
    'trust-and-lists': 'Focus on trust and who you email',
    'full-reach-review': 'A focused reach review will clarify what to fix first',
  }
  const summaries: Record<EmailReachPath, string> = {
    'setup-basics': live.length
      ? 'Public mail records for this domain show setup gaps. Fix who may send and how messages are authenticated before the next campaign push.'
      : 'Your answers suggest the first step is confirming you send as your business, from your own domain, in a way customers recognize.',
    'trust-and-lists':
      'Public mail records look usable. Your answers point to trust and list quality—messages may look like junk even when they technically send.',
    'full-reach-review':
      'Public mail records look usable, and your answers suggest several factors may still be in play. A short review can separate setup, list quality, and campaign habits before the next send.',
  }

  const mergedPriorities =
    path === 'setup-basics' && live.length
      ? [...live, ...priorities[path]].filter((line, index, all) => all.indexOf(line) === index).slice(0, 4)
      : priorities[path]

  return {
    path,
    headline: headlines[path],
    summary: summaries[path],
    priorities: mergedPriorities,
    plan: plans[path],
    mailChecks: mailChecks(input.mailHealth),
  }
}
