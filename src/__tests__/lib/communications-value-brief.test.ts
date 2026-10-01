import {
  buildCommunicationsValueBrief,
  communicationsDecisionPriorities,
  communicationsValueEstimate,
  recommendCommunicationsApproach,
  recoverableSpendPercent,
} from "@/lib/communications-value-brief";

const base = {
  scale: "11-50" as const,
  urgency: "exploring" as const,
  monthlySpend: 1000,
  seatCount: 25,
  missedPerWeek: 5,
  valuePerMissed: 50,
};

describe("communications value brief", () => {
  it("recommends pots modernization for legacy telephone", () => {
    expect(
      recommendCommunicationsApproach({
        situation: "pots-legacy",
        scope: "uc",
        frictions: ["high-line-cost"],
      }),
    ).toBe("pots-modernization");
  });

  it("recommends provider value review for renewal or unsure cloud", () => {
    expect(
      recommendCommunicationsApproach({
        situation: "renewal",
        scope: "uc",
        frictions: ["contract-lock-in"],
      }),
    ).toBe("provider-value-review");

    expect(
      recommendCommunicationsApproach({
        situation: "current-cloud-unsure",
        scope: "uc",
        frictions: ["poor-reporting"],
      }),
    ).toBe("provider-value-review");
  });

  it("recommends contact centre readiness when CC is in scope", () => {
    expect(
      recommendCommunicationsApproach({
        situation: "current-cloud-unsure",
        scope: "cc",
        frictions: ["missed-calls", "no-crm"],
      }),
    ).toBe("contact-centre-readiness");
  });

  it("recommends stack rationalization for fragmented tools", () => {
    expect(
      recommendCommunicationsApproach({
        situation: "fragmented",
        scope: "both",
        frictions: ["fragmented-tools"],
      }),
    ).toBe("unified-stack-rationalization");
  });

  it("applies higher recoverable percent for POTS than renewal", () => {
    const pots = recoverableSpendPercent({
      situation: "pots-legacy",
      frictions: ["high-line-cost"],
    });
    const renewal = recoverableSpendPercent({
      situation: "renewal",
      frictions: ["high-line-cost"],
    });
    expect(pots).toBeGreaterThan(renewal);
  });

  it("calculates spend and missed-interaction opportunity", () => {
    const value = communicationsValueEstimate({
      ...base,
      situation: "pots-legacy",
      scope: "both",
      frictions: ["missed-calls"],
    });
    expect(value.annualSpend).toBe(12000);
    expect(value.spendOpportunity).toBeGreaterThan(0);
    expect(value.missedOpportunity).toBe(5 * 50 * 52);
    expect(value.indicativeAnnualValue).toBe(value.spendOpportunity + value.missedOpportunity);
  });

  it("adds contact-centre priorities for CC scope", () => {
    const priorities = communicationsDecisionPriorities({
      situation: "renewal",
      scope: "cc",
      frictions: ["recording-compliance"],
      urgency: "urgent",
    });
    expect(priorities.join(" ")).toContain("Queue design");
    expect(priorities.join(" ")).toContain("Recording");
    expect(priorities.join(" ")).toContain("Transition risk");
  });

  it("builds a full brief without vendor brand strings", () => {
    const brief = buildCommunicationsValueBrief({
      ...base,
      situation: "pots-legacy",
      scope: "both",
      frictions: ["high-line-cost", "missed-calls"],
    });
    expect(brief.approachKey).toBe("pots-modernization");
    expect(brief.plan30_60_90).toHaveLength(3);
    expect(brief.priorities.length).toBeGreaterThanOrEqual(3);
    const blob = JSON.stringify(brief).toLowerCase();
    expect(blob).not.toContain("zoom");
    expect(blob).not.toContain("speechlogix");
    expect(blob).not.toContain("computertalk");
  });
});
