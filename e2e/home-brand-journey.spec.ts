import { test, expect } from "@playwright/test";

test.describe("Homepage brand journey", () => {
  test("site shows business outcomes and connected technology practices", async ({
    page,
  }) => {
    await page.goto("/en");

    await expect(
      page.getByRole("heading", {
        name: "What are you trying to move forward?",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Outcomes you can measure—and work you can click" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Advice and delivery stay connected" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The right relationship, clearly explained." })).toBeVisible();
    await expect(page.locator("#why-roalla")).toBeVisible();
  });

  test("programs strip links to business enablement", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("link", { name: "Business Advisory" }).first().click();
    await expect(page).toHaveURL(/\/services\/business-advisory/);
    await expect(
      page.getByRole("heading", {
        name: "Business guidance that turns priorities into execution.",
        level: 1,
      }),
    ).toBeVisible();
  });
});
