/**
 * Structured engagement packet for estimate-backed contact handoffs,
 * plus branded planning-report email builders.
 */

import {
  INQUIRY_EMAIL_CUSTOMER_NOTE,
  INQUIRY_EMAIL_INTERNAL_NOTE,
  inquiryEmailButton,
  inquiryEmailParagraph,
  inquiryEmailPlainFooter,
  renderInquiryEmail,
} from "@/lib/inquiry-email";

export const ENGAGEMENT_KINDS = [
  "visibility-estimate",
  "email-reach-estimate",
  "website-estimate",
  "workshop-estimate",
] as const;
export type EngagementKind = (typeof ENGAGEMENT_KINDS)[number];

export type EngagementEstimateLineItem = {
  label: string;
  amount: string;
};

export type EngagementEstimate = {
  total: string;
  summary: string;
  lineItems?: EngagementEstimateLineItem[];
  referralCode?: string;
  region?: string;
  pricingVersion?: string;
  taxReady?: boolean;
};

export type EngagementEvidence = {
  toolName: string;
  url?: string;
  priorities: string[];
  scores?: Record<string, number | null | undefined>;
  asOf?: string;
};

export type EngagementAttribution = {
  campaign?: string;
  entry_page?: string;
  signal?: string;
  selected_problem?: string;
  conversion_source?: string;
  offer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
};

export type ConsultationEngagement = {
  kind: EngagementKind;
  website?: string;
  fromTool?: string;
  attribution?: EngagementAttribution;
  estimate: EngagementEstimate;
  evidence?: EngagementEvidence;
  disclaimer?: string;
};

/** Minimal inquiry fields needed by planning-report builders. */
export type PlanningReportInquiry = {
  intent: string;
  goal: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  sourcePage?: string;
  engagement?: ConsultationEngagement;
};

export const ENGAGEMENT_CAPS = {
  website: 240,
  fromTool: 80,
  attributionValue: 240,
  estimateTotal: 120,
  estimateSummary: 2000,
  lineItems: 20,
  lineItemLabel: 200,
  lineItemAmount: 80,
  referralCode: 40,
  region: 80,
  pricingVersion: 40,
  evidenceToolName: 80,
  evidenceUrl: 240,
  priorities: 7,
  priorityLine: 200,
  scoreKeys: 12,
  asOf: 48,
  disclaimer: 600,
  engagementEvidenceSummary: 480,
  /** Hard reject when serialized engagement exceeds this (bytes, approx via UTF-16 length). */
  maxSerializedChars: 16_000,
} as const;

const DEFAULT_DISCLAIMER =
  "Preliminary planning figures only — non-binding until confirmed in writing.";

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function asTrimmedString(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const clipped = clip(value, max);
  return clipped || undefined;
}

export function parseEngagementKind(value: unknown): EngagementKind | null {
  if (
    typeof value === "string" &&
    ENGAGEMENT_KINDS.includes(value as EngagementKind)
  ) {
    return value as EngagementKind;
  }
  return null;
}

function parseLineItems(raw: unknown): EngagementEstimateLineItem[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const items: EngagementEstimateLineItem[] = [];
  for (const row of raw.slice(0, ENGAGEMENT_CAPS.lineItems)) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const label = asTrimmedString(record.label, ENGAGEMENT_CAPS.lineItemLabel);
    const amount = asTrimmedString(record.amount, ENGAGEMENT_CAPS.lineItemAmount);
    if (label && amount) items.push({ label, amount });
  }
  return items.length ? items : undefined;
}

