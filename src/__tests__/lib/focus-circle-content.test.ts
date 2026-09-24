import { focusCircleCopy } from "@/lib/workshops/focus-circle-content";

describe("Focus Circle presentation content", () => {
  it.each(["en", "fr"])("keeps a complete localized 16-slide journey for %s", (locale) => {
    const copy = focusCircleCopy(locale);

    expect(copy.slides).toHaveLength(16);
    expect(copy.slides.every((slide) => slide.stage && slide.visual && slide.notes)).toBe(true);
    expect(copy.chapters.at(-1)?.slide).toBe(15);
  });

  it.each(["en", "fr"])("provides accessible alternatives for every photograph in %s", (locale) => {
    const slidesWithImages = focusCircleCopy(locale).slides.filter((slide) => slide.imageSrc);

    expect(slidesWithImages.length).toBeGreaterThanOrEqual(3);
    expect(slidesWithImages.every((slide) => Boolean(slide.imageAlt?.trim()))).toBe(true);
  });

  it.each(["en", "fr"])("includes the requested visual teaching beats in %s", (locale) => {
    const visuals = focusCircleCopy(locale).slides.map((slide) => slide.visual);

    expect(visuals).toEqual(
      expect.arrayContaining(["before-after", "kanban", "support-compare", "rhythm", "facilitator", "close"]),
    );
  });
});
