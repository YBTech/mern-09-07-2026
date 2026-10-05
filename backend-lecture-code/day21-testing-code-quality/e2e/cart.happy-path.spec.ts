// E2E happy path: one feature, tested only for the scenario where everything goes right.
// Compare with checkout.critical-path.spec.ts, which also tests what goes wrong.
import { test, expect } from "@playwright/test";

// HAPPY PATH: valid input, nothing fails, the user does exactly what we hoped.
// No @critical tag: if the quantity buttons broke it would be a bug, but not one that stops
// the business from making money.
test("a customer can change the quantity in the cart", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Add Keyboard to cart" }).click();
  await page.getByRole("button", { name: "Increase Keyboard" }).click();
  await expect(page.getByText("Total: $100")).toBeVisible();

  await page.getByRole("button", { name: "Decrease Keyboard" }).click();
  await expect(page.getByText("Total: $50")).toBeVisible();

  // The test stops here on purpose. A happy-path test never asks "what if the input is bad
  // or a service fails?". That is enough for a minor feature; checkout needs more.
});