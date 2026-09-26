import {
  INQUIRY_EMAIL_CUSTOMER_NOTE,
  INQUIRY_EMAIL_INTERNAL_NOTE,
  inquiryEmailButton,
  inquiryEmailParagraph,
  inquiryEmailPlainFooter,
  renderInquiryEmail,
} from "@/lib/inquiry-email";

export type ConsultationIntent =
  | "consulting"
  | "website"
  | "platform"
  | "automation"
  | "ai-support"
  | "digital-events"
  | "visibility"
  | "workshop"
  | "unsure";

export type ConsultationRequestPayload = {
  intent: ConsultationIntent;
  goal: string;
  timeline: string;
  consultingFocus?: string;
  websiteGoal?: string;
  hasExistingSite?: string;
  platformType?: string;
  automationGoal?: string;
  aiGoal?: string;
  eventGoal?: string;
  workshopTopic?: string;
  currentSiteUrl?: string;
  industry?: string;
  primaryOutcome?: string;
  systemsToConnect?: string;
  userScale?: string;
  budgetBand?: string;
  /** Portfolio item or vertical that inspired the inquiry */
  portfolioReference?: string;
  sourcePage?: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  locale?: string;
  /**
   * Slim digital path: name, email, optional company, service type, optional note.
   * Skips scary discovery / deep intake fields.
   */
  lightMode?: boolean;
  /** Honeypot — must be empty */
  website?: string;
};

/** Default note when light-mode submissions omit the optional one-liner. */
export const LIGHT_MODE_DEFAULT_GOAL =
  "Digital enablement inquiry — brief details to follow.";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const websiteGoalValues = [
  "new",
  "redesign",
  "conversion",
  "landing-booking",
  "maintain",
  "bilingual",
  "ecommerce",
] as const;
export type WebsiteGoal = (typeof websiteGoalValues)[number];

export const platformTypeValues = [
  "internal",
  "customer",
  "client-portal",
  "marketplace",
  "iot-dashboard",
  "ecommerce",
  "other",
] as const;
export type PlatformType = (typeof platformTypeValues)[number];

export const automationGoalValues = [
  "workflow",
  "integration",
  "both",
] as const;
export type AutomationGoal = (typeof automationGoalValues)[number];

export const aiGoalValues = [
  "scoring",
  "content-workflow",
  "custom-model",
  "exploring",
] as const;
export type AiGoal = (typeof aiGoalValues)[number];

export const eventGoalValues = [
  "booth",
  "microsite",
  "event-app",
  "activation",
] as const;
export type EventGoal = (typeof eventGoalValues)[number];

export const workshopTopicValues = [
  "focus-circle",
  "workload-conversation",
  "digital-calm",
  "decision-hour",
  "offer-page",
  "branding",
  "sales",
  "productivity",
  "ideation",
  "first-offer",
  "other",
] as const;
export type WorkshopTopic = (typeof workshopTopicValues)[number];

export const industryValues = [
  "fleet-logistics",
  "sports-recreation",
  "events-trade-shows",
  "education-training",
  "professional-services",
  "business-platforms",
  "other",
] as const;
export type Industry = (typeof industryValues)[number];

export const primaryOutcomeValues = [
  "leads",
  "bookings",
  "self-serve",
  "operations",
  "other",
] as const;
export type PrimaryOutcome = (typeof primaryOutcomeValues)[number];

export const userScaleValues = [
  "under-50",
  "50-500",
  "500-plus",
  "not-sure",
] as const;
export type UserScale = (typeof userScaleValues)[number];

export const budgetBandValues = [
  "under-15k",
  "15-50k",
  "50k-plus",
  "not-sure",
] as const;
export type BudgetBand = (typeof budgetBandValues)[number];

const websiteGoalsRequiringExistingSite = [
  "new",
  "redesign",
  "conversion",
  "landing-booking",
  "maintain",
  "bilingual",
  "ecommerce",
] as const;

const DIGITAL_INTENTS: ConsultationIntent[] = [
  "website",
  "platform",
  "automation",
  "ai-support",
  "digital-events",
  "visibility",
];

export function isDigitalIntent(
  intent: ConsultationIntent | "" | null | undefined,
): boolean {
  return !!intent && DIGITAL_INTENTS.includes(intent);
}

