export type ConsultationIntent =
  | 'consulting'
  | 'website'
  | 'platform'
  | 'automation'
  | 'ai-support'
  | 'digital-events'
  | 'workshop'
  | 'unsure'

export type ConsultationRequestPayload = {
  intent: ConsultationIntent
  goal: string
  timeline: string
  consultingFocus?: string
  websiteGoal?: string
  hasExistingSite?: string
  platformType?: string
  automationGoal?: string
  aiGoal?: string
  eventGoal?: string
  workshopTopic?: string
  currentSiteUrl?: string
  industry?: string
  primaryOutcome?: string
  systemsToConnect?: string
  userScale?: string
  budgetBand?: string
  /** Portfolio item or vertical that inspired the inquiry */
  portfolioReference?: string
  sourcePage?: string
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
  'landing-booking',
  'maintain',
  'bilingual',
  'ecommerce',
] as const
export type WebsiteGoal = (typeof websiteGoalValues)[number]

export const platformTypeValues = [
  'internal',
  'customer',
  'client-portal',
  'marketplace',
  'iot-dashboard',
  'ecommerce',
  'other',
] as const
export type PlatformType = (typeof platformTypeValues)[number]

export const automationGoalValues = ['workflow', 'integration', 'both'] as const
export type AutomationGoal = (typeof automationGoalValues)[number]

export const aiGoalValues = ['scoring', 'content-workflow', 'custom-model', 'exploring'] as const
export type AiGoal = (typeof aiGoalValues)[number]

export const eventGoalValues = ['booth', 'microsite', 'event-app', 'activation'] as const
export type EventGoal = (typeof eventGoalValues)[number]

export const workshopTopicValues = ['branding', 'sales', 'productivity', 'ideation', 'other'] as const
export type WorkshopTopic = (typeof workshopTopicValues)[number]

export const industryValues = [
  'fleet-logistics',
  'sports-recreation',
  'events-trade-shows',
  'education-training',
  'professional-services',
  'business-platforms',
  'other',
] as const
export type Industry = (typeof industryValues)[number]

export const primaryOutcomeValues = ['leads', 'bookings', 'self-serve', 'operations', 'other'] as const
export type PrimaryOutcome = (typeof primaryOutcomeValues)[number]

export const userScaleValues = ['under-50', '50-500', '500-plus', 'not-sure'] as const
export type UserScale = (typeof userScaleValues)[number]

export const budgetBandValues = ['under-15k', '15-50k', '50k-plus', 'not-sure'] as const
export type BudgetBand = (typeof budgetBandValues)[number]

const websiteGoalsRequiringExistingSite = [
  'new',
  'redesign',
  'conversion',
  'landing-booking',
  'maintain',
  'bilingual',
  'ecommerce',
] as const

const DIGITAL_INTENTS: ConsultationIntent[] = [
  'website',
  'platform',
  'automation',
  'ai-support',
  'digital-events',
]

export function isDigitalIntent(intent: ConsultationIntent | '' | null | undefined): boolean {
  return !!intent && DIGITAL_INTENTS.includes(intent)
}

export function parseWebsiteGoal(value: unknown): WebsiteGoal | null {
  if (typeof value === 'string' && websiteGoalValues.includes(value as WebsiteGoal)) {
    return value as WebsiteGoal
  }
  return null
}

export function parsePlatformType(value: unknown): PlatformType | null {
  if (typeof value === 'string' && platformTypeValues.includes(value as PlatformType)) {
    return value as PlatformType
  }
  return null
}

export function parseAutomationGoal(value: unknown): AutomationGoal | null {
  if (typeof value === 'string' && automationGoalValues.includes(value as AutomationGoal)) {
    return value as AutomationGoal
  }
  return null
}

export function parseAiGoal(value: unknown): AiGoal | null {
  if (typeof value === 'string' && aiGoalValues.includes(value as AiGoal)) {
    return value as AiGoal
  }
  return null
}

export function parseEventGoal(value: unknown): EventGoal | null {
  if (typeof value === 'string' && eventGoalValues.includes(value as EventGoal)) {
    return value as EventGoal
  }
  return null
}

