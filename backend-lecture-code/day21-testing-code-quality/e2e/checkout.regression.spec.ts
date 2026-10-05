// E2E regression: a test that exists because a bug once happened, so it can't come back.
// What makes it a regression test is WHY it exists (a fixed bug), not what it covers: it
// could just as well be a happy-path or a critical-path test.
import { test, expect } from "@playwright/test";

// Bug #517 (customer complaint): after a rejected order the cart was wiped, so the customer
// had to start over. Fixed: a rejected order keeps the cart. This test pins the fix.
// @regression tag: run just these with `npm run test:regression`
test("a rejected order keeps the cart so the customer can fix it @regression", async ({ page }) => {
  await page.goto("/");

  // reproduce the original bug report: order more Mouse than is in stock
  await page.getByRole("button", { name: "Add Mouse to cart" }).click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Increase Mouse" }).click();
  }
  await page.getByLabel("Email").fill("ana@example.com");
  await page.getByRole("button", { name: "Place order" }).click();
  await expect(page.getByRole("alert")).toHaveText("only 3 Mouse left in stock");

  // the actual regression check: the cart survived the rejection
  await expect(page.getByText("Quantity: 4")).toBeVisible();
  await expect(page.getByText("Total: $100")).toBeVisible();
});
