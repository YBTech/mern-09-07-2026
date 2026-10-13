# Testing

- Runner: vitest. HTTP tests use supertest against `createApp()`; no server is started.
- Test files live in `tests/` and are named `<thing>.<kind>.test.ts`
  (`orders.api.test.ts`, `reports.service.test.ts`).
- Call `resetData()` in `beforeEach` so tests never share state.
- Test names read as sentences: `it("rejects an order that asks for more than the stock")`.
- Cover the happy path, each validation error, and each business-rule edge.
- Run all tests with `npm test`; run one file with `npx vitest run tests/orders.api.test.ts`.