export function parseWorkshopTopic(value: unknown): WorkshopTopic | null {
  if (typeof value === 'string' && workshopTopicValues.includes(value as WorkshopTopic)) {
    return value as WorkshopTopic
  }
  return null
}

export function websiteGoalRequiresExistingSite(websiteGoal: string | undefined): boolean {
  return websiteGoalsRequiringExistingSite.includes(
    websiteGoal as (typeof websiteGoalsRequiringExistingSite)[number],
  )
}

export function parseConsultationIntent(value: unknown): ConsultationIntent | null {
  const intents: ConsultationIntent[] = [
    'consulting',
    'website',
    'platform',
    'automation',
    'ai-support',
    'digital-events',
    'workshop',
    'unsure',
  ]
  if (typeof value === 'string' && intents.includes(value as ConsultationIntent)) {
    return value as ConsultationIntent
  }
  return null
}

export function intentFromServiceParam(service: string | null): ConsultationIntent | null {
  if (service === 'websites-brand') return 'website'
  if (service === 'custom-platforms') return 'platform'
  if (service === 'digital-events') return 'digital-events'
  if (service === 'workshops') return 'workshop'
  return null
}

/** Maps legacy `need` query params to intent (and optional sub-selection). */
export function intentFromNeedParam(need: string | null): ConsultationIntent | null {
  if (!need) return null
  if (need === 'custom-platform') return 'platform'
  if (need === 'automation' || need === 'integration') return 'automation'
  if (need === 'ai-support') return 'ai-support'
  if (need === 'workshop') return 'workshop'
  if (parseWorkshopTopic(need)) return 'workshop'
  if (parseWebsiteGoal(need)) return 'website'
  if (parsePlatformType(need)) return 'platform'
  if (parseEventGoal(need)) return 'digital-events'
  return null
}

export function automationGoalFromNeedParam(need: string | null): AutomationGoal | null {
  if (need === 'automation') return 'workflow'
  if (need === 'integration') return 'integration'
  if (need === 'both') return 'both'
  return parseAutomationGoal(need)
}

const consultingFocusValues = ['strategy', 'operations', 'team', 'data', 'innovation', 'other'] as const
export type ConsultingFocus = (typeof consultingFocusValues)[number]

export function parseConsultingFocus(value: unknown): ConsultingFocus | null {
  if (typeof value === 'string' && consultingFocusValues.includes(value as ConsultingFocus)) {
    return value as ConsultingFocus
  }
  return null
}

export function hasIntentSubSelection(
  intent: ConsultationIntent,
  fields: {
    consultingFocus?: string
    websiteGoal?: string
    platformType?: string
    automationGoal?: string
    aiGoal?: string
    eventGoal?: string
    workshopTopic?: string
  },
): boolean {
  switch (intent) {
    case 'consulting':
      return !!fields.consultingFocus?.trim()
    case 'website':
      return !!fields.websiteGoal?.trim()
    case 'platform':
      return !!fields.platformType?.trim()
    case 'automation':
      return !!fields.automationGoal?.trim()
    case 'ai-support':
      return !!fields.aiGoal?.trim()
    case 'digital-events':
      return !!fields.eventGoal?.trim()
    case 'workshop':
      return !!fields.workshopTopic?.trim()
    default:
      return true
  }
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
    if (body.hasExistingSite === 'yes' && body.currentSiteUrl?.trim()) {
      try {
        const url = new URL(
          body.currentSiteUrl.startsWith('http') ? body.currentSiteUrl : `https://${body.currentSiteUrl}`,
        )
        if (!url.hostname) return 'Please enter a valid website URL'
      } catch {
        return 'Please enter a valid website URL'
      }
    }
  }
  if (intent === 'platform' && !body.platformType?.trim()) {
    return 'Please select a platform type'
  }
  if (intent === 'automation' && !body.automationGoal?.trim()) {
    return 'Please select an automation focus'
  }
  if (intent === 'ai-support' && !body.aiGoal?.trim()) {
    return 'Please select an AI focus area'
  }
  if (intent === 'digital-events' && !body.eventGoal?.trim()) {
    return 'Please select an event deliverable'
  }
  if (intent === 'workshop' && !body.workshopTopic?.trim()) {
    return 'Please select a workshop topic'
  }

  if (!body.name?.trim()) return 'Name is required'
  if (!body.email?.trim() || !EMAIL_REGEX.test(body.email.trim())) {
    return 'A valid email address is required'
  }

  return null
}

