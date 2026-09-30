import { annualMeetingCost, annualWorkflowFriction, decisionDelayExposure, technologyDecisionPriorities } from "@/lib/business-advisory-tools";

describe("business advisory planning tools", () => {
  it("calculates conservative capacity scenarios", () => {
    expect(annualWorkflowFriction({ people: 3, hoursPerWeek: 4, hourlyCost: 50, recoverablePercent: 25 }).potentialCapacityValue).toBe(7800);
    expect(annualMeetingCost({ attendees: 6, hours: 1, meetingsPerMonth: 4, hourlyCost: 50 })).toBe(14400);
    expect(decisionDelayExposure({ weeklyImpact: 2000, weeksDelayed: 4, avoidablePercent: 50 }).potentiallyAvoidable).toBe(4000);
  });

  it("adds risk priorities from the technology context", () => {
    const priorities = technologyDecisionPriorities({ objective: "replace", urgency: "urgent", dataSensitivity: "regulated", integrations: "complex", adoption: "organization" });
    expect(priorities).toHaveLength(6);
    expect(priorities.join(" ")).toContain("Security");
    expect(priorities.join(" ")).toContain("Adoption");
  });
});
