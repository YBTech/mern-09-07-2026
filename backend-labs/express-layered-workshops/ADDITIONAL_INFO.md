# Additional info

## Business rules (`registrations`)

A repository can tell you *facts* ("does this row exist?", "how many rows match?");
deciding what those facts *mean* is what the service layer is for. `POST /registrations`
has to enforce, in order:

1. The workshop exists.
2. The attendee exists.
3. This attendee doesn't already have a **confirmed** registration for this workshop
   (a cancelled one doesn't block re-registering).
4. The workshop isn't already at capacity — count of confirmed registrations, compared
   against `workshops.capacity`.

`PATCH /registrations/:id` (cancelling) only has one rule: you can't cancel a
registration that's already cancelled.

None of this needs a transaction or a row lock — that's a lecture topic, not a lab
one. A plain read-then-decide-then-write in the service is enough here.

## Endpoints

### Workshops

| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/workshops` | — | list all |
| GET | `/workshops/:id` | — | `404` if missing |
| POST | `/workshops` | `{ title, capacity, startsAt }` | `201` |
| PATCH | `/workshops/:id` | any of `{ title, capacity, startsAt }` | `404` if missing |
| DELETE | `/workshops/:id` | — | `204`, `404` if missing |

### Attendees

| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/attendees` | — | list all |
| GET | `/attendees/:id` | — | `404` if missing |
| POST | `/attendees` | `{ name, email }` | `201` |
| PATCH | `/attendees/:id` | any of `{ name, email }` | `404` if missing |
| DELETE | `/attendees/:id` | — | `204`, `404` if missing |

### Registrations

| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/registrations` | — | optional `?workshopId=` filter |
| GET | `/registrations/:id` | — | `404` if missing |
| POST | `/registrations` | `{ workshopId, attendeeId }` | `201`; see **Business rules** for the `404`/`409` cases |
| PATCH | `/registrations/:id` | `{ status: "cancelled" }` | `409` if already cancelled |

There's no `DELETE /registrations/:id` — you cancel a registration, you don't erase
the record that it happened.
