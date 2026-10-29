import { test, expect } from "@playwright/test";

test.describe("Services brand journey", () => {
  test("consulting page shows plain services and how we work", async ({
    page,
  }) => {
    await page.goto("/en/services/business-advisory");

    await expect(
      page.getByRole("heading", {
        name: "Business guidance that turns priorities into execution.",
        level: 1,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(/Prepare.*Transform.*Emerge.*Soar/),
    ).toHaveCount(0);
    await expect(page.locator("#pillar-prepare")).toHaveCount(0);
    await expect(page.locator("#pillar-transform")).toHaveCount(0);
    await expect(page.locator("#pillar-emerge")).toHaveCount(0);
    await expect(page.locator("#pillar-soar")).toHaveCount(0);

    await expect(
      page.getByRole("heading", { name: "Strategy & Roadmaps", level: 3 }),
    ).toBeVisible();
    const outcomes = page.locator("#business-outcomes");
    await expect(
      outcomes.getByRole("heading", {
        name: "Turn competing priorities into focused, measurable execution.",
        level: 2,
      }),
    ).toBeVisible();
    await expect(outcomes.locator("img")).toHaveCount(3);
    await expect(
      outcomes.getByRole("link", { name: "Explore operations improvement" }),
    ).toHaveAttribute("href", "#operations");
    await expect(
      page.getByRole("heading", {
        name: "Operations & Process Improvement",
        level: 3,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Leadership & Team Enablement",
        level: 3,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Data, Innovation & Digital Readiness",
        level: 3,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Technology Advisory & Solution Sourcing",
        level: 2,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Explore Technology Advisory" }),
    ).toHaveAttribute("href", "/en/services/technology-advisory");

    await expect(
      page.getByRole("heading", { name: "How we work with you", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Discovery call to align on goals, constraints, and urgency.",
      ),
    ).toBeVisible();
  });

  test("ecosystem page publishes relationship types, business needs, and compensation disclosure", async ({ page }) => {
    await page.goto("/en/partners");

    await expect(page.getByRole("heading", { name: "ROALLA Technology Ecosystem.", level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "More options. Clearer decisions.",
        level: 2,
      }),
    ).toBeVisible();
    await expect(page.getByText("Access is not endorsement.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Relationship matrix", level: 2 })).toBeVisible();
    await expect(page.getByRole("link", { name: /Technology Providers/i }).first()).toHaveAttribute("href", "/en/partners/technology-providers");
    await expect(page.getByRole("link", { name: /Commercial Transparency/i }).first()).toHaveAttribute("href", "/en/partners/compensation");
    await expect(page.getByRole("link", { name: /Strategic Relationships/i }).first()).toHaveAttribute("href", "/en/partners/strategic-relationships");
  });

  test("digital page leads with build offers and process line", async ({
    page,
  }) => {
    await page.goto("/en/services/digital");

    await expect(
      page.getByRole("heading", {
        name: "Websites & Brand Presence",
        level: 3,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Applications & Digital Products",
        level: 3,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Workflow Automation & Integrations",
        level: 3,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "AI Support & Intelligent Workflows",
        level: 3,
      }),
    ).toBeVisible();
    await expect(page.locator("#websites")).toBeVisible();
    await expect(page.locator("#ai-support")).toBeVisible();
    const outcomes = page.locator("#digital-outcomes");
    await expect(
      outcomes.getByRole("heading", {
        name: "Launch digital work that creates value—and keeps improving.",
        level: 2,
      }),
    ).toBeVisible();
    await expect(outcomes.locator("img")).toHaveCount(3);
    await expect(
      outcomes.getByRole("link", {
        name: "Explore automation and integrations",
      }),
    ).toHaveAttribute("href", "#automation");
    await expect(
      page
        .locator("#digital-builds")
        .getByText(/Prepare.*Transform.*Emerge.*Soar/)
        .first(),
    ).toBeVisible();
  });

  test("service jump nav scrolls to section", async ({ page }) => {
    await page.goto("/en/services/business-advisory");
    await page
      .getByRole("link", { name: "Leadership & Team Enablement", exact: true })
      .click();
    await expect(page.locator("#leadership")).toBeInViewport();
  });
});
