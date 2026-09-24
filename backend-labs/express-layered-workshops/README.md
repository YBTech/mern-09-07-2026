# Workshop Registration API

Express + TypeScript, layered (controller → service → repository), Zod, SQLite via
Drizzle ORM. Day 13 lab. See `ADDITIONAL_INFO.md` for endpoints + business rules.

## Data model

```
workshops                 attendees                registrations
─────────                 ─────────                 ─────────────
id                         id                         id
title                      name                       workshopId  → workshops.id
capacity                   email                      attendeeId  → attendees.id
startsAt                                               status        "confirmed" | "cancelled"
                                                        registeredAt
```

## Setup

```bash
npm install
npm run dev         # tsx watch src/server.ts — restarts on save
npm test             # runs the test suite once
npm run test:watch  # reruns on save
npm run db:studio   # optional — web UI to browse data/app.db
```

## Where to work

Details are in the `// TODO` comments in each file — this is just the map.

1. **`registrations/`** — start here. `validation.ts`, `service.ts`, `controller.ts`
   are stubs; build them following `workshops/` as your reference.
2. **`attendees/`** — `controller.ts` already works (tests pass) but has everything
   crammed into one file. Split it into `validation.ts` / `service.ts` /
   `controller.ts` without breaking the tests.
3. **`workshops/`** — fully implemented reference. Read it before doing 1 or 2.

Never touch `repository.ts` or `router.ts`, in any resource.
