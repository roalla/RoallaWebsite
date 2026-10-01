import { scoreAgenticReadiness } from "@/lib/agentic-readiness/score";

const longParagraph = `<p>${"Bookkeeping for owner-led firms in Hamilton, with a monthly close and a named contact who explains the numbers. ".repeat(6)}</p>`;

describe("scoreAgenticReadiness", () => {
  it("stays low when search tags exist but an assistant has little to quote", () => {
    const html = `
      <html><head>
        <title>Example Co</title>
        <meta name="description" content="A useful description that would satisfy a search check.">
        <link rel="canonical" href="https://example.com/">
      </head><body><img src="/hero.jpg" alt=""></body></html>`;

    const result = scoreAgenticReadiness({ html, robotsTxt: null, llmsTxt: null });

    expect(result.score).toBe(6);
    expect(result.signals).toEqual([
      { id: "readable", points: 0, maxPoints: 20 },
      { id: "answer", points: 0, maxPoints: 20 },
      { id: "facts", points: 0, maxPoints: 20 },
      { id: "liftable", points: 0, maxPoints: 15 },
      { id: "guide", points: 0, maxPoints: 15 },
      { id: "retrieval", points: 6, maxPoints: 10 },
    ]);
  });

  it("scores a page an assistant can fetch, quote, and describe", () => {
    const html = `
      <html><head>
        <title>Example Co</title>
        <script type="application/ld+json">
          {"@context":"https://schema.org","@graph":[
            {"@type":"Organization","name":"Example Co","description":"Monthly bookkeeping for owner-led firms that need a clear close."},
            {"@type":"FAQPage","mainEntity":[]}
          ]}
        </script>
      </head><body>
        <h1>Monthly bookkeeping</h1>
        ${longParagraph}
        <a href="/llms.txt">Guide</a>
      </body></html>`;
    const robotsTxt = "User-agent: *\nAllow: /\n";
    const llmsTxt = "# Example Co\n\nMonthly bookkeeping for owner-led firms. Contact the studio for a scoped review.";

    const result = scoreAgenticReadiness({ html, robotsTxt, llmsTxt });

    expect(result.score).toBe(100);
    expect(result.signals.every((signal) => signal.points === signal.maxPoints)).toBe(true);
  });

  it("drops when the site blocks retrieval even if the page text is strong", () => {
    const html = `<html><body><h1>Monthly bookkeeping</h1>${longParagraph}</body></html>`;
    const open = scoreAgenticReadiness({
      html,
      robotsTxt: "User-agent: *\nAllow: /\n",
      llmsTxt: null,
    }).score;
    const blocked = scoreAgenticReadiness({
      html,
      robotsTxt: "User-agent: *\nDisallow: /\n",
      llmsTxt: null,
    }).score;

    expect(open - blocked).toBe(10);
  });
});
