# Testing

- Runner: vitest. API tests use supertest against `createApp()`; no server is started.
- Run all tests from the repo root with `npm test`; one file with
  `npx vitest run server/tests/bookings.api.test.ts`.
- Tests live in `server/tests` and are named `<thing>.<kind>.test.ts`.
- `resetDb()` (in `tests/helpers.ts`) builds a fresh in-memory database seeded around `DAY = "2030-01-07"`.
  Call it in `beforeEach` so tests never share state.
- Test names read as sentences: `it("rejects a booking that overlaps an existing one with 409")`.
- Cover the happy path, each validation error, and each business-rule edge (for bookings, the edges
  are the start and end times).
- The client has no test runner; check it with `npm run typecheck` and in the browser.
