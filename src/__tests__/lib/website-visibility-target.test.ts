import {
  normalizePublicTarget,
  PublicTargetError,
} from "@/lib/website-visibility/public-target";

describe("normalizePublicTarget", () => {
  it("adds HTTPS and removes query parameters and fragments", () => {
    expect(normalizePublicTarget("www.example.com/pricing?token=secret#form").toString()).toBe(
      "https://www.example.com/pricing",
    );
  });

  it.each([
    "http://example.com",
    "https://localhost",
    "https://127.0.0.1",
    "https://10.0.0.1",
    "https://intranet",
    "https://example.local",
    "https://user:pass@example.com",
    "https://example.com:8443",
  ])("rejects non-public target %s", (target) => {
    expect(() => normalizePublicTarget(target)).toThrow(PublicTargetError);
  });
});
