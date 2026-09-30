export type DigitalGoal =
  | "inquiries"
  | "visibility"
  | "operations"
  | "product"
  | "event"
  | "stability";

export type DigitalStage = "idea" | "live-concern" | "live-growing" | "urgent";

export type ServiceRecommendation = {
  key: "conversion" | "visibility" | "automation" | "product" | "event" | "managed";
  path: string;
  contactIntent: "website" | "visibility" | "automation" | "platform" | "digital-events";
};

export function recommendDigitalService(goal: DigitalGoal, stage: DigitalStage): ServiceRecommendation {
  if (goal === "operations") {
    return { key: "automation", path: "/services/automation", contactIntent: "automation" };
  }
  if (goal === "product") {
    return { key: "product", path: "/services/digital-products", contactIntent: "platform" };
  }
  if (goal === "event") {
    return { key: "event", path: "/services/digital-events", contactIntent: "digital-events" };
  }
  if (goal === "stability" || stage === "live-growing") {
    return { key: "managed", path: "/services/managed-optimization", contactIntent: "website" };
  }
  if (goal === "visibility") {
    return { key: "visibility", path: "/services/digital-visibility-optimization", contactIntent: "visibility" };
  }
  return { key: "conversion", path: "/website-design", contactIntent: "website" };
}

function safeNumber(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function annualAutomationValue(input: {
  people: number;
  hoursPerWeek: number;
  hourlyCost: number;
  reductionPercent: number;
}) {
  const currentAnnualCost = safeNumber(input.people) * safeNumber(input.hoursPerWeek) * safeNumber(input.hourlyCost) * 52;
  const potentialAnnualValue = currentAnnualCost * Math.min(100, safeNumber(input.reductionPercent)) / 100;
  return { currentAnnualCost, potentialAnnualValue };
}

export function annualWebsiteOpportunity(input: {
  monthlyVisitors: number;
  currentInquiryRate: number;
  targetInquiryRate: number;
  closeRate: number;
  customerValue: number;
}) {
  const visitors = safeNumber(input.monthlyVisitors);
  const currentInquiries = visitors * Math.min(100, safeNumber(input.currentInquiryRate)) / 100;
  const targetInquiries = visitors * Math.min(100, safeNumber(input.targetInquiryRate)) / 100;
  const additionalAnnualCustomers = Math.max(0, targetInquiries - currentInquiries) * 12 * Math.min(100, safeNumber(input.closeRate)) / 100;
  return {
    additionalAnnualInquiries: Math.max(0, targetInquiries - currentInquiries) * 12,
    additionalAnnualCustomers,
    potentialAnnualValue: additionalAnnualCustomers * safeNumber(input.customerValue),
  };
}

export function eventFollowUpOpportunity(input: {
  leads: number;
  currentFollowUpRate: number;
  targetFollowUpRate: number;
  closeRate: number;
  customerValue: number;
}) {
  const leads = safeNumber(input.leads);
  const additionalFollowUps = leads * Math.max(0, Math.min(100, safeNumber(input.targetFollowUpRate)) - Math.min(100, safeNumber(input.currentFollowUpRate))) / 100;
  const potentialCustomers = additionalFollowUps * Math.min(100, safeNumber(input.closeRate)) / 100;
  return { additionalFollowUps, potentialCustomers, potentialValue: potentialCustomers * safeNumber(input.customerValue) };
}

