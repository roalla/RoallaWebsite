export type AiEmployeeImage = {
  src: string
  alt: string
}

export type AiEmployeeUse = {
  title: string
  description: string
}

export type AiEmployeeAudience = {
  id: string
  label: string
  lead: string
  uses: readonly AiEmployeeUse[]
}

export type AiEmployeeIndustry = {
  id: string
  label: string
  shortLabel: string
  image: AiEmployeeImage
  positioning: string
  promise: string
  audiences: readonly AiEmployeeAudience[]
  startTitle: string
  startLead: string
  startWith: readonly string[]
  boundaryTitle: string
  boundaryLead: string
  boundaries: readonly string[]
}

export type AiEmployeeCopy = {
  metadataTitle: string
  metadataDescription: string
  brandName: string
  eyebrow: string
  title: string
  lead: string
  primaryCta: string
  secondaryCta: string
  heroImage: AiEmployeeImage
  industrySelectHint: string
  audienceSelectHint: string
  selectedLabel: string
  howEyebrow: string
  howTitle: string
  howLead: string
  howSteps: readonly { title: string; description: string; image: AiEmployeeImage }[]
  industriesEyebrow: string
  industriesTitle: string
  industriesLead: string
  industries: readonly AiEmployeeIndustry[]
  faqTitle: string
  faqs: readonly { question: string; answer: string }[]
  finalTitle: string
  finalLead: string
  finalPrimaryCta: string
  finalSecondaryCta: string
  distinctTitle: string
  distinctBody: string
  distinctLinkLabel: string
  relatedTitle: string
  relatedLead: string
  relatedLinks: readonly {
    groupId: 'automation-ai' | 'experience-products'
    label: string
    description: string
    image: AiEmployeeImage
  }[]
}

