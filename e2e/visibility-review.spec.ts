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
    await page.goto("/en/website-ai-visibility-review?utm_source=linkedin&utm_medium=paid-social&utm_campaign=visibility-q4&utm_content=owner-ad");
    await page.getByLabel("Enter your website address").fill("example.com");
    await page.getByRole("button", { name: "Start my free review" }).click();

    await expect(page).toHaveURL(/\/en\/tools\/digital-presence-snapshot\?/);
    const snapshotUrl = new URL(page.url());
    expect(snapshotUrl.searchParams.get("url")).toBe("https://example.com");
    expect(snapshotUrl.searchParams.get("campaign")).toBe("website-ai-visibility-review");
    expect(snapshotUrl.searchParams.get("conversion_source")).toBe("campaign_page");
    expect(snapshotUrl.searchParams.get("utm_source")).toBe("linkedin");
    expect(snapshotUrl.searchParams.get("utm_medium")).toBe("paid-social");
    expect(snapshotUrl.searchParams.get("utm_campaign")).toBe("visibility-q4");
    expect(snapshotUrl.searchParams.get("utm_content")).toBe("owner-ad");
  });

  test("review page explains business findings and offers a prioritized action plan", async ({ page }) => {
    await page.goto("/en/website-ai-visibility-review");

    await expect(page.getByRole("heading", { name: /connects technical signals to customer trust/i })).toBeVisible();
    const actionPlan = page.getByRole("link", { name: "Request my prioritized action plan" });
    await expect(actionPlan).toHaveAttribute("href", /\/en\/contact\?/);
    await expect(actionPlan).toHaveAttribute("href", /campaign=website-ai-visibility-review/);
    await expect(page.getByText(/Illustrative sample—not a result or promised score/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /turns complex offers into clearer digital journeys/i })).toBeVisible();
  });
});
