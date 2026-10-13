# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Day 16 lecture code (auth & security). Two independent Express + TypeScript projects, each with its own `package.json` (no root package, no workspace):

- `auth-demo/`: the near-empty project coded live in the lecture (port 4002, CORS origin `http://localhost:5173`). Plaintext passwords, a hardcoded JWT secret and the session-based version left commented out are intentional teaching material, not bugs to fix.
- `auth-reference/`: the finished version (port 4000). Everything is in memory, with no database, and resets on restart.

The frontend is not in this folder. It is the day 16 lecture page in the curriculum app (`curriculum/src/week4/day16-auth-security/lecture/`), which calls `auth-reference` on port 4000 (override with `VITE_DAY16_API` in `curriculum/.env.local`).

## Commands

Run from inside `auth-reference/` or `auth-demo/`:

```bash
cp .env.example .env   # auth-reference only; set JWT_SECRET (env.ts throws on startup if JWT_SECRET, FRONTEND_ORIGIN or FRONTEND_URL is missing)
npm install
npm run dev            # tsx watch src/server.ts
npm run typecheck      # tsc --noEmit
npm run build && npm start
```

There is no test or lint setup. `npm run typecheck` is the only check.

Set `ACCESS_TOKEN_TTL=30s` in `.env` to watch the frontend swap an expired access token for a new one. Google login is optional: without `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, everything else still works. The README has the Google Cloud setup, the endpoint/permission table and the seed accounts.

## auth-reference architecture

Authentication and authorization are separate layers, and the request flow spans several files:

1. **`middleware/auth.ts`, `requireAuth`** (401). It verifies the Bearer JWT by signature only, with no DB lookup. `req.user` carries only `id`, `email` and `role`.
2. **`middleware/auth.ts`, `authorize(action, loadOrder?)`** (403/404). It re-reads the full user from `db.ts` on every request through `currentUser`, because region, approval limit and direct `permissions` are deliberately not in the token and must take effect immediately. When `loadOrder` is passed, it 404s on a missing order and stashes the order in `res.locals.order`.
3. **`policy/policies.ts` + `policy/engine.ts`**. The rules are data (`policies.ts`) and `can(user, action, order?)` interprets them. The evaluation order matters: an explicit **deny** beats everything, including admin. Then a direct per-user permission grant. Then any matching **allow** rule, then default deny. A rule with `when` and no order never matches. To change who can do what, edit `policies.ts` and add the new `Action` to its union. Routes should call `authorize`/`can` with an action name and never check roles inline.

Row-level filtering reuses the same engine. `GET /orders` filters with `can(user, "order:read", o)`, so the list and `GET /orders/:id` can't disagree. `GET /orders/:id` returns 404 rather than 403 to avoid leaking that an id exists (the IDOR lesson). `POST /orders` computes totals server-side from the product data.

**Tokens (`tokens.ts`)**: a short-lived JWT access token (`ACCESS_TOKEN_TTL`, default 15m) plus a 7-day random refresh token in an httpOnly cookie scoped to `path: /auth`. The refresh store is a Map keyed by the SHA-256 of the token. Each login starts a "family". `rotateRefreshToken` marks the token as used and issues a new one in the same family. Presenting an already-used token revokes the whole family (reuse detection). Logout revokes the family.

**Other auth paths**: `routes/auth.ts` has signup/login (bcryptjs), refresh/logout, and Google OAuth done by hand with `fetch` (no passport). It checks the id_token `aud` and `email_verified`. `routes/session.ts` is a server-side session version (`sid` cookie plus an in-memory Map), kept only to compare with JWT.

`db.ts` holds the in-memory users, products and orders, and the seed accounts (`admin@shop.com`, `manager@shop.com`, `manager.west@shop.com`, `alice@shop.com`, `bob@shop.com`, all with the same password; see the `seedHash` line).

## Conventions

- Source is heavily commented as teaching material. Keep those explanatory comments when editing, and match their tone in new code.
- The 403 body includes the engine's `reason` on purpose, so it can be shown live. The code comments say a real API would not expose it.
