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
    await expect(page).toHaveURL("/transaction/new");

    await page.getByLabel(/amount/i).fill("50");
    await page.getByRole("button", { name: /enter new contact/i }).click();
    await page.getByLabel(/name/i).fill("Test User");
    await page.getByLabel(/email/i).fill("test@example.com");

    await page.getByRole("button", { name: /review/i }).click();
    await expect(page).toHaveURL(/\/transaction\/confirm/);
    await expect(page.getByText("$50.00", { exact: true })).toBeVisible();
    await expect(page.getByText("Test User")).toBeVisible();

    await page.getByRole("button", { name: /confirm/i }).click();
    await expect(page).toHaveURL(/\/transaction\/tx-/);
    await expect(page.getByText(/you sent/i)).toBeVisible();
  });

  test("blocks navigation to /confirm without a draft", async ({ page }) => {
    await page.goto("/transaction/confirm");
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
    await expect(page).toHaveURL(/\/transaction\/confirm/);
    await page.getByRole("button", { name: /confirm/i }).click();

    // Client aborts after 8s — give both assertions enough time
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

  test("validates amount before navigating to confirm", async ({ page }) => {
    await page.getByRole("link", { name: /new transaction/i }).click();
    await page.getByRole("button", { name: /review/i }).click();
    await expect(page).toHaveURL("/transaction/new");
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
    await expect(page).toHaveURL(/\/transaction\/tx-/);
    await expect(page.getByText(/you sent/i)).toBeVisible();
  });
});
