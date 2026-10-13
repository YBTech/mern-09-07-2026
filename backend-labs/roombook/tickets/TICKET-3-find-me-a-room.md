# TICKET-3: Find me a room

**Type:** Feature (API and UI)

## Story

> I know when my meeting is and how many people are coming, but I do not want to click through six
> rooms to find one that is free. Just show me the rooms that fit.

## Requirements

**API**

- New endpoint `GET /api/rooms/available?date=YYYY-MM-DD&start=HH:mm&end=HH:mm&capacity=N`.
- It returns the rooms that seat **at least** `capacity` people and have **no conflicting booking**
  in that time range, sorted by capacity, smallest first (so a 4-person meeting is not given the
  20-person room when a smaller one fits).
- `capacity` is optional and defaults to 1.
- Missing or invalid parameters, or an end that is not after the start, return `400`.
- Use the same availability rules as booking. A room that would be rejected by `POST /api/bookings`
  must not appear in the results.

**UI**

- A "Find a room" panel: date, start, end and number of people.
- It lists the matching rooms (name, floor, capacity). If none match, say so.
- Each result has a **Book** button that fills the booking form with that room, date and times, ready
  to give a title and submit.

## Acceptance criteria

- The API behaves as described and has tests, including capacity filtering, sort order and back-to-back times.
- The panel works in the browser and the Book button pre-fills the form.
- Booking from a result succeeds.
