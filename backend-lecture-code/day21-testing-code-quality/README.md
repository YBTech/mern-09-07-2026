# Day 21: Testing & code quality, lecture code

A deliberately tiny shop, with **every kind of test from the notes** wired up around it. The app
itself is boring on purpose: the tests are the point.

```
browser ──► React (4103) ──► gateway (4100) ──┬──► catalog (4101)   products, prices, stock
            Vite proxies /api                 └──► orders  (4102)   places orders; asks catalog
                                                                    for each product's price/stock
```

Everything is in memory: no Docker, no database. Restart a service and its data resets.

## Setup

```bash
npm install
npx playwright install chromium   # one time: the browser Playwright drives
npm run dev:all                   # all four processes, color-prefixed logs
```

Open http://localhost:4103.

## Where each concept lives

| Concept (from the notes)                       | File                                                    | Run                            |
| ---------------------------------------------- | ------------------------------------------------------- | ------------------------------ |
| Unit test, pure function                       | `services/orders/pricing.test.ts`                       | `npm test`                     |
| Unit test, table-driven + unhappy paths        | `services/orders/validation.test.ts`                    | `npm test`                     |
| Backend unit test, Supertest + **stub**        | `services/orders/app.test.ts`                           | `npm test`                     |
| Frontend unit test, pure logic                 | `web/src/cart-pure-logic/cart.test.ts`                  | `npm test`                     |
| React component (RTL + jsdom + spy)            | `web/src/quantity-picker-spy/QuantityPicker.test.tsx`   | `npm test`                     |
| Component test + `vi.mock` of the API          | `web/src/app-component/App.test.tsx`                    | `npm test`                     |
| **Snapshot test** (file + inline)              | `web/src/order-snapshot/OrderSummary.test.tsx`          | `npm test`                     |
| **Integration**: two real services             | `tests/integration/orders-catalog.test.ts`              | `npm run test:integration`     |
| **Contract** (Pact): Orders consumes Catalog   | `services/orders/contract/catalog.consumer.test.ts`     | `npm run test:contract`        |
| **Contract** (Pact): Catalog is the provider   | `services/catalog/contract/catalog.provider.test.ts`    | `npm run test:contract`        |
| **Contract** (Pact): Web consumes Orders       | `web/src/api-boundary/contract/orders.consumer.test.ts` | `npm run test:contract`        |
| **Contract** (Pact): Orders is the provider    | `services/orders/contract/orders.provider.test.ts`      | `npm run test:contract`        |
| E2E **critical path** (checkout), real backend | `e2e/checkout.critical-path.spec.ts`                    | `npm run test:critical`        |
| E2E **smoke** (is the build alive?)            | `e2e/smoke.spec.ts`                                     | `npm run test:smoke`           |
| E2E **happy path** (one minor feature)         | `e2e/cart.happy-path.spec.ts`                           | `npm run test:e2e`             |
| E2E **regression** (a fixed bug stays fixed)   | `e2e/checkout.regression.spec.ts`                       | `npm run test:regression`      |
| E2E, **network stubbed** (`page.route`)        | `e2e/stubbed.spec.ts`                                   | `npm run test:e2e`             |
| **Flaky test** vs stable test                  | `e2e/flaky.spec.ts`                                     | `npm run test:flaky`           |
| Coverage + threshold + justified excludes      | `vitest.config.ts`                                      | `npm run test:coverage`        |
| Test runner config (projects, jsdom)           | `vitest.config.ts`, `playwright.config.ts`              |                                |
| ESLint / Prettier                              | `eslint.config.js`, `.prettierrc`                       | `npm run lint`, `format:check` |
| "What the pipeline runs"                       | `package.json` → `ci`                                   | `npm run ci`                   |

Every test file opens with a comment saying what kind of test it is and why. Read those first.

**Suggested lecture order:** pricing → validation → `orders/app.test.ts` (stubs) → integration →
contract → cart / QuantityPicker / App / OrderSummary snapshot (frontend) → E2E checkout → stubbed → flaky → coverage → lint.

## Live demos

### 1. Pact catches a breaking change that unit tests miss

In `services/catalog/app.ts`, change the `GET /products/:id` handler to drop `stock`:

```ts
res.json({ id: product.id, name: product.name, price: product.price });
```

