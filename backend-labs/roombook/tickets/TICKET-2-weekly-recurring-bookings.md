# TICKET-2: Weekly recurring bookings

**Type:** Feature (API and UI)

## Story

> Our team meets every Tuesday. I want to book the same room and time for several weeks in one go,
> instead of creating eight separate bookings.

## Requirements

**Creating a series**

- The booking form gets a "Repeat weekly for" option: 1 (just this booking) up to 8 weeks.
- `POST /api/bookings` accepts an optional `repeatWeeks` (integer 1 to 8, default 1).
  - With `repeatWeeks` greater than 1, the response is `201` with `{ "seriesId": "<id>", "bookings": [...] }`,
    one booking per week, each seven days after the previous one.
  - With no `repeatWeeks` (or 1), the response stays exactly as it is today: the single booking.
- All dates are checked **before anything is saved**. If any of them clashes with an existing booking,
  nothing is created and the response is `409` with
  `{ "error": "Room not available", "conflicts": ["2030-01-14", "2030-01-28"] }` (the clashing dates).
- Bookings in a series remember that they belong together.
- An invalid `repeatWeeks` (0, 9, 2.5, text) returns `400`.

**Cancelling**

- `DELETE /api/bookings/:id` accepts `scope=this` (default, unchanged behaviour) or `scope=future`,
  which cancels this booking and every later booking in the same series.
- Only the owner can cancel, as today. `scope=future` on a booking that is not part of a series
  behaves like `scope=this`.
- In the UI, cancelling a booking that belongs to a series asks which one: "Only this booking" or
  "This and all future bookings".

## Acceptance criteria

- The behaviour above works end to end, in the UI and through the API.
- Existing single bookings and their tests keep working.
- New API behaviour has tests.

## Hint

The overlap check this feature depends on is the one from TICKET-1.
