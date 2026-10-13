# Follow-up questions

Answer these in your own words after finishing each ticket, without asking the AI to write the
answers. Two to four sentences each is enough.

## TICKET-1: Back-to-back meetings are rejected

1. What was the bug? Name the file and function, and walk through what the old code did with a
   10:00-11:00 booking and a new 11:00-12:00 request.

## TICKET-2: Weekly recurring bookings

1. Describe what happens from `POST /api/bookings` with `repeatWeeks: 3` until the response, and why
   all three dates are checked before anything is saved.
2. What does cancelling with `scope=future` delete, and what does it leave alone? What happens on a
   booking that is not part of a series?

## TICKET-3: Find me a room

1. How does your endpoint decide that a room is free, and why does that guarantee it agrees with
   `POST /api/bookings`?