| Run                        | Result | Why                                                                |
| -------------------------- | ------ | ------------------------------------------------------------------ |
| `npm test` (Orders' unit)  | ✓ pass | Orders' unit tests use a **stub** catalog, which still has `stock` |
| `npm run test:contract`    | ✗ fail | "Actual map is missing the following keys: stock"                  |
| `npm run test:integration` | ✗ fail | needs both services running together                               |

The point: integration tests catch it too, but only by **running both services together**. Pact
catches it in the Catalog team's own pipeline using just a JSON file, with Orders nowhere in
sight. (Catalog's own `app.test.ts` also fails; the Catalog team would update that one, which is
exactly why they need Pact to tell them someone else depends on `stock`.) Revert when done.

Orders has the same safety net one hop out: in `services/orders/app.ts`, rename `status` in the
created order to `state`. The web app's contract (`pacts/web-orders.json`) fails in the Orders
provider test, again with no browser and no other service running. The contract files are named
`<provider>.<role>.test.ts` and live next to the code that owns them, in a `contract/` folder.

### 2. Flaky tests

```bash
npm run test:flaky         # every pair in e2e/flaky.spec.ts, 10 times each
npm run test:flaky:alone   # just the order-dependent test, on its own
```

`e2e/flaky.spec.ts` has a flaky/stable pair for each cause in the notes:

| Cause                | Flaky test                                     | What you'll see                                                               | Stable fix                      |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------- |
| Timing / async       | fixed 500ms sleep, then one check              | fails about 5–9 of 10 runs (orders adds a random 200–1200ms of latency)       | wait for the condition          |
| Shared state / order | reads an order a _different test_ created      | fails alone (`:alone`) and across parallel workers; passes with `--workers=1` | each test creates its own order |
| External service     | pseudocode only (the app calls no third party) |                                                                               | stub the provider               |

All the stable tests pass 10 out of 10.

### 3. "Some of your code isn't covered, what do you do?"

```bash
npm run test:coverage   # passes the 80% threshold
```

Now delete the two boundary files (`catalogClient.ts`, `api.ts`) from `coverage.exclude` in
`vitest.config.ts` and rerun: **it fails, with both at 0%**. Then walk through the interview answer:
look at _what_ is uncovered (the network boundary, which unit tests stub on purpose), check it's
covered elsewhere (integration/contract/E2E), and exclude it **with a written reason** rather than
writing an assertion-free test to turn it green. Also point at the uncovered "−" button in
`QuantityPicker.tsx` and ask: is that worth a test?

### 4. TDD, live (red → green → refactor)

New rule: discount code `SAVE10` takes 10% off; any other code changes nothing. Write the test in
`services/orders/pricing.test.ts` **first**, run `npm run test:watch`, and watch it fail (red):

```ts
it("SAVE10 takes 10% off", () => {
  expect(applyDiscountCode(200, "SAVE10")).toBe(180);
});
it("ignores unknown codes", () => {
  expect(applyDiscountCode(200, "NOPE")).toBe(200);
});
```

Then write the simplest `applyDiscountCode` in `pricing.ts` that passes (green), then tidy it
(refactor) while the tests stay green.

### 5. Snapshot tests: "did it change?", not "is it right?"

Open `web/src/order-snapshot/__snapshots__/OrderSummary.test.tsx.snap` first: that file _is_ the expectation, and
nobody wrote it by hand. Then in `web/src/order-snapshot/OrderSummary.tsx`, change `Order placed` to
`Order confirmed` and run `npm test`:

- the snapshot test fails with a diff, even though the new wording is perfectly fine;
- `npx vitest run -u` accepts it and rewrites the `.snap` file.

Ask the room: did anyone actually check the new text was _correct_ before pressing `-u`? That's the
pitfall. (The E2E and `App.test.tsx` checks for `Order placed` fail too. Those are behavior tests, and
there you must decide on purpose.) Revert when done.

### 6. ESLint catches a likely bug

Put `if (item.qty == "1")` anywhere in `validation.ts` and run `npm run lint`: `eqeqeq` fails the
build. Prettier, by contrast, would only reformat it.

## Notes for the instructor

- **Contract vs integration here:** both live in one repo, so they overlap and the integration
  test alone would catch most of what Pact does. Pact pays off when the services are in separate
  repos or owned by different teams. Say that out loud; don't present both as necessary.
- **Pact is not an API gateway.** It's a contract-testing tool between two services. The gateway
  here is a separate ~40-line file (`services/gateway/server.ts`). It exists because a real frontend
  talks to one entry point, not to every service directly.
- **Unit vs integration in `orders`**: the _same_ `createOrdersApp` is tested both ways. The unit test
  passes a fake catalog client; the integration test passes a real one pointed at a real Catalog.
  Passing the dependency in (rather than importing it) is what makes that possible.
- **No BDD/Cucumber here**: it would add a whole second toolchain for one idea. The notes cover it.
- Ports 4100–4103 are fixed (`strictPort`). Port 5173 is avoided on purpose, because the curriculum
  dev server usually holds it, and Playwright's `reuseExistingServer` would quietly test the wrong app.
- Pact writes `pacts/orders-catalog.json` (gitignored). In a real company it would be published to a
  Pact Broker, so the two teams never share a folder.
