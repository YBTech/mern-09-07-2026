// E2E with the network stubbed: real browser and React app, but page.route() answers the
// API calls so the backend never sees them. Fast, but can't catch a frontend/backend mismatch.
import { test, expect } from "@playwright/test";

test("shows an error banner when products fail to load", async ({ page }) => {
  // a server error that is hard to trigger for real
  await page.route("**/api/products", (route) => route.fulfill({ status: 500 }));

  await page.goto("/");

  await expect(page.getByRole("alert")).toHaveText("Could not load products");
});

test("shows an empty state when the catalog has no products", async ({ page }) => {
  // an empty list is just as hard to get from the real backend
  await page.route("**/api/products", (route) => route.fulfill({ json: [] }));

  await page.goto("/");

  await expect(page.getByText("No products yet")).toBeVisible();
});

test("shows the server's message when an order is rejected", async ({ page }) => {
  // stub only the order call; the product list still comes from the real backend
  await page.route("**/api/orders", (route) =>
    route.fulfill({ status: 503, json: { error: "catalog is unavailable, try again later" } }),
  );

  await page.goto("/");
  await page.getByRole("button", { name: "Add Keyboard to cart" }).click();
  await page.getByLabel("Email").fill("ana@example.com");
  await page.getByRole("button", { name: "Place order" }).click();

  await expect(page.getByRole("alert")).toHaveText("catalog is unavailable, try again later");
});
