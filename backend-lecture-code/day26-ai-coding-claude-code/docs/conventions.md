# Conventions

- TypeScript strict mode; no `any`.
- Imports are extensionless (`from "../errors"`).
- Money is stored as integer cents (`priceCents`), never floats.
- Files are named `<thing>.<layer>.ts` (`books.service.ts`, `orders.controller.ts`).
- Controllers stay thin: parse, call one service function, respond.
- Status codes: 201 created, 204 deleted, 400 validation, 401 missing admin token,
  404 not found, 409 conflict (for example not enough stock), 501 not implemented.
- Admin-only routes use the `requireAdmin` middleware (`x-admin-token` header).
- Commit messages: `type(scope): summary`, for example `fix(pricing): divide percent by 100`.
