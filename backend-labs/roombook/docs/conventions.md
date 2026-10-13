# Conventions

- TypeScript strict mode in both packages; no `any`.
- Imports are extensionless (`from "../errors"`).
- Server code is grouped by module (`server/src/modules/bookings`, `rooms`, `users`). Files are named
  `<module>.<layer>.ts`, for example `bookings/bookings.service.ts`.
- Controllers stay thin: read the request, call one service function, respond.
- SQL lives only in repositories, always as prepared statements with `?` parameters.
- Times are office-local text, `YYYY-MM-DDTHH:mm`; dates are `YYYY-MM-DD`. Both sort correctly as strings.
- Status codes: 201 created, 204 deleted, 400 validation, 403 not the owner, 404 not found,
  409 conflict (room not available).
- Client: function components with hooks; every request goes through `client/src/api.ts`.
- Commit messages: `type(scope): summary`, for example `fix(availability): treat back-to-back as free`.
