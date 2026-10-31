export const WEBSITE_ESTIMATE_PRICES = {
  website: 800,
  copyAndBooking: 300,
  visibility: 250,
  emailSetup: 150,
  emailAnnual: 114,
  microsoftStandardAnnual: 228,
  googleWorkspaceStarterAnnual: 110.4,
  voiceSetup: 50,
  zoomPhoneMonthly: 21.6,
  dialpadConnectMonthly: 20,
  nextivaCoreMonthly: 15,
  socialSingle: 125,
  socialBundle: 300,
  launchHostingAnnual: 179,
  careLiteMonthly: 49,
  careMonthly: 99,
  hstRate: 0.13,
  referralDiscountRate: 0.3,
} as const

export type DomainTerm = 'one' | 'two' | 'three'
export type DomainSource = 'existing' | 'new'
export type EmailChoice = 'none' | 'microsoft-basic' | 'microsoft-standard' | 'google-starter' | 'other'
export type VoiceChoice = 'none' | 'zoom' | 'dialpad' | 'nextiva'
export type SocialSetup = 'none' | 'instagram' | 'youtube' | 'linkedin' | 'bundle'
export type HostingChoice = 'own' | 'launch' | 'care-lite' | 'care'

export type WebsiteEstimateSelection = {
  domainSource: DomainSource
  domainTerm: DomainTerm
  email: EmailChoice
  emailUsers: number
  voice: VoiceChoice
  voiceUsers: number
  social: SocialSetup
  hosting: HostingChoice
  referralDiscount: boolean
}

export const DOMAIN_PRICES: Record<DomainTerm, number> = {
  one: 30,
  two: 55,
  three: 75,
}

const SOCIAL_PRICES: Record<SocialSetup, number> = {
  none: 0,
  instagram: WEBSITE_ESTIMATE_PRICES.socialSingle,
  youtube: WEBSITE_ESTIMATE_PRICES.socialSingle,
  linkedin: WEBSITE_ESTIMATE_PRICES.socialSingle,
  bundle: WEBSITE_ESTIMATE_PRICES.socialBundle,
}

export const EMAIL_ANNUAL_PRICES: Record<EmailChoice, number> = {
  none: 0,
  'microsoft-basic': WEBSITE_ESTIMATE_PRICES.emailAnnual,
  'microsoft-standard': WEBSITE_ESTIMATE_PRICES.microsoftStandardAnnual,
  'google-starter': WEBSITE_ESTIMATE_PRICES.googleWorkspaceStarterAnnual,
  other: 0,
}

export const VOICE_MONTHLY_PRICES: Record<VoiceChoice, number> = {
  none: 0,
  zoom: WEBSITE_ESTIMATE_PRICES.zoomPhoneMonthly,
  dialpad: WEBSITE_ESTIMATE_PRICES.dialpadConnectMonthly,
  nextiva: WEBSITE_ESTIMATE_PRICES.nextivaCoreMonthly,
}

const HOSTING_FIRST_YEAR_PRICES: Record<HostingChoice, number> = {
  own: 0,
  launch: WEBSITE_ESTIMATE_PRICES.launchHostingAnnual,
  'care-lite': WEBSITE_ESTIMATE_PRICES.careLiteMonthly * 12,
  care: WEBSITE_ESTIMATE_PRICES.careMonthly * 12,
}

export const WEBSITE_ESTIMATE_CORE_PRICE =
  WEBSITE_ESTIMATE_PRICES.website +
  WEBSITE_ESTIMATE_PRICES.copyAndBooking +
  WEBSITE_ESTIMATE_PRICES.visibility

export function calculateWebsiteEstimate(selection: WebsiteEstimateSelection) {
  const referralDiscount = selection.referralDiscount
    ? WEBSITE_ESTIMATE_CORE_PRICE * WEBSITE_ESTIMATE_PRICES.referralDiscountRate
    : 0
  const socialSetup = SOCIAL_PRICES[selection.social]
  const hasEmail = selection.email !== 'none'
  const emailUsers = hasEmail ? Math.max(1, Math.floor(selection.emailUsers || 1)) : 0
  const emailSetup = hasEmail ? WEBSITE_ESTIMATE_PRICES.emailSetup : 0
  const emailAnnual = EMAIL_ANNUAL_PRICES[selection.email] * emailUsers
  const hasVoice = selection.voice !== 'none'
  const voiceUsers = hasVoice ? Math.max(1, Math.floor(selection.voiceUsers || 1)) : 0
  const voiceSetup = hasVoice ? WEBSITE_ESTIMATE_PRICES.voiceSetup : 0
  const voiceAnnual = VOICE_MONTHLY_PRICES[selection.voice] * 12 * voiceUsers
  const domain = selection.domainSource === 'existing' ? 0 : DOMAIN_PRICES[selection.domainTerm]
  const hostingFirstYear = HOSTING_FIRST_YEAR_PRICES[selection.hosting]

  const professionalServices = WEBSITE_ESTIMATE_CORE_PRICE + emailSetup + voiceSetup + socialSetup
  const firstYearBeforeTax =
    professionalServices - referralDiscount + domain + emailAnnual + voiceAnnual + hostingFirstYear
  const hst = firstYearBeforeTax * WEBSITE_ESTIMATE_PRICES.hstRate

  return {
    core: WEBSITE_ESTIMATE_CORE_PRICE,
    referralDiscount,
    professionalServices,
    emailSetup,
    emailAnnual,
    emailUsers,
    voiceSetup,
    voiceAnnual,
    voiceUsers,
    socialSetup,
    domain,
    hostingFirstYear,
    firstYearBeforeTax,
    hst,
    firstYearTotal: firstYearBeforeTax + hst,
  }
}
