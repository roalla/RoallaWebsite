import type { ChecklistItem } from '@/lib/db/schema'

export type PlaybookTemplate = {
  id: string
  title: string
  serviceLine: string
  description: string
  items: Omit<ChecklistItem, 'done'>[]
}

export const playbookTemplates: PlaybookTemplate[] = [
  {
    id: 'digital-events',
    title: 'Digital Events',
    serviceLine: 'digital_events',
    description: 'Scoping and delivery gates for trade shows, launches, and event activations.',
    items: [
      { id: 'de-1', label: 'Discovery call — personas, booth goals, timeline' },
      { id: 'de-2', label: 'Floor entry method confirmed (QR / NFC only)' },
      { id: 'de-3', label: 'Event URL + UTM/source tagging plan' },
      { id: 'de-4', label: 'Demo flow + CTA paths (buyer / partner / press)' },
      { id: 'de-5', label: 'Content readiness review' },
      { id: 'de-6', label: 'Pre-event QA on devices + signage' },
      { id: 'de-7', label: 'Live event support plan' },
      { id: 'de-8', label: 'Post-event report + follow-up sequence' },
    ],
  },
  {
    id: 'website-digital',
    title: 'Website & Digital Enablement',
    serviceLine: 'digital',
    description: 'Discovery through launch for marketing sites and digital enablement.',
    items: [
      { id: 'wd-1', label: 'Discovery — goals, audience, content inventory' },
      { id: 'wd-2', label: 'Sitemap + page wireframes approved' },
      { id: 'wd-3', label: 'Brand + copy sign-off' },
      { id: 'wd-4', label: 'Development sprint complete' },
      { id: 'wd-5', label: 'QA — mobile, forms, analytics' },
      { id: 'wd-6', label: 'Launch checklist + DNS cutover' },
      { id: 'wd-7', label: '30-day post-launch review' },
    ],
  },
  {
    id: 'business-enablement',
    title: 'Business Enablement',
    serviceLine: 'business_enablement',
    description: 'Assessment, workshop delivery, and follow-through.',
    items: [
      { id: 'be-1', label: 'Initial assessment / intake complete' },
      { id: 'be-2', label: 'Workshop scope + agenda confirmed' },
      { id: 'be-3', label: 'Pre-work materials sent' },
      { id: 'be-4', label: 'Workshop delivered' },
      { id: 'be-5', label: 'Action items documented' },
      { id: 'be-6', label: '30-day follow-up scheduled' },
    ],
  },
]

export function getPlaybookTemplate(id: string): PlaybookTemplate | undefined {
  return playbookTemplates.find((t) => t.id === id)
}

export function templateToChecklist(template: PlaybookTemplate): ChecklistItem[] {
  return template.items.map((item) => ({ ...item, done: false }))
}
