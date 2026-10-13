# Architecture

One Express app, one process. Data lives in an in-memory SQLite database (`better-sqlite3`), rebuilt
and re-seeded every time the server starts. The React client calls the API through one file.

```
browser -> client/src/api.ts -> /api (Vite proxy) -> routes -> controller -> service -> repository -> SQLite
```

The server is split into **modules**, one folder per part of the domain. Each module holds its own
layers, so everything about bookings lives together:

```
server/src/
  routes.ts                    mounts each module's router under /api
  modules/
    bookings/  bookings.routes.ts  .controller.ts  .service.ts  .repository.ts  .types.ts
    rooms/     rooms.routes.ts     .controller.ts  .service.ts  .repository.ts  .types.ts
    users/     users.routes.ts     .controller.ts  .service.ts  .repository.ts  .types.ts
    availability/  availability.service.ts      (the shared "is this room free?" rule)
  db.ts, seed.ts               schema and seed data
  errors.ts, middleware/       error classes and the error handler
  utils/datetime.ts            date and time helpers
```

| Layer      | File in each module      | Job                                                        |
| ---------- | ------------------------ | ---------------------------------------------------------- |
| Routes     | `<module>.routes.ts`     | Map URL + method to a controller                           |
| Controller | `<module>.controller.ts` | Read the request, call one service function, send the JSON |
| Service    | `<module>.service.ts`    | Business rules; throw the error classes in `errors.ts`     |
| Repository | `<module>.repository.ts` | The only code that runs SQL                                |
| Types      | `<module>.types.ts`      | The shapes that module returns and accepts                 |

A module may import another module's service or types (bookings uses rooms, users and
availability), but only a module's own repository touches that module's SQL.

Errors: services throw (`NotFoundError`, `ConflictError`, ...); `middleware/error-handler.ts` turns
them into `{ "error": "message" }` with the right status code.

Client: `App.tsx` holds the state (rooms, users, bookings, current user, date); `components/DayView`
and `components/BookingForm` render it; `api.ts` is the only file that calls `fetch`.

Availability: `modules/availability/availability.service.ts` is the single place that decides whether a room is
free. Anything that books or searches rooms must go through it.
