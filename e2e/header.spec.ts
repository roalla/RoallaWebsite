import { test, expect } from "@playwright/test";

test.describe("Header", () => {
  test("homepage has skip link and main content", async ({ page }) => {
    await page.goto("/");
    const skip = page.getByRole("link", { name: /skip to main content/i });
    await expect(skip).toHaveAttribute("href", "#main-content");
    await skip.focus();
    await expect(skip).toBeFocused();
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("How We Help exposes needs and the comprehensive outcome browser", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/en");

    await page.getByLabel("Main navigation").getByRole("button", { name: "How We Help" }).click();
    const menu = page.locator('[aria-labelledby="digital-dropdown-desktop"]');
    await expect(menu.getByText("What do you need to move forward?", { exact: true })).toBeVisible();
    await expect(
      menu.locator('a[href="/en/services/technology-advisory"]'),
    ).toHaveAttribute("role", "menuitem");
    await expect(
      menu.locator('a[href="/en/website-design"]'),
    ).toHaveAttribute("role", "menuitem");
    await expect(
      menu.locator('a[href="/en/services/ai-agents"]'),
    ).toHaveAttribute("role", "menuitem");
    await expect(
      menu.locator('a[href="/en/services/search-ai-visibility"]'),
    ).toHaveAttribute("role", "menuitem");
    await expect(
      menu.getByRole("menuitem", { name: /View all outcome pathways/i }),
    ).toHaveAttribute("href", "/en/solutions");
    await expect(
      menu.locator('a[href="/en/partners"]'),
    ).toHaveAttribute("role", "menuitem");
    await expect(menu.locator('a[role="menuitem"]')).toHaveCount(12);
  });

  test("digital portfolio is a persistent primary destination", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/en");

    await expect(
      page
        .getByLabel("Main navigation")
        .getByRole("link", { name: "Digital Portfolio" }),
    ).toHaveAttribute("href", "/en/services/portfolio");
  });

  test("business advisory and workshops share one navigation category", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/en");

    await page.getByLabel("Main navigation").getByRole("button", { name: "Advisory & Workshops" }).click();
    const menu = page.locator('[aria-labelledby="workshops-dropdown-desktop"]');
    await expect(menu.getByText("Advisory Outcomes", { exact: true })).toBeVisible();
    await expect(menu.getByText("Ways to Work With Us", { exact: true })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: /Business Advisory/ })).toHaveAttribute(
      "href",
      "/en/services/business-advisory",
    );
    await expect(menu.locator('a[role="menuitem"]')).toHaveCount(7);
    await expect(menu.getByRole("menuitem", { name: /Team Workshops/ })).toHaveAttribute(
      "href",
      "/en/programs/workshops",
    );
    await expect(menu.getByRole("menuitem", { name: /Focus Circle/ })).toHaveAttribute(
      "href",
      "/en/programs/workshops/focus-circle",
    );
  });

  test("primary service routes are reachable", async ({ page }) => {
    await page.goto("/en/services/business-advisory");
    await expect(
      page.getByRole("heading", {
        name: "Business guidance that turns priorities into execution.",
        level: 1,
      }),
    ).toBeVisible();

    await page.goto("/en/services/technology-advisory");
    await expect(
      page.getByRole("heading", {
        name: "Choose the right technology—and carry it through implementation.",
        level: 1,
      }),
    ).toBeVisible();

    await page.goto("/en/services/digital");
    await expect(
      page.getByRole("heading", { name: "Digital Enablement", level: 1 }),
    ).toBeVisible();

    await page.goto("/en/services/digital-events");
    await expect(
      page.getByRole("heading", { name: "Digital Events", level: 1 }),
    ).toBeVisible();

    await page.goto("/en/services/portfolio");
    await expect(
      page.getByRole("heading", { name: "Digital Portfolio", level: 1 }),
    ).toBeVisible();
  });

  test("homepage hides founding client promo link", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/en");

    await expect(
      page.getByRole("link", { name: /website packages/i }),
    ).toHaveCount(0);
  });

  test("founding client promo appears on digital routes", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/en/services/digital");

    const promo = page.getByRole("link", { name: /website packages/i });
    await expect(promo).toBeVisible();
    await expect(promo).toHaveAttribute("href", "/en/website-package");
  });

  test("founding client promo is hidden on the offer page", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/en/website-package");

    await expect(
      page.getByRole("link", { name: /website packages/i }),
    ).toHaveCount(0);
  });
});
