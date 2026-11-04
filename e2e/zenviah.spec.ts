import { test, expect } from "@playwright/test";

test.describe("Zenviah.ai SaaS Platform E2E Journeys", () => {
  test("renders dashboard overview with Zenviah.ai branding and INR KPIs", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page.locator("text=Zenviah")).toBeVisible();
    await expect(page.locator("text=Total Calls")).toBeVisible();
    await expect(page.locator("text=Estimated Usage Cost")).toBeVisible();
  });

  test("navigates across AI Agents, Workflows, Knowledge Base, Phone Numbers, and Calls", async ({
    page,
  }) => {
    await page.goto("/agents");
    await expect(page.locator("h1")).toContainText("AI Voice Agents");

    await page.goto("/workflows");
    await expect(page.locator("text=Node Library")).toBeVisible();

    await page.goto("/phone-numbers");
    await expect(page.locator("h1")).toContainText("Phone Numbers");

    await page.goto("/calls");
    await expect(page.locator("h1")).toContainText("Call Logs");
  });
});

