import { test, expect } from "@playwright/test";

// Next.js injects a route announcer with role="alert" — exclude it from alert queries
const alerts = (page: import("@playwright/test").Page) =>
  page.getByRole("alert").filter({ hasText: /.+/ });

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/email or phone/i).fill("ana@example.com");
  await page.getByLabel(/password/i).fill("password123");
  await page.locator("form").getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL("/home");
});

test.describe("New transaction", () => {
  test("happy path: sends money and shows receipt", async ({ page }) => {
    await page.getByRole("link", { name: /new transaction/i }).click();
    await page.getByLabel(/amount/i).fill("50");
    await page.getByRole("button", { name: /enter new contact/i }).click();
    await page.getByLabel(/name/i).fill("Test User");
    await page.getByLabel(/email/i).fill("test@example.com");

    await page.getByRole("button", { name: /review/i }).click();

    // Modal appears on same page — no URL change
    await expect(page.getByText("Test User")).toBeVisible();
    await expect(page.getByText("$50.00", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: /confirm/i }).click();
    await expect(page).toHaveURL(/\/transaction\/tx-/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/you sent/i)).toBeVisible();
  });

  test("back button in modal dismisses it and returns to the form", async ({ page }) => {
    await page.getByRole("link", { name: /new transaction/i }).click();
    await page.getByLabel(/amount/i).fill("50");
    await page.getByRole("button", { name: /enter new contact/i }).click();
    await page.getByLabel(/name/i).fill("Test User");
    await page.getByLabel(/email/i).fill("test@example.com");

    await page.getByRole("button", { name: /review/i }).click();
    await expect(page.getByRole("button", { name: /confirm/i })).toBeVisible();

    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page.getByRole("button", { name: /confirm/i })).not.toBeVisible();
    await expect(page).toHaveURL("/transaction/new");
  });

  test("Juan Error — shows network error and retry button", async ({ page }) => {
    await page.getByRole("link", { name: /new transaction/i }).click();
    await page.getByLabel(/amount/i).fill("10");
    await page.getByRole("button", { name: /juan error/i }).click();

    await page.getByRole("button", { name: /review/i }).click();
    await page.getByRole("button", { name: /confirm/i }).click();

    await expect(alerts(page).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /try again/i })).toBeVisible();
  });

  test("Edén TimeOut — shows network error after client timeout and allows retry", async ({ page }) => {
    test.setTimeout(25000);

    await page.getByRole("link", { name: /new transaction/i }).click();
    await page.getByLabel(/amount/i).fill("10");
    await page.getByRole("button", { name: /timeout/i }).click();

    await page.getByRole("button", { name: /review/i }).click();
    await expect(page).toHaveURL("/transaction/new");
    await page.getByRole("button", { name: /confirm/i }).click();

    await expect(alerts(page).first()).toBeVisible({ timeout: 12000 });
    await expect(page.getByRole("button", { name: /try again/i })).toBeVisible({ timeout: 12000 });
  });

  test("Max Unknown — shows unknown error and retry button", async ({ page }) => {
    await page.getByRole("link", { name: /new transaction/i }).click();
    await page.getByLabel(/amount/i).fill("10");
    await page.getByRole("button", { name: /max unknown/i }).click();

    await page.getByRole("button", { name: /review/i }).click();
    await page.getByRole("button", { name: /confirm/i }).click();

    await expect(alerts(page).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /try again/i })).toBeVisible();
  });

  test("validates amount before opening the modal", async ({ page }) => {
    await page.getByRole("link", { name: /new transaction/i }).click();
    await page.getByRole("button", { name: /review/i }).click();
    await expect(page.getByRole("button", { name: /confirm/i })).not.toBeVisible();
    await expect(alerts(page).first()).toBeVisible();
  });
});

test.describe("Transaction history", () => {
  test("transaction in the list links to its detail page", async ({ page }) => {
    await page.getByRole("link", { name: /new transaction/i }).click();
    await page.getByLabel(/amount/i).fill("25");
    await page.getByRole("button", { name: /enter new contact/i }).click();
    await page.getByLabel(/name/i).fill("Link Test");
    await page.getByLabel(/email/i).fill("linktest@example.com");
    await page.getByRole("button", { name: /review/i }).click();
    await page.getByRole("button", { name: /confirm/i }).click();
    await expect(page).toHaveURL(/\/transaction\/tx-/);

    await page.goto("/home");
    await page.getByRole("listitem").first().getByRole("link").click();
    await expect(page).toHaveURL(/\/transaction\/tx-/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/you sent/i)).toBeVisible();
  });
});

test.describe("Received transaction", () => {
  test("recipient sees the transaction as received in their home and detail page", async ({ page }) => {
    // Ana sends to Carlos (a registered user)
    await page.getByRole("link", { name: /new transaction/i }).click();
    await page.getByLabel(/amount/i).fill("50");
    await page.getByRole("button", { name: /enter new contact/i }).click();
    await page.getByLabel(/name/i).fill("Carlos Méndez");
    await page.getByLabel(/email/i).fill("carlos@example.com");
    await page.getByRole("button", { name: /review/i }).click();
    await page.getByRole("button", { name: /confirm/i }).click();
    await expect(page).toHaveURL(/\/transaction\/tx-/, { timeout: 10000 });

    // Log out Ana
    await page.goto("/home");
    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page).toHaveURL("/login");

    // Log in as Carlos
    await page.getByLabel(/email or phone/i).fill("carlos@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.locator("form").getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL("/home");

    // Carlos sees the received transaction at the top of the list
    const firstItem = page.getByRole("listitem").first();
    await expect(firstItem.getByText(/\+\$50\.00/)).toBeVisible();
    await expect(firstItem.getByText(/received/i)).toBeVisible();

    // Carlos clicks it and sees the detail page
    await page.getByRole("listitem").first().getByRole("link").click();
    await expect(page).toHaveURL(/\/transaction\/tx-/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/you received/i)).toBeVisible();
    await expect(page.getByText(/ana/i)).toBeVisible();
  });
});
