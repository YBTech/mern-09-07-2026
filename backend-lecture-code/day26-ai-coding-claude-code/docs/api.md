# API

## What the app does

The backend of an online bookshop. Customers browse the catalogue (filter by genre or search),
then place an order for one or more books with an optional discount coupon. Each book has a price
and a stock count: ordering reduces stock, and an order that asks for more than is in stock is
rejected. Staff (admins) add books to the catalogue. Planned: cancelling an order, and a report
of books running low on stock.

## Endpoints

Base URL `http://localhost:3026`. JSON in, JSON out. Money is integer cents. Errors are
`{ "error": "message" }` (see `src/errors.ts`). A Postman collection is in
`bookshop.postman_collection.json`.

| Method | Path                 | Auth  | Success | Notes                                               |
| ------ | -------------------- | ----- | ------- | --------------------------------------------------- |
| GET    | `/health`            | none  | 200     | `{ "status": "ok" }`                                |
| GET    | `/books`             | none  | 200     | Optional `?search=` and `?genre=` filters           |
| GET    | `/books/:id`         | none  | 200     | 404 if unknown                                      |
| POST   | `/books`             | admin | 201     | Body below; 401 without the token, 400 on bad input |
| DELETE | `/books/:id`         | none  | 204     | No admin check at the moment                        |
| POST   | `/orders`            | none  | 201     | Body below; 400 invalid/coupon, 404 book, 409 stock |
| GET    | `/orders/:id`        | none  | 200     | 404 if unknown                                      |
| PATCH  | `/orders/:id/cancel` | none  | 200     | Restores stock; 404 unknown, 409 already cancelled  |

Not built yet: `GET /reports/low-stock` (TICKET-103).

Admin auth is the `x-admin-token` header, compared to `config.adminToken` (`.env.example`).

## Bodies

```jsonc
// POST /books
{ "title": "...", "author": "...", "genre": "fiction|tech|history|kids", "priceCents": 1999, "stock": 10 }

// POST /orders  (couponCode is optional and case-insensitive)
{ "customerEmail": "a@b.com", "items": [{ "bookId": "...", "quantity": 2 }], "couponCode": "SAVE10" }
```

An order comes back with `subtotalCents`, `discountCents`, `totalCents`, `status` (`placed` or
`cancelled`) and `createdAt`. Coupon, stock and status rules: docs/business-rules.md.
