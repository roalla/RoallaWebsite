import { analyzeSocialPresence } from "@/lib/social-presence/analyzer";

describe("analyzeSocialPresence", () => {
  it("scores a complete website-side social setup", () => {
    const html = `
      <!doctype html>
      <html><head>
        <title>Example Company</title>
        <meta name="description" content="Useful example description">
        <link rel="canonical" href="https://example.com/">
        <meta property="og:title" content="Example Company">
        <meta property="og:description" content="Useful example description">
        <meta property="og:image" content="https://example.com/share.jpg">
        <meta property="og:url" content="https://example.com/">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Example">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Example Company">
        <meta name="twitter:description" content="Useful example description">
        <meta name="twitter:image" content="https://example.com/share.jpg">
        <script type="application/ld+json">
          {"@context":"https://schema.org","@type":"Organization","name":"Example","logo":"https://example.com/logo.png","sameAs":["https://linkedin.com/company/example","https://instagram.com/example"]}
        </script>
      </head><body>
        <a href="https://linkedin.com/company/example">LinkedIn</a>
        <a href="https://instagram.com/example">Instagram</a>
      </body></html>`;

    const snapshot = analyzeSocialPresence(html, "https://example.com/" , "https://example.com/");

    expect(snapshot.score).toBe(100);
    expect(snapshot.checks.every((check) => check.status === "pass")).toBe(true);
    expect(snapshot.profiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ platform: "linkedin", foundIn: ["link", "schema"] }),
        expect.objectContaining({ platform: "instagram", foundIn: ["link", "schema"] }),
      ]),
    );
    expect(snapshot.preview.image).toBe("https://example.com/share.jpg");
  });

  it("returns actionable failed checks for a minimal page", () => {
    const snapshot = analyzeSocialPresence(
      "<html><head><title>Example</title></head><body></body></html>",
      "https://example.com/",
    );

    expect(snapshot.score).toBe(5);
    expect(snapshot.profiles).toEqual([]);
    expect(snapshot.checks.find((check) => check.id === "profileLinks")?.status).toBe("fail");
    expect(snapshot.checks.find((check) => check.id === "pageIdentity")?.status).toBe("partial");
  });

  it("ignores unsupported and unsafe profile schemes", () => {
    const snapshot = analyzeSocialPresence(
      '<a href="javascript:alert(1)">Bad</a><a href="https://example.com/social">Not social</a><a href="https://www.facebook.com/sharer/sharer.php?u=https://example.com">Share</a><a href="https://youtube.com/watch?v=abc">Video</a>',
      "https://example.com/",
    );
    expect(snapshot.profiles).toHaveLength(0);
  });
});