export function parseWebsiteGoal(value: unknown): WebsiteGoal | null {
  if (
    typeof value === "string" &&
    websiteGoalValues.includes(value as WebsiteGoal)
  ) {
    return value as WebsiteGoal;
  }
  return null;
}

export function parsePlatformType(value: unknown): PlatformType | null {
  if (
    typeof value === "string" &&
    platformTypeValues.includes(value as PlatformType)
  ) {
    return value as PlatformType;
  }
  return null;
}

export function parseAutomationGoal(value: unknown): AutomationGoal | null {
  if (
    typeof value === "string" &&
    automationGoalValues.includes(value as AutomationGoal)
  ) {
    return value as AutomationGoal;
  }
  return null;
}

export function parseAiGoal(value: unknown): AiGoal | null {
  if (typeof value === "string" && aiGoalValues.includes(value as AiGoal)) {
    return value as AiGoal;
  }
  return null;
}

export function parseEventGoal(value: unknown): EventGoal | null {
  if (
    typeof value === "string" &&
    eventGoalValues.includes(value as EventGoal)
  ) {
    return value as EventGoal;
  }
  return null;
}

export function parseWorkshopTopic(value: unknown): WorkshopTopic | null {
  if (
    typeof value === "string" &&
    workshopTopicValues.includes(value as WorkshopTopic)
  ) {
    return value as WorkshopTopic;
  }
  return null;
}

export function websiteGoalRequiresExistingSite(
  websiteGoal: string | undefined,
): boolean {
  return websiteGoalsRequiringExistingSite.includes(
    websiteGoal as (typeof websiteGoalsRequiringExistingSite)[number],
  );
}

/** Defaults for step-2 fields when URL prefill skips directly to contact (step 3). */
export function resolveSkippedStep2Defaults(
  intent: ConsultationIntent | null,
  fields: {
    timeline?: string;
    websiteGoal?: string;
    hasExistingSite?: string;
  },
  options?: { foundingOffer?: boolean },
): { timeline?: string; hasExistingSite?: string } {
  const patch: { timeline?: string; hasExistingSite?: string } = {};

  if (!fields.timeline?.trim()) {
    patch.timeline = options?.foundingOffer ? "1to3" : "exploring";
  }

  if (
    intent === "website" &&
    fields.websiteGoal === "new" &&
    !fields.hasExistingSite?.trim()
  ) {
    patch.hasExistingSite = "no";
  }

  return patch;
}

export function parseConsultationIntent(
  value: unknown,
): ConsultationIntent | null {
  const intents: ConsultationIntent[] = [
    "consulting",
    "website",
    "platform",
    "automation",
    "ai-support",
    "digital-events",
    "visibility",
    "workshop",
    "unsure",
  ];
  if (
    typeof value === "string" &&
    intents.includes(value as ConsultationIntent)
  ) {
    return value as ConsultationIntent;
  }
  return null;
}

export function intentFromServiceParam(
  service: string | null,
): ConsultationIntent | null {
  if (service === "websites-brand") return "website";
  if (service === "custom-platforms") return "platform";
  if (service === "digital-events") return "digital-events";
  if (service === "visibility") return "visibility";
  if (service === "workshops") return "workshop";
  return null;
}

/** Maps legacy `need` query params to intent (and optional sub-selection). */
export function intentFromNeedParam(
  need: string | null,
): ConsultationIntent | null {
  if (!need) return null;
  if (need === "custom-platform") return "platform";
  if (need === "automation" || need === "integration") return "automation";
  if (need === "ai-support") return "ai-support";
  if (need === "visibility-assessment") return "visibility";
  if (need === "workshop") return "workshop";
  if (parseWorkshopTopic(need)) return "workshop";
  if (parseWebsiteGoal(need)) return "website";
  if (parsePlatformType(need)) return "platform";
  if (parseEventGoal(need)) return "digital-events";
  return null;
}

export function automationGoalFromNeedParam(
  need: string | null,
): AutomationGoal | null {
  if (need === "automation") return "workflow";
  if (need === "integration") return "integration";
  if (need === "both") return "both";
  return parseAutomationGoal(need);
}

const consultingFocusValues = [
  "strategy",
  "operations",
  "team",
  "data",
  "innovation",
  "technology",
  "other",
] as const;
export type ConsultingFocus = (typeof consultingFocusValues)[number];

