// E2E critical path: checkout, the flow that makes the money, tested against the real
// backend (nothing stubbed). Compare with cart.happy-path.spec.ts: the same kind of success
// test, but because the business can't afford to break this flow it ALSO gets unhappy paths.
import { test, expect } from "@playwright/test";

// @critical tag: run just the money flows with `npm run test:critical`
// HAPPY path of the critical flow: everything goes right, from first click to confirmation
test("a customer can buy a keyboard @critical", async ({ page }) => {
  await page.goto("/");

  // Reads like a manual script: only what a user sees, no React state or function names
  await page.getByRole("button", { name: "Add Keyboard to cart" }).click();
  await page.getByRole("button", { name: "Increase Keyboard" }).click();
  await expect(page.getByText("Total: $100")).toBeVisible();

  await page.getByLabel("Email").fill("ana@example.com");
  await page.getByRole("button", { name: "Place order" }).click();

  // auto-waits up to 5s, so the orders service's random 200–1200ms delay doesn't matter
  await expect(page.getByTestId("confirmation")).toHaveText("Order placed");
  await expect(page.getByText("total $100")).toBeVisible();
});

// UNHAPPY paths: the ways checkout can go wrong for a customer. The happy-path file
// deliberately never tests these; the critical path has to, because each one costs a sale.

test("the real orders service rejects more than is in stock @critical", async ({ page }) => {
  await page.goto("/");

  // Mouse has 3 in stock: ask for 4
  await page.getByRole("button", { name: "Add Mouse to cart" }).click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Increase Mouse" }).click();
  }
  await page.getByLabel("Email").fill("ana@example.com");
  await page.getByRole("button", { name: "Place order" }).click();

  await expect(page.getByRole("alert")).toHaveText("only 3 Mouse left in stock");
});

test("a sold-out product can't be added to the cart @critical", async ({ page }) => {
  await page.goto("/");

  // Monitor has 0 in stock: the UI doesn't even let the customer try
  await expect(page.getByRole("button", { name: "Add Monitor to cart" })).toBeDisabled();
});

test("an order without an email is refused @critical", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Add Keyboard to cart" }).click();
  await page.getByRole("button", { name: "Place order" }).click(); // invalid input: no email

  await expect(page.getByRole("alert")).toHaveText("a valid email is required");
});
