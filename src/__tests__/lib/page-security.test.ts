import { analyzePageSecurity } from "@/lib/page-security/analyze";

const clear = {
  https: true,
  certificateExpiresOn: "2027-05-17",
  certificateDaysRemaining: 200,
  redirect: "https" as const,
  strictTransportSecurity: "max-age=31536000; includeSubDomains",
  xFrameOptions: "SAMEORIGIN",
  contentSecurityPolicy: null,
};

describe("page security", () => {
  it("passes a current certificate, an HTTPS redirect, a browser lock, and a framing limit", () => {
    const result = analyzePageSecurity(clear);
    expect(result.checks.map((check) => [check.id, check.status])).toEqual([
      ["https", "pass"],
      ["redirect", "pass"],
      ["hsts", "pass"],
      ["framing", "pass"],
    ]);
    expect(result.checks[0]?.evidence).toBe("2027-05-17");
  });

  it("marks a certificate that expires within 30 days for review", () => {
    const result = analyzePageSecurity({ ...clear, certificateDaysRemaining: 12 });
    expect(result.checks.find((check) => check.id === "https")?.status).toBe("review");
  });

  it("does not treat a missing browser lock or framing rule as a broken page", () => {
    const result = analyzePageSecurity({
      ...clear,
      strictTransportSecurity: null,
      xFrameOptions: null,
      redirect: "unknown",
    });
    expect(result.checks.find((check) => check.id === "hsts")?.status).toBe("review");
    expect(result.checks.find((check) => check.id === "framing")?.status).toBe("review");
    expect(result.checks.find((check) => check.id === "redirect")?.status).toBe("review");
  });

  it("flags an unencrypted address and a page that allows every site to frame it", () => {
    const result = analyzePageSecurity({
      ...clear,
      redirect: "http",
      xFrameOptions: null,
      contentSecurityPolicy: "default-src 'self'; frame-ancestors *",
    });
    expect(result.checks.find((check) => check.id === "redirect")?.status).toBe("gap");
    expect(result.checks.find((check) => check.id === "framing")?.status).toBe("gap");
  });

  it("does not keep the raw policy text", () => {
    const result = analyzePageSecurity({
      ...clear,
      contentSecurityPolicy: "frame-ancestors 'none'; script-src https://example.test/secret",
    });
    expect(JSON.stringify(result)).not.toContain("secret");
    expect(result.checks.find((check) => check.id === "framing")?.status).toBe("pass");
  });
});
