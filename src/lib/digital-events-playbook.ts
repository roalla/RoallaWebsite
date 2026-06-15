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
  'Default floor engagement is QR + NFC only—no booth Wi-Fi, beacons, or passive proximity push.',
  'Use the feature catalog to scope what to propose—not everything on every deal.',
  'Use packages as starting proposals; adjust timeline after content-readiness review.',
  'Use the discovery checklist before sending a quote or ship-date commitment.',
  'Use Cold Deja Bru as the anchor proof when the buyer needs “show me something real.”',
]

export type PlaybookFloorEntryMethod = {
  method: 'QR' | 'NFC'
  title: string
  range: string
  bestFor: string
  visitorAction: string
  roallaDeliverables: string[]
}

/** Roalla standard for on-floor product promotion—opt-in scan or tap, no special apps. */
export const playbookFloorEngagementIntro =
  'Visitors choose to engage by scanning a QR code or tapping an NFC tag. Both open the same event page and demo flow—we track which sign or tag they used. We do not lead with Wi-Fi captive portals, BLE beacons, or messaging people who have not opted in.'

export const playbookFloorEntryMethods: PlaybookFloorEntryMethod[] = [
  {
    method: 'QR',
    title: 'QR codes',
    range: 'Arm’s length to several metres (signage, screen, badge, slide deck)',
    bestFor: 'Main booth banner, aisle signage, presentation slides, print collateral, partner co-brand materials',
    visitorAction: 'Open camera → scan → land on event page',
    roallaDeliverables: [
      'Print-ready QR artwork for each sign—each one tracked separately in reports',
      'Landing page + demo flow + CTAs',
      'Scan counts broken down by which sign or placement drove the visit',
    ],
  },
  {
    method: 'NFC',
    title: 'NFC tags',
    range: 'Tap range ~1–4 cm (phone must touch tag or sticker)',
    bestFor: 'Demo table, product sample station, rep badge back, premium “tap to start demo” moments',
    visitorAction: 'Tap phone on tag → land on same event page (often same URL as nearest QR)',
    roallaDeliverables: [
      'NFC setup spec—each tag opens the page and records where they tapped',
      'Optional comparison of taps vs scans in your report',
      'Creative brief for sticker/table stand placement',
    ],
  },
]

export const playbookFloorEngagementExcluded = [
  'Wi-Fi captive portal — requires operating booth hotspot; venue rules and data costs',
  'BLE beacons / passive proximity push — no reliable mass reach without a custom app; Google Nearby discontinued',
  'Wi-Fi presence sniffing — privacy and platform restrictions',
  'Unsolicited SMS to nearby phones — requires prior opt-in (CASL/TCPA)',
]

export type PlaybookQueueLayoutStep = {
  step: string
  label: string
  purpose: string
  /** Plain-language label shown in scan reports for this placement. */
  reportLabel: string
}

export type PlaybookQueueTactic = {
  id: string
  title: string
  when: string
  action: string
  reportLabel?: string
}

export type PlaybookQueueSignExample = {
  placement: string
  headline: string
  subline: string
  reportLabel: string
}

export type PlaybookQueueTrackingRow = {
  where: string
  reportLabel: string
}

/** When booth lines are long—self-serve story and capture while visitors wait. */
export const playbookQueueIntro =
  'Long lines mean strong interest but also drop-off. Put QR and optional NFC at the start of the queue so visitors get the product story, complete the guided demo, and leave contact info before they reach staff. Same landing page as the booth—each sign and tap tracked separately so you can see whether aisle, queue, or desk drove the visit.'

export const playbookQueueSalesLine =
  'When the booth is slammed, queue QR and optional NFC let visitors get the full story and leave contact info before they reach your team—same page, with queue scans labeled separately so you know the line drove it.'

export const playbookQueueLayout: PlaybookQueueLayoutStep[] = [
  {
    step: '1',
    label: 'Aisle / walk-by',
    purpose: 'Catch traffic that will not join the line yet',
    reportLabel: 'Aisle walk-by',
  },
  {
    step: '2',
    label: 'Queue start (highest ROI when lines are long)',
    purpose: '“2-min demo while you wait”—guided flow + persona CTA on phone',
    reportLabel: 'Queue line',
  },
  {
    step: '3',
    label: 'Front desk',
    purpose: 'Rep confirms, answers, closes—visitor may already have done the demo',
    reportLabel: 'Front desk (optional)',
  },
]