export function parseConsultingFocus(value: unknown): ConsultingFocus | null {
  if (
    typeof value === "string" &&
    consultingFocusValues.includes(value as ConsultingFocus)
  ) {
    return value as ConsultingFocus;
  }
  return null;
}

export function hasIntentSubSelection(
  intent: ConsultationIntent,
  fields: {
    consultingFocus?: string;
    websiteGoal?: string;
    platformType?: string;
    automationGoal?: string;
    aiGoal?: string;
    eventGoal?: string;
    workshopTopic?: string;
  },
): boolean {
  switch (intent) {
    case "consulting":
      return !!fields.consultingFocus?.trim();
    case "website":
      return !!fields.websiteGoal?.trim();
    case "platform":
      return !!fields.platformType?.trim();
    case "automation":
      return !!fields.automationGoal?.trim();
    case "ai-support":
      return !!fields.aiGoal?.trim();
    case "digital-events":
      return !!fields.eventGoal?.trim();
    case "workshop":
      return !!fields.workshopTopic?.trim();
    default:
      return true;
  }
}

export function validateConsultationRequest(
  body: Partial<ConsultationRequestPayload>,
): string | null {
  if (body.website) return "Invalid submission";

  const intent = parseConsultationIntent(body.intent);
  if (!intent) return "Please select what you need help with";

  if (!body.name?.trim()) return "Name is required";
  if (!body.email?.trim() || !EMAIL_REGEX.test(body.email.trim())) {
    return "A valid email address is required";
  }

  // Slim digital path: service type + contact + optional one-line note only.
  if (body.lightMode) {
    if (
      intent === "consulting" ||
      intent === "workshop"
    ) {
      return "Light mode is only available for digital service requests";
    }
    if (body.goal?.trim() && body.goal.trim().length < 3) {
      return "Please add a short note (at least 3 characters) or leave it blank";
    }
    return null;
  }

  if (!body.goal?.trim() || body.goal.trim().length < 5) {
    return "Please describe your goal or challenge (at least 5 characters)";
  }

  if (!body.timeline?.trim()) return "Please select a timeline";

  if (intent === "consulting" && !body.consultingFocus?.trim()) {
    return "Please select a consulting focus area";
  }
  if (intent === "website") {
    if (!body.websiteGoal?.trim()) return "Please select what you need";
    if (
      websiteGoalRequiresExistingSite(body.websiteGoal) &&
      !body.hasExistingSite?.trim()
    ) {
      return "Please indicate if you have an existing website";
    }
    if (body.hasExistingSite === "yes" && body.currentSiteUrl?.trim()) {
      try {
        const url = new URL(
          body.currentSiteUrl.startsWith("http")
            ? body.currentSiteUrl
            : `https://${body.currentSiteUrl}`,
        );
        if (!url.hostname) return "Please enter a valid website URL";
      } catch {
        return "Please enter a valid website URL";
      }
    }
  }
  if (intent === "platform" && !body.platformType?.trim()) {
    return "Please select a platform type";
  }
  if (intent === "automation" && !body.automationGoal?.trim()) {
    return "Please select an automation focus";
  }
  if (intent === "ai-support" && !body.aiGoal?.trim()) {
    return "Please select an AI focus area";
  }
  if (intent === "digital-events" && !body.eventGoal?.trim()) {
    return "Please select an event deliverable";
  }
  if (intent === "workshop" && !body.workshopTopic?.trim()) {
    return "Please select a workshop topic";
  }

  return null;
}

export function buildConsultationEmailSubject(
  name: string,
  intent: ConsultationIntent,
): string {
  const labels: Record<ConsultationIntent, string> = {
    consulting: "Programs / advisory",
    website: "Website Project",
    platform: "Custom Platform",
    automation: "Integrations & Automation",
    "ai-support": "AI Support",
    "digital-events": "Digital Events",
    visibility: "Digital Visibility Optimization",
    workshop: "Workshops & Skill Building",
    unsure: "General Inquiry",
  };
  return `Service Inquiry — ${labels[intent]} — ${name}`;
}

