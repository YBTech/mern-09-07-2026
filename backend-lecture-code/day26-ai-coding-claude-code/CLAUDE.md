# Bookshop API

A small monolithic Express + TypeScript API for a bookshop: books, orders, coupons.

## What this app does

The backend of an online bookshop. Customers browse the catalogue (filter by genre or search),
then place an order for one or more books with an optional discount coupon. Each book has a price
and a stock count: ordering reduces stock, and an order that asks for more than is in stock is
rejected. Staff (admins) add books to the catalogue. Planned: a report
of books running low on stock.

## Commands

- Dev server: `npm run dev` (http://localhost:3026)
- Tests: `npm test` (vitest + supertest)
- Type check: `npm run typecheck`
- Format check: `npm run format:check`

## API at a glance

- `GET /health`
- `GET /books` (`?search=`, `?genre=`), `GET /books/:id`, `POST /books` (admin), `DELETE /books/:id`
- `POST /orders` (email, items, optional coupon), `GET /orders/:id`, `PATCH /orders/:id/cancel`
- Planned: `GET /reports/low-stock` (TICKET-103)
- Admin = `x-admin-token` header. Errors are `{ "error": "message" }`. Details: docs/api.md

## Architecture

- Layers: routes -> controllers -> services -> repositories. Never skip a layer.
- All data is in memory (`src/repositories`); `src/data/reset.ts` restores the seed data.
- Money is always an integer number of cents.

## Rules

- Throw the error classes in `src/errors.ts`; never send error responses from services.
- Validate request bodies in `src/validation.ts` before they reach a service.
- Never log customer emails or admin tokens.
- Every new endpoint ships with a test in `tests/`.
- Work tickets live in `tickets/`.

## More detail

- API reference: docs/api.md
- Architecture: docs/architecture.md
- Conventions: docs/conventions.md
- Testing: docs/testing.md
- Business rules (coupons, stock, order status): docs/business-rules.md