export const playbookQueueWhileWaiting: PlaybookQueueTactic[] = [
  {
    id: 'queue-qr',
    title: 'Queue-side QR signage',
    when: 'Line forms at booth; wait exceeds ~3–5 minutes',
    action: 'Large sign at line entrance—not only at the front desk. Same event page; visits from here show as “Queue line” in reports.',
    reportLabel: 'Queue line',
  },
  {
    id: 'queue-nfc',
    title: 'NFC on stanchion or demo table',
    when: 'Visitors have phones out while waiting; hands free at rope line',
    action: '“Tap to start demo” on post or table edge. Same page as the queue QR—taps show separately from scans in your report.',
    reportLabel: 'Queue line · NFC tap',
  },
  {
    id: 'guided-demo-in-line',
    title: 'Guided demo finishable in line',
    when: 'Staff cannot repeat pitch for everyone in line',
    action: 'Short step-by-step demo (3–8 steps) on cellular—the demo wizard is the pitch; staff confirm and close at desk.',
  },
  {
    id: 'persona-split',
    title: 'Persona split before the desk',
    when: 'Mixed audience in line (buyer, partner, press, investor)',
    action: 'First tap on wait page: “I am a…” → tailored CTA and shorter form. Rep gets warmer handoff.',
  },
  {
    id: 'digital-takeaway',
    title: 'Shareable takeaway without staff',
    when: 'Visitor may leave line or send info to a colleague',
    action: 'After demo or mini-form: share link or one-pager PDF—“Forward to your team.”',
  },
  {
    id: 'wait-expectation',
    title: 'Honest wait messaging on signage',
    when: 'Long waits cause bail-outs',
    action: 'Sign copy: “Demo on your phone now · ~X min wait · Scan while you wait.” Sets expectation and gives an action.',
  },
]

export const playbookQueueBeforeShow: PlaybookQueueTactic[] = [
  {
    id: 'pre-event-qr',
    title: 'Pre-event comms with booth QR',
    when: 'VIP list, email, LinkedIn before the show',
    action: '“See us at Booth #”—warm visitors arrive pre-educated; less pressure on live pitch.',
    reportLabel: 'Pre-show outreach',
  },
  {
    id: 'session-slide-qr',
    title: 'Session / stage slide QR',
    when: 'Speaker mentions product; audience never enters the booth line',
    action: 'Deep link to spec sheet or demo—captures interest without booth visit.',
    reportLabel: 'Session / stage slide',
  },
  {
    id: 'book-demo-cta',
    title: 'Book-a-demo on event page',
    when: 'Serious buyers should not wait in a 30-minute line',
    action: 'Calendar or inquiry CTA on landing page moves high-intent leads to post-show calls.',
  },
]

export const playbookQueueAfterScan: PlaybookQueueTactic[] = [
  {
    id: 'opt-in-follow-up',
    title: 'Opt-in on wait page',
    when: 'Visitor completed demo in line but did not reach desk',
    action: 'SMS/email checkbox (CASL/TCPA compliant)—follow up after show with interest-tagged message.',
  },
  {
    id: 'post-event-segment',
    title: 'Post-event page by interest',
    when: 'After the show',
    action: '“You viewed steps 1–4 at the booth—here’s pricing / next step” segmented by demo completion or persona.',
  },
  {
    id: 'staff-dashboard-spike',
    title: 'Monitor queue-line scan spikes',
    when: 'Peak show hours',
    action: 'If “Queue line” scans jump during busy hours, add another sign, shorten live pitch, or shift staff to line greeter with QR handout.',
  },
]

export const playbookQueueSignExamples: PlaybookQueueSignExample[] = [
  {
    placement: 'Queue entrance (primary)',
    headline: 'Line moving slow?',
    subline: 'Scan for the 2-min product demo—same story we tell at the desk.',
    reportLabel: 'Queue line',
  },
  {
    placement: 'Queue stanchion with NFC',
    headline: 'Tap to start demo',
    subline: 'Finish on your phone while you wait.',
    reportLabel: 'Queue line · NFC tap',
  },
  {
    placement: 'Aisle banner (no line required)',
    headline: 'See the product in 2 minutes',
    subline: 'Scan now · Visit Booth #___ when ready.',
    reportLabel: 'Aisle walk-by',
  },
]

