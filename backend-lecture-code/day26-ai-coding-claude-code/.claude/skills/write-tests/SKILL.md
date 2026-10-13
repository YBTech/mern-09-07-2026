---
name: write-tests
description: Write tests for a function or endpoint in this project's vitest + supertest style.
---

# Write tests

1. Read `docs/testing.md` and one existing test file (for example `tests/orders.api.test.ts`).
2. Put the new tests in `tests/<thing>.<kind>.test.ts` and call `resetData()` in `beforeEach`.
3. Cover the happy path, every validation error, and each business-rule edge.
4. Name each test as a sentence.
5. Run `npm test`. If a test fails, tell me whether the test or the code is wrong; do not change
   production code without asking.
