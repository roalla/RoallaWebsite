import { scoreLighthousePageAgentic } from "@/lib/agentic-readiness/lighthouse-page";
import { pageSpeedUserAgent } from "@/lib/website-visibility/pagespeed";

const mobileHtml = `<html><body><h1>Mobile offer</h1><p>${"A short mobile paragraph. ".repeat(2)}</p></body></html>`;
const desktopHtml = `<html><head><script type="application/ld+json">{"@type":"Organization","name":"Example Co","description":"A full description of the business and where it works."}</script></head><body><h1>Desktop offer for the business</h1><p>${"Bookkeeping for owner-led firms in Hamilton, with a monthly close and a named contact who explains the numbers. ".repeat(6)}</p></body></html>`;

describe("scoreLighthousePageAgentic", () => {
  it("scores the mobile and desktop pages Lighthouse measured, not one shared document", async () => {
    const seen: string[] = [];
    const fetchPage = async (target: URL, _redirects?: number, userAgent?: string) => {
      seen.push(`${target.hostname} ${userAgent}`);
      const html = userAgent === pageSpeedUserAgent("mobile") ? mobileHtml : desktopHtml;
      return { html, finalUrl: target };
    };
    const fetchText = async () => "User-agent: *\nAllow: /\n";

    const mobile = await scoreLighthousePageAgentic(
      "https://competitor.example.com/",
      "mobile",
      fetchPage,
      fetchText,
    );
    const desktop = await scoreLighthousePageAgentic(
      "https://competitor.example.com/landing",
      "desktop",
      fetchPage,
      fetchText,
    );

    expect(seen[0]).toContain(pageSpeedUserAgent("mobile"));
    expect(seen[1]).toContain(pageSpeedUserAgent("desktop"));
    expect(seen[1]).toContain("competitor.example");
    expect(mobile?.score).not.toBe(desktop?.score);
    expect(desktop?.score).toBeGreaterThan(mobile?.score ?? 0);
  });
});
