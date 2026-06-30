import { test, expect } from "@playwright/test";

// Next.js injects a route announcer with role="alert" — exclude it from alert queries
const alerts = (page: import("@playwright/test").Page) =>
  page.getByRole("alert").filter({ hasText: /.+/ });

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("redirects to home on valid credentials", async ({ page }) => {
    await page.getByLabel(/email or phone/i).fill("ana@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.locator("form").getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL("/home");
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.getByLabel(/email or phone/i).fill("unknown@example.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.locator("form").getByRole("button", { name: /sign in/i }).click();
    await expect(alerts(page).first()).toBeVisible();
  });

  test("shows validation errors without calling the API when fields are empty", async ({ page }) => {
    await page.locator("form").getByRole("button", { name: /sign in/i }).click();
    await expect(alerts(page)).toHaveCount(2);
    await expect(page).toHaveURL("/login");
  });
});

test.describe("Logout", () => {
  test("clears session and redirects to login", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email or phone/i).fill("ana@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.locator("form").getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL("/home");

    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page).toHaveURL("/login");
  });
});
