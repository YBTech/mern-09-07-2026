# Architecture

One Express app (`src/app.ts`), one process, no database: data lives in in-memory maps.

```
request -> routes -> controllers -> services -> repositories -> in-memory Map
                          |
                   validation.ts (parse + validate the body)
```

| Layer        | Folder             | Job                                              |
| ------------ | ------------------ | ------------------------------------------------ |
| Routes       | `src/routes`       | Map URL + method to a controller, add middleware |
| Controllers  | `src/controllers`  | Parse the request, call a service, send the JSON |
| Services     | `src/services`     | Business logic; throws `AppError` subclasses     |
| Repositories | `src/repositories` | The only code that touches the stored data       |
| Middleware   | `src/middleware`   | Logging, admin check, error handler              |

Errors: services throw (`NotFoundError`, `ConflictError`, ...); `middleware/error-handler.ts`
turns them into JSON `{ "error": "message" }` with the right status code.
