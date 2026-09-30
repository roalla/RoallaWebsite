import {
  annualAutomationValue,
  annualWebsiteOpportunity,
  eventFollowUpOpportunity,
  recommendDigitalService,
} from "@/lib/digital-value-planner";

describe("digital value planner", () => {
  it("matches goals to a practical service", () => {
    expect(recommendDigitalService("operations", "live-concern").key).toBe("automation");
    expect(recommendDigitalService("visibility", "idea").key).toBe("visibility");
    expect(recommendDigitalService("inquiries", "live-growing").key).toBe("managed");
  });

  it("calculates conservative planning values", () => {
    expect(annualAutomationValue({ people: 2, hoursPerWeek: 5, hourlyCost: 40, reductionPercent: 50 }).potentialAnnualValue).toBe(10400);
    expect(annualWebsiteOpportunity({ monthlyVisitors: 1000, currentInquiryRate: 1, targetInquiryRate: 2, closeRate: 20, customerValue: 1000 }).potentialAnnualValue).toBe(24000);
    expect(eventFollowUpOpportunity({ leads: 100, currentFollowUpRate: 40, targetFollowUpRate: 80, closeRate: 10, customerValue: 2000 }).potentialValue).toBe(8000);
  });
});
