# TICKET-104: Cover book search and filtering

**Type:** Tests

`GET /books?search=...&genre=...` is already built but has no tests.

## Acceptance criteria

- Tests for `search` (matches title and author, case-insensitive).
- Tests for `genre`, and for `search` and `genre` together.
- A search with no match returns an empty list.
- No production code changes unless a test finds a real bug.
