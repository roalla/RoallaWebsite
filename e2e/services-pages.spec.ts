import { test, expect } from "@playwright/test";

test.describe("Service pages", () => {
  test("business enablement page loads with service sections", async ({
    page,
  }) => {
    await page.goto("/en/programs/business-enablement");
    await expect(
      page.getByRole("heading", {
        name: "Business guidance that turns priorities into execution.",
        level: 1,
      }),
    ).toBeVisible();
    await expect(page.locator("#strategy-roadmaps")).toBeVisible();
    await expect(page.getByText(/Not sure which lane fits/i)).toBeVisible();
  });

  test("technology advisory page is separate from business advisory", async ({
    page,
  }) => {
    await page.goto("/en/programs/technology-advisory");
    await expect(
      page.getByRole("heading", {
        name: "Choose technology with clearer requirements and stronger options.",
        level: 1,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Expanded supplier access through Telarus",
        level: 2,
      }),
    ).toBeVisible();
    await expect(page.locator("#strategy-roadmaps")).toHaveCount(0);
  });

  test("digital enablement service page links to portfolio", async ({
    page,
  }) => {
    await page.goto("/en/services/digital");
    await expect(
      page.getByRole("heading", { name: "Digital Enablement", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /View Digital Portfolio/i }).first(),
    ).toBeVisible();
    await expect(page.locator("#ai-support")).toBeVisible();
  });

  test("contact path uses slim light form", async ({ page }) => {
    await page.goto("/en/contact?intent=website");
    await expect(
      page.getByRole("heading", { name: /Tell us how to reach you/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/Service type/i)).toBeVisible();
    await expect(page.getByLabel(/Full name/i)).toBeVisible();
    await expect(page.getByLabel(/Work email/i)).toBeVisible();
    await expect(page.getByLabel(/One-line note/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Send my request/i }),
    ).toBeVisible();
  });

  test("legacy schedule url redirects to contact", async ({ page }) => {
    await page.goto("/en/schedule?intent=website");
    await expect(page).toHaveURL(/\/en\/contact\?intent=website/);
    await expect(
      page.getByRole("heading", { name: /Tell us how to reach you/i }),
    ).toBeVisible();
  });

  test("contact page shows website intent first", async ({ page }) => {
    await page.goto("/en/contact");
    await expect(
      page.getByRole("heading", { name: /Service Inquiry/i, level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /^Website/i })).toBeVisible();
  });

  test("new service architecture routes are bilingual and reachable", async ({
    page,
  }) => {
    for (const route of [
      "digital-products",
      "digital-visibility-optimization",
      "automation",
      "managed-optimization",
    ]) {
      await page.goto(`/en/services/${route}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.goto(`/fr/services/${route}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });
});
