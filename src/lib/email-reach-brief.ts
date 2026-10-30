export type EmailReachSituation =
  | 'junk-folder'
  | 'never-arrives'
  | 'looks-like-spam'
  | 'unsure'

export type EmailReachAudience = 'customers' | 'prospects' | 'both'

export type EmailReachUrgency = 'exploring' | 'this-quarter' | 'urgent'

export type EmailReachBriefInput = {
  situation: EmailReachSituation
  usesOwnDomain: boolean
  audience: EmailReachAudience
  urgency: EmailReachUrgency
}

export type EmailReachPath = 'setup-basics' | 'trust-and-lists' | 'full-reach-review'

export function recommendEmailReachPath(input: EmailReachBriefInput): EmailReachPath {
  if (!input.usesOwnDomain) return 'setup-basics'
  if (input.situation === 'looks-like-spam' || input.situation === 'junk-folder') {
    return 'trust-and-lists'
  }
  return 'full-reach-review'
}

export function buildEmailReachBrief(input: EmailReachBriefInput) {
  const path = recommendEmailReachPath(input)
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
    'setup-basics':
      'Your answers suggest the first step is confirming you send as your business, from your own domain, in a way customers recognize.',
    'trust-and-lists':
      'Your answers point to trust and list quality—messages may look like junk even when they technically send.',
    'full-reach-review':
      'Your answers suggest several factors may be in play. A short review can separate setup, list quality, and campaign habits before the next send.',
  }

  return {
    path,
    headline: headlines[path],
    summary: summaries[path],
    priorities: priorities[path],
    plan: plans[path],
  }
}
