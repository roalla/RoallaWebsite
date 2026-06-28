export type ConsultationIntent = 'consulting' | 'website' | 'platform' | 'unsure'

export type ConsultationRequestPayload = {
  intent: ConsultationIntent
  goal: string
  timeline: string
  consultingFocus?: string
  websiteGoal?: string
  hasExistingSite?: string
  platformType?: string
  /** Portfolio item or vertical that inspired the inquiry */
  portfolioReference?: string
  name: string
  email: string
  company?: string
  phone?: string
  locale?: string
  /** Honeypot — must be empty */
  website?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const websiteGoalValues = [
  'new',
  'redesign',
  'conversion',
  'custom-platform',
  'automation',
  'integration',
] as const

export type WebsiteGoal = (typeof websiteGoalValues)[number]

const websiteGoalsRequiringExistingSite = ['new', 'redesign', 'conversion'] as const

export function parseWebsiteGoal(value: unknown): WebsiteGoal | null {
  if (typeof value === 'string' && websiteGoalValues.includes(value as WebsiteGoal)) {
    return value as WebsiteGoal
  }
  return null
}

export function websiteGoalRequiresExistingSite(websiteGoal: string | undefined): boolean {
  return websiteGoalsRequiringExistingSite.includes(
    websiteGoal as (typeof websiteGoalsRequiringExistingSite)[number],
  )
}

export function parseConsultationIntent(value: unknown): ConsultationIntent | null {
  if (value === 'consulting' || value === 'website' || value === 'platform' || value === 'unsure') {
    return value
  }
  return null
}

export function intentFromServiceParam(service: string | null): ConsultationIntent | null {
  if (service === 'websites-brand' || service === 'custom-platforms') return 'website'
  return null
}

export function websiteGoalFromPortfolioCategory(
  category: 'website' | 'platform',
): WebsiteGoal | null {
  if (category === 'platform') return 'custom-platform'
  return null
}

const consultingFocusValues = ['strategy', 'operations', 'team', 'data', 'innovation', 'other'] as const
export type ConsultingFocus = (typeof consultingFocusValues)[number]

export function parseConsultingFocus(value: unknown): ConsultingFocus | null {
  if (typeof value === 'string' && consultingFocusValues.includes(value as ConsultingFocus)) {
    return value as ConsultingFocus
  }
  return null
}

export function validateConsultationRequest(body: Partial<ConsultationRequestPayload>): string | null {
  if (body.website) return 'Invalid submission'

  const intent = parseConsultationIntent(body.intent)
  if (!intent) return 'Please select what you need help with'

  if (!body.goal?.trim() || body.goal.trim().length < 5) {
    return 'Please describe your goal or challenge (at least 5 characters)'
  }

  if (!body.timeline?.trim()) return 'Please select a timeline'

  if (intent === 'consulting' && !body.consultingFocus?.trim()) {
    return 'Please select a consulting focus area'
  }
  if (intent === 'website') {
    if (!body.websiteGoal?.trim()) return 'Please select what you need'
    if (websiteGoalRequiresExistingSite(body.websiteGoal) && !body.hasExistingSite?.trim()) {
      return 'Please indicate if you have an existing website'
    }
  }
  if (intent === 'platform') {
    if (!body.websiteGoal?.trim()) return 'Please select what you need'
  }

  if (!body.name?.trim()) return 'Name is required'
  if (!body.email?.trim() || !EMAIL_REGEX.test(body.email.trim())) {
    return 'A valid email address is required'
  }

  return null
}

export function buildConsultationEmailSubject(name: string, intent: ConsultationIntent): string {
  const labels: Record<ConsultationIntent, string> = {
    consulting: 'Business Enablement',
    website: 'Website Project',
    platform: 'Custom Platform',
    unsure: 'General Inquiry',
  }
  return `Service Inquiry — ${labels[intent]} — ${name}`
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildConsultationSalesEmailHtml(
  data: ConsultationRequestPayload,
  labels: Record<string, string>,
  submittedAt: string,
  origin: string,
): string {
  const rows: [string, string][] = [
    [labels.intent, labels[`intent_${data.intent}`] ?? data.intent],
    [labels.goal, data.goal.trim()],
    [labels.timeline, labels[`timeline_${data.timeline}`] ?? data.timeline],
  ]

  if (data.intent === 'consulting' && data.consultingFocus) {
    rows.push([labels.consultingFocus, labels[`focus_${data.consultingFocus}`] ?? data.consultingFocus])
  }
  if (data.intent === 'website') {
    if (data.websiteGoal) rows.push([labels.websiteGoal, labels[`websiteGoal_${data.websiteGoal}`] ?? data.websiteGoal])
    if (data.hasExistingSite) rows.push([labels.hasExistingSite, labels[`yesNo_${data.hasExistingSite}`] ?? data.hasExistingSite])
  }
  if (data.intent === 'platform' && data.websiteGoal) {
    rows.push([labels.websiteGoal, labels[`websiteGoal_${data.websiteGoal}`] ?? data.websiteGoal])
  }
  if (data.portfolioReference?.trim()) {
    rows.push([labels.portfolioReference, data.portfolioReference.trim()])
  }

  rows.push(
    [labels.name, data.name.trim()],
    [labels.email, data.email.trim()],
    [labels.company, data.company?.trim() || labels.notProvided],
    [labels.phone, data.phone?.trim() || labels.notProvided],
    [labels.submittedAt, submittedAt],
    [labels.source, origin],
  )

  if (data.locale) rows.push([labels.locale, data.locale])

  const detailRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;width:38%;vertical-align:top;"><strong>${escapeHtml(label)}</strong></td><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a;">
      <div style="background:linear-gradient(135deg,#00b4c5,#0099a8);padding:28px 24px;border-radius:12px 12px 0 0;color:#fff;">
        <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.9;">ROALLA</p>
        <h1 style="margin:0;font-size:24px;line-height:1.3;">${escapeHtml(labels.emailHeading)}</h1>
      </div>
      <div style="padding:24px;background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
        <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6;">${escapeHtml(labels.emailIntro)}</p>
        <table style="width:100%;border-collapse:collapse;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">${detailRows}</table>
      </div>
    </div>
  `.trim()
}

export function buildConsultationSalesEmailText(
  data: ConsultationRequestPayload,
  labels: Record<string, string>,
  submittedAt: string,
  origin: string,
): string {
  const lines = [
    labels.emailHeading,
    '',
    `${labels.intent}: ${labels[`intent_${data.intent}`] ?? data.intent}`,
    `${labels.goal}: ${data.goal.trim()}`,
    `${labels.timeline}: ${labels[`timeline_${data.timeline}`] ?? data.timeline}`,
  ]

  if (data.intent === 'consulting' && data.consultingFocus) {
    lines.push(`${labels.consultingFocus}: ${labels[`focus_${data.consultingFocus}`] ?? data.consultingFocus}`)
  }
  if (data.intent === 'website') {
    if (data.websiteGoal) lines.push(`${labels.websiteGoal}: ${labels[`websiteGoal_${data.websiteGoal}`] ?? data.websiteGoal}`)
    if (data.hasExistingSite) lines.push(`${labels.hasExistingSite}: ${labels[`yesNo_${data.hasExistingSite}`] ?? data.hasExistingSite}`)
  }
  if (data.intent === 'platform' && data.websiteGoal) {
    lines.push(`${labels.websiteGoal}: ${labels[`websiteGoal_${data.websiteGoal}`] ?? data.websiteGoal}`)
  }
  if (data.portfolioReference?.trim()) {
    lines.push(`${labels.portfolioReference}: ${data.portfolioReference.trim()}`)
  }

  lines.push(
    '',
    `${labels.name}: ${data.name.trim()}`,
    `${labels.email}: ${data.email.trim()}`,
    `${labels.company}: ${data.company?.trim() || labels.notProvided}`,
    `${labels.phone}: ${data.phone?.trim() || labels.notProvided}`,
    `${labels.submittedAt}: ${submittedAt}`,
    `${labels.source}: ${origin}`,
  )

  if (data.locale) lines.push(`${labels.locale}: ${data.locale}`)

  return lines.join('\n')
}
