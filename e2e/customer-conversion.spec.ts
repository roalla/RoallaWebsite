import { test, expect } from "@playwright/test";

const conversionPath = "/services/customer-conversion-systems";

test("dark service headings stay white and visibility has one main landmark", async ({ page }) => {
  for (const locale of ["en", "fr"]) {
    await page.goto(`/${locale}${conversionPath}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.locator("main h3.service-dark-heading").first()).toHaveCSS("color", "rgb(255, 255, 255)");

    await page.goto(`/${locale}/services/search-ai-visibility`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(page.getByRole("main")).toHaveCount(1);
  }
});

test("growth pathway preserves the offer and attribution through review confirmation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const events: { name: string; parameters: Record<string, string> }[] = [];
  await page.exposeFunction("captureReviewEvent", (name, parameters) => events.push({ name, parameters }));
  await page.addInitScript(() => {
    const analyticsWindow = window as typeof window & {
      gtag?: (command: string, name: string, parameters: Record<string, string>) => void;
      captureReviewEvent: (name: string, parameters: Record<string, string>) => void;
    };
    Object.defineProperty(analyticsWindow, "gtag", {
      configurable: true,
      get: () => (command: string, name: string, parameters: Record<string, string>) => {
        if (command === "event") analyticsWindow.captureReviewEvent(name, parameters);
      },
      set: () => undefined,
    });
  });
  await page.route("**/api/consultation-request", async (route) => {
    expect(route.request().postDataJSON()).toMatchObject({
      intent: "automation",
      goal: "Demo requests from events need better follow-up.",
      sourcePage: expect.stringContaining("offer=customer-conversion-review"),
    });
    await route.fulfill({ json: { success: true } });
  });

  await page.goto("/en/solutions/need/growth-visibility");
  await page.getByRole("link", { name: "Explore Customer Conversion Systems" }).click();
  await expect(page).toHaveURL(/entry=growth-pathway/);
  await expect(page.getByRole("heading", { name: "Sample contact-to-meeting map" })).toBeVisible();
  await page.locator("#conversion-review").getByRole("link", { name: "Request a Customer Conversion Review" }).click();
  await expect(page.getByRole("heading", { name: "Customer Conversion Review", level: 1 })).toBeVisible();
  await expect(page).toHaveURL(/conversion_source=review/);
  const goal = page.getByLabel("What would you like to improve?");
  await expect(goal).toHaveValue(/I’d like a Customer Conversion Review/);
  await goal.fill("Demo requests from events need better follow-up.");
  await page.locator("#field-name").fill("Test Visitor");
  await page.locator("#field-email").fill("visitor@example.com");
  await page.locator("#field-company").fill("Example Company");
  await page.locator("#field-timeline").selectOption("exploring");
  await page.getByRole("button", { name: "Send my review request" }).click();
  await expect(page.getByRole("status").getByRole("heading", { name: "Customer Conversion Review request received" })).toBeVisible();
  await expect(page.getByRole("status").getByText("Demo requests from events need better follow-up.")).toBeVisible();

  await expect.poll(() => events.filter(({ name }) => /^(conversion_review_|consultation_request_submitted)/.test(name))).toEqual([
    { name: "conversion_review_entry_click", parameters: { entry: "growth-pathway", locale: "en", offer: "customer-conversion-review" } },
    ...["conversion_review_cta_click", "conversion_review_form_start", "consultation_request_submitted"].map((name) => ({
      name,
      parameters: {
        entry: "growth-pathway",
        locale: "en",
        offer: "customer-conversion-review",
        placement: "review",
        ...(name === "consultation_request_submitted" ? { intent: "automation", source: conversionPath } : {}),
      },
    })),
  ]);
});

test("mobile Digital Enablement visitors retain the review when switching languages", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/services/digital");
  await page.locator("#digital-outcomes").getByRole("link", { name: "Explore Customer Conversion Systems" }).click();
  await expect(page).toHaveURL(/entry=digital-enablement/);
  await page.locator("#conversion-review").scrollIntoViewIfNeeded();
  const mobileCta = page.getByRole("region", { name: "Request a Customer Conversion Review" });
  await mobileCta.getByRole("link").click();
  await expect(page).toHaveURL(/conversion_source=mobile/);
  const query = new URL(page.url()).search;

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator("#locale-dropdown-desktop").click();
  await page.getByRole("option", { name: "FR", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Revue de conversion client", level: 1 })).toBeVisible();
  expect(new URL(page.url()).search).toBe(query);
  const frenchGoal = page.getByLabel("Que souhaitez-vous améliorer?");
  await expect(frenchGoal).toHaveValue(/J’aimerais une revue de conversion client/);
  await frenchGoal.fill("Nous voulons mieux suivre les demandes de démonstration.");
  await page.locator("#locale-dropdown-desktop").click();
  await page.getByRole("option", { name: "EN", exact: true }).click();
  await expect(page.getByLabel("What would you like to improve?")).toHaveValue("Nous voulons mieux suivre les demandes de démonstration.");
  expect(new URL(page.url()).search).toBe(query);
});
