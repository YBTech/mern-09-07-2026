---
name: new-endpoint
description: Scaffold a new REST endpoint across every layer of this project, with a test.
---

# New endpoint

Given a method, path, and behavior:

1. Add the service function in `src/services/<thing>.service.ts`.
2. Add a thin controller in `src/controllers/<thing>.controller.ts`.
3. Add input parsing to `src/validation.ts` if the endpoint takes a body or query.
4. Add the route in `src/routes/<thing>.routes.ts` and mount the router in `src/app.ts` if it is new.
5. Add tests in `tests/` (happy path and each error).
6. Run `npm test` and `npm run typecheck`.
