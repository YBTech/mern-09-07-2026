# Business rules

## Bookings

- A booking has a room, a user, a title (1 to 100 characters) and a start and end time.
- It must start and end on the same day, and the end must be after the start.
- The room and the user must exist.

## Availability

- A room cannot be double-booked: two bookings in the same room may not overlap.
- Bookings that only touch do **not** overlap. A meeting that ends at 11:00 and another that starts
  at 11:00 can sit in the same room.
- A rejected booking returns 409 `Room not available` and nothing is saved.

## Cancelling

- Only the person who made a booking can cancel it (403 otherwise).
- Cancelling frees the slot immediately.

## Planned

- **Recurring bookings:** a booking can repeat weekly for 1 to 8 weeks. All dates are checked
  first; if any clashes, nothing is created and the clashing dates are reported.
- **Find a room:** a room is a candidate if it seats at least the requested number of people and is
  free for the whole time range, using the same availability rule as booking. Smallest rooms first.
