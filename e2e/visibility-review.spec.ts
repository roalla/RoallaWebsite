import { expect, test } from "@playwright/test";

test.describe("Website and AI visibility funnel", () => {
  test("English service connects the assessment and digital-product paths", async ({ page }) => {
    await page.goto("/en/services/search-ai-visibility");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Help more people—and intelligent systems—find and understand your business.",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Run the free website & AI review" }).first(),
    ).toHaveAttribute("href", "/en/website-ai-visibility-review");
    await expect(
      page.getByRole("heading", {
        name: "Make an application or SaaS product understandable before asking people to adopt it",
      }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore digital products" })).toHaveAttribute(
      "href",
      "/en/services/portfolio/digital-products",
    );
  });

  test("French service keeps equivalent funnel paths", async ({ page }) => {
    await page.goto("/fr/services/search-ai-visibility");

    await expect(
      page.getByRole("link", { name: "Lancer l’évaluation Web et IA gratuite" }).first(),
    ).toHaveAttribute("href", "/fr/website-ai-visibility-review");
    await expect(
      page.getByRole("heading", {
        name: "Rendez une application ou un produit SaaS compréhensible avant de demander son adoption",
      }),
    ).toBeVisible();
  });

  test("review entry carries the website and campaign into the snapshot", async ({ page }) => {
    await page.goto("/en/website-ai-visibility-review");
    await page.getByLabel("Enter your website address").fill("example.com");
    await page.getByRole("button", { name: "Start my free review" }).click();

    await expect(page).toHaveURL(/\/en\/tools\/digital-presence-snapshot\?/);
    const snapshotUrl = new URL(page.url());
    expect(snapshotUrl.searchParams.get("url")).toBe("https://example.com");
    expect(snapshotUrl.searchParams.get("campaign")).toBe("website-ai-visibility-review");
  });
});