export function escapeHtml(value: string): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function appendIntentSpecificRows(
  data: ConsultationRequestPayload,
  rows: [string, string][],
  labels: Record<string, string>,
): void {
  if (data.intent === "consulting" && data.consultingFocus) {
    rows.push([
      labels.consultingFocus,
      labels[`focus_${data.consultingFocus}`] ?? data.consultingFocus,
    ]);
  }
  if (data.intent === "website") {
    if (data.websiteGoal) {
      rows.push([
        labels.websiteGoal,
        labels[`websiteGoal_${data.websiteGoal}`] ?? data.websiteGoal,
      ]);
    }
    if (data.hasExistingSite) {
      rows.push([
        labels.hasExistingSite,
        labels[`yesNo_${data.hasExistingSite}`] ?? data.hasExistingSite,
      ]);
    }
    if (data.currentSiteUrl?.trim()) {
      rows.push([labels.currentSiteUrl, data.currentSiteUrl.trim()]);
    }
  }
  if (data.intent === "platform" && data.platformType) {
    rows.push([
      labels.platformType,
      labels[`platform_${data.platformType}`] ?? data.platformType,
    ]);
  }
  if (data.intent === "automation" && data.automationGoal) {
    rows.push([
      labels.automationGoal,
      labels[`automationGoal_${data.automationGoal}`] ?? data.automationGoal,
    ]);
  }
  if (data.intent === "ai-support" && data.aiGoal) {
    rows.push([labels.aiGoal, labels[`aiGoal_${data.aiGoal}`] ?? data.aiGoal]);
  }
  if (data.intent === "digital-events" && data.eventGoal) {
    rows.push([
      labels.eventGoal,
      labels[`eventGoal_${data.eventGoal}`] ?? data.eventGoal,
    ]);
  }
  if (data.intent === "workshop" && data.workshopTopic) {
    rows.push([
      labels.workshopTopic,
      labels[`workshopTopic_${data.workshopTopic}`] ?? data.workshopTopic,
    ]);
  }
  if (data.industry?.trim()) {
    rows.push([
      labels.industry,
      labels[`industry_${data.industry}`] ?? data.industry,
    ]);
  }
  if (data.primaryOutcome?.trim()) {
    rows.push([
      labels.primaryOutcome,
      labels[`outcome_${data.primaryOutcome}`] ?? data.primaryOutcome,
    ]);
  }
  if (data.systemsToConnect?.trim()) {
    rows.push([labels.systemsToConnect, data.systemsToConnect.trim()]);
  }
  if (data.userScale?.trim()) {
    rows.push([
      labels.userScale,
      labels[`userScale_${data.userScale}`] ?? data.userScale,
    ]);
  }
  if (data.budgetBand?.trim()) {
    rows.push([
      labels.budgetBand,
      labels[`budgetBand_${data.budgetBand}`] ?? data.budgetBand,
    ]);
  }
  if (data.portfolioReference?.trim()) {
    rows.push([labels.portfolioReference, data.portfolioReference.trim()]);
  }
  if (data.sourcePage?.trim()) {
    rows.push([labels.sourcePage, data.sourcePage.trim()]);
  }
}