function parseScores(
  raw: unknown,
): Record<string, number | null | undefined> | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const out: Record<string, number | null | undefined> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>).slice(
    0,
    ENGAGEMENT_CAPS.scoreKeys,
  )) {
    const safeKey = clip(key, 40);
    if (!safeKey) continue;
    if (value === null || value === undefined) {
      out[safeKey] = value;
    } else if (typeof value === "number" && Number.isFinite(value)) {
      out[safeKey] = value;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

function parseAttribution(raw: unknown): EngagementAttribution | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const source = raw as Record<string, unknown>;
  const attribution: EngagementAttribution = {};
  const keys: (keyof EngagementAttribution)[] = [
    "campaign",
    "entry_page",
    "signal",
    "selected_problem",
    "conversion_source",
    "offer",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
  ];
  for (const key of keys) {
    const value = asTrimmedString(source[key], ENGAGEMENT_CAPS.attributionValue);
    if (value) attribution[key] = value;
  }
  return Object.keys(attribution).length ? attribution : undefined;
}

function parseEvidence(raw: unknown): EngagementEvidence | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const source = raw as Record<string, unknown>;
  const toolName = asTrimmedString(
    source.toolName ?? source.tool,
    ENGAGEMENT_CAPS.evidenceToolName,
  );
  if (!toolName) return undefined;

  const prioritiesRaw = Array.isArray(source.priorities) ? source.priorities : [];
  const priorities = prioritiesRaw
    .filter((line): line is string => typeof line === "string")
    .map((line) => clip(line, ENGAGEMENT_CAPS.priorityLine))
    .filter(Boolean)
    .slice(0, ENGAGEMENT_CAPS.priorities);

  const evidence: EngagementEvidence = {
    toolName,
    priorities,
  };
  const url = asTrimmedString(
    source.url ?? source.domain,
    ENGAGEMENT_CAPS.evidenceUrl,
  );
  if (url) evidence.url = url;
  const scores = parseScores(source.scores);
  if (scores) evidence.scores = scores;
  const asOf = asTrimmedString(source.asOf, ENGAGEMENT_CAPS.asOf);
  if (asOf) evidence.asOf = asOf;
  return evidence;
}

export type ParseEngagementResult =
  | { ok: true; engagement?: ConsultationEngagement }
  | { ok: false; error: string };

/**
 * Parse/validate optional engagement from a POST body.
 * Truncates oversized fields; rejects only when structure is present but unusable
 * or the packet exceeds the hard size cap.
 */
export function parseEngagementFromBody(raw: unknown): ParseEngagementResult {
  if (raw === undefined || raw === null) {
    return { ok: true, engagement: undefined };
  }
  if (typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "Invalid engagement packet" };
  }

  try {
    const serialized = JSON.stringify(raw);
    if (serialized.length > ENGAGEMENT_CAPS.maxSerializedChars) {
      return { ok: false, error: "Engagement packet is too large" };
    }
  } catch {
    return { ok: false, error: "Invalid engagement packet" };
  }

  const source = raw as Record<string, unknown>;
  const kind = parseEngagementKind(source.kind);
  if (!kind) {
    return { ok: false, error: "Invalid engagement kind" };
  }

  const estimateRaw =
    source.estimate && typeof source.estimate === "object" && !Array.isArray(source.estimate)
      ? (source.estimate as Record<string, unknown>)
      : null;
  if (!estimateRaw) {
    return { ok: false, error: "Engagement estimate is required" };
  }

  const total = asTrimmedString(estimateRaw.total, ENGAGEMENT_CAPS.estimateTotal);
  const summary = asTrimmedString(
    estimateRaw.summary,
    ENGAGEMENT_CAPS.estimateSummary,
  );
  if (!total || !summary) {
    return { ok: false, error: "Engagement estimate total and summary are required" };
  }

  const estimate: EngagementEstimate = {
    total,
    summary,
  };
  const lineItems = parseLineItems(estimateRaw.lineItems);
  if (lineItems) estimate.lineItems = lineItems;
  const referralCode = asTrimmedString(
    estimateRaw.referralCode,
    ENGAGEMENT_CAPS.referralCode,
  );
  if (referralCode) estimate.referralCode = referralCode;
  const region = asTrimmedString(estimateRaw.region, ENGAGEMENT_CAPS.region);
  if (region) estimate.region = region;
  const pricingVersion = asTrimmedString(
    estimateRaw.pricingVersion,
    ENGAGEMENT_CAPS.pricingVersion,
  );
  if (pricingVersion) estimate.pricingVersion = pricingVersion;
  if (typeof estimateRaw.taxReady === "boolean") {
    estimate.taxReady = estimateRaw.taxReady;
  }

  const engagement: ConsultationEngagement = {
    kind,
    estimate,
  };

  const website = asTrimmedString(source.website, ENGAGEMENT_CAPS.website);
  if (website) engagement.website = website;
  const fromTool = asTrimmedString(source.fromTool, ENGAGEMENT_CAPS.fromTool);
  if (fromTool) engagement.fromTool = fromTool;
  const attribution = parseAttribution(source.attribution);
  if (attribution) engagement.attribution = attribution;
  const evidence = parseEvidence(source.evidence);
  if (evidence) engagement.evidence = evidence;
  const disclaimer = asTrimmedString(source.disclaimer, ENGAGEMENT_CAPS.disclaimer);
  engagement.disclaimer = disclaimer || DEFAULT_DISCLAIMER;

  return { ok: true, engagement };
}

