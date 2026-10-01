function safe(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function percent(value: number) {
  return Math.min(100, safe(value)) / 100;
}

export const MAX_COMMUNICATIONS_FRICTIONS = 2;

export type CommunicationsSituation =
  | "pots-legacy"
  | "current-cloud-unsure"
  | "fragmented"
  | "renewal";

export type CommunicationsScope = "uc" | "cc" | "both";

export type CommunicationsScale = "1-10" | "11-50" | "51-200" | "200-plus";

export type CommunicationsFriction =
  | "missed-calls"
  | "high-line-cost"
  | "no-mobility"
  | "no-crm"
  | "recording-compliance"
  | "fragmented-tools"
  | "poor-reporting"
  | "contract-lock-in";

export type CommunicationsUrgency =
  | "exploring"
  | "six-months"
  | "three-months"
  | "urgent";

export type CommunicationsApproachKey =
  | "pots-modernization"
  | "provider-value-review"
  | "contact-centre-readiness"
  | "unified-stack-rationalization";

export type CommunicationsValueBriefInput = {
  situation: CommunicationsSituation;
  scope: CommunicationsScope;
  scale: CommunicationsScale;
  frictions: CommunicationsFriction[];
  urgency: CommunicationsUrgency;
  monthlySpend: number;
  seatCount: number;
  missedPerWeek: number;
  valuePerMissed: number;
};

export const SCALE_SEAT_DEFAULTS: Record<CommunicationsScale, number> = {
  "1-10": 5,
  "11-50": 25,
  "51-200": 100,
  "200-plus": 250,
};

const SITUATION_RECOVERABLE: Record<CommunicationsSituation, number> = {
  "pots-legacy": 35,
  fragmented: 30,
  "current-cloud-unsure": 18,
  renewal: 15,
};

const FRICTION_BOOST: Partial<Record<CommunicationsFriction, number>> = {
  "missed-calls": 4,
  "high-line-cost": 5,
  "no-mobility": 3,
  "no-crm": 3,
  "recording-compliance": 2,
  "fragmented-tools": 4,
  "poor-reporting": 2,
  "contract-lock-in": 3,
};

export function recommendCommunicationsApproach(
  input: Pick<CommunicationsValueBriefInput, "situation" | "scope" | "frictions">,
): CommunicationsApproachKey {
  if (input.situation === "pots-legacy") return "pots-modernization";
  if (input.situation === "fragmented") return "unified-stack-rationalization";

  const ccHeavy =
    input.scope === "cc" ||
    input.scope === "both" ||
    input.frictions.includes("missed-calls") ||
    input.frictions.includes("recording-compliance") ||
    input.frictions.includes("no-crm");

  if (ccHeavy && (input.scope === "cc" || input.scope === "both")) {
    return "contact-centre-readiness";
  }

  return "provider-value-review";
}

export function recoverableSpendPercent(
  input: Pick<CommunicationsValueBriefInput, "situation" | "frictions">,
): number {
  const boost = input.frictions.reduce(
    (sum, friction) => sum + (FRICTION_BOOST[friction] ?? 0),
    0,
  );
  return Math.min(55, SITUATION_RECOVERABLE[input.situation] + boost);
}

export function communicationsValueEstimate(input: CommunicationsValueBriefInput) {
  const monthlySpend = safe(input.monthlySpend);
  const annualSpend = monthlySpend * 12;
  const seats = safe(input.seatCount);
  const costPerPersonMonthly = seats > 0 ? monthlySpend / seats : 0;
  const recoverablePercent = recoverableSpendPercent(input);
  const spendOpportunity = annualSpend * percent(recoverablePercent);

  const showMissedOpportunity =
    input.scope === "cc" || input.frictions.includes("missed-calls");

  const missedOpportunity = showMissedOpportunity
    ? safe(input.missedPerWeek) * safe(input.valuePerMissed) * 52
    : 0;

  return {
    annualSpend,
    costPerPersonMonthly,
    recoverablePercent,
    spendOpportunity,
    missedOpportunity,
    showMissedOpportunity,
    indicativeAnnualValue: spendOpportunity + missedOpportunity,
  };
}

export function communicationsDecisionPriorities(
  input: Pick<CommunicationsValueBriefInput, "scope" | "frictions" | "urgency" | "situation">,
): string[] {
  const priorities = [
    "Business outcome and measurable calling or contact requirements",
    "Total cost, contract commitments, and exit options",
  ];

  if (input.situation === "pots-legacy" || input.situation === "fragmented") {
    priorities.push("Number porting, migration sequencing, and interim coverage");
  }

  if (
    input.scope === "cc" ||
    input.scope === "both" ||
    input.frictions.includes("missed-calls") ||
    input.frictions.includes("no-crm")
  ) {
    priorities.push("Queue design, CRM handoffs, and reporting that agents will actually use");
  }

  if (input.frictions.includes("recording-compliance")) {
    priorities.push("Recording, retention, privacy, and compliance controls");
  }

  if (
    input.frictions.includes("no-mobility") ||
    input.scope === "uc" ||
    input.scope === "both"
  ) {
    priorities.push("Mobility, adoption, training, and accountable day-to-day ownership");
  }

  if (input.urgency === "urgent" || input.urgency === "three-months") {
    priorities.push("Transition risk, interim controls, and realistic decision milestones");
  }

  return priorities;
}

export function communicationsEngagementPlan(
  approach: CommunicationsApproachKey,
): [string, string, string] {
  const plans: Record<CommunicationsApproachKey, [string, string, string]> = {
    "pots-modernization": [
      "Confirm line counts, call patterns, must-keep numbers, and the business outcome that replaces the legacy phone system.",
      "Compare a short private shortlist against those requirements, total cost, and migration risk—without committing to a vendor prematurely.",
      "Decide on the path, sequence number porting and cutover, and set adoption measures for the first 90 days.",
    ],
    "provider-value-review": [
      "Baseline what you pay today, which features are used, and where contracts, seats, or add-ons no longer match the work.",
      "Challenge renewal assumptions with a needs-led shortlist and clear exit or consolidate options.",
      "Choose renew, renegotiate, or replace—and document the measures that prove the change was worth it.",
    ],
    "contact-centre-readiness": [
      "Map inbound journeys, queue pain, CRM gaps, recording needs, and what “good” looks like for agents and customers.",
      "Pressure-test contact-centre options against those requirements, integrations, and total cost of ownership.",
      "Pilot the smallest useful improvement path, measure abandon and handle metrics, then decide whether to expand.",
    ],
    "unified-stack-rationalization": [
      "Inventory overlapping calling, meeting, and contact tools and name the single outcome the stack must serve.",
      "Collapse the shortlist to options that cover the real workload, then compare cost, risk, and adoption load.",
      "Pick one decision path, retire redundant tools on a schedule, and assign ownership for the resulting stack.",
    ],
  };

  return plans[approach];
}

export function buildCommunicationsValueBrief(input: CommunicationsValueBriefInput) {
  const approachKey = recommendCommunicationsApproach(input);
  const value = communicationsValueEstimate(input);
  const priorities = communicationsDecisionPriorities(input);
  const plan30_60_90 = communicationsEngagementPlan(approachKey);

  return {
    approachKey,
    priorities,
    plan30_60_90,
    ...value,
  };
}
