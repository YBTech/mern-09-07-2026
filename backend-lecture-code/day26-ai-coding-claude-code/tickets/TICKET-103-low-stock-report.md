# TICKET-103: Low-stock report

**Type:** Feature

The warehouse wants to see which books need restocking.

## Acceptance criteria

- `GET /reports/low-stock?threshold=5` returns the books with `stock <= threshold`.
- The list is sorted by stock, lowest first.
- `threshold` defaults to 5 when it is missing.
- A threshold that is not a non-negative integer returns 400.

## Notes

- Skeletons exist: `src/services/reports.service.ts`, `src/controllers/reports.controller.ts`,
  `src/routes/reports.routes.ts`, and `tests/reports.service.test.ts` (todo tests).
- Write the tests first, watch them fail, then implement.
