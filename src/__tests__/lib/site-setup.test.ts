import { analyzeSiteSetup } from "@/lib/site-setup/analyze";

describe("analyzeSiteSetup", () => {
  it("names a platform, an analytics tag, and Cloudflare in front of the site", () => {
    const result = analyzeSiteSetup({
      html: `<html><head><script src="/_next/static/chunks/main.js"></script><script src="https://www.googletagmanager.com/gtag/js?id=G-TEST"></script></head><body><script src="/cdn-cgi/scripts/x.js"></script></body></html>`,
      headers: { "cf-ray": "abc", server: "cloudflare" },
      nameservers: ["ada.ns.cloudflare.com"],
    });

    expect(result.platform).toContain("next");
    expect(result.analytics).toContain("google-analytics");
    expect(result.protection).toEqual(["cloudflare"]);
    expect(result.protectionDnsOnly).toEqual([]);
    expect(result.edge).toEqual(["cloudflare"]);
    expect(result.edgeHidden).toBe(true);
  });

  it("keeps the host when Cloudflare only handles the domain name", () => {
    const result = analyzeSiteSetup({
      html: `<meta name="generator" content="WordPress 6.6" /><link rel="stylesheet" href="/wp-content/themes/theme.css" />`,
      headers: { "x-vercel-id": "sfo1::abc" },
      nameservers: ["ada.ns.cloudflare.com"],
      cname: "site.vercel.app",
    });

    expect(result.platform).toContain("wordpress");
    expect(result.edge).toEqual(["vercel"]);
    expect(result.edgeHidden).toBe(false);
    expect(result.protection).toEqual([]);
    expect(result.protectionDnsOnly).toEqual(["cloudflare"]);
    expect(result.analytics).toEqual([]);
  });

  it("leaves each area unidentified when the page has no common marks", () => {
    const result = analyzeSiteSetup({ html: "<html><body><h1>Hello</h1></body></html>" });

    expect(result.edge).toEqual([]);
    expect(result.platform).toEqual([]);
    expect(result.analytics).toEqual([]);
    expect(result.protection).toEqual([]);
    expect(result.protectionDnsOnly).toEqual([]);
  });
});