export const playbookQueueTrackingGuide: PlaybookQueueTrackingRow[] = [
  { where: 'Aisle banner, walk-by traffic', reportLabel: 'Aisle walk-by' },
  { where: 'Start of the booth line', reportLabel: 'Queue line' },
  { where: 'NFC tap at stanchion or table while waiting', reportLabel: 'Queue line · NFC tap' },
  { where: 'Front desk QR (optional)', reportLabel: 'Front desk' },
  { where: 'Stage slide or speaker mention', reportLabel: 'Session / stage slide' },
  { where: 'Email, invite, or social before the show', reportLabel: 'Pre-show outreach' },
]

export const playbookQueueDiscoveryQuestions = [
  'Expected peak traffic—will lines form? (If yes, budget queue QR + signage)',
  'Average acceptable wait before drop-off (sets urgency for queue-side digital)',
  'Can client print extra queue signage on site or must all artwork ship pre-show?',
  'Will reps reference “did you scan the demo?” at desk handoff?',
]

export const playbookBoothFeatures: PlaybookFeature[] = [
  {
    id: 'source-attribution',
    title: 'Tracked entry paths (QR + NFC)',
    what: 'One event page with multiple QR codes and NFC tags—main booth banner, demo table tap, speaker slide, partner co-brand sign. Each scan or tap is labeled in reports so you know which moment drove the visit. QR and NFC can share the same page.',
    why: 'Sales knows which booth moment drove interest. Product teams learn which story angle converts.',
    roallaFit: 'One lightweight event page—no app store download. Fast for urgent timelines.',
    effort: 'S',
    dependencies: ['QR artwork per entry point', 'NFC tag URLs if used', 'Analytics or spreadsheet export'],
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
    what: 'Private view: scans by hour and by which sign or tap, demo step completion/drop-off, form submits, swap hero offer mid-show without redeploy.',
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
  'QR placements: banner, aisle, slides, print—who each one serves',
  'Queue placements if high traffic expected: line entrance QR, stanchion NFC, wait-time signage',
  'NFC placements (if any): demo table, sample station, rep badge, queue stanchion—how many tags and what each should be called in reports',
  'Personas: buyer, partner, press, investor, distributor?',
  'CRM or inbox for leads (HubSpot, Salesforce, email, sheet)',
  'Languages required (EN, FR, both)',
  'Post-event follow-up owner on client side',
  'Content readiness: copy, photos, video, legal approvals',
  ...playbookQueueDiscoveryQuestions,
]

export const playbookDoNotLeadWith = [
  'Wi-Fi captive portal or “free booth Wi-Fi” capture — we stick to QR + NFC unless client already runs hotspot',
  'BLE beacons or “message everyone near the booth” — not reliable without an app; privacy concerns',
  '“Full event app” language — sounds expensive and slow',
  'Generic “engagement” without a product outcome',
  'AR / 3D unless budget and asset pipeline are confirmed',
  'Badge-scan integrations unless organizer API is validated',
  'Gamification unless brand and moderation plan are clear',
]

export const playbookCustomerSafeBullets = [
  'QR codes and optional NFC taps—multiple entry points so you know which booth moment drove interest',
  'Step-by-step product demos visitors can finish while your team is with other guests',
  'Separate next steps for buyers, partners, and press—not one generic form',
  'Instant shareable product summary visitors can forward after they leave the aisle',
  'Follow-up pages tied to what each visitor viewed at the show',
]

export const playbookColdDejabruReference = {
  url: 'https://coldbru.dejabru.ca',
  portfolioPath: '/services/portfolio' as const,
  shipped:
    'Investor booth landing: six-step MR. COLDBRU demo grid, QR-first entry, co-branding CTAs, urgent timeline.',
  upsellNextTime: [
    'Queue-side QR + NFC when lines form—tracked as Queue line vs Queue line · NFC tap',
    'NFC tap at demo station alongside booth QR (same page, separate report labels)',
    'Separate QR codes for aisle, queue, and session slide—each labeled in reports',
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
