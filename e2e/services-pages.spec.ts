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

  test("schedule page shows website intent first", async ({ page }) => {
    await page.goto("/en/schedule");
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
