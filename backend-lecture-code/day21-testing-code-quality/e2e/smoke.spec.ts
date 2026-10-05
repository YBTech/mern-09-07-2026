// E2E smoke: "is the build alive?" A tiny, shallow set to run right after a deploy.
// `npm run test:smoke` stops at the first failure, and `npm run ci` runs it BEFORE the other
// E2E tests, so a dead build is rejected without wasting time on the slower ones.
import { test, expect } from "@playwright/test";

test.describe("smoke @smoke", () => {
  // 1. startup: the app boots and renders instead of crashing or showing a blank page
  test("the app starts", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Tiny Shop" })).toBeVisible();
  });

  // 2. core functionality: the main button is there and responds (no full checkout)
  test("the main journey is reachable", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Add Keyboard to cart" }).click();
    await expect(page.getByText("Total: $50")).toBeVisible();
  });

  // 3. system boundaries: the services behind the UI are reachable
  test("the APIs respond", async ({ request }) => {
    // gateway + catalog
    expect((await request.get("/api/products")).ok()).toBe(true);
    // orders: a 400 for an empty order still proves it answered
    expect((await request.post("/api/orders", { data: {} })).status()).toBe(400);
  });
});
