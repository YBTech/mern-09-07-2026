# RoomBook

An office meeting-room booking app, and a **brownfield lab**: the app already works, and you
extend it by completing three tickets.

Employees pick a user ("I am"), a day, a room and a time slot, and book it. They can also cancel
their own bookings.

```bash
npm install
npm run dev        # API: http://localhost:3001   app: http://localhost:5173
npm test           # API tests (3 fail until you fix TICKET-1)
npm run typecheck
```

## What exists today

- A rooms list, a day view showing each room's bookings, a booking form, and cancel for your own bookings.
- Express + TypeScript API (one module per part of the domain, each with routes, controller, service, repository) on an
  in-memory SQLite database (`better-sqlite3`). Data is re-seeded every time the server restarts.
- React + TypeScript client (Vite).
- Seed data is relative to today, so the day view is never empty.

## Your tickets

Work them in this order; later tickets reuse code touched by earlier ones.

| Ticket                                                    | Type    | Title                              |
| --------------------------------------------------------- | ------- | ---------------------------------- |
| [TICKET-1](tickets/TICKET-1-back-to-back-bookings.md)     | Bug     | Back-to-back meetings are rejected |
| [TICKET-2](tickets/TICKET-2-weekly-recurring-bookings.md) | Feature | Weekly recurring bookings          |
| [TICKET-3](tickets/TICKET-3-find-me-a-room.md)            | Feature | Find me a room                     |

## Working with the AI (pairing mode)

The AI acts as a junior developer and you are the senior. It will not fix a ticket in one go.

1. Describe the problem in your own words. The AI explores the code and proposes a plan of at most 3 steps.
2. Review the plan. Reply with a message starting with `GO:` (for example `GO: do step 1 only`) to let it edit files.
3. It makes that one step, runs the tests, and tells you what changed. Repeat for the next step.

Without `GO:`, the AI can read code and run tests but cannot edit files. Approval lasts for one message.

### Using Codex instead of Claude Code

The same rules work in Codex. Start it from this folder (`codex`), then:

1. Trust the project when Codex asks. It only reads `.codex/` in trusted projects.
2. Run `/hooks` once and trust the three hooks. Codex skips new hooks until you do.
3. Use it exactly the same way: describe the problem, review the plan, reply with `GO:`.

`.codex/config.toml` points Codex at `CLAUDE.md` for its instructions, and `.codex/hooks.json` runs
the same scripts as `.claude/settings.json`.

## Session log

Every prompt and tool call (Claude Code or Codex) is appended to `.claude/session-log.jsonl` (file names and commands only,
never file contents). Hand this file in with your lab. To see a summary:

```bash
npm run session:summary
```

## Project map

| Path                          | What it is                                                            |
| ----------------------------- | --------------------------------------------------------------------- |
| `server/src/modules/<name>`   | One folder per module: routes, controller, service, repository, types |
| `server/src/db.ts`, `seed.ts` | Schema and seed data for the in-memory database                       |
| `server/tests`                | API and unit tests                                                    |
| `client/src/App.tsx`          | The page; `components/` has the day view and booking form             |
| `client/src/api.ts`           | Every call from the browser to the API                                |

## Documentation

- `CLAUDE.md` summarizes the app, commands and rules (Codex reads it too, see `.codex/config.toml`).
- `docs/api.md` (endpoints), `docs/architecture.md`, `docs/conventions.md`, `docs/testing.md` and
  `docs/business-rules.md` describe how the project works.
- `roombook.postman_collection.json` can be imported into Postman.

## Notes

- Times are office-local text such as `2030-01-07T09:30`; there are no time zones.
- Keep the layering inside a module: a controller calls a service, a service calls repositories.
- Add or update tests for what you change.
