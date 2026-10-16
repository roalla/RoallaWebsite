import {
  analyzePageSecurity,
  analyzeRedirectPath,
  clipRedirectUrl,
  detectMixedContent,
  redirectPathStatus,
} from "@/lib/page-security/analyze";

const clear = {
  https: true,
  certificateExpiresOn: "2027-05-17",
  certificateDaysRemaining: 200,
  redirect: "https" as const,
  strictTransportSecurity: "max-age=31536000; includeSubDomains",
  xFrameOptions: "SAMEORIGIN",
  contentSecurityPolicy: null,
  xContentTypeOptions: "nosniff",
  referrerPolicy: "strict-origin-when-cross-origin",
  html: '<html><head></head><body><img src="https://cdn.example.test/hero.jpg" /><script src="/app.js"></script></body></html>',
  redirectHops: [{ status: 200, url: "https://example.test/" }],
};

describe("page security", () => {
  it("re-exports the redirect URL clipping helper", () => {
    expect(clipRedirectUrl(`https://example.test/${"a".repeat(120)}`)).toHaveLength(96);
  });

  it("passes a current certificate, redirects, headers, framing, and clean content", () => {
    const result = analyzePageSecurity(clear);
    expect(result.checks.map((check) => [check.id, check.status])).toEqual([
      ["https", "pass"],
      ["redirect", "pass"],
      ["redirectPath", "pass"],
      ["hsts", "pass"],
      ["framing", "pass"],
      ["mixedContent", "pass"],
      ["contentType", "pass"],
      ["referrerPolicy", "pass"],
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
      xContentTypeOptions: null,
      referrerPolicy: null,
    });
    expect(result.checks.find((check) => check.id === "hsts")?.status).toBe("review");
    expect(result.checks.find((check) => check.id === "framing")?.status).toBe("review");
    expect(result.checks.find((check) => check.id === "redirect")?.status).toBe("review");
    expect(result.checks.find((check) => check.id === "contentType")?.status).toBe("review");
    expect(result.checks.find((check) => check.id === "referrerPolicy")?.status).toBe("review");
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

  it("flags insecure assets on an HTTPS page", () => {
    const result = analyzePageSecurity({
      ...clear,
      html: '<img src="http://cdn.example.test/hero.jpg" alt="">',
    });
    expect(result.checks.find((check) => check.id === "mixedContent")?.status).toBe("gap");
    expect(JSON.stringify(result)).not.toContain("cdn.example.test");
  });

  it("marks unscannable HTML for review", () => {
    const result = analyzePageSecurity({ ...clear, html: "   " });
    expect(result.checks.find((check) => check.id === "mixedContent")?.status).toBe("review");
  });

  it("flags an unsafe referrer policy", () => {
    const result = analyzePageSecurity({ ...clear, referrerPolicy: "unsafe-url" });
    expect(result.checks.find((check) => check.id === "referrerPolicy")?.status).toBe("gap");
  });

  it("reviews a long or temporary redirect path and gaps a loop", () => {
    const long = analyzePageSecurity({
      ...clear,
      redirectHops: [
        { status: 301, url: "https://example.test/a" },
        { status: 301, url: "https://example.test/b" },
        { status: 301, url: "https://example.test/c" },
        { status: 200, url: "https://example.test/d" },
      ],
    });
    expect(long.checks.find((check) => check.id === "redirectPath")?.status).toBe("review");
    expect(long.redirectPath?.longChain).toBe(true);
    expect(long.checks.find((check) => check.id === "redirectPath")?.evidence).toBe("301 → 301 → 301 → 200");

    const temporary = analyzePageSecurity({
      ...clear,
      redirectHops: [
        { status: 302, url: "https://example.test/" },
        { status: 200, url: "https://www.example.test/" },
      ],
    });
    expect(temporary.checks.find((check) => check.id === "redirectPath")?.status).toBe("review");

    const loop = analyzePageSecurity({
      ...clear,
      redirectHops: [
        { status: 301, url: "https://example.test/a" },
        { status: 301, url: "https://example.test/b" },
      ],
      redirectLoop: true,
    });
    expect(loop.checks.find((check) => check.id === "redirectPath")?.status).toBe("gap");
  });
});

describe("redirect path analysis", () => {
  it("passes a short permanent chain", () => {
    const analysis = analyzeRedirectPath([
      { status: 301, url: "https://example.test/" },
      { status: 200, url: "https://www.example.test/" },
    ]);
    expect(redirectPathStatus(analysis)).toBe("pass");
    expect(analysis.longChain).toBe(false);
    expect(analysis.temporaryRedirect).toBe(false);
  });

  it("flags loops and http endings", () => {
    expect(
      redirectPathStatus(
        analyzeRedirectPath([{ status: 301, url: "https://example.test/" }], { loop: true }),
      ),
    ).toBe("gap");
    expect(
      redirectPathStatus(
        analyzeRedirectPath([
          { status: 301, url: "https://example.test/" },
          { status: 302, url: "http://example.test/" },
        ]),
      ),
    ).toBe("gap");
  });
});

describe("mixed content detection", () => {
  it("passes a clean HTTPS page with relative and https assets", () => {
    expect(
      detectMixedContent(
        '<link rel="stylesheet" href="/styles.css"><img src="https://cdn.example.test/a.png"><script src="./app.js"></script>',
        true,
      ),
    ).toBe("none");
  });

  it("finds http images, scripts, stylesheets, and CSS urls", () => {
    expect(detectMixedContent('<img src="http://evil.test/x.png">', true)).toBe("found");
    expect(detectMixedContent('<script src="http://evil.test/x.js"></script>', true)).toBe("found");
    expect(detectMixedContent('<link rel="stylesheet" href="http://evil.test/x.css">', true)).toBe("found");
    expect(detectMixedContent('<div style="background:url(http://evil.test/bg.png)"></div>', true)).toBe("found");
    expect(detectMixedContent('<style>.hero{background:url("http://evil.test/bg.png")}</style>', true)).toBe("found");
  });

  it("finds insecure srcset entries", () => {
    expect(
      detectMixedContent('<img srcset="https://cdn.example.test/a.png 1x, http://cdn.example.test/b.png 2x">', true),
    ).toBe("found");
  });

  it("ignores ordinary http links, canonical urls, and protocol-relative urls", () => {
    expect(detectMixedContent('<a href="http://example.test/about">About</a>', true)).toBe("none");
    expect(detectMixedContent('<link rel="canonical" href="http://example.test/">', true)).toBe("none");
    expect(detectMixedContent('<img src="//cdn.example.test/a.png">', true)).toBe("none");
  });

  it("ignores http assets mentioned only in comments", () => {
    expect(detectMixedContent('<!-- <img src="http://evil.test/x.png"> --><img src="/ok.png">', true)).toBe("none");
  });

  it("returns unknown for empty HTML on HTTPS and none when the page is not HTTPS", () => {
    expect(detectMixedContent("", true)).toBe("unknown");
    expect(detectMixedContent('<img src="http://evil.test/x.png">', false)).toBe("none");
  });
});
