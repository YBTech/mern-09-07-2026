---
name: seed-books
description: Add books to the seed data without breaking the tests.
---

# Seed books

1. Open `src/data/seed.ts`. Ids are `b1`, `b2`, ... in order; use the next free number.
2. Prices are integer cents; `genre` must be `fiction`, `tech`, `history`, or `kids`.
3. Remember `tests/books.api.test.ts` expects exactly 8 books and the low-stock expectations
   use b4, b6, and b8: update those tests when you add books.
4. Run `npm test` and `npm run format:check`.
