export type PlaybookEffort = 'S' | 'M' | 'L'

export type PlaybookFeature = {
  id: string
  title: string
  what: string
  why: string
  roallaFit: string
  effort: PlaybookEffort
  dependencies?: string[]
}

export type PlaybookPackage = {
  id: string
  name: string
  timeline: string
  bestFor: string
  includes: string[]
}

export type PlaybookLifecycleRow = {
  phase: 'Pre-event' | 'During' | 'Post-event'
  feature: string
  value: string
}

export const playbookCoreFlow = [
  'Scan (QR or NFC)',
  'Product story',
  'Interactive demo',
  'Lead or next step',
  'Post-event follow-up',
] as const

export const playbookHowToUse = [
  'Open during discovery when a prospect mentions trade shows, booths, launches, or investor days.',
  'Use the feature catalog to scope what to propose—not everything on every deal.',
  'Use packages as starting proposals; adjust timeline after content-readiness review.',
  'Use the discovery checklist before sending a quote or ship-date commitment.',
  'Use Cold Deja Bru as the anchor proof when the buyer needs “show me something real.”',
]

export const playbookBoothFeatures: PlaybookFeature[] = [
  {
    id: 'source-attribution',
    title: 'Source-attributed entry paths',
    what: 'One event URL with multiple entry points—main booth QR, demo station QR, speaker slide QR, partner co-brand QR. Each path tags the visit (UTM + internal source param).',
    why: 'Sales knows which booth moment drove interest. Product teams learn which story angle converts.',
    roallaFit: 'Lightweight routing on a single Next.js page. No app store. Fast for urgent timelines.',
    effort: 'S',
    dependencies: ['QR artwork per entry point', 'Analytics or spreadsheet export'],
  },
  {
    id: 'guided-demos',
    title: 'Guided product demo flows',
    what: 'Step-by-step “how it works,” before/after sliders, short product video with chapters, ROI calculators, or product-fit quiz ending in a recommended tier.',
    why: 'Booth staff repeat one story; visitors self-serve when the booth is busy. Product education scales beyond headcount.',
    roallaFit: 'Strong overlap with Business Cocoon-style guided workflows. Reusable “demo wizard” module.',
    effort: 'M',
    dependencies: ['Product copy and visuals', 'Demo step outline from client'],
  },
  {
    id: 'floor-lead-capture',
    title: 'Floor-optimized lead capture',
    what: 'Event forms with 2–4 fields: book a demo, send spec sheet, investor/partner/distributor path split, SMS/email opt-in with instant one-pager, vCard for reps.',
    why: 'Generic contact forms underperform on noisy show floors. One obvious next step per persona.',
    roallaFit: 'Webhook, HubSpot, Salesforce, Pipedrive, or Google Sheet for smaller clients.',
    effort: 'S',
    dependencies: ['CRM or inbox destination', 'Persona definitions'],
  },
  {
    id: 'booth-dashboard',
    title: 'Live booth dashboard (staff-only)',
    what: 'Private view: scans by hour and QR source, demo step completion/drop-off, form submits, swap hero offer mid-show without redeploy.',
    why: 'Booth managers adjust pitch and staffing in real time; post-show debrief is data-backed.',
    roallaFit: 'Small admin slice on the same event site. High perceived value, moderate build.',
    effort: 'M',
    dependencies: ['Auth (password or magic link)', 'Analytics events in demo flow'],
  },
  {
    id: 'digital-takeaway',
    title: 'Digital takeaway kit',
    what: 'After scan or submit: branded one-pager, shareable “send to colleague” link, pre-written social post + image, optional sample/coupon code.',
    why: 'Product promotion continues after they leave the aisle. Referral loops amplify booth reach.',
    roallaFit: 'Static assets + one dynamic share page. Pairs with email automation.',
    effort: 'S',
    dependencies: ['PDF or mobile one-pager', 'Share copy approval'],
  },
]

export const playbookLifecycleFeatures: PlaybookLifecycleRow[] = [
  {
    phase: 'Pre-event',
    feature: 'Personalized invite links for VIP list',
    value: 'Warm traffic arrives already oriented to the product',
  },
  {
    phase: 'Pre-event',
    feature: 'Countdown / “See us at Booth #” page',
    value: 'Drives planned visits; SEO for event + product keywords',
  },
  {
    phase: 'During',
    feature: 'Session deep links from stage QR',
    value: 'Captures audience when product is shown live',
  },
  {
    phase: 'During',
    feature: 'Live poll (“Which pain point hits hardest?”)',
    value: 'Qualifies leads; feeds sales talk tracks',
  },
  {
    phase: 'Post-event',
    feature: 'Segmented follow-up pages by interest captured',
    value: '“You asked about X—here’s the 2-min demo + offer”',
  },
  {
    phase: 'Post-event',
    feature: 'Replay hub (session clips + product CTAs)',
    value: 'Extends launch moment for investors and press',
  },
]