function inferEngagementKind(options: {
  estimateTool?: string | null;
  fromPage?: string | null;
  fromTool?: string | null;
}): EngagementKind | null {
  const tool = options.estimateTool?.trim().toLowerCase() || "";
  if (tool === "visibility" || tool === "visibility-estimate") {
    return "visibility-estimate";
  }
  if (tool === "email" || tool === "email-reach" || tool === "email-reach-estimate") {
    return "email-reach-estimate";
  }
  if (tool === "website" || tool === "website-estimate") return "website-estimate";
  if (tool === "workshop" || tool === "workshop-estimate") return "workshop-estimate";

  const page = options.fromPage?.trim().toLowerCase() || "";
  if (page.includes("visibility-improvement-estimate")) return "visibility-estimate";
  if (page.includes("email-reach-estimate")) return "email-reach-estimate";
  if (page.includes("website-estimate")) return "website-estimate";
  if (page.includes("workshop-estimate")) return "workshop-estimate";

  const fromTool = options.fromTool?.trim().toLowerCase() || "";
  if (fromTool === "digital-presence-snapshot") return "visibility-estimate";
  if (fromTool === "email-reach-brief") return "email-reach-estimate";

  return null;
}

export type AssembleEngagementInput = {
  estimateTotal?: string | null;
  estimateSummary?: string | null;
  website?: string | null;
  fromTool?: string | null;
  engagementEvidence?: string | null;
  estimateReferralCode?: string | null;
  estimateRegion?: string | null;
  estimateTool?: string | null;
  fromPage?: string | null;
  pricingVersion?: string | null;
  attribution?: EngagementAttribution | null;
  evidence?: {
    toolName?: string;
    tool?: string;
    url?: string;
    domain?: string;
    priorities?: string[];
    scores?: Record<string, number | null | undefined>;
    asOf?: string;
  } | null;
  lineItems?: EngagementEstimateLineItem[] | null;
  disclaimer?: string | null;
  kind?: string | null;
};

/** Client/server helper: build a truncated engagement packet from contact URL + evidence. */
export function assembleEngagementFromContactHandoff(
  input: AssembleEngagementInput,
): ConsultationEngagement | null {
  const total = asTrimmedString(input.estimateTotal, ENGAGEMENT_CAPS.estimateTotal);
  const summary = asTrimmedString(
    input.estimateSummary,
    ENGAGEMENT_CAPS.estimateSummary,
  );
  if (!total || !summary) return null;

  const kind =
    parseEngagementKind(input.kind) ||
    inferEngagementKind({
      estimateTool: input.estimateTool,
      fromPage: input.fromPage,
      fromTool: input.fromTool,
    });
  if (!kind) return null;

  const estimate: EngagementEstimate = { total, summary };
  const referralCode = asTrimmedString(
    input.estimateReferralCode,
    ENGAGEMENT_CAPS.referralCode,
  );
  if (referralCode) estimate.referralCode = referralCode;
  const region = asTrimmedString(input.estimateRegion, ENGAGEMENT_CAPS.region);
  if (region) estimate.region = region;
  const pricingVersion = asTrimmedString(
    input.pricingVersion,
    ENGAGEMENT_CAPS.pricingVersion,
  );
  if (pricingVersion) estimate.pricingVersion = pricingVersion;
  const lineItems = parseLineItems(input.lineItems ?? undefined);
  if (lineItems) estimate.lineItems = lineItems;

  const engagement: ConsultationEngagement = {
    kind,
    estimate,
    disclaimer:
      asTrimmedString(input.disclaimer, ENGAGEMENT_CAPS.disclaimer) ||
      DEFAULT_DISCLAIMER,
  };

  const website = asTrimmedString(input.website, ENGAGEMENT_CAPS.website);
  if (website) engagement.website = website;
  const fromTool = asTrimmedString(input.fromTool, ENGAGEMENT_CAPS.fromTool);
  if (fromTool) engagement.fromTool = fromTool;
  const attribution = parseAttribution(input.attribution ?? undefined);
  if (attribution) engagement.attribution = attribution;

  let evidence = parseEvidence(input.evidence ?? undefined);
  if (!evidence) {
    const light = asTrimmedString(
      input.engagementEvidence,
      ENGAGEMENT_CAPS.engagementEvidenceSummary,
    );
    if (light) {
      evidence = {
        toolName: fromTool || kind,
        priorities: [light],
        ...(website ? { url: website } : {}),
      };
    }
  }
  if (evidence) engagement.evidence = evidence;

  return engagement;
}