export function buildConsultationSalesEmailHtml(
  data: ConsultationRequestPayload,
  labels: Record<string, string>,
  submittedAt: string,
  origin: string,
  options?: {
    discoveryUrl?: string | null;
    submissionId?: string;
  },
): string {
  const rows: [string, string][] = [
    [labels.intent, labels[`intent_${data.intent}`] ?? data.intent],
    [labels.goal, data.goal.trim()],
    [labels.timeline, labels[`timeline_${data.timeline}`] ?? data.timeline],
  ];

  if (data.lightMode) {
    rows.push([labels.formPath, labels.formPathLight]);
  }

  appendIntentSpecificRows(data, rows, labels);

  rows.push(
    [labels.name, data.name.trim()],
    [labels.email, data.email.trim()],
    [labels.company, data.company?.trim() || labels.notProvided],
    [labels.phone, data.phone?.trim() || labels.notProvided],
    [labels.submittedAt, submittedAt],
    [labels.source, origin],
  );

  if (options?.submissionId) {
    rows.push([labels.submissionId, options.submissionId]);
  }
  if (data.locale) rows.push([labels.locale, data.locale]);

  const detailRows = rows
    .filter((row): row is [string, string] => Boolean(row[0] && row[1]))
    .map(([label, value]) => {
      const cell = "padding:12px 14px;border-bottom:1px solid #e2e8f0;font-family:Arial,Helvetica,sans-serif;vertical-align:top;";
      return `<tr><td width="38%" bgcolor="#f8fafc" style="${cell}width:38%;font-size:12px;line-height:1.45;color:#5b6b7c;font-weight:bold;">${escapeHtml(label)}</td><td bgcolor="#ffffff" style="${cell}font-size:14px;line-height:1.5;color:#1e293b;white-space:pre-wrap;word-break:break-word;">${formatInquiryDetailValue(label, value, labels)}</td></tr>`;
    })
    .join("");

  const discoveryBlock = options?.discoveryUrl
    ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;">
          <tr>
            <td bgcolor="#eefbfd" style="background-color:#eefbfd;border:1px solid #c5eef3;padding:18px 18px 16px;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.4;letter-spacing:0.08em;text-transform:uppercase;color:#007a87;font-weight:bold;">${escapeHtml(labels.discoveryHeading)}</p>
              <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#334155;">${escapeHtml(labels.discoverySalesHint)}</p>
              <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;word-break:break-all;"><a href="${escapeHtml(options.discoveryUrl)}" style="color:#007a87;text-decoration:none;">${escapeHtml(options.discoveryUrl)}</a></p>
              ${inquiryEmailButton(options.discoveryUrl, labels.discoveryCta || "Open the brief", "left")}
              <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:#5b6b7c;">${escapeHtml(labels.reminderSalesHint)}</p>
            </td>
          </tr>
        </table>`
    : "";

  return renderInquiryEmail({
    title: labels.emailHeading,
    preheader: `New service inquiry from ${data.name.trim()}.`,
    eyebrow: labels.emailEyebrow || "Sales desk",
    headline: labels.emailHeading,
    footerNote: INQUIRY_EMAIL_INTERNAL_NOTE,
    bodyHtml: `
      ${inquiryEmailParagraph(escapeHtml(labels.emailIntro))}
      ${inquiryEmailParagraph("Reply to this message to write to the client directly.")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;">${detailRows}</table>
      ${discoveryBlock}
    `,
  });
}

export function buildConsultationSalesEmailText(
  data: ConsultationRequestPayload,
  labels: Record<string, string>,
  submittedAt: string,
  origin: string,
  options?: {
    discoveryUrl?: string | null;
    submissionId?: string;
  },
): string {
  const lines = [
    labels.emailHeading,
    "",
    `${labels.intent}: ${labels[`intent_${data.intent}`] ?? data.intent}`,
    `${labels.goal}: ${data.goal.trim()}`,
    `${labels.timeline}: ${labels[`timeline_${data.timeline}`] ?? data.timeline}`,
  ];

  if (data.lightMode) {
    lines.push(`${labels.formPath}: ${labels.formPathLight}`);
  }

  const rowCapture: [string, string][] = [];
  appendIntentSpecificRows(data, rowCapture, labels);
  for (const [label, value] of rowCapture) {
    lines.push(`${label}: ${value}`);
  }

  lines.push(
    "",
    `${labels.name}: ${data.name.trim()}`,
    `${labels.email}: ${data.email.trim()}`,
    `${labels.company}: ${data.company?.trim() || labels.notProvided}`,
    `${labels.phone}: ${data.phone?.trim() || labels.notProvided}`,
    `${labels.submittedAt}: ${submittedAt}`,
    `${labels.source}: ${origin}`,
  );

  if (options?.submissionId) {
    lines.push(`${labels.submissionId}: ${options.submissionId}`);
  }
  if (data.locale) lines.push(`${labels.locale}: ${data.locale}`);

  if (options?.discoveryUrl) {
    lines.push(
      "",
      labels.discoveryHeading,
      labels.discoverySalesHint,
      options.discoveryUrl,
      "",
      labels.reminderSalesHint,
    );
  }

  lines.push(
    "",
    "Reply to this message to write to the client directly.",
    inquiryEmailPlainFooter(INQUIRY_EMAIL_INTERNAL_NOTE),
  );

  return lines.join("\n");
}

export function buildConsultationUserConfirmationHtml(
  data: ConsultationRequestPayload,
  labels: Record<string, string>,
  options?: { discoveryUrl?: string | null; submissionId?: string },
): string {
  const intentLabel = labels[`intent_${data.intent}`] ?? data.intent;
  const summaryRows: [string, string][] = [
    [labels.intent || "Request", intentLabel],
  ];
  if (data.company?.trim()) {
    summaryRows.push([labels.company || "Company", data.company.trim()]);
  }
  if (
    data.goal.trim() &&
    data.goal.trim() !== LIGHT_MODE_DEFAULT_GOAL
  ) {
    summaryRows.push([labels.goal || "Note", data.goal.trim()]);
  }
  if (options?.submissionId) {
    summaryRows.push([labels.submissionId || "Reference", options.submissionId]);
  }

  const summary = summaryRows
    .map(([label, value], index) => {
      const pad = index === summaryRows.length - 1 ? "0" : "0 0 12px";
      return `<tr><td style="padding:${pad};font-family:Arial,Helvetica,sans-serif;"><p style="margin:0 0 2px;font-size:12px;line-height:1.4;color:#5b6b7c;">${escapeHtml(label)}</p><p style="margin:0;font-size:15px;line-height:1.5;color:#1e293b;">${escapeHtml(value)}</p></td></tr>`;
    })
    .join("");

  const nextSteps = [
    labels.userNext1 || "A personal review by the Roalla team.",
    labels.userNext2 || "A recommended entry point and clear next steps.",
    labels.userNext3 || "A reply within one business day.",
  ];
  const nextRows = nextSteps
    .map((step, index) => {
      return `<tr><td valign="top" width="28" style="padding:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;font-weight:bold;color:#007a87;">${index + 1}</td><td valign="top" style="padding:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#1e293b;">${escapeHtml(step)}</td></tr>`;
    })
    .join("");

  const discoveryBlock = options?.discoveryUrl
    ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;">
          <tr>
            <td bgcolor="#eefbfd" style="background-color:#eefbfd;border:1px solid #c5eef3;padding:20px 18px;text-align:center;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.4;letter-spacing:0.08em;text-transform:uppercase;color:#007a87;font-weight:bold;">${escapeHtml(labels.userDiscoveryEyebrow)}</p>
              <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#334155;">${escapeHtml(labels.userDiscoveryBody)}</p>
              ${inquiryEmailButton(options.discoveryUrl, labels.userDiscoveryCta)}
            </td>
          </tr>
        </table>`
    : "";

  const signoff = (labels.userSignoff || "Best regards,\nThe ROALLA Team")
    .split("\n")
    .map((line, index, lines) =>
      index === lines.length - 1
        ? `<strong>${escapeHtml(line)}</strong>`
        : escapeHtml(line),
    )
    .join("<br>");

  return renderInquiryEmail({
    title: labels.userHtmlHeading,
    preheader:
      labels.userPreheader ||
      "Your inquiry is with the Roalla team. We reply within one business day.",
    eyebrow: labels.userEyebrow || "Service inquiry",
    headline: labels.userHtmlHeading,
    footerNote: INQUIRY_EMAIL_CUSTOMER_NOTE,
    bodyHtml: `
      ${inquiryEmailParagraph(`Dear ${escapeHtml(data.name.trim())},`)}
      ${inquiryEmailParagraph(escapeHtml(labels.userGreeting))}
      ${inquiryEmailParagraph(escapeHtml(labels.userBody))}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 22px;">
        <tr>
          <td bgcolor="#f4f7fb" style="background-color:#f4f7fb;border:1px solid #e2e8f0;border-left:3px solid #00b4c5;padding:16px 18px;">
            <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.4;letter-spacing:0.08em;text-transform:uppercase;color:#007a87;font-weight:bold;">${escapeHtml(labels.userSummaryHeading || "Your inquiry")}</p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">${summary}</table>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.4;letter-spacing:0.08em;text-transform:uppercase;color:#007a87;font-weight:bold;">${escapeHtml(labels.userNextHeading || "What happens next")}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;">${nextRows}</table>
      ${discoveryBlock}
      ${inquiryEmailParagraph(escapeHtml(labels.userUrgent))}
      <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#1e293b;">${signoff}</p>
    `,
  });
}

export function buildConsultationUserConfirmationText(
  data: ConsultationRequestPayload,
  labels: Record<string, string>,
  options?: { discoveryUrl?: string | null; submissionId?: string },
): string {
  const intentLabel = labels[`intent_${data.intent}`] ?? data.intent;
  const lines = [
    `Dear ${data.name.trim()},`,
    "",
    labels.userGreeting,
    "",
    labels.userBody,
    "",
    labels.userSummaryHeading || "Your inquiry",
    `${labels.intent || "Request"}: ${intentLabel}`,
  ];

  if (data.company?.trim()) {
    lines.push(`${labels.company || "Company"}: ${data.company.trim()}`);
  }
  if (data.goal.trim() && data.goal.trim() !== LIGHT_MODE_DEFAULT_GOAL) {
    lines.push(`${labels.goal || "Note"}: ${data.goal.trim()}`);
  }
  if (options?.submissionId) {
    lines.push(`${labels.submissionId || "Reference"}: ${options.submissionId}`);
  }

  lines.push(
    "",
    labels.userNextHeading || "What happens next",
    `1. ${labels.userNext1 || "A personal review by the Roalla team."}`,
    `2. ${labels.userNext2 || "A recommended entry point and clear next steps."}`,
    `3. ${labels.userNext3 || "A reply within one business day."}`,
  );

  if (options?.discoveryUrl) {
    lines.push(
      "",
      labels.userDiscoveryEyebrow,
      labels.userDiscoveryBody,
      options.discoveryUrl,
    );
  }

  lines.push(
    "",
    labels.userUrgent,
    "",
    labels.userSignoff,
    inquiryEmailPlainFooter(INQUIRY_EMAIL_CUSTOMER_NOTE),
  );
  return lines.join("\n");
}

export function buildConsultationReminderHtml(
  name: string,
  discoveryUrl: string,
  labels: Record<string, string>,
): string {
  const signoff = (labels.userSignoff || "Best regards,\nThe ROALLA Team")
    .split("\n")
    .map((line, index, lines) =>
      index === lines.length - 1
        ? `<strong>${escapeHtml(line)}</strong>`
        : escapeHtml(line),
    )
    .join("<br>");

  return renderInquiryEmail({
    title: labels.reminderSubject,
    preheader: "A short digital brief is ready whenever you are. We will still follow up.",
    eyebrow: "Service inquiry",
    headline: labels.reminderSubject,
    footerNote: INQUIRY_EMAIL_CUSTOMER_NOTE,
    bodyHtml: `
      ${inquiryEmailParagraph(`Dear ${escapeHtml(name)},`)}
      ${inquiryEmailParagraph(escapeHtml(labels.reminderBody))}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 18px;">
        <tr>
          <td align="center">${inquiryEmailButton(discoveryUrl, labels.reminderCta)}</td>
        </tr>
      </table>
      ${inquiryEmailParagraph(`<span style="color:#5b6b7c;">${escapeHtml(labels.reminderFooter)}</span>`)}
      <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#1e293b;">${signoff}</p>
    `,
  });
}

export function buildConsultationReminderText(
  name: string,
  discoveryUrl: string,
  labels: Record<string, string>,
): string {
  return [
    `Dear ${name},`,
    "",
    labels.reminderBody,
    "",
    discoveryUrl,
    "",
    labels.reminderFooter,
    "",
    labels.userSignoff,
    inquiryEmailPlainFooter(INQUIRY_EMAIL_CUSTOMER_NOTE),
  ].join("\n");
}

function formatInquiryDetailValue(
  label: string,
  value: string,
  labels: Record<string, string>,
): string {
  const safe = escapeHtml(value);
  if (label === labels.email && value.includes("@")) {
    return `<a href="mailto:${safe}" style="color:#007a87;text-decoration:none;">${safe}</a>`;
  }
  if (label === labels.phone && value !== labels.notProvided) {
    const href = `tel:${value.replace(/[^\d+]/g, "")}`;
    return `<a href="${escapeHtml(href)}" style="color:#007a87;text-decoration:none;">${safe}</a>`;
  }
  if (/^https?:\/\//i.test(value)) {
    return `<a href="${safe}" style="color:#007a87;text-decoration:none;word-break:break-all;">${safe}</a>`;
  }
  return safe;
}
