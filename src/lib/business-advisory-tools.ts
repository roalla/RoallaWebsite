function safe(value: number) { return Number.isFinite(value) ? Math.max(0, value) : 0; }
function percent(value: number) { return Math.min(100, safe(value)) / 100; }

export function annualWorkflowFriction(input: { people: number; hoursPerWeek: number; hourlyCost: number; recoverablePercent: number }) {
  const currentCost = safe(input.people) * safe(input.hoursPerWeek) * safe(input.hourlyCost) * 52;
  return { currentCost, potentialCapacityValue: currentCost * percent(input.recoverablePercent) };
}

export function annualMeetingCost(input: { attendees: number; hours: number; meetingsPerMonth: number; hourlyCost: number }) {
  return safe(input.attendees) * safe(input.hours) * safe(input.meetingsPerMonth) * safe(input.hourlyCost) * 12;
}

export function decisionDelayExposure(input: { weeklyImpact: number; weeksDelayed: number; avoidablePercent: number }) {
  const exposure = safe(input.weeklyImpact) * safe(input.weeksDelayed);
  return { exposure, potentiallyAvoidable: exposure * percent(input.avoidablePercent) };
}

export type TechnologyBriefInput = {
  objective: "replace" | "consolidate" | "introduce" | "renew";
  urgency: "planned" | "six-months" | "three-months" | "urgent";
  dataSensitivity: "standard" | "personal" | "regulated" | "critical";
  integrations: "none" | "few" | "several" | "complex";
  adoption: "small" | "department" | "organization" | "external";
};

export function technologyDecisionPriorities(input: TechnologyBriefInput) {
  const priorities = ["Business outcome and measurable requirements", "Total cost, contract commitments, and exit options"];
  if (input.dataSensitivity !== "standard") priorities.push("Security, privacy, compliance, and data handling review");
  if (input.integrations !== "none") priorities.push("Integration, migration, data quality, and failure-path review");
  if (input.adoption !== "small") priorities.push("Adoption, training, support, and accountable ownership");
  if (input.urgency === "urgent" || input.urgency === "three-months") priorities.push("Transition risk, interim controls, and realistic decision milestones");
  return priorities;
}

