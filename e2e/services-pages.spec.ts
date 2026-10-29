import { test, expect } from "@playwright/test";

test.describe("Service pages", () => {
  test("business enablement page loads with service sections", async ({
    page,
  }) => {
    await page.goto("/en/services/business-advisory");
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
    await page.goto("/en/services/technology-advisory");
    await expect(
      page.getByRole("heading", {
        name: "Turn a technology decision into a business advantage.",
        level: 1,
      }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "I need direction", level: 3 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "I know the domain", level: 3 })).toBeVisible();

    await page.getByRole("button", { name: "Scale for growth" }).click();
    await expect(page.getByRole("heading", { name: "Align the technology investment with the next stage of growth", level: 4 })).toBeVisible();
    await expect(page.getByText(/An executive decision brief/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Talk it through with ROALLA" })).toHaveAttribute(
      "href",
      /intent=consulting.*focus=technology|focus=technology.*intent=consulting/,
    );

    await page.getByRole("button", { name: "Cybersecurity & continuity" }).click();
    await expect(page.getByText("SOC / MDR operations")).toBeVisible();
    await expect(page.getByText(/Build a defensible security and continuity program/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Discuss Cybersecurity & continuity" })).toHaveAttribute(
      "href",
      /need=cybersecurity-continuity/,
    );

    await expect(page.getByRole("heading", { name: "A decision partner—not another product pitch.", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Clarity, market reach, and follow-through.", level: 2 })).toBeVisible();
    await expect(page.getByText("Supplier access, independence, and compensation")).toBeVisible();
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
      page.getByRole("heading", { name: /Tell us what needs to change/i, level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /^Website/i })).toBeVisible();
  });

  test("new service architecture routes are bilingual and reachable", async ({
    page,
  }) => {
    for (const route of [
      "digital-products",
      "search-ai-visibility",
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
