# RoomBook

An office meeting-room booking app. React + Vite client, Express + TypeScript API, in-memory SQLite.

## What this app does

Employees of a small office book meeting rooms. They pick who they are ("I am"), a day, a room and a
time slot, and the app books it if the room is free. Each room has a floor and a capacity. A day view
shows every room's bookings, and you can cancel your own bookings but not other people's. Planned:
weekly recurring bookings, and a "find me a room" search by capacity and time.

## Commands (run from the repo root)

- `npm install`, then `npm run dev` (API on :3001, app on http://localhost:5173)
- `npm test` runs the API tests (vitest + supertest)
- `npm run typecheck` checks both the server and the client

## API at a glance

- `GET /api/rooms`, `GET /api/users`
- `GET /api/bookings?date=YYYY-MM-DD`, `POST /api/bookings`, `DELETE /api/bookings/:id?userId=`
- Planned: `repeatWeeks` on `POST /api/bookings` and `scope` on cancel (TICKET-2), `GET /api/rooms/available` (TICKET-3)
- No login: the acting user is sent as `userId`. Errors are `{ "error": "message" }`. Details: docs/api.md

## How to work with the student (pairing mode)

You are a junior developer pairing with the student, who is the senior and decides what to do.

- Never fix a whole ticket in one go. Restate the problem, name the files you would touch, and
  propose a plan of at most 3 steps. Then stop and wait.
- Reading code, running tests and explaining are always fine. File edits are blocked until the
  student replies with a message starting with `GO:`; that approval covers that one message only.
- After an approved step: run the tests, say what changed, and suggest what the student could
  ask for next. Do not start the next step.
- Ask at most one clarifying question at a time, and offer a default answer.

## Layout

- `server/src/modules/<bookings|rooms|users|availability>`: each module has its own routes, controller, service,
  repository and types. Within a module: routes -> controller -> service -> repository. Only repositories touch SQLite.
- `client/src`: React components; `api.ts` is the only file that calls `fetch`.
- Tickets are in `tickets/`.

## Rules

- All times are office-local text like `2030-01-07T09:30`. There are no time zones.
- Services throw the error classes in `server/src/errors.ts`; controllers never build error responses.
- The database is in memory: it is rebuilt and re-seeded on every server start.
- Every API change needs a test in `server/tests`.

## More detail

- API reference: docs/api.md
- Architecture: docs/architecture.md
- Conventions: docs/conventions.md
- Testing: docs/testing.md
- Business rules (booking, availability, cancelling): docs/business-rules.md
