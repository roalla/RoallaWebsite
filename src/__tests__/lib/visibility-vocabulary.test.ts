import { extractVisibilityVocabulary } from "@/lib/digital-presence/vocabulary";

const richHtml = `
<!doctype html>
<html lang="en">
<head>
  <title>Roalla | Business Enablement for Growing Teams</title>
  <meta name="description" content="Roalla helps Quebec SMBs get found in search and AI answers with clear digital presence work.">
  <meta name="keywords" content="search visibility, AI readiness, digital presence">
  <meta property="og:title" content="Roalla Business Enablement">
  <meta property="og:description" content="Search and AI visibility for businesses that want clearer online language.">
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Roalla",
      "description": "Business enablement consulting",
      "about": "Digital presence and visibility",
      "keywords": "visibility, consulting",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Montreal",
        "addressRegion": "QC",
        "addressCountry": "CA"
      },
      "areaServed": "Quebec"
    }
  </script>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Search and AI Visibility",
      "serviceType": "SEO and agentic readiness"
    }
  </script>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
        "@type": "Question",
        "name": "How does Roalla improve search visibility?",
        "acceptedAnswer": { "@type": "Answer", "text": "By clarifying on-page language." }
      }]
    }
  </script>
</head>
<body>
  <header>
    <nav>
      <a href="/services">Search visibility</a>
      <a href="/services/digital">Digital builds</a>
      <a href="/contact">Contact</a>
    </nav>
  </header>
  <h1>Get found in search and AI answers</h1>
  <h2>Website language that assistants can cite</h2>
  <h3>Local business presence</h3>
  <details>
    <summary>What language should appear on my homepage?</summary>
    <p>Clear services, location, and differentiators.</p>
  </details>
</body>
</html>`;

const thinHtml = `<html><head><title>Home</title></head><body><h1>Welcome</h1><p>Hello</p></body></html>`;

describe("extractVisibilityVocabulary", () => {
  it("extracts site vocabulary from title, headings, meta, OG, JSON-LD, nav, and FAQ", () => {
    const vocabulary = extractVisibilityVocabulary(richHtml);

    expect(vocabulary.phrases.some((phrase) => phrase.sources.includes("title"))).toBe(true);
    expect(vocabulary.phrases.some((phrase) => phrase.sources.includes("h1"))).toBe(true);
    expect(vocabulary.phrases.some((phrase) => phrase.sources.includes("metaDescription"))).toBe(true);
    expect(vocabulary.phrases.some((phrase) => phrase.sources.includes("ogTitle"))).toBe(true);
    expect(vocabulary.phrases.some((phrase) => phrase.sources.includes("jsonLd"))).toBe(true);
    expect(vocabulary.phrases.some((phrase) => phrase.sources.includes("nav"))).toBe(true);
    expect(vocabulary.phrases.some((phrase) => phrase.sources.includes("faq"))).toBe(true);
    expect(vocabulary.phrases.map((phrase) => phrase.text)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Roalla/i),
        expect.stringMatching(/search visibility/i),
        expect.stringMatching(/Get found in search/i),
      ]),
    );
  });

  it("marks title and H1 language as primary search topics", () => {
    const vocabulary = extractVisibilityVocabulary(richHtml);

    expect(vocabulary.search.primary.join(" ")).toMatch(/found in search|Roalla|Business Enablement/i);
    expect(vocabulary.search.supporting.join(" ")).toMatch(/Website language|Digital builds|Search and AI Visibility/i);
    expect(vocabulary.search.primary).not.toEqual(vocabulary.search.supporting);
  });

  it("builds agentic entities and gaps for thin pages", () => {
    const rich = extractVisibilityVocabulary(richHtml);
    expect(rich.agentic.entities.some((entity) => entity.kind === "organization" && /Roalla/i.test(entity.text))).toBe(true);
    expect(rich.agentic.entities.some((entity) => entity.kind === "service")).toBe(true);
    expect(rich.agentic.entities.some((entity) => entity.kind === "location")).toBe(true);
    expect(rich.agentic.gaps.length).toBe(0);

    const thin = extractVisibilityVocabulary(thinHtml);
    expect(thin.agentic.gaps.map((gap) => gap.id)).toEqual(
      expect.arrayContaining(["missingOrganization", "vagueServices", "missingLocation", "thinIdentity"]),
    );
    expect(thin.opportunities.length).toBeGreaterThanOrEqual(5);
    expect(thin.opportunities.length).toBeLessThanOrEqual(10);
    expect(thin.opportunities.map((item) => item.id)).toEqual(
      expect.arrayContaining(["clarifyOrganization", "nameServices", "addJsonLdIdentity"]),
    );
  });

  it("does not invent rank or volume fields", () => {
    const vocabulary = extractVisibilityVocabulary(richHtml) as VisibilityVocabulary & Record<string, unknown>;
    expect(vocabulary).not.toHaveProperty("rank");
    expect(vocabulary).not.toHaveProperty("volume");
    expect(vocabulary).not.toHaveProperty("serp");
  });
});

type VisibilityVocabulary = ReturnType<typeof extractVisibilityVocabulary>;
