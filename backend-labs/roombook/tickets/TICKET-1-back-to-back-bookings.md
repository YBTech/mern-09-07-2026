# TICKET-1: Back-to-back meetings are rejected

**Type:** Bug

## Report

> I tried to book Aspen from 11:00 to 12:00. Aspen already has a 10:00 to 11:00 meeting, and the day
> view shows 11:00 onwards as free. RoomBook says "Room not available" anyway. Same thing happens
> when I try to book the slot right before an existing meeting.

## Steps to reproduce

1. Open the app on today's date and pick Aspen.
2. Book 11:00 to 12:00.
3. You get "Room not available", even though nothing is booked at 11:00.

## Expected

A meeting that starts exactly when another one ends (or ends exactly when another starts) does not
conflict. Real overlaps are still rejected.

## Acceptance criteria

- You can book 11:00 to 12:00 in Aspen, and 08:00 to 09:00 in Aspen.
- Genuinely overlapping bookings still return 409 "Room not available".
- `npm test` is fully green (three tests currently fail because of this bug).
- Find the cause; do not work around it somewhere else.
