// Flaky test demo, skipped unless asked for: `npm run test:flaky` runs it 10 times.
// One flaky/stable pair for each of the three common causes in the Notes.
import { test, expect, type Page } from "@playwright/test";

test.skip(!process.env.SHOW_FLAKY, "demo only: run with `npm run test:flaky`");

// ─── Cause 1: timing / async ───────────────────────────────────────────────────────────
// Orders answers in a random 200–1200ms (services/orders/server.ts), like a real network.

async function placeAnOrder(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Add Keyboard to cart" }).click();
  await page.getByLabel("Email").fill("ana@example.com");
  await page.getByRole("button", { name: "Place order" }).click();
}

// Same code, different result from run to run: that is what makes it flaky
test("flaky timing: fixed sleep, then a one-time check", async ({ page }) => {
  await placeAnOrder(page);

  await page.waitForTimeout(500); // ✗ guesses how long the server takes: passes only when it's fast
  expect(await page.getByTestId("confirmation").isVisible()).toBe(true);
});

test("stable timing: wait for the condition", async ({ page }) => {
  await placeAnOrder(page);

  await expect(page.getByTestId("confirmation")).toBeVisible(); // ✓ waits for the condition, not a duration
});

// ─── Cause 2: shared state / test order ────────────────────────────────────────────────
// playwright.config.ts has fullyParallel: true, so tests in this file can run in different
// workers, each with its own copy of this variable. Run the reader alone to see it fail every
// time: `npm run test:flaky:alone`.

let sharedOrderId: number | undefined;

const newOrder = { email: "ana@example.com", items: [{ productId: 1, qty: 1 }] };

test("flaky state: creates an order and remembers its id", async ({ request }) => {
  const res = await request.post("/api/orders", { data: newOrder });

  sharedOrderId = (await res.json()).id; // ✗ leaves state behind for another test to use
});

test("flaky state: reads the order the test above created", async ({ request }) => {
  // ✗ only works if the test above ran first, in the same worker. Alone, the id is undefined.
  const res = await request.get(`/api/orders/${sharedOrderId}`);

  expect(res.status()).toBe(200);
});

test("stable state: creates its own order, then reads it", async ({ request }) => {
  const created = await request.post("/api/orders", { data: newOrder });
  const { id } = await created.json(); // ✓ every test makes the data it needs

  expect((await request.get(`/api/orders/${id}`)).status()).toBe(200);
});

// ─── Cause 3: external services (pseudocode) ───────────────────────────────────────────
// The demo app calls no third-party API, so this one is a sketch. Imagine checkout also
// charged a payment provider's sandbox:
//
//   test("flaky external: pays through the real provider", async ({ page }) => {
//     await checkout(page);
//     // ✗ the provider is sometimes slow, rate-limited or down, so this fails for reasons
//     //   that have nothing to do with our code
//     await expect(page.getByTestId("confirmation")).toBeVisible();
//   });
//
//   test("stable external: pays through a stubbed provider", async ({ page }) => {
//     // ✓ answer the provider's request ourselves, with the same reply every time
//     //   (see stubbed.spec.ts for page.route in action)
//     await page.route("**/payment-provider/**", (route) =>
//       route.fulfill({ json: { status: "approved" } }),
//     );
//     await checkout(page);
//     await expect(page.getByTestId("confirmation")).toBeVisible();
//   });