function escapeHtml(value: string): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function kindLabel(kind: EngagementKind, labels: Record<string, string>): string {
  return labels[`engagementKind_${kind}`] ?? kind;
}

function sectionHeading(text: string): string {
  return `<p style="margin:22px 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.4;letter-spacing:0.08em;text-transform:uppercase;color:#007a87;font-weight:bold;">${escapeHtml(text)}</p>`;
}

function detailTable(rows: [string, string][]): string {
  const body = rows
    .filter(([label, value]) => Boolean(label && value))
    .map(([label, value]) => {
      const cell =
        "padding:12px 14px;border-bottom:1px solid #e2e8f0;font-family:Arial,Helvetica,sans-serif;vertical-align:top;";
      return `<tr><td width="38%" bgcolor="#f8fafc" style="${cell}width:38%;font-size:12px;line-height:1.45;color:#5b6b7c;font-weight:bold;">${escapeHtml(label)}</td><td bgcolor="#ffffff" style="${cell}font-size:14px;line-height:1.5;color:#1e293b;white-space:pre-wrap;word-break:break-word;">${escapeHtml(value)}</td></tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;">${body}</table>`;
}

function estimateTableHtml(
  engagement: ConsultationEngagement,
  labels: Record<string, string>,
): string {
  const rows: string[] = [];
  const lineItems = engagement.estimate.lineItems;
  if (lineItems?.length) {
    for (const item of lineItems) {
      rows.push(
        `<tr><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1e293b;">${escapeHtml(item.label)}</td><td align="right" style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1e293b;white-space:nowrap;">${escapeHtml(item.amount)}</td></tr>`,
      );
    }
  } else {
    rows.push(
      `<tr><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1e293b;white-space:pre-wrap;">${escapeHtml(engagement.estimate.summary)}</td><td align="right" style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1e293b;white-space:nowrap;">${escapeHtml(engagement.estimate.total)}</td></tr>`,
    );
  }
  rows.push(
    `<tr><td style="padding:12px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#007a87;">${escapeHtml(labels.estimateTotal || "Preliminary total")}</td><td align="right" style="padding:12px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#04101f;">${escapeHtml(engagement.estimate.total)}</td></tr>`,
  );
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;">${rows.join("")}</table>`;
}

function journeyRows(
  data: PlanningReportInquiry,
  engagement: ConsultationEngagement,
  labels: Record<string, string>,
): [string, string][] {
  const rows: [string, string][] = [
    [labels.engagementKind || "Engagement", kindLabel(engagement.kind, labels)],
  ];
  if (engagement.website) {
    rows.push([labels.engagementWebsite || "Website", engagement.website]);
  }
  if (engagement.fromTool) {
    rows.push([labels.engagementFromTool || "From tool", engagement.fromTool]);
  }
  const attr = engagement.attribution;
  if (attr?.campaign) {
    rows.push([labels.campaign || "Campaign", attr.campaign]);
  }
  if (attr?.entry_page) {
    rows.push([labels.entryPage || "Entry page", attr.entry_page]);
  }
  if (attr?.conversion_source) {
    rows.push([
      labels.conversionSource || "Conversion source",
      attr.conversion_source,
    ]);
  }
  if (attr?.signal) {
    rows.push([labels.signal || "Signal", attr.signal]);
  }
  if (attr?.selected_problem) {
    rows.push([
      labels.selectedProblem || "Selected problem",
      attr.selected_problem,
    ]);
  }
  if (data.sourcePage?.trim()) {
    rows.push([labels.sourcePage || "Referrer page", data.sourcePage.trim()]);
  }
  return rows;
}

function evidenceRows(
  engagement: ConsultationEngagement,
  labels: Record<string, string>,
): [string, string][] {
  const evidence = engagement.evidence;
  if (!evidence) return [];
  const rows: [string, string][] = [
    [labels.evidenceTool || "Tool", evidence.toolName],
  ];
  if (evidence.url) {
    rows.push([labels.evidenceUrl || "Checked URL", evidence.url]);
  }
  if (evidence.priorities.length) {
    rows.push([
      labels.evidencePriorities || "Priorities",
      evidence.priorities.map((line, i) => `${i + 1}. ${line}`).join("\n"),
    ]);
  }
  if (evidence.scores) {
    const chips = Object.entries(evidence.scores)
      .map(([key, value]) =>
        value === null || value === undefined ? `${key}: —` : `${key}: ${value}`,
      )
      .join(" · ");
    if (chips) rows.push([labels.evidenceScores || "Scores", chips]);
  }
  if (evidence.asOf) {
    rows.push([labels.evidenceAsOf || "As of", evidence.asOf]);
  }
  return rows;
}

function estimateMetaRows(
  engagement: ConsultationEngagement,
  labels: Record<string, string>,
): [string, string][] {
  const rows: [string, string][] = [];
  if (engagement.estimate.region) {
    rows.push([labels.estimateRegion || "Region", engagement.estimate.region]);
  }
  if (engagement.estimate.referralCode) {
    rows.push([
      labels.estimateReferral || "Referral code",
      engagement.estimate.referralCode,
    ]);
  }
  if (engagement.estimate.pricingVersion) {
    rows.push([
      labels.estimatePricingVersion || "Pricing version",
      engagement.estimate.pricingVersion,
    ]);
  }
  if (engagement.estimate.lineItems?.length) {
    rows.push([
      labels.estimateSummary || "Selections",
      engagement.estimate.summary,
    ]);
  }
  return rows;
}

export function buildPlanningReportSalesHtml(
  data: PlanningReportInquiry,
  labels: Record<string, string>,
  submittedAt: string,
  origin: string,
  options?: {
    discoveryUrl?: string | null;
    submissionId?: string;
  },
): string {
  const engagement = data.engagement;
  if (!engagement) {
    throw new Error("buildPlanningReportSalesHtml requires engagement");
  }

  const headerRows: [string, string][] = [
    [labels.name || "Name", data.name.trim()],
    [labels.email || "Email", data.email.trim()],
    [labels.company || "Company", data.company?.trim() || labels.notProvided || "Not provided"],
    [labels.phone || "Phone", data.phone?.trim() || labels.notProvided || "Not provided"],
    [
      labels.intent || "Request type",
      labels[`intent_${data.intent}`] ?? data.intent,
    ],
  ];
  if (options?.submissionId) {
    headerRows.push([labels.submissionId || "Reference", options.submissionId]);
  }
  headerRows.push(
    [labels.submittedAt || "Submitted", submittedAt],
    [labels.source || "Website", origin],
  );

  const discoveryBlock = options?.discoveryUrl
    ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;">
          <tr>
            <td bgcolor="#eefbfd" style="background-color:#eefbfd;border:1px solid #c5eef3;padding:18px 18px 16px;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.4;letter-spacing:0.08em;text-transform:uppercase;color:#007a87;font-weight:bold;">${escapeHtml(labels.discoveryHeading || "Suggested discovery link")}</p>
              <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#334155;">${escapeHtml(labels.discoverySalesHint || "")}</p>
              <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;word-break:break-all;"><a href="${escapeHtml(options.discoveryUrl)}" style="color:#007a87;text-decoration:none;">${escapeHtml(options.discoveryUrl)}</a></p>
              ${inquiryEmailButton(options.discoveryUrl, labels.discoveryCta || "Open the brief", "left")}
            </td>
          </tr>
        </table>`
    : "";

  const evidenceBlockRows = evidenceRows(engagement, labels);
  const metaRows = estimateMetaRows(engagement, labels);

  return renderInquiryEmail({
    title: labels.planningSalesHeading || "Planning report — internal",
    preheader: `Planning report from ${data.name.trim()} (${kindLabel(engagement.kind, labels)}).`,
    eyebrow: labels.planningSalesEyebrow || "Sales desk · Planning report",
    headline: labels.planningSalesHeading || "Planning report — internal",
    footerNote: INQUIRY_EMAIL_INTERNAL_NOTE,
    bodyHtml: `
      ${inquiryEmailParagraph(escapeHtml(labels.planningSalesIntro || "A prospective client submitted an estimate-backed planning request."))}
      ${inquiryEmailParagraph("Reply to this message to write to the client directly.")}
      ${sectionHeading(labels.planningHeaderSection || "Prospect")}
      ${detailTable(headerRows)}
      ${sectionHeading(labels.planningJourneySection || "Journey")}
      ${detailTable(journeyRows(data, engagement, labels))}
      ${
        evidenceBlockRows.length
          ? `${sectionHeading(labels.planningEvidenceSection || "Evidence snapshot")}${detailTable(evidenceBlockRows)}`
          : ""
      }
      ${sectionHeading(labels.planningEstimateSection || "Preliminary estimate")}
      ${estimateTableHtml(engagement, labels)}
      ${metaRows.length ? `<div style="margin-top:12px;">${detailTable(metaRows)}</div>` : ""}
      ${sectionHeading(labels.planningNoteSection || "Prospect note")}
      ${detailTable([[labels.goal || "Goal / challenge", data.goal.trim()]])}
      ${inquiryEmailParagraph(`<span style="color:#5b6b7c;font-size:13px;">${escapeHtml(engagement.disclaimer || DEFAULT_DISCLAIMER)}</span>`)}
      ${discoveryBlock}
    `,
  });
}

export function buildPlanningReportSalesText(
  data: PlanningReportInquiry,
  labels: Record<string, string>,
  submittedAt: string,
  origin: string,
  options?: {
    discoveryUrl?: string | null;
    submissionId?: string;
  },
): string {
  const engagement = data.engagement;
  if (!engagement) {
    throw new Error("buildPlanningReportSalesText requires engagement");
  }

  const lines = [
    labels.planningSalesHeading || "Planning report — internal",
    "",
    labels.planningSalesIntro ||
      "A prospective client submitted an estimate-backed planning request.",
    "",
    labels.planningHeaderSection || "Prospect",
    `${labels.name || "Name"}: ${data.name.trim()}`,
    `${labels.email || "Email"}: ${data.email.trim()}`,
    `${labels.company || "Company"}: ${data.company?.trim() || labels.notProvided || "Not provided"}`,
    `${labels.phone || "Phone"}: ${data.phone?.trim() || labels.notProvided || "Not provided"}`,
    `${labels.intent || "Request type"}: ${labels[`intent_${data.intent}`] ?? data.intent}`,
  ];
  if (options?.submissionId) {
    lines.push(`${labels.submissionId || "Reference"}: ${options.submissionId}`);
  }
  lines.push(
    `${labels.submittedAt || "Submitted"}: ${submittedAt}`,
    `${labels.source || "Website"}: ${origin}`,
    "",
    labels.planningJourneySection || "Journey",
  );
  for (const [label, value] of journeyRows(data, engagement, labels)) {
    lines.push(`${label}: ${value}`);
  }

  const evidence = evidenceRows(engagement, labels);
  if (evidence.length) {
    lines.push("", labels.planningEvidenceSection || "Evidence snapshot");
    for (const [label, value] of evidence) {
      lines.push(`${label}: ${value}`);
    }
  }

  lines.push("", labels.planningEstimateSection || "Preliminary estimate");
  if (engagement.estimate.lineItems?.length) {
    for (const item of engagement.estimate.lineItems) {
      lines.push(`- ${item.label}: ${item.amount}`);
    }
  } else {
    lines.push(engagement.estimate.summary);
  }
  lines.push(
    `${labels.estimateTotal || "Preliminary total"}: ${engagement.estimate.total}`,
  );
  for (const [label, value] of estimateMetaRows(engagement, labels)) {
    lines.push(`${label}: ${value}`);
  }

  lines.push(
    "",
    labels.planningNoteSection || "Prospect note",
    `${labels.goal || "Goal / challenge"}: ${data.goal.trim()}`,
    "",
    engagement.disclaimer || DEFAULT_DISCLAIMER,
  );

  if (options?.discoveryUrl) {
    lines.push(
      "",
      labels.discoveryHeading || "Suggested discovery link",
      labels.discoverySalesHint || "",
      options.discoveryUrl,
    );
  }

  lines.push(
    "",
    "Reply to this message to write to the client directly.",
    inquiryEmailPlainFooter(INQUIRY_EMAIL_INTERNAL_NOTE),
  );
  return lines.join("\n");
}

export function buildPlanningReportUserHtml(
  data: PlanningReportInquiry,
  labels: Record<string, string>,
  options?: { discoveryUrl?: string | null; submissionId?: string },
): string {
  const engagement = data.engagement;
  if (!engagement) {
    throw new Error("buildPlanningReportUserHtml requires engagement");
  }

  const nextSteps = [
    labels.planningUserNext1 ||
      "We review your tool results and preliminary estimate.",
    labels.planningUserNext2 ||
      "You receive a written scope and confirmed next step.",
    labels.planningUserNext3 || "Kickoff once the plan is agreed in writing.",
  ];
  const nextRows = nextSteps
    .map((step, index) => {
      return `<tr><td valign="top" width="28" style="padding:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;font-weight:bold;color:#007a87;">${index + 1}</td><td valign="top" style="padding:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#1e293b;">${escapeHtml(step)}</td></tr>`;
    })
    .join("");

  const evidence = engagement.evidence;
  const evidenceBlock = evidence
    ? `
      ${sectionHeading(labels.planningUserEvidenceSection || "What we checked")}
      ${detailTable(evidenceRows(engagement, labels))}
    `
    : "";

  const refLine = options?.submissionId
    ? inquiryEmailParagraph(
        `<span style="color:#5b6b7c;">${escapeHtml(labels.submissionId || "Reference")}: <strong style="color:#1e293b;">${escapeHtml(options.submissionId)}</strong></span>`,
      )
    : "";

  const discoveryBlock = options?.discoveryUrl
    ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;">
          <tr>
            <td bgcolor="#eefbfd" style="background-color:#eefbfd;border:1px solid #c5eef3;padding:20px 18px;text-align:center;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.4;letter-spacing:0.08em;text-transform:uppercase;color:#007a87;font-weight:bold;">${escapeHtml(labels.userDiscoveryEyebrow || "Optional next step")}</p>
              <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#334155;">${escapeHtml(labels.userDiscoveryBody || "")}</p>
              ${inquiryEmailButton(options.discoveryUrl, labels.userDiscoveryCta || "Start your digital brief")}
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
    title: labels.planningUserHeading || "Your preliminary planning report",
    preheader:
      labels.planningUserPreheader ||
      "Your preliminary planning report from Roalla — estimate and next steps inside.",
    eyebrow: labels.planningUserEyebrow || "Planning report",
    headline: labels.planningUserHeading || "Your preliminary planning report",
    footerNote: INQUIRY_EMAIL_CUSTOMER_NOTE,
    bodyHtml: `
      ${inquiryEmailParagraph(`Dear ${escapeHtml(data.name.trim())},`)}
      ${inquiryEmailParagraph(escapeHtml(labels.planningUserGreeting || "Thank you for sharing your estimate with Roalla Business Enablement Group."))}
      ${inquiryEmailParagraph(escapeHtml((labels.planningUserBody || "Here is a preliminary planning report for {kind}.").replace("{kind}", kindLabel(engagement.kind, labels))))}
      ${refLine}
      ${evidenceBlock}
      ${sectionHeading(labels.planningUserEstimateSection || "Your preliminary estimate")}
      ${estimateTableHtml(engagement, labels)}
      ${
        engagement.estimate.lineItems?.length
          ? inquiryEmailParagraph(
              `<span style="color:#5b6b7c;font-size:13px;white-space:pre-wrap;">${escapeHtml(engagement.estimate.summary)}</span>`,
            )
          : ""
      }
      ${inquiryEmailParagraph(`<span style="color:#5b6b7c;font-size:13px;">${escapeHtml(engagement.disclaimer || DEFAULT_DISCLAIMER)}</span>`)}
      ${sectionHeading(labels.userNextHeading || "What happens next")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;">${nextRows}</table>
      ${discoveryBlock}
      ${inquiryEmailParagraph(escapeHtml(labels.planningUserCta || "Reply to this email anytime — or call (289) 838-5868."))}
      <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#1e293b;">${signoff}</p>
    `,
  });
}

export function buildPlanningReportUserText(
  data: PlanningReportInquiry,
  labels: Record<string, string>,
  options?: { discoveryUrl?: string | null; submissionId?: string },
): string {
  const engagement = data.engagement;
  if (!engagement) {
    throw new Error("buildPlanningReportUserText requires engagement");
  }

  const lines = [
    `Dear ${data.name.trim()},`,
    "",
    labels.planningUserGreeting ||
      "Thank you for sharing your estimate with Roalla Business Enablement Group.",
    "",
    (labels.planningUserBody || "Here is a preliminary planning report for {kind}.").replace(
      "{kind}",
      kindLabel(engagement.kind, labels),
    ),
  ];
  if (options?.submissionId) {
    lines.push(
      "",
      `${labels.submissionId || "Reference"}: ${options.submissionId}`,
    );
  }

  const evidence = evidenceRows(engagement, labels);
  if (evidence.length) {
    lines.push("", labels.planningUserEvidenceSection || "What we checked");
    for (const [label, value] of evidence) {
      lines.push(`${label}: ${value}`);
    }
  }

  lines.push("", labels.planningUserEstimateSection || "Your preliminary estimate");
  if (engagement.estimate.lineItems?.length) {
    for (const item of engagement.estimate.lineItems) {
      lines.push(`- ${item.label}: ${item.amount}`);
    }
    lines.push(engagement.estimate.summary);
  } else {
    lines.push(engagement.estimate.summary);
  }
  lines.push(
    `${labels.estimateTotal || "Preliminary total"}: ${engagement.estimate.total}`,
    "",
    engagement.disclaimer || DEFAULT_DISCLAIMER,
    "",
    labels.userNextHeading || "What happens next",
    `1. ${labels.planningUserNext1 || "We review your tool results and preliminary estimate."}`,
    `2. ${labels.planningUserNext2 || "You receive a written scope and confirmed next step."}`,
    `3. ${labels.planningUserNext3 || "Kickoff once the plan is agreed in writing."}`,
  );

  if (options?.discoveryUrl) {
    lines.push(
      "",
      labels.userDiscoveryEyebrow || "Optional next step",
      labels.userDiscoveryBody || "",
      options.discoveryUrl,
    );
  }

  lines.push(
    "",
    labels.planningUserCta ||
      "Reply to this email anytime — or call (289) 838-5868.",
    "",
    labels.userSignoff || "Best regards,\nThe ROALLA Team",
    inquiryEmailPlainFooter(INQUIRY_EMAIL_CUSTOMER_NOTE),
  );
  return lines.join("\n");
}

export function buildPlanningReportEmailSubject(
  name: string,
  engagement: ConsultationEngagement,
): string {
  const kindTitles: Record<EngagementKind, string> = {
    "visibility-estimate": "Visibility estimate",
    "email-reach-estimate": "Email reach estimate",
    "website-estimate": "Website estimate",
    "workshop-estimate": "Workshop estimate",
  };
  return `Planning report — ${kindTitles[engagement.kind]} — ${name}`;
}