export const playbookSelectiveAddons = [
  'AR / 3D product viewer — hardware and packaging; heavier content pipeline',
  'Live inventory or “available at booth” — retail/showroom contexts',
  'Gamified booth challenge + leaderboard — consumer brands; needs moderation',
  'Native event app — only multi-day conferences; microsite + PWA is usually enough',
  'Badge scan / lead retrieval integrations — depends on show organizer APIs (often messy)',
]

export const playbookPackages: PlaybookPackage[] = [
  {
    id: 'booth-conversion',
    name: 'Booth Conversion Kit',
    timeline: '1–3 weeks',
    bestFor: 'Trade shows, investor booths, product sampling — direct extension of Cold Deja Bru.',
    includes: [
      'QR/NFC landing page',
      'Guided demo flow (3–8 steps)',
      'Persona-split CTAs (buyer / partner / press)',
      'Lead capture + CRM handoff',
      'Basic analytics (scans, completions, submits)',
    ],
  },
  {
    id: 'launch-moment',
    name: 'Launch Moment Kit',
    timeline: '1–2 weeks',
    bestFor: 'On-stage launches, partner days, sponsor activations.',
    includes: [
      'Reveal-style hero + product narrative',
      'Press / investor / customer CTA paths',
      'Share kit + downloadable assets',
      'Post-launch redirect to main product site',
    ],
  },
  {
    id: 'event-hub',
    name: 'Event Hub + Session QR Kit',
    timeline: '3–8 weeks',
    bestFor: 'Conferences and multi-day events where product story unfolds across sessions.',
    includes: [
      'Registration / agenda microsite',
      'Per-session QR deep links to product pages',
      'Post-event nurture pages by interest tag',
      'Staff dashboard',
    ],
  },
  {
    id: 'product-fit',
    name: 'Interactive Product Fit App',
    timeline: 'Scoped after discovery',
    bestFor: 'Complex B2B products where qualification matters more than a single landing page.',
    includes: [
      'Custom wizard or scorecard (Business Cocoon pattern)',
      'Exportable brief for sales follow-up',
      'Optional bilingual EN/FR',
    ],
  },
]

export const playbookDiscoveryChecklist = [
  'Product type and primary demo story (30-second pitch)',
  'Event name, date, and fixed ship deadline',
  'Number of QR entry points and who each one serves',
  'Personas: buyer, partner, press, investor, distributor?',
  'CRM or inbox for leads (HubSpot, Salesforce, email, sheet)',
  'Languages required (EN, FR, both)',
  'Post-event follow-up owner on client side',
  'Content readiness: copy, photos, video, legal approvals',
]

export const playbookDoNotLeadWith = [
  '“Full event app” language — sounds expensive and slow',
  'Generic “engagement” without a product outcome',
  'AR / 3D unless budget and asset pipeline are confirmed',
  'Badge-scan integrations unless organizer API is validated',
  'Gamification unless brand and moderation plan are clear',
]

export const playbookCustomerSafeBullets = [
  'Multiple QR entry points so you know which booth moment drove interest',
  'Step-by-step product demos visitors can finish while your team is with other guests',
  'Separate next steps for buyers, partners, and press—not one generic form',
  'Instant shareable product summary visitors can forward after they leave the aisle',
  'Follow-up pages tied to what each visitor viewed at the show',
]

export const playbookColdDejabruReference = {
  url: 'https://coldbru.dejabru.ca',
  portfolioPath: '/digital-creations' as const,
  shipped:
    'Investor booth landing: six-step MR. COLDBRU demo grid, QR-first entry, co-branding CTAs, urgent timeline.',
  upsellNextTime: [
    'Source-attributed QRs (booth vs demo station vs session slide)',
    'Persona-split CTAs with CRM handoff',
    'Post-event segmented follow-up by demo completion',
    'Staff dashboard for scan and drop-off visibility',
  ],
}

export const effortLabels: Record<PlaybookEffort, string> = {
  S: 'Small (days)',
  M: 'Medium (1–2 weeks)',
  L: 'Large (scoped)',
}