export function buildConsultationEmailSubject(name: string, intent: ConsultationIntent): string {
  const labels: Record<ConsultationIntent, string> = {
    consulting: 'Programs / advisory',
    website: 'Website Project',
    platform: 'Custom Platform',
    automation: 'Integrations & Automation',
    'ai-support': 'AI Support',
    'digital-events': 'Digital Events',
    workshop: 'Workshops & Skill Building',
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

function appendIntentSpecificRows(
  data: ConsultationRequestPayload,
  rows: [string, string][],
  labels: Record<string, string>,
): void {
  if (data.intent === 'consulting' && data.consultingFocus) {
    rows.push([labels.consultingFocus, labels[`focus_${data.consultingFocus}`] ?? data.consultingFocus])
  }
  if (data.intent === 'website') {
    if (data.websiteGoal) {
      rows.push([labels.websiteGoal, labels[`websiteGoal_${data.websiteGoal}`] ?? data.websiteGoal])
    }
    if (data.hasExistingSite) {
      rows.push([labels.hasExistingSite, labels[`yesNo_${data.hasExistingSite}`] ?? data.hasExistingSite])
    }
    if (data.currentSiteUrl?.trim()) {
      rows.push([labels.currentSiteUrl, data.currentSiteUrl.trim()])
    }
  }
  if (data.intent === 'platform' && data.platformType) {
    rows.push([labels.platformType, labels[`platform_${data.platformType}`] ?? data.platformType])
  }
  if (data.intent === 'automation' && data.automationGoal) {
    rows.push([labels.automationGoal, labels[`automationGoal_${data.automationGoal}`] ?? data.automationGoal])
  }
  if (data.intent === 'ai-support' && data.aiGoal) {
    rows.push([labels.aiGoal, labels[`aiGoal_${data.aiGoal}`] ?? data.aiGoal])
  }
  if (data.intent === 'digital-events' && data.eventGoal) {
    rows.push([labels.eventGoal, labels[`eventGoal_${data.eventGoal}`] ?? data.eventGoal])
  }
  if (data.intent === 'workshop' && data.workshopTopic) {
    rows.push([labels.workshopTopic, labels[`workshopTopic_${data.workshopTopic}`] ?? data.workshopTopic])
  }
  if (data.industry?.trim()) {
    rows.push([labels.industry, labels[`industry_${data.industry}`] ?? data.industry])
  }
  if (data.primaryOutcome?.trim()) {
    rows.push([labels.primaryOutcome, labels[`outcome_${data.primaryOutcome}`] ?? data.primaryOutcome])
  }
  if (data.systemsToConnect?.trim()) {
    rows.push([labels.systemsToConnect, data.systemsToConnect.trim()])
  }
  if (data.userScale?.trim()) {
    rows.push([labels.userScale, labels[`userScale_${data.userScale}`] ?? data.userScale])
  }
  if (data.budgetBand?.trim()) {
    rows.push([labels.budgetBand, labels[`budgetBand_${data.budgetBand}`] ?? data.budgetBand])
  }
  if (data.portfolioReference?.trim()) {
    rows.push([labels.portfolioReference, data.portfolioReference.trim()])
  }
  if (data.sourcePage?.trim()) {
    rows.push([labels.sourcePage, data.sourcePage.trim()])
  }
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

  appendIntentSpecificRows(data, rows, labels)

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

  const rowCapture: [string, string][] = []
  appendIntentSpecificRows(data, rowCapture, labels)
  for (const [label, value] of rowCapture) {
    lines.push(`${label}: ${value}`)
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