export const aiEmployeeContent: Record<'en' | 'fr', AiEmployeeCopy> = {
  en: {
    metadataTitle: 'AI Employee by Industry | ROALLA',
    metadataDescription:
      'An AI Employee that answers requests, resolves routine work, and hands off with full context—across IT, trades, logistics, warehouses, manufacturing, care practices, legal, accounting, real estate, veterinary, insurance, immigration, home care, and public service desks.',
    brandName: 'ROALLA',
    eyebrow: 'AI Employee',
    title: 'An AI front line for your business—always on, clear, and ready to hand off.',
    lead: 'Answer every request, resolve what is approved, and send complex work to the right person with full context. Explore industry patterns across Canadian service and operations businesses—then expand as the work is proven.',
    primaryCta: 'Check AI Employee fit',
    secondaryCta: 'Talk with ROALLA',
    heroImage: {
      src: '/images/insights/library/practical-ai-use-cases.webp',
      alt: 'Frontline AI Employee handling customer requests with clear human handoff',
    },
    industrySelectHint: 'Choose an industry to see fit patterns.',
    audienceSelectHint: 'Choose who the AI Employee supports first.',
    selectedLabel: 'Selected',
    howEyebrow: 'How it works',
    howTitle: 'Understand. Resolve. Document. Escalate.',
    howLead:
      'An AI Employee is not a chatbot bolted onto your front desk. It is a governed front line that follows your policies, knowledge, and handoff rules.',
    howSteps: [
      {
        title: 'Understand the request',
        description: 'Identify who needs help, what is needed, how urgent it is, and what has already been tried.',
        image: {
          src: '/images/insights/library/analog-to-ip-business-telephony.webp',
          alt: 'Understanding inbound requests across phone and digital channels',
        },
      },
      {
        title: 'Use approved knowledge',
        description: 'Answer from your service rules, catalogues, scripts, and known-issue notes—not generic internet advice.',
        image: {
          src: '/images/insights/library/five-rules-before-team-uses-ai.webp',
          alt: 'Approved knowledge and rules guiding AI Employee answers',
        },
      },
      {
        title: 'Complete routine work',
        description: 'Create records, classify priority, share status, book appointments, and update systems when those steps are approved.',
        image: {
          src: '/images/insights/library/what-to-automate-first.webp',
          alt: 'Completing repeatable frontline work with clear ownership',
        },
      },
      {
        title: 'Escalate with context',
        description: 'When judgment, safety, pricing exceptions, or risk is involved, a person receives a complete summary—not a blank message.',
        image: {
          src: '/images/insights/library/hire-or-fix-the-work-first.webp',
          alt: 'Handing complex work to a person with full context',
        },
      },
    ],
    industriesEyebrow: 'Use cases by industry',
    industriesTitle: 'Where an AI Employee creates value',
    industriesLead:
      'Each industry has different requests, rules, and risk. We start where the volume is high and the boundaries are clear.',
    industries: [
      {
        id: 'it-msp',
        label: 'IT & Managed Services',
        shortLabel: 'IT / MSP',
        image: {
          src: '/images/insights/library/it-provider-who-owns-risk.webp',
          alt: 'IT and managed services front line for tickets and after-hours coverage',
        },
        positioning: 'The AI front line for IT support',
        promise:
          'Answer every request, resolve routine issues, and route complex incidents to the right technician with full context.',
        audiences: [
          {
            id: 'internal-it',
            label: 'Internal IT help desk',
            lead: 'Give employees a first response in seconds—and give technicians tickets that already make sense.',
            uses: [
              {
                title: '24/7 intake',
                description: 'Answer calls and chats immediately, identify the person and issue, gather device details, and open a ticket.',
              },
              {
                title: 'Tier-1 troubleshooting',
                description: 'Walk people through approved fixes for Wi-Fi, VPN, printers, email, audio, software, and device performance.',
              },
              {
                title: 'Password and MFA guidance',
                description: 'Explain approved reset steps, collect required checks, and send exceptions to the identity team.',
              },
              {
                title: 'Ticket triage and routing',
                description: 'Set category, urgency, and impact; assign networking, applications, security, or endpoint support.',
              },
              {
                title: 'Outage communications',
                description: 'Recognize incidents already under investigation, share the approved status, and cut duplicate tickets.',
              },
              {
                title: 'Access and software requests',
                description: 'Collect application, role, manager, reason, and needed-by date—or explain the approved catalogue and licensing rules.',
              },
              {
                title: 'Onboarding and offboarding',
                description: 'Gather equipment and access needs for joiners; capture departure details and start the approved exit checklist. Human approval stays mandatory for access changes.',
              },
              {
                title: 'Scheduling and documentation',
                description: 'Book desk-side support or device pickup, summarize the conversation, and extract next actions for the technician.',
              },
            ],
          },
          {
            id: 'msp-clients',
            label: 'MSP service desk for clients',
            lead: 'Serve clients under your brand with client-specific rules—while protecting after-hours coverage and technician time.',
            uses: [
              {
                title: 'Client-facing service desk',
                description: 'Ask which company, site, and user are affected; capture impact and error details; create a structured ticket for the right pod.',
              },
              {
                title: 'After-hours support',
                description: 'Resolve approved routine questions, collect full diagnostics, escalate true emergencies, and schedule the rest for the next business day.',
              },
              {
                title: 'Incident prioritization',
                description: 'Separate one printer issue from an executive lockout, a site-wide outage, or a suspected compromised account.',
              },
              {
                title: 'Known-issue deflection',
                description: 'When many clients hit the same outage, share the approved status, attach callers to the master incident, and avoid unconnected duplicates.',
              },
              {
                title: 'Client-specific knowledge',
                description: 'Answer using each client’s apps, hours, device standards, entitlements, and escalation contacts—not generic consumer advice.',
              },
              {
                title: 'Technician dispatch',
                description: 'Confirm remote attempts, site access, and contact details; book onsite work; send confirmations and handle rescheduling.',
              },
              {
                title: 'Security-event intake',
                description: 'Collect minimum facts for suspicious links, unexpected MFA prompts, lost devices, or mailbox concerns—then escalate immediately with approved containment guidance.',
              },
              {
                title: 'Sales and account follow-through',
                description: 'Qualify new prospects, schedule discovery or QBRs, answer routine coverage questions, and send contract exceptions to the account manager.',
              },
            ],
          },
        ],
        startTitle: 'Strongest place to begin',
        startLead: 'Start with high volume, clear rules, and low risk. Prove value before expanding.',
        startWith: [
          '24/7 call and chat intake',
          'Ticket classification and routing',
          'Approved Tier-1 troubleshooting',
          'Known-outage communication',
          'Technician scheduling and conversation summaries',
        ],
        boundaryTitle: 'Clear limits build trust',
        boundaryLead:
          'An AI Employee should not be sold as an unsupervised IT administrator. Risky actions need integrations, identity checks, permissions, approvals, and audit trails.',
        boundaries: [
          'Credential resets, access changes, software deployment, device isolation, and security closures stay under human control unless tightly governed integrations exist.',
          'Without those connections, it still delivers value as an intelligent front door: collect facts, answer from approved knowledge, open structured tickets, communicate status, schedule work, and hand off a complete summary.',
          'Security reports should gather only what is needed, give approved containment steps, and escalate—never decide alone that a compromise is “safe.”',
        ],
      },
      {
        id: 'trades-field',
        label: 'Trades & Field Service',
        shortLabel: 'Trades',
        image: {
          src: '/images/insights/library/trade-show-leads-after-qr-scan.webp',
          alt: 'Trades and field service intake for calls, booking, and job follow-through',
        },
        positioning: 'The AI front line for the shop phone',
        promise:
          'Answer every call and message, qualify the job, book routine work, and get true emergencies to the right tech—with the details already captured.',
        audiences: [
          {
            id: 'customer-intake',
            label: 'Customer calls & booking',
            lead: 'Stop losing jobs to voicemail while crews are on site. Give every caller a clear first response—day, night, and weekend.',
            uses: [
              {
                title: 'Never-miss intake',
                description: 'Answer calls, texts, and web chats under your brand; capture name, callback number, address, and what needs fixing.',
              },
              {
                title: 'Emergency triage',
                description: 'Spot active leaks, no heat, gas smell, sparks, or flooding; share approved safety steps and alert the on-call tech immediately.',
              },
              {
                title: 'Job qualification',
                description: 'Separate repair, install, and maintenance; gather equipment type, age, symptoms, access notes, and preferred timing.',
              },
              {
                title: 'Live appointment booking',
                description: 'Book into approved windows with drive-time buffers, service areas, and tech skills—then send confirmation to the customer.',
              },
              {
                title: 'Service-area and entitlement checks',
                description: 'Confirm you cover the location, whether the work fits your offers, and if a membership or warranty applies.',
              },
              {
                title: 'Ballpark pricing guidance',
                description: 'Share approved diagnostic fees, after-hours rates, and common price ranges; send exceptions and large installs to a person.',
              },
              {
                title: 'Storm and surge handling',
                description: 'Take many calls at once after weather events, collect damage details, and keep the queue orderly without hold music.',
              },
              {
                title: 'Dispatch handoff',
                description: 'Create a structured job with address, urgency, notes, and photos requested—so the truck leaves with context, not guesswork.',
              },
            ],
          },
          {
            id: 'job-follow-through',
            label: 'Office follow-through',
            lead: 'Keep the schedule full and the paperwork moving after the first call—without pulling a tech off a job to chase details.',
            uses: [
              {
                title: 'Reminders and rescheduling',
                description: 'Send appointment reminders, collect “on my way” updates, and handle simple reschedules within your rules.',
              },
              {
                title: 'Quote follow-up',
                description: 'Call or message open estimates, answer common questions, and book the work when the customer is ready.',
              },
              {
                title: 'Membership and maintenance plans',
                description: 'Explain included visits, renewals, and seasonal tune-ups; schedule plan work into quieter calendar slots.',
              },
              {
                title: 'Parts and arrival updates',
                description: 'Share approved status when parts are ordered or a return visit is needed; escalate frustrated customers early.',
              },
              {
                title: 'Invoice and payment nudges',
                description: 'Answer “what is this charge?” from connected records and send polite payment reminders for overdue invoices.',
              },
              {
                title: 'Review and reputation requests',
                description: 'Ask for a review after completed jobs and flag unhappy feedback for a human before it becomes a public complaint.',
              },
              {
                title: 'Supplier and warranty intake',
                description: 'Collect model numbers, purchase dates, and claim details for warranty work; route incomplete files back for missing info.',
              },
              {
                title: 'Crew coordination messages',
                description: 'Confirm site access, parking, lockbox codes, and who will be home—then notify the assigned tech with a clean summary.',
              },
            ],
          },
        ],
        startTitle: 'Strongest place to begin',
        startLead: 'Start where missed calls cost real revenue and the rules are easy to write down.',
        startWith: [
          '24/7 call and message intake',
          'Emergency vs routine triage',
          'Appointment booking into live availability',
          'Structured job details for dispatch',
          'Reminders, quote follow-up, and conversation summaries',
        ],
        boundaryTitle: 'Clear limits build trust',
        boundaryLead:
          'An AI Employee should not invent prices, send a truck without your rules, or give safety advice outside what you approve. High-risk moments need people and clear protocols.',
        boundaries: [
          'True emergencies, gas smells, electrical fire risk, and life-safety situations follow your approved scripts and escalate to humans—never “close” on their own.',
          'Final pricing for complex installs, insurance scopes, and contract exceptions stays with an estimator or owner unless tightly governed rate cards and approvals exist.',
          'Without deep field-software connections, it still wins as the front door: answer every inquiry, qualify the job, book what is allowed, capture complete details, and hand crews a usable summary.',
        ],
      },
      {
        id: 'transportation-logistics',
        label: 'Transportation & Logistics',
        shortLabel: 'Logistics',
        image: {
          src: '/images/insights/library/smb-digital-efficiency.webp',
          alt: 'Transportation and logistics desk for shipper questions and dispatch handoff',
        },
        positioning: 'The AI front line for freight and fleet coordination',
        promise:
          'Answer shipment questions, capture new moves, track exceptions, and get dispatchers the right details before a load is late.',
        audiences: [
          {
            id: 'shipper-customer',
            label: 'Shipper & customer service',
            lead: 'Give customers fast answers on status, booking, and documents—without pulling planners off the board.',
            uses: [
              {
                title: 'Where-is-my-shipment intake',
                description: 'Identify the load, share the approved status, and collect missing reference numbers before escalating.',
              },
              {
                title: 'New shipment and quote requests',
                description: 'Capture origin, destination, freight details, windows, and special requirements; create a structured request for pricing review.',
              },
              {
                title: 'Appointment and delivery changes',
                description: 'Record requested pickup or delivery changes, check against known constraints, and route exceptions to a planner.',
              },
              {
                title: 'Document chase',
                description: 'Ask for BOLs, PODs, customs papers, and photos; confirm what arrived and flag what is still missing.',
              },
              {
                title: 'Delay and exception notices',
                description: 'Send approved delay messages, gather impact details, and open a recovery task when a milestone is missed.',
              },
              {
                title: 'Claims intake',
                description: 'Collect damage or shortage facts, photos, and references; open a claim file and hand it to a person with full context.',
              },
              {
                title: 'Carrier and broker callbacks',
                description: 'Answer routine availability or status checks under your rules and escalate rate or contract disputes.',
              },
              {
                title: 'Invoice and accessorial questions',
                description: 'Explain approved charges from connected records and send disputes or unclear line items to billing.',
              },
            ],
          },
          {
            id: 'dispatch-ops',
            label: 'Dispatch & operations',
            lead: 'Help the desk compare options, keep drivers informed, and escalate only the loads that need human judgment.',
            uses: [
              {
                title: 'Load tender intake',
                description: 'Capture tender details, equipment needs, and deadlines; summarize fit against known capacity for dispatcher review.',
              },
              {
                title: 'Driver check-calls',
                description: 'Collect location, ETA, dwell, and issues on a standard script; update the load record and alert dispatch when risk rises.',
              },
              {
                title: 'Hours and eligibility screening',
                description: 'Ask the approved qualification questions and flag conflicts with hours, endorsements, or equipment before assignment.',
              },
              {
                title: 'Detention and wait-time logging',
                description: 'Record arrival, check-in, and release times with reason codes so billing and planning have clean evidence.',
              },
              {
                title: 'Relay and recovery coordination',
                description: 'When a breakdown or missed window happens, gather facts, notify stakeholders with approved wording, and open the recovery plan.',
              },
              {
                title: 'Backhaul and empty-mile prompts',
                description: 'Surface nearby opportunities that match equipment and windows; leave acceptance decisions to dispatch.',
              },
              {
                title: 'Yard and gate status',
                description: 'Confirm trailer numbers, seal status, and check-in readiness; route blocked gates or missing paperwork to a supervisor.',
              },
              {
                title: 'Shift handoff summaries',
                description: 'Summarize open exceptions, pending appointments, and driver issues so the next desk starts with context.',
              },
            ],
          },
        ],
        startTitle: 'Strongest place to begin',
        startLead: 'Start with high-volume questions and clean exception intake before touching autonomous reassignment.',
        startWith: [
          'Shipment status and WISMO answers',
          'New load and quote intake',
          'Delay and exception notifications',
          'Driver check-calls and ETA updates',
          'Claims and document chase with summaries',
        ],
        boundaryTitle: 'Clear limits build trust',
        boundaryLead:
          'An AI Employee should not reassign loads, change contracts, or hide safety issues on its own. Dispatch authority and customer commitments stay with people unless tightly governed systems say otherwise.',
        boundaries: [
          'Final tender acceptance, rate exceptions, hazmat decisions, and driver reassignment need human approval and full audit trails.',
          'Safety events, accidents, and cargo theft reports collect minimum facts, give approved instructions, and escalate immediately.',
          'Without deep TMS connections, it still delivers value as the front door: answer status, capture complete requests, chase documents, log exceptions, and hand planners a usable summary.',
        ],
      },
      {
        id: 'warehouses',
        label: 'Warehouses',
        shortLabel: 'Warehouse',
        image: {
          src: '/images/insights/library/process-optimization.webp',
          alt: 'Warehouse and 3PL service desk for customer updates and dock coordination',
        },
        positioning: 'The AI front line for the warehouse desk and dock',
        promise:
          'Answer inventory and order questions, coordinate dock appointments, and turn receiving or picking exceptions into clear next steps for the floor.',
        audiences: [
          {
            id: 'warehouse-customers',
            label: 'Customer & 3PL service',
            lead: 'Give shippers and internal teams fast answers on stock, orders, and appointments—without interrupting every picker.',
            uses: [
              {
                title: 'Inventory and order status',
                description: 'Confirm on-hand, allocated, or shipped status from approved records and gather missing order references first.',
              },
              {
                title: 'ASN and receiving questions',
                description: 'Collect expected arrival details, carrier, and appointment needs; open a receiving task when something looks wrong.',
              },
              {
                title: 'Dock appointment booking',
                description: 'Book inbound or outbound slots against approved windows, door types, and dwell rules; send confirmations and changes.',
              },
              {
                title: 'Shortages, damages, and holds',
                description: 'Capture photos, quantities, lot or serial details, and reason codes; create an exception file for supervisor review.',
              },
              {
                title: 'Returns and RMA intake',
                description: 'Verify return authorization, reason, and condition requirements; schedule the return appointment when allowed.',
              },
              {
                title: 'SLA and cutoff guidance',
                description: 'Explain approved cutoffs, lead times, and same-day rules; escalate rush requests that break policy.',
              },
              {
                title: 'Billing and storage questions',
                description: 'Answer routine storage, handling, or accessorial questions from connected records; send disputes to account management.',
              },
              {
                title: 'After-hours warehouse desk',
                description: 'Take overnight status and appointment requests, resolve approved FAQs, and queue the rest for the morning shift.',
              },
            ],
          },
          {
            id: 'warehouse-floor',
            label: 'Floor & dock operations',
            lead: 'Help supervisors and leads clear bottlenecks with structured intake—not another scattered radio call.',
            uses: [
              {
                title: 'Receiving discrepancy intake',
                description: 'Log overages, shortages, and damages against the ASN or PO; request photos and hold instructions.',
              },
              {
                title: 'Putaway and slotting prompts',
                description: 'Capture product constraints and suggest approved location rules for a lead to confirm before moves are posted.',
              },
              {
                title: 'Replenishment requests',
                description: 'Collect pick-face shortages and priority; open replenishment work for the next available associate.',
              },
              {
                title: 'Pick and pack exceptions',
                description: 'Record wrong item, short pick, label, or carton issues; route to quality or a lead with order context.',
              },
              {
                title: 'Cycle-count assistance',
                description: 'Guide approved count steps, capture variances, and send adjustments that need sign-off to a supervisor.',
              },
              {
                title: 'Labor and task status',
                description: 'Summarize open waves, stalled tasks, and door congestion so leads can rebalance work quickly.',
              },
              {
                title: 'Safety and near-miss reports',
                description: 'Collect minimum facts, give approved stop-work guidance, and escalate immediately—never close a safety event alone.',
              },
              {
                title: 'Shift handoff briefs',
                description: 'Summarize open exceptions, pending appointments, holds, and equipment issues for the next shift.',
              },
            ],
          },
        ],
        startTitle: 'Strongest place to begin',
        startLead: 'Start with desk questions and exception intake where volume is high and authority is easy to define.',
        startWith: [
          'Inventory and order status answers',
          'Dock appointment booking',
          'Receiving and damage exception intake',
          'Returns and RMA guidance',
          'Shift handoff summaries for open issues',
        ],
        boundaryTitle: 'Clear limits build trust',
        boundaryLead:
          'An AI Employee should not silently adjust inventory, release quality holds, or override safety rules. Warehouse control systems and supervisors stay accountable for consequential changes.',
        boundaries: [
          'Inventory adjustments, hold releases, hazardous handling changes, and safety investigations require human approval and audit trails.',
          'Rush orders that break cutoffs, customer chargebacks, and contract exceptions go to account owners—not unsupervised automation.',
          'Without deep WMS write access, it still delivers value as the front door: answer status, book appointments, capture complete exceptions, and hand the floor a usable summary.',
        ],
      },
      {
        id: 'care-practices',
        label: 'Care Practices',
        shortLabel: 'Practices',
        image: {
          src: '/images/insights/library/authentic-professional-portrait-selection.webp',
          alt: 'Care practice front desk for patient booking and care continuity',
        },
        positioning: 'The AI front line for clinic reception',
        promise:
          'Answer every patient call and message, book the right visit type, and keep recalls and waitlists moving—while clinical judgment stays with your providers.',
        audiences: [
          {
            id: 'patient-front-desk',
            label: 'Patient calls & booking',
            lead: 'For dental, physio, chiropractic, therapy, massage, and similar practices that lose bookings while the desk is with a patient—or after hours.',
            uses: [
              {
                title: 'Always-on reception',
                description: 'Answer calls, texts, and web chats under your practice name during busy clinics, lunch, and after hours.',
              },
              {
                title: 'New-patient booking',
                description: 'Collect reason for visit, preferred provider or location, insurance or funding basics, and book the correct first appointment length.',
              },
              {
                title: 'Follow-up and care-plan visits',
                description: 'Book hygiene, adjustments, treatment sessions, and reviews into the right chair, room, and provider calendar.',
              },
              {
                title: 'Reschedule and cancel rules',
                description: 'Handle simple changes inside your notice window; explain deposits or late fees from approved policy; escalate edge cases.',
              },
              {
                title: 'Urgent vs routine routing',
                description: 'Recognize toothache, injury flare-ups, or same-day needs using your scripts; offer approved urgent slots or escalate to staff immediately.',
              },
              {
                title: 'Hours, location, and services FAQ',
                description: 'Answer parking, directions, what you offer, and what to bring—from approved content only.',
              },
              {
                title: 'Multi-provider and multi-site routing',
                description: 'Match callers to the right location, practitioner, language, and appointment type without bouncing them around.',
              },
              {
                title: 'Clinical handoff',
                description: 'Send symptoms, medication, or treatment questions to your team as a structured callback—never diagnose or give clinical advice.',
              },
            ],
          },
          {
            id: 'practice-continuity',
            label: 'Recalls & care continuity',
            lead: 'Keep the schedule full and patients progressing through their plan without pulling providers out of treatment time.',
            uses: [
              {
                title: 'Confirmations and reminders',
                description: 'Send appointment confirmations and day-before reminders with easy confirm or reschedule options.',
              },
              {
                title: 'No-show and cancellation fill',
                description: 'Offer freed slots to a short-notice waitlist under your rules so chairs and rooms stay productive.',
              },
              {
                title: 'Hygiene and checkup recalls',
                description: 'Run recall outreach at the intervals you set for patients who have agreed to be contacted.',
              },
              {
                title: 'Care-plan rebooking',
                description: 'Rebook missed physio, chiro, or therapy visits and help patients complete the planned course of care.',
              },
              {
                title: 'Forms and intake collection',
                description: 'Send pre-visit forms, collect completed answers, and flag incomplete files before the appointment.',
              },
              {
                title: 'Referral and enquiry follow-up',
                description: 'Reply quickly to web, ad, and referral enquiries; book when ready or schedule a callback with staff.',
              },
              {
                title: 'Fees and coverage questions',
                description: 'Explain approved fee ranges, payment options, and common coverage questions; send exceptions to the front desk.',
              },
              {
                title: 'Review requests',
                description: 'Ask for service feedback after visits using approved wording—and escalate unhappy responses to a person before they go public.',
              },
            ],
          },
        ],
        startTitle: 'Strongest place to begin',
        startLead: 'Start where missed calls and unfinished care plans cost revenue—and where clinical boundaries are easy to write down.',
        startWith: [
          '24/7 call and message intake',
          'New-patient and follow-up booking',
          'Urgent vs routine routing with escalation',
          'Reminders, recalls, and waitlist fill',
          'Forms collection and conversation summaries for staff',
        ],
        boundaryTitle: 'Clear limits build trust',
        boundaryLead:
          'An AI Employee is reception and coordination—not a clinician. Privacy, consent, and clinical accountability stay with your practice.',
        boundaries: [
          'No diagnosis, treatment advice, prescription decisions, or answers about whether symptoms can wait—those escalate to qualified staff with a complete callback summary.',
          'Payment card numbers, sensitive clinical details beyond approved intake, and chart changes stay outside unsupervised automation unless tightly governed systems and consent rules exist.',
          'Without deep practice-software write access, it still delivers value as the front door: answer every enquiry, book what is allowed, collect forms, run recalls, and hand your team a usable summary.',
        ],
      },
      {
        id: 'manufacturing',
        label: 'Manufacturing',
        shortLabel: 'Manufacturing',
        image: {
          src: '/images/insights/library/twelve-month-technology-roadmap.webp',
          alt: 'Manufacturing order desk and plant floor request routing',
        },
        positioning: 'The AI front line for the plant desk and floor',
        promise:
          'Answer order and quality questions, triage maintenance and line issues, and hand supervisors a complete summary—so production keeps moving.',
        audiences: [
          {
            id: 'plant-customers',
            label: 'Customer & order desk',
            lead: 'Give buyers and sales ops fast answers on orders, quality, and delivery—without pulling planners off the schedule.',
            uses: [
              {
                title: 'Order and promise-date status',
                description: 'Confirm order stage, ship date, and holds from approved records; gather missing PO or line references first.',
              },
              {
                title: 'Quote and capability intake',
                description: 'Capture part specs, quantities, materials, and due dates; create a structured request for estimating review.',
              },
              {
                title: 'Change-order requests',
                description: 'Log quantity, date, or spec changes with impact notes; route material commitments and schedule hits to a planner.',
              },
              {
                title: 'Quality and nonconformance intake',
                description: 'Collect defect details, lot or serial numbers, and photos; open a quality file for disposition by people.',
              },
              {
                title: 'Warranty and RMA requests',
                description: 'Verify entitlement basics, gather failure details, and schedule return or field-service next steps under your rules.',
              },
              {
                title: 'Certificate and document chase',
                description: 'Provide approved COAs, mill certs, or packing lists when available; chase missing documents from suppliers or QA.',
              },
              {
                title: 'Supplier and buyer callbacks',
                description: 'Answer routine delivery and ASN questions; escalate price, contract, or capacity disputes to purchasing.',
              },
              {
                title: 'After-hours plant desk',
                description: 'Take overnight status and exception messages, resolve approved FAQs, and queue the rest for the day shift.',
              },
            ],
          },
          {
            id: 'plant-floor',
            label: 'Production & maintenance',
            lead: 'Help leads clear line stops, maintenance tickets, and shift handoffs with structured intake—not scattered radio traffic.',
            uses: [
              {
                title: 'Line-stop and alarm intake',
                description: 'Capture machine, symptom, last good run, and safety status; open a work request and alert the right trade.',
              },
              {
                title: 'Maintenance ticket triage',
                description: 'Classify urgent vs planned work, check known procedures, and summarize parts or lockout needs for a supervisor.',
              },
              {
                title: 'SOP and work-instruction guidance',
                description: 'Surface approved procedures and setup steps for the job at hand; send ambiguous cases to a lead.',
              },
              {
                title: 'Material and shortage calls',
                description: 'Log missing components, kits, or tooling; notify materials and production with location and job priority.',
              },
              {
                title: 'Quality hold and scrap reporting',
                description: 'Record hold reasons, quantities, and containment steps already taken; escalate disposition decisions.',
              },
              {
                title: 'Shift handoff briefs',
                description: 'Summarize open stops, pending maintenance, quality holds, and schedule risk for the incoming shift.',
              },
              {
                title: 'Safety and near-miss reports',
                description: 'Collect minimum facts, give approved stop-work guidance, and escalate immediately—never close a safety event alone.',
              },
              {
                title: 'Training and skill lookup',
                description: 'Confirm who is qualified for a task from approved matrices; route gaps to a supervisor before work starts.',
              },
            ],
          },
        ],
        startTitle: 'Strongest place to begin',
        startLead: 'Start with high-volume desk questions and clean exception intake before touching schedule or machine control.',
        startWith: [
          'Order and promise-date status answers',
          'Quality and nonconformance intake',
          'Line-stop and maintenance ticket triage',
          'SOP guidance from approved procedures',
          'Shift handoff summaries for open issues',
        ],
        boundaryTitle: 'Clear limits build trust',
        boundaryLead:
          'An AI Employee should not run equipment, change production schedules, or close safety and quality events on its own. Plant systems and supervisors stay accountable for consequential actions.',
        boundaries: [
          'Machine commands, lockout decisions, schedule changes, and urgent purchases need human approval and full audit trails.',
          'Safety incidents, quality escapes, and customer chargebacks escalate with complete context—never “all clear” without a person.',
          'Without deep MES, CMMS, or ERP write access, it still delivers value as the front door: answer status, capture complete exceptions, surface approved SOPs, and hand leads a usable summary.',
        ],
      },
      {
        id: 'legal',
        label: 'Legal',
        shortLabel: 'Legal',
        image: {
          src: '/images/insights/library/client-boundaries-without-damaging-relationships.webp',
          alt: 'Legal intake and client coordination with clear matter handoff',
        },
        positioning: 'The AI front line for law-firm intake',
        promise:
          'Answer every inquiry, capture case details, book consultations, and route urgent matters to the right attorney—so your team practices law instead of chasing the phone.',
        audiences: [
          {
            id: 'legal-intake',
            label: 'Client intake & new matters',
            lead: 'Potential clients hire the firm that responds first. Keep intake moving when attorneys are in court, depositions, or deep in briefs.',
            uses: [
              {
                title: 'Always-on first response',
                description: 'Answer calls, texts, and web chats under the firm name during court, meetings, lunch, and after hours—so inquiries do not die in voicemail.',
              },
              {
                title: 'Practice-area qualification',
                description: 'Confirm whether the matter fits your practice areas and locations; politely decline or refer out when it does not match your criteria.',
              },
              {
                title: 'Structured case intake',
                description: 'Capture what happened, when, who was involved, injuries or damages, documents available, and other approved screening questions.',
              },
              {
                title: 'Consultation booking',
                description: 'Book initial consults into approved calendars by attorney, matter type, and urgency; send confirmations and what-to-bring instructions.',
              },
              {
                title: 'Urgency and conflict routing',
                description: 'Flag time-sensitive matters, statute concerns, and custody or safety issues for immediate human review using your escalation rules.',
              },
              {
                title: 'Fees and process FAQ',
                description: 'Explain approved consultation fees, free-consult rules, and high-level process steps from firm content—never case-specific legal advice.',
              },
              {
                title: 'Document and evidence checklist',
                description: 'Tell callers which records to gather before the consult and open a clean intake summary for the attorney.',
              },
              {
                title: 'Lead follow-up',
                description: 'Re-engage incomplete intakes and no-shows with approved reminders so qualified matters do not go cold.',
              },
            ],
          },
          {
            id: 'legal-client-service',
            label: 'Client service & coordination',
            lead: 'Keep existing clients informed and staff coordinated without interrupting billable work for routine requests.',
            uses: [
              {
                title: 'Attorney and matter routing',
                description: 'Identify the client and matter, then connect to the right attorney, paralegal, or practice group with context.',
              },
              {
                title: 'Appointment and deadline changes',
                description: 'Reschedule consults, prep calls, and routine meetings inside your rules; escalate court or filing conflicts to staff.',
              },
              {
                title: 'Status updates without advice',
                description: 'Share approved non-advice status language and collect questions for the responsible lawyer to answer.',
              },
              {
                title: 'Document intake and requests',
                description: 'Tell clients how to send insurance info, police reports, contracts, or forms; confirm what was received and what is still missing.',
              },
              {
                title: 'After-hours client coverage',
                description: 'Handle routine questions overnight, capture urgent messages, and notify on-call counsel when your thresholds are met.',
              },
              {
                title: 'Call summaries for the file',
                description: 'Transcribe and summarize conversations so intake details and next actions attach cleanly to the matter record.',
              },
              {
                title: 'Sentiment and escalation cues',
                description: 'Detect frustration or urgency and move the conversation to a person before the client relationship deteriorates.',
              },
              {
                title: 'Team handoff notes',
                description: 'Give attorneys, paralegals, and intake staff one shared summary across calls, texts, and messages.',
              },
            ],
          },
        ],
        startTitle: 'Strongest place to begin',
        startLead: 'Start where missed inquiries cost retainers—and where “no legal advice” boundaries are easy to enforce.',
        startWith: [
          '24/7 inquiry answering and lead capture',
          'Practice-area qualification and structured intake',
          'Consultation booking with confirmations',
          'Urgent-matter routing to the right attorney',
          'Conversation summaries attached to the matter',
        ],
        boundaryTitle: 'Clear limits build trust',
        boundaryLead:
          'An AI Employee supports intake and coordination—it does not practice law. Confidentiality, conflicts, and advice stay with licensed professionals.',
        boundaries: [
          'No legal advice, case strategy, outcome predictions, or interpretation of a client’s rights—those escalate to an attorney with a complete callback summary.',
          'Privileged and sensitive details follow your approved intake script only; you define what the AI may ask, store, record, and share.',
          'Without deep practice-management write access, it still delivers value as the front door: answer every inquiry, qualify the matter, book consults, capture complete intake, and hand counsel a usable summary.',
        ],
      },
      {
        id: 'accounting-tax',
        label: 'Accounting & Tax',
        shortLabel: 'Accounting',
        image: {
          src: '/images/insights/library/measure-software-business-value.webp',
          alt: 'Accounting and tax client intake, booking, and file readiness',
        },
        positioning: 'The AI front line for the firm desk in peak season',
        promise:
          'Answer client calls, book appointments, chase documents, and route urgent filing questions—so accountants stay on billable work.',
        audiences: [
          {
            id: 'accounting-intake',
            label: 'Client intake & booking',
            lead: 'Tax season and month-end crush the phone. Keep every inquiry answered without pulling preparers off returns.',
            uses: [
              {
                title: 'Always-on firm reception',
                description: 'Answer calls and messages during busy filing windows, lunch, and after hours under your firm name.',
              },
              {
                title: 'New-client qualification',
                description: 'Capture business vs personal needs, entity type, urgency, and service fit before booking a discovery call.',
              },
              {
                title: 'Appointment booking',
                description: 'Book tax, bookkeeping, payroll, and advisory slots into the right staff calendar with confirmations.',
              },
              {
                title: 'Document checklist intake',
                description: 'Tell clients which slips, statements, and receipts to send; confirm what arrived and what is still missing.',
              },
              {
                title: 'Deadline and filing FAQ',
                description: 'Share approved due dates, extension basics, and process steps from firm content—not personalized tax advice.',
              },
              {
                title: 'Portal and payment questions',
                description: 'Guide clients through approved portal access, invoice status, and payment options from connected records.',
              },
              {
                title: 'Referral and lead follow-up',
                description: 'Re-engage incomplete intakes and no-shows so seasonal prospects do not go cold.',
              },
              {
                title: 'Urgent routing',
                description: 'Escalate CRA notices, payroll failures, and same-day filing risks to the responsible accountant immediately.',
              },
            ],
          },
          {
            id: 'accounting-ops',
            label: 'File readiness & follow-through',
            lead: 'Keep files moving between appointments with structured chase—not ad-hoc staff interruptions.',
            uses: [
              {
                title: 'Missing-info chase',
                description: 'Request outstanding documents with clear lists and log every client response against the engagement.',
              },
              {
                title: 'Bookkeeping cadence reminders',
                description: 'Remind clients of monthly upload deadlines and upcoming close dates under your service agreements.',
              },
              {
                title: 'Engagement letter follow-up',
                description: 'Send approved engagement next steps and flag unsigned letters for staff follow-up.',
              },
              {
                title: 'Status without advice',
                description: 'Share approved “in progress / waiting on documents / ready for review” language only.',
              },
              {
                title: 'Payroll and remittance intake',
                description: 'Collect payroll change details and remittance questions; route calculation and filing decisions to staff.',
              },
              {
                title: 'Season capacity triage',
                description: 'Prioritize inquiries by deadline risk and service type so the desk protects the most time-sensitive work.',
              },
              {
                title: 'Handoff summaries',
                description: 'Attach a clean conversation summary to the client file before the next preparer touches it.',
              },
              {
                title: 'Review and referral requests',
                description: 'Ask for referrals or reviews after completed engagements using approved wording.',
              },
            ],
          },
        ],
        startTitle: 'Strongest place to begin',
        startLead: 'Start where peak-season missed calls and missing documents slow billable work.',
        startWith: [
          '24/7 inquiry answering during filing season',
          'Appointment booking by service type',
          'Document checklist and missing-info chase',
          'Urgent CRA and payroll escalation',
          'Conversation summaries on the client file',
        ],
        boundaryTitle: 'Clear limits build trust',
        boundaryLead:
          'An AI Employee coordinates intake and file readiness—it does not provide tax, accounting, or financial advice.',
        boundaries: [
          'No tax positions, deduction decisions, audit representation, or personalized filing advice—those escalate to qualified staff.',
          'SIN, banking, and sensitive financial details follow your approved intake and storage rules only.',
          'Without deep practice-software write access, it still delivers value as the front door: answer every inquiry, book work, chase documents, and hand preparers a usable summary.',
        ],
      },
      {
        id: 'real-estate-property',
        label: 'Real Estate & Property',
        shortLabel: 'Real estate',
        image: {
          src: '/images/insights/library/sales-pipeline-or-list-of-contacts.webp',
          alt: 'Real estate and property desk for leads and resident requests',
        },
        positioning: 'The AI front line for listings, leads, and tenants',
        promise:
          'Answer every lead and tenant request, book showings or service visits, and route urgent issues—so deals and buildings keep moving.',
        audiences: [
          {
            id: 'real-estate-leads',
            label: 'Sales & leasing leads',
            lead: 'Speed-to-lead wins in Canadian markets. Capture and qualify inquiries while agents are in showings or after hours.',
            uses: [
              {
                title: 'Lead capture on first contact',
                description: 'Answer calls, texts, and portal inquiries instantly; collect name, budget, timeline, and preferred areas.',
              },
              {
                title: 'Listing and availability FAQ',
                description: 'Share approved property details, open-house times, and application steps from current inventory content.',
              },
              {
                title: 'Showing appointment booking',
                description: 'Book showings into agent or listing calendars with access notes, confirmations, and reminders.',
              },
              {
                title: 'Buyer and tenant qualification',
                description: 'Ask approved pre-qual questions and route serious prospects to the right agent or leasing officer.',
              },
              {
                title: 'Offer and application intake',
                description: 'Collect documents and intent signals; create a structured package for human review—never negotiate terms alone.',
              },
              {
                title: 'Mortgage and pre-approval routing',
                description: 'Capture financing status and connect prospects to approved partners or internal mortgage contacts.',
              },
              {
                title: 'Stale-lead reactivation',
                description: 'Follow up older inquiries with approved outreach when new matching inventory appears.',
              },
              {
                title: 'Agent handoff summaries',
                description: 'Deliver complete lead context so the first human conversation starts ready to close.',
              },
            ],
          },
          {
            id: 'property-management',
            label: 'Property management desk',
            lead: 'Keep residents and owners informed while maintenance and leasing teams stay on site work.',
            uses: [
              {
                title: 'Maintenance request intake',
                description: 'Capture unit, issue, urgency, photos, and access instructions; open a work order for the right trade.',
              },
              {
                title: 'Emergency vs routine triage',
                description: 'Recognize floods, no heat, lockouts, and safety issues; escalate immediately under building protocols.',
              },
              {
                title: 'Rent and portal questions',
                description: 'Answer approved questions about balances, due dates, and portal access from connected records.',
              },
              {
                title: 'Move-in and move-out scheduling',
                description: 'Book inspections, key pickup, and walkthroughs; send checklists and confirmation messages.',
              },
              {
                title: 'Owner update requests',
                description: 'Collect owner questions and prepare a structured brief for the property manager to respond.',
              },
              {
                title: 'Vendor coordination messages',
                description: 'Confirm contractor arrival windows and site access details with a clean summary for staff.',
              },
              {
                title: 'After-hours resident coverage',
                description: 'Handle overnight requests, resolve approved FAQs, and notify on-call staff for true emergencies.',
              },
              {
                title: 'Complaint escalation',
                description: 'Detect frustration early and route sensitive resident or owner issues to a human with full context.',
              },
            ],
          },
        ],
        startTitle: 'Strongest place to begin',
        startLead: 'Start where missed leads and after-hours maintenance calls cost revenue and reputation.',
        startWith: [
          '24/7 lead and resident intake',
          'Showing and inspection booking',
          'Maintenance triage and work-order capture',
          'Emergency escalation rules',
          'Agent and manager handoff summaries',
        ],
        boundaryTitle: 'Clear limits build trust',
        boundaryLead:
          'An AI Employee coordinates inquiries and service requests—it does not negotiate deals, give investment advice, or authorize unsafe access.',
        boundaries: [
          'Offers, pricing concessions, lease exceptions, and legal notices stay with licensed agents or property managers.',
          'Life-safety and building emergencies follow approved scripts and escalate immediately to on-call humans.',
          'Without deep CRM or property-software write access, it still delivers value as the front door: answer every inquiry, book appointments, capture complete requests, and hand staff a usable summary.',
        ],
      },
      {
        id: 'veterinary',
        label: 'Veterinary',
        shortLabel: 'Veterinary',
        image: {
          src: '/images/insights/library/building-business-or-demanding-job.webp',
          alt: 'Veterinary front desk for booking, reminders, and care continuity',
        },
        positioning: 'The AI front line for the clinic phone',
        promise:
          'Answer every pet-owner call, book the right visit type, and escalate true emergencies—while clinical judgment stays with your veterinary team.',
        audiences: [
          {
            id: 'vet-front-desk',
            label: 'Client calls & booking',
            lead: 'Owners call while your team is in surgery or with a patient. Keep the desk responsive without interrupting care.',
            uses: [
              {
                title: 'Always-on clinic reception',
                description: 'Answer calls and messages during appointments, lunch, and after hours under your clinic name.',
              },
              {
                title: 'Visit-type booking',
                description: 'Book wellness, sick, dental, surgery consults, and rechecks into the right doctor and room length.',
              },
              {
                title: 'New-client and pet intake',
                description: 'Collect owner details, pet species/age, history highlights, and records-transfer needs before the visit.',
              },
              {
                title: 'Urgent vs routine routing',
                description: 'Recognize poisoning, trauma, breathing trouble, or collapse using approved scripts; escalate immediately.',
              },
              {
                title: 'Hours, location, and services FAQ',
                description: 'Answer parking, species served, and what to bring from approved clinic content only.',
              },
              {
                title: 'Multi-doctor and multi-site routing',
                description: 'Match callers to the right location, veterinarian, and appointment type without bouncing them around.',
              },
              {
                title: 'Referral and records requests',
                description: 'Capture referring-clinic details and document needs; open a clean package for staff follow-up.',
              },
              {
                title: 'Clinical handoff',
                description: 'Send medical questions to your team as a structured callback—never diagnose or prescribe.',
              },
            ],
          },
          {
            id: 'vet-continuity',
            label: 'Reminders & care continuity',
            lead: 'Protect continuity of care and clinic capacity with recalls, confirmations, and waitlist fill.',
            uses: [
              {
                title: 'Confirmations and reminders',
                description: 'Send visit reminders with easy confirm or reschedule options to reduce no-shows.',
              },
              {
                title: 'Vaccine and wellness recalls',
                description: 'Run approved recall outreach for patients due for preventive care.',
              },
              {
                title: 'Waitlist and cancellation fill',
                description: 'Offer freed slots to short-notice waitlist clients under your clinic rules.',
              },
              {
                title: 'Pre-visit instructions',
                description: 'Send fasting, arrival, and form instructions based on appointment type.',
              },
              {
                title: 'Prescription refill intake',
                description: 'Collect refill requests and route approval to a veterinarian; never authorize medication alone.',
              },
              {
                title: 'Boarding and drop-off scheduling',
                description: 'Book boarding or day care where offered and capture feeding or medication notes for staff.',
              },
              {
                title: 'Billing and estimate questions',
                description: 'Explain approved fee ranges and payment options; send complex estimates to the front desk.',
              },
              {
                title: 'Review requests',
                description: 'Ask for service feedback after visits and escalate unhappy responses to a person first.',
              },
            ],
          },
        ],
        startTitle: 'Strongest place to begin',
        startLead: 'Start where missed calls and unfinished preventive care leave chairs empty and emergencies unmanaged.',
        startWith: [
          '24/7 call and message intake',
          'Visit-type booking by doctor and length',
          'Urgent triage with immediate escalation',
          'Reminders, recalls, and waitlist fill',
          'Callback summaries for clinical staff',
        ],
        boundaryTitle: 'Clear limits build trust',
        boundaryLead:
          'An AI Employee is clinic reception and coordination—not a veterinarian. Medical decisions and prescribing stay with licensed professionals.',
        boundaries: [
          'No diagnosis, treatment plans, dosage advice, or euthanasia counseling—those escalate to qualified staff immediately.',
          'Controlled substances, controlled records, and chart changes stay outside unsupervised automation.',
          'Without deep PIMS write access, it still delivers value as the front door: answer every enquiry, book what is allowed, run recalls, and hand your team a usable summary.',
        ],
      },
      {
        id: 'insurance-brokerage',
        label: 'Insurance Brokerages',
        shortLabel: 'Insurance',
        image: {
          src: '/images/insights/library/should-you-say-yes-to-this-opportunity.webp',
          alt: 'Insurance brokerage intake for quoting and claims routing',
        },
        positioning: 'The AI front line for the brokerage desk',
        promise:
          'Qualify new risks, book advisor time, answer routine policy questions from approved scripts, and route claims—without giving unlicensed advice.',
        audiences: [
          {
            id: 'insurance-intake',
            label: 'New business & quoting',
            lead: 'Canadian brokerages win on responsiveness. Capture every inquiry while advisors are in meetings or after hours.',
            uses: [
              {
                title: 'Always-on brokerage reception',
                description: 'Answer calls and messages for personal and commercial lines under your brokerage brand.',
              },
              {
                title: 'Line-of-business qualification',
                description: 'Identify auto, home, commercial, life, or benefits needs and route to the right licensed advisor.',
              },
              {
                title: 'Quote intake',
                description: 'Collect risk basics, renewal dates, and document needs; create a structured package for quoting.',
              },
              {
                title: 'Appointment booking',
                description: 'Book discovery and renewal reviews into advisor calendars with confirmations and prep checklists.',
              },
              {
                title: 'Certificate and proof requests',
                description: 'Handle routine certificate of insurance requests from approved workflows and connected records.',
              },
              {
                title: 'Referral partner intake',
                description: 'Capture mortgage, realtor, and lender referrals with clean handoff notes for advisors.',
              },
              {
                title: 'Lead follow-up',
                description: 'Re-engage incomplete quote requests before renewal windows close.',
              },
              {
                title: 'Urgent binding alerts',
                description: 'Escalate same-day coverage needs and cancellation risks to a licensed person immediately.',
              },
            ],
          },
          {
            id: 'insurance-service',
            label: 'Service & claims routing',
            lead: 'Keep policyholders informed and claims moving while licensed staff handle advice and negotiation.',
            uses: [
              {
                title: 'Policy status FAQ',
                description: 'Answer approved questions about renewals, billing, and document requests from connected records.',
              },
              {
                title: 'Endorsement change intake',
                description: 'Capture vehicle, driver, address, or coverage-change details for advisor review before binding.',
              },
              {
                title: 'Claims first notice',
                description: 'Collect incident basics, date, location, and contacts; open a claim intake and escalate per your rules.',
              },
              {
                title: 'Document chase for underwriting',
                description: 'Request photos, appraisals, loss runs, and applications; track what is still outstanding.',
              },
              {
                title: 'Renewal reminder outreach',
                description: 'Notify clients of upcoming renewals and book review calls before market deadlines.',
              },
              {
                title: 'After-hours client coverage',
                description: 'Handle overnight inquiries, resolve approved FAQs, and notify on-call staff for urgent losses.',
              },
              {
                title: 'Complaint and escalation cues',
                description: 'Detect frustration early and move sensitive issues to a licensed advisor with full context.',
              },
              {
                title: 'Conversation summaries',
                description: 'Attach intake and service summaries to the client file for the next advisor touch.',
              },
            ],
          },
        ],
        startTitle: 'Strongest place to begin',
        startLead: 'Start with inquiry capture and claims intake where speed and clean handoffs protect revenue and trust.',
        startWith: [
          '24/7 inquiry answering and qualification',
          'Quote intake packages for advisors',
          'Appointment booking for reviews',
          'First-notice claims routing',
          'Conversation summaries on the client file',
        ],
        boundaryTitle: 'Clear limits build trust',
        boundaryLead:
          'An AI Employee supports brokerage operations—it does not provide insurance advice or bind coverage on its own.',
        boundaries: [
          'Coverage recommendations, binding, cancellations, and claim negotiations stay with licensed advisors.',
          'Sensitive underwriting and claim details follow your approved scripts, consent, and storage rules only.',
          'Without deep AMS write access, it still delivers value as the front door: answer every inquiry, capture complete intake, book reviews, and hand advisors a usable summary.',
        ],
      },
      {
        id: 'immigration-settlement',
        label: 'Immigration & Settlement',
        shortLabel: 'Immigration',
        image: {
          src: '/images/insights/library/structured-data-for-small-business.webp',
          alt: 'Immigration and settlement enquiry intake and file readiness',
        },
        positioning: 'The AI front line for high-volume immigration inquiries',
        promise:
          'Answer every enquiry in the languages you support, capture case basics, book consultations, and chase documents—without giving immigration advice.',
        audiences: [
          {
            id: 'immigration-intake',
            label: 'Enquiry intake & consultations',
            lead: 'Canadian immigration and settlement desks face constant enquiry volume. Respond fast, qualify clearly, and protect advisor time.',
            uses: [
              {
                title: 'Always-on enquiry response',
                description: 'Answer calls, forms, and messages after hours and during peak campaign periods under your organization name.',
              },
              {
                title: 'Program-fit screening',
                description: 'Ask approved screening questions to see whether the enquiry matches services you actually provide.',
              },
              {
                title: 'Consultation booking',
                description: 'Book paid or intake consultations into the right advisor calendar with confirmations and prep instructions.',
              },
              {
                title: 'Document checklist start',
                description: 'Share approved starter checklists by matter type and confirm what the client already has.',
              },
              {
                title: 'Language and location routing',
                description: 'Match callers to EN/FR or other supported language capacity and the correct office or advisor.',
              },
              {
                title: 'Urgency triage',
                description: 'Flag deadline-driven renewals, removals risk, or travel constraints for immediate human review.',
              },
              {
                title: 'Fees and process FAQ',
                description: 'Explain approved fee schedules and high-level process steps from your content—never case advice.',
              },
              {
                title: 'Incomplete-lead follow-up',
                description: 'Re-engage enquiries that stopped mid-intake before the consultation window is lost.',
              },
            ],
          },
          {
            id: 'immigration-file-ops',
            label: 'File readiness & client updates',
            lead: 'Keep files moving with structured document chase and non-advice status updates.',
            uses: [
              {
                title: 'Missing-document chase',
                description: 'Request outstanding forms and evidence with clear lists; log each client response to the file.',
              },
              {
                title: 'Appointment and biometrics reminders',
                description: 'Send reminders for consults, biometrics, or document drop-offs under your approved wording.',
              },
              {
                title: 'Status without advice',
                description: 'Share approved “received / in review / waiting on client / with advisor” updates only.',
              },
              {
                title: 'Settlement service routing',
                description: 'Direct callers to housing, language, employment, or community partners using your approved referral list.',
              },
              {
                title: 'Translator and accessibility notes',
                description: 'Capture language and accessibility needs so the next human meeting is prepared.',
              },
              {
                title: 'Payment and retainer questions',
                description: 'Answer approved billing questions from connected records; escalate disputes to staff.',
              },
              {
                title: 'After-hours coverage',
                description: 'Handle overnight enquiries, resolve approved FAQs, and escalate true urgencies to on-call advisors.',
              },
              {
                title: 'Advisor handoff summaries',
                description: 'Deliver a complete enquiry and document summary before the consultation starts.',
              },
            ],
          },
        ],
        startTitle: 'Strongest place to begin',
        startLead: 'Start where enquiry volume and missing documents slow licensed advisors the most.',
        startWith: [
          '24/7 enquiry answering and screening',
          'Consultation booking with prep instructions',
          'Document checklist and missing-info chase',
          'Urgent deadline escalation',
          'Advisor handoff summaries',
        ],
        boundaryTitle: 'Clear limits build trust',
        boundaryLead:
          'An AI Employee coordinates enquiries and file readiness—it does not provide immigration advice or represent clients.',
        boundaries: [
          'No eligibility decisions, application strategy, or representations to government—those stay with authorized representatives.',
          'Identity documents and sensitive personal data follow your approved intake, consent, and retention rules only.',
          'Without deep case-management write access, it still delivers value as the front door: answer every enquiry, book consults, chase documents, and hand advisors a usable summary.',
        ],
      },
      {
        id: 'home-care-seniors',
        label: 'Home Care & Seniors',
        shortLabel: 'Home care',
        image: {
          src: '/images/insights/library/can-business-operate-two-weeks-without-you.webp',
          alt: 'Home care intake for family assessments and scheduling updates',
        },
        positioning: 'The AI front line for families and care coordination',
        promise:
          'Answer family inquiries, book assessments, coordinate visit changes, and escalate urgent client needs—with dignity and clear human handoff.',
        audiences: [
          {
            id: 'home-care-intake',
            label: 'Family intake & assessments',
            lead: 'Families often call in stress, after hours, or while comparing providers. Respond quickly and capture the right details.',
            uses: [
              {
                title: 'Always-on family reception',
                description: 'Answer calls and messages evenings and weekends when families are researching care options.',
              },
              {
                title: 'Service-fit qualification',
                description: 'Identify personal care, nursing, companionship, respite, or specialized needs against services you offer.',
              },
              {
                title: 'Assessment booking',
                description: 'Book in-home or virtual assessments with the right care coordinator and send prep instructions.',
              },
              {
                title: 'Care-profile intake',
                description: 'Collect mobility, medication support needs, schedule preferences, and household access details for staff review.',
              },
              {
                title: 'Funding and coverage FAQ',
                description: 'Explain approved private-pay, insurer, or program basics from your content—not personalized funding advice.',
              },
              {
                title: 'Urgent coverage requests',
                description: 'Flag hospital discharge, caregiver burnout, or same-week start needs for immediate coordinator review.',
              },
              {
                title: 'Multi-site and language routing',
                description: 'Match families to the right branch, language capacity, and service specialty.',
              },
              {
                title: 'Coordinator handoff summaries',
                description: 'Deliver a complete family and client summary before the first assessment call.',
              },
            ],
          },
          {
            id: 'home-care-ops',
            label: 'Scheduling & family updates',
            lead: 'Keep visits reliable and families informed without pulling nurses or coordinators off the road.',
            uses: [
              {
                title: 'Visit confirmation and reminders',
                description: 'Confirm upcoming visits with clients and families; capture simple schedule-change requests.',
              },
              {
                title: 'Caregiver absence backfill intake',
                description: 'Log call-outs and gather shift details so coordinators can reassign quickly.',
              },
              {
                title: 'Family status updates',
                description: 'Share approved non-clinical updates and collect questions for the care team to answer.',
              },
              {
                title: 'Medication and clinical escalation',
                description: 'Capture concerns and escalate to nursing or on-call clinicians—never give medical advice.',
              },
              {
                title: 'Safety and fall reports',
                description: 'Collect minimum facts, give approved immediate steps, and escalate to humans right away.',
              },
              {
                title: 'Billing and schedule questions',
                description: 'Answer approved invoice and visit-frequency questions from connected records.',
              },
              {
                title: 'After-hours on-call triage',
                description: 'Resolve approved FAQs overnight and notify on-call staff when urgency thresholds are met.',
              },
              {
                title: 'Shift handoff briefs',
                description: 'Summarize open schedule gaps, family concerns, and escalations for the next coordinator.',
              },
            ],
          },
        ],
        startTitle: 'Strongest place to begin',
        startLead: 'Start where after-hours family calls and visit changes create the most missed revenue and risk.',
        startWith: [
          '24/7 family enquiry answering',
          'Assessment booking and care-profile intake',
          'Visit confirmations and change requests',
          'Urgent clinical and safety escalation',
          'Coordinator handoff summaries',
        ],
        boundaryTitle: 'Clear limits build trust',
        boundaryLead:
          'An AI Employee coordinates intake and scheduling—it does not provide clinical care advice or replace regulated health professionals.',
        boundaries: [
          'No medical advice, care-plan changes, or medication decisions—those escalate to qualified clinicians.',
          'Sensitive health and family information follows your consent, privacy, and retention rules only.',
          'Without deep scheduling-system write access, it still delivers value as the front door: answer every enquiry, book assessments, capture complete details, and hand coordinators a usable summary.',
        ],
      },
      {
        id: 'municipal-public',
        label: 'Municipal & Public Service',
        shortLabel: 'Municipal',
        image: {
          src: '/images/insights/library/turn-custom-service-into-repeatable-offer.webp',
          alt: 'Municipal and public service desk for resident requests and counter support',
        },
        positioning: 'The AI front line for resident service desks',
        promise:
          'Answer routine resident questions, take service requests, book appointments, and route complex matters to the right department—with a complete summary.',
        audiences: [
          {
            id: 'municipal-residents',
            label: 'Resident inquiries & requests',
            lead: 'Canadian municipalities field high volumes of repetitive questions. Give residents fast answers and clean request intake.',
            uses: [
              {
                title: 'Always-on resident reception',
                description: 'Answer calls and messages after counter hours and during seasonal peaks under the municipality brand.',
              },
              {
                title: 'Service information FAQ',
                description: 'Share approved hours, locations, fees, recycling rules, permit basics, and program details from official content.',
              },
              {
                title: 'Service request intake',
                description: 'Capture bylaw, roads, parks, water, and facilities issues with location, photos, and contact details.',
              },
              {
                title: 'Appointment booking',
                description: 'Book counter visits, inspections, or consultations into approved department calendars.',
              },
              {
                title: 'Application and document guidance',
                description: 'Tell residents which forms and proofs to bring; confirm completeness before they arrive.',
              },
              {
                title: 'Bilingual routing',
                description: 'Serve EN/FR callers according to your language commitments and route to capable staff when needed.',
              },
              {
                title: 'Outage and disruption notices',
                description: 'Share approved status for water, road, or facility disruptions and reduce duplicate calls.',
              },
              {
                title: 'Department handoff',
                description: 'Escalate complex, legal, or sensitive matters to the right team with a complete resident summary.',
              },
            ],
          },
          {
            id: 'municipal-ops',
            label: 'Operations & counter support',
            lead: 'Help staff clear queues with structured intake and fewer repeat explanations of the same policy.',
            uses: [
              {
                title: 'Request triage and priority',
                description: 'Classify routine vs urgent requests using approved criteria before work reaches field crews.',
              },
              {
                title: 'Status follow-ups',
                description: 'Provide approved progress language on open requests and collect additional details when needed.',
              },
              {
                title: 'Inspection scheduling support',
                description: 'Coordinate preferred windows and site access notes for inspectors and residents.',
              },
              {
                title: 'Payment and account questions',
                description: 'Answer approved tax, utility, or fee questions from connected records; escalate disputes.',
              },
              {
                title: 'Event and program registration',
                description: 'Help residents register for approved programs or waitlists when capacity rules allow.',
              },
              {
                title: 'After-hours emergency routing',
                description: 'Capture after-hours incidents and notify on-call operations when thresholds are met.',
              },
              {
                title: 'Accessibility and special-needs notes',
                description: 'Record access requirements so counter and field staff are prepared for the interaction.',
              },
              {
                title: 'Shift and counter handoff briefs',
                description: 'Summarize open high-priority requests and unfinished counter items for the next team.',
              },
            ],
          },
        ],
        startTitle: 'Strongest place to begin',
        startLead: 'Start with high-volume FAQ deflection and clean service-request intake before deeper system writes.',
        startWith: [
          '24/7 resident inquiry answering from approved content',
          'Service request intake with location and photos',
          'Appointment booking for counters and inspections',
          'Outage and disruption status messages',
          'Department handoff summaries',
        ],
        boundaryTitle: 'Clear limits build trust',
        boundaryLead:
          'An AI Employee is a resident service front door—not a decision-maker for bylaw enforcement, benefits, or legal determinations.',
        boundaries: [
          'No enforcement decisions, confidential record releases, or exceptions to bylaw or tax rules without authorized staff.',
          'Personal and property data follow municipal privacy rules; you define what may be collected, retained, and shared.',
          'Without deep 311 or ERP write access, it still delivers value as the front door: answer routine questions, capture complete requests, book appointments, and hand departments a usable summary.',
        ],
      },
    ],
    faqTitle: 'Questions leaders ask first',
    faqs: [
      {
        question: 'Is this the same as ROALLA Agentic?',
        answer:
          'No. An AI Employee is the conversational front line—answer, qualify, book, document, and hand off. ROALLA Agentic covers governed multi-step agents that act across systems when that operating model is ready.',
      },
      {
        question: 'Will this replace our technicians or office staff?',
        answer:
          'It takes routine intake, booking, and follow-up so skilled people spend more time on jobs, care, estimates, and customer relationships. People keep judgment, approvals, and high-risk decisions.',
      },
      {
        question: 'Do we need every system integrated on day one?',
        answer:
          'No. Many teams start with answering, qualification, scheduling, and clear handoff notes. Deeper actions wait until dispatch, practice systems, identity, permissions, and audit requirements are clear.',
      },
      {
        question: 'Is this tied to one vendor product?',
        answer:
          'ROALLA frames requirements in vendor-neutral terms first. You decide fit, boundaries, and measures before comparing platforms.',
      },
    ],
    finalTitle: 'See if an AI Employee fits your front line.',
    finalLead: 'Use the short fit review, or tell us how requests reach your team today. We will help you define channels, skills, knowledge, integrations, and handoff rules.',
    finalPrimaryCta: 'Check AI Employee fit',
    finalSecondaryCta: 'Discuss your use case',
    distinctTitle: 'Need agents that act across systems?',
    distinctBody: 'When the work needs multi-step automation with approvals and tools, explore ROALLA Agentic.',
    distinctLinkLabel: 'Explore ROALLA Agentic',
    relatedTitle: 'Related outcomes on ROALLA',
    relatedLead: 'AI Employee sits with frontline experience and governed automation. Start from the outcome that matches your pressure.',
    relatedLinks: [
      {
        groupId: 'automation-ai',
        label: 'Automate work & apply AI responsibly',
        description: 'Capacity, peak coverage, and controlled automation—including AI Employee as a frontline option.',
        image: {
          src: '/images/insights/library/what-to-automate-first.webp',
          alt: 'Automation and AI outcomes including AI Employee as a frontline option',
        },
      },
      {
        groupId: 'experience-products',
        label: 'Improve customer and team experience',
        description: 'Communications, frontline channels, and digital experiences where an AI Employee often starts.',
        image: {
          src: '/images/insights/library/analog-to-ip-business-telephony.webp',
          alt: 'Customer experience and communications pathways for frontline AI',
        },
      },
    ],
  },
  fr: {
    metadataTitle: 'Employé IA par industrie | ROALLA',
    metadataDescription:
      'Un employé IA qui répond aux demandes, résout le travail courant et transfère avec tout le contexte—pour les TI, les métiers, la logistique, les entrepôts, la fabrication, les cliniques de soins, le juridique, la comptabilité, l’immobilier, la médecine vétérinaire, l’assurance, l’immigration, les soins à domicile et les services publics.',
    brandName: 'ROALLA',
    eyebrow: 'Employé IA',
    title: 'Une première ligne IA pour votre entreprise—toujours disponible, claire et prête à transférer.',
    lead: 'Répondez à chaque demande, résolvez ce qui est approuvé et envoyez le travail complexe à la bonne personne avec tout le contexte. Explorez les modèles par industrie pour les entreprises de services et d’opérations au Canada—puis élargissez une fois la preuve faite.',
    primaryCta: 'Vérifier l’adéquation d’un employé IA',
    secondaryCta: 'Parler avec ROALLA',
    heroImage: {
      src: '/images/insights/library/practical-ai-use-cases.webp',
      alt: 'Employé IA de première ligne qui traite les demandes avec un relais humain clair',
    },
    industrySelectHint: 'Choisissez une industrie pour voir les modèles d’adéquation.',
    audienceSelectHint: 'Choisissez qui l’employé IA soutient en premier.',
    selectedLabel: 'Sélectionné',
    howEyebrow: 'Comment ça fonctionne',
    howTitle: 'Comprendre. Résoudre. Documenter. Escalader.',
    howLead:
      'Un employé IA n’est pas un clavardage ajouté à votre réception. C’est une première ligne gouvernée qui suit vos politiques, connaissances et règles de transfert.',
    howSteps: [
      {
        title: 'Comprendre la demande',
        description: 'Identifier qui a besoin d’aide, ce qui est requis, l’urgence et ce qui a déjà été tenté.',
        image: {
          src: '/images/insights/library/analog-to-ip-business-telephony.webp',
          alt: 'Comprendre les demandes entrantes sur les canaux téléphone et numériques',
        },
      },
      {
        title: 'Utiliser des connaissances approuvées',
        description: 'Répondre à partir de vos règles de service, catalogues, scripts et notes de problèmes connus—pas de conseils génériques.',
        image: {
          src: '/images/insights/library/five-rules-before-team-uses-ai.webp',
          alt: 'Connaissances et règles approuvées qui guident les réponses de l’employé IA',
        },
      },
      {
        title: 'Compléter le travail courant',
        description: 'Créer des dossiers, classer la priorité, communiquer le statut, réserver des rendez-vous et mettre à jour les systèmes lorsque c’est approuvé.',
        image: {
          src: '/images/insights/library/what-to-automate-first.webp',
          alt: 'Compléter le travail de première ligne répétable avec une responsabilité claire',
        },
      },
      {
        title: 'Escalader avec contexte',
        description: 'Quand le jugement, la sécurité, une exception de prix ou le risque interviennent, une personne reçoit un résumé complet—pas un message vide.',
        image: {
          src: '/images/insights/library/hire-or-fix-the-work-first.webp',
          alt: 'Transférer le travail complexe à une personne avec tout le contexte',
        },
      },
    ],
    industriesEyebrow: 'Cas d’usage par industrie',
    industriesTitle: 'Où un employé IA crée de la valeur',
    industriesLead:
      'Chaque industrie a ses demandes, règles et risques. Nous commençons là où le volume est élevé et les limites sont claires.',
    industries: [
      {
        id: 'it-msp',
        label: 'TI et services gérés',
        shortLabel: 'TI / MSP',
        image: {
          src: '/images/insights/library/it-provider-who-owns-risk.webp',
          alt: 'Première ligne TI et services gérés pour billets et couverture hors heures',
        },
        positioning: 'La première ligne IA du soutien TI',
        promise:
          'Répondre à chaque demande, résoudre les problèmes courants et acheminer les incidents complexes au bon technicien avec tout le contexte.',
        audiences: [
          {
            id: 'internal-it',
            label: 'Centre de service TI interne',
            lead: 'Offrez une première réponse en secondes—et des billets déjà clairs pour les techniciens.',
            uses: [
              {
                title: 'Accueil 24/7',
                description: 'Répondre aussitôt aux appels et clavardages, identifier la personne et le problème, recueillir les détails de l’appareil et ouvrir un billet.',
              },
              {
                title: 'Dépannage de niveau 1',
                description: 'Guider les employés dans les correctifs approuvés pour le Wi-Fi, le VPN, les imprimantes, le courriel, l’audio, les logiciels et la performance.',
              },
              {
                title: 'Aide mot de passe et MFA',
                description: 'Expliquer les étapes de réinitialisation approuvées, recueillir les vérifications requises et envoyer les exceptions à l’équipe d’identité.',
              },
              {
                title: 'Tri et acheminement',
                description: 'Définir catégorie, urgence et impact; assigner le réseau, les applications, la sécurité ou le soutien des postes.',
              },
              {
                title: 'Communications d’incident',
                description: 'Reconnaître les incidents déjà en cours, communiquer le statut approuvé et réduire les billets en double.',
              },
              {
                title: 'Demandes d’accès et de logiciels',
                description: 'Recueillir l’application, le rôle, le gestionnaire, la raison et la date requise—ou expliquer le catalogue et les règles de licences.',
              },
              {
                title: 'Intégration et départ',
                description: 'Recueillir le matériel et les accès pour les nouveaux; saisir les détails de départ et lancer la liste de contrôle approuvée. L’approbation humaine reste obligatoire pour les changements d’accès.',
              },
              {
                title: 'Planification et documentation',
                description: 'Réserver le soutien au bureau ou la récupération d’appareil, résumer l’échange et extraire les prochaines actions pour le technicien.',
              },
            ],
          },
          {
            id: 'msp-clients',
            label: 'Centre de service MSP pour clients',
            lead: 'Servez vos clients sous votre marque avec leurs règles—tout en protégeant les heures hors bureau et le temps des techniciens.',
            uses: [
              {
                title: 'Centre de service client',
                description: 'Demander l’entreprise, le site et l’utilisateur touchés; saisir l’impact et les erreurs; créer un billet structuré pour la bonne équipe.',
              },
              {
                title: 'Soutien hors des heures',
                description: 'Résoudre les questions courantes approuvées, recueillir un diagnostic complet, escalader les vraies urgences et planifier le reste pour le prochain jour ouvrable.',
              },
              {
                title: 'Priorisation des incidents',
                description: 'Distinguer une imprimante d’un verrouillage exécutif, d’une panne de site ou d’un compte potentiellement compromis.',
              },
              {
                title: 'Déviation des problèmes connus',
                description: 'Quand plusieurs clients frappent la même panne, partager le statut approuvé, rattacher les appels à l’incident maître et éviter les doublons isolés.',
              },
              {
                title: 'Connaissances propres au client',
                description: 'Répondre selon les applications, heures, normes d’appareils, droits et contacts d’escalade de chaque client—pas des conseils grand public.',
              },
              {
                title: 'Déploiement de techniciens',
                description: 'Confirmer les tentatives à distance, l’accès au site et le contact; réserver le travail sur place; envoyer les confirmations et gérer les reports.',
              },
              {
                title: 'Accueil d’événements de sécurité',
                description: 'Recueillir le minimum de faits pour un lien suspect, un MFA inattendu, un appareil perdu ou une boîte compromise—puis escalader aussitôt avec les consignes de confinement approuvées.',
              },
              {
                title: 'Ventes et suivi de compte',
                description: 'Qualifier de nouveaux prospects, planifier une découverte ou un bilan trimestriel, répondre aux questions de couverture courantes et envoyer les exceptions contractuelles au chargé de compte.',
              },
            ],
          },
        ],
        startTitle: 'Le meilleur point de départ',
        startLead: 'Commencez par un volume élevé, des règles claires et un risque faible. Prouvez la valeur avant d’élargir.',
        startWith: [
          'Accueil 24/7 par appel et clavardage',
          'Classification et acheminement des billets',
          'Dépannage de niveau 1 approuvé',
          'Communication des pannes connues',
          'Planification des techniciens et résumés de conversation',
        ],
        boundaryTitle: 'Des limites claires créent la confiance',
        boundaryLead:
          'Un employé IA ne doit pas être présenté comme un administrateur TI sans supervision. Les actions à risque exigent des intégrations, des vérifications d’identité, des permissions, des approbations et des pistes d’audit.',
        boundaries: [
          'Réinitialisations d’identifiants, changements d’accès, déploiement de logiciels, isolation d’appareils et clôture d’incidents de sécurité restent sous contrôle humain sauf intégrations étroitement gouvernées.',
          'Sans ces connexions, il demeure utile comme porte d’entrée intelligente : recueillir les faits, répondre à partir de connaissances approuvées, ouvrir des billets structurés, communiquer le statut, planifier le travail et transmettre un résumé complet.',
          'Les signalements de sécurité doivent recueillir seulement le nécessaire, donner les étapes de confinement approuvées et escalader—jamais décider seuls qu’un compromis est « sans danger ».',
        ],
      },
      {
        id: 'trades-field',
        label: 'Métiers et services sur le terrain',
        shortLabel: 'Métiers',
        image: {
          src: '/images/insights/library/trade-show-leads-after-qr-scan.webp',
          alt: 'Accueil métiers et services sur le terrain pour appels, réservations et suivi',
        },
        positioning: 'La première ligne IA du téléphone de l’atelier',
        promise:
          'Répondre à chaque appel et message, qualifier le travail, réserver les interventions courantes et acheminer les vraies urgences au bon technicien—avec les détails déjà saisis.',
        audiences: [
          {
            id: 'customer-intake',
            label: 'Appels clients et réservations',
            lead: 'Arrêtez de perdre des jobs dans la messagerie pendant que les équipes sont sur place. Offrez une première réponse claire—jour, soir et week-end.',
            uses: [
              {
                title: 'Accueil sans appel manqué',
                description: 'Répondre aux appels, textos et clavardages sous votre marque; saisir le nom, le numéro de rappel, l’adresse et ce qui doit être réparé.',
              },
              {
                title: 'Triage des urgences',
                description: 'Repérer fuites actives, absence de chauffage, odeur de gaz, étincelles ou inondation; donner les consignes de sécurité approuvées et alerter le technicien de garde.',
              },
              {
                title: 'Qualification du travail',
                description: 'Distinguer réparation, installation et entretien; recueillir le type d’équipement, l’âge, les symptômes, l’accès et les préférences d’horaire.',
              },
              {
                title: 'Réservation en direct',
                description: 'Réserver dans les plages approuvées avec buffers de déplacement, zones de service et compétences—puis envoyer la confirmation au client.',
              },
              {
                title: 'Vérification de zone et d’admissibilité',
                description: 'Confirmer que vous couvrez le lieu, que le travail correspond à vos offres et si une adhésion ou une garantie s’applique.',
              },
              {
                title: 'Indication de prix approximatif',
                description: 'Communiquer les frais de diagnostic approuvés, les tarifs hors heures et les fourchettes courantes; envoyer les exceptions et les gros projets à une personne.',
              },
              {
                title: 'Gestion des pics après tempête',
                description: 'Prendre plusieurs appels à la fois après un événement météo, recueillir les détails des dommages et garder la file ordonnée sans musique d’attente.',
              },
              {
                title: 'Transfert au déploiement',
                description: 'Créer un job structuré avec adresse, urgence, notes et photos demandées—pour que le camion parte avec du contexte, pas des approximations.',
              },
            ],
          },
          {
            id: 'job-follow-through',
            label: 'Suivi de bureau',
            lead: 'Gardez l’horaire rempli et la paperasse en mouvement après le premier appel—sans sortir un technicien d’un chantier pour courir après les détails.',
            uses: [
              {
                title: 'Rappels et reports',
                description: 'Envoyer des rappels de rendez-vous, recueillir les mises à jour « en route » et gérer les reports simples selon vos règles.',
              },
              {
                title: 'Relance de soumissions',
                description: 'Appeler ou écrire pour les estimations ouvertes, répondre aux questions courantes et réserver le travail quand le client est prêt.',
              },
              {
                title: 'Adhésions et plans d’entretien',
                description: 'Expliquer les visites incluses, les renouvellements et les mises au point saisonnières; planifier ce travail dans les créneaux plus calmes.',
              },
              {
                title: 'Mises à jour pièces et arrivée',
                description: 'Communiquer le statut approuvé quand des pièces sont commandées ou qu’une visite de retour est nécessaire; escalader tôt les clients frustrés.',
              },
              {
                title: 'Relances de facture et paiement',
                description: 'Répondre à « à quoi correspond ce frais? » à partir des dossiers connectés et envoyer des rappels de paiement polis pour les factures en retard.',
              },
              {
                title: 'Demandes d’avis et réputation',
                description: 'Demander un avis après les jobs terminés et signaler un retour négatif à une personne avant qu’il ne devienne une plainte publique.',
              },
              {
                title: 'Accueil garantie et fournisseurs',
                description: 'Recueillir numéros de modèle, dates d’achat et détails de réclamation pour les travaux sous garantie; renvoyer les dossiers incomplets pour les infos manquantes.',
              },
              {
                title: 'Messages de coordination d’équipe',
                description: 'Confirmer l’accès au site, le stationnement, les codes de boîte à clés et qui sera à la maison—puis aviser le technicien assigné avec un résumé clair.',
              },
            ],
          },
        ],
        startTitle: 'Le meilleur point de départ',
        startLead: 'Commencez là où les appels manqués coûtent du revenu réel et où les règles sont faciles à écrire.',
        startWith: [
          'Accueil 24/7 par appel et message',
          'Triage urgence vs routine',
          'Réservation selon la disponibilité en direct',
          'Détails de job structurés pour le déploiement',
          'Rappels, relance de soumissions et résumés de conversation',
        ],
        boundaryTitle: 'Des limites claires créent la confiance',
        boundaryLead:
          'Un employé IA ne doit pas inventer des prix, envoyer un camion sans vos règles, ni donner des consignes de sécurité hors de ce que vous approuvez. Les moments à haut risque exigent des personnes et des protocoles clairs.',
        boundaries: [
          'Les vraies urgences, odeurs de gaz, risques d’incendie électrique et situations de sécurité des personnes suivent vos scripts approuvés et escaladent vers des humains—jamais « clôturer » seules.',
          'Le prix final des installations complexes, des portées d’assurance et des exceptions de contrat reste à un estimateur ou au propriétaire sauf grilles tarifaires et approbations étroitement gouvernées.',
          'Sans connexions profondes aux logiciels de terrain, il gagne quand même comme porte d’entrée : répondre à chaque demande, qualifier le travail, réserver ce qui est permis, saisir des détails complets et transmettre un résumé utilisable aux équipes.',
        ],
      },
      {
        id: 'transportation-logistics',
        label: 'Transport et logistique',
        shortLabel: 'Logistique',
        image: {
          src: '/images/insights/library/smb-digital-efficiency.webp',
          alt: 'Bureau transport et logistique pour questions expéditeurs et transfert à la répartition',
        },
        positioning: 'La première ligne IA de la coordination fret et flotte',
        promise:
          'Répondre aux questions d’expédition, saisir les nouveaux mouvements, suivre les exceptions et donner aux répartiteurs les bons détails avant qu’un chargement soit en retard.',
        audiences: [
          {
            id: 'shipper-customer',
            label: 'Service expéditeurs et clients',
            lead: 'Donnez aux clients des réponses rapides sur le statut, la réservation et les documents—sans sortir les planificateurs du tableau.',
            uses: [
              {
                title: 'Accueil où-est-mon-envoi',
                description: 'Identifier le chargement, communiquer le statut approuvé et recueillir les numéros de référence manquants avant d’escalader.',
              },
              {
                title: 'Nouvelles demandes d’expédition et de prix',
                description: 'Saisir origine, destination, détails du fret, fenêtres et exigences spéciales; créer une demande structurée pour revue tarifaire.',
              },
              {
                title: 'Changements de rendez-vous et de livraison',
                description: 'Enregistrer les changements de ramassage ou de livraison demandés, vérifier les contraintes connues et acheminer les exceptions à un planificateur.',
              },
              {
                title: 'Relance de documents',
                description: 'Demander connaissements, preuves de livraison, documents douaniers et photos; confirmer ce qui est reçu et signaler ce qui manque.',
              },
              {
                title: 'Avis de retard et d’exception',
                description: 'Envoyer les messages de retard approuvés, recueillir l’impact et ouvrir une tâche de rétablissement quand un jalon est manqué.',
              },
              {
                title: 'Accueil des réclamations',
                description: 'Recueillir les faits de dommage ou de manque, photos et références; ouvrir un dossier de réclamation et le transmettre avec tout le contexte.',
              },
              {
                title: 'Rappels transporteurs et courtiers',
                description: 'Répondre aux vérifications courantes de disponibilité ou de statut selon vos règles et escalader les litiges de tarif ou de contrat.',
              },
              {
                title: 'Questions de facture et d’accessoires',
                description: 'Expliquer les frais approuvés à partir des dossiers connectés et envoyer les litiges ou lignes floues à la facturation.',
              },
            ],
          },
          {
            id: 'dispatch-ops',
            label: 'Répartition et opérations',
            lead: 'Aidez le bureau à comparer les options, tenir les conducteurs informés et n’escalader que les chargements qui exigent un jugement humain.',
            uses: [
              {
                title: 'Accueil des offres de charge',
                description: 'Saisir les détails de l’offre, les besoins d’équipement et les échéances; résumer l’adéquation avec la capacité connue pour revue du répartiteur.',
              },
              {
                title: 'Appels de suivi conducteur',
                description: 'Recueillir position, ETA, temps d’attente et problèmes selon un script standard; mettre à jour le dossier et alerter la répartition si le risque monte.',
              },
              {
                title: 'Vérification des heures et de l’admissibilité',
                description: 'Poser les questions de qualification approuvées et signaler les conflits d’heures, d’endossements ou d’équipement avant l’affectation.',
              },
              {
                title: 'Journalisation de détention et d’attente',
                description: 'Enregistrer arrivée, enregistrement et libération avec codes de raison pour que la facturation et la planification aient des preuves claires.',
              },
              {
                title: 'Coordination de relève et de rétablissement',
                description: 'En cas de panne ou de fenêtre manquée, recueillir les faits, aviser les parties avec le libellé approuvé et ouvrir le plan de rétablissement.',
              },
              {
                title: 'Suggestions de retour et de km à vide',
                description: 'Faire ressortir les occasions proches qui correspondent à l’équipement et aux fenêtres; laisser l’acceptation à la répartition.',
              },
              {
                title: 'Statut cour et barrière',
                description: 'Confirmer numéros de remorque, statut des scellés et préparation à l’entrée; acheminer les barrières bloquées ou papiers manquants à un superviseur.',
              },
              {
                title: 'Résumés de relève de quart',
                description: 'Résumer les exceptions ouvertes, rendez-vous en attente et problèmes conducteurs pour que le prochain bureau démarre avec du contexte.',
              },
            ],
          },
        ],
        startTitle: 'Le meilleur point de départ',
        startLead: 'Commencez par les questions à fort volume et un accueil d’exceptions propre avant toute réaffectation autonome.',
        startWith: [
          'Réponses de statut d’expédition et WISMO',
          'Accueil des nouvelles charges et demandes de prix',
          'Avis de retard et d’exception',
          'Appels de suivi conducteur et mises à jour d’ETA',
          'Réclamations et relance documentaire avec résumés',
        ],
        boundaryTitle: 'Des limites claires créent la confiance',
        boundaryLead:
          'Un employé IA ne doit pas réaffecter des charges, modifier des contrats ou masquer des enjeux de sécurité seul. L’autorité de répartition et les engagements clients restent humains sauf systèmes étroitement gouvernés.',
        boundaries: [
          'L’acceptation finale d’une offre, les exceptions de tarif, les décisions matières dangereuses et la réaffectation de conducteurs exigent une approbation humaine et des pistes d’audit complètes.',
          'Les événements de sécurité, accidents et vols de cargaison recueillent le minimum de faits, donnent les consignes approuvées et escaladent immédiatement.',
          'Sans connexions TMS profondes, il demeure utile comme porte d’entrée : répondre au statut, saisir des demandes complètes, relancer les documents, journaliser les exceptions et transmettre un résumé utilisable aux planificateurs.',
        ],
      },
      {
        id: 'warehouses',
        label: 'Entrepôts',
        shortLabel: 'Entrepôt',
        image: {
          src: '/images/insights/library/process-optimization.webp',
          alt: 'Bureau entrepôt et 3PL pour mises à jour clients et coordination quai',
        },
        positioning: 'La première ligne IA du bureau et du quai d’entrepôt',
        promise:
          'Répondre aux questions d’inventaire et de commandes, coordonner les rendez-vous de quai et transformer les exceptions de réception ou de prélèvement en prochaines étapes claires pour le plancher.',
        audiences: [
          {
            id: 'warehouse-customers',
            label: 'Service clients et 3PL',
            lead: 'Donnez aux expéditeurs et équipes internes des réponses rapides sur les stocks, commandes et rendez-vous—sans interrompre chaque préparateur.',
            uses: [
              {
                title: 'Statut inventaire et commandes',
                description: 'Confirmer disponible, alloué ou expédié à partir des dossiers approuvés et recueillir d’abord les références de commande manquantes.',
              },
              {
                title: 'Questions ASN et réception',
                description: 'Recueillir l’arrivée prévue, le transporteur et les besoins de rendez-vous; ouvrir une tâche de réception quand quelque chose semble incorrect.',
              },
              {
                title: 'Réservation de rendez-vous de quai',
                description: 'Réserver les créneaux entrants ou sortants selon les fenêtres, types de portes et règles de séjour approuvés; envoyer confirmations et changements.',
              },
              {
                title: 'Manques, dommages et retenues',
                description: 'Saisir photos, quantités, lots ou numéros de série et codes de raison; créer un dossier d’exception pour revue du superviseur.',
              },
              {
                title: 'Accueil retours et RMA',
                description: 'Vérifier l’autorisation de retour, la raison et les exigences d’état; planifier le rendez-vous de retour lorsque c’est permis.',
              },
              {
                title: 'Guidance SLA et heures limites',
                description: 'Expliquer les heures limites, délais et règles du jour même approuvés; escalader les demandes urgentes qui brisent la politique.',
              },
              {
                title: 'Questions de facturation et d’entreposage',
                description: 'Répondre aux questions courantes d’entreposage, manutention ou accessoires à partir des dossiers connectés; envoyer les litiges à la gestion de compte.',
              },
              {
                title: 'Bureau d’entrepôt hors des heures',
                description: 'Prendre les demandes de statut et de rendez-vous de nuit, résoudre les FAQ approuvées et mettre le reste en file pour le quart du matin.',
              },
            ],
          },
          {
            id: 'warehouse-floor',
            label: 'Opérations plancher et quai',
            lead: 'Aidez les superviseurs et chefs d’équipe à dégager les goulots avec un accueil structuré—pas un autre appel radio dispersé.',
            uses: [
              {
                title: 'Accueil des écarts de réception',
                description: 'Journaliser surplus, manques et dommages par rapport à l’ASN ou au bon de commande; demander photos et consignes de retenue.',
              },
              {
                title: 'Suggestions de rangement et d’emplacement',
                description: 'Saisir les contraintes produit et proposer les règles d’emplacement approuvées pour confirmation d’un chef avant publication des mouvements.',
              },
              {
                title: 'Demandes de réapprovisionnement',
                description: 'Recueillir les ruptures en face de prélèvement et la priorité; ouvrir le travail de réapprovisionnement pour le prochain associé disponible.',
              },
              {
                title: 'Exceptions de prélèvement et d’emballage',
                description: 'Enregistrer mauvais article, prélèvement court, étiquette ou carton; acheminer vers la qualité ou un chef avec le contexte de commande.',
              },
              {
                title: 'Aide aux inventaires cycliques',
                description: 'Guider les étapes de comptage approuvées, saisir les écarts et envoyer les ajustements à signer à un superviseur.',
              },
              {
                title: 'Statut de la main-d’œuvre et des tâches',
                description: 'Résumer les vagues ouvertes, tâches bloquées et congestion aux portes pour que les chefs rééquilibrent rapidement.',
              },
              {
                title: 'Signalements de sécurité et quasi-accidents',
                description: 'Recueillir le minimum de faits, donner les consignes d’arrêt de travail approuvées et escalader immédiatement—jamais clôturer un événement de sécurité seul.',
              },
              {
                title: 'Briefs de relève de quart',
                description: 'Résumer exceptions ouvertes, rendez-vous en attente, retenues et problèmes d’équipement pour le prochain quart.',
              },
            ],
          },
        ],
        startTitle: 'Le meilleur point de départ',
        startLead: 'Commencez par les questions de bureau et l’accueil d’exceptions là où le volume est élevé et l’autorité est facile à définir.',
        startWith: [
          'Réponses de statut inventaire et commandes',
          'Réservation de rendez-vous de quai',
          'Accueil des exceptions de réception et de dommages',
          'Guidance retours et RMA',
          'Résumés de relève pour les dossiers ouverts',
        ],
        boundaryTitle: 'Des limites claires créent la confiance',
        boundaryLead:
          'Un employé IA ne doit pas ajuster l’inventaire en silence, lever des retenues qualité ou contourner les règles de sécurité. Les systèmes d’entrepôt et les superviseurs restent responsables des changements importants.',
        boundaries: [
          'Les ajustements d’inventaire, levées de retenue, changements de manutention dangereuse et enquêtes de sécurité exigent une approbation humaine et des pistes d’audit.',
          'Les commandes urgentes qui brisent les heures limites, les refacturations clients et les exceptions de contrat vont aux responsables de compte—pas à une automatisation sans supervision.',
          'Sans accès d’écriture WMS profond, il demeure utile comme porte d’entrée : répondre au statut, réserver des rendez-vous, saisir des exceptions complètes et transmettre un résumé utilisable au plancher.',
        ],
      },
      {
        id: 'care-practices',
        label: 'Cliniques de soins',
        shortLabel: 'Cliniques',
        image: {
          src: '/images/insights/library/authentic-professional-portrait-selection.webp',
          alt: 'Réception de clinique pour réservations patients et continuité des soins',
        },
        positioning: 'La première ligne IA de la réception clinique',
        promise:
          'Répondre à chaque appel et message de patient, réserver le bon type de visite et faire avancer rappels et listes d’attente—pendant que le jugement clinique reste à vos professionnels.',
        audiences: [
          {
            id: 'patient-front-desk',
            label: 'Appels patients et réservations',
            lead: 'Pour les cliniques dentaires, de physio, de chiropratique, de thérapie, de massage et similaires qui perdent des réservations pendant que le bureau est avec un patient—ou hors des heures.',
            uses: [
              {
                title: 'Réception toujours disponible',
                description: 'Répondre aux appels, textos et clavardages sous le nom de votre clinique pendant les périodes chargées, le midi et hors des heures.',
              },
              {
                title: 'Réservation de nouveaux patients',
                description: 'Recueillir le motif de visite, le professionnel ou le site préféré, les bases d’assurance ou de financement, et réserver la bonne durée de première rencontre.',
              },
              {
                title: 'Suivis et visites de plan de soins',
                description: 'Réserver hygiène, ajustements, séances de traitement et revues dans le bon fauteuil, la bonne salle et le bon calendrier de professionnel.',
              },
              {
                title: 'Règles de report et d’annulation',
                description: 'Gérer les changements simples dans votre délai de préavis; expliquer dépôts ou frais de retard selon la politique approuvée; escalader les cas limites.',
              },
              {
                title: 'Acheminement urgent vs courant',
                description: 'Reconnaître mal de dents, poussées de blessure ou besoins le jour même selon vos scripts; offrir des créneaux urgents approuvés ou escalader aussitôt au personnel.',
              },
              {
                title: 'FAQ heures, emplacement et services',
                description: 'Répondre au stationnement, aux directions, à ce que vous offrez et à quoi apporter—uniquement à partir du contenu approuvé.',
              },
              {
                title: 'Acheminement multi-professionnels et multi-sites',
                description: 'Orienter les appelants vers le bon site, professionnel, langue et type de rendez-vous sans les faire rebondir.',
              },
              {
                title: 'Transfert clinique',
                description: 'Envoyer les questions de symptômes, médicaments ou traitements à votre équipe comme rappel structuré—jamais diagnostiquer ni donner de conseils cliniques.',
              },
            ],
          },
          {
            id: 'practice-continuity',
            label: 'Rappels et continuité des soins',
            lead: 'Gardez l’horaire rempli et les patients engagés dans leur plan sans sortir les professionnels du temps de traitement.',
            uses: [
              {
                title: 'Confirmations et rappels',
                description: 'Envoyer confirmations de rendez-vous et rappels la veille avec options simples de confirmer ou reporter.',
              },
              {
                title: 'Remplissage des absences et annulations',
                description: 'Offrir les créneaux libérés à une liste d’attente de court préavis selon vos règles pour garder fauteuils et salles productifs.',
              },
              {
                title: 'Rappels d’hygiène et de contrôle',
                description: 'Lancer les rappels aux intervalles que vous fixez pour les patients qui ont accepté d’être contactés.',
              },
              {
                title: 'Reprise du plan de soins',
                description: 'Replanifier les visites de physio, chiro ou thérapie manquées et aider les patients à compléter le parcours prévu.',
              },
              {
                title: 'Collecte de formulaires et d’accueil',
                description: 'Envoyer les formulaires avant la visite, recueillir les réponses complètes et signaler les dossiers incomplets avant le rendez-vous.',
              },
              {
                title: 'Suivi des références et demandes',
                description: 'Répondre vite aux demandes Web, pubs et références; réserver quand c’est prêt ou planifier un rappel avec le personnel.',
              },
              {
                title: 'Questions de frais et de couverture',
                description: 'Expliquer les fourchettes de frais approuvées, options de paiement et questions de couverture courantes; envoyer les exceptions à la réception.',
              },
              {
                title: 'Demandes d’avis',
                description: 'Demander un retour sur le service après les visites avec un libellé approuvé—et escalader les réponses négatives à une personne avant qu’elles deviennent publiques.',
              },
            ],
          },
        ],
        startTitle: 'Le meilleur point de départ',
        startLead: 'Commencez là où les appels manqués et les plans de soins incomplets coûtent du revenu—et où les limites cliniques sont faciles à écrire.',
        startWith: [
          'Accueil 24/7 par appel et message',
          'Réservation nouveaux patients et suivis',
          'Acheminement urgent vs courant avec escalation',
          'Rappels, rappels de suivi et remplissage de liste d’attente',
          'Collecte de formulaires et résumés de conversation pour le personnel',
        ],
        boundaryTitle: 'Des limites claires créent la confiance',
        boundaryLead:
          'Un employé IA fait la réception et la coordination—pas le rôle de clinicien. La confidentialité, le consentement et la responsabilité clinique restent à votre pratique.',
        boundaries: [
          'Aucun diagnostic, conseil de traitement, décision d’ordonnance ou réponse sur le fait qu’un symptôme peut attendre—ces sujets escaladent vers le personnel qualifié avec un résumé de rappel complet.',
          'Les numéros de carte de paiement, les détails cliniques sensibles au-delà de l’accueil approuvé et les changements au dossier restent hors d’une automatisation sans supervision sauf systèmes et règles de consentement étroitement gouvernés.',
          'Sans accès d’écriture profond au logiciel de clinique, il demeure utile comme porte d’entrée : répondre à chaque demande, réserver ce qui est permis, recueillir les formulaires, lancer les rappels et transmettre un résumé utilisable à votre équipe.',
        ],
      },
      {
        id: 'manufacturing',
        label: 'Fabrication',
        shortLabel: 'Fabrication',
        image: {
          src: '/images/insights/library/twelve-month-technology-roadmap.webp',
          alt: 'Bureau commandes fabrication et acheminement des demandes d’usine',
        },
        positioning: 'La première ligne IA du bureau et du plancher d’usine',
        promise:
          'Répondre aux questions de commandes et de qualité, trier les problèmes de maintenance et de ligne, et transmettre aux superviseurs un résumé complet—pour que la production continue.',
        audiences: [
          {
            id: 'plant-customers',
            label: 'Bureau clients et commandes',
            lead: 'Donnez aux acheteurs et aux ops de vente des réponses rapides sur les commandes, la qualité et la livraison—sans sortir les planificateurs de l’horaire.',
            uses: [
              {
                title: 'Statut de commande et date promise',
                description: 'Confirmer l’étape, la date d’expédition et les retenues à partir des dossiers approuvés; recueillir d’abord les références de commande ou de ligne manquantes.',
              },
              {
                title: 'Accueil devis et capacité',
                description: 'Saisir spécifications, quantités, matériaux et échéances; créer une demande structurée pour revue d’estimation.',
              },
              {
                title: 'Demandes de modification de commande',
                description: 'Journaliser les changements de quantité, date ou spécification avec notes d’impact; acheminer engagements matières et effets sur l’horaire à un planificateur.',
              },
              {
                title: 'Accueil qualité et non-conformité',
                description: 'Recueillir détails du défaut, lots ou numéros de série et photos; ouvrir un dossier qualité pour disposition humaine.',
              },
              {
                title: 'Demandes de garantie et RMA',
                description: 'Vérifier les bases d’admissibilité, recueillir les détails de panne et planifier retour ou prochaines étapes de service sur le terrain selon vos règles.',
              },
              {
                title: 'Relance certificats et documents',
                description: 'Fournir COA, certificats de coulée ou listes de colisage approuvés lorsqu’ils sont disponibles; relancer les documents manquants auprès des fournisseurs ou de la QA.',
              },
              {
                title: 'Rappels fournisseurs et acheteurs',
                description: 'Répondre aux questions courantes de livraison et d’ASN; escalader les litiges de prix, de contrat ou de capacité aux achats.',
              },
              {
                title: 'Bureau d’usine hors des heures',
                description: 'Prendre les messages de statut et d’exception de nuit, résoudre les FAQ approuvées et mettre le reste en file pour le quart de jour.',
              },
            ],
          },
          {
            id: 'plant-floor',
            label: 'Production et maintenance',
            lead: 'Aidez les chefs à dégager arrêts de ligne, billets de maintenance et relèves de quart avec un accueil structuré—pas un trafic radio dispersé.',
            uses: [
              {
                title: 'Accueil arrêts de ligne et alarmes',
                description: 'Saisir machine, symptôme, dernière bonne production et statut de sécurité; ouvrir une demande de travail et alerter le bon métier.',
              },
              {
                title: 'Tri des billets de maintenance',
                description: 'Classer urgent vs planifié, vérifier les procédures connues et résumer pièces ou besoins de consignation pour un superviseur.',
              },
              {
                title: 'Guidance SOP et instructions de travail',
                description: 'Faire ressortir les procédures et étapes de montage approuvées pour le travail en cours; envoyer les cas ambigus à un chef.',
              },
              {
                title: 'Appels matières et manques',
                description: 'Journaliser composants, kits ou outillage manquants; aviser matières et production avec emplacement et priorité du job.',
              },
              {
                title: 'Signalement retenues qualité et rebuts',
                description: 'Enregistrer raisons de retenue, quantités et étapes de confinement déjà prises; escalader les décisions de disposition.',
              },
              {
                title: 'Briefs de relève de quart',
                description: 'Résumer arrêts ouverts, maintenance en attente, retenues qualité et risque d’horaire pour le quart entrant.',
              },
              {
                title: 'Signalements de sécurité et quasi-accidents',
                description: 'Recueillir le minimum de faits, donner les consignes d’arrêt de travail approuvées et escalader immédiatement—jamais clôturer un événement de sécurité seul.',
              },
              {
                title: 'Recherche formation et compétences',
                description: 'Confirmer qui est qualifié pour une tâche à partir des matrices approuvées; acheminer les écarts à un superviseur avant le début du travail.',
              },
            ],
          },
        ],
        startTitle: 'Le meilleur point de départ',
        startLead: 'Commencez par les questions de bureau à fort volume et un accueil d’exceptions propre avant de toucher à l’horaire ou au contrôle des machines.',
        startWith: [
          'Réponses de statut de commande et date promise',
          'Accueil qualité et non-conformité',
          'Tri des arrêts de ligne et billets de maintenance',
          'Guidance SOP à partir des procédures approuvées',
          'Résumés de relève pour les dossiers ouverts',
        ],
        boundaryTitle: 'Des limites claires créent la confiance',
        boundaryLead:
          'Un employé IA ne doit pas piloter l’équipement, modifier les horaires de production ni clôturer seul les événements de sécurité et de qualité. Les systèmes d’usine et les superviseurs restent responsables des actions importantes.',
        boundaries: [
          'Les commandes machine, décisions de consignation, changements d’horaire et achats urgents exigent une approbation humaine et des pistes d’audit complètes.',
          'Les incidents de sécurité, échappées qualité et refacturations clients escaladent avec un contexte complet—jamais un « tout va bien » sans personne.',
          'Sans accès d’écriture profond MES, GMAO ou ERP, il demeure utile comme porte d’entrée : répondre au statut, saisir des exceptions complètes, faire ressortir les SOP approuvées et transmettre un résumé utilisable aux chefs.',
        ],
      },
      {
        id: 'legal',
        label: 'Juridique',
        shortLabel: 'Juridique',
        image: {
          src: '/images/insights/library/client-boundaries-without-damaging-relationships.webp',
          alt: 'Accueil juridique et coordination clients avec transfert clair de dossiers',
        },
        positioning: 'La première ligne IA de l’accueil d’un cabinet',
        promise:
          'Répondre à chaque demande, saisir les détails du dossier, réserver des consultations et acheminer les affaires urgentes au bon avocat—pour que votre équipe pratique le droit au lieu de courir après le téléphone.',
        audiences: [
          {
            id: 'legal-intake',
            label: 'Accueil clients et nouvelles affaires',
            lead: 'Les clients potentiels engagent le cabinet qui répond en premier. Gardez l’accueil en mouvement quand les avocats sont au tribunal, en interrogatoire ou concentrés sur des mémoires.',
            uses: [
              {
                title: 'Première réponse toujours disponible',
                description: 'Répondre aux appels, textos et clavardages sous le nom du cabinet pendant le tribunal, les réunions, le midi et hors des heures—pour que les demandes ne meurent pas dans la messagerie.',
              },
              {
                title: 'Qualification par domaine de pratique',
                description: 'Confirmer si l’affaire correspond à vos domaines et sites; décliner poliment ou orienter ailleurs lorsqu’elle ne correspond pas à vos critères.',
              },
              {
                title: 'Accueil structuré du dossier',
                description: 'Saisir ce qui s’est passé, quand, qui était impliqué, blessures ou dommages, documents disponibles et autres questions de tri approuvées.',
              },
              {
                title: 'Réservation de consultations',
                description: 'Réserver les premières consultations dans les calendriers approuvés selon l’avocat, le type d’affaire et l’urgence; envoyer confirmations et consignes sur quoi apporter.',
              },
              {
                title: 'Acheminement urgence et conflits',
                description: 'Signaler les affaires urgentes, les enjeux de délais et les questions de garde ou de sécurité pour revue humaine immédiate selon vos règles d’escalade.',
              },
              {
                title: 'FAQ honoraires et processus',
                description: 'Expliquer les frais de consultation approuvés, les règles de consultation gratuite et les étapes générales à partir du contenu du cabinet—jamais de conseils juridiques propres à un dossier.',
              },
              {
                title: 'Liste de documents et de preuves',
                description: 'Indiquer quels dossiers rassembler avant la consultation et ouvrir un résumé d’accueil clair pour l’avocat.',
              },
              {
                title: 'Relance des prospects',
                description: 'Relancer les accueils incomplets et les absences avec des rappels approuvés pour que les affaires qualifiées ne refroidissent pas.',
              },
            ],
          },
          {
            id: 'legal-client-service',
            label: 'Service clients et coordination',
            lead: 'Gardez les clients existants informés et le personnel coordonné sans interrompre le travail facturable pour des demandes courantes.',
            uses: [
              {
                title: 'Acheminement avocat et dossier',
                description: 'Identifier le client et le dossier, puis connecter au bon avocat, parajuriste ou groupe de pratique avec contexte.',
              },
              {
                title: 'Changements de rendez-vous et d’échéances',
                description: 'Reporter consultations, appels de préparation et réunions courantes selon vos règles; escalader les conflits de tribunal ou de dépôt au personnel.',
              },
              {
                title: 'Mises à jour de statut sans conseil',
                description: 'Communiquer un libellé de statut approuvé sans conseil et recueillir les questions pour que l’avocat responsable y réponde.',
              },
              {
                title: 'Accueil et demandes de documents',
                description: 'Indiquer comment envoyer infos d’assurance, rapports de police, contrats ou formulaires; confirmer ce qui est reçu et ce qui manque encore.',
              },
              {
                title: 'Couverture clients hors des heures',
                description: 'Traiter les questions courantes la nuit, saisir les messages urgents et aviser le conseil de garde lorsque vos seuils sont atteints.',
              },
              {
                title: 'Résumés d’appel pour le dossier',
                description: 'Transcrire et résumer les conversations pour que les détails d’accueil et les prochaines actions s’attachent proprement au dossier.',
              },
              {
                title: 'Indices de sentiment et d’escalade',
                description: 'Détecter la frustration ou l’urgence et passer la conversation à une personne avant que la relation client se détériore.',
              },
              {
                title: 'Notes de transfert d’équipe',
                description: 'Donner aux avocats, parajuristes et personnel d’accueil un résumé partagé sur appels, textos et messages.',
              },
            ],
          },
        ],
        startTitle: 'Le meilleur point de départ',
        startLead: 'Commencez là où les demandes manquées coûtent des mandats—et où les limites « pas de conseil juridique » sont faciles à faire respecter.',
        startWith: [
          'Réponse 24/7 aux demandes et capture de prospects',
          'Qualification par domaine et accueil structuré',
          'Réservation de consultations avec confirmations',
          'Acheminement des affaires urgentes au bon avocat',
          'Résumés de conversation joints au dossier',
        ],
        boundaryTitle: 'Des limites claires créent la confiance',
        boundaryLead:
          'Un employé IA soutient l’accueil et la coordination—il ne pratique pas le droit. La confidentialité, les conflits d’intérêts et les conseils restent aux professionnels licenciés.',
        boundaries: [
          'Aucun conseil juridique, stratégie de dossier, prédiction de résultat ou interprétation des droits d’un client—ces sujets escaladent vers un avocat avec un résumé de rappel complet.',
          'Les détails privilégiés et sensibles suivent uniquement votre script d’accueil approuvé; vous définissez ce que l’IA peut demander, stocker, enregistrer et partager.',
          'Sans accès d’écriture profond au logiciel de gestion de cabinet, il demeure utile comme porte d’entrée : répondre à chaque demande, qualifier l’affaire, réserver des consultations, saisir un accueil complet et transmettre un résumé utilisable au conseil.',
        ],
      },
      {
        id: 'accounting-tax',
        label: 'Comptabilité et fiscalité',
        shortLabel: 'Comptabilité',
        image: {
          src: '/images/insights/library/measure-software-business-value.webp',
          alt: 'Accueil comptabilité et fiscalité, réservations et préparation de dossiers',
        },
        positioning: 'La première ligne IA du bureau en haute saison',
        promise:
          'Répondre aux appels clients, réserver des rendez-vous, relancer les documents et acheminer les questions de production urgentes—pour que les comptables restent sur le travail facturable.',
        audiences: [
          {
            id: 'accounting-intake',
            label: 'Accueil clients et réservations',
            lead: 'La saison fiscale et les fins de mois saturent le téléphone. Répondez à chaque demande sans sortir les préparateurs des déclarations.',
            uses: [
              {
                title: 'Réception de cabinet toujours disponible',
                description: 'Répondre aux appels et messages pendant les périodes de production, le midi et hors des heures sous le nom du cabinet.',
              },
              {
                title: 'Qualification de nouveaux clients',
                description: 'Saisir besoins personnels vs entreprise, type d’entité, urgence et adéquation de service avant de réserver un appel découverte.',
              },
              {
                title: 'Réservation de rendez-vous',
                description: 'Réserver fiscalité, tenue de livres, paie et conseils dans le bon calendrier avec confirmations.',
              },
              {
                title: 'Accueil par liste de documents',
                description: 'Indiquer quels feuillets, relevés et reçus envoyer; confirmer ce qui est arrivé et ce qui manque.',
              },
              {
                title: 'FAQ échéances et production',
                description: 'Communiquer les dates approuvées, bases de prolongation et étapes de processus à partir du contenu du cabinet—pas de conseils fiscaux personnalisés.',
              },
              {
                title: 'Questions portail et paiement',
                description: 'Guider les clients dans l’accès portail approuvé, le statut de facture et les options de paiement à partir des dossiers connectés.',
              },
              {
                title: 'Relance des références et prospects',
                description: 'Relancer les accueils incomplets et les absences pour que les prospects saisonniers ne refroidissent pas.',
              },
              {
                title: 'Acheminement urgent',
                description: 'Escalader avis ARC, pannes de paie et risques de production le jour même au comptable responsable immédiatement.',
              },
            ],
          },
          {
            id: 'accounting-ops',
            label: 'Préparation de dossiers et suivi',
            lead: 'Faites avancer les dossiers entre les rendez-vous avec une relance structurée—pas des interruptions ad hoc du personnel.',
            uses: [
              {
                title: 'Relance d’informations manquantes',
                description: 'Demander les documents en suspens avec des listes claires et journaliser chaque réponse client contre le mandat.',
              },
              {
                title: 'Rappels de cadence de tenue de livres',
                description: 'Rappeler les échéances mensuelles de dépôt et les prochaines dates de clôture selon vos ententes de service.',
              },
              {
                title: 'Suivi des lettres de mission',
                description: 'Envoyer les prochaines étapes de mission approuvées et signaler les lettres non signées pour suivi du personnel.',
              },
              {
                title: 'Statut sans conseil',
                description: 'Communiquer uniquement le libellé approuvé « en cours / en attente de documents / prêt pour revue ».',
              },
              {
                title: 'Accueil paie et cotisations',
                description: 'Recueillir les changements de paie et questions de cotisations; acheminer calculs et production au personnel.',
              },
              {
                title: 'Tri de capacité en saison',
                description: 'Prioriser les demandes selon le risque d’échéance et le type de service pour protéger le travail le plus urgent.',
              },
              {
                title: 'Résumés de transfert',
                description: 'Joindre un résumé de conversation clair au dossier client avant que le prochain préparateur n’y touche.',
              },
              {
                title: 'Demandes d’avis et de références',
                description: 'Demander références ou avis après les mandats terminés avec un libellé approuvé.',
              },
            ],
          },
        ],
        startTitle: 'Le meilleur point de départ',
        startLead: 'Commencez là où les appels manqués en haute saison et les documents manquants ralentissent le travail facturable.',
        startWith: [
          'Réponse 24/7 aux demandes en saison de production',
          'Réservation selon le type de service',
          'Liste de documents et relance des manques',
          'Escalade urgente ARC et paie',
          'Résumés de conversation au dossier client',
        ],
        boundaryTitle: 'Des limites claires créent la confiance',
        boundaryLead:
          'Un employé IA coordonne l’accueil et la préparation de dossiers—il ne fournit pas de conseils fiscaux, comptables ou financiers.',
        boundaries: [
          'Aucune position fiscale, décision de déduction, représentation en audit ou conseil de production personnalisé—ces sujets escaladent vers le personnel qualifié.',
          'NAS, données bancaires et détails financiers sensibles suivent uniquement vos règles d’accueil et de stockage approuvées.',
          'Sans accès d’écriture profond au logiciel de cabinet, il demeure utile comme porte d’entrée : répondre à chaque demande, réserver le travail, relancer les documents et transmettre un résumé utilisable aux préparateurs.',
        ],
      },
      {
        id: 'real-estate-property',
        label: 'Immobilier et immeubles',
        shortLabel: 'Immobilier',
        image: {
          src: '/images/insights/library/sales-pipeline-or-list-of-contacts.webp',
          alt: 'Bureau immobilier pour prospects et demandes de résidents',
        },
        positioning: 'La première ligne IA des inscriptions, prospects et locataires',
        promise:
          'Répondre à chaque prospect et demande de locataire, réserver des visites ou interventions, et acheminer les urgences—pour que les transactions et les immeubles avancent.',
        audiences: [
          {
            id: 'real-estate-leads',
            label: 'Prospects ventes et location',
            lead: 'La vitesse de réponse gagne sur les marchés canadiens. Capturez et qualifiez pendant que les agents sont en visite ou hors des heures.',
            uses: [
              {
                title: 'Capture de prospect au premier contact',
                description: 'Répondre aussitôt aux appels, textos et demandes de portail; saisir nom, budget, échéancier et secteurs préférés.',
              },
              {
                title: 'FAQ inscriptions et disponibilité',
                description: 'Communiquer les détails de propriété approuvés, heures de portes ouvertes et étapes de demande à partir de l’inventaire actuel.',
              },
              {
                title: 'Réservation de visites',
                description: 'Réserver les visites dans les calendriers d’agent ou d’inscription avec notes d’accès, confirmations et rappels.',
              },
              {
                title: 'Qualification acheteur et locataire',
                description: 'Poser les questions de préqualification approuvées et acheminer les prospects sérieux au bon agent ou agent de location.',
              },
              {
                title: 'Accueil offres et demandes',
                description: 'Recueillir documents et signaux d’intention; créer une trousse structurée pour revue humaine—jamais négocier seul.',
              },
              {
                title: 'Acheminement hypothèque et préautorisation',
                description: 'Saisir le statut de financement et connecter aux partenaires approuvés ou contacts hypothécaires internes.',
              },
              {
                title: 'Réactivation de prospects froids',
                description: 'Relancer d’anciennes demandes avec une approche approuvée quand un bien correspondant apparaît.',
              },
              {
                title: 'Résumés de transfert à l’agent',
                description: 'Transmettre un contexte de prospect complet pour que la première conversation humaine soit prête à conclure.',
              },
            ],
          },
          {
            id: 'property-management',
            label: 'Bureau de gestion immobilière',
            lead: 'Gardez résidents et propriétaires informés pendant que l’entretien et la location restent sur le terrain.',
            uses: [
              {
                title: 'Accueil des demandes d’entretien',
                description: 'Saisir unité, problème, urgence, photos et consignes d’accès; ouvrir un bon de travail pour le bon métier.',
              },
              {
                title: 'Triage urgence vs routine',
                description: 'Reconnaître inondations, absence de chauffage, portes verrouillées et enjeux de sécurité; escalader aussitôt selon les protocoles de l’immeuble.',
              },
              {
                title: 'Questions de loyer et de portail',
                description: 'Répondre aux questions approuvées sur soldes, échéances et accès portail à partir des dossiers connectés.',
              },
              {
                title: 'Planification emménagement et déménagement',
                description: 'Réserver inspections, remise de clés et tournées; envoyer listes de contrôle et confirmations.',
              },
              {
                title: 'Demandes de mise à jour propriétaire',
                description: 'Recueillir les questions des propriétaires et préparer un brief structuré pour le gestionnaire.',
              },
              {
                title: 'Messages de coordination fournisseurs',
                description: 'Confirmer fenêtres d’arrivée des entrepreneurs et détails d’accès au site avec un résumé clair pour le personnel.',
              },
              {
                title: 'Couverture résidents hors des heures',
                description: 'Traiter les demandes de nuit, résoudre les FAQ approuvées et aviser le personnel de garde pour les vraies urgences.',
              },
              {
                title: 'Escalade des plaintes',
                description: 'Détecter tôt la frustration et acheminer les enjeux sensibles résident ou propriétaire à une personne avec tout le contexte.',
              },
            ],
          },
        ],
        startTitle: 'Le meilleur point de départ',
        startLead: 'Commencez là où les prospects manqués et les appels d’entretien hors des heures coûtent du revenu et de la réputation.',
        startWith: [
          'Accueil 24/7 prospects et résidents',
          'Réservation de visites et d’inspections',
          'Triage d’entretien et capture de bons de travail',
          'Règles d’escalade d’urgence',
          'Résumés de transfert agents et gestionnaires',
        ],
        boundaryTitle: 'Des limites claires créent la confiance',
        boundaryLead:
          'Un employé IA coordonne demandes et service—il ne négocie pas les transactions, ne donne pas de conseils d’investissement et n’autorise pas d’accès dangereux.',
        boundaries: [
          'Offres, concessions de prix, exceptions de bail et avis juridiques restent aux agents ou gestionnaires licenciés.',
          'Les urgences de sécurité des personnes et des immeubles suivent des scripts approuvés et escaladent immédiatement vers des humains de garde.',
          'Sans accès d’écriture profond CRM ou logiciel immobilier, il demeure utile comme porte d’entrée : répondre à chaque demande, réserver, saisir des demandes complètes et transmettre un résumé utilisable au personnel.',
        ],
      },
      {
        id: 'veterinary',
        label: 'Médecine vétérinaire',
        shortLabel: 'Vétérinaire',
        image: {
          src: '/images/insights/library/building-business-or-demanding-job.webp',
          alt: 'Réception vétérinaire pour réservations, rappels et continuité des soins',
        },
        positioning: 'La première ligne IA du téléphone de clinique',
        promise:
          'Répondre à chaque appel de propriétaire, réserver le bon type de visite et escalader les vraies urgences—pendant que le jugement clinique reste à votre équipe vétérinaire.',
        audiences: [
          {
            id: 'vet-front-desk',
            label: 'Appels clients et réservations',
            lead: 'Les propriétaires appellent pendant que votre équipe est en chirurgie ou avec un patient. Gardez le bureau réactif sans interrompre les soins.',
            uses: [
              {
                title: 'Réception de clinique toujours disponible',
                description: 'Répondre aux appels et messages pendant les rendez-vous, le midi et hors des heures sous le nom de la clinique.',
              },
              {
                title: 'Réservation par type de visite',
                description: 'Réserver bien-être, maladie, dentaire, consultations chirurgicales et suivis dans le bon médecin et la bonne durée de salle.',
              },
              {
                title: 'Accueil nouveaux clients et animaux',
                description: 'Recueillir détails du propriétaire, espèce/âge, points d’historique et besoins de transfert de dossiers avant la visite.',
              },
              {
                title: 'Acheminement urgent vs courant',
                description: 'Reconnaître empoisonnement, trauma, détresse respiratoire ou collapsus selon des scripts approuvés; escalader immédiatement.',
              },
              {
                title: 'FAQ heures, emplacement et services',
                description: 'Répondre au stationnement, aux espèces servies et à quoi apporter uniquement à partir du contenu approuvé de la clinique.',
              },
              {
                title: 'Acheminement multi-médecins et multi-sites',
                description: 'Orienter les appelants vers le bon site, vétérinaire et type de rendez-vous sans les faire rebondir.',
              },
              {
                title: 'Demandes de référence et de dossiers',
                description: 'Saisir les détails de la clinique référente et les besoins documentaires; ouvrir une trousse claire pour suivi du personnel.',
              },
              {
                title: 'Transfert clinique',
                description: 'Envoyer les questions médicales à votre équipe comme rappel structuré—jamais diagnostiquer ni prescrire.',
              },
            ],
          },
          {
            id: 'vet-continuity',
            label: 'Rappels et continuité des soins',
            lead: 'Protégez la continuité des soins et la capacité de la clinique avec rappels, confirmations et remplissage de liste d’attente.',
            uses: [
              {
                title: 'Confirmations et rappels',
                description: 'Envoyer des rappels de visite avec options simples de confirmer ou reporter pour réduire les absences.',
              },
              {
                title: 'Rappels vaccins et bien-être',
                description: 'Lancer les rappels approuvés pour les patients dus en soins préventifs.',
              },
              {
                title: 'Liste d’attente et remplissage d’annulations',
                description: 'Offrir les créneaux libérés aux clients de court préavis selon les règles de la clinique.',
              },
              {
                title: 'Consignes avant la visite',
                description: 'Envoyer consignes de jeûne, d’arrivée et de formulaires selon le type de rendez-vous.',
              },
              {
                title: 'Accueil de renouvellement d’ordonnance',
                description: 'Recueillir les demandes de renouvellement et acheminer l’approbation à un vétérinaire; jamais autoriser un médicament seul.',
              },
              {
                title: 'Planification pension et dépôt',
                description: 'Réserver pension ou garde de jour lorsque c’est offert et saisir notes d’alimentation ou de médicaments pour le personnel.',
              },
              {
                title: 'Questions de facturation et d’estimation',
                description: 'Expliquer les fourchettes de frais et options de paiement approuvées; envoyer les estimations complexes à la réception.',
              },
              {
                title: 'Demandes d’avis',
                description: 'Demander un retour après les visites et escalader d’abord les réponses négatives à une personne.',
              },
            ],
          },
        ],
        startTitle: 'Le meilleur point de départ',
        startLead: 'Commencez là où les appels manqués et les soins préventifs incomplets laissent des salles vides et des urgences mal gérées.',
        startWith: [
          'Accueil 24/7 par appel et message',
          'Réservation par type de visite, médecin et durée',
          'Triage urgent avec escalation immédiate',
          'Rappels, rappels de suivi et remplissage de liste d’attente',
          'Résumés de rappel pour le personnel clinique',
        ],
        boundaryTitle: 'Des limites claires créent la confiance',
        boundaryLead:
          'Un employé IA fait la réception et la coordination de clinique—pas le rôle de vétérinaire. Les décisions médicales et les prescriptions restent aux professionnels licenciés.',
        boundaries: [
          'Aucun diagnostic, plan de traitement, conseil de posologie ou accompagnement d’euthanasie—ces sujets escaladent immédiatement vers le personnel qualifié.',
          'Substances contrôlées, dossiers contrôlés et changements au dossier restent hors d’une automatisation sans supervision.',
          'Sans accès d’écriture profond au système de gestion de clinique, il demeure utile comme porte d’entrée : répondre à chaque demande, réserver ce qui est permis, lancer les rappels et transmettre un résumé utilisable à votre équipe.',
        ],
      },
      {
        id: 'insurance-brokerage',
        label: 'Courtage d’assurance',
        shortLabel: 'Assurance',
        image: {
          src: '/images/insights/library/should-you-say-yes-to-this-opportunity.webp',
          alt: 'Accueil courtage d’assurance pour soumissions et acheminement des réclamations',
        },
        positioning: 'La première ligne IA du bureau de courtage',
        promise:
          'Qualifier les nouveaux risques, réserver le temps des conseillers, répondre aux questions de police courantes selon des scripts approuvés et acheminer les réclamations—sans donner de conseils non licenciés.',
        audiences: [
          {
            id: 'insurance-intake',
            label: 'Nouvelles affaires et soumissions',
            lead: 'Les courtiers canadiens gagnent sur la réactivité. Capturez chaque demande pendant que les conseillers sont en réunion ou hors des heures.',
            uses: [
              {
                title: 'Réception de courtage toujours disponible',
                description: 'Répondre aux appels et messages pour les lignes personnelles et commerciales sous la marque du courtage.',
              },
              {
                title: 'Qualification par ligne d’affaires',
                description: 'Identifier auto, habitation, commercial, vie ou avantages sociaux et acheminer au bon conseiller licencié.',
              },
              {
                title: 'Accueil de soumission',
                description: 'Recueillir bases du risque, dates de renouvellement et besoins documentaires; créer une trousse structurée pour cotation.',
              },
              {
                title: 'Réservation de rendez-vous',
                description: 'Réserver découvertes et revues de renouvellement dans les calendriers des conseillers avec confirmations et listes de préparation.',
              },
              {
                title: 'Demandes de certificats et de preuves',
                description: 'Traiter les demandes courantes de certificats d’assurance selon des flux approuvés et des dossiers connectés.',
              },
              {
                title: 'Accueil des partenaires de référence',
                description: 'Saisir les références hypothécaires, immobilières et de prêteurs avec des notes de transfert claires pour les conseillers.',
              },
              {
                title: 'Relance de prospects',
                description: 'Relancer les demandes de soumission incomplètes avant la fermeture des fenêtres de renouvellement.',
              },
              {
                title: 'Alertes de souscription urgente',
                description: 'Escalader les besoins de couverture le jour même et les risques d’annulation à une personne licenciée immédiatement.',
              },
            ],
          },
          {
            id: 'insurance-service',
            label: 'Service et acheminement des réclamations',
            lead: 'Gardez les assurés informés et les réclamations en mouvement pendant que le personnel licencié gère conseils et négociation.',
            uses: [
              {
                title: 'FAQ statut de police',
                description: 'Répondre aux questions approuvées sur renouvellements, facturation et demandes de documents à partir des dossiers connectés.',
              },
              {
                title: 'Accueil des avenants',
                description: 'Saisir changements de véhicule, conducteur, adresse ou couverture pour revue du conseiller avant liaison.',
              },
              {
                title: 'Premier avis de sinistre',
                description: 'Recueillir bases de l’incident, date, lieu et contacts; ouvrir un accueil de réclamation et escalader selon vos règles.',
              },
              {
                title: 'Relance documentaire pour la souscription',
                description: 'Demander photos, évaluations, historiques de sinistres et demandes; suivre ce qui reste en suspens.',
              },
              {
                title: 'Rappels de renouvellement',
                description: 'Aviser les clients des renouvellements à venir et réserver des appels de revue avant les échéances du marché.',
              },
              {
                title: 'Couverture clients hors des heures',
                description: 'Traiter les demandes de nuit, résoudre les FAQ approuvées et aviser le personnel de garde pour les sinistres urgents.',
              },
              {
                title: 'Indices de plainte et d’escalade',
                description: 'Détecter tôt la frustration et passer les enjeux sensibles à un conseiller licencié avec tout le contexte.',
              },
              {
                title: 'Résumés de conversation',
                description: 'Joindre les résumés d’accueil et de service au dossier client pour le prochain contact du conseiller.',
              },
            ],
          },
        ],
        startTitle: 'Le meilleur point de départ',
        startLead: 'Commencez par la capture des demandes et l’accueil des réclamations là où la vitesse et les transferts propres protègent revenu et confiance.',
        startWith: [
          'Réponse 24/7 et qualification des demandes',
          'Trousses d’accueil de soumission pour les conseillers',
          'Réservation de rendez-vous de revue',
          'Acheminement du premier avis de sinistre',
          'Résumés de conversation au dossier client',
        ],
        boundaryTitle: 'Des limites claires créent la confiance',
        boundaryLead:
          'Un employé IA soutient les opérations de courtage—il ne fournit pas de conseils d’assurance et ne lie pas la couverture seul.',
        boundaries: [
          'Recommandations de couverture, liaison, annulations et négociations de réclamation restent aux conseillers licenciés.',
          'Les détails sensibles de souscription et de sinistre suivent uniquement vos scripts, consentements et règles de stockage approuvés.',
          'Sans accès d’écriture profond au système de gestion d’agence, il demeure utile comme porte d’entrée : répondre à chaque demande, saisir un accueil complet, réserver des revues et transmettre un résumé utilisable aux conseillers.',
        ],
      },
      {
        id: 'immigration-settlement',
        label: 'Immigration et établissement',
        shortLabel: 'Immigration',
        image: {
          src: '/images/insights/library/structured-data-for-small-business.webp',
          alt: 'Accueil immigration et établissement pour demandes et préparation de dossiers',
        },
        positioning: 'La première ligne IA des demandes d’immigration à fort volume',
        promise:
          'Répondre à chaque demande dans les langues que vous soutenez, saisir les bases du dossier, réserver des consultations et relancer les documents—sans donner de conseils d’immigration.',
        audiences: [
          {
            id: 'immigration-intake',
            label: 'Accueil des demandes et consultations',
            lead: 'Les bureaux d’immigration et d’établissement au Canada font face à un volume constant. Répondez vite, qualifiez clairement et protégez le temps des conseillers.',
            uses: [
              {
                title: 'Réponse toujours disponible aux demandes',
                description: 'Répondre aux appels, formulaires et messages hors des heures et pendant les campagnes sous le nom de votre organisation.',
              },
              {
                title: 'Tri d’adéquation au programme',
                description: 'Poser les questions de tri approuvées pour voir si la demande correspond aux services que vous offrez vraiment.',
              },
              {
                title: 'Réservation de consultations',
                description: 'Réserver consultations payantes ou d’accueil dans le bon calendrier de conseiller avec confirmations et consignes de préparation.',
              },
              {
                title: 'Début de liste de documents',
                description: 'Partager des listes de départ approuvées par type de dossier et confirmer ce que le client a déjà.',
              },
              {
                title: 'Acheminement langue et emplacement',
                description: 'Orienter les appelants vers la capacité EN/FR ou autre langue soutenue et le bon bureau ou conseiller.',
              },
              {
                title: 'Triage d’urgence',
                description: 'Signaler renouvellements urgents, risques de renvoi ou contraintes de voyage pour revue humaine immédiate.',
              },
              {
                title: 'FAQ honoraires et processus',
                description: 'Expliquer les grilles tarifaires approuvées et les étapes générales à partir de votre contenu—jamais de conseil de dossier.',
              },
              {
                title: 'Relance des demandes incomplètes',
                description: 'Relancer les demandes arrêtées en cours d’accueil avant de perdre la fenêtre de consultation.',
              },
            ],
          },
          {
            id: 'immigration-file-ops',
            label: 'Préparation de dossiers et mises à jour',
            lead: 'Faites avancer les dossiers avec une relance documentaire structurée et des mises à jour sans conseil.',
            uses: [
              {
                title: 'Relance de documents manquants',
                description: 'Demander formulaires et preuves en suspens avec des listes claires; journaliser chaque réponse client au dossier.',
              },
              {
                title: 'Rappels de rendez-vous et de biométrie',
                description: 'Envoyer des rappels pour consultations, biométrie ou dépôt de documents avec votre libellé approuvé.',
              },
              {
                title: 'Statut sans conseil',
                description: 'Communiquer uniquement les mises à jour approuvées « reçu / en revue / en attente du client / avec le conseiller ».',
              },
              {
                title: 'Acheminement des services d’établissement',
                description: 'Orienter les appelants vers logement, langue, emploi ou partenaires communautaires selon votre liste de références approuvée.',
              },
              {
                title: 'Notes de traduction et d’accessibilité',
                description: 'Saisir les besoins de langue et d’accessibilité pour préparer la prochaine rencontre humaine.',
              },
              {
                title: 'Questions de paiement et de provision',
                description: 'Répondre aux questions de facturation approuvées à partir des dossiers connectés; escalader les litiges au personnel.',
              },
              {
                title: 'Couverture hors des heures',
                description: 'Traiter les demandes de nuit, résoudre les FAQ approuvées et escalader les vraies urgences aux conseillers de garde.',
              },
              {
                title: 'Résumés de transfert au conseiller',
                description: 'Transmettre un résumé complet de la demande et des documents avant le début de la consultation.',
              },
            ],
          },
        ],
        startTitle: 'Le meilleur point de départ',
        startLead: 'Commencez là où le volume de demandes et les documents manquants ralentissent le plus les conseillers autorisés.',
        startWith: [
          'Réponse 24/7 et tri des demandes',
          'Réservation de consultations avec consignes de préparation',
          'Liste de documents et relance des manques',
          'Escalade des échéances urgentes',
          'Résumés de transfert aux conseillers',
        ],
        boundaryTitle: 'Des limites claires créent la confiance',
        boundaryLead:
          'Un employé IA coordonne les demandes et la préparation de dossiers—il ne fournit pas de conseils d’immigration et ne représente pas les clients.',
        boundaries: [
          'Aucune décision d’admissibilité, stratégie de demande ou représentation auprès du gouvernement—cela reste aux représentants autorisés.',
          'Les pièces d’identité et données personnelles sensibles suivent uniquement vos règles d’accueil, de consentement et de conservation approuvées.',
          'Sans accès d’écriture profond au système de dossiers, il demeure utile comme porte d’entrée : répondre à chaque demande, réserver des consultations, relancer les documents et transmettre un résumé utilisable aux conseillers.',
        ],
      },
      {
        id: 'home-care-seniors',
        label: 'Soins à domicile et aînés',
        shortLabel: 'Soins à domicile',
        image: {
          src: '/images/insights/library/can-business-operate-two-weeks-without-you.webp',
          alt: 'Accueil soins à domicile pour évaluations familiales et mises à jour d’horaire',
        },
        positioning: 'La première ligne IA des familles et de la coordination des soins',
        promise:
          'Répondre aux demandes des familles, réserver des évaluations, coordonner les changements de visite et escalader les besoins urgents—avec dignité et transfert humain clair.',
        audiences: [
          {
            id: 'home-care-intake',
            label: 'Accueil des familles et évaluations',
            lead: 'Les familles appellent souvent en stress, hors des heures ou en comparant des fournisseurs. Répondez vite et saisissez les bons détails.',
            uses: [
              {
                title: 'Réception familles toujours disponible',
                description: 'Répondre aux appels et messages le soir et la fin de semaine quand les familles recherchent des options de soins.',
              },
              {
                title: 'Qualification d’adéquation au service',
                description: 'Identifier soins personnels, soins infirmiers, compagnie, répit ou besoins spécialisés par rapport à ce que vous offrez.',
              },
              {
                title: 'Réservation d’évaluations',
                description: 'Réserver des évaluations à domicile ou virtuelles avec le bon coordonnateur et envoyer les consignes de préparation.',
              },
              {
                title: 'Accueil du profil de soins',
                description: 'Recueillir mobilité, besoins de soutien médicamenteux, préférences d’horaire et accès au domicile pour revue du personnel.',
              },
              {
                title: 'FAQ financement et couverture',
                description: 'Expliquer les bases approuvées de paiement privé, assureur ou programme à partir de votre contenu—pas de conseils de financement personnalisés.',
              },
              {
                title: 'Demandes de couverture urgente',
                description: 'Signaler congé d’hôpital, épuisement de l’aidant ou démarrage dans la semaine pour revue immédiate du coordonnateur.',
              },
              {
                title: 'Acheminement multi-sites et langues',
                description: 'Orienter les familles vers la bonne succursale, capacité linguistique et spécialité de service.',
              },
              {
                title: 'Résumés de transfert au coordonnateur',
                description: 'Transmettre un résumé complet famille et client avant le premier appel d’évaluation.',
              },
            ],
          },
          {
            id: 'home-care-ops',
            label: 'Planification et mises à jour familles',
            lead: 'Gardez les visites fiables et les familles informées sans sortir infirmières ou coordonnateurs de la route.',
            uses: [
              {
                title: 'Confirmations et rappels de visite',
                description: 'Confirmer les prochaines visites avec clients et familles; saisir les demandes simples de changement d’horaire.',
              },
              {
                title: 'Accueil des absences de soignants',
                description: 'Journaliser les absences et recueillir les détails de quart pour que les coordonnateurs réaffectent rapidement.',
              },
              {
                title: 'Mises à jour de statut pour les familles',
                description: 'Communiquer des mises à jour non cliniques approuvées et recueillir les questions pour l’équipe de soins.',
              },
              {
                title: 'Escalade médication et clinique',
                description: 'Saisir les préoccupations et escalader vers les soins infirmiers ou la garde clinique—jamais donner de conseils médicaux.',
              },
              {
                title: 'Signalements de sécurité et de chutes',
                description: 'Recueillir le minimum de faits, donner les étapes immédiates approuvées et escalader aussitôt vers des humains.',
              },
              {
                title: 'Questions de facturation et d’horaire',
                description: 'Répondre aux questions approuvées de facture et de fréquence de visite à partir des dossiers connectés.',
              },
              {
                title: 'Triage de garde hors des heures',
                description: 'Résoudre les FAQ approuvées la nuit et aviser le personnel de garde lorsque les seuils d’urgence sont atteints.',
              },
              {
                title: 'Briefs de relève',
                description: 'Résumer les écarts d’horaire ouverts, préoccupations des familles et escalades pour le prochain coordonnateur.',
              },
            ],
          },
        ],
        startTitle: 'Le meilleur point de départ',
        startLead: 'Commencez là où les appels des familles hors des heures et les changements de visite créent le plus de revenu manqué et de risque.',
        startWith: [
          'Réponse 24/7 aux demandes des familles',
          'Réservation d’évaluations et accueil du profil de soins',
          'Confirmations de visite et demandes de changement',
          'Escalade clinique et de sécurité urgente',
          'Résumés de transfert aux coordonnateurs',
        ],
        boundaryTitle: 'Des limites claires créent la confiance',
        boundaryLead:
          'Un employé IA coordonne l’accueil et la planification—il ne fournit pas de conseils de soins cliniques et ne remplace pas les professionnels de la santé réglementés.',
        boundaries: [
          'Aucun conseil médical, changement de plan de soins ou décision médicamenteuse—ces sujets escaladent vers des cliniciens qualifiés.',
          'Les renseignements de santé et de famille sensibles suivent uniquement vos règles de consentement, de confidentialité et de conservation.',
          'Sans accès d’écriture profond au système de planification, il demeure utile comme porte d’entrée : répondre à chaque demande, réserver des évaluations, saisir des détails complets et transmettre un résumé utilisable aux coordonnateurs.',
        ],
      },
      {
        id: 'municipal-public',
        label: 'Services municipaux et publics',
        shortLabel: 'Municipal',
        image: {
          src: '/images/insights/library/turn-custom-service-into-repeatable-offer.webp',
          alt: 'Bureau municipal et services publics pour demandes de résidents et soutien au comptoir',
        },
        positioning: 'La première ligne IA des guichets de service aux résidents',
        promise:
          'Répondre aux questions courantes des résidents, prendre les demandes de service, réserver des rendez-vous et acheminer les dossiers complexes au bon service—avec un résumé complet.',
        audiences: [
          {
            id: 'municipal-residents',
            label: 'Demandes et requêtes des résidents',
            lead: 'Les municipalités canadiennes reçoivent un fort volume de questions répétitives. Donnez des réponses rapides et un accueil de demande propre.',
            uses: [
              {
                title: 'Réception résidents toujours disponible',
                description: 'Répondre aux appels et messages après les heures du comptoir et pendant les pointes saisonnières sous la marque de la municipalité.',
              },
              {
                title: 'FAQ d’information sur les services',
                description: 'Communiquer heures, emplacements, frais, règles de recyclage, bases de permis et détails de programmes à partir du contenu officiel.',
              },
              {
                title: 'Accueil des demandes de service',
                description: 'Saisir enjeux de règlement, routes, parcs, eau et installations avec lieu, photos et coordonnées.',
              },
              {
                title: 'Réservation de rendez-vous',
                description: 'Réserver visites au comptoir, inspections ou consultations dans les calendriers de service approuvés.',
              },
              {
                title: 'Guidance formulaires et documents',
                description: 'Indiquer quels formulaires et preuves apporter; confirmer l’exhaustivité avant l’arrivée.',
              },
              {
                title: 'Acheminement bilingue',
                description: 'Servir les appelants EN/FR selon vos engagements linguistiques et acheminer vers le personnel capable au besoin.',
              },
              {
                title: 'Avis de panne et de perturbation',
                description: 'Communiquer le statut approuvé pour l’eau, les routes ou les installations et réduire les appels en double.',
              },
              {
                title: 'Transfert vers les services',
                description: 'Escalader les dossiers complexes, juridiques ou sensibles à la bonne équipe avec un résumé résident complet.',
              },
            ],
          },
          {
            id: 'municipal-ops',
            label: 'Opérations et soutien au comptoir',
            lead: 'Aidez le personnel à dégager les files avec un accueil structuré et moins de répétitions de la même politique.',
            uses: [
              {
                title: 'Triage et priorité des demandes',
                description: 'Classer demandes courantes vs urgentes selon des critères approuvés avant que le travail n’atteigne les équipes terrain.',
              },
              {
                title: 'Suivis de statut',
                description: 'Fournir un libellé de progrès approuvé sur les demandes ouvertes et recueillir des détails supplémentaires au besoin.',
              },
              {
                title: 'Soutien à la planification d’inspections',
                description: 'Coordonner fenêtres préférées et notes d’accès au site pour inspecteurs et résidents.',
              },
              {
                title: 'Questions de paiement et de compte',
                description: 'Répondre aux questions approuvées de taxes, services publics ou frais à partir des dossiers connectés; escalader les litiges.',
              },
              {
                title: 'Inscription aux événements et programmes',
                description: 'Aider les résidents à s’inscrire aux programmes approuvés ou aux listes d’attente lorsque les règles de capacité le permettent.',
              },
              {
                title: 'Acheminement d’urgences hors des heures',
                description: 'Saisir les incidents hors des heures et aviser les opérations de garde lorsque les seuils sont atteints.',
              },
              {
                title: 'Notes d’accessibilité et besoins particuliers',
                description: 'Enregistrer les exigences d’accès pour que le comptoir et le terrain soient préparés à l’interaction.',
              },
              {
                title: 'Briefs de relève et de comptoir',
                description: 'Résumer les demandes prioritaires ouvertes et les dossiers de comptoir inachevés pour la prochaine équipe.',
              },
            ],
          },
        ],
        startTitle: 'Le meilleur point de départ',
        startLead: 'Commencez par la déviation FAQ à fort volume et un accueil propre des demandes de service avant des écritures système plus profondes.',
        startWith: [
          'Réponse 24/7 aux demandes des résidents à partir du contenu approuvé',
          'Accueil des demandes de service avec lieu et photos',
          'Réservation de rendez-vous pour comptoirs et inspections',
          'Messages de statut de panne et de perturbation',
          'Résumés de transfert aux services',
        ],
        boundaryTitle: 'Des limites claires créent la confiance',
        boundaryLead:
          'Un employé IA est une porte d’entrée de service aux résidents—pas un décideur pour l’application des règlements, les prestations ou les déterminations juridiques.',
        boundaries: [
          'Aucune décision d’application, divulgation de dossiers confidentiels ou exception aux règlements ou taxes sans personnel autorisé.',
          'Les données personnelles et foncières suivent les règles municipales de confidentialité; vous définissez ce qui peut être recueilli, conservé et partagé.',
          'Sans accès d’écriture profond 311 ou ERP, il demeure utile comme porte d’entrée : répondre aux questions courantes, saisir des demandes complètes, réserver des rendez-vous et transmettre un résumé utilisable aux services.',
        ],
      },
    ],
    faqTitle: 'Questions que les dirigeants posent d’abord',
    faqs: [
      {
        question: 'Est-ce la même chose que ROALLA Agentic?',
        answer:
          'Non. Un employé IA est la première ligne conversationnelle—répondre, qualifier, réserver, documenter et transférer. ROALLA Agentic couvre des agents gouvernés à plusieurs étapes qui agissent dans les systèmes lorsque ce modèle est prêt.',
      },
      {
        question: 'Cela remplacera-t-il nos techniciens ou le personnel de bureau?',
        answer:
          'Il prend l’accueil courant, les réservations et le suivi pour que les personnes compétentes consacrent plus de temps aux jobs, aux soins, aux estimations et aux relations. Les personnes gardent le jugement, les approbations et les décisions à haut risque.',
      },
      {
        question: 'Faut-il tout intégrer dès le premier jour?',
        answer:
          'Non. Plusieurs équipes commencent par répondre, qualifier, planifier et transmettre des notes claires. Les actions plus profondes attendent que le déploiement, les systèmes de clinique, l’identité, les permissions et l’audit soient clairs.',
      },
      {
        question: 'Est-ce lié à un seul produit fournisseur?',
        answer:
          'ROALLA cadre d’abord les exigences sans parti pris fournisseur. Vous décidez de l’adéquation, des limites et des mesures avant de comparer les plateformes.',
      },
    ],
    finalTitle: 'Vérifiez si un employé IA convient à votre première ligne.',
    finalLead:
      'Utilisez la courte revue d’adéquation, ou dites-nous comment les demandes rejoignent votre équipe aujourd’hui. Nous vous aiderons à définir canaux, compétences, connaissances, intégrations et règles de transfert.',
    finalPrimaryCta: 'Vérifier l’adéquation d’un employé IA',
    finalSecondaryCta: 'Discuter de votre cas d’usage',
    distinctTitle: 'Besoin d’agents qui agissent dans les systèmes?',
    distinctBody: 'Quand le travail exige une automatisation multi-étapes avec approbations et outils, explorez ROALLA Agentic.',
    distinctLinkLabel: 'Explorer ROALLA Agentic',
    relatedTitle: 'Résultats liés sur ROALLA',
    relatedLead: 'L’employé IA se situe entre l’expérience de première ligne et l’automatisation gouvernée. Partez du résultat qui correspond à votre pression.',
    relatedLinks: [
      {
        groupId: 'automation-ai',
        label: 'Automatiser le travail et appliquer l’IA de façon responsable',
        description: 'Capacité, couverture en pointe et automatisation contrôlée—y compris l’employé IA comme option de première ligne.',
        image: {
          src: '/images/insights/library/what-to-automate-first.webp',
          alt: 'Résultats d’automatisation et d’IA, y compris l’employé IA en première ligne',
        },
      },
      {
        groupId: 'experience-products',
        label: 'Améliorer l’expérience clients et équipes',
        description: 'Communications, canaux de première ligne et expériences numériques où un employé IA commence souvent.',
        image: {
          src: '/images/insights/library/analog-to-ip-business-telephony.webp',
          alt: 'Parcours d’expérience client et de communications pour l’IA de première ligne',
        },
      },
    ],
  },
}
