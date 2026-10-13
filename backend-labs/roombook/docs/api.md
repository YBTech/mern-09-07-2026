# API

## What the app does

Employees of a small office book meeting rooms. A booking belongs to one room, one user and one
time range on a single day. A room cannot be double-booked, and only the person who made a booking
can cancel it. Planned: weekly recurring bookings, and a search for rooms that are free at a given
time and big enough for a group.

## Endpoints

Base URL `http://localhost:3001/api`. JSON in, JSON out. Errors are `{ "error": "message" }`
(see `server/src/errors.ts`). There is no login: who is acting is sent as `userId`. A Postman
collection is in `roombook.postman_collection.json`.

| Method | Path                        | Success | Notes                                                            |
| ------ | --------------------------- | ------- | ---------------------------------------------------------------- |
| GET    | `/rooms`                    | 200     | All rooms, sorted by name                                        |
| GET    | `/users`                    | 200     | All users, sorted by name                                        |
| GET    | `/bookings?date=YYYY-MM-DD` | 200     | Bookings starting that day, earliest first; 400 on a bad `date`  |
| POST   | `/bookings`                 | 201     | Body below; 400 invalid, 404 room/user, 409 "Room not available" |
| DELETE | `/bookings/:id?userId=`     | 204     | 403 if `userId` is not the owner, 404 if unknown                 |

Not built yet:

- `POST /bookings` with `repeatWeeks`, and `DELETE ...&scope=future` (TICKET-2)
- `GET /rooms/available?date=&start=&end=&capacity=` (TICKET-3)

## Bodies

```jsonc
// POST /bookings
{
  "roomId": 1,
  "userId": 2,
  "title": "Design sync",
  "start": "2030-01-07T10:00",
  "end": "2030-01-07T11:00",
}
```

A booking comes back with the room and user names joined in:

```jsonc
{
  "id": 2,
  "roomId": 1,
  "roomName": "Aspen",
  "userId": 2,
  "userName": "Ben",
  "title": "Design sync",
  "start": "2030-01-07T10:00",
  "end": "2030-01-07T11:00",
}
```

Times are office-local text, `YYYY-MM-DDTHH:mm`. There are no time zones. Booking rules:
docs/business-rules.md.

## Seed data

Rooms: 1 Aspen (4 seats), 2 Birch (6), 3 Cedar (8), 4 Dogwood (12), 5 Elm (2), 6 Fir (20).
Users: 1 Ana, 2 Ben, 3 Chloe, 4 Dev, 5 Eli. Bookings are seeded relative to today (see
`server/src/seed.ts`), so the day view is never empty.
