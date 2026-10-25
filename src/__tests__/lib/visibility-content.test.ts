import { visibilityContent } from "@/lib/visibility-content";

describe("Digital Visibility Optimization content", () => {
  it.each(["en", "fr"] as const)(
    "keeps the %s service complete and claim-safe",
    (locale) => {
      const content = visibilityContent[locale];

      expect(content.lanes).toHaveLength(4);
      expect(content.packages).toHaveLength(4);
      expect(content.insights.length).toBeGreaterThanOrEqual(2);
      expect(content.productItems.length).toBeGreaterThanOrEqual(4);
      expect(content.faqs.length).toBeGreaterThanOrEqual(4);
      expect(content.disclaimer.toLowerCase()).toContain(locale === "fr" ? "garant" : "guarante");
      expect(content.packages.some(([name]) => name.toLowerCase().includes(locale === "fr" ? "produits numériques" : "digital products"))).toBe(true);
    },
  );

  it("links supporting content to published insight slugs", () => {
    const expectedSlugs = [
      "geo-seo-aeo-and-bots",
      "how-ai-systems-understand-websites",
      "structured-data-for-small-business",
    ];

    expect(visibilityContent.en.insights.map(([slug]) => slug)).toEqual(expectedSlugs);
    expect(visibilityContent.fr.insights.map(([slug]) => slug)).toEqual(expectedSlugs);
  });
});
