import {
  isSamePublicPage,
  normalizePublicTarget,
  PublicTargetError,
  resolvePublicFinalUrl,
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

function redirectResponse(status: number, location?: string) {
  return new Response(null, {
    status,
    headers: location ? { location } : undefined,
  });
}

describe("resolvePublicFinalUrl", () => {
  it("follows a public redirect to the landing page", async () => {
    const fetcher = async (input: RequestInfo | URL) => {
      if (String(input) === "https://www.roalla.com/") return redirectResponse(307, "/en");
      return redirectResponse(200);
    };

    await expect(
      resolvePublicFinalUrl(new URL("https://www.roalla.com/"), {
        fetcher: fetcher as typeof fetch,
      }),
    ).resolves.toEqual(new URL("https://www.roalla.com/en"));
  });

  it("stops when a redirect leaves the public HTTPS rules", async () => {
    const fetcher = async () => redirectResponse(301, "http://www.roalla.com/en");

    await expect(
      resolvePublicFinalUrl(new URL("https://www.roalla.com/"), {
        fetcher: fetcher as typeof fetch,
      }),
    ).resolves.toEqual(new URL("https://www.roalla.com/"));
  });

  it("stops on a redirect loop", async () => {
    const fetcher = async (input: RequestInfo | URL) =>
      String(input) === "https://www.roalla.com/"
        ? redirectResponse(302, "https://www.roalla.com/en")
        : redirectResponse(302, "https://www.roalla.com/");

    await expect(
      resolvePublicFinalUrl(new URL("https://www.roalla.com/"), {
        fetcher: fetcher as typeof fetch,
      }),
    ).resolves.toEqual(new URL("https://www.roalla.com/en"));
  });
});

describe("isSamePublicPage", () => {
  it("ignores a trailing slash and detects a different path", () => {
    expect(isSamePublicPage("https://www.roalla.com/en", "https://www.roalla.com/en/")).toBe(true);
    expect(isSamePublicPage("https://www.roalla.com/", "https://www.roalla.com/en")).toBe(false);
  });
});
