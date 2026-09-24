import { companionWorkshopCopy, companionWorkshopIds } from "@/lib/workshops/companion-workshops-content";

describe("companion workshop content", () => {
  it.each(companionWorkshopIds)("provides a complete bilingual experience for %s", (id) => {
    for (const locale of ["en", "fr"]) {
      const copy = companionWorkshopCopy(id, locale);
      expect(copy.slides).toHaveLength(12);
      expect(copy.practice).toHaveLength(3);
      expect(copy.planFields).toHaveLength(3);
      expect(copy.tools).toHaveLength(4);
      expect(copy.faqs).toHaveLength(4);
      expect(copy.slides.every((slide) => slide.notes && slide.stage && slide.visual)).toBe(true);
      expect(copy.heroAlt.trim()).not.toBe("");
    }
  });

  it("uses localized French slide copy", () => {
    expect(companionWorkshopCopy("workload-conversation", "fr").slides[0].title).toContain("rupture");
    expect(companionWorkshopCopy("digital-calm", "fr").slides[0].title).toContain("Calmer");
    expect(companionWorkshopCopy("decision-hour", "fr").slides[0].title).toContain("responsable");
    expect(companionWorkshopCopy("offer-page", "fr").title).toContain("offre");
    expect(companionWorkshopCopy("ideation", "fr").title).toContain("liste");
  });
});